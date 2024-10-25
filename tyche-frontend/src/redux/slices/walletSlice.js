import { createSlice } from "@reduxjs/toolkit";



const loadState = () => {
  try {
    const serializedState = localStorage.getItem("savedWallets");
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch {
    return undefined;
  }
}

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("savedWallets", serializedState);
  } catch {
    // ignore write errors
  }
};

const initialState = loadState() || {
  addresses: [], // Kullanıcının cüzdan adresleri
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    addAddress(state, action) {
      state.addresses.push(action.payload);
      saveState(state);
    },
    updateAddress(state, action) {
      const index = state.addresses.findIndex(
        (address) => address.id === action.payload.id
      );
      if (index !== -1) {
        state.addresses[index] = action.payload;
      }
      saveState(state);
    },
    deleteAddress(state, action) {
      state.addresses = state.addresses.filter(
        (address) => address.id !== action.payload
      );
      saveState(state);
    },
  },
});

export const { addAddress, updateAddress, deleteAddress } = walletSlice.actions;
export default walletSlice.reducer;
