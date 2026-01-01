import { apiClient } from './apiClient';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mechanicService = {
    fetchAvailableInspections: async () => {
        // Fetches available inspections for the mechanic dashboard
        const response = await apiClient.get('/inspections/available');
        return response.data;
    },
    updateInspectionStatus: async (id, status) => {
        const response = await apiClient.put(`/inspections/${id}/status`, { status });
        return response.data;
    },
    fetchMyInspections: async () => {
        // Fetches inspections accepted by the mechanic
        const response = await apiClient.get('/inspections/mechanic');
        return response.data;
    },
    submitInspectionReport: async (id, data) => {
        const response = await apiClient.post(`/inspections/${id}/report`, data);
        return response.data;
    }
};