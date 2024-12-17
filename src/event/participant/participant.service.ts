import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InvariantException } from 'src/common/exceptions/invariant.exception';
import { PrismaService } from 'src/common/prisma.service';
import { Logger } from 'winston';
import { CreateParticipantResponse } from './dto/create-participant.dto';
import { NotfoundException } from 'src/common/exceptions/notfound.exception';
import { Participant } from './entity/participant.entity';
import { ParticipantNotificationService } from 'src/notification/participant.notification.service';
import { ParticipantAttendance } from './dto/participant-attendance.dto';

@Injectable()
export class ParticipantService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private participantNotificationService: ParticipantNotificationService,
  ) {}

  /**
   * Joining participant to an event
   *
   * @param eventId Event id to add a participant
   * @param userId User id to add a participant
   * @param _isAccepted Is participant accepted or not
   */
  async add(
    eventId: string,
    userId: string,
    _isAccepted: boolean = false,
  ): Promise<CreateParticipantResponse> {
    this.logger.info('Adding a participant');

    const event = await this.prismaService.event.findFirst({
      where: {
        id: eventId,
      },
    });

    if (!event) throw new NotfoundException('Event not found');

    const isJoinedEvent = await this.prismaService.eventParticipant.findFirst({
      where: {
        event_id: eventId,
        user_id: userId,
      },
    });

    if (isJoinedEvent)
      throw new InvariantException('User already joined event');

    const createdParticipant = await this.prismaService.eventParticipant.create(
      {
        data: {
          accepted: _isAccepted,
          event: {
            connect: {
              id: eventId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      },
    );

    this.logger.info('Participant added');

    if (!_isAccepted) {
      await this.participantNotificationService.joinedParticipantNotification(
        event,
        userId,
      );
    }

    return {
      participantId: createdParticipant.id,
    };
  }

  /**
   * Attending participant to an event
   *
   * @param participantId Participant ID to attend the participant
   */
  async attend(participantId: string): Promise<void> {
    await this.prismaService.eventParticipant.update({
      where: {
        id: participantId,
      },
      data: {
        is_attended: true,
      },
    });
  }

  /**
   * Absence participant to an event
   *
   * @param participantId Participant ID to absence the participant
   */
  async absence(participantId: string): Promise<void> {
    await this.prismaService.eventParticipant.update({
      where: {
        id: participantId,
      },
      data: {
        is_attended: false,
      },
    });
  }

  /**
   * Get participant ID
   *
   * @param eventId Event ID to get participant ID
   * @param userId User ID to get participant ID
   */
  async getParticipantId(eventId: string, userId: string): Promise<string> {
    return this.prismaService.eventParticipant
      .findFirst({
        where: {
          event_id: eventId,
          user_id: userId,
        },
      })
      .then((response) => response.id);
  }

  /**
   * Get all participants
   *
   * @param eventId Event ID to get all participants
   */
  async getParticipants(eventId: string): Promise<Participant[]> {
    this.logger.info('Getting all participants');

    const event = await this.prismaService.event.findFirst({
      where: {
        id: eventId,
      },
    });

    if (!event) throw new NotfoundException('Event not found');

    const participants = await this.prismaService.eventParticipant.findMany({
      where: {
        event_id: eventId,
        user_id: { not: event.user_id },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            profile: {
              select: {
                username: true,
                firstname: true,
                lastname: true,
              },
            },
          },
        },
      },
    });

    this.logger.info('Participants retrieved');

    return participants;
  }

  /**
   * Get participant attendance
   *
   * @param eventId Event ID to get participant attendance
   */
  async getParticipantAttendance(
    eventId: string,
  ): Promise<ParticipantAttendance> {
    this.logger.info('Getting participant attendance');

    const event = await this.prismaService.event.findFirst({
      where: {
        id: eventId,
      },
    });

    if (!event) throw new NotfoundException('Event not found');

    const participants = await this.prismaService.eventParticipant.findMany({
      where: {
        event_id: eventId,
        user_id: { not: event.user_id },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            profile: {
              select: {
                username: true,
                firstname: true,
                lastname: true,
              },
            },
          },
        },
      },
      orderBy: {
        user: {
          profile: {
            firstname: 'asc',
          },
        },
      },
    });

    this.logger.info('Participant attendance retrieved');

    return {
      attends: participants.filter((participant) => participant.is_attended),
      not_yet_attends: participants.filter(
        (participant) => !participant.is_attended,
      ),
    };
  }

  /**
   * Accepting participant request to join an event
   *
   * @param participantId Participant ID to accept the participant
   */
  async accept(participantId: string) {
    this.logger.info('Accepting a participant');

    const event = await this.prismaService.eventParticipant.findFirst({
      where: {
        id: participantId,
      },
      include: {
        event: true,
      },
    });

    if (!event)
      throw new InvariantException('User is not a participant of the event');

    const isAlreadyAccepted =
      await this.prismaService.eventParticipant.findFirst({
        where: {
          id: participantId,
          accepted: true,
        },
      });

    if (isAlreadyAccepted)
      throw new InvariantException('Participant already accepted');

    await this.prismaService.eventParticipant.update({
      where: {
        id: participantId,
      },
      data: {
        accepted: true,
      },
    });

    await this.prismaService.event.update({
      where: {
        id: event.event_id,
      },
      data: {
        member_count: {
          increment: 1,
        },
      },
    });

    await this.prismaService.eventNotification.deleteMany({
      where: {
        event_id: event.id,
        recipient_id: event.event.user_id,
      },
    });

    await this.participantNotificationService.acceptedParticipantNotification(
      event.event,
      event.user_id,
    );

    this.logger.info('Participant accepted');
  }

  /**
   * Decline participant request to join an event
   *
   * @param participantId Participant ID to decline the participant
   */
  async decline(participantId: string) {
    this.logger.info('Declining a participant');

    const event = await this.prismaService.eventParticipant.findFirst({
      where: {
        id: participantId,
      },
      include: {
        event: true,
      },
    });

    if (!event)
      throw new InvariantException('User is not a participant of the event');

    await this.prismaService.eventParticipant.update({
      where: {
        id: participantId,
      },
      data: {
        declined: true,
      },
    });

    await this.prismaService.eventNotification.deleteMany({
      where: {
        event_id: event.event_id,
        recipient_id: event.event.user_id,
      },
    });

    await this.participantNotificationService.declineParticipantNotification(
      event.event,
      event.user_id,
    );

    this.logger.info('Participant declined');
  }
}
