import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { JwtModule } from '@nestjs/jwt';
import { ActivityModule } from './activity/activity.module';
import { ParticipantModule } from './participant/participant.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  controllers: [EventController],
  providers: [EventService],
  imports: [JwtModule, ActivityModule, ParticipantModule, NotificationModule],
})
export class EventModule {}
