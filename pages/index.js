import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '../components/ProtectedRoute';
import { getLeaderboard, getCurrentUser } from '../utils/api';

export default function Dashboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const user = typeof window !== 'undefined' ? getCurrentUser() : null;

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const response = await getLeaderboard();
      setLeaderboard(response.data);
    } catch (err) {
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.username}! 👋</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Athletes</p>
                <p className="text-2xl font-semibold text-gray-900">{leaderboard.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <span className="text-2xl">🏆</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Top Score</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {leaderboard[0]?.total_score?.toFixed(1) || '0'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Score</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {leaderboard.length > 0
                    ? (leaderboard.reduce((sum, a) => sum + (a.total_score || 0), 0) / leaderboard.length).toFixed(1)
                    : '0'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => router.push('/leaderboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg p-6 text-left transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">View Leaderboard</h3>
                <p className="text-blue-100">See rankings and performance</p>
              </div>
              <span className="text-4xl">📈</span>
            </div>
          </button>

          {user?.role === 'coach' && (
            <button
              onClick={() => router.push('/athletes')}
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg p-6 text-left transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Manage Athletes</h3>
                  <p className="text-green-100">Add, edit, and track athletes</p>
                </div>
                <span className="text-4xl">⚙️</span>
              </div>
            </button>
          )}
        </div>

        {/* Top 5 Preview */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Top 5 Athletes</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {leaderboard.slice(0, 5).map((athlete) => (
                <div key={athlete.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-gray-400">#{athlete.rank}</span>
                    <div>
                      <p className="font-medium text-gray-900">{athlete.name}</p>
                      <p className="text-sm text-gray-500">
                        {athlete.tests_completed} tests completed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{athlete.total_score.toFixed(1)}</p>
                      <p className="text-xs text-gray-500">score</p>
                    </div>
                    <span className="text-3xl">{athlete.badge.icon}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
