import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./slice/userSlice";
import { themeSlice } from "./slice/themeSlice";
import { postSlice } from "./slice/postSlice";

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    theme: themeSlice.reducer,
    posts: postSlice.reducer,
  },
});
