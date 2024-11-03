import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { Logger } from 'winston';
import { CreateActivityDto, CreatedActivity } from './dto/create-activity.dto';
import { ActivityValidator } from './activity.validator';

@Injectable()
export class ActivityService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async create(
    activityDto: CreateActivityDto,
    eventId: string,
  ): Promise<CreatedActivity> {
    this.logger.info('Creating activity', { activityDto });

    const createdActivity = await this.prismaService.eventActivity.create({
      data: {
        ...activityDto,
        event: {
          connect: {
            id: eventId,
          },
        },
      },
    });

    this.logger.info('Activity created', { createdActivity });

    return createdActivity;
  }

  async createMany(
    activitiesDto: CreateActivityDto[],
    eventId: string,
  ): Promise<CreatedActivity[]> {
    this.logger.info('Creating activities', { activitiesDto });

    const activities = activitiesDto.map((activity) => ({
      ...activity,
      event_id: eventId,
    }));

    await this.prismaService.eventActivity.createMany({
      data: activities,
    });

    const createdActivities = await this.prismaService.eventActivity.findMany({
      where: {
        event_id: eventId,
      },
    });

    this.logger.info('Activities created', { createdActivities });

    return createdActivities;
  }
}
