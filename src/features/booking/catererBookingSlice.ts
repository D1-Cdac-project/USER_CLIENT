import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CatererBookingState {
  catererId: string | null;
  catererName: string | null;
  totalPrice: number;
}

const initialState: CatererBookingState = {
  catererId: null,
  catererName: null,
  totalPrice: 0,
};

const catererBookingSlice = createSlice({
  name: "catererBooking",
  initialState,
  reducers: {
    setCatererBooking: (
      state,
      action: PayloadAction<{ catererId: string; catererName: string; totalPrice: number }>
    ) => {
      state.catererId = action.payload.catererId;
      state.catererName = action.payload.catererName;
      state.totalPrice = action.payload.totalPrice;
    },
    clearCatererBooking: (state) => {
      state.catererId = null;
      state.catererName = null;
      state.totalPrice = 0;
    },
  },
});

export const { setCatererBooking, clearCatererBooking } = catererBookingSlice.actions;

export default catererBookingSlice.reducer;
