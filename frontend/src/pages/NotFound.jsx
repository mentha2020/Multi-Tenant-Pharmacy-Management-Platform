import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-green-600">404</h1>
        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-4">Page Not Found</p>
        <p className="text-gray-500 dark:text-gray-400 mt-2">The page you are looking for does not exist.</p>
        <Link to="/" className="mt-6 inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
          Go Home
        </Link>
      </div>
    </div>
  );
}
