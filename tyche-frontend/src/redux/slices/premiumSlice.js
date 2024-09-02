import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isPremium: false,
};

const premiumSlice = createSlice({
  name: "premium",
  initialState,
  reducers: {
    setPremiumStatus(state, action) {
      state.isPremium = action.payload;
    },
  },
});

export const { setPremiumStatus } = premiumSlice.actions;
export default premiumSlice.reducer;
