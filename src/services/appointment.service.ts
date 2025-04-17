import api from './api.service';

interface AppointmentData {
  doctor: string;
  date: string;
  time: string;
  reason: string;
  notes?: string;
  patient?: string;
  status?: 'upcoming' | 'completed' | 'cancelled';
}

const AppointmentService = {
  getAppointments: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },

  getAppointment: async (id: string) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  createAppointment: async (appointmentData: AppointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  updateAppointment: async (id: string, appointmentData: Partial<AppointmentData>) => {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },

  cancelAppointment: async (id: string) => {
    const response = await api.put(`/appointments/${id}`, { status: 'cancelled' });
    return response.data;
  }
};

export default AppointmentService;