export class Participant {
  id: string;
  user_id: string;
  event_id: string;
  accepted: boolean;
  declined: boolean;
  participate_at: Date;
  user: {
    email: string;
    phone: string;
    profile: {
      username: string;
      firstname: string;
      lastname: string;
    };
  };
}
