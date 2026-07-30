import { z } from 'zod';

export const createPlanSchema = z.object({
  name: z.string().min(1, 'Plan name is required').max(255, 'Plan name is too long'),
  deadline: z
    .string()
    .min(1, 'Deadline is required')
    .refine((val) => {
      const dateStr = val.includes('T') ? val.split('T')[0] : val;
      const date = new Date(`${dateStr}T23:59:59.999Z`);
      if (isNaN(date.getTime())) return false;
      const now = new Date();
      // Allow today or future dates (24h buffer covers all client timezone offsets)
      const minThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      return date >= minThreshold;
    }, 'Deadline must be today or a future date'),
});

export type CreatePlanInput = z.infer<typeof createPlanSchema>;
