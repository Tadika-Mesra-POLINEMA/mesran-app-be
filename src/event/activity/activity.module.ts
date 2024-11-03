import { Module } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { ActivityValidator } from './activity.validator';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ActivityController],
  providers: [ActivityService],
  exports: [ActivityService, ActivityValidator],
  imports: [JwtModule, ActivityValidator],
})
export class ActivityModule {}
