import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Heading } from '@/components/ui/heading';
import { IdentitySection } from '@/features/profile/components/IdentitySection';
import { PomodoroSection } from '@/features/profile/components/PomodoroSection';
import { PasswordSection } from '@/features/profile/components/PasswordSection';
import { planApi } from '@/features/study-planner/api/plan.api';

export default function ProfilePage() {
  const location = useLocation();
  const [planCount, setPlanCount] = useState(0);

  useEffect(() => {
    planApi
      .listPlans()
      .then((plans) => setPlanCount(plans.length))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.hash]);

  return (
    <div className="max-w-[900px]">
      <div className="mb-8">
        <Heading as="h1" size="page" className="mb-2">
          Hồ sơ
        </Heading>
        <p className="text-muted-foreground max-w-[620px] text-sm">
          Nơi duy nhất ghi vào bản ghi tài khoản. Ba nhóm dưới đây tương ứng đúng ba thứ được lưu
          trên bảng{' '}
          <code className="bg-muted border-border rounded-[4px] border px-1 py-px font-mono text-[11.5px]">
            users
          </code>
          : danh tính, cấu hình Pomodoro và mật khẩu.
        </p>
      </div>

      <div className="flex flex-col">
        <IdentitySection planCount={planCount} />
        <PomodoroSection />
        <PasswordSection />
      </div>
    </div>
  );
}
