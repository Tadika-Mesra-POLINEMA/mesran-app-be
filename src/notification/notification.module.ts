import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { ParticipantNotificationService } from './participant.notification.service';
import { EventNotificationService } from './event.notification.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [
    NotificationGateway,
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
})
export class NotificationModule {}
