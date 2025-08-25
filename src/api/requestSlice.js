import { createSlice } from "@reduxjs/toolkit";

export const requestSlice = createSlice({
  name: "request",
  initialState: null,
  reducers: {
    requestAdded: (state, action) => {
      return action.payload;
    },
    removeRequest: (state, action) => {
      const newArray = state.filter((x) => x._id !== action.payload);
      return newArray;
    },
  },
});

export const { requestAdded, removeRequest } = requestSlice.actions;
export default requestSlice.reducer;
export const selectedRequests = (state) => state.request;
