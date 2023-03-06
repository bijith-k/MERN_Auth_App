import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  id: "",
  email: "",
  phone: "",
  image: "",
  token: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.phone = action.payload.phone;
      state.image = action.payload.image;
      state.token = action.payload.token;
    },
  },
});

export const { setUserDetails } = userSlice.actions;
export default userSlice.reducer;
