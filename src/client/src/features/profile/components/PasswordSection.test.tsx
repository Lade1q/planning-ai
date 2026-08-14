import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render as rtlRender, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ReactFlowProvider } from '@xyflow/react';
import { AuthContext, type AuthContextValue } from '@/features/auth/context/AuthContext';
import { PasswordSection } from './PasswordSection';
import { profileApi } from '../api/profile.api';
import type { User } from '@/features/auth/api/auth.api';
import { AxiosError } from 'axios';

vi.mock('../api/profile.api', () => ({
  profileApi: {
    changePassword: vi.fn(),
  },
}));

const BASE_USER: User = {
  id: 'u1',
  email: 'a@b.c',
  name: null,
  createdAt: '2026-01-01T00:00:00Z',
};

const mockLogout = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});

/**
 * Renders PasswordSection with a custom AuthContext that has a spy-able logout.
 */
function renderPasswordSection() {
  const authValue: AuthContextValue = {
    user: BASE_USER,
    isAuthenticated: true,
    isLoading: false,
    login: async () => {},
    logout: mockLogout,
    register: async () => {},
    updateUser: () => {},
  };

  return rtlRender(
    <AuthContext.Provider value={authValue}>
      <BrowserRouter>
        <ReactFlowProvider>
          <PasswordSection />
        </ReactFlowProvider>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

describe('PasswordSection', () => {
  // ---------- Password length validation ----------

  it('shows "Con thieu X ky tu" when new password < 8 chars', async () => {
    const user = userEvent.setup();
    renderPasswordSection();

    const newPwInput = screen.getByLabelText('Mật khẩu mới');
    await user.type(newPwInput, 'abc');

    // 8 - 3 = 5 chars missing
    expect(screen.getByText('Còn thiếu 5 ký tự.')).toBeInTheDocument();
  });

  it('shows "Du dai." when new password >= 8 chars', async () => {
    const user = userEvent.setup();
    renderPasswordSection();

    const newPwInput = screen.getByLabelText('Mật khẩu mới');
    await user.type(newPwInput, '12345678');

    expect(screen.getByText('Đủ dài.')).toBeInTheDocument();
  });

  it('shows hint "It nhat 8 ky tu." when new password is untouched', () => {
    renderPasswordSection();

    expect(screen.getByText('Ít nhất 8 ký tự.')).toBeInTheDocument();
  });

  it('shows exactly 1 missing char message when typed 7 chars', async () => {
    const user = userEvent.setup();
    renderPasswordSection();

    const newPwInput = screen.getByLabelText('Mật khẩu mới');
    await user.type(newPwInput, '1234567');

    expect(screen.getByText('Còn thiếu 1 ký tự.')).toBeInTheDocument();
  });

  // ---------- Confirm password ----------

  it('shows mismatch error when confirm password differs from new password', async () => {
    const user = userEvent.setup();
    renderPasswordSection();

    await user.type(screen.getByLabelText('Mật khẩu mới'), '12345678');
    await user.type(screen.getByLabelText('Nhập lại mật khẩu mới'), 'different');

    expect(screen.getByText('Mật khẩu không khớp.')).toBeInTheDocument();
  });

  it('does not show mismatch error when confirm is empty', async () => {
    const user = userEvent.setup();
    renderPasswordSection();

    await user.type(screen.getByLabelText('Mật khẩu mới'), '12345678');

    // Confirm password is empty (untouched), so no mismatch shown
    expect(screen.queryByText('Mật khẩu không khớp.')).not.toBeInTheDocument();
  });

  // ---------- Submit button disabled ----------

  it('submit button is disabled when current password is empty', () => {
    renderPasswordSection();

    expect(screen.getByRole('button', { name: 'Đổi mật khẩu' })).toBeDisabled();
  });

  it('submit button is disabled when new password is too short', async () => {
    const user = userEvent.setup();
    renderPasswordSection();

    await user.type(screen.getByLabelText('Mật khẩu hiện tại'), 'oldpass');
    await user.type(screen.getByLabelText('Mật khẩu mới'), 'short');
    await user.type(screen.getByLabelText('Nhập lại mật khẩu mới'), 'short');

    expect(screen.getByRole('button', { name: 'Đổi mật khẩu' })).toBeDisabled();
  });

  it('submit button is disabled when passwords do not match', async () => {
    const user = userEvent.setup();
    renderPasswordSection();

    await user.type(screen.getByLabelText('Mật khẩu hiện tại'), 'oldpass');
    await user.type(screen.getByLabelText('Mật khẩu mới'), '12345678');
    await user.type(screen.getByLabelText('Nhập lại mật khẩu mới'), '87654321');

    expect(screen.getByRole('button', { name: 'Đổi mật khẩu' })).toBeDisabled();
  });

  it('submit button is enabled when all fields are valid', async () => {
    const user = userEvent.setup();
    renderPasswordSection();

    await user.type(screen.getByLabelText('Mật khẩu hiện tại'), 'oldpass');
    await user.type(screen.getByLabelText('Mật khẩu mới'), '12345678');
    await user.type(screen.getByLabelText('Nhập lại mật khẩu mới'), '12345678');

    expect(screen.getByRole('button', { name: 'Đổi mật khẩu' })).toBeEnabled();
  });

  // ---------- Server error ----------

  it('shows server error for WRONG_PASSWORD response', async () => {
    const user = userEvent.setup();
    const axiosErr = new AxiosError('wrong', undefined, undefined, undefined, {
      status: 400,
      data: { error: { code: 'WRONG_PASSWORD' } },
      statusText: 'Bad Request',
      headers: {},
      config: {} as never,
    });
    vi.mocked(profileApi.changePassword).mockRejectedValue(axiosErr);

    renderPasswordSection();

    await user.type(screen.getByLabelText('Mật khẩu hiện tại'), 'wrongpass');
    await user.type(screen.getByLabelText('Mật khẩu mới'), '12345678');
    await user.type(screen.getByLabelText('Nhập lại mật khẩu mới'), '12345678');
    await user.click(screen.getByRole('button', { name: 'Đổi mật khẩu' }));

    await screen.findByText('Mật khẩu hiện tại không đúng. Mật khẩu của bạn chưa bị thay đổi.');
  });

  it('shows generic error for non-WRONG_PASSWORD server errors', async () => {
    const user = userEvent.setup();
    vi.mocked(profileApi.changePassword).mockRejectedValue(new Error('network'));

    renderPasswordSection();

    await user.type(screen.getByLabelText('Mật khẩu hiện tại'), 'oldpass');
    await user.type(screen.getByLabelText('Mật khẩu mới'), '12345678');
    await user.type(screen.getByLabelText('Nhập lại mật khẩu mới'), '12345678');
    await user.click(screen.getByRole('button', { name: 'Đổi mật khẩu' }));

    await screen.findByText('Đã xảy ra lỗi, vui lòng thử lại.');
  });

  // ---------- Success ----------

  it('clears all fields and shows success message on successful password change', async () => {
    const user = userEvent.setup();
    vi.mocked(profileApi.changePassword).mockResolvedValue({ message: 'ok' });

    renderPasswordSection();

    const currentPw = screen.getByLabelText('Mật khẩu hiện tại');
    const newPw = screen.getByLabelText('Mật khẩu mới');
    const confirmPw = screen.getByLabelText('Nhập lại mật khẩu mới');

    await user.type(currentPw, 'oldpass');
    await user.type(newPw, '12345678');
    await user.type(confirmPw, '12345678');
    await user.click(screen.getByRole('button', { name: 'Đổi mật khẩu' }));

    await screen.findByText('Đổi mật khẩu thành công.');

    // All fields should be cleared
    expect(currentPw).toHaveValue('');
    expect(newPw).toHaveValue('');
    expect(confirmPw).toHaveValue('');
  });

  // ---------- Logout ----------

  it('logout button calls logout() and navigates to /login', async () => {
    const user = userEvent.setup();
    renderPasswordSection();

    await user.click(screen.getByRole('button', { name: 'Đăng xuất' }));

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  // ---------- Server error clears on re-typing current password ----------

  it('clears server error when user re-types current password', async () => {
    const user = userEvent.setup();
    const axiosErr = new AxiosError('wrong', undefined, undefined, undefined, {
      status: 400,
      data: { error: { code: 'WRONG_PASSWORD' } },
      statusText: 'Bad Request',
      headers: {},
      config: {} as never,
    });
    vi.mocked(profileApi.changePassword).mockRejectedValue(axiosErr);

    renderPasswordSection();

    await user.type(screen.getByLabelText('Mật khẩu hiện tại'), 'wrong');
    await user.type(screen.getByLabelText('Mật khẩu mới'), '12345678');
    await user.type(screen.getByLabelText('Nhập lại mật khẩu mới'), '12345678');
    await user.click(screen.getByRole('button', { name: 'Đổi mật khẩu' }));

    await screen.findByText(/Mật khẩu hiện tại không đúng/);

    // Now re-type current password
    await user.type(screen.getByLabelText('Mật khẩu hiện tại'), 'x');

    expect(screen.queryByText(/Mật khẩu hiện tại không đúng/)).not.toBeInTheDocument();
  });
});
