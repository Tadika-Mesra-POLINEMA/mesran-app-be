import { Activity } from '../activity/entities/activity.entity';

export class Event {
  id: string;
  name: string;
  description: string;
  target_date: Date;
  location: string;
  event_start: Date;
  event_end: Date;
  dress: string;
  theme: string;
}

export class EventWithDetail extends Event {
  owner: {
    id: string;
    email: string;
    phone: string;
  };
  participants: any[]; // assume it's any for now
  activities: Activity[];
}
