import api from './api.service';

export interface UtilityRequestData {
  itemName: string;
  itemType: 'Equipment' | 'Medicine' | 'Consumable' | 'Device' | 'Other';
  quantity: number;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  reason: string;
}

export interface UtilityRequest extends UtilityRequestData {
  id: string;
  doctor: {
    id: string;
    name: string;
    email: string;
    specialization: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

const UtilityRequestService = {
  // Create a new utility request
  createUtilityRequest: async (requestData: UtilityRequestData) => {
    const response = await api.post('/utility-requests', requestData);
    return response.data;
  },

  // Get all utility requests (for admin) or doctor's own requests
  getUtilityRequests: async () => {
    const response = await api.get('/utility-requests');
    return response.data;
  },

  // Get a single utility request by ID
  getUtilityRequest: async (id: string) => {
    const response = await api.get(`/utility-requests/${id}`);
    return response.data;
  },

  // Update utility request status (admin only)
  updateUtilityRequestStatus: async (id: string, status: 'approved' | 'rejected', adminNotes?: string) => {
    console.log("Sending update request with ID:", id); // Add this debug log
    
    if (!id) {
      throw new Error("Request ID is undefined");
    }
    
    const response = await api.put(`/utility-requests/${id}`, { status, adminNotes });
    return response.data;
  },

  // Delete a utility request (admin only)
  deleteUtilityRequest: async (id: string) => {
    const response = await api.delete(`/utility-requests/${id}`);
    return response.data;
  }
};

export default UtilityRequestService;