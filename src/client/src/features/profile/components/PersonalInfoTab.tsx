import { useState, useCallback } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { profileApi } from '../api/profile.api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { LockedValue } from '@/components/ui/locked-value';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

function formatJoinDate(isoDate: string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(isoDate));
}

export function PersonalInfoTab() {
  const { user, updateUser } = useAuth();
  const [fullNameInput, setFullNameInput] = useState('');
  const [nameInput, setNameInput] = useState(user?.name ?? '');
  const [phoneInput, setPhoneInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFullNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFullNameInput(value);
    setNameInput(value);
  }, []);

  const handleSave = useCallback(async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      const trimmed = nameInput.trim();
      const result = await profileApi.updateName({ name: trimmed || null });
      updateUser({ name: result.name });
    } catch {
      setError('Không thể lưu. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  }, [nameInput, user, updateUser]);

  if (!user) return null;

  return (
    <Card>
      <CardContent className="space-y-5 pt-2">
        <div className="max-w-[440px]">
          <Label htmlFor="profile-fullname" className="mb-2 text-[13px] font-semibold">
            Họ và tên
          </Label>
          <Input
            id="profile-fullname"
            type="text"
            value={fullNameInput}
            onChange={handleFullNameChange}
            placeholder="Nguyễn Văn A"
            maxLength={100}
          />
          <p className="text-muted-foreground mt-1.5 text-[12px] leading-[1.6]">Không bắt buộc.</p>
        </div>

        <div className="max-w-[440px]">
          <Label htmlFor="profile-name" className="mb-2 text-[13px] font-semibold">
            Tên hiển thị <span className="text-destructive ml-0.5">*</span>
          </Label>
          <Input
            id="profile-name"
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Chưa đặt"
            maxLength={100}
          />
          <p className="text-muted-foreground mt-1.5 text-[12px] leading-[1.6]">
            Bỏ trống thì hệ thống dùng phần đầu của email.
          </p>
        </div>

        <div className="max-w-[440px]">
          <Label htmlFor="profile-phone" className="mb-2 text-[13px] font-semibold">
            Số điện thoại
          </Label>
          <Input
            id="profile-phone"
            type="tel"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            placeholder="0123 456 789"
            maxLength={15}
          />
          <p className="text-muted-foreground mt-1.5 text-[12px] leading-[1.6]">Không bắt buộc.</p>
        </div>

        <div className="max-w-[440px]">
          <span className="mb-2 block text-[13px] font-semibold">Email</span>
          <LockedValue>{user.email}</LockedValue>
        </div>

        <div className="max-w-[440px]">
          <span className="mb-2 block text-[13px] font-semibold">Tham gia</span>
          <span className="text-muted-foreground font-mono text-[13px]">
            {user.createdAt ? formatJoinDate(user.createdAt) : '—'}
          </span>
        </div>
      </CardContent>

      <CardFooter className="justify-end gap-3.5">
        {error && <p className="text-mastery-weak text-[12px]">{error}</p>}
        <Button onClick={handleSave} loading={saving}>
          Lưu thay đổi
        </Button>
      </CardFooter>
    </Card>
  );
}
