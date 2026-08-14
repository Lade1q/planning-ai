import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { AlertCircle, Check } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { profileApi } from '../api/profile.api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const MIN_PASSWORD_LENGTH = 8;

export function PasswordSection() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const newPasswordTouched = newPassword.length > 0;
  const confirmTouched = confirmPassword.length > 0;

  const passwordValidation = useMemo(() => {
    if (!newPasswordTouched) return { status: 'hint' as const, message: 'Ít nhất 8 ký tự.' };
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      const missing = MIN_PASSWORD_LENGTH - newPassword.length;
      return { status: 'error' as const, message: `Còn thiếu ${missing} ký tự.` };
    }
    return { status: 'ok' as const, message: 'Đủ dài.' };
  }, [newPassword, newPasswordTouched]);

  const confirmMismatch = confirmTouched && newPassword !== confirmPassword;

  const canSubmit =
    currentPassword.length > 0 &&
    newPassword.length >= MIN_PASSWORD_LENGTH &&
    newPassword === confirmPassword &&
    !saving;

  const handleChangePassword = useCallback(async () => {
    if (!canSubmit) return;
    setSaving(true);
    setServerError(null);
    setSuccess(false);
    try {
      await profileApi.changePassword({
        currentPassword,
        newPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess(true);
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.error?.code === 'WRONG_PASSWORD') {
        setServerError('Mật khẩu hiện tại không đúng. Mật khẩu của bạn chưa bị thay đổi.');
      } else {
        setServerError('Đã xảy ra lỗi, vui lòng thử lại.');
      }
    } finally {
      setSaving(false);
    }
  }, [canSubmit, currentPassword, newPassword]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  return (
    <section
      id="bao-mat"
      className="border-border grid gap-3 border-t py-8 max-md:gap-y-4 md:grid-cols-[236px_minmax(0,1fr)] md:gap-x-11"
      style={{ scrollMarginTop: 24 }}
    >
      {/* Aside */}
      <div>
        <h2 className="font-heading mb-1.5 text-[17px] leading-[1.3] tracking-[-0.015em]">
          Mật khẩu &amp; phiên
        </h2>
        <p className="text-muted-foreground mb-2.5 text-[12.5px] leading-[1.7]">
          Đổi mật khẩu cần mật khẩu hiện tại — server so khớp bcrypt trước khi ghi đè, không phải
          kiểm ở client.
        </p>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-muted-foreground border-border bg-card rounded-[4px] border px-1.5 py-px font-mono text-[11px]">
            AM-03
          </span>
          <span className="text-muted-foreground border-border bg-card rounded-[4px] border px-1.5 py-px font-mono text-[11px]">
            AM-04
          </span>
        </div>
      </div>

      {/* Controls */}
      <div>
        {/* Current password */}
        <div className="mb-4.5 max-w-[360px]">
          <Label htmlFor="pw-old" className="mb-1.5 text-[12.5px]">
            Mật khẩu hiện tại
          </Label>
          <Input
            id="pw-old"
            type="password"
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              setServerError(null);
            }}
            aria-invalid={!!serverError || undefined}
            aria-describedby={serverError ? 'pw-old-error' : undefined}
          />
          {serverError && (
            <p
              id="pw-old-error"
              className="text-mastery-weak mt-1.5 flex items-start gap-1.5 text-[12px] leading-[1.6]"
            >
              <AlertCircle size={13} className="mt-0.5 flex-none" aria-hidden="true" />
              {serverError}
            </p>
          )}
        </div>

        {/* New password */}
        <div className="mb-4.5 max-w-[360px]">
          <Label htmlFor="pw-new" className="mb-1.5 text-[12.5px]">
            Mật khẩu mới
          </Label>
          <Input
            id="pw-new"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            aria-invalid={passwordValidation.status === 'error' || undefined}
            aria-describedby="pw-new-hint"
          />
          {passwordValidation.status === 'hint' && (
            <p id="pw-new-hint" className="text-muted-foreground mt-1.5 text-[12px] leading-[1.65]">
              {passwordValidation.message}
            </p>
          )}
          {passwordValidation.status === 'error' && (
            <p
              id="pw-new-hint"
              className="text-mastery-weak mt-1.5 flex items-start gap-1.5 text-[12px] leading-[1.6]"
            >
              <AlertCircle size={13} className="mt-0.5 flex-none" aria-hidden="true" />
              {passwordValidation.message}
            </p>
          )}
          {passwordValidation.status === 'ok' && (
            <p
              id="pw-new-hint"
              className="text-mastery-strong mt-1.5 flex items-center gap-1.5 text-[12px]"
            >
              <Check size={13} className="flex-none" aria-hidden="true" />
              {passwordValidation.message}
            </p>
          )}
        </div>

        {/* Confirm password */}
        <div className="mb-4.5 max-w-[360px]">
          <Label htmlFor="pw-confirm" className="mb-1.5 text-[12.5px]">
            Nhập lại mật khẩu mới
          </Label>
          <Input
            id="pw-confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            aria-invalid={confirmMismatch || undefined}
            aria-describedby={confirmMismatch ? 'pw-confirm-error' : undefined}
          />
          {confirmMismatch && (
            <p
              id="pw-confirm-error"
              className="text-mastery-weak mt-1.5 flex items-start gap-1.5 text-[12px] leading-[1.6]"
            >
              <AlertCircle size={13} className="mt-0.5 flex-none" aria-hidden="true" />
              Mật khẩu không khớp.
            </p>
          )}
        </div>

        {/* Save */}
        <div className="mt-5.5 flex items-center gap-3.5">
          <Button onClick={handleChangePassword} loading={saving} disabled={!canSubmit}>
            Đổi mật khẩu
          </Button>
          {success && <p className="text-mastery-strong text-[12px]">Đổi mật khẩu thành công.</p>}
        </div>

        {/* Divider */}
        <div className="bg-border my-6.5 h-px max-w-[560px]" />

        {/* Logout (AM-04) */}
        <div className="flex max-w-[560px] items-center justify-between gap-6">
          <div>
            <span className="block text-[12.5px] font-medium">Đăng xuất khỏi thiết bị này</span>
            <p className="text-muted-foreground mt-1 text-[12px] leading-[1.65]">
              Xóa token ở client và quay về trang đăng nhập.
            </p>
          </div>
          <Button variant="secondary" onClick={handleLogout} className="flex-none">
            Đăng xuất
          </Button>
        </div>
      </div>
    </section>
  );
}
