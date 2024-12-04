import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    fullname: "",
    email: "",
    wallets: [],
    preferredCurrency: "USD"
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser(state, action) {
      state.fullname = action.payload.fullname;
      state.email = action.payload.email;
      state.wallets = action.payload.wallets;
      state.preferredCurrency = action.payload.preferredCurrency;
    },
    logoutUser(state) {
      state.fullname = "";
      state.email = "";
      state.wallets = [];
      state.preferredCurrency = "USD";
    },
    updateFullname(state, action) {
        state.fullname = action.payload;
    },
  },
});

export const { setuserStatus, loginUser, logoutUser, updateFullname } = userSlice.actions;
export default userSlice.reducer;
