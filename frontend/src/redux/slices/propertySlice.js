import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/properties";

// Initial state
const initialState = {
  properties: [],
  property: null,
  loading: false,
  error: null,
  success: false,
  meta: {},
};

// ADD PROPERTY
export const addProperty = createAsyncThunk(
  "property/add",
  async ({ formData, token }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return data.property;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to add property");
    }
  }
);

// FETCH PROPERTIES
export const fetchProperties = createAsyncThunk(
  "property/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params).toString();
      const { data } = await axios.get(`${API_URL}?${query}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch properties");
    }
  }
);

const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    clearPropertyState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.property = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // === Add Property ===
      .addCase(addProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addProperty.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.property = payload;
      })
      .addCase(addProperty.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.success = false;
      })

      // === Fetch Properties ===
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.properties = payload.data;
        state.meta = payload.meta;
      })
      .addCase(fetchProperties.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { clearPropertyState } = propertySlice.actions;
export default propertySlice.reducer;
