import api from './api.service';

interface UserData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  specialization?: string;
}

const UserService = {
  getDoctors: async () => {
    const response = await api.get('/users/doctors');
    return response.data;
  },

  getUser: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, userData: Partial<UserData>) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  }
};

export default UserService;