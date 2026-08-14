import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { IdentitySection } from './IdentitySection';
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

describe('IdentitySection', () => {
  // ---------- Monogram ----------

  it('renders uppercase first letter of name as monogram when name exists', () => {
    render(<IdentitySection planCount={2} />, { authUser: BASE_USER });

    // The monogram div is aria-hidden, so query by text content directly.
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('renders lowercase first letter of email prefix as monogram when name is null', () => {
    render(<IdentitySection planCount={0} />, {
      authUser: { ...BASE_USER, name: null },
    });

    expect(screen.getByText('a')).toBeInTheDocument();
  });

  it('renders lowercase monogram when name is whitespace-only', () => {
    render(<IdentitySection planCount={0} />, {
      authUser: { ...BASE_USER, name: '   ' },
    });

    // Whitespace name falls back to email prefix: 'a' (lowercase)
    expect(screen.getByText('a')).toBeInTheDocument();
  });

  // ---------- Display name ----------

  it('renders display name when user has a name', () => {
    render(<IdentitySection planCount={1} />, { authUser: BASE_USER });

    expect(screen.getByText('Alice Nguyen')).toBeInTheDocument();
  });

  it('renders email prefix as display name when name is null', () => {
    render(<IdentitySection planCount={0} />, {
      authUser: { ...BASE_USER, name: null },
    });

    expect(screen.getByText('alice')).toBeInTheDocument();
  });

  // ---------- Join date ----------

  it('shows join date formatted via Intl.DateTimeFormat("vi-VN")', () => {
    render(<IdentitySection planCount={3} />, { authUser: BASE_USER });

    // Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    // for 2026-01-15 produces "15/01/2026"
    const expected = new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date('2026-01-15T00:00:00Z'));

    expect(screen.getByText(new RegExp(expected))).toBeInTheDocument();
  });

  it('shows plan count', () => {
    render(<IdentitySection planCount={5} />, { authUser: BASE_USER });

    expect(screen.getByText(/5 kế hoạch/)).toBeInTheDocument();
  });

  // ---------- Name input ----------

  it('name input has placeholder "Chua dat"', () => {
    render(<IdentitySection planCount={0} />, {
      authUser: { ...BASE_USER, name: null },
    });

    expect(screen.getByPlaceholderText('Chưa đặt')).toBeInTheDocument();
  });

  it('name input is pre-filled with existing name', () => {
    render(<IdentitySection planCount={0} />, { authUser: BASE_USER });

    expect(screen.getByDisplayValue('Alice Nguyen')).toBeInTheDocument();
  });

  // ---------- Email locked ----------

  it('renders email in a non-editable LockedValue (no input for email)', () => {
    render(<IdentitySection planCount={0} />, { authUser: BASE_USER });

    expect(screen.getByText('alice@example.com')).toBeInTheDocument();

    // There should be no input with email value — it is a div, not an input.
    const inputs = screen.getAllByRole('textbox');
    const emailInput = inputs.find((el) => (el as HTMLInputElement).value === 'alice@example.com');
    expect(emailInput).toBeUndefined();
  });

  // ---------- Save ----------

  it('save button calls profileApi.updateName with trimmed name', async () => {
    const user = userEvent.setup();
    vi.mocked(profileApi.updateName).mockResolvedValue({
      ...BASE_USER,
      name: 'Bob',
    });

    render(<IdentitySection planCount={0} />, { authUser: BASE_USER });

    const nameInput = screen.getByPlaceholderText('Chưa đặt');
    await user.clear(nameInput);
    await user.type(nameInput, '  Bob  ');
    await user.click(screen.getByRole('button', { name: 'Lưu tên' }));

    await waitFor(() => {
      expect(profileApi.updateName).toHaveBeenCalledWith({ name: 'Bob' });
    });
  });

  it('empty name (after clearing) saves as null', async () => {
    const user = userEvent.setup();
    vi.mocked(profileApi.updateName).mockResolvedValue({
      ...BASE_USER,
      name: null,
    });

    render(<IdentitySection planCount={0} />, { authUser: BASE_USER });

    const nameInput = screen.getByPlaceholderText('Chưa đặt');
    await user.clear(nameInput);
    await user.click(screen.getByRole('button', { name: 'Lưu tên' }));

    await waitFor(() => {
      expect(profileApi.updateName).toHaveBeenCalledWith({ name: null });
    });
  });

  it('shows error message when save fails', async () => {
    const user = userEvent.setup();
    vi.mocked(profileApi.updateName).mockRejectedValue(new Error('network'));

    render(<IdentitySection planCount={0} />, { authUser: BASE_USER });

    await user.click(screen.getByRole('button', { name: 'Lưu tên' }));

    await screen.findByText('Không thể lưu tên. Vui lòng thử lại.');
  });

  // ---------- Edge cases ----------

  it('renders nothing when user is null (not logged in)', () => {
    const { container } = render(<IdentitySection planCount={0} />, {
      authUser: null,
    });

    expect(container.innerHTML).toBe('');
  });
});
