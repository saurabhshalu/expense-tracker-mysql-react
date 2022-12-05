import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import globalReducer from "./globalSlice";

const store = configureStore({
  devTools: true,
  reducer: {
    auth: authReducer,
    global: globalReducer,
  },
});

export default store;
