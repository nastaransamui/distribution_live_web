import { createSlice } from "@reduxjs/toolkit";
import type { AnyAction, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
export interface HomeExpState {
  value: number | null;
}

const initialState: HomeExpState = {
  value: null,
};

export const homeExpSlice = createSlice({
  name: "homeExp",
  initialState,
  reducers: {
    updateHomeExp: (state, action: PayloadAction<any>) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: AnyAction) => {
      return {
        ...state,
        ...action.payload.homeExp,
      };
    });
  },
});

// Action creators are generated for each case reducer function
export const { updateHomeExp } = homeExpSlice.actions;

export default homeExpSlice.reducer;
