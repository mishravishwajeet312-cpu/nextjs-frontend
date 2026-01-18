import { useState, useEffect } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { getAthletes, createAthlete, updateAthlete, deleteAthlete, getTestTypes, addScore, getCurrentUser } from '../utils/api';

export default function Athletes() {
  const [athletes, setAthletes] = useState([]);
  const [testTypes, setTestTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAthleteForm, setShowAthleteForm] = useState(false);
  const [showScoreForm, setShowScoreForm] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [athleteForm, setAthleteForm] = useState({ name: '', age: '', sport: '' });
  const [scoreForm, setScoreForm] = useState({ athlete_id: '', test_type_id: '', value: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [athletesRes, testTypesRes] = await Promise.all([
        getAthletes(),
        getTestTypes()
      ]);
      setAthletes(athletesRes.data);
      setTestTypes(testTypesRes.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAthlete = async (e) => {
    e.preventDefault();
    try {
      await createAthlete(athleteForm);
      setSuccess('Athlete created successfully!');
      setAthleteForm({ name: '', age: '', sport: '' });
      setShowAthleteForm(false);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create athlete');
    }
  };

  const handleUpdateAthlete = async (e) => {
    e.preventDefault();
    try {
      await updateAthlete(selectedAthlete.id, athleteForm);
      setSuccess('Athlete updated successfully!');
      setAthleteForm({ name: '', age: '', sport: '' });
      setShowAthleteForm(false);
      setSelectedAthlete(null);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update athlete');
    }
  };

  const handleDeleteAthlete = async (id) => {
    if (!confirm('Are you sure you want to delete this athlete?')) return;
    try {
      await deleteAthlete(id);
      setSuccess('Athlete deleted successfully!');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete athlete');
    }
  };

  const handleAddScore = async (e) => {
    e.preventDefault();
    try {
      await addScore({
        athlete_id: parseInt(scoreForm.athlete_id),
        test_type_id: parseInt(scoreForm.test_type_id),
        value: parseFloat(scoreForm.value)
      });
      setSuccess('Score added successfully!');
      setScoreForm({ athlete_id: '', test_type_id: '', value: '' });
      setShowScoreForm(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add score');
    }
  };

  const startEdit = (athlete) => {
    setSelectedAthlete(athlete);
    setAthleteForm({ name: athlete.name, age: athlete.age || '', sport: athlete.sport || '' });
    setShowAthleteForm(true);
  };

  const cancelEdit = () => {
    setSelectedAthlete(null);
    setAthleteForm({ name: '', age: '', sport: '' });
    setShowAthleteForm(false);
  };

  return (
    <ProtectedRoute requireCoach={true}>
      <div className="px-4 py-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Athletes</h1>
            <p className="text-gray-600">Create, update, and track athlete performance</p>
          </div>
          <div className="space-x-4">
            <button
              onClick={() => setShowScoreForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
            >
              + Add Test Score
            </button>
            <button
              onClick={() => setShowAthleteForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
            >
              + New Athlete
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Athlete Form Modal */}
        {showAthleteForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">
                {selectedAthlete ? 'Edit Athlete' : 'New Athlete'}
              </h2>
              <form onSubmit={selectedAthlete ? handleUpdateAthlete : handleCreateAthlete}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={athleteForm.name}
                      onChange={(e) => setAthleteForm({ ...athleteForm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      value={athleteForm.age}
                      onChange={(e) => setAthleteForm({ ...athleteForm, age: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sport
                    </label>
                    <input
                      type="text"
                      value={athleteForm.sport}
                      onChange={(e) => setAthleteForm({ ...athleteForm, sport: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-6 flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
                  >
                    {selectedAthlete ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Score Form Modal */}
        {showScoreForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Add Test Score</h2>
              <form onSubmit={handleAddScore}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Athlete *
                    </label>
                    <select
                      value={scoreForm.athlete_id}
                      onChange={(e) => setScoreForm({ ...scoreForm, athlete_id: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select athlete...</option>
                      {athletes.map(athlete => (
                        <option key={athlete.id} value={athlete.id}>{athlete.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Test Type *
                    </label>
                    <select
                      value={scoreForm.test_type_id}
                      onChange={(e) => setScoreForm({ ...scoreForm, test_type_id: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select test...</option>
                      {testTypes.map(test => (
                        <option key={test.id} value={test.id}>
                          {test.name} ({test.unit})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Value *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={scoreForm.value}
                      onChange={(e) => setScoreForm({ ...scoreForm, value: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
                  >
                    Add Score
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowScoreForm(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Athletes List */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            Loading athletes...
          </div>
        ) : athletes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No athletes yet. Click "New Athlete" to add one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {athletes.map(athlete => (
              <div key={athlete.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{athlete.name}</h3>
                    {athlete.age && <p className="text-sm text-gray-500">{athlete.age} years old</p>}
                  </div>
                  {athlete.sport && (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {athlete.sport}
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEdit(athlete)}
                    className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAthlete(athlete.id)}
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
