import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "../contexts/GlobalStateContext";
import premiumReducer from "../contexts/PremiumContext";

const store = configureStore({
  reducer: {
    global: globalReducer,
    premium: premiumReducer,
  },
});

export default store;
