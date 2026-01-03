import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mechanicService } from '../../services/mechanicService';
import { openStatusModal, setLoader, addNotification } from './uiSlice';



const initialState = {
  stats: {
    earnings: 0,
    jobsCompleted: 0,
    rating: 4.8,
  },
  requests: [],
  activeJobs: [],
  history: [],
  cart: [],
  profile: null,
  orders: [],
  selectedOrder: null,
  marketplace: [],
  marketplaceMeta: { total: 0, page: 1, limit: 10 },
  isInspectionModalOpen: false,
  isReportModalOpen: false,
  isHistoryModalOpen: false,
  selectedRequestId: null,
  historySelectedId: null,
  loading: false,
  marketLoading: false,
  cartLoading: false,
};

// Async Thunks
export const fetchAvailableInspections = createAsyncThunk(
  'mechanic/fetchAvailable',
  async (_, { rejectWithValue }) => {
    try {
      return await mechanicService.fetchAvailableInspections();
    } catch (error) {
      return rejectWithValue('Failed to fetch available gigs');
    }
  }
);

export const fetchActiveInspections = createAsyncThunk(
  'mechanic/fetchActive',
  async (_, { rejectWithValue }) => {
    try {
      return await mechanicService.fetchMyInspections();
    } catch (error) {
      return rejectWithValue('Failed to fetch active inspections');
    }
  }
);

export const fetchMechanicOrders = createAsyncThunk(
  'mechanic/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await mechanicService.fetchMyOrders();
    } catch (error) {
      return rejectWithValue('Failed to fetch orders');
    }
  }
);

export const cancelMechanicOrder = createAsyncThunk(
  'mechanic/cancelOrder',
  async (orderId, { dispatch, rejectWithValue }) => {
    dispatch(setLoader('default'));
    try {
      await mechanicService.cancelOrder(orderId);
      dispatch(openStatusModal({
        type: 'success',
        title: 'Order Cancelled',
        message: `Order #${orderId.slice(-6)} has been cancelled.`,
      }));
      return orderId;
    } catch (error) {
      dispatch(openStatusModal({
        type: 'error',
        title: 'Cancellation Failed',
        message: error.message || 'Could not cancel the order.',
      }));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoader(null));
    }
  }
);

export const fetchMechanicProfile = createAsyncThunk(
  'mechanic/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await mechanicService.getProfile();
      if (response.mechanicProfile) {
        return {
          ...response.mechanicProfile,
          user: {
            name: response.name,
            phone: response.phone,
            email: response.email
          }
        }
      }
      return response;
    } catch (error) {
      return rejectWithValue('Failed to load profile');
    }
  }
);

export const updateMechanicProfile = createAsyncThunk(
  'mechanic/updateProfile',
  async (data, { dispatch, rejectWithValue }) => {
    dispatch(setLoader('updating-profile'));
    try {
      const response = await mechanicService.updateProfile(data);
      dispatch(addNotification({
        title: 'Profile Updated',
        message: 'Your professional details have been saved.',
        type: 'success'
      }));
      return response;
    } catch (error) {
      dispatch(openStatusModal({
        type: 'error',
        title: 'Update Failed',
        message: error.message || 'Could not update profile.'
      }));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoader(null));
    }
  }
);

export const acceptInspection = createAsyncThunk(
  'mechanic/acceptInspection',
  async (id, { dispatch, rejectWithValue }) => {
    // 1. Show Custom Loader
    dispatch(setLoader('accepting-job'));

    try {
      // 2. Perform API Call
      await mechanicService.updateInspectionStatus(id, 'ACCEPTED');


      dispatch(setLoader(null));
      dispatch(closeInspectionModal());

      dispatch(openStatusModal({
        type: 'success',
        title: 'Job Accepted',
        message: 'You have successfully secured this inspection. Check your Active Jobs tab.'
      }));

      return id;

    } catch (error) {
      // 4. Failure Flow
      dispatch(setLoader(null)); // Hide Loader

      const errorMessage = error.response?.status === 409
        ? "This job has already been taken by another mechanic."
        : "Failed to accept inspection due to a network error.";

      dispatch(openStatusModal({
        type: 'error',
        title: 'Action Failed',
        message: errorMessage
      }));

      // If job is taken or invalid, we should refresh the list and close the current modal
      dispatch(fetchAvailableInspections());
      dispatch(closeInspectionModal());

      return rejectWithValue(errorMessage);
    }
  }
);


export const submitInspectionReport = createAsyncThunk(
  'mechanic/submitReport',
  async ({ id, report }, { dispatch, rejectWithValue }) => {
    dispatch(setLoader('default'));
    try {
      await mechanicService.submitInspectionReport(id, report);

      dispatch(setLoader(null));
      dispatch(closeReportModal());

      dispatch(openStatusModal({
        type: 'success',
        title: 'Report Submitted',
        message: 'The inspection report has been successfully submitted and the job is marked as completed.'
      }));

      return { id, report };
    } catch (error) {
      dispatch(setLoader(null));
      dispatch(openStatusModal({
        type: 'error',
        title: 'Submission Failed',
        message: error.message || 'Could not submit the report. Please try again.'
      }));
      return rejectWithValue(error.message);
    }
  }
);


export const fetchMechanicMarketplace = createAsyncThunk(
  'mechanic/fetchMarketplace',
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await mechanicService.fetchPartMarket(page, 10);
      return response;
    } catch (error) {
      return rejectWithValue('Failed to load parts');
    }
  }
);

// --- Cart Thunks ---

export const fetchMechanicCart = createAsyncThunk(
  'mechanic/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      return await mechanicService.fetchCart();
    } catch (error) {
      return rejectWithValue('Failed to load cart');
    }
  }
);

export const addMechanicCartItem = createAsyncThunk(
  'mechanic/addToCart',
  async (payload, { dispatch, rejectWithValue }) => {
    dispatch(setLoader('adding-to-cart'));
    try {
      await mechanicService.addToCart(payload.productId, payload.quantity);
      dispatch(fetchMechanicCart());
      dispatch(openStatusModal({
        type: 'success',
        title: 'Added to Cart',
        message: 'Part added to your order list.',
        actionLabel: 'Keep Browsing'
      }));
      return payload.productId;
    } catch (error) {
      const message = error.response?.data?.message || 'Could not add item to cart.';
      dispatch(openStatusModal({ type: 'error', title: 'Error', message: message }));
      return rejectWithValue(message);
    }
    finally {
      dispatch(setLoader(null));
    }
  }
);

export const removeMechanicCartItem = createAsyncThunk(
  'mechanic/removeFromCart',
  async (cartItemId, { dispatch, rejectWithValue }) => {
    dispatch(setLoader('removing-from-cart'));
    try {
      await mechanicService.removeFromCart(cartItemId);
      dispatch(fetchMechanicCart());
      return cartItemId;
    } catch (error) {
      return rejectWithValue('Failed to remove item');
    } finally {
      dispatch(setLoader(null));
    }
  }
);

export const updateMechanicCartQty = createAsyncThunk(
  'mechanic/updateCartQty',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      await mechanicService.updateCartItemQuantity(payload.id, payload.quantity);
      dispatch(fetchMechanicCart());
      return payload;
    } catch (error) {
      return rejectWithValue('Failed to update quantity');
    }
  }
);

export const checkoutMechanicCart = createAsyncThunk(
  'mechanic/checkout',
  async (_, { dispatch, getState, rejectWithValue }) => {
    dispatch(setLoader('checkout'));
    try {
      const response = await mechanicService.checkout();

      dispatch(openStatusModal({
        type: 'success',
        title: 'Order Placed',
        message: `Order #${response.order.id.slice(-6)} confirmed.`,
        actionLabel: 'Done'
      }));

      dispatch(fetchMechanicCart());
      dispatch(fetchMechanicMarketplace(1));
      dispatch(fetchMechanicOrders());

      return response;
    } catch (error) {
      dispatch(openStatusModal({
        type: 'error',
        title: 'Checkout Failed',
        message: error.message || 'Could not place order.'
      }));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoader(null));
    }
  }
);


// New Thunk for Service Completion (No Report)
export const completeServiceJob = createAsyncThunk(
  'mechanic/completeServiceJob',
  async (id, { dispatch, rejectWithValue }) => {
    dispatch(setLoader('default'));
    try {
      await mechanicService.updateInspectionStatus(id, 'COMPLETED');

      dispatch(setLoader(null));
      dispatch(openStatusModal({
        type: 'success',
        title: 'Service Completed',
        message: 'The service job has been marked as done.'
      }));

      return id;
    } catch (error) {
      dispatch(setLoader(null));
      dispatch(openStatusModal({
        type: 'error',
        title: 'Action Failed',
        message: error.message || 'Could not complete job.'
      }));
      return rejectWithValue(error.message);
    }
  }
);
const mechanicSlice = createSlice({
  name: 'mechanic',
  initialState,
  reducers: {
    openInspectionModal: (state, action) => {
      state.selectedRequestId = action.payload;
      state.isInspectionModalOpen = true;
    },
    closeInspectionModal: (state) => {
      state.isInspectionModalOpen = false;
      state.selectedRequestId = null;
    },
    setSelectedMechanicOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    openReportModal: (state, action) => {
      state.selectedRequestId = action.payload;
      state.isReportModalOpen = true;
    },
    closeReportModal: (state) => {
      state.isReportModalOpen = false;
      state.selectedRequestId = null;
    },
    openHistoryModal: (state, action) => {
      state.historySelectedId = action.payload;
      state.isHistoryModalOpen = true;
    },
    closeHistoryModal: (state) => {
      state.isHistoryModalOpen = false;
      state.historySelectedId = null;
    },
    rejectRequest: (state, action) => {
      const requestIndex = state.requests.findIndex(r => r.id === state.selectedRequestId);
      if (requestIndex !== -1) {
        const request = state.requests[requestIndex];
        request.status = 'rejected';
        request.rejectionReason = action.payload.reason;

        state.history.push(request);
        state.requests.splice(requestIndex, 1);

        state.isInspectionModalOpen = false;
        state.selectedRequestId = null;
      }
    },
    orderPart: (state, action) => {
      console.log('Ordered part:', action.payload);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAvailableInspections.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAvailableInspections.fulfilled, (state, action) => {
      state.loading = false;
      state.requests = action.payload
        .filter((item) => item.status === 'PENDING')
        .map((item) => ({
          id: String(item.id),
          bikeModel: item.product?.title || (item.userBike ? `${item.userBike.brand} ${item.userBike.model}` : 'Unknown Asset'),
          bikeImage: item.product?.images?.[0]?.url || '',
          customerName: item.buyer?.name || 'Customer',
          location: item.product?.address || 'Location provided upon acceptance',
          offerAmount: item.offerAmount,
          date: item.scheduledDate ? item.scheduledDate.split('T')[0] : item.createdAt.split('T')[0],
          status: 'pending',
          details: item.message || (item.serviceType ? `Service Request: ${item.serviceType}` : 'Standard Inspection Request'),
          type: item.type || 'INSPECTION',
          serviceType: item.serviceType
        }));
    });
    builder.addCase(fetchActiveInspections.fulfilled, (state, action) => {
      const allInspections = action.payload;

      const active = [];
      const past = [];
      let totalEarnings = 0;
      let completedCount = 0;

      allInspections.forEach((item) => {
        const mapped = {
          id: String(item.id),
          bikeModel: item.product?.title || (item.userBike ? `${item.userBike.brand} ${item.userBike.model}` : 'Unknown Asset'),
          bikeImage: item.product?.images?.[0]?.url || '',
          customerName: item.buyer?.name || 'Unknown Buyer',
          location: item.product?.address || 'Location Unknown',
          offerAmount: item.offerAmount,
          date: item.createdAt ? item.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
          status: item.status.toLowerCase(),
          details: item.message || (item.serviceType ? `Service: ${item.serviceType}` : 'Inspection Request'),
          dueDate: item.scheduledDate ? item.scheduledDate.split('T')[0] : undefined,
          rejectionReason: item.rejectionReason,
          report: item.reportData ? {
            scores: item.reportData.scores,
            overallComment: item.reportData.overallComment
          } : undefined,
          type: item.type || 'INSPECTION',
          serviceType: item.serviceType
        };

        const statusLower = mapped.status.toLowerCase();
        if (['completed', 'rejected', 'cancelled'].includes(statusLower)) {
          past.push(mapped);
          if (statusLower === 'completed') {
            completedCount++;
            totalEarnings += mapped.offerAmount;
          }
        } else {
          // Accepted or Pending (though my-inspections usually has accepted/completed)
          active.push(mapped);
        }
      });

      state.activeJobs = active;
      state.history = past;

      // Update Stats
      state.stats.earnings = totalEarnings;
      state.stats.jobsCompleted = completedCount;
    });
    // Marketplace
    builder.addCase(fetchMechanicMarketplace.pending, (state) => {
      state.marketLoading = true;
    });
    builder.addCase(fetchMechanicOrders.fulfilled, (state, action) => {
      state.orders = action.payload;
    });
    builder.addCase(cancelMechanicOrder.fulfilled, (state, action) => {
      const index = state.orders.findIndex(o => o.id === action.payload);
      if (index !== -1) {
        state.orders[index].status = 'CANCELLED';
      }
      if (state.selectedOrder && state.selectedOrder.id === action.payload) {
        state.selectedOrder.status = 'CANCELLED';
      }
    });
    builder.addCase(fetchMechanicMarketplace.fulfilled, (state, action) => {
      state.marketLoading = false;
      const data = action.payload.data || [];
      const meta = action.payload.pagination || { total: 0, page: 1, limit: 10 };

      state.marketplace = data.map((item) => ({
        id: item.id,
        name: item.title,
        category: item.category || 'General',
        price: item.price,
        stock: item.stock || 0,
        supplier: item.seller?.businessName || 'Verified Supplier',
        images: item.images
      }));
      state.marketplaceMeta = meta;
    });
    builder.addCase(fetchMechanicMarketplace.rejected, (state) => {
      state.marketLoading = false;
    });
    builder.addCase(fetchAvailableInspections.rejected, (state) => {
      state.loading = false;
    });
    // Accept Inspection Logic
    builder.addCase(acceptInspection.fulfilled, (state, action) => {
      const id = action.payload;

      const index = state.requests.findIndex(r => r.id === id);
      if (index !== -1) {
        const request = state.requests[index];
        request.status = 'accepted';
        request.dueDate = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
        state.activeJobs.push(request);
        state.requests.splice(index, 1);
      }
    });
    // Cart
    builder.addCase(fetchMechanicCart.pending, (state) => {
      state.cartLoading = true;
    });
    builder.addCase(fetchMechanicCart.fulfilled, (state, action) => {
      state.cartLoading = false;
      state.cart = action.payload;
    });
    builder.addCase(fetchMechanicCart.rejected, (state) => {
      state.cartLoading = false;
    });
    builder.addCase(checkoutMechanicCart.fulfilled, (state) => {
      state.cart = [];
    });
    builder.addCase(fetchMechanicProfile.fulfilled, (state, action) => {
      state.profile = action.payload;
    });
    builder.addCase(updateMechanicProfile.fulfilled, (state, action) => {
      state.profile = action.payload;
    });
    // Submit Report Logic
    builder.addCase(submitInspectionReport.fulfilled, (state, action) => {
      const { id, report } = action.payload;
      const jobIndex = state.activeJobs.findIndex(j => j.id === id);
      if (jobIndex !== -1) {
        const job = state.activeJobs[jobIndex];
        job.status = 'completed';
        job.report = report;
        state.history.unshift(job);
        state.activeJobs.splice(jobIndex, 1);
        state.stats.jobsCompleted += 1;
        state.stats.earnings += job.offerAmount;
      }
    });
    builder.addCase(completeServiceJob.fulfilled, (state, action) => {
      const id = action.payload;
      const jobIndex = state.activeJobs.findIndex(j => j.id === id);
      if (jobIndex !== -1) {
        const job = state.activeJobs[jobIndex];
        job.status = 'completed';

        state.history.unshift(job);
        state.activeJobs.splice(jobIndex, 1);

        state.stats.jobsCompleted += 1;
        state.stats.earnings += job.offerAmount;
      }
    });
  }
});

export const {
  openInspectionModal,
  closeInspectionModal,
  openReportModal,
  closeReportModal,
  openHistoryModal,
  closeHistoryModal,
  setSelectedMechanicOrder,
  rejectRequest,
  orderPart
} = mechanicSlice.actions;

export default mechanicSlice.reducer;