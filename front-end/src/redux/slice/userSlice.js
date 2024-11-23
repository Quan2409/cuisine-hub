import { createSlice } from "@reduxjs/toolkit";
import { user } from "../../assets/data";

const initialState = {
  user: JSON.parse(window.localStorage.getItem("user")) ?? user,
  edit: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    logout(state) {
      state.user = null;
      localStorage.removeItem("user");
    },

    updateProfile(state, action) {
      state.edit = action.payload;
    },
  },
});
