import { Activity } from '../activity/entities/activity.entity';
import { Participant } from '../participant/entity/participant.entity';

export class Event {
  id: string;
  name: string;
  description: string;
  target_date: Date;
  location: string;
  event_start: Date;
  dress: string;
  theme: string;
}

export class EventWithDetail extends Event {
  owner: {
    id: string;
    email: string;
    phone: string;
  };
  is_owner: boolean;
  participants: Participant[];
  activities: Activity[];
}
