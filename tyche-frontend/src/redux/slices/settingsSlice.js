import { createSlice } from "@reduxjs/toolkit";

// Load initial state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("settings");
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (e) {
    console.error("Could not load state", e);
    return undefined;
  }
};

// Save state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("settings", serializedState);
  } catch (e) {
    console.error("Could not save state", e);
  }
};

const initialState = loadState() || {
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
      saveState(state); // Save the updated state to localStorage
    },
  },
});

export const { updateSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
