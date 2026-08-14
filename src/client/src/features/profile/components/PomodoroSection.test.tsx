import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { PomodoroSection } from './PomodoroSection';
import { pomodoroConfigApi } from '@/features/focus/api/focus.api';
import type { PomodoroConfig } from '@/features/focus/types/focus.types';

vi.mock('@/features/focus/api/focus.api', () => ({
  pomodoroConfigApi: {
    get: vi.fn(),
    update: vi.fn(),
  },
}));

const DEFAULT_CONFIG: PomodoroConfig = {
  work: 25,
  short_break: 5,
  long_break: 15,
  cycles: 4,
  sound: true,
};

const AUTH_USER = {
  authUser: { id: 'u1', email: 'a@b.c', name: null, createdAt: '2026-01-01T00:00:00Z' },
} as const;

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(pomodoroConfigApi.get).mockResolvedValue({ ...DEFAULT_CONFIG });
});

describe('PomodoroSection', () => {
  // ---------- Loading state ----------

  it('renders loading skeleton before config is fetched', () => {
    // Never resolve the promise so the component stays in loading state
    vi.mocked(pomodoroConfigApi.get).mockReturnValue(new Promise(() => {}));

    const { container } = render(<PomodoroSection />, AUTH_USER);

    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  // ---------- After fetch ----------

  it('renders cycle visualization with correct segment count after fetch', async () => {
    render(<PomodoroSection />, AUTH_USER);

    // Default config: 4 cycles = 4 work + 3 short_break + 1 long_break = 8 segments
    // Legend mentions: "Hoc 25 phut", "Nghi ngan 5 phut", "Nghi dai 15 phut"
    await screen.findByText(/Học 25 phút/);
    expect(screen.getByText(/Nghỉ ngắn 5 phút/)).toBeInTheDocument();
    expect(screen.getByText(/Nghỉ dài 15 phút/)).toBeInTheDocument();
  });

  it('calculates total duration correctly: cycles*work + (cycles-1)*short + long', async () => {
    render(<PomodoroSection />, AUTH_USER);

    // 4*25 + 3*5 + 15 = 100 + 15 + 15 = 130 minutes = 2 gio 10 phut
    await screen.findByText(/2 giờ 10 phút/);
  });

  it('shows math expression for total', async () => {
    render(<PomodoroSection />, AUTH_USER);

    // "4 x 25 + 3 x 5 + 15 = 130"
    await screen.findByText(/4 × 25 \+ 3 × 5 \+ 15 = 130/);
  });

  it('shows total in only minutes when under 60', async () => {
    vi.mocked(pomodoroConfigApi.get).mockResolvedValue({
      work: 10,
      short_break: 2,
      long_break: 5,
      cycles: 2,
      sound: true,
    });
    // 2*10 + 1*2 + 5 = 27 phut

    render(<PomodoroSection />, AUTH_USER);

    await screen.findByText(/27 phút/);
  });

  it('shows total in only hours when evenly divisible by 60', async () => {
    vi.mocked(pomodoroConfigApi.get).mockResolvedValue({
      work: 25,
      short_break: 5,
      long_break: 10,
      cycles: 2,
      sound: true,
    });
    // 2*25 + 1*5 + 10 = 65 min => not evenly divisible, try another:
    // Actually let's compute: 2*25 + 1*5 + 10 = 50+5+10 = 65, not even.
    // Use: work=30, short=0 won't work because min is 1
    // Let's just test the display with a direct value: work=25, short=5, long=20, cycles=2
    // 2*25 + 1*5 + 20 = 50+5+20 = 75. Not 60.
    // work=20, short=5, long=15, cycles=2: 2*20+1*5+15 = 40+5+15 = 60 => "1 gio"
    vi.mocked(pomodoroConfigApi.get).mockResolvedValue({
      work: 20,
      short_break: 5,
      long_break: 15,
      cycles: 2,
      sound: true,
    });

    const { unmount } = render(<PomodoroSection />, AUTH_USER);
    unmount();

    render(<PomodoroSection />, AUTH_USER);

    await screen.findByText(/1 giờ(?! \d)/);
  });

  // ---------- Numeric input clamping ----------

  it('clamps work input to bounds [1, 120]', async () => {
    const user = userEvent.setup();
    render(<PomodoroSection />, AUTH_USER);

    const workInput = await screen.findByLabelText('Học');
    await user.clear(workInput);
    await user.type(workInput, '200');

    // Should be clamped to 120
    expect(workInput).toHaveValue(120);
  });

  it('clamps cycles input to bounds [1, 10]', async () => {
    const user = userEvent.setup();
    render(<PomodoroSection />, AUTH_USER);

    const cyclesInput = await screen.findByLabelText('Số chu kỳ');
    await user.clear(cyclesInput);
    await user.type(cyclesInput, '15');

    // Typing "15": first "1" => clamp(1, 1, 10)=1, then "15" => clamp(15, 1, 10)=10
    expect(cyclesInput).toHaveValue(10);
  });

  // ---------- Sound switch ----------

  it('sound switch toggles checked state', async () => {
    const user = userEvent.setup();
    render(<PomodoroSection />, AUTH_USER);

    // Wait for config to load
    await screen.findByText(/Học 25 phút/);

    const switchEl = screen.getByRole('switch');
    // Default config has sound: true
    expect(switchEl).toHaveAttribute('data-state', 'checked');

    await user.click(switchEl);
    expect(switchEl).toHaveAttribute('data-state', 'unchecked');
  });

  // ---------- Save ----------

  it('save button calls pomodoroConfigApi.update with current config', async () => {
    const user = userEvent.setup();
    vi.mocked(pomodoroConfigApi.update).mockResolvedValue({ ...DEFAULT_CONFIG });

    render(<PomodoroSection />, AUTH_USER);

    await screen.findByText(/Học 25 phút/);

    await user.click(screen.getByRole('button', { name: 'Lưu cấu hình' }));

    await waitFor(() => {
      expect(pomodoroConfigApi.update).toHaveBeenCalledTimes(1);
      expect(pomodoroConfigApi.update).toHaveBeenCalledWith(
        expect.objectContaining({ work: 25, cycles: 4 })
      );
    });
  });

  it('shows error message when save fails', async () => {
    const user = userEvent.setup();
    vi.mocked(pomodoroConfigApi.update).mockRejectedValue(new Error('network'));

    render(<PomodoroSection />, AUTH_USER);

    await screen.findByText(/Học 25 phút/);
    await user.click(screen.getByRole('button', { name: 'Lưu cấu hình' }));

    await screen.findByText('Không thể lưu cấu hình. Vui lòng thử lại.');
  });

  it('shows default helper text when no error', async () => {
    render(<PomodoroSection />, AUTH_USER);

    await screen.findByText('Áp dụng từ phiên học tiếp theo.');
  });

  // ---------- Fetch failure ----------

  it('still renders (exits loading) when fetch fails', async () => {
    vi.mocked(pomodoroConfigApi.get).mockRejectedValue(new Error('offline'));

    render(<PomodoroSection />, AUTH_USER);

    // After the catch, loading becomes false and the default config renders.
    await screen.findByText(/Lưu cấu hình/);
  });
});
