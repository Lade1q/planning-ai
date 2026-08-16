/** Định dạng ngày giờ dùng chung cho màn Lịch sử. Giờ địa phương của máy người dùng. */

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/** `26/07 · 21:40` — nhãn của một mục danh sách. */
export function formatDayTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)} · ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** `26/07/2026` — tiêu đề panel chi tiết. */
export function formatFullDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

/** `21:40` */
export function formatTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * Dòng meta dưới tiêu đề panel: `21:40 – 22:06 · 26 phút · Tên kế hoạch`.
 *
 * Phiên chưa đóng (`active`/`paused`) không có `endedAt`, và `durationMinutes` của `/summary`
 * chỉ có với phiên đã đóng — nên hai phần đó biến mất thay vì hiện `0 phút`, một con số sai.
 */
export function formatSessionMeta({
  startedAt,
  endedAt,
  durationMinutes,
  planName,
}: {
  startedAt: string;
  endedAt: string | null;
  durationMinutes: number | null;
  planName: string;
}): string {
  const parts: string[] = [];
  parts.push(endedAt ? `${formatTime(startedAt)} – ${formatTime(endedAt)}` : formatTime(startedAt));
  if (durationMinutes !== null) parts.push(`${durationMinutes} phút`);
  parts.push(planName);
  return parts.join(' · ');
}
