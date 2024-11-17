import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateActivityDto, CreatedActivity } from './dto/create-activity.dto';
import { WebResponse } from 'src/app.dto';
import { ValidationService } from 'src/common/validation.service';
import { ActivityValidator } from './activity.validator';
import { VerifyEventOwnerGuard } from '../guard/verify-owner.guard';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Controller('api/events/:eventId/activities')
export class ActivityController {
  constructor(
    private activityService: ActivityService,
    private validationService: ValidationService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  @Post()
  async createActivity(
    @Body() request: CreateActivityDto,
    @Param('eventId') eventId: string,
  ): Promise<WebResponse<CreatedActivity>> {
    const createActivityRequest = this.validationService.validate(
      ActivityValidator.CREATE_ACTIVITY,
      request,
    );

    const createdActivity = await this.activityService.create(
      createActivityRequest,
      eventId,
    );

    return {
      status: 'success',
      message: 'Activity created successfully',
      data: createdActivity,
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get()
  async getActivityByEvent(@Param('eventId') eventId: string) {
    const activities = await this.activityService.findByEvent(eventId);

    return {
      status: 'success',
      message: 'Activities found',
      data: activities,
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(VerifyEventOwnerGuard)
  @UseGuards(AuthGuard)
  @Put(':activityId')
  async updateActivity(
    @Body() updateActivityDto: UpdateActivityDto,
    @Param('activityId') activityId: string,
  ): Promise<WebResponse<null>> {
    const updateActivityRequest = this.validationService.validate(
      ActivityValidator.UPDATE_ACTIVITY,
      updateActivityDto,
    );

    await this.activityService.update(activityId, updateActivityRequest);

    return {
      status: 'success',
      message: 'Activity updated successfully',
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(VerifyEventOwnerGuard)
  @UseGuards(AuthGuard)
  @Delete(':activityId')
  async deleteActivity(@Param('activityId') activityId: string) {
    await this.activityService.delete(activityId);

    return {
      status: 'success',
      message: 'Activity deleted successfully',
    };
  }
}
