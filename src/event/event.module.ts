import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { JwtModule } from '@nestjs/jwt';
import { ActivityModule } from './activity/activity.module';
import { ParticipantModule } from './participant/participant.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [EventController],
  providers: [EventService],
  imports: [
    JwtModule,
    ActivityModule,
    ParticipantModule,
    HttpModule.register({
      baseURL: process.env.MACHINE_LEARNING_BASE_URL,
    }),
  ],
})
export class EventModule {}
