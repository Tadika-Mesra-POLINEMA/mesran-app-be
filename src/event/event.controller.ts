import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
  Put,
} from '@nestjs/common';
import { EventService } from './event.service';

// Dtos
import { AuthenticatedRequest, Role, WebResponse } from 'src/app.dto';
import { CreateEventDto } from './dto/create-event.dto';

// Guards
import { AuthGuard } from 'src/auth/auth.guard';
import { ActivityService } from './activity/activity.service';
import { ValidationService } from 'src/common/validation.service';

// Validators
import { EventValidator } from './event.validator';
import { ActivityValidator } from './activity/activity.validator';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UpdateEventDto } from './dto/update-event.dto';
import { VerifyEventOwnerGuard } from './guard/verify-owner.guard';
import { ManyEventDto, SingleEventDto } from './dto/get-event.dto';
import { EventWithDetail } from './entities/event.entity';
import { ParticipantService } from './participant/participant.service';
import { InviteEventResponseDto } from './dto/invite-event.dto';

@Controller('/api/events')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly activityService: ActivityService,
    private readonly participantService: ParticipantService,
    private validationService: ValidationService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Request() request: AuthenticatedRequest,
    @Body() createEventDto: CreateEventDto,
  ): Promise<WebResponse<any>> {
    const userId: string = request.user.id;

    const createEventRequest = this.validationService.validate(
      EventValidator.CREATE_EVENT,
      createEventDto,
    );

    const createdEvent = await this.eventService.create(
      createEventRequest,
      userId,
    );

    if (createEventDto.activities.length > 0) {
      const createActivityRequest = this.validationService.validate(
        ActivityValidator.CREATE_ACTIVITIES,
        createEventDto.activities,
      );

      await this.activityService.createMany(
        createActivityRequest,
        createdEvent.id,
      );
    }

    await this.participantService.add(createdEvent.id, userId, true);

    return {
      status: 'success',
      message: 'Event created successfully',
      data: {
        event: createdEvent,
      },
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get(':eventId/invitation')
  async invite(
    @Param('eventId') eventId: string,
  ): Promise<WebResponse<InviteEventResponseDto>> {
    const invitation = await this.eventService.eventInvite(eventId);

    return {
      status: 'success',
      message: 'Invitation sent successfully',
      data: invitation,
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Get('all')
  async getAllEvent(): Promise<WebResponse<ManyEventDto<EventWithDetail>>> {
    const events = await this.eventService.findAll();

    return {
      status: 'success',
      message: 'Events retrieved successfully',
      data: {
        events,
      },
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  @UseGuards(AuthGuard)
  @Get('me')
  async getEventByUser(
    @Request() request: AuthenticatedRequest,
  ): Promise<WebResponse<ManyEventDto<EventWithDetail>>> {
    const userId = request.user.id;

    const events = await this.eventService.findByUserId(userId);

    return {
      status: 'success',
      message: 'Events retrieved successfully',
      data: {
        events,
      },
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get(':id')
  async getEventById(
    @Request() request: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<WebResponse<SingleEventDto<EventWithDetail>>> {
    const event = await this.eventService.findOne(request.user.id, id);

    return {
      status: 'success',
      message: 'Event retrieved successfully',
      data: {
        event,
      },
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(VerifyEventOwnerGuard)
  @UseGuards(AuthGuard)
  @Put(':eventId')
  async updateEvent(
    @Body() updateEventDto: UpdateEventDto,
    @Param('eventId') eventId: string,
  ): Promise<WebResponse<null>> {
    const updateEventRequest = this.validationService.validate(
      EventValidator.UPDATE_EVENT,
      updateEventDto,
    );

    await this.eventService.update(updateEventRequest, eventId);

    return {
      status: 'success',
      message: 'Event updated successfully',
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(VerifyEventOwnerGuard)
  @UseGuards(AuthGuard)
  @Delete(':eventId/cancel')
  async cancelEvent(
    @Param('eventId') eventId: string,
  ): Promise<WebResponse<null>> {
    await this.eventService.cancel(eventId);

    return {
      status: 'success',
      message: 'Event cancelled successfully',
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(VerifyEventOwnerGuard)
  @UseGuards(RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(AuthGuard)
  @Delete(':eventId')
  async deleteEvent(
    @Param('eventId') eventId: string,
  ): Promise<WebResponse<null>> {
    await this.eventService.delete(eventId);

    return {
      status: 'success',
      message: 'Event deleted successfully',
    };
  }
}
