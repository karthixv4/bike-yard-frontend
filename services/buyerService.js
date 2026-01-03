import { apiClient } from './apiClient';

export const buyerService = {

  // --- CART OPERATIONS ---
  addToCart: async (productId, quantity) => {
    // API: POST /api/orders/cart
    const response = await apiClient.post('/orders/cart', { productId, quantity });
    return response.data;
  },

  fetchCart: async () => {
    const response = await apiClient.get('/orders/cart');
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

  // --- ORDER OPERATIONS ---
  checkout: async () => {
    // API: POST /api/orders/checkout (Empty body, uses server cart)
    const response = await apiClient.post('/orders/checkout', {});
    return response.data;
  },

  fetchMyOrders: async () => {
    const response = await apiClient.get('/orders/my-orders');
    return response.data;
  },
  cancelOrder: async (orderId) => {
    const response = await apiClient.put(`/orders/${orderId}/status`, { status: 'CANCELLED' });
    return response.data;
  },

  requestInspection: async (inspectionData) => {
    const response = await apiClient.post('/inspections/request', inspectionData);
    return response.data;
  },

  fetchDashboard: async (params) => {
    console.log(`API CALL: GET /api/products/dashboard?bikePage=${params.bikePage}&bikeLimit=${params.bikeLimit}&accPage=${params.accPage}&accLimit=${params.accLimit}`);

    const response = await apiClient.get('/products/dashboard', { params });
    return response.data

  },
  fetchMyInspections: async () => {
    const response = await apiClient.get('/inspections/my-inspections');
    return response.data;
  },

  fetchInspectionDetails: async (id) => {
    const response = await apiClient.get(`/inspections/${id}`);
    return response.data;
  },
  cancelInspection: async (id) => {
    const response = await apiClient.put(`/inspections/${id}/cancel`);
    return response.data;
  },
  requestService: async (serviceData) => {
    // POST /api/inspections/request with type="SERVICE"
    const payload = { ...serviceData, type: 'SERVICE' };
    const response = await apiClient.post('/inspections/request', payload);
    return response.data;
  },
  // --- GARAGE OPERATIONS ---
  addBikeToGarage: async (data) => {
    const response = await apiClient.post('/user/garage', data);
    return response.data;
  },

  fetchGarage: async () => {
    const response = await apiClient.get('/user/garage');
    return response.data;
  },
};
