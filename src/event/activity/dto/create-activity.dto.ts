export class CreateActivityDto {
  title: string;
  description: string;
  activity_start: Date;
  activity_end: Date;
}

export class CreatedActivity {
  id: string;
  title: string;
  description: string;
  activity_start: Date;
  activity_end: Date;
  created_at: Date;
  updated_at: Date;
}
