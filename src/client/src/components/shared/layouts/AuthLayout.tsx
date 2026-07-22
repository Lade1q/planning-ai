import { Outlet } from 'react-router-dom';

/**
 * Layout cho các trang xác thực (Login, Register).
 * Content được căn giữa màn hình với hiệu ứng nền trang trí.
 * Sử dụng Outlet để render page con qua React Router nested routes.
 */
export function AuthLayout() {
  return (
    <div className="bg-background relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4 md:p-8">
      {/* Decorative background grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-30 mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Decorative blur orbs */}
      <div className="bg-primary/10 pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 rounded-full blur-3xl" />
      <div className="bg-accent/10 pointer-events-none absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full blur-3xl" />

      {/* Page content */}
      <div className="relative z-10 flex w-full justify-center">
        <Outlet />
      </div>
    </div>
  );
}
