import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BookingState {
  mandapId: string | null;
  mandap: any;
  photographerList: any[];
  catererList: any[];
  roomList: any;
  availableDates: string[];
  selectedDates: string[];
  formData: {
    address: string;
    includePhotography: boolean;
    includeCatering: boolean;
    includeRooms: boolean;
    selectedPhotographer: string;
    photographyCategory: string;
    photographyPrice: number;
    selectedCaterer: string;
    cateringPlan: string;
    acRooms: number;
    nonAcRooms: number;
  };
}

const initialState: BookingState = {
  mandapId: null,
  mandap: {},
  photographerList: [],
  catererList: [],
  roomList: {},
  availableDates: [],
  selectedDates: [],
  formData: {
    address: "",
    includePhotography: false,
    includeCatering: false,
    includeRooms: false,
    selectedPhotographer: "",
    photographyCategory: "",
    photographyPrice: 0,
    selectedCaterer: "",
    cateringPlan: "",
    acRooms: 0,
    nonAcRooms: 0,
  },
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    startBooking: (state, action: PayloadAction<string>) => {
      state.mandapId = action.payload;
      state.mandap = {};
      state.photographerList = [];
      state.catererList = [];
      state.roomList = {};
      state.availableDates = [];
      state.selectedDates = [];
      state.formData = { ...initialState.formData };
    },
    setMandap: (state, action: PayloadAction<any>) => {
      state.mandap = action.payload;
    },
    setPhotographerList: (state, action: PayloadAction<any[]>) => {
      state.photographerList = action.payload;
    },
    setCatererList: (state, action: PayloadAction<any[]>) => {
      state.catererList = action.payload;
    },
    setRoomList: (state, action: PayloadAction<any>) => {
      state.roomList = action.payload;
    },
    setAvailableDates: (state, action: PayloadAction<string[]>) => {
      state.availableDates = action.payload;
    },
    setSelectedDates: (state, action: PayloadAction<string[]>) => {
      state.selectedDates = action.payload;
    },
    updateFormData: (
      state,
      action: PayloadAction<Partial<BookingState["formData"]>>
    ) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetBookingState: () => initialState,
  },
});

export const {
  startBooking,
  setMandap,
  setPhotographerList,
  setCatererList,
  setRoomList,
  setAvailableDates,
  setSelectedDates,
  updateFormData,
  resetBookingState,
} = bookingSlice.actions;

export default bookingSlice.reducer;
