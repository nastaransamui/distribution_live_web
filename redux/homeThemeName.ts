import { createSlice } from "@reduxjs/toolkit";
import type { AnyAction, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
export interface HomeThemeNameState {
  value: string;
}

const initialState: HomeThemeNameState = {
  value: "geenNature",
};

export const homeThemeNameSlice = createSlice({
  name: "homeThemeName",
  initialState,
  reducers: {
    updateHomeThemeName: (state, action: PayloadAction<any>) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: AnyAction) => {
      return {
        ...state,
        ...action.payload.homeThemeName,
      };
    });
  },
});

// Action creators are generated for each case reducer function
export const { updateHomeThemeName } = homeThemeNameSlice.actions;

export default homeThemeNameSlice.reducer;
