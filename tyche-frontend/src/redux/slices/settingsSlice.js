// src/redux/slices/settingsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currency: "USD",
  timezone: "GMT+0",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateSettings(state, action) {
      state.currency = action.payload.currency;
      state.timezone = action.payload.timezone;
    },
  },
});

export const { updateSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
