import { User } from 'src/user/entities/user.entity';
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
  owner: User;
  participants: any[]; // assume it's any for now
  activities: Activity[];
}
