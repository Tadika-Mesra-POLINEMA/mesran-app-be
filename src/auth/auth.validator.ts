import { z, ZodType } from 'zod';

export class AuthValidator {
  static readonly LOGIN: ZodType = z.union([
    z.object({
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
      password: z
        .string()
        .min(8, {
          message: 'Password at least 8 character.',
        })
        .max(20, {
          message: 'Maximum password is 20 character.',
        }),
    }),
    z.object({
      phone: z
        .string()
        .min(1, {
          message: 'Phone number is required.',
        })
        .max(13, {
          message: 'Maximum phone number is 13 character.',
        }),
      password: z
        .string()
        .min(8, {
          message: 'Password at least 8 character.',
        })
        .max(20, {
          message: 'Maximum password is 20 character.',
        }),
    }),
  ]);

  static readonly VERIFY_LOGIN: ZodType = z.object({
    verificationKey: z.string().min(1, {
      message: 'Verification key is required.',
    }),
    otp: z.string().min(6, {
      message: 'OTP must be 6 character.',
    }),
  });

  static readonly REFRESH: ZodType = z.object({
    refreshToken: z.string().min(1, {
      message: 'Refresh token is required.',
    }),
  });

  static readonly LOGOUT: ZodType = z.object({
    refreshToken: z.string().min(1, {
      message: 'Refresh token is required.',
    }),
  });
}
