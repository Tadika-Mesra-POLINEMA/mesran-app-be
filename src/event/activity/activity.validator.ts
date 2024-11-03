import { z, ZodSchema } from 'zod';

export class ActivityValidator {
  static readonly CREATE_ACTIVITY: ZodSchema = z
    .object({
      title: z.string().min(1, {
        message: 'Activity title is required',
      }),
      description: z.string().min(1, {
        message: 'Activity description is required',
      }),
      activity_start: z.string().datetime('yyyy-MM-dd HH:mm:ss'),
      activity_end: z.string().datetime('yyyy-MM-dd HH:mm:ss'),
    })
    .refine(
      (val) => new Date(val.activity_start) < new Date(val.activity_end),
      {
        message: 'Activity start time must be before end time',
      },
    );

  static readonly CREATE_ACTIVITIES: ZodSchema = z.array(
    ActivityValidator.CREATE_ACTIVITY,
  );
}
