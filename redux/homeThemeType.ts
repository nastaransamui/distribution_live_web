import { PaletteMode } from '@mui/material';
import { createSlice } from '@reduxjs/toolkit';
import type { AnyAction, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
export interface HomeThemeTypeState {
  value: PaletteMode;
}

const initialState: HomeThemeTypeState = {
  value: 'dark',
};

export const homeThemeTypeSlice = createSlice({
  name: 'homeThemeType',
  initialState,
  reducers: {
    updateHomeThemeType: (state, action: PayloadAction<any>) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: AnyAction) => {
      return {
        ...state,
        ...action.payload.homeThemeType,
      };
    });
  },
});

// Action creators are generated for each case reducer function
export const { updateHomeThemeType } = homeThemeTypeSlice.actions;

export default homeThemeTypeSlice.reducer;
