import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { AuthenticatedRequest, Role, WebResponse } from 'src/app.dto';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { CreateParticipantResponse } from './dto/create-participant.dto';
import { VerifyEventOwnerGuard } from '../guard/verify-owner.guard';
import { Participant } from './entity/participant.entity';
import { ParticipantAttendance } from './dto/participant-attendance.dto';

@Controller('/api/events/:eventId/participants')
export class ParticipantController {
  constructor(private participantService: ParticipantService) {}

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  @UseGuards(AuthGuard)
  @Post('join')
  async join(
    @Param('eventId') eventId: string,
    @Request() request: AuthenticatedRequest,
  ): Promise<WebResponse<CreateParticipantResponse>> {
    const response = await this.participantService.add(
      eventId,
      request.user.id,
    );

    return {
      status: 'success',
      message: 'Participant added',
      data: response,
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get()
  async participants(
    @Param('eventId') eventId: string,
  ): Promise<WebResponse<Participant[]>> {
    const participants = await this.participantService.getParticipants(eventId);

    return {
      status: 'success',
      message: "Successfully get event's participants",
      data: participants,
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('attendance')
  async getAttendance(
    @Param('eventId') eventId: string,
  ): Promise<WebResponse<ParticipantAttendance>> {
    const { attends, not_yet_attends } =
      await this.participantService.getParticipantAttendance(eventId);

    return {
      status: 'success',
      message: 'Successfully get attendance',
      data: {
        attends,
        not_yet_attends,
      },
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(VerifyEventOwnerGuard)
  @UseGuards(AuthGuard)
  @Post(':userId/accept')
  async accept(
    @Param('eventId') eventId: string,
    @Param('userId') userId: string,
  ): Promise<WebResponse<void>> {
    const participantId = await this.participantService.getParticipantId(
      eventId,
      userId,
    );
    await this.participantService.accept(participantId);

    return {
      status: 'success',
      message: 'Participant accepted',
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(VerifyEventOwnerGuard)
  @UseGuards(AuthGuard)
  @Delete(':userId/decline')
  async decline(
    @Param('eventId') eventId: string,
    @Param('userId') userId: string,
  ) {
    const participantId = await this.participantService.getParticipantId(
      eventId,
      userId,
    );
    await this.participantService.decline(participantId);

    return {
      status: 'success',
      message: 'Participant declined',
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  @UseGuards(AuthGuard)
  @Put(':userId/attend')
  async attend(
    @Param('eventId') eventId: string,
    @Param('userId') userId: string,
  ): Promise<WebResponse<null>> {
    const participantId = await this.participantService.getParticipantId(
      eventId,
      userId,
    );
    await this.participantService.attend(participantId);

    return {
      status: 'success',
      message: 'Participant attended',
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  @UseGuards(AuthGuard)
  @Put(':userId/absent')
  async absence(
    @Param('eventId') eventId: string,
    @Param('userId') userId: string,
  ): Promise<WebResponse<null>> {
    const participantId = await this.participantService.getParticipantId(
      eventId,
      userId,
    );

    await this.participantService.absence(participantId);

    return {
      status: 'success',
      message: 'Participant absent',
    };
  }
}
