import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
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
  @UseGuards(VerifyEventOwnerGuard)
  @UseGuards(AuthGuard)
  @Post(':participantId/accept')
  async accept(
    @Param('participantId') participantId: string,
  ): Promise<WebResponse<void>> {
    await this.participantService.accept(participantId);

    return {
      status: 'success',
      message: 'Participant accepted',
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(VerifyEventOwnerGuard)
  @UseGuards(AuthGuard)
  @Delete(':participantId/decline')
  async decline(@Param('participantId') participantId: string) {
    await this.participantService.decline(participantId);

    return {
      status: 'success',
      message: 'Participant declined',
    };
  }
}
