import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from './prisma.service';
import { EventNotificationService } from 'src/notification/event.notification.service';

@Injectable()
export class CronService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private eventNotificationService: EventNotificationService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.info('Notify user about the event');

    const twoDayLater = new Date();
    twoDayLater.setDate(twoDayLater.getDate() + 2);

    const threeDaysLater = new Date();
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);

    const events = await this.prismaService.event.findMany({
      where: {
        target_date: {
          gte: twoDayLater,
          lte: threeDaysLater,
        },
      },
    });

    events.forEach((event) => {
      this.eventNotificationService.notifyEvent(event);
    });
  }
}
