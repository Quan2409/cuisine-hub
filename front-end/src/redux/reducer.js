import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice";
import themeSlice from "./slice/themeSlice";
import postSlice from "./slice/postSlice";

const rootReducer = combineReducers({
  user: userSlice,
  theme: themeSlice,
  posts: postSlice,
});

export { rootReducer };
