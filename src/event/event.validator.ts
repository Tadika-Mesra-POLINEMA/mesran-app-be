import { z, ZodType } from 'zod';

export class EventValidator {
  static readonly EVENT_COVER_COLOR: [string, ...string[]] = [
    'red',
    'green',
    'yellow',
    'blue',
    'purple',
    'orange',
  ];

  static readonly EVENT_COVER_TYPE: [string, ...string[]] = [
    'gradial',
    'line',
    'bubble',
  ];

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
      description: z.string().min(1, {
        message: 'Event description is required',
      }),
      target_date: z.string().datetime('yyyy-MM-dd HH:mm:ss'),
      location: z.string().min(1, {
        message: 'Event location is required',
      }),
      event_start: z
        .string()
        .datetime('yyyy-MM-dd HH:mm:ss')
        .refine((val) => new Date(val) > new Date()),
      event_end: z
        .string()
        .datetime('yyyy-MM-dd HH:mm:ss')
        .refine((val) => new Date(val) > new Date()),
      cover: z
        .object({
          color: z.enum(EventValidator.EVENT_COVER_COLOR),
          type: z.enum(EventValidator.EVENT_COVER_TYPE),
        })
        .optional(),
      dress: z.string().min(1, {
        message: 'Event dress code is required',
      }),
      theme: z.string().min(1, {
        message: 'Event theme is required',
      }),
    })
    .refine((data) => data.event_start < data.event_end, {
      message: 'End date cannot be earlier than start date.',
      path: ['event_end'],
    });
}
