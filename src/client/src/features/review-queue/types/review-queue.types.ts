export type ReviewReason = 'traceback' | 'spaced_repetition' | 'deadline_priority' | 'manual';

/** Mirror của `ReviewQueueItemResponse` server (scheduling.service.ts). */
export interface ReviewQueueItem {
  /** `null` cho gợi ý ảo A3-fallback — không có hàng thật để PATCH. */
  id: string | null;
  conceptId: string;
  name: string;
  planId: string;
  planName: string;
  priority: number;
  reason: ReviewReason;
  reasonText: string;
  sourceConceptName: string | null;
  depth: number | null;
  masteryScore: number | null;
  status: 'pending' | 'accepted' | 'skipped' | 'done';
  estimatedMinutes: number;
  sourceSessionEndedAt: string | null;
}

/** Mirror của `ReviewQueueListResponse` server. */
export interface ReviewQueueListResponse {
  items: ReviewQueueItem[];
  message: string | null;
  totalEstimatedMinutes: number;
}
