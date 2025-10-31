import axios from 'axios';

/**
 * API Configuration
 * Central place for all API calls
 */

// Base API URL - update this when deployed
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000';

// Create axios instance with defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * AUTH API CALLS
 */
export const authAPI = {
  signup: async (username: string, email: string, password: string) => {
    const response = await api.post('/api/auth/signup', {
      username,
      email,
      password,
    });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },
};

/**
 * TOPICS API CALLS
 */
export const topicsAPI = {
  getAll: async () => {
    const response = await api.get('/api/topics');
    return response.data;
  },

  getBySlug: async (slug: string) => {
    const response = await api.get(`/api/topics/${slug}`);
    return response.data;
  },
};

/**
 * QUIZ API CALLS
 */
export const quizAPI = {
  start: async (topicSlug: string, limit: number = 10) => {
    const response = await api.get(`/api/quiz/start/${topicSlug}`, {
      params: { limit },
    });
    return response.data;
  },

  submit: async (
    topicSlug: string,
    answers: Array<{
      question_id: string;
      selected_answer: number;
      time_taken: number;
    }>,
    totalTime: number
  ) => {
    const response = await api.post('/api/quiz/submit', {
      topic_slug: topicSlug,
      answers,
      total_time: totalTime,
    });
    return response.data;
  },

  getHistory: async (limit: number = 10) => {
    const response = await api.get('/api/quiz/history', {
      params: { limit },
    });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/api/quiz/stats');
    return response.data;
  },
};
/**
 * LEADERBOARD API CALLS
 */
export const leaderboardAPI = {
  getGlobal: async (limit: number = 10) => {
    const response = await api.get('/api/leaderboard/global', {
      params: { limit },
    });
    return response.data;
  },

  getToday: async (limit: number = 10) => {
    const response = await api.get('/api/leaderboard/today', {
      params: { limit },
    });
    return response.data;
  },

  getByTopic: async (topicId: string, limit: number = 10) => {
    const response = await api.get(`/api/leaderboard/topic/${topicId}`, {
      params: { limit },
    });
    return response.data;
  },

  getUserRank: async (userId: string) => {
    const response = await api.get(`/api/leaderboard/user/${userId}`);
    return response.data;
  },
};

export default api;