import { Injectable } from '@nestjs/common';
import { EventNotification } from '@prisma/client';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prismaService: PrismaService) {}

  async findAll(userId: string): Promise<EventNotification[]> {
    return this.prismaService.eventNotification.findMany({
      where: {
        recipient_id: userId,
      },
      include: {
        event: true,
        sender: {
          include: {
            profile: true,
          },
        },
        recipient: {
          include: {
            profile: true,
          },
        },
      },
    });
  }
}
