import { User, NotificationType } from '@prisma/client';

export interface NotificationData {
  sender?: User;
  message: string;
  type: NotificationType;
}
