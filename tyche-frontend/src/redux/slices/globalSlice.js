import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedNetwork: "ethereum",
  walletAddress: "",
  txHistory: [],
  portfolio: [], // Kullanıcının tokenlarını saklayacak
  nfts: [], // Kullanıcının NFT'lerini saklayacak
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
    setTxHistory(state, action) {
      state.txHistory = action.payload;
    },
    setPortfolio(state, action) {
      state.portfolio = action.payload;
    },
    setNfts(state, action) {
      state.nfts = action.payload;
    },
  },
});

export const {
  setNetwork,
  setWalletAddress,
  setTxHistory,
  setPortfolio,
  setNfts,
} = globalSlice.actions;
export default globalSlice.reducer;
