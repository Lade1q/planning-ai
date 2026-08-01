import { z } from 'zod';

const limitSchema = z.coerce
  .number()
  .int('limit phải là số nguyên')
  .positive('limit phải lớn hơn 0')
  .max(50, 'limit tối đa là 50')
  .optional();

export const getReviewQueueQuerySchema = z.object({
  planId: z.string().uuid('planId phải là UUID hợp lệ'),
  limit: limitSchema,
});

export type GetReviewQueueQuery = z.infer<typeof getReviewQueueQuerySchema>;

export const getTodayQueueQuerySchema = z.object({
  limit: limitSchema,
});

export type GetTodayQueueQuery = z.infer<typeof getTodayQueueQuerySchema>;

/**
 * PATCH /review-queue/:itemId — chỉ chấp nhận 'accepted' | 'skipped'. Không cho set lại
 * 'pending' hay 'done' qua endpoint này (đó là việc của I7.2's upsert / I6.5's flow riêng).
 */
export const updateReviewQueueItemSchema = z.object({
  status: z.enum(['accepted', 'skipped']),
});

export type UpdateReviewQueueItemInput = z.infer<typeof updateReviewQueueItemSchema>;
