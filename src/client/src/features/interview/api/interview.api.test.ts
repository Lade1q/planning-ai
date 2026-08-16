import { describe, expect, it } from 'vitest';
import { getInterviewErrorMessage } from './interview.api';

// axios `isAxiosError` only checks `payload.isAxiosError === true`, so plain
// objects shaped like an axios error are enough here.
const axiosErr = (status: number, code?: string, message?: string) => ({
  isAxiosError: true,
  response: { status, data: code ? { error: { code, message } } : undefined },
});

describe('getInterviewErrorMessage', () => {
  it('maps NO_MATERIAL to its own message', () => {
    expect(getInterviewErrorMessage(axiosErr(409, 'NO_MATERIAL'))).toBe(
      'Kế hoạch này chưa có tài liệu để tạo câu hỏi. Hãy tải tài liệu lên trước khi bắt đầu kiểm tra.'
    );
  });

  // PLAN_NOT_ACTIVE covers two different plan states (archived / draft) with two different
  // action sentences, so it's the one code rendered straight from the server message instead
  // of a client-side constant — see the matching case in focus.api.ts (review #350).
  it('maps PLAN_NOT_ACTIVE to the server-provided message verbatim, archived variant', () => {
    const err = axiosErr(
      409,
      'PLAN_NOT_ACTIVE',
      'Kế hoạch này đã được lưu trữ. Bỏ lưu trữ để ôn tiếp.'
    );
    expect(getInterviewErrorMessage(err)).toBe(
      'Kế hoạch này đã được lưu trữ. Bỏ lưu trữ để ôn tiếp.'
    );
  });

  it('maps PLAN_NOT_ACTIVE to the server-provided message verbatim, draft variant', () => {
    const err = axiosErr(
      409,
      'PLAN_NOT_ACTIVE',
      'Kế hoạch này đang chờ bạn xác nhận đồ thị khái niệm. Kiểm chứng xong, hàng đợi ôn sẽ bắt đầu chạy.'
    );
    expect(getInterviewErrorMessage(err)).toBe(
      'Kế hoạch này đang chờ bạn xác nhận đồ thị khái niệm. Kiểm chứng xong, hàng đợi ôn sẽ bắt đầu chạy.'
    );
  });

  it('falls back to the generic message for an unknown code', () => {
    expect(getInterviewErrorMessage(axiosErr(400, 'SOMETHING_ELSE'))).toBe(
      'Đã xảy ra lỗi, vui lòng thử lại.'
    );
  });
});
