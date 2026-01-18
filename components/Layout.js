import { useRouter } from 'next/router';
import { logout, getCurrentUser } from '../utils/api';

export default function Layout({ children }) {
  const router = useRouter();
  const user = typeof window !== 'undefined' ? getCurrentUser() : null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (router.pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold">🏃 Athlete Tracker</h1>
              <div className="hidden md:flex space-x-4">
                <button
                  onClick={() => router.push('/')}
                  className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => router.push('/leaderboard')}
                  className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Leaderboard
                </button>
                {user?.role === 'coach' && (
                  <button
                    onClick={() => router.push('/athletes')}
                    className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Manage Athletes
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <span className="text-sm">
                    {user.username} ({user.role})
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
