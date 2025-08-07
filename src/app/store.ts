import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import catererBookingReducer from "../features/booking/catererBookingSlice";
import bookingReducer from "../features/booking/bookingSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    catererBooking: catererBookingReducer,
    booking: bookingReducer,
  },
});

// Types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;