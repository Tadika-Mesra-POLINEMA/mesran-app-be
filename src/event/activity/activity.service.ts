import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { Logger } from 'winston';
import { CreateActivityDto, CreatedActivity } from './dto/create-activity.dto';
import { Activity } from './entities/activity.entity';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivityService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  /**
   * Create an activity
   *
   * @param activityDto Payload to create an activity
   * @param eventId Event id used to create an activity
   * @returns Created activity
   */
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

  /**
   * Create many activities
   *
   * @param activitiesDto Payload to create activities
   * @param eventId Event id to create activities
   * @returns Created activities
   */
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

  /**
   * Find activities by event
   *
   * @param eventId Event id to find activities
   * @returns Activities found
   */
  async findByEvent(eventId: string): Promise<Activity[]> {
    this.logger.info('Finding activities by event', { eventId });

    const activities = await this.prismaService.eventActivity.findMany({
      where: {
        event_id: eventId,
      },
      orderBy: {
        activity_start: 'asc',
      },
    });

    this.logger.info('Activities found', { activities });

    return activities;
  }

  /**
   * Update an activity
   *
   * @param eventId Event id to update activity
   * @param updateActivityDto Payload to update activity
   */
  async update(
    activityId: string,
    updateActivityDto: UpdateActivityDto,
  ): Promise<void> {
    this.logger.info('Updating activity', { updateActivityDto });

    await this.prismaService.eventActivity.update({
      where: {
        id: activityId,
      },
      data: updateActivityDto,
    });

    this.logger.info('Activity updated');
  }

  /**
   * Delete an activity
   *
   * @param activityId Activity id to delete
   */
  async delete(activityId: string) {
    this.logger.info('Deleting activity', { activityId });

    await this.prismaService.eventActivity.delete({
      where: {
        id: activityId,
      },
    });

    this.logger.info('Activity deleted');
  }
}
