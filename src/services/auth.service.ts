import api from './api.service';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
  phone?: string;
  address?: string;
  specialization?: string;
}

interface LoginData {
  email: string;
  password: string;
}

const AuthService = {
  register: async (userData: RegisterData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (credentials: LoginData) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  getProfile: async () => {
    return api.get('/auth/me');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default AuthService;