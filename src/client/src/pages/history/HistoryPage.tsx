import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAsyncResource } from '@/features/dashboard/hooks/useAsyncResource';
import { planApi } from '@/features/study-planner/api/plan.api';
import { SessionList } from '@/features/history/components/SessionList';
import { SessionDetailPanel } from '@/features/history/components/SessionDetailPanel';
import { NoSessionsYet } from '@/features/history/components/NoSessionsYet';
import { useSessionList } from '@/features/history/hooks/useSessionList';
import type { InterviewSessionListItem } from '@/features/history/types/history.types';

/**
 * Trang "Lịch sử & Tiến độ" (DB-03 · #246).
 *
 * Nơi kiểm lại điểm số SAU khi phiên đã kết thúc — read-only, không sinh điểm, chỉ trình bày
 * lại. Giá trị của nó là cho sinh viên **kiểm chứng** cách từng điểm được tính ra, cùng tinh
 * thần với ràng buộc C5 ở màn phỏng vấn.
 *
 * Khung hai tab dùng chung với DB-08 (lịch sử phiên Focus). Tab "Phiên học" là issue riêng
 * (#247) nên ở đây chỉ có chỗ giữ chỗ và **không gọi API nào** — `focus.api.ts` hiện chưa có
 * hàm liệt kê, và dựng một nửa tab đó sẽ chồng lên phạm vi của #247.
 */
export default function HistoryPage() {
  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <header className="mb-[18px]">
        <h1 className="font-heading m-0 text-[28px] tracking-[-0.02em]">Lịch sử &amp; Tiến độ</h1>
        <p className="text-muted-foreground mt-[7px] max-w-[62ch] text-[13.5px] leading-[1.6]">
          Nơi kiểm lại điểm số sau khi phiên đã kết thúc: điểm nào tính ra sao, khái niệm nào nhích
          lên, và hệ thống đã chèn gì vào lịch vì kết quả đó.
        </p>
      </header>

      <Tabs defaultValue="interview">
        <TabsList variant="line" className="mb-5">
          <TabsTrigger value="interview">Phiên kiểm tra</TabsTrigger>
          <TabsTrigger value="focus">Phiên học</TabsTrigger>
        </TabsList>

        <TabsContent value="interview">
          <InterviewHistoryTab />
        </TabsContent>

        <TabsContent value="focus">
          <FocusHistoryPlaceholder />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InterviewHistoryTab() {
  const [planId, setPlanId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const list = useSessionList(planId);
  const plans = useAsyncResource(() => planApi.listPlans());

  // AC #246: lỗi mạng báo bằng toast kèm đường "Thử lại" (nút nằm trong khối lỗi của danh
  // sách). Chỉ báo một lần cho mỗi lần hỏng — `notified` giữ nguyên qua các lần render lại nên
  // toast không bắn lại mỗi khi đổi phiên đang chọn.
  const notifiedError = useRef(false);
  useEffect(() => {
    if (list.error && !notifiedError.current) {
      notifiedError.current = true;
      toast.error('Không tải được danh sách phiên kiểm tra. Kiểm tra kết nối rồi thử lại.');
    }
    if (!list.error) notifiedError.current = false;
  }, [list.error]);

  /**
   * Phiên đang xem được SUY RA, không đồng bộ bằng effect: phiên đã chọn nếu nó còn trong danh
   * sách, ngược lại là phiên mới nhất. Nhờ vậy đổi bộ lọc kế hoạch tự nhảy sang phiên mới nhất
   * của kế hoạch đó mà không cần một lượt render trung gian nào chọn nhầm phiên của kế hoạch cũ.
   */
  const selected: InterviewSessionListItem | null =
    list.sessions.find((session) => session.id === selectedId) ?? list.sessions[0] ?? null;

  const isEmpty = !list.loading && !list.error && list.sessions.length === 0;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
        <label htmlFor="history-scope" className="text-muted-foreground text-[13px]">
          Phạm vi
        </label>
        <select
          id="history-scope"
          value={planId ?? ''}
          onChange={(event) => setPlanId(event.target.value === '' ? null : event.target.value)}
          className="border-border bg-card text-foreground focus-visible:ring-ring/50 rounded-md border px-2.5 py-1.5 text-[13px] focus-visible:outline-none focus-visible:ring-2"
        >
          <option value="">Tất cả kế hoạch</option>
          {(plans.data ?? []).map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name}
            </option>
          ))}
        </select>
      </div>

      {isEmpty ? (
        <NoSessionsYet filtered={planId !== null} />
      ) : (
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[312px_minmax(0,1fr)]">
          {/* Tô đậm theo phiên ĐANG hiện ở panel, không theo `selectedId` thô: hai thứ khác nhau
              đúng lúc phiên đã chọn không còn trong danh sách. */}
          <SessionList
            sessions={list.sessions}
            selectedId={selected?.id ?? null}
            onSelect={(session) => setSelectedId(session.id)}
            loading={list.loading}
            loadingMore={list.loadingMore}
            error={list.error}
            hasMore={list.hasMore}
            onLoadMore={list.loadMore}
            onRetry={list.reload}
          />

          {selected ? (
            <SessionDetailPanel
              session={selected}
              // Kết thúc một phiên tạm dừng đổi `status` của chính hàng đang chọn, nên phải
              // nạp lại danh sách — không thì hàng bên trái vẫn ghi "Đang tạm dừng" trong khi
              // panel bên phải đã là phiên đã đóng.
              onSessionChanged={list.reload}
            />
          ) : (
            <NoSelection />
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Mockup không vẽ trạng thái này (danh sách của nó luôn có sẵn một mục đang chọn), nhưng nó
 * tới được thật: danh sách đang tải xong thì chưa có gì được chọn trong một nhịp render.
 */
function NoSelection() {
  return (
    <section className="bg-card border-border text-muted-foreground rounded-xl border px-[26px] py-14 text-center text-[13.5px]">
      Chọn một phiên bên trái để xem điểm từng khái niệm và bản ghi hỏi–đáp.
    </section>
  );
}

/**
 * Tab "Phiên học" là DB-08 (#247), một khung nhìn khác hẳn: UC-10 nhóm theo ngày và cộng thời
 * gian, không chấm điểm — phiên học không sinh `mastery_score`. Giữ chỗ ở đây để khung hai tab
 * của #246 đúng ngay từ đầu, phần nội dung thuộc issue kia.
 */
function FocusHistoryPlaceholder() {
  return (
    <section className="bg-card border-border text-muted-foreground rounded-xl border px-6 py-14 text-center text-[13.5px] leading-[1.65]">
      Lịch sử phiên học đang được xây dựng. Phiên học không chấm điểm, nên tab này sẽ nhóm theo ngày
      kèm tổng thời gian ôn thay vì cột điểm.
    </section>
  );
}
