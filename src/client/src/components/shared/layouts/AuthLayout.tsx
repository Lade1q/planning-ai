import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/30 p-4 md:p-8">
      {/* Decorative background grid and blurs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content wrapper */}
      <div className="relative w-full flex justify-center z-10 animate-[fadeIn_0.5s_ease-out]">
        <Outlet />
      </div>
    </div>
  );
}
