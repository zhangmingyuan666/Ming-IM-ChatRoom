import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/user";
import socketSlice from './slices/socket'

const store = configureStore({
  reducer: {
    user: userSlice,
    socket: socketSlice
  },
});

export default store;