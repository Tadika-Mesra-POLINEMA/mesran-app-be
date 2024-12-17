import { z, ZodType } from 'zod';

export class UserValidator {
  static readonly REGISTER: ZodType = z.object({
    name: z
      .string()
      .min(3, {
        message: 'Name at least 3 character.',
      })
      .max(50, {
        message: 'Maximum name is 50 character.',
      }),
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

  static readonly PROFILE: ZodType = z.object({
    username: z
      .string()
      .min(1, { message: 'Username field is required.' })
      .max(50, { message: 'Maximum username length is 50 character.' }),
    firstname: z
      .string()
      .min(1, { message: 'Firstname field is required.' })
      .max(50, { message: 'Maximum firstname length is 50 character.' }),
    lastname: z
      .string()
      .min(1, { message: 'Lastname field is required.' })
      .max(50, { message: 'Maximum lastname length is 50 character.' }),
  });

  static readonly UPDATE_USER: ZodType = z.object({
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
    password_before: z
      .string()
      .min(8, {
        message: 'Password at least 8 character.',
      })
      .max(20, {
        message: 'Maximum password is 20 character.',
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

  static readonly UPDATE_PROFILE: ZodType = z.object({
    name: z
      .string()
      .max(50, { message: 'Maximum name length is 100 character' }),
    phone: z
      .string()
      .min(1, {
        message: 'Phone field is required.',
      })
      .max(13, {
        message: 'Maximum phone number length is 13 character.',
      }),
  });
}
