import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen w-screen px-4">
      <div className="text-center max-w-md">
        <h1 className="text-7xl font-extrabold text-indigo-500 mb-6">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Oops! Page not found</h2>
        <p className="text-md md:text-lg text-gray-700 mb-8">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white px-6 py-3 rounded-lg text-sm md:text-base font-medium"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

export default NotFoundPage;
