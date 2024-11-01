import { z, ZodType } from 'zod';

export class UserValidator {
  static readonly REGISTER: ZodType = z.object({
    email: z
      .string()
      .email({
        message: 'Email not valid type.',
      })
      .min(1, {
        message: 'Email field is required.',
      })
      .max(100, {
        message: 'Maximum email length is 100 character.',
      }),
    phone: z.string().max(13, {
      message: 'Maximum phone number length is 13 character.',
    }),
    password: z
      .string()
      .min(8, {
        message: 'Password at least 8 character.',
      })
      .max(20, {
        message: 'Maximum password is 20 character.',
      }),
  });
}
