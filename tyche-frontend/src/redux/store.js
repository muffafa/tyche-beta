import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import globalReducer from "./slices/globalSlice";
import premiumReducer from "./slices/premiumSlice";
import settingsReducer from "./slices/settingsSlice";
import walletReducer from "./slices/walletSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    global: globalReducer,
    premium: premiumReducer,
    settings: settingsReducer,
    wallet: walletReducer, // Wallet slice'ı store'a ekleyin
  },
});

export default store;
