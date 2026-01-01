import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import sellerReducer from './slices/sellerSlice';
import mechanicReducer from './slices/mechanicSlice';
import buyerReducer from './slices/buyerSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    seller: sellerReducer,
    mechanic: mechanicReducer,
    buyer: buyerReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore checking for functions in the statusModal actions if needed
        ignoredActions: ['ui/openStatusModal'],
        ignoredPaths: ['ui.statusModal.onAction'],
      },
    }),
});
