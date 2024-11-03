import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { JwtModule } from '@nestjs/jwt';
import { ActivityModule } from './activity/activity.module';

@Module({
  controllers: [EventController],
  providers: [EventService],
  imports: [JwtModule, ActivityModule],
})
export class EventModule {}
