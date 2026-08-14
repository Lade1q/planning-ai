import { useState, useCallback } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { profileApi } from '../api/profile.api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LockedValue } from '@/components/ui/locked-value';
import { Label } from '@/components/ui/label';

interface IdentitySectionProps {
  planCount: number;
}

function getEmailPrefix(email: string): string {
  return email.split('@')[0];
}

function getMonogram(name: string | null, email: string): { char: string; isEmail: boolean } {
  if (name && name.trim()) {
    return { char: name.trim()[0].toUpperCase(), isEmail: false };
  }
  return { char: getEmailPrefix(email)[0].toLowerCase(), isEmail: true };
}

function formatJoinDate(isoDate: string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(isoDate));
}

export function IdentitySection({ planCount }: IdentitySectionProps) {
  const { user, updateUser } = useAuth();
  const [nameInput, setNameInput] = useState(user?.name ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const monogram = user ? getMonogram(user.name, user.email) : { char: '?', isEmail: true };
  const displayName = user?.name?.trim() || getEmailPrefix(user?.email ?? '');

  const handleSave = useCallback(async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      const trimmed = nameInput.trim();
      const result = await profileApi.updateName({ name: trimmed || null });
      updateUser({ name: result.name });
    } catch {
      setError('Không thể lưu tên. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  }, [nameInput, user, updateUser]);

  if (!user) return null;

  return (
    <section
      id="danh-tinh"
      className="border-border grid gap-3 pb-8 pt-0 max-md:gap-y-4 md:grid-cols-[236px_minmax(0,1fr)] md:gap-x-11"
      style={{ scrollMarginTop: 24 }}
    >
      {/* Aside */}
      <div>
        <h2 className="font-heading mb-1.5 text-[17px] leading-[1.3] tracking-[-0.015em]">
          Danh tính
        </h2>
        <p className="text-muted-foreground mb-2.5 text-[12.5px] leading-[1.7]">
          Tên hiển thị dùng trong lời chào ở Tổng quan. Email là thứ dùng để đăng nhập, nên nó không
          sửa được tại đây.
        </p>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-muted-foreground border-border bg-card rounded-[4px] border px-1.5 py-px font-mono text-[11px]">
            AM-03
          </span>
          <span className="text-muted-foreground border-border bg-card rounded-[4px] border px-1.5 py-px font-mono text-[11px]">
            users.name
          </span>
        </div>
      </div>

      {/* Controls */}
      <div>
        {/* Who row */}
        <div className="mb-6 flex items-center gap-3.5">
          <div
            className={`bg-secondary border-border grid size-[52px] flex-none place-items-center rounded-[calc(var(--radius)*0.9)] border ${
              monogram.isEmail
                ? 'text-muted-foreground font-mono text-[17px]'
                : 'font-heading text-[19px] tracking-[-0.01em]'
            }`}
            aria-hidden="true"
          >
            {monogram.char}
          </div>
          <div>
            <div
              className={`text-[15px] font-semibold leading-[1.35] ${
                !user.name?.trim() ? 'text-muted-foreground font-medium' : ''
              }`}
            >
              {displayName}
            </div>
            <div className="text-muted-foreground font-mono text-[11.5px]">
              {user.createdAt && `Tham gia ${formatJoinDate(user.createdAt)} · `}
              {planCount} kế hoạch
            </div>
          </div>
        </div>

        {/* Name input */}
        <div className="mb-4.5 max-w-[360px]">
          <Label htmlFor="profile-name" className="mb-1.5 text-[12.5px]">
            Tên hiển thị
          </Label>
          <Input
            id="profile-name"
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Chưa đặt"
            maxLength={100}
          />
          <p className="text-muted-foreground mt-1.5 text-[12px] leading-[1.65]">
            Cột{' '}
            <code className="bg-muted border-border rounded-[4px] border px-1 py-px font-mono text-[11.5px]">
              name
            </code>{' '}
            cho phép rỗng. Bỏ trống thì hệ thống dùng phần đầu của email.
          </p>
        </div>

        {/* Email locked */}
        <div className="mb-4.5 max-w-[360px]">
          <span className="mb-1.5 block text-[12.5px] font-medium">Email đăng nhập</span>
          <LockedValue>{user.email}</LockedValue>
          <p className="text-muted-foreground mt-1.5 text-[12px] leading-[1.65]">
            Email vừa là định danh đăng nhập vừa là khóa duy nhất của tài khoản. Chưa có luồng đổi
            email nên trang này không mở nó ra.
          </p>
        </div>

        {/* Save */}
        <div className="mt-5.5 flex items-center gap-3.5">
          <Button onClick={handleSave} loading={saving}>
            Lưu tên
          </Button>
          {error && <p className="text-mastery-weak text-[12px]">{error}</p>}
        </div>
      </div>
    </section>
  );
}
