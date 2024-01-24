import { createSlice } from '@reduxjs/toolkit';
import type { AnyAction, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
export interface HomeLoadingBarState {
  value: number;
}

const initialState: HomeLoadingBarState = {
  value: 0,
};

export const homeLoadingBarSlice = createSlice({
  name: 'homeLoadingBar',
  initialState,
  reducers: {
    updateHomeLoadingBar: (state, action: PayloadAction<any>) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: AnyAction) => {
      return {
        ...state,
        ...action.payload.homeLoadingBar,
      };
    });
  },
});

// Action creators are generated for each case reducer function
export const { updateHomeLoadingBar } = homeLoadingBarSlice.actions;

export default homeLoadingBarSlice.reducer;
