import { configureStore } from "@reduxjs/toolkit";
import adminSlice from "./adminSlice";
import userReducer from "./userSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    admin: adminSlice,
  },
});
