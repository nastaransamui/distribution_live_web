import { createSlice, AnyAction } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const initialState: any = {
  value: {} as any,
};

export const homeSocketSlice = createSlice({
  name: 'homeSocket',
  initialState,
  reducers: {
    updateHomeSocket: (state, action: PayloadAction<any>) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: AnyAction) => {
      return {
        ...state,
        ...action.payload.homeSocket.value,
      };
    });
  },
});

// Action creators are generated for each case reducer function
export const { updateHomeSocket } = homeSocketSlice.actions;

export default homeSocketSlice.reducer;
