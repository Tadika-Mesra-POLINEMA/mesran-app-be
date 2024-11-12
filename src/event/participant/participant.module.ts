import { Module } from '@nestjs/common';
import { ParticipantController } from './participant.controller';
import { ParticipantService } from './participant.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ParticipantController],
  providers: [ParticipantService],
  exports: [ParticipantService],
  imports: [JwtModule],
})
export class ParticipantModule {}
