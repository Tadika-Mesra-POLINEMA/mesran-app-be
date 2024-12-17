import { Injectable } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { PrismaService } from 'src/common/prisma.service';
import { Event } from '@prisma/client';

@Injectable()
export class EventNotificationService {
  constructor(
    private notificationGateway: NotificationGateway,
    private prismaService: PrismaService,
  ) {}

  async cancelEventNotification(event: Event): Promise<void> {
    const eventParticipants =
      await this.prismaService.eventParticipant.findMany({
        where: {
          event_id: event.id,
        },
      });

    eventParticipants.forEach(async (participant) => {
      await this.prismaService.eventNotification.create({
        data: {
          event: {
            connect: {
              id: event.id,
            },
          },
          recipient: {
            connect: {
              id: participant.user_id,
            },
          },
          content: `Event ${event.name} has been canceled!`,
          type: 'ALERT',
        },
      });

      this.notificationGateway.sendNotificationToClient(participant.user_id, {
        message: `Event ${event.name} has been canceled!`,
        type: 'ALERT',
      });
    });
  }

  async notifyEvent(event: Event): Promise<void> {
    const eventParticipants =
      await this.prismaService.eventParticipant.findMany({
        where: {
          event_id: event.id,
        },
      });

    eventParticipants.forEach(async (participant) => {
      await this.prismaService.eventNotification.create({
        data: {
          event: {
            connect: {
              id: event.id,
            },
          },
          recipient: {
            connect: {
              id: participant.user_id,
            },
          },
          content: `Event ${event.name} is coming soon!\nStart at ${new Date(
            event.event_start,
          ).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}\nDon't forget to prepare yourself!`,
          type: 'REMINDER',
        },
      });

      this.notificationGateway.sendNotificationToClient(participant.user_id, {
        message: `Event ${event.name} is coming soon!\nStart at ${new Date(
          event.event_start,
        ).toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}\nDon't forget to prepare yourself!`,
        type: 'REMINDER',
      });
    });
  }
}
