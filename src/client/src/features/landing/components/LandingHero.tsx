import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PandaSprite } from './PandaSprite';
import { useSceneTicker } from '../hooks/useSceneTicker';

/** Nhịp bước: đổi khung chân. Cũng là nhịp để chớp mắt thưa hơn. */
const STEP_MS = 400;

/**
 * Hero: tiêu đề ở giữa, bên dưới là một dải đất rộng cả trang mà Gấu Trúc
 * chạy qua chạy lại. Tới mép thì quay đầu — lật hình chứ không vẽ thêm tư thế.
 *
 * Đường chạy chỉ có từ `md` trở lên: dưới đó bề ngang không đủ để một cú chạy
 * đọc ra thành chuyển động, nên nhân vật đứng yên chớp mắt cho gọn.
 */
export function LandingHero() {
  const tick = useSceneTicker(STEP_MS, 0);
  /* Đổi giữa HAI khung bước, không phải đứng-rồi-bước: chân phải đá so le
     thì mới ra dáng đi. */
  const pose = tick % 2 === 0 ? 'walk' : 'walk2';
  const blinking = tick % 14 === 0;

  return (
    <section className="flex flex-col items-center gap-5 px-5 pt-16 text-center sm:px-8 sm:pt-20">
      <span className="text-remediate font-mono text-[11px] uppercase tracking-[0.14em]">
        Chào, mình là Gấu Trúc
      </span>
      {/*
        Nguyên văn theo PNG, không diễn đạt lại. Bảng định đoạt của issue #388
        có bảy hàng, sáu hàng là BỎ/SỬA vì PNG hứa năng lực không có thật —
        hero là hàng DUY NHẤT ghi "giữ nguyên văn", vì nó không hứa sai gì cả.

        Cụm cuối tô màu đúng chỗ PNG nhấn, nhưng bằng token `--remediate` của
        hệ thống chứ không lấy màu của PNG: nhấn cùng CHỖ, không cùng MÀU.
      */}
      <h1 className="font-heading max-w-[20ch] text-balance text-[34px] sm:text-[44px] lg:text-[54px]">
        Ôn tập thông minh, truy ngược tận gốc <span className="text-remediate">kiến thức yếu</span>
      </h1>
      <p className="text-muted-foreground max-w-[56ch] text-pretty text-[15px] leading-[1.7] sm:text-[17px]">
        Giải pháp AI toàn diện giúp sinh viên Việt Nam tối ưu hóa lộ trình học tập và lấp đầy lỗ
        hổng kiến thức.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
        <Button asChild size="lg">
          <Link to="/register">Nhận lộ trình ngay</Link>
        </Button>
        <span className="text-muted-foreground font-mono text-[12px]">Hoàn toàn miễn phí</span>
      </div>

      {/* Đường chạy — chỉ trên màn rộng. Không kẻ vạch mặt đất: bóng đổ dưới
          chân đã đủ neo nhân vật, mà một đường ngang hết bề rộng thì đọc thành
          vạch chia section chứ không phải mặt đất. */}
      <div className="relative mt-8 hidden h-[190px] w-full md:block">
        <div className="lp-runner absolute bottom-0 left-6">
          <PandaSprite pose={pose} size={150} blinking={blinking} shadow />
        </div>
      </div>

      {/* Màn hẹp: đứng yên, không cần đường chạy. */}
      <div className="mt-6 md:hidden">
        <PandaSprite pose="idle" size={116} blinking={blinking} shadow />
      </div>
    </section>
  );
}
