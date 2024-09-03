import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedNetwork: "ethereum",
  walletAddress: "",
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setNetwork(state, action) {
      state.selectedNetwork = action.payload;
    },
    setWalletAddress(state, action) {
      state.walletAddress = action.payload;
    },
  },
});

export const { setNetwork, setWalletAddress } = globalSlice.actions;
export default globalSlice.reducer;
