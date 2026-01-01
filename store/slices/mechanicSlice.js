import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mechanicService } from '../../services/mechanicService';
import { openStatusModal, setLoader } from './uiSlice';



const initialState = {
  stats: {
    earnings: 12500,
    jobsCompleted: 14,
    rating: 4.8,
  },
  requests: [], // Will be populated by API
  activeJobs: [],
  history: [],
  marketplace: [
    { id: 'p1', name: 'Brembo Brake Pads (Rear)', category: 'Brakes', price: 2400, supplier: 'AutoParts Direct', stock: 15 },
    { id: 'p2', name: 'Motul 7100 10W50 Oil', category: 'Fluids', price: 1100, supplier: 'Lube King', stock: 40 },
    { id: 'p3', name: 'NGK Iridium Spark Plug', category: 'Electrical', price: 850, supplier: 'Sparky Bros', stock: 8 },
    { id: 'p4', name: 'Chain & Sprocket Kit', category: 'Drivetrain', price: 3200, supplier: 'Chain Gang', stock: 3 },
  ],
  isInspectionModalOpen: false,
  isReportModalOpen: false,
  selectedRequestId: null,
  loading: false,
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

export const acceptInspection = createAsyncThunk(
  'mechanic/acceptInspection',
  async (id, { dispatch, rejectWithValue }) => {
    // 1. Show Custom Loader
    dispatch(setLoader('accepting-job'));

    try {
      // 2. Perform API Call
      await mechanicService.updateInspectionStatus(id, 'ACCEPTED');

      // 3. Success Flow
      dispatch(setLoader(null)); // Hide Loader
      dispatch(closeInspectionModal()); // Close the Inspection Details Modal

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
    openReportModal: (state, action) => {
      state.selectedRequestId = action.payload;
      state.isReportModalOpen = true;
    },
    closeReportModal: (state) => {
      state.isReportModalOpen = false;
      state.selectedRequestId = null;
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
      // Map API response to local state structure
      state.requests = action.payload.map((item) => ({
        id: String(item.id), // Ensure ID is string
        bikeModel: item.product.title,
        bikeImage: item.product.images[0]?.url || '',
        customerName: item.buyer.name,
        location: 'Mumbai', // Defaulting as API doesn't provide it yet
        offerAmount: item.offerAmount,
        date: item.scheduledDate ? item.scheduledDate.split('T')[0] : item.createdAt.split('T')[0],
        status: 'pending',
        details: item.message || 'Standard Inspection Request'
      }));
    });
    // Active Inspections
    builder.addCase(fetchActiveInspections.fulfilled, (state, action) => {
      // Filter out cancelled inspections as mechanics shouldn't see them
      state.requests = action.payload
        .filter((item) => item.status !== 'CANCELLED')
        .map((item) => ({
          id: String(item.id),
          bikeModel: item.product?.title || 'Unknown Model',
          bikeImage: item.product?.images?.[0]?.url || '',
          customerName: item.buyer?.name || 'Unknown Buyer',
          location: 'Mumbai', // Fallback
          offerAmount: item.offerAmount,
          date: item.createdAt ? item.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
          status: item.status.toLowerCase(),
          details: item.message || 'Inspection Request',
          dueDate: item.scheduledDate ? item.scheduledDate.split('T')[0] : undefined,
        }));
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
        request.dueDate = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]; // Due in 2 days
        state.activeJobs.push(request);
        state.requests.splice(index, 1);
      }
      // Note: Modal closing is now handled in the thunk to ensure correct ordering with UI loader
    });

    // Submit Report Logic
    builder.addCase(submitInspectionReport.fulfilled, (state, action) => {
      const { id, report } = action.payload;
      const jobIndex = state.activeJobs.findIndex(j => j.id === id);
      if (jobIndex !== -1) {
        const job = state.activeJobs[jobIndex];
        job.status = 'completed';
        job.report = report;

        // Move to history
        state.history.unshift(job);
        state.activeJobs.splice(jobIndex, 1);

        // Update stats
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
  rejectRequest,
  orderPart
} = mechanicSlice.actions;

export default mechanicSlice.reducer;