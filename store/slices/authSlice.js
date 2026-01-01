import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import { setLoader, openStatusModal } from './uiSlice';


// --- Helper to derive role string from backend object ---
const deriveRoleString = (roles) => {
  if (!roles) return 'user';
  if (roles.isSeller) return 'seller';
  if (roles.isMechanic) return 'mechanic';
  return 'user';
};

// --- Initial State with LocalStorage Hydration ---
const getInitialState = () => {
  try {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');

    if (token && userStr) {
      return {
        user: JSON.parse(userStr),
        token: token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        onboarding: { role: null, details: {} }
      };
    }
  } catch (e) {
    console.error("Failed to load session", e);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    onboarding: {
      role: null,
      details: {},
    },
  };
};

const initialState = getInitialState();

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { dispatch, rejectWithValue }) => {
    dispatch(setLoader('auth'));
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (err) {
      dispatch(openStatusModal({
        type: 'error',
        title: 'Login Failed',
        message: err.message || 'Check your credentials and try again.'
      }));
      return rejectWithValue(err.message);
    } finally {
      dispatch(setLoader(null));
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { dispatch, rejectWithValue }) => {
    dispatch(setLoader('auth'));
    try {
      const response = await authService.register(userData);
      //   let response = {
      //     "message": "User registered successfully",
      //     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc0ZmYxZGE0LTIwMDQtNDljZi1hN2QwLTY3MzNmYjI3YTU4MCIsImVtYWlsIjoidmlja3lAZXhhbXBsZS5jb20iLCJyb2xlcyI6eyJpc01lY2hhbmljIjpmYWxzZSwiaXNTZWxsZXIiOmZhbHNlLCJpc0FkbWluIjpmYWxzZX0sImlhdCI6MTc2NjgzMDQ5NiwiZXhwIjoxNzY3NDM1Mjk2fQ.LsJwSDn9AspjiBi-JMDRh8VSp7qSAG7imFHti9cfIyc",
      //     "user": {
      //         "id": "74ff1da4-2004-49cf-a7d0-6733fb27a580",
      //         "name": "John Doe",
      //         "roles": {
      //             "isMechanic": false,
      //             "isSeller": false,
      //             "isAdmin": false
      //         }
      //     }
      // }
      return response;
    } catch (err) {
      dispatch(openStatusModal({
        type: 'error',
        title: 'Registration Failed',
        message: 'Could not create account. Please try again.'
      }));
      return rejectWithValue(err.message);
    } finally {
      dispatch(setLoader(null));
    }
  }
);


export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (payload, { dispatch, rejectWithValue }) => {
    dispatch(setLoader('updating-profile'));
    try {
      // Construct payload for API (Flatten address)
      const apiPayload = {
        name: payload.name,
        phone: payload.phone,
        ...payload.address // Spread street, city, state, zip, country
      };

      const response = await authService.updateProfile(apiPayload);

      dispatch(openStatusModal({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your personal information has been successfully updated.',
        actionLabel: 'Okay'
      }));

      // Handle Image Upload Logic (Mock for now as backend endpoint focuses on text data)
      let imageUrl = response.profileImage;
      if (payload.profileImage) {
        imageUrl = URL.createObjectURL(payload.profileImage);
      }

      return { ...response, profileImage: imageUrl };
    } catch (err) {
      dispatch(openStatusModal({
        type: 'error',
        title: 'Update Failed',
        message: err.response?.data?.message || err.message || 'Failed to update profile.'
      }));
      return rejectWithValue('Failed to update profile');
    } finally {
      dispatch(setLoader(null));
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.onboarding.role = action.payload;
    },
    setDetails: (state, action) => {
      state.onboarding.details = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.onboarding = { role: null, details: {} };
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;

      const backendUser = action.payload.user;
      const derivedRole = deriveRoleString(backendUser.roles);

      const userObj = {
        ...backendUser,
        role: derivedRole // Ensure flat 'role' exists for routing
      };

      state.user = userObj;
      state.token = action.payload.token;

      // Persist
      localStorage.setItem('auth_token', action.payload.token);
      localStorage.setItem('auth_user', JSON.stringify(userObj));
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;

      const backendUser = action.payload.user;
      const derivedRole = deriveRoleString(backendUser.roles);

      const userObj = {
        ...backendUser,
        role: derivedRole
      };

      state.user = userObj;
      state.token = action.payload.token;

      // Persist
      localStorage.setItem('auth_token', action.payload.token);
      localStorage.setItem('auth_user', JSON.stringify(userObj));
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    // Update Profile
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      if (state.user) {
        const { addresses, ...userData } = action.payload;

        state.user = {
          ...state.user,
          ...userData,
          // The API returns an array of addresses, but frontend uses a single address object for now.
          // We pick the first one to keep state consistent.
          address: addresses && addresses.length > 0 ? addresses[0] : state.user.address
        };

        // Update storage
        localStorage.setItem('auth_user', JSON.stringify(state.user));
      }
    });
  },
});

export const { setRole, setDetails, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
