import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  refetch: 0,
  notificationCounter: 0
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setRefetch(state, action: PayloadAction<number>) {
        state.refetch = action.payload;
    },
    setNotificationCounter(state, action: PayloadAction<number>) {
      state.notificationCounter = action.payload;
    }
  },
});

export const { setRefetch, setNotificationCounter } = commonSlice.actions;
export default commonSlice.reducer;
