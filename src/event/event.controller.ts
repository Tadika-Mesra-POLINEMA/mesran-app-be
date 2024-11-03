import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { EventService } from './event.service';

// Dtos
import { AuthenticatedRequest, WebResponse } from 'src/app.dto';
import { CreateEventDto } from './dto/create-event.dto';

// Guards
import { AuthGuard } from 'src/auth/auth.guard';
import { ActivityService } from './activity/activity.service';
import { ValidationService } from 'src/common/validation.service';

// Validators
import { EventValidator } from './event.validator';
import { ActivityValidator } from './activity/activity.validator';

@Controller('/api/events')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly activityService: ActivityService,
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

    const createActivityRequest = this.validationService.validate(
      ActivityValidator.CREATE_ACTIVITIES,
      createEventDto.activities,
    );

    await this.activityService.createMany(
      createActivityRequest,
      createdEvent.id,
    );

    return {
      status: 'success',
      message: 'Event created successfully',
      data: createdEvent,
    };
  }
}
