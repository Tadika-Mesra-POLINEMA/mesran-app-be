import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InvariantException } from 'src/common/exceptions/invariant.exception';
import { PrismaService } from 'src/common/prisma.service';
import { Logger } from 'winston';
import { CreateParticipantResponse } from './dto/create-participant.dto';
import { NotfoundException } from 'src/common/exceptions/notfound.exception';
import { Participant } from './entity/participant.entity';
import { ParticipantNotificationService } from 'src/notification/participant.notification.service';

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
      this.participantNotificationService.joinedParticipantNotification(
        event,
        userId,
      );
    }

    return {
      participantId: createdParticipant.id,
    };
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

    return participants.filter(
      (participant) => participant.user_id != event.user_id,
    );
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

    this.participantNotificationService.acceptedParticipantNotification(
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

    this.participantNotificationService.declineParticipantNotification(
      event.event,
      event.user_id,
    );

    this.logger.info('Participant declined');
  }
}
