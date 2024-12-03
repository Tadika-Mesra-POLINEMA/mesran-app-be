import { z, ZodSchema } from 'zod';

export class ChatValidator {
  static readonly STORE_MESSAGE: ZodSchema = z.object({
    content: z.string().min(1, {
      message: 'Content is required',
    }),
    chatId: z.string().uuid({
      message: "Chat ID isn't valid",
    }),
    userId: z.string().uuid({
      message: "User ID isn't valid",
    }),
  });
}
