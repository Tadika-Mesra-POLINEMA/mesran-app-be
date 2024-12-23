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
      activity_start: z
        .string()
        .datetime('yyyy-MM-dd HH:mm:ss')
        .refine(
          (val) => {
            const activityStart = new Date(val);
            const now = new Date();
            now.setHours(0, 0, 0, 0);

            return activityStart.getTime() >= now.getTime();
          },
          {
            message: 'Activity start time cannot be earlier than now',
          },
        ),
      activity_end: z
        .string()
        .datetime('yyyy-MM-dd HH:mm:ss')
        .refine(
          (val) => {
            const activityEnd = new Date(val);
            const now = new Date();
            now.setHours(0, 0, 0, 0);

            return activityEnd.getTime() >= now.getTime();
          },
          {
            message: 'Activity end time cannot be earlier than now',
          },
        ),
    })
    .refine(
      (val) => new Date(val.activity_start) < new Date(val.activity_end),
      {
        message: 'Activity end cannot be earlier than start',
        path: ['activity_end'],
      },
    );

  static readonly CREATE_ACTIVITIES: ZodSchema = z.array(
    ActivityValidator.CREATE_ACTIVITY,
  );

  static readonly UPDATE_ACTIVITY: ZodSchema =
    ActivityValidator.CREATE_ACTIVITY;
}
