import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { PersonalInfoTab } from './PersonalInfoTab';
import { profileApi } from '../api/profile.api';
import type { User } from '@/features/auth/api/auth.api';

vi.mock('../api/profile.api', () => ({
  profileApi: {
    updateName: vi.fn(),
  },
}));

const BASE_USER: User = {
  id: 'u1',
  email: 'alice@example.com',
  name: 'Alice Nguyen',
  createdAt: '2026-01-15T00:00:00Z',
};

beforeEach(() => {
  vi.clearAllMocks();
});

/**
 * #166 / review #360. Trước đây `features/profile` có 653 dòng test canh ba component
 * (`IdentitySection`, `PomodoroSection`, `PasswordSection`) mà **không ai render** — chỉ
 * `index.ts` nhắc tên chúng. Đó là lý do 198/198 xanh trong khi trang hồ sơ hỏng. Tệp này canh
 * component `ProfilePage` thật sự dựng.
 */
describe('PersonalInfoTab', () => {
  it('pre-fills the display-name input with the current name', () => {
    render(<PersonalInfoTab />, { authUser: BASE_USER });

    expect(screen.getByDisplayValue('Alice Nguyen')).toBeInTheDocument();
  });

  it('falls back to an empty input when the user has no name', () => {
    render(<PersonalInfoTab />, { authUser: { ...BASE_USER, name: null } });

    expect(screen.getByPlaceholderText('Chưa đặt')).toHaveValue('');
  });

  /**
   * Hai ô này bị bỏ khi review #360 và **không được quay lại**. "Số điện thoại" không có cột nào
   * trong `model User` để chứa; "Họ và tên" trùng vai với "Tên hiển thị" và `onChange` của nó ghi
   * đè im lặng ô kia. Assert bằng `queryByLabelText` để nếu ai đó dựng lại ô, test đỏ ngay chứ
   * không đợi người dùng phát hiện tên tài khoản bị mất.
   */
  it('has no "Họ và tên" field (it silently overwrote the display name)', () => {
    render(<PersonalInfoTab />, { authUser: BASE_USER });

    expect(screen.queryByLabelText(/Họ và tên/)).not.toBeInTheDocument();
  });

  it('has no "Số điện thoại" field (no column stores it)', () => {
    render(<PersonalInfoTab />, { authUser: BASE_USER });

    expect(screen.queryByLabelText(/Số điện thoại/)).not.toBeInTheDocument();
  });

  it('leaves exactly one editable text field — the display name', () => {
    render(<PersonalInfoTab />, { authUser: BASE_USER });

    expect(screen.getAllByRole('textbox')).toHaveLength(1);
  });

  it('renders email as a locked value, not an input', () => {
    render(<PersonalInfoTab />, { authUser: BASE_USER });

    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    const emailInput = screen
      .getAllByRole('textbox')
      .find((el) => (el as HTMLInputElement).value === 'alice@example.com');
    expect(emailInput).toBeUndefined();
  });

  it('formats the join date with Intl vi-VN', () => {
    render(<PersonalInfoTab />, { authUser: BASE_USER });

    const expected = new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date('2026-01-15T00:00:00Z'));

    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it('shows an em dash when the account has no createdAt', () => {
    render(<PersonalInfoTab />, {
      authUser: { ...BASE_USER, createdAt: undefined as unknown as string },
    });

    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('saves the trimmed name', async () => {
    const user = userEvent.setup();
    vi.mocked(profileApi.updateName).mockResolvedValue({ ...BASE_USER, name: 'Bob' });

    render(<PersonalInfoTab />, { authUser: BASE_USER });

    const nameInput = screen.getByPlaceholderText('Chưa đặt');
    await user.clear(nameInput);
    await user.type(nameInput, '  Bob  ');
    await user.click(screen.getByRole('button', { name: 'Lưu thay đổi' }));

    await waitFor(() => {
      expect(profileApi.updateName).toHaveBeenCalledWith({ name: 'Bob' });
    });
  });

  /**
   * ⚠️ **Hai ca dưới ghim HÀNH VI HIỆN TẠI của client, không phải hợp đồng đã chạy được.**
   *
   * `updateProfileSchema` phía server (`user.schema.ts`) khai `name: z.string().trim().min(2)` —
   * **không** `.nullable()`. Parse thật cho kết quả: `{name: null}` → *expected string*,
   * `{name: ''}` và `{name: 'A'}` → *min 2*. Nghĩa là xoá trắng ô tên **400 VALIDATION_ERROR**, và
   * người dùng nhận "Không thể lưu. Vui lòng thử lại." — trong khi dòng chú thích ngay dưới ô hứa
   * *"Bỏ trống thì hệ thống dùng phần đầu của email."*
   *
   * Giữ `null` (thay vì `''`) vẫn đúng hơn vì `''` cũng bị từ chối, nên đổi sang `''` không mua
   * được gì. Nhưng **đừng đọc hai ca này là "đã chạy"** — cần một quyết định: hoặc server nhận
   * `null` để cho phép xoá tên, hoặc client bỏ lời hứa "bỏ trống" và chặn tên < 2 ký tự.
   */
  it('sends null (not an empty string) when the field is cleared', async () => {
    const user = userEvent.setup();
    vi.mocked(profileApi.updateName).mockResolvedValue({ ...BASE_USER, name: null });

    render(<PersonalInfoTab />, { authUser: BASE_USER });

    await user.clear(screen.getByPlaceholderText('Chưa đặt'));
    await user.click(screen.getByRole('button', { name: 'Lưu thay đổi' }));

    await waitFor(() => {
      expect(profileApi.updateName).toHaveBeenCalledWith({ name: null });
    });
  });

  it('sends null for a whitespace-only name (same caveat as above)', async () => {
    const user = userEvent.setup();
    vi.mocked(profileApi.updateName).mockResolvedValue({ ...BASE_USER, name: null });

    render(<PersonalInfoTab />, { authUser: BASE_USER });

    const nameInput = screen.getByPlaceholderText('Chưa đặt');
    await user.clear(nameInput);
    await user.type(nameInput, '   ');
    await user.click(screen.getByRole('button', { name: 'Lưu thay đổi' }));

    await waitFor(() => {
      expect(profileApi.updateName).toHaveBeenCalledWith({ name: null });
    });
  });

  it('confirms the save so the tab matches PasswordTab', async () => {
    const user = userEvent.setup();
    vi.mocked(profileApi.updateName).mockResolvedValue({ ...BASE_USER, name: 'Bob' });

    render(<PersonalInfoTab />, { authUser: BASE_USER });

    await user.click(screen.getByRole('button', { name: 'Lưu thay đổi' }));

    await screen.findByText('Đã lưu thay đổi.');
  });

  it('drops the confirmation once the name is edited again', async () => {
    const user = userEvent.setup();
    vi.mocked(profileApi.updateName).mockResolvedValue({ ...BASE_USER, name: 'Bob' });

    render(<PersonalInfoTab />, { authUser: BASE_USER });

    await user.click(screen.getByRole('button', { name: 'Lưu thay đổi' }));
    await screen.findByText('Đã lưu thay đổi.');

    await user.type(screen.getByPlaceholderText('Chưa đặt'), 'x');

    expect(screen.queryByText('Đã lưu thay đổi.')).not.toBeInTheDocument();
  });

  it('shows an error message when the save fails', async () => {
    const user = userEvent.setup();
    vi.mocked(profileApi.updateName).mockRejectedValue(new Error('network'));

    render(<PersonalInfoTab />, { authUser: BASE_USER });

    await user.click(screen.getByRole('button', { name: 'Lưu thay đổi' }));

    await screen.findByText('Không thể lưu. Vui lòng thử lại.');
    expect(screen.queryByText('Đã lưu thay đổi.')).not.toBeInTheDocument();
  });

  it('renders nothing when nobody is logged in', () => {
    const { container } = render(<PersonalInfoTab />, { authUser: null });

    expect(container.innerHTML).toBe('');
  });
});
