import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./slices/globalSlice";
import premiumReducer from "./slices/premiumSlice";
import settingsReducer from "./slices/settingsSlice";

const store = configureStore({
  reducer: {
    global: globalReducer,
    premium: premiumReducer,
    settings: settingsReducer,
  },
});

export default store;
