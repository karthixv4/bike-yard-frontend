import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sellerService } from '../../services/sellerService';
import { setLoader, openStatusModal, addNotification } from './uiSlice';

const initialState = {
  products: [],
  categories: [],
  orders: [],
  images: [],
  sales: [],
  inspections: [],
  stats: {
    revenue: 0,
    totalOrders: 0,
  },
  isTourOpen: false,
  tourStep: 0,
  isAddModalOpen: false,
  isEditModalOpen: false,

  editingProduct: null,
  selectedSale: null,
};


export const fetchCategories = createAsyncThunk(
  'seller/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await sellerService.getCategories();
      return response;
    } catch (error) {
      return rejectWithValue('Failed to load categories');
    }
  }
);

export const createCategory = createAsyncThunk(
  'seller/createCategory',
  async (categoryName, { dispatch, rejectWithValue }) => {
    dispatch(setLoader('category')); // Use simple loader for category creation
    try {
      const response = await sellerService.createCategory(categoryName);

      dispatch(openStatusModal({
        type: 'success',
        title: 'Category Created',
        message: `"${categoryName.name}" has been added to available categories.`,
        actionLabel: 'Continue'
      }));

      return response;
    } catch (error) {
      dispatch(openStatusModal({
        type: 'error',
        title: 'Action Failed',
        message: 'Could not create category.',
      }));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoader(null));
    }
  }
);

export const fetchProductInspections = createAsyncThunk(
  'seller/fetchInspections',
  async (productId, { rejectWithValue }) => {
    try {
      return await sellerService.fetchInspections(productId);
    } catch (error) {
      return rejectWithValue('Failed to fetch inspections');
    }
  }
);


// Fetch Listings for Dashboard
export const fetchSellerProducts = createAsyncThunk(
  'seller/fetchProducts',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setLoader('fetching-inventory'));
    try {
      const products = await sellerService.fetchListings();
      return products;
    } catch (error) {
      return rejectWithValue('Failed to fetch listings');
    } finally {
      dispatch(setLoader(null));
    }
  }
);

export const fetchSellerOrders = createAsyncThunk(
  'seller/fetchOrders',
  async (_, { dispatch, rejectWithValue }) => {
    // We don't use global loader here to allow background refresh if needed, 
    // or simplistic loading in component
    try {
      const orders = await sellerService.fetchOrders();
      return orders;
    } catch (error) {
      return rejectWithValue('Failed to fetch orders');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'seller/updateOrderStatus',
  async (payload, { dispatch, rejectWithValue }) => {
    dispatch(setLoader('updating-order'));
    try {
      const updatedOrder = await sellerService.updateOrderStatus(payload.orderId, payload.status);

      dispatch(setLoader(null));

      // Show Success Modal
      dispatch(openStatusModal({
        type: 'success',
        title: 'Order Updated',
        message: `Order #${updatedOrder.id.slice(-6)} marked as ${updatedOrder.status}.`,
        actionLabel: 'Okay'
      }));

      // Close the Order Detail Modal
      dispatch(setSelectedOrder(null));

      return updatedOrder;
    } catch (error) {
      dispatch(setLoader(null));
      dispatch(openStatusModal({
        type: 'error',
        title: 'Update Failed',
        message: error.message || 'Could not update order status.'
      }));
      return rejectWithValue('Failed to update status');
    }
  }
);

export const addNewProduct = createAsyncThunk(
  'seller/addNewProduct',
  async (payload, { dispatch, rejectWithValue }) => {

    try {
      // 1. GET SIGNATURE
      dispatch(setLoader('signing'));
      const signatureData = await sellerService.getUploadSignature();

      // 2. UPLOAD IMAGES TO CLOUDINARY
      dispatch(setLoader('uploading'));

      // Upload all images in parallel
      const uploadPromises = payload.files.map((file) =>
        sellerService.uploadToCloudinary(file, signatureData)
      );

      const uploadResults = await Promise.all(uploadPromises);

      // Transform Cloudinary response to our ProductImage format
      const finalImages = uploadResults.map((res, index) => ({
        publicId: res.public_id,
        url: res.secure_url,
        width: res.width,
        height: res.height,
        format: res.format,
        size: res.bytes,
        position: index
      }));

      // 3. SAVE PRODUCT TO BACKEND
      dispatch(setLoader('saving'));

      const finalPayload = {
        // Cast strictly to ensure types match
        ...(payload.productData),
        images: finalImages
      };

      const newProduct = await sellerService.addProduct(finalPayload);
      // Notify User
      dispatch(addNotification({
        title: 'Product Listed',
        message: `${finalPayload.name} is now live on the marketplace.`,
        type: 'success'
      }));

      dispatch(openStatusModal({
        type: 'success',
        title: 'Listing Successful',
        message: 'Your item has been added to the marketplace.',
        actionLabel: 'Awesome'
      }));

      return newProduct;

    } catch (error) {
      dispatch(openStatusModal({
        type: 'error',
        title: 'Listing Failed',
        message: error.message || 'Something went wrong during the upload process.',
        actionLabel: 'Retry'
      }));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoader(null));
    }
  }
);

// Update Existing Product
export const updateSellerProduct = createAsyncThunk(
  'seller/updateProduct',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      let finalImages = [...payload.existingImages];

      // 1. Upload NEW files if any
      if (payload.newFiles.length > 0) {
        dispatch(setLoader('signing'));
        const signatureData = await sellerService.getUploadSignature();

        dispatch(setLoader('uploading'));
        const uploadPromises = payload.newFiles.map(file =>
          sellerService.uploadToCloudinary(file, signatureData)
        );
        const uploadResults = await Promise.all(uploadPromises);

        const newUploadedImages = uploadResults.map((res) => ({
          publicId: res.public_id,
          url: res.secure_url,
          width: res.width,
          height: res.height,
          format: res.format,
          size: res.bytes,
          position: 0 // Will re-index later
        }));

        finalImages = [...finalImages, ...newUploadedImages];
      }

      // Re-index positions
      finalImages = finalImages.map((img, index) => ({ ...img, position: index }));

      // 2. Update Backend
      dispatch(setLoader('updating-product'));

      const updatePayload = {
        ...payload.productData,
        images: finalImages
      };

      const updatedProduct = await sellerService.updateProduct(payload.id, updatePayload);

      dispatch(addNotification({
        title: 'Product Updated',
        message: `${updatedProduct.name} details have been updated.`,
        type: 'success'
      }));

      dispatch(openStatusModal({
        type: 'success',
        title: 'Update Successful',
        message: 'Your product listing has been updated.',
        actionLabel: 'Great'
      }));

      return updatedProduct;

    } catch (error) {
      dispatch(openStatusModal({
        type: 'error',
        title: 'Update Failed',
        message: error.message || 'Could not update product details.',
      }));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoader(null));
    }
  }
);

export const deleteSellerProduct = createAsyncThunk(
  'seller/deleteProduct',
  async (id, { dispatch, rejectWithValue }) => {
    dispatch(setLoader('deleting-product'));
    try {
      await sellerService.deleteProduct(id);

      dispatch(addNotification({
        title: 'Product Deleted',
        message: 'Item has been permanently removed from your inventory.',
        type: 'success'
      }));

      return id;
    } catch (error) {
      // Extract error message based on common API patterns or axios structure
      const message = error.response?.data?.message || error.message || 'Failed to delete product';

      dispatch(openStatusModal({
        type: 'error',
        title: 'Delete Failed',
        message: message
      }));

      return rejectWithValue(message);
    } finally {
      dispatch(setLoader(null));
    }
  }
);

const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    startTour: (state) => {
      state.isTourOpen = true;
      state.tourStep = 0;
    },
    nextTourStep: (state) => {
      state.tourStep += 1;
    },
    closeTour: (state) => {
      state.isTourOpen = false;
      state.tourStep = 0;
    },
    openAddModal: (state) => {
      state.isAddModalOpen = true;
      state.editingProduct = null; // Reset editing state
    },
    openEditModal: (state, action) => {
      state.editingProduct = action.payload;
      state.isEditModalOpen = true;
    },
    closeEditModal: (state) => {
      state.isEditModalOpen = false;
      state.editingProduct = null;
    },
    closeAddModal: (state) => {
      state.isAddModalOpen = false;
      state.editingProduct = null;
    },
    setSelectedOrder: (state, action) => {
      state.selectedSale = action.payload;
    },
    addProduct: (state, action) => {
      state.products.unshift(action.payload);
      state.isAddModalOpen = false; // Close modal on success
    },
    addSampleData: (state) => {
      state.products = [
        {
          id: '1',
          type: 'part',
          name: 'Vintage Exhaust Pipe',
          price: 4500,
          stock: 2,
          views: 124,
          category: 'Exhaust',
          images: [],
        },
      ];
      state.stats = { revenue: 0, totalOrders: 0, totalViews: 124 };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSellerProducts.fulfilled, (state, action) => {
      state.products = action.payload;
    });
    builder.addCase(fetchSellerOrders.fulfilled, (state, action) => {
      state.sales = action.payload;
      // Calculate Stats
      // Exclude 'CANCELLED' orders from revenue
      state.stats.revenue = action.payload.reduce((acc, curr) => {
        if (curr.order.status !== 'CANCELLED') {
          return acc + (curr.priceAtPurchase * curr.quantity);
        }
        return acc;
      }, 0);
      state.stats.totalOrders = action.payload.filter(sale => sale.order.status !== 'CANCELLED').length;
    });
    builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
      const updatedOrder = action.payload;
      // Update all items belonging to this order ID
      state.sales = state.sales.map(sale => {
        if (sale.order.id === updatedOrder.id) {
          return {
            ...sale,
            order: { ...sale.order, status: updatedOrder.status }
          };
        }
        return sale;
      });

      // Also clear selected sale since modal is closed in thunk
      state.selectedSale = null;
    });
    builder.addCase(fetchProductInspections.fulfilled, (state, action) => {
      state.inspections = action.payload;
    });
    builder.addCase(addNewProduct.fulfilled, (state, action) => {
      state.products.unshift(action.payload);
      state.isAddModalOpen = false;
    });
    builder.addCase(updateSellerProduct.fulfilled, (state, action) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
      state.isEditModalOpen = false; // Close Edit Modal      
      state.editingProduct = null;
    });
    builder.addCase(deleteSellerProduct.fulfilled, (state, action) => {
      state.products = state.products.filter(p => p.id !== action.payload);
    });
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
    });
    builder.addCase(createCategory.fulfilled, (state, action) => {
      const { id, name } = action.payload || {};
      if (id && name) {
        state.categories.push({ id, name });
      }
      state.categories.sort();
    });
  }

});

export const {
  startTour,
  nextTourStep,
  closeTour,
  openAddModal,
  closeAddModal,
  addProduct,
  addSampleData,
  openEditModal,
  closeEditModal,
  setSelectedOrder
} = sellerSlice.actions;
export default sellerSlice.reducer;