import { Participant } from '../entity/participant.entity';

export interface ParticipantAttendance {
  attends: Participant[];
  not_yet_attends: Participant[];
}
