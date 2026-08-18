import { Link } from 'react-router-dom';
import { NotebookText } from 'lucide-react';

import { Button } from '@/components/ui/button';

/**
 * AF1 — chưa có phiên kiểm tra nào.
 *
 * Khác trạng thái rỗng của danh sách kế hoạch: người dùng ĐÃ có kế hoạch, chỉ là chưa kiểm tra
 * lần nào. Nên chỗ trống nói thẳng cái giá phải trả — đồ thị khái niệm còn xám vì chưa có
 * `mastery_score` nào — rồi dẫn tới đúng hành động mở khoá nó, thay vì một câu động viên.
 */
export function NoSessionsYet({ filtered }: { filtered: boolean }) {
  return (
    <div className="bg-card border-border flex flex-col items-center rounded-xl border px-6 py-14 text-center">
      <NotebookText
        className="text-muted-foreground mb-4 size-10 stroke-[1.3]"
        aria-hidden="true"
      />
      <h3 className="font-heading text-foreground text-[19px] tracking-[-0.01em]">
        {filtered ? 'Kế hoạch này chưa có phiên kiểm tra nào' : 'Chưa có phiên kiểm tra nào'}
      </h3>
      <p className="text-muted-foreground mt-2.5 max-w-[52ch] text-[13.5px] leading-[1.65]">
        {filtered
          ? 'Chọn "Tất cả kế hoạch" để xem các phiên thuộc kế hoạch khác, hoặc bắt đầu một phiên cho kế hoạch này.'
          : 'Các khái niệm trong kế hoạch của bạn vẫn đang ở mức chưa đo — đồ thị khái niệm còn xám vì hệ thống chưa biết cái nào vững, cái nào chưa, nên chưa xếp được lịch ôn theo ưu tiên. Một phiên khoảng 15 phút là đủ để đồ thị bắt đầu có màu.'}
      </p>
      <Button asChild className="mt-6">
        <Link to="/interview">Bắt đầu phiên kiểm tra đầu tiên</Link>
      </Button>
    </div>
  );
}
