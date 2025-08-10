import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CatererBookingState {
  mandapId: string;
  catererId: string;
  catererName: string;
  selectedItems: string[];
  plates: number;
  selectedPlan: string;
  planTotal: number;
  customMenuTotal: number;
  totalPrice: number;
}

const initialState: CatererBookingState = {
  mandapId: "",
  catererId: "",
  catererName: "",
  selectedItems: [],
  plates: 100,
  selectedPlan: "",
  planTotal: 0,
  customMenuTotal: 0,
  totalPrice: 0,
};

const catererBookingSlice = createSlice({
  name: "catererBooking",
  initialState,
  reducers: {
    setCatererBooking(state, action: PayloadAction<Partial<CatererBookingState>>) {
      return { ...state, ...action.payload };
    },
    clearCatererBooking() {
      return initialState;
    },
  },
});

export const { setCatererBooking, clearCatererBooking } = catererBookingSlice.actions;
export default catererBookingSlice.reducer;
