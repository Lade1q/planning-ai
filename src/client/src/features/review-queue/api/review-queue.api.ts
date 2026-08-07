import apiClient from '@/lib/apiClient';
import { ENDPOINTS } from '@/lib/endpoints';
import type { ReviewQueueListResponse } from '../types/review-queue.types';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export const reviewQueueApi = {
  /** GET /review-queue/today — nguồn duy nhất cho lối vào /focus khi chưa chọn khái niệm. */
  getToday: async (limit?: number): Promise<ReviewQueueListResponse> => {
    const response = await apiClient.get<ApiEnvelope<ReviewQueueListResponse>>(
      ENDPOINTS.REVIEW_QUEUE.TODAY,
      { params: limit ? { limit } : undefined }
    );
    return response.data.data;
  },
};
