import { useState, useEffect } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { getLeaderboard } from '../utils/api';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

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

  const filteredLeaderboard = leaderboard.filter(athlete => {
    if (filter === 'all') return true;
    return athlete.sport?.toLowerCase() === filter.toLowerCase();
  });

  const getRankColor = (rank) => {
    if (rank === 1) return 'bg-yellow-100 border-yellow-300';
    if (rank === 2) return 'bg-gray-100 border-gray-300';
    if (rank === 3) return 'bg-orange-100 border-orange-300';
    return 'bg-white border-gray-200';
  };

  return (
    <ProtectedRoute>
      <div className="px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🏆 Leaderboard</h1>
          <p className="text-gray-600">Athlete performance rankings</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Filter by sport:</span>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {Array.from(new Set(leaderboard.map(a => a.sport).filter(Boolean))).map(sport => (
              <button
                key={sport}
                onClick={() => setFilter(sport)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === sport ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {sport}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard Table */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            Loading leaderboard...
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-red-500">
            {error}
          </div>
        ) : filteredLeaderboard.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No athletes found
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Athlete
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sport
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tests
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Badge
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeaderboard.map((athlete, index) => (
                  <tr
                    key={athlete.id}
                    className={`${getRankColor(athlete.rank)} border-l-4 hover:bg-opacity-75 transition`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-gray-700">#{athlete.rank}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{athlete.name}</div>
                        {athlete.age && (
                          <div className="text-sm text-gray-500">{athlete.age} years old</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {athlete.sport || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {athlete.tests_completed} completed
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {athlete.total_score.toFixed(1)}
                        </div>
                        <div className="ml-2 text-xs text-gray-500">/ 100</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{athlete.badge.icon}</span>
                        <span className="text-sm font-medium text-gray-700">{athlete.badge.name}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Badge System</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🥇</span>
              <span className="text-sm text-gray-600">Gold Champion - 1st Place</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🥈</span>
              <span className="text-sm text-gray-600">Silver Star - 2nd Place</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🥉</span>
              <span className="text-sm text-gray-600">Bronze Winner - 3rd Place</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⭐</span>
              <span className="text-sm text-gray-600">Elite Athlete - Score ≥ 80</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🔥</span>
              <span className="text-sm text-gray-600">Advanced Performer - Score ≥ 60</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🌟</span>
              <span className="text-sm text-gray-600">Rising Star - Score ≥ 40</span>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
