import { apiClient } from "./apiClient";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


export const sellerService = {

  fetchListings: async () => {
    const response = await apiClient.get('/seller/my-listings');
    return response.data
  },


  fetchOrders: async () => {
    try {
      const response = await apiClient.get('/orders/seller-orders');
      return response.data;
    } catch (error) {
      console.warn("Using mock sales due to API error", error);
      return [
        {
          id: "item-uuid-1",
          orderId: "ORD-7782-XJ",
          productId: "p1",
          quantity: 1,
          priceAtPurchase: 2400,
          product: {
            title: "Brembo Brake Pads",
            price: 2400
          },
          order: {
            id: "ORD-7782-XJ",
            createdAt: "2026-03-10",
            status: "PAID",
            buyer: { name: "Rahul Sharma", email: "rahul.s@example.com" }
          }
        }
      ];
    }
  },
  fetchInspections: async (productId) => {
    try {
      const response = await apiClient.get('/inspections/seller');
      const allInspections = response.data;

      const filtered = allInspections.filter((item) => item.productId === productId);

      // Map API response to the Inspection interface
      return filtered.map((item) => {
        // Calculate overall score if report exists
        let overallScore = 0;
        if (item.reportData?.scores) {
          const scores = Object.values(item.reportData.scores);
          if (scores.length > 0) {
            const sum = scores.reduce((a, b) => Number(a) + Number(b), 0);
            overallScore = Math.round(sum / scores.length);
          }
        }

        return {
          id: item.id,
          productId: item.productId,
          productName: item.product?.title || 'Unknown Product',
          // API list response might only provide ID, use generic fallback if name missing
          buyerName: item.buyer?.name || `Buyer (${item.buyerId.slice(-4)})`,
          mechanicName: item.mechanic?.user?.name || 'Pending Assignment',
          offerAmount: item.offerAmount,
          status: item.status,
          date: item.scheduledDate ? item.scheduledDate.split('T')[0] : item.createdAt.split('T')[0],
          rejectionReason: item.rejectionReason,
          report: item.reportData ? {
            overallScore: overallScore,
            notes: item.reportData.overallComment
          } : undefined
        };
      });
    } catch (error) {
      console.error("Failed to fetch inspections", error);
      throw error;
    }
  },
  updateOrderStatus: async (orderId, status) => {
    const response = await apiClient.put(`/orders/${orderId}/status`, { status });
    return response.data;
  },

  addProduct: async (productData) => {
    const response = await apiClient.post('/products', productData);
    return response.data;

  },
  updateProduct: async (id, productData) => {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response.data;
  },
  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await apiClient.get('/products/categories/all');
    return response.data;
  },
  createCategory: async (categoryName) => {
    const response = await apiClient.post('/products/categories', categoryName);
    return response.data;
  },
  // Simulate fetching a signed URL/signature from backend
  // 1. Get Signature
  getUploadSignature: async () => {
    const response = await apiClient.get('/auth/upload-signature')
    return response.data;
  },

  // 2. Direct Upload to Cloudinary (REAL)
  uploadToCloudinary: async (file, signatureData) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("api_key", signatureData.apiKey);
    formData.append("timestamp", signatureData.timestamp);
    formData.append("signature", signatureData.signature);
    formData.append("folder", signatureData.folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Cloudinary upload failed: ${error}`);
    }

    const data = await response.json();

    // Return ONLY what your app needs
    return {
      public_id: data.public_id,
      secure_url: data.secure_url,
      width: data.width,
      height: data.height,
      format: data.format,
      bytes: data.bytes,
      original_filename: data.original_filename
    };
  }
};