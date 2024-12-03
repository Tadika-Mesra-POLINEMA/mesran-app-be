import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import * as FormData from 'form-data';
import { CreatedEvent, CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

// Services
import { PrismaService } from 'src/common/prisma.service';
import { EventWithDetail } from './entities/event.entity';
import { HttpService } from '@nestjs/axios';
import { FaceRecognitionResponseDto } from './dto/face-recognition.dto';

@Injectable()
export class EventService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private httpService: HttpService,
  ) {}

  /**
   * Create an event
   *
   * @param createEventDto Payload to create an event
   * @param userId User id used to create an event
   * @returns Created event
   */
  async create(
    createEventDto: CreateEventDto,
    userId: string,
  ): Promise<CreatedEvent> {
    this.logger.info('Creating event', { createEventDto });

    const createdEvent = await this.prismaService.event.create({
      data: {
        name: createEventDto.name,
        description: createEventDto.description,
        target_date: createEventDto.target_date,
        location: createEventDto.location,
        event_start: createEventDto.event_start,
        event_end: createEventDto.event_end,
        dress: createEventDto.dress,
        theme: createEventDto.theme,

        owner: {
          connect: {
            id: userId,
          },
        },
      },
    });

    this.logger.info('Event created', { createdEvent });

    return createdEvent;
  }

  /**
   * Find all events
   *
   * @returns Finded events
   */
  async findAll(): Promise<EventWithDetail[]> {
    this.logger.info('Finding all events');

    const events = await this.prismaService.event.findMany({
      include: {
        owner: true,
        participants: true,
        activities: true,
      },
    });

    this.logger.info('Events found', { events });

    return events;
  }

  /**
   * Find events by user id
   *
   * @param userId User id used to find their events
   * @returns Events found by user id
   */
  async findByUserId(userId: string): Promise<EventWithDetail[]> {
    this.logger.info('Finding events by user id', { userId });

    const events = await this.prismaService.event.findMany({
      where: {
        user_id: userId,
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            phone: true,
          },
        },
        participants: {
          where: {
            accepted: true,
          },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        activities: {
          select: {
            id: true,
            title: true,
            description: true,
            activity_start: true,
            activity_end: true,
          },
        },
      },
    });

    this.logger.info('Events found', { events });

    return events;
  }

  /**
   * Find an event
   *
   * @param eventId Event id to find
   * @returns Finded event
   */
  async findOne(eventId: string): Promise<EventWithDetail> {
    this.logger.info('Finding event', { eventId });

    const event = await this.prismaService.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            phone: true,
          },
        },
        participants: {
          where: {
            accepted: true,
          },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        activities: {
          select: {
            id: true,
            title: true,
            description: true,
            activity_start: true,
            activity_end: true,
          },
        },
      },
    });

    if (!event) throw new NotFoundException('Event not found');

    this.logger.info('Event found', { event });

    return event;
  }

  async verifyEventOwner(eventId: string, userId: string): Promise<boolean> {
    const event = await this.prismaService.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) throw new NotFoundException('Event not found');

    return event.user_id === userId;
  }

  /**
   * Verify face owner
   *
   * @param face Face image to verify
   */
  async verifyFaceOwner(
    face: Express.Multer.File,
  ): Promise<FaceRecognitionResponseDto> {
    this.logger.info('Verifying face owner');

    const formData = new FormData();
    formData.append('face', face.buffer, {
      filename: face.originalname,
      contentType: face.mimetype,
    });

    const response = await this.httpService.axiosRef.post(
      '/predict',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      },
    );

    const { user_id, confidence } = response.data;

    if (response.status !== 200) {
      this.logger.info('Face owner not verified');

      return {
        is_match: false,
        user: null,
        confidence,
      };
    }

    const user = await this.prismaService.user.findFirst({
      where: {
        id: user_id,
      },
    });

    return {
      is_match: true,
      user,
      confidence,
    };
  }

  /**
   * Update an event
   *
   * @param request Payload to update an event
   * @param eventId Event id to update
   */
  async update(request: UpdateEventDto, eventId: string): Promise<void> {
    this.logger.info('Updating event', { request });

    await this.prismaService.event.update({
      where: {
        id: eventId,
      },
      data: {
        name: request.name,
        description: request.description,
        target_date: request.target_date,
        location: request.location,
        event_start: request.event_start,
        event_end: request.event_end,
        dress: request.dress,
        theme: request.theme,
      },
    });

    this.logger.info('Event updated');
  }

  /**
   * Cancel an event
   *
   * @param eventId Event id to cancel
   */
  async cancel(eventId: string): Promise<void> {
    this.logger.info('Cancelling event', { eventId });

    await this.prismaService.event.update({
      where: {
        id: eventId,
      },
      data: {
        is_canceled: true,
      },
    });

    this.logger.info('Event cancelled');
  }

  /**
   * Delete an event
   *
   * @param eventId Event id to delete
   */
  async delete(eventId: string): Promise<void> {
    this.logger.info('Deleting event', { eventId });

    await this.prismaService.event.delete({
      where: {
        id: eventId,
      },
    });

    this.logger.info('Event deleted');
  }
}
