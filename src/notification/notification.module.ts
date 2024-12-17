import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { ParticipantNotificationService } from './participant.notification.service';
import { EventNotificationService } from './event.notification.service';
import { JwtModule } from '@nestjs/jwt';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  providers: [
    NotificationGateway,
    NotificationService,
    EventNotificationService,
    ParticipantNotificationService,
  ],
  exports: [
    NotificationGateway,
    EventNotificationService,
    ParticipantNotificationService,
  ],
  imports: [
    JwtModule.register({
      secret: process.env.TOKEN_SECRET,
    }),
  ],
  controllers: [NotificationController],
})
export class NotificationModule {}
