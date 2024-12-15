import { Module } from '@nestjs/common';
import { ParticipantController } from './participant.controller';
import { ParticipantService } from './participant.service';
import { JwtModule } from '@nestjs/jwt';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  controllers: [ParticipantController],
  providers: [ParticipantService],
  exports: [ParticipantService],
  imports: [JwtModule, NotificationModule],
})
export class ParticipantModule {}
