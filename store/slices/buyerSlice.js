import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { buyerService } from '../../services/buyerService';
import { setLoader, openStatusModal } from './uiSlice';

const initialState = {
  cart: [],
  inspections: [],
  orders: [],
  selectedInspection: null,
  selectedOrder: null,
  garage: [],
  mechanics: [],
  dashboard: {
    bikes: { data: [], pagination: { total: 0, page: 1, limit: 10 } },
    parts: { data: [], pagination: { total: 0, page: 1, limit: 10 } },
    loading: false
  },
  isCartLoading: false,
  bikeHistory: [],
  isHistoryLoading: false,
  tour: {
    isOpen: false,
    step: 0
  }
};
export const updateGarageBike = createAsyncThunk(
  'buyer/updateGarageBike',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    dispatch(setLoader('adding-bike')); // Use generic loader
    try {
      const response = await buyerService.updateBike(id, data);
      dispatch(openStatusModal({
        type: 'success',
        title: 'Bike Updated',
        message: 'Garage details have been updated successfully.'
      }));
      return response;
    } catch (error) {
      dispatch(openStatusModal({
        type: 'error',
        title: 'Update Failed',
        message: error.message || 'Could not update bike details.'
      }));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoader(null));
    }
  }
);

export const fetchGarage = createAsyncThunk(
  'buyer/fetchGarage',
  async (_, { rejectWithValue }) => {
    try {
      return await buyerService.fetchGarage();
    } catch (error) {
      return rejectWithValue('Failed to load garage');
    }
  }
);

export const fetchBikeHistory = createAsyncThunk(
  'buyer/fetchBikeHistory',
  async (bikeId, { rejectWithValue }) => {
    try {
      return await buyerService.fetchBikeHistory(bikeId);
    } catch (error) {
      return rejectWithValue('Failed to load history');
    }
  }
);
export const addBikeToGarage = createAsyncThunk(
  'buyer/addBikeToGarage',
  async (bikeData, { dispatch, rejectWithValue }) => {
    dispatch(setLoader('adding-bike'));
    try {
      const response = await buyerService.addBikeToGarage(bikeData);
      dispatch(openStatusModal({
        type: 'success',
        title: 'Bike Added',
        message: `${bikeData.brand} ${bikeData.model} is parked in your garage.`
      }));
      return response;
    } catch (error) {
      dispatch(openStatusModal({
        type: 'error',
        title: 'Error',
        message: error.message || 'Could not add bike.'
      }));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoader(null));
    }
  }
);

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
    dispatch(setLoader('adding-to-cart'));
    try {
      await buyerService.addToCart(payload.productId, payload.quantity);
      dispatch(fetchCart());
      return payload.productId;
    } catch (error) {
      const message = error.response?.data?.message || 'Could not add item to cart.';

      dispatch(openStatusModal({
        type: 'error',
        title: 'Stock Limit',
        message: message,
      }));
      return rejectWithValue(message);
    } finally {
      dispatch(setLoader(null));
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
        message: 'Failed to retrieve details.',
      }));
      return rejectWithValue('Failed to fetch details');
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
      dispatch(fetchDashboardData({ bikePage: 1, bikeLimit: 10, accPage: 1, accLimit: 10 }));
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


export const requestService = createAsyncThunk(
  'buyer/requestService',
  async (data, { dispatch, rejectWithValue }) => {
    dispatch(setLoader('inspection'));
    try {
      const response = await buyerService.requestService(data);
      dispatch(openStatusModal({
        type: 'success',
        title: 'Service Requested',
        message: `Your ${data.serviceType} request has been broadcasted to mechanics.`
      }));
      return response;
    } catch (error) {
      dispatch(openStatusModal({
        type: 'error',
        title: 'Request Failed',
        message: error.message || 'Could not submit request.'
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
        message: 'The request has been cancelled.',
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
    dispatch(setLoader('removing-from-cart'));
    try {
      await buyerService.removeFromCart(cartItemId);
      dispatch(fetchCart());
      return cartItemId;
    } catch (error) {
      dispatch(openStatusModal({
        type: 'error',
        title: 'Remove Failed',
        message: 'Could not remove item from cart.',
      }));
      return rejectWithValue('Failed to remove item');
    } finally {
      dispatch(setLoader(null));
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
    },
    // Tour Actions
    startDetailedTour: (state) => {
      state.tour.isOpen = true;
      state.tour.step = 0;
    },
    nextDetailedTourStep: (state) => {
      state.tour.step += 1;
    },
    prevDetailedTourStep: (state) => {
      if (state.tour.step > 0) state.tour.step -= 1;
    },
    closeDetailedTour: (state) => {
      state.tour.isOpen = false;
      state.tour.step = 0;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGarage.fulfilled, (state, action) => {
      state.garage = action.payload;
    });
    builder.addCase(addBikeToGarage.fulfilled, (state, action) => {
      state.garage.push(action.payload);
    });
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
    builder.addCase(fetchBikeHistory.pending, (state) => {
      state.isHistoryLoading = true;
    });
    builder.addCase(fetchBikeHistory.fulfilled, (state, action) => {
      state.isHistoryLoading = false;
      state.bikeHistory = action.payload;
    });
    builder.addCase(fetchBikeHistory.rejected, (state) => {
      state.isHistoryLoading = false;
    });
    builder.addCase(updateGarageBike.fulfilled, (state, action) => {
      const index = state.garage.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.garage[index] = action.payload;
      }
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
    builder.addCase(requestService.fulfilled, (state, action) => {
      const data = action.payload;
      state.inspections.unshift({
        id: data.id,
        bikeId: data.userBikeId,
        bikeName: 'My Bike',
        offerAmount: data.offerAmount,
        status: 'PENDING',
        type: 'SERVICE',
        serviceType: data.serviceType,
        date: data.createdAt ? data.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]
      });
    });
    builder.addCase(fetchBuyerInspections.fulfilled, (state, action) => {
      state.inspections = action.payload.map((item) => ({
        id: item.id,
        bikeId: item.productId || item.userBikeId,
        bikeName: item.product?.title || (item.userBike ? `${item.userBike.brand} ${item.userBike.model}` : 'Unknown Bike'),
        offerAmount: item.offerAmount,
        status: item.status,
        type: item.type || 'INSPECTION',
        serviceType: item.serviceType,
        date: item.createdAt ? item.createdAt.split('T')[0] : 'N/A',
        mechanicName: item.mechanic?.user?.name,
        message: item.message,
        reportData: item.reportData,
        product: item.product,
        mechanic: item.mechanic,
        userBike: item.userBike
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
  clearSelectedInspection, setSelectedBuyerOrder,
  startDetailedTour,
  nextDetailedTourStep,
  prevDetailedTourStep,
  closeDetailedTour
} = buyerSlice.actions;

export default buyerSlice.reducer;
