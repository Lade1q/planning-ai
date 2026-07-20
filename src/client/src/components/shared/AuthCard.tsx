import { Card } from '@/components/ui/card';

interface AuthCardProps {
  children: React.ReactNode;
}

/**
 * Container wrapper cho các trang xác thực (Login, Register).
 * Tách riêng để khi Figma cập nhật layout cơ bản (split-panel, full-page, v.v.)
 * chỉ cần sửa file này, không đụng đến LoginPage hay RegisterPage.
 */
export function AuthCard({ children }: AuthCardProps) {
  return <Card className="mx-auto w-full max-w-sm rounded-xl shadow-sm">{children}</Card>;
}
