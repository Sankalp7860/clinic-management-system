import api from './api.service';

interface UserData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  specialization?: string;
  experience?: string;
}

const UserService = {
  getDoctors: async () => {
    const response = await api.get('/users/doctors');
    return response.data;
  },

  // Get only verified doctors for patients
  getVerifiedDoctors: async () => {
    const response = await api.get('/users/doctors/verified');
    return response.data;
  },

  // Get unverified doctors for admin
  getUnverifiedDoctors: async () => {
    const response = await api.get('/users/doctors/unverified');
    return response.data;
  },

  // Get all users (for admin)
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getUser: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, userData: Partial<UserData>) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Verify a doctor (admin only)
  verifyDoctor: async (id: string) => {
    const response = await api.put(`/users/doctors/${id}/verify`);
    return response.data;
  }
};

export default UserService;