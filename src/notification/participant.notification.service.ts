import { Injectable } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { PrismaService } from 'src/common/prisma.service';
import { Event } from '@prisma/client';

@Injectable()
export class ParticipantNotificationService {
  constructor(
    private notificationGateway: NotificationGateway,
    private prismaService: PrismaService,
  ) {}

  async joinedParticipantNotification(
    event: Event,
    senderId: string,
  ): Promise<void> {
    const sender = await this.prismaService.user
      .findFirst({
        where: {
          id: senderId,
        },
        include: {
          profile: true,
        },
      })
      .then((user) => {
        delete user.password;
        return user;
      });

    this.prismaService.notification.create({
      data: {
        recipient: {
          connect: {
            id: event.user_id,
          },
        },
        sender: {
          connect: {
            id: senderId,
          },
        },
        content: `akan menghadiri acara "${event.name}" Anda!`,
        type: 'CONFIRMATION',
      },
    });

    this.notificationGateway.sendNotificationToClient(event.user_id, {
      sender,
      message: `${sender.profile.firstname} akan menghadiri acara "${event.name}" Anda!`,
      type: 'CONFIRMATION',
    });
  }

  async acceptedParticipantNotification(
    event: Event,
    recipientId: string,
  ): Promise<void> {
    const sender = await this.prismaService.user.findFirst({
      where: {
        id: event.user_id,
      },
      include: {
        profile: true,
      },
    });

    const recipient = await this.prismaService.user
      .findFirst({
        where: {
          id: recipientId,
        },
        include: {
          profile: true,
        },
      })
      .then((user) => {
        delete user.password;
        return user;
      });

    await this.prismaService.notification.create({
      data: {
        recipient: {
          connect: {
            id: recipient.id,
          },
        },
        sender: {
          connect: {
            id: sender.id,
          },
        },
        content: `menerima Anda dalam acara "${event.name}"`,
        type: 'MESSAGE',
      },
    });

    this.notificationGateway.sendNotificationToClient(recipientId, {
      sender,
      message: `${sender.profile.firstname} menerima Anda dalam acara "${event.name}"`,
      type: 'MESSAGE',
    });
  }

  async declineParticipantNotification(
    event: Event,
    recipientId: string,
  ): Promise<void> {
    const sender = await this.prismaService.user.findFirst({
      where: {
        id: event.user_id,
      },
      include: {
        profile: true,
      },
    });

    const recipient = await this.prismaService.user
      .findFirst({
        where: {
          id: recipientId,
        },
        include: {
          profile: true,
        },
      })
      .then((user) => {
        delete user.password;
        return user;
      });

    await this.prismaService.notification.create({
      data: {
        recipient: {
          connect: {
            id: recipient.id,
          },
        },
        sender: {
          connect: {
            id: sender.id,
          },
        },
        content: `menolak Anda dalam acara "${event.name}"`,
        type: 'MESSAGE',
      },
    });

    this.notificationGateway.sendNotificationToClient(recipientId, {
      sender,
      message: `${sender.profile.firstname} menolak Anda dalam acara "${event.name}"`,
      type: 'MESSAGE',
    });
  }
}
