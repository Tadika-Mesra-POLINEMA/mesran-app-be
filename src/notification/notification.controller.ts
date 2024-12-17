import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthenticatedRequest, WebResponse } from 'src/app.dto';
import { EventNotification } from '@prisma/client';

@Controller('/api/notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get()
  async findAll(
    @Request() request: AuthenticatedRequest,
  ): Promise<WebResponse<EventNotification[]>> {
    const userId = request.user.id;

    const notifications = await this.notificationService.findAll(userId);

    return {
      status: 'success',
      message: 'Notifications retrieved successfully',
      data: notifications,
    };
  }
}
