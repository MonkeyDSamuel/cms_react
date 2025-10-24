import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Basic token storage helpers
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setTokens({ access, refresh }) {
  if (access) localStorage.setItem(ACCESS_TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

function isTokenExpired(token) {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    if (!exp) return false;
    const now = Math.floor(Date.now() / 1000);
    // Consider token expired if within 5 seconds of expiry
    return exp - now < 5;
  } catch (_) {
    return true;
  }
}

const api = axios.create({
  baseURL: '/api/', // Admin backend API base (e.g., http://localhost:8000/api/ via proxy)
  headers: { 'Content-Type': 'application/json' },
});

const authApi = axios.create({
  baseURL: '/auth/', // Authentication endpoints base
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor to attach access token
api.interceptors.request.use(async (config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401 and refresh
let isRefreshing = false;
let pendingQueue = [];

function processQueue(error, token = null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  pendingQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;
      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        if (!refreshToken || isTokenExpired(refreshToken)) {
          clearTokens();
          processQueue(new Error('Refresh token missing/expired'));
          return Promise.reject(error);
        }

        const res = await authApi.post('refresh/', { refresh: refreshToken });
        const newAccess = res.data?.access || res.data?.token || res.data?.access_token;
        if (!newAccess) throw new Error('No access token returned');
        setTokens({ access: newAccess });
        processQueue(null, newAccess);
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (err) {
        clearTokens();
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const AuthService = {
  async login({ username, password, role }) {
    // Backend expects username/password at /auth/login/
    const res = await authApi.post('login/', { username, password, role });
    // Accept flexible token shapes
    const data = res.data || {};
    const access = data.access || data.token || data.access_token;
    const refresh = data.refresh || data.refresh_token;
    if (access) setTokens({ access, refresh });
    return data;
  },
  async logout() {
    try {
      await authApi.post('logout/');
    } finally {
      clearTokens();
    }
  },
  getProfile() {
    return authApi.get('profile/');
  },
  checkRole() {
    return authApi.get('check-role/');
  },
};

// Admin staff API
export const StaffApi = {
  getAll() {
    return api.get('staff/');
  },
  getById(staffId) {
    return api.get(`staff/${staffId}/`);
  },
  add(payload) {
    return api.post('staff/add/', payload);
  },
  update(payload) {
    return api.put('staff/update/', payload);
  },
  deactivate(staffId) {
    return api.post('staff/deactive/', { staff_id: staffId });
  },
};

// Doctor API
export const DoctorApi = {
  getAll() {
    return api.get('doctor/');
  },
  getById(doctorId) {
    return api.get(`doctor/${doctorId}/`);
  },
  create(payload) {
    return api.post('doctor/create/', payload);
  },
  update(payload) {
    return api.put('doctor/update/', payload);
  },
};

// Specialization API
export const SpecializationApi = {
  getAll() {
    console.log('Making GET request to: /api/specialization/');
    return api.get('specialization/');
  },
  add(payload) {
    console.log('Making POST request to: /api/specialization/add/ with payload:', payload);
    console.log('Full URL will be: http://127.0.0.1:8000/api/specialization/add/');
    console.log('Payload type:', typeof payload);
    console.log('Payload stringified:', JSON.stringify(payload));
    return api.post('specialization/add/', payload, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => {
        console.log('Specialization API add response:', response);
        return response;
      })
      .catch(error => {
        console.error('Specialization API add error:', error);
        console.error('Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        });
        console.error('Full error response:', error.response);
        console.error('Request config:', error.config);
        throw error;
      });
  },
};

export default api;


