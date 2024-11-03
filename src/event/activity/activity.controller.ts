import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateActivityDto, CreatedActivity } from './dto/create-activity.dto';
import { WebResponse } from 'src/app.dto';
import { ValidationService } from 'src/common/validation.service';
import { ActivityValidator } from './activity.validator';

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
    @Param(':eventId') eventId: string,
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
}
