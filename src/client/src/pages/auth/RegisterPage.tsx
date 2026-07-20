import { Link } from 'react-router-dom';

/** Trang đăng ký — placeholder, sẽ được xây dựng đầy đủ ở Sprint 2. */
export default function RegisterPage() {
  return (
    <div className="bg-card border-border w-full max-w-sm rounded-xl border p-6 text-center shadow-sm">
      <h1 className="mb-2 text-2xl font-bold">Register</h1>
      <p className="text-muted-foreground mb-6 text-sm">Placeholder - Sprint 2</p>
      <div className="flex flex-col gap-2">
        <Link
          to="/dashboard"
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium transition-colors"
        >
          Go to Dashboard
        </Link>
        <Link to="/login" className="text-primary text-xs hover:underline">
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
}
