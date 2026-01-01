import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { buyerService } from '../../services/buyerService';
import { setLoader, openStatusModal } from './uiSlice';

const initialState = {
  cart: [],
  inspections: [],
  orders: [],
  selectedInspection: null,
  selectedOrder: null,
  mechanics: [],
  dashboard: {
    bikes: { data: [], pagination: { total: 0, page: 1, limit: 10 } },
    parts: { data: [], pagination: { total: 0, page: 1, limit: 10 } },
    loading: false
  },
  isCartLoading: false
};

export const fetchCart = createAsyncThunk(
  'buyer/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      return await buyerService.fetchCart();
    } catch (error) {
      return rejectWithValue('Failed to load cart');
    }
  }
);

export const addItemToCart = createAsyncThunk(
  'buyer/addToCart',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      await buyerService.addToCart(payload.productId, payload.quantity);
      // Refresh cart to get the full object with product details
      dispatch(fetchCart());
      return payload.productId;
    } catch (error) {
      // Extract meaningful message from backend (e.g., "Only 2 items left in stock")
      const message = error.response?.data?.message || 'Could not add item to cart.';

      dispatch(openStatusModal({
        type: 'error',
        title: 'Stock Limit',
        message: message,
      }));
      return rejectWithValue(message);
    }
  }
);
export const fetchBuyerInspections = createAsyncThunk(
  'buyer/fetchInspections',
  async (_, { rejectWithValue }) => {
    try {
      return await buyerService.fetchMyInspections();
    } catch (error) {
      return rejectWithValue('Failed to fetch inspections');
    }
  }
);

export const fetchInspectionDetail = createAsyncThunk(
  'buyer/fetchInspectionDetail',
  async (id, { dispatch, rejectWithValue }) => {
    dispatch(setLoader('fetching-inspection-details'));
    try {
      return await buyerService.fetchInspectionDetails(id);
    } catch (error) {
      dispatch(openStatusModal({
        type: 'error',
        title: 'Error',
        message: 'Failed to retrieve inspection details.',
      }));
      return rejectWithValue('Failed to fetch inspection details');
    } finally {
      dispatch(setLoader(null));
    }
  }
);
// Async Thunks
export const checkoutCart = createAsyncThunk(
  'buyer/checkout',
  async (_, { dispatch, getState, rejectWithValue }) => {
    const state = getState();
    const { cart } = state.buyer;

    if (cart.length === 0) return rejectWithValue('Cart is empty');

    dispatch(setLoader('checkout'));

    try {
      const response = await buyerService.checkout();
      dispatch(openStatusModal({
        type: 'success',
        title: 'Order Placed',
        message: `Your order #${response.order.id.slice(-6)} has been successfully placed.`,
        actionLabel: 'Great'
      }));
      // Refresh orders list after successful checkout
      dispatch(fetchBuyerOrders());
      // Refresh empty cart
      dispatch(fetchCart());
      return response;
    } catch (error) {
      dispatch(openStatusModal({
        type: 'error',
        title: 'Checkout Failed',
        message: error.message || 'Something went wrong with the payment gateway.',
        actionLabel: 'Try Again'
      }));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoader(null));
    }
  }
);
export const fetchBuyerOrders = createAsyncThunk(
  'buyer/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await buyerService.fetchMyOrders();
    } catch (error) {
      return rejectWithValue('Failed to fetch orders');
    }
  }
);


export const requestInspection = createAsyncThunk(
  'buyer/requestInspection',
  async (data, { dispatch, rejectWithValue }) => {
    dispatch(setLoader('inspection'));

    try {
      const response = await buyerService.requestInspection(data);

      dispatch(openStatusModal({
        type: 'success',
        title: 'Inspection Requested',
        message: `Your request has been broadcasted. Estimated wait time: ${response.estimatedTime}.`,
      }));

      return { ...data, ...response };
    } catch (error) {
      dispatch(openStatusModal({
        type: 'error',
        title: 'Request Failed',
        message: 'Could not submit request. Please try again later.',
      }));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoader(null));
    }
  }
);

export const cancelInspection = createAsyncThunk(
  'buyer/cancelInspection',
  async (id, { dispatch, rejectWithValue }) => {
    dispatch(setLoader('default'));
    try {
      await buyerService.cancelInspection(id);

      dispatch(openStatusModal({
        type: 'success',
        title: 'Request Cancelled',
        message: 'The inspection request has been cancelled.',
      }));

      return id;
    } catch (error) {
      dispatch(openStatusModal({
        type: 'error',
        title: 'Cancellation Failed',
        message: error.message || 'Could not cancel the request.',
      }));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoader(null));
    }
  }
);

export const fetchDashboardData = createAsyncThunk(
  'buyer/fetchDashboard',
  async (params, { rejectWithValue }) => {
    try {
      const response = await buyerService.fetchDashboard(params);
      return response;
    } catch (error) {
      return rejectWithValue('Failed to load dashboard data');
    }
  }
);


export const removeItemFromCart = createAsyncThunk(
  'buyer/removeFromCart',
  async (cartItemId, { dispatch, rejectWithValue }) => {
    try {
      await buyerService.removeFromCart(cartItemId);
      dispatch(fetchCart());
      return cartItemId;
    } catch (error) {
      return rejectWithValue('Failed to remove item');
    }
  }
);

export const updateCartItemQty = createAsyncThunk(
  'buyer/updateCartItemQty',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      await buyerService.updateCartItemQuantity(payload.id, payload.quantity);
      dispatch(fetchCart());
      return payload;
    } catch (error) {
      // Extract meaningful message (e.g., "Only X items available")
      const message = error.response?.data?.message || 'Failed to update quantity';

      dispatch(openStatusModal({
        type: 'error',
        title: 'Stock Limit',
        message: message,
      }));
      return rejectWithValue(message);
    }
  }
);

export const cancelBuyerOrder = createAsyncThunk(
  'buyer/cancelOrder',
  async (orderId, { dispatch, rejectWithValue }) => {
    dispatch(setLoader('default'));
    try {
      await buyerService.cancelOrder(orderId);
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

const buyerSlice = createSlice({
  name: 'buyer',
  initialState,
  reducers: {
    clearSelectedInspection: (state) => {
      state.selectedInspection = null;
    },
    setSelectedBuyerOrder: (state, action) => {
      state.selectedOrder = action.payload;
    }
  },
  extraReducers: (builder) => {
    // --- Cart ---
    builder.addCase(fetchCart.pending, (state) => {
      state.isCartLoading = true;
    });
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.isCartLoading = false;
      state.cart = action.payload;
    });
    builder.addCase(fetchCart.rejected, (state) => {
      state.isCartLoading = false;
    });

    builder.addCase(checkoutCart.fulfilled, (state) => {
      state.cart = [];
    });
    builder.addCase(fetchBuyerOrders.fulfilled, (state, action) => {
      state.orders = action.payload;
    });
    builder.addCase(cancelInspection.fulfilled, (state, action) => {
      const index = state.inspections.findIndex(i => i.id === action.payload);
      if (index !== -1) {
        state.inspections[index].status = 'CANCELLED';
      }
      if (state.selectedInspection && state.selectedInspection.id === action.payload) {
        state.selectedInspection.status = 'CANCELLED';
      }
    });
    builder.addCase(cancelBuyerOrder.fulfilled, (state, action) => {
      const index = state.orders.findIndex(o => o.id === action.payload);
      if (index !== -1) {
        state.orders[index].status = 'CANCELLED';
      }
    });
    builder.addCase(requestInspection.fulfilled, (state, action) => {
      state.inspections.unshift({
        id: action.payload.inspectionId,
        bikeId: action.payload.bikeId,
        bikeName: action.payload.bikeName,
        offerAmount: action.payload.offer,
        status: 'PENDING',
        date: new Date().toISOString().split('T')[0]
      });
    });
    // Fetch List
    builder.addCase(fetchBuyerInspections.fulfilled, (state, action) => {
      state.inspections = action.payload.map((item) => ({
        id: item.id,
        bikeId: item.productId,
        bikeName: item.product?.title || 'Unknown Bike',
        offerAmount: item.offerAmount,
        status: item.status,
        date: item.createdAt ? item.createdAt.split('T')[0] : 'N/A',
        mechanicName: item.mechanic?.user?.name,
        message: item.message,
        reportData: item.reportData,
        product: item.product,
        mechanic: item.mechanic
      }));
    });

    // Fetch Detail
    builder.addCase(fetchInspectionDetail.fulfilled, (state, action) => {
      state.selectedInspection = action.payload;
    });

    // Dashboard Fetch
    builder.addCase(fetchDashboardData.pending, (state) => {
      state.dashboard.loading = true;
    });
    builder.addCase(fetchDashboardData.fulfilled, (state, action) => {
      state.dashboard.loading = false;
      state.dashboard.bikes = {
        data: action.payload.bikes.data,
        pagination: action.payload.bikes.pagination
      };
      state.dashboard.parts = {
        data: action.payload.accessories.data,
        pagination: action.payload.accessories.pagination
      };
    });
    builder.addCase(fetchDashboardData.rejected, (state) => {
      state.dashboard.loading = false;
    });
  }
});

export const {
  clearSelectedInspection, setSelectedBuyerOrder
} = buyerSlice.actions;

export default buyerSlice.reducer;
