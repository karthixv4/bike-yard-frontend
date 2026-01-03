import { createSlice } from '@reduxjs/toolkit';

const TOUR_STORAGE_KEY = 'bike_yard_tour_completed_v2';

const getInitialTheme = () => {
  try {
    const saved = localStorage.getItem('theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  } catch {
    return 'dark';
  }
};
const getInitialTourState = () => {
  try {
    const val = localStorage.getItem(TOUR_STORAGE_KEY);
    return val === 'true';
  } catch {
    return false;
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
      message: 'Your dashboard is ready.',
      type: 'info',
      read: false,
      timestamp: new Date().toISOString()
    }
  ],
  welcomeTourSeen: getInitialTourState(),
  isWelcomeModalOpen: false,
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
    },
    markWelcomeTourSeen: (state) => {
      state.welcomeTourSeen = true;
      localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    },
    openWelcomeModal: (state) => {
      state.isWelcomeModalOpen = true;
    },
    closeWelcomeModal: (state) => {
      state.isWelcomeModalOpen = false;
    }
  },
  extraReducers: (builder) => {
    builder.addCase('auth/logout', (state) => {
      state.welcomeTourSeen = false;
      state.isWelcomeModalOpen = false;
      localStorage.removeItem(TOUR_STORAGE_KEY);
    });
  }
});

export const { toggleTheme, setLoader, openStatusModal, closeStatusModal, markWelcomeTourSeen,
  openWelcomeModal,
  closeWelcomeModal, addNotification, clearNotifications, markAllNotificationsRead } = uiSlice.actions;
export default uiSlice.reducer;