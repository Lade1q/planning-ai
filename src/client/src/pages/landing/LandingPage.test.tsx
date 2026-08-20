import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen, within } from '@/utils/test-utils';
import LandingPage from './LandingPage';

/**
 * LandingPage (issue #388) — trang tĩnh, không gọi API. Test canh ba nhóm:
 * điều hướng (CTA trỏ đúng đâu), nội dung bị cấm, và cảnh truy ngược bấm được.
 *
 * Cụm từ bị cấm soi bằng `container.textContent` chứ không phải `queryByText`:
 * cụm bị tách bởi thẻ con vẫn phải bắt được, và đây là loại hồi quy im lặng —
 * không type-check hay lint nào báo trước.
 */
describe('LandingPage (#388)', () => {
  it('mở bằng đúng một h1', () => {
    render(<LandingPage />);

    const h1 = screen.getAllByRole('heading', { level: 1 });
    expect(h1).toHaveLength(1);
    expect(h1[0]).toHaveTextContent('Mình đào tới chỗ kiến thức của bạn bị hổng.');
  });

  it('CTA chính trỏ /register, "Đăng nhập" trỏ /login', () => {
    render(<LandingPage />);

    for (const name of ['Bắt đầu miễn phí', 'Tạo kế hoạch đầu tiên']) {
      for (const link of screen.getAllByRole('link', { name })) {
        expect(link).toHaveAttribute('href', '/register');
      }
    }
    expect(screen.getByRole('link', { name: 'Đăng nhập' })).toHaveAttribute('href', '/login');
  });

  it('KHÔNG chứa cụm hứa năng lực chưa có: "flashcard", "đối thoại tương tác"', () => {
    const { container } = render(<LandingPage />);
    const text = container.textContent ?? '';

    expect(text.toLowerCase()).not.toContain('flashcard');
    expect(text).not.toContain('đối thoại tương tác');
  });
});

/**
 * Cảnh truy ngược là thứ DUY NHẤT trên trang có tương tác, và nó đang khoe
 * chính engine của sản phẩm — nên nó phải nói đúng. Ba ca dưới đây là ba kết
 * cục khác nhau của thuật toán, và câu chữ của chúng không được lẫn vào nhau.
 */
describe('LandingPage — cảnh truy ngược bấm được', () => {
  it('mặc định mở ở ca truy ngược hai tầng', async () => {
    render(<LandingPage />);

    const panel = screen.getByText('BẠN SAI Ở').closest('aside');
    expect(panel).not.toBeNull();
    expect(within(panel as HTMLElement).getByText('dừng ở tầng 2/2')).toBeInTheDocument();
    expect(screen.getByText(/Nguyên nhân không nằm ở/)).toHaveTextContent('Phụ thuộc hàm');
  });

  it('bấm khái niệm có nền đã vững thì báo sai ở chính nó', async () => {
    const user = userEvent.setup();
    render(<LandingPage />);

    await user.click(screen.getByRole('button', { name: 'Truy ngược từ Khoá chính' }));

    expect(screen.getByText(/đều đã vững/)).toBeInTheDocument();
  });

  it('bấm khái niệm có nền CHƯA KIỂM thì không gọi đó là điểm 0', async () => {
    const user = userEvent.setup();
    render(<LandingPage />);

    await user.click(screen.getByRole('button', { name: 'Truy ngược từ BCNF' }));

    const verdict = screen.getByText(/chưa được kiểm lần nào/);
    expect(verdict).toHaveTextContent('không phải là điểm 0');
  });
});
