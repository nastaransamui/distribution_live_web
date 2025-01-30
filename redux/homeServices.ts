import { createSlice } from "@reduxjs/toolkit";
import type { AnyAction, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
export interface HomeServicesState {
  value: string | null;
}

const initialState: HomeServicesState = {
  value: null,
};

export const homeServicesSlice = createSlice({
  name: "homeServices",
  initialState,
  reducers: {
    updateHomeServices: (state, action: PayloadAction<any>) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: AnyAction) => {
      return {
        ...state,
        ...action.payload.homeServices,
      };
    });
  },
});

// Action creators are generated for each case reducer function
export const { updateHomeServices } = homeServicesSlice.actions;

export default homeServicesSlice.reducer;
