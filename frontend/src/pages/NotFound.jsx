import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="text-center">
        <p className="text-6xl font-bold text-terra mb-4 font-serif">404</p>
        <h1 className="font-serif text-2xl font-bold text-brown mb-2">Page Not Found</h1>
        <p className="text-taupe mb-6 font-sans">The page you're looking for doesn't exist.</p>
        <Link to="/" className="bg-terra text-white px-6 py-2.5 rounded-full hover:bg-terra-dark transition font-sans font-semibold">
          Go Home
        </Link>
      </div>
    </div>
  );
}
