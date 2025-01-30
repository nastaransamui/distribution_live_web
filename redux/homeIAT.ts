import { createSlice } from "@reduxjs/toolkit";
import type { AnyAction, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
export interface HomeIATState {
  value: number | null;
}

const initialState: HomeIATState = {
  value: null,
};

export const homeIATSlice = createSlice({
  name: "homeIAT",
  initialState,
  reducers: {
    updateHomeIAT: (state, action: PayloadAction<any>) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: AnyAction) => {
      return {
        ...state,
        ...action.payload.homeIAT,
      };
    });
  },
});

// Action creators are generated for each case reducer function
export const { updateHomeIAT } = homeIATSlice.actions;

export default homeIATSlice.reducer;
