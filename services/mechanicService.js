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
    },

    fetchPartMarket: async (page = 1, limit = 10) => {
        const response = await apiClient.get(`/products/dashboard`, {
            params: {
                bikePage: 1,
                bikeLimit: 1,
                accPage: page,
                accLimit: limit
            }
        });
        return response.data.accessories;
    },
    // --- Cart Operations ---
    fetchCart: async () => {
        const response = await apiClient.get('/orders/cart');
        return response.data;
    },

    addToCart: async (productId, quantity) => {
        const response = await apiClient.post('/orders/cart', { productId, quantity });
        return response.data;
    },

    removeFromCart: async (cartItemId) => {
        const response = await apiClient.delete(`/orders/cart/${cartItemId}`);
        return response.data;
    },

    updateCartItemQuantity: async (cartItemId, quantity) => {
        const response = await apiClient.put(`/orders/cart/${cartItemId}`, { quantity });
        return response.data;
    },

    checkout: async () => {
        const response = await apiClient.post('/orders/checkout', {});
        return response.data;
    },

    fetchMyOrders: async () => {
        const response = await apiClient.get('/orders/my-orders');
        return response.data;
    },

    cancelOrder: async (orderId) => {
        const response = await apiClient.put(`/orders/${orderId}/cancel`);
        return response.data;
    },
    getProfile: async () => {
        const response = await apiClient.get('/user/profile');
        return response.data;
    },

    updateProfile: async (data) => {
        const response = await apiClient.put('/mechanic/profile', data);
        return response.data;
    }
};