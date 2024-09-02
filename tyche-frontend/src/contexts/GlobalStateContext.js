import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedNetwork: 'ethereum',
  walletAddress: '',
  txHistory: [],
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setNetwork(state, action) {
      state.selectedNetwork = action.payload;
    },
    setWalletAddress(state, action) {
      state.walletAddress = action.payload;
    },
    setTxHistory(state, action) {
      state.txHistory = action.payload;
    },
  },
});

export const { setNetwork, setWalletAddress, setTxHistory } = globalSlice.actions;
export default globalSlice.reducer;
