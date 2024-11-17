import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InvariantException } from 'src/common/exceptions/invariant.exception';
import { PrismaService } from 'src/common/prisma.service';
import { Logger } from 'winston';
import { CreateParticipantResponse } from './dto/create-participant.dto';
import { NotfoundException } from 'src/common/exceptions/notfound.exception';

@Injectable()
export class ParticipantService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
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
  ): Promise<CreateParticipantResponse> {
    this.logger.info('Adding a participant');

    const isEventExist = await this.prismaService.event.findFirst({
      where: {
        id: eventId,
      },
    });

    if (!isEventExist) throw new NotfoundException('Event not found');

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

    return {
      participantId: createdParticipant.id,
    };
  }

  /**
   * Accepting participant request to join an event
   *
   * @param participantId Participant ID to accept the participant
   */
  async accept(participantId: string) {
    this.logger.info('Accepting a participant');

    const isJoinedEvent = await this.prismaService.eventParticipant.findFirst({
      where: {
        id: participantId,
      },
    });

    if (!isJoinedEvent)
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

    this.logger.info('Participant accepted');
  }

  /**
   * Decline participant request to join an event
   *
   * @param participantId Participant ID to decline the participant
   */
  async decline(participantId: string) {
    this.logger.info('Declining a participant');

    const isJoinedEvent = await this.prismaService.eventParticipant.findFirst({
      where: {
        id: participantId,
      },
    });

    if (!isJoinedEvent)
      throw new InvariantException('User is not a participant of the event');

    await this.prismaService.eventParticipant.delete({
      where: {
        id: participantId,
      },
    });

    this.logger.info('Participant declined');
  }
}
