import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ExtractScene,
  LandingHero,
  PandaSprite,
  TracebackScene,
  VerdictScene,
} from '@/features/landing';

/**
 * Trang landing công khai (`/`, issue #388) — điểm vào cho người chưa đăng nhập.
 *
 * Tĩnh hoàn toàn, không gọi API. Trang đi theo đúng vòng lặp của sản phẩm:
 * tải tài liệu → dựng đồ thị khái niệm → truy ngược khi sai → không kết luận
 * khi chưa đủ căn cứ. Ba cảnh giữa đều dựng lại một mệnh đề CÓ THẬT trong
 * engine chứ không phải hình minh hoạ trang trí.
 *
 * Gấu Trúc là linh vật, vẽ pixel art trên lưới 16×16 (`features/landing/data`).
 * Đây là phần tử pixel DUY NHẤT của trang — chữ vẫn Noto Serif, đường vẫn
 * mảnh, khoảng trắng vẫn rộng. Tương phản đó là chủ đích.
 */
export default function LandingPage() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <header className="border-border mx-auto flex w-full max-w-[1280px] items-center justify-between border-b px-5 py-4 sm:px-8 lg:px-14">
        <div className="flex items-center gap-2.5">
          <PandaSprite pose="idle" size={26} />
          <span className="font-heading text-base tracking-tight">Recall AI</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-5">
          <Button asChild variant="ghost" size="sm">
            <Link to="/login">Đăng nhập</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/register">Bắt đầu miễn phí</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1280px] flex-1">
        <LandingHero />
        <SceneRule />
        <ExtractScene />
        <SceneRule />
        <TracebackScene />
        <SceneRule />
        <VerdictScene />
        <SceneRule />

        <section className="px-5 py-16 sm:px-8 lg:px-14 lg:py-20">
          <div className="border-border bg-card mx-auto grid max-w-[1160px] gap-8 rounded-xl border p-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-12 lg:p-10">
            <div>
              <h2 className="font-heading text-[24px] sm:text-[27px]">
                AI chứng kiến.
                <br />
                Code bảo đảm.
              </h2>
              <p className="text-muted-foreground mt-3 text-[13.5px] leading-[1.7]">
                Ranh giới này là thứ khiến kết quả lặp lại được — và là thứ một chatbot không có.
              </p>
            </div>
            <div className="border-border grid overflow-hidden rounded-lg border sm:grid-cols-2">
              <div className="border-border flex flex-col gap-2 border-b p-5 sm:border-b-0 sm:border-r">
                <span className="text-ai-accent font-mono text-[10px] uppercase tracking-[0.1em]">
                  AI làm
                </span>
                <span className="text-[13px] leading-[1.6]">
                  Đặt câu hỏi từ tài liệu của bạn. Ghi nhận điều nó chứng kiến trong câu trả lời.
                </span>
              </div>
              <div className="flex flex-col gap-2 p-5">
                <span className="text-remediate font-mono text-[10px] uppercase tracking-[0.1em]">
                  Code làm
                </span>
                <span className="text-[13px] leading-[1.6]">
                  Chấm điểm. Truy ngược. Xếp lịch. Quyết định khi nào chưa đủ để kết luận.
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col items-center gap-5 px-5 pb-20 pt-10 text-center sm:px-8">
          <PandaSprite pose="cheer" size={128} shadow />
          <h2 className="font-heading max-w-[22ch] text-balance text-[26px] sm:text-[32px]">
            Tải lên một chương. Mình dựng đồ thị cho bạn.
          </h2>
          <Button asChild size="lg">
            <Link to="/register">Tạo kế hoạch đầu tiên</Link>
          </Button>
        </section>
      </main>

      <footer className="border-border mx-auto flex w-full max-w-[1280px] items-center justify-between border-t px-5 py-5 sm:px-8 lg:px-14">
        <div className="flex items-center gap-2.5">
          <PandaSprite pose="idle" size={22} />
          <span className="font-heading text-[15px] tracking-tight">Recall AI</span>
        </div>
        <span className="text-muted-foreground font-mono text-[12px]">© 2026 Recall AI</span>
      </footer>
    </div>
  );
}

/**
 * Ngăn cách giữa hai cảnh: MỘT vạch dài, và chỉ một.
 *
 * Bản đầu kẻ `border-t` trên từng section rồi lại thêm hai vạch "mặt đất" cho
 * linh vật đứng — bốn đường sát nhau đọc thành cái thang. Ở đây mỗi ranh giới
 * chỉ có đúng một đường, và mặt đất thì để bóng đổ dưới chân lo.
 */
function SceneRule() {
  return <div aria-hidden="true" className="bg-border mx-auto h-px w-full max-w-[1160px]" />;
}
