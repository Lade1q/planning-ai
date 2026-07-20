import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <div className="p-6 bg-card border border-border rounded-lg max-w-sm w-full text-center">
      <h1 className="text-2xl font-bold mb-4">LoginPage</h1>
      <p className="text-sm text-muted-foreground mb-4">This is a placeholder for the Login Page.</p>
      <div className="flex flex-col gap-2">
        <Link to="/dashboard" className="px-4 py-2 bg-primary text-white rounded text-sm font-medium hover:bg-primary/90">
          Go to Dashboard
        </Link>
        <Link to="/register" className="text-xs text-primary hover:underline">
          Don&apos;t have an account? Register
        </Link>
      </div>
    </div>
  );
}
