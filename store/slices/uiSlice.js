import { createSlice } from '@reduxjs/toolkit';


// Get initial theme from localStorage or default to dark
const getInitialTheme = () => {
  try {
    const saved = localStorage.getItem('theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  } catch {
    return 'dark';
  }
};

const initialState = {
  theme: getInitialTheme(),
  activeLoader: null,
  statusModal: {
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  },
  notifications: [
    {
      id: 'welcome',
      title: 'Welcome!',
      message: 'Your seller dashboard is ready.',
      type: 'info',
      read: false,
      timestamp: new Date().toISOString()
    }
  ]
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', state.theme);
    },
    setLoader: (state, action) => {
      state.activeLoader = action.payload;
    },
    openStatusModal: (state, action) => {
      state.statusModal = {
        isOpen: true,
        type: action.payload.type,
        title: action.payload.title,
        message: action.payload.message,
        actionLabel: action.payload.actionLabel
      };
    },
    closeStatusModal: (state) => {
      state.statusModal.isOpen = false;
    },
    addNotification: (state, action) => {
      state.notifications.unshift({
        id: Date.now().toString(),
        title: action.payload.title,
        message: action.payload.message,
        type: action.payload.type || 'info',
        read: false,
        timestamp: new Date().toISOString()
      });
    },
    markAllNotificationsRead: (state) => {
      state.notifications.forEach(n => n.read = true);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    }
  }
});

export const { toggleTheme, setLoader, openStatusModal, closeStatusModal, addNotification, clearNotifications, markAllNotificationsRead } = uiSlice.actions;
export default uiSlice.reducer;