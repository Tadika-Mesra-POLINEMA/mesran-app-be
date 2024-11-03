import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CreatedEvent, CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

// Services
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { EventValidator } from './event.validator';

@Injectable()
export class EventService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

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
        cover_color: createEventDto.cover?.color,
        cover_type: createEventDto.cover?.type,

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
}
