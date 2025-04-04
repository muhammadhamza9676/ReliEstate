import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// Load data from localStorage if available
const user = localStorage.getItem("user");
const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");

const initialState = {
  user: user ? JSON.parse(user) : null,
  accessToken,
  refreshToken,
  loading: false,
  error: null,
};

// === THUNKS ===
// Login Thunk
export const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${API_URL}/login`, credentials);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

// Register Thunk
export const register = createAsyncThunk("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${API_URL}/register`, userData);
    return data; // On success, we can return a success message or any necessary data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Registration failed");
  }
});

// OTP Verification Thunk
export const verifyOTP = createAsyncThunk("auth/verifyOTP", async ({ email, otp }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${API_URL}/verify-otp`, { email, otp });
    return data; // On success, you can return any necessary data or message
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "OTP verification failed");
  }
});

// Refresh Access Token Thunk
export const refreshAccessToken = createAsyncThunk("auth/refreshToken", async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const { data } = await axios.post(`${API_URL}/refresh-token`, {
      refreshToken: auth.refreshToken,
    });
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Session expired");
  }
});

// Logout Thunk
export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    // API call to log the user out (if required on the server side)
    await axios.post(`${API_URL}/logout`, {
      refreshToken: localStorage.getItem("refreshToken"),
    });
    // Clear localStorage
    localStorage.clear();
    return;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Logout failed");
  }
});

// === SLICE ===
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.accessToken = payload.accessToken;
        state.refreshToken = payload.refreshToken;
        state.error = null;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        // Reset Redux state upon logout
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.error = null;
        state.loading = false;
      })
      .addCase(logout.rejected, (state, { payload }) => {
        state.error = payload; // Handle errors if any during logout
      })

      // Registration
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // OTP Verification
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(verifyOTP.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

  },
});

export default authSlice.reducer;
