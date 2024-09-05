import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addresses: [], // Kullanıcının cüzdan adresleri
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    addAddress(state, action) {
      state.addresses.push(action.payload);
    },
    updateAddress(state, action) {
      const index = state.addresses.findIndex(
        (address) => address.id === action.payload.id
      );
      if (index !== -1) {
        state.addresses[index] = action.payload;
      }
    },
    deleteAddress(state, action) {
      state.addresses = state.addresses.filter(
        (address) => address.id !== action.payload
      );
    },
  },
});

export const { addAddress, updateAddress, deleteAddress } = walletSlice.actions;
export default walletSlice.reducer;
