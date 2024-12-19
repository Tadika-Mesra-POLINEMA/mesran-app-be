import { z, ZodType } from 'zod';

export class EventValidator {
  static readonly CREATE_EVENT: ZodType = z
    .object({
      name: z
        .string()
        .min(3, {
          message: 'Event name must be at least 3 characters long',
        })
        .max(255, {
          message: 'Event name must be at most 255 characters long',
        }),
      description: z.string().min(5, {
        message: 'Event name must be at least 5 characters long',
      }),
      target_date: z
        .string()
        .datetime('yyyy-MM-dd HH:mm:ss')
        .refine(
          (val) => {
            const targetDate = new Date(val);
            const today = new Date();

            const targetDateOnly = new Date(
              targetDate.getFullYear(),
              targetDate.getMonth(),
              targetDate.getDate(),
            );
            const todayOnly = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
            );

            return targetDateOnly.getTime() >= todayOnly.getTime();
          },
          {
            message: 'Target date cannot be earlier than now.',
          },
        ),
      location: z.string().min(1, {
        message: 'Event location is required',
      }),
      event_start: z
        .string()
        .datetime('yyyy-MM-dd HH:mm:ss')
        .refine((val) => new Date(val) > new Date(), {
          message: 'Start date cannot be earlier than now.',
        }),
      dress: z.string().min(1, {
        message: 'Event dress code is required',
      }),
      theme: z.string().min(1, {
        message: 'Event theme is required',
      }),
    })
    .refine((data) => data.event_start > data.target_date, {
      message: 'Target date cannot be earlier than start date.',
      path: ['target_date'],
    });

  static readonly UPDATE_EVENT: ZodType = z
    .object({
      name: z
        .string()
        .min(3, {
          message: 'Event name must be at least 3 characters long',
        })
        .max(255, {
          message: 'Event name must be at most 255 characters long',
        }),
      description: z.string().min(5, {
        message: 'Event name must be at least 5 characters long',
      }),
      target_date: z
        .string()
        .datetime('yyyy-MM-dd HH:mm:ss')
        .refine(
          (val) => {
            const targetDate = new Date(val);
            const today = new Date();

            const targetDateOnly = new Date(
              targetDate.getFullYear(),
              targetDate.getMonth(),
              targetDate.getDate(),
            );
            const todayOnly = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
            );

            return targetDateOnly.getTime() >= todayOnly.getTime();
          },
          {
            message: 'Target date cannot be earlier than now.',
          },
        ),
      location: z.string().min(1, {
        message: 'Event location is required',
      }),
      event_start: z
        .string()
        .datetime('yyyy-MM-dd HH:mm:ss')
        .refine((val) => new Date(val) > new Date(), {
          message: 'Start date cannot be earlier than now.',
        }),
    })
    .refine((data) => data.event_start > data.target_date, {
      message: 'Target date cannot be earlier than start date.',
      path: ['target_date'],
    });
}
