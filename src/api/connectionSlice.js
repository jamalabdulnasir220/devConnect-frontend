import { createSlice } from "@reduxjs/toolkit";

export const connectionSlice = createSlice({
  name: "connnections",
  initialState: null,
  reducers: {
    connectionAdded: (state, action) => {
      return action.payload;
    },
    connectionRemoved: (state, action) => {
      return null;
    },
  },
});

export const { connectionAdded, connectionRemoved } = connectionSlice.actions;
export default connectionSlice.reducer;
export const selectedConnection = (state) => state.connnections;
