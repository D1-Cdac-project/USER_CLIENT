import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isUserLoggedIn: boolean;
}

const initialState: AuthState = {
  isUserLoggedIn: !!localStorage.getItem("userToken"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state) {
      state.isUserLoggedIn = true;
    },
    logout(state) {
      state.isUserLoggedIn = false;
      localStorage.removeItem("userToken");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
