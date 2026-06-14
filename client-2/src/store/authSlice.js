import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '@/api/authApi';
import { getStoredAuth, setStoredAuth, clearStoredAuth } from '@/utils/storage';

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await authApi.login(credentials);
      if (!data.success) return rejectWithValue(data.message);
      setStoredAuth(data);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signup',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authApi.signup(payload);
      if (!data.success) return rejectWithValue(data.message);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Signup failed');
    }
  }
);

export const verifySession = createAsyncThunk(
  'auth/verify',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.userAuth();
      return getStoredAuth();
    } catch {
      clearStoredAuth();
      return rejectWithValue('Session expired');
    }
  }
);

const stored = getStoredAuth();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: stored?.user || null,
    token: stored?.token || null,
    loading: false,
    error: null,
    isAuthenticated: !!stored?.token,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      clearStoredAuth();
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      setStoredAuth({ user: state.user, token: state.token });
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifySession.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      })
      .addCase(verifySession.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, updateUser, clearError } = authSlice.actions;
export default authSlice.reducer;
