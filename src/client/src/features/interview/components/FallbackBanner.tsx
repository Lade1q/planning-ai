import { AlertTriangle } from 'lucide-react';

/**
 * Băng thông báo khi phiên rơi vào chế độ flashcard tự chấm (AE-05): một lệnh gọi
 * Gemini đã fail nên hệ thống chuyển sang cho sinh viên tự chấm thay vì AI. Dùng tone
 * `mastery-learning` (cảnh báo, không phải lỗi) đúng như `.sys--warn` trong mockup.
 */
export function FallbackBanner() {
  return (
    <div className="flex items-start gap-3 rounded-md border border-mastery-learning/34 bg-mastery-learning/9 px-4 py-3 text-[13px] leading-[1.55] text-foreground">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-mastery-learning" aria-hidden="true" />
      <span>AI tạm thời không khả dụng. Chuyển sang chế độ Flashcard tự chấm.</span>
    </div>
  );
}
