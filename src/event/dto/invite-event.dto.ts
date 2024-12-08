export class InviteEventDto {
  eventId: string;
}

export class InviteEventResponseDto {
  name: string;
  target_date: Date;
  event_start: Date;
  location: string;
}
