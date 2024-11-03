import { CreateActivityDto } from '../activity/dto/create-activity.dto';

export class CreateEventDto {
  name: string;
  description: string;
  target_date: Date;
  location: string;
  event_start: Date;
  event_end: Date;
  cover: {
    color: string;
    type: string;
  };
  dress: string;
  theme: string;
  activities: CreateActivityDto[];
}

export class CreatedEvent {
  id: string;
  name: string;
  description: string;
  target_date: Date;
  location: string;
  event_start: Date;
  event_end: Date;
  cover_color: string;
  cover_type: string;
  dress: string;
  theme: string;
}
