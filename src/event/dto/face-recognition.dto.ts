import { User } from 'src/user/entities/user.entity';

export class FaceRecognitionResponseDto {
  is_match: boolean;
  confidence: number;
  user?: User;
}
