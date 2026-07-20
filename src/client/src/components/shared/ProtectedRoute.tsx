import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

/**
 * Bảo vệ nhóm route cần đăng nhập bằng Outlet pattern.
 * - Đang verify token: hiển thị loading spinner.
 * - Chưa xác thực: redirect về /login (lưu lại vị trí hiện tại để redirect sau khi login).
 * - Đã xác thực: render route con qua <Outlet />.
 */
export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
