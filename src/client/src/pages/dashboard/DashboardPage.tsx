import { reviewQueueApi } from '@/features/review-queue/api/review-queue.api';
import { dashboardApi } from '@/features/dashboard/api/dashboard.api';
import { useAsyncResource } from '@/features/dashboard/hooks/useAsyncResource';
import { BlockError } from '@/features/dashboard/components/BlockError';
import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader';
import { StatStrip, StatStripSkeleton } from '@/features/dashboard/components/StatStrip';
import { TodayNudge, TodayNudgeSkeleton } from '@/features/dashboard/components/TodayNudge';

/**
 * Dashboard tổng quan (`/dashboard`, DB-01) — SLICE 1: điểm vào của vòng lặp học tập.
 *
 * Bốn khối theo thứ tự mockup: (1) header chào, (2) gợi ý hôm nay + hàng đợi (DB-04), (3) dải 3
 * chỉ số (DB-01/#200). Danh mục kế hoạch, mini đồ thị và panel "Sắp đến hạn" thuộc slice 2.
 *
 * `/review-queue/today` và `/dashboard/stats` là hai nguồn độc lập: mỗi khối tự quản
 * loading/error qua `useAsyncResource`, một cái hỏng không kéo cái kia thành màn trắng.
 */
export default function DashboardPage() {
  const today = useAsyncResource(() => reviewQueueApi.getToday());
  const stats = useAsyncResource(() => dashboardApi.getStats());

  // A1 (DB-01 [E1]) — tài khoản hoàn toàn trống: mọi chỉ số bằng 0. Ẩn hẳn dải chỉ số thay vì
  // hiện ba số 0 cạnh khối gợi ý rỗng ("trông như app hỏng", mockup A1). Chỉ ẩn khi đã tải xong
  // và thật sự toàn 0 — plan `active` bất kỳ đều làm `conceptsTotal > 0`.
  const statsAllZero =
    stats.data !== null &&
    stats.data.conceptsTotal === 0 &&
    stats.data.studyStreakDays === 0 &&
    stats.data.weeklyStudyMinutes === 0;

  return (
    <div className="mx-auto w-full max-w-[1060px]">
      <DashboardHeader />

      {/* (2) Gợi ý hôm nay (DB-04) — đứng đầu vì là điểm vào vòng lặp học tập (FS-01/AE-01). */}
      <section className="mb-5">
        {today.loading && today.data === null ? (
          <TodayNudgeSkeleton />
        ) : today.error && today.data === null ? (
          <BlockError message="Không tải được gợi ý hôm nay." onRetry={today.reload} />
        ) : today.data ? (
          <TodayNudge data={today.data} />
        ) : null}
      </section>

      {/* (3) Dải 3 chỉ số (DB-01) — ẩn ở trạng thái tài khoản trống (A1). */}
      {!statsAllZero && (
        <section className="mb-10">
          {stats.loading && stats.data === null ? (
            <StatStripSkeleton />
          ) : stats.error && stats.data === null ? (
            <BlockError message="Không tải được các chỉ số nhanh." onRetry={stats.reload} />
          ) : stats.data ? (
            <StatStrip stats={stats.data} />
          ) : null}
        </section>
      )}
    </div>
  );
}
