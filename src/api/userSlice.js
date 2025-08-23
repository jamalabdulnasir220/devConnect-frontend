import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    userAdded: (state, action) => {
      return action.payload;
    },
    userRemoved: (state, action) => {
      return null;
    },
  },
});

export const {userAdded, userRemoved} = userSlice.actions

export default userSlice.reducer

export const selectUser = (state) => state.user 
