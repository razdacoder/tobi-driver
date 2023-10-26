import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  session: JSON.parse(localStorage.getItem("session")) || null,
  user: JSON.parse(localStorage.getItem("user")) || null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.session = action.payload;
      localStorage.setItem("session", JSON.stringify(action.payload));
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSession, setUser } = authSlice.actions;

export const selectSession = (state) => state.auth.session;
export const selectUser = (state) => state.auth.user;

export default authSlice.reducer;
