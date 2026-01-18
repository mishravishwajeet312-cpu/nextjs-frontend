import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Athletes
export const getAthletes = () => api.get('/athletes');
export const getAthlete = (id) => api.get(`/athletes/${id}`);
export const createAthlete = (data) => api.post('/athletes', data);
export const updateAthlete = (id, data) => api.put(`/athletes/${id}`, data);
export const deleteAthlete = (id) => api.delete(`/athletes/${id}`);

// Scores
export const getAthleteScores = (athleteId) => api.get(`/scores/athlete/${athleteId}`);
export const addScore = (data) => api.post('/scores', data);
export const deleteScore = (id) => api.delete(`/scores/${id}`);

// Test Types
export const getTestTypes = () => api.get('/test-types');

// Leaderboard
export const getLeaderboard = () => api.get('/leaderboard');
export const getAthleteStats = (id) => api.get(`/leaderboard/athlete/${id}`);

export default api;
