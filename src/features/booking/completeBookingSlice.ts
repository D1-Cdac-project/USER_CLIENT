import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CompleteBookingState {
  mandapId: string | null;
  venueCost: number;
  selectedDates: string[];
  caterer?: {
    catererId: string;
    catererName: string;
    cateringTotal: number;
  };
  photographer?: {
    photographerId: string;
    photographyCategory: string;
    photographyPrice: number;
  };
  rooms?: {
    acRooms: number;
    nonAcRooms: number;
    accommodationTotal: number;
  };
  totalAmount: number;
}

const initialState: CompleteBookingState = {
  mandapId: null,
  venueCost: 0,
  selectedDates: [],
  totalAmount: 0,
};

const completeBookingSlice = createSlice({
  name: "completeBooking",
  initialState,
  reducers: {
    setVenueAndDates: (
      state,
      action: PayloadAction<{ mandapId: string; venueCost: number; dates: string[] }>
    ) => {
      state.mandapId = action.payload.mandapId;
      state.venueCost = action.payload.venueCost;
      state.selectedDates = action.payload.dates;
    },
    setCateringDetails: (
      state,
      action: PayloadAction<{ catererId: string; catererName: string; cateringTotal: number }>
    ) => {
      state.caterer = action.payload;
    },
    setPhotographyDetails: (
      state,
      action: PayloadAction<{ photographerId: string; photographyCategory: string; photographyPrice: number }>
    ) => {
      state.photographer = action.payload;
    },
    setRoomDetails: (
      state,
      action: PayloadAction<{ acRooms: number; nonAcRooms: number; accommodationTotal: number }>
    ) => {
      state.rooms = action.payload;
    },
    setTotalAmount: (state, action: PayloadAction<number>) => {
      state.totalAmount = action.payload;
    },
    clearCompleteBooking: (state) => {
      state.mandapId = null;
      state.venueCost = 0;
      state.selectedDates = [];
      state.caterer = undefined;
      state.photographer = undefined;
      state.rooms = undefined;
      state.totalAmount = 0;
    },
  },
});

export const {
  setVenueAndDates,
  setCateringDetails,
  setPhotographyDetails,
  setRoomDetails,
  setTotalAmount,
  clearCompleteBooking,
} = completeBookingSlice.actions;

export default completeBookingSlice.reducer;
