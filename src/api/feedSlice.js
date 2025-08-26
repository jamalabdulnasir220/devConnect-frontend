import { createSlice } from "@reduxjs/toolkit";

export const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    feedAdded: (state, action) => {
      return action.payload;
    },
    feedRemoved: (state, action) => {
      const newArray = state.filter((feed) => feed._id !== action.payload);
      return newArray;
    },
  },
});

export const { feedAdded, feedRemoved } = feedSlice.actions;
export default feedSlice.reducer;
export const selectFeed = (state) => state.feed;
