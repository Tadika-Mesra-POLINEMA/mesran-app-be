import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CreatedEvent, CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

// Services
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { EventValidator } from './event.validator';
import { Event } from './entities/event.entity';

@Injectable()
export class EventService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
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
  async findAll(): Promise<Event[]> {
    this.logger.info('Finding all events');

    const events = await this.prismaService.event.findMany({
      include: {
        owner: {
          select: {
            email: true,
            phone: true,
            profile: true,
          },
        },
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
  async findByUserId(userId: string): Promise<Event[]> {
    this.logger.info('Finding events by user id', { userId });

    const events = await this.prismaService.event.findMany({
      where: {
        user_id: userId,
      },
      include: {
        owner: {
          select: {
            email: true,
            phone: true,
            profile: true,
          },
        },
        participants: true,
        activities: true,
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
  async findOne(eventId: string): Promise<Event> {
    this.logger.info('Finding event', { eventId });

    const event = await this.prismaService.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        owner: {
          select: {
            email: true,
            phone: true,
            profile: true,
          },
        },
        participants: true,
        activities: true,
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
