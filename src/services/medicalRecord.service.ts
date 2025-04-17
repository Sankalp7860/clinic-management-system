import api from './api.service';

interface Prescription {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface MedicalRecordData {
  patient: string;
  doctor: string;
  appointment?: string;
  diagnosis: string;
  prescription: Prescription[];
  notes?: string;
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
}

const MedicalRecordService = {
  getMedicalRecords: async () => {
    const response = await api.get('/medical-records');
    return response.data;
  },

  getMedicalRecord: async (id: string) => {
    const response = await api.get(`/medical-records/${id}`);
    return response.data;
  },

  createMedicalRecord: async (recordData: MedicalRecordData) => {
    const response = await api.post('/medical-records', recordData);
    return response.data;
  },

  updateMedicalRecord: async (id: string, recordData: Partial<MedicalRecordData>) => {
    const response = await api.put(`/medical-records/${id}`, recordData);
    return response.data;
  }
};

export default MedicalRecordService;