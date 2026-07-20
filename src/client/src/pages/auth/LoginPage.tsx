import { Link } from 'react-router-dom';

/** Trang đăng nhập - placeholder, sẽ được xây dựng đầy đủ ở issues sau. */
export default function LoginPage() {
  return (
    <div className="bg-card border-border w-full max-w-sm rounded-xl border p-6 text-center shadow-sm">
      <h1 className="mb-2 text-2xl font-bold">Login</h1>
      <p className="text-muted-foreground mb-6 text-sm">Placeholder</p>
      <div className="flex flex-col gap-2">
        <Link
          to="/dashboard"
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium transition-colors"
        >
          Go to Dashboard
        </Link>
        <Link to="/register" className="text-primary text-xs hover:underline">
          Don&apos;t have an account? Register
        </Link>
      </div>
    </div>
  );
}
