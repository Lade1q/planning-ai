import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-2">NotFoundPage</h1>
      <p className="text-sm text-muted-foreground mb-4">The page you are looking for does not exist.</p>
      <Link to="/dashboard" className="px-4 py-2 bg-primary text-white rounded text-sm font-medium hover:bg-primary/90">
        Back to Dashboard
      </Link>
    </div>
  );
}
