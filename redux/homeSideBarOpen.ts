import { createSlice } from "@reduxjs/toolkit";
import type { AnyAction, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
export interface HomeSideBarOpen {
  value: boolean;
}

const initialState: HomeSideBarOpen = {
  value: false,
};

export const homeSideBarOpenSlice = createSlice({
  name: "homeSideBarOpen",
  initialState,
  reducers: {
    updateHomeSideBarOpen: (state, action: PayloadAction<any>) => {
      state.value =
        typeof action.payload == "string"
          ? action.payload == "false"
            ? false
            : true
          : action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: AnyAction) => {
      return {
        ...state,
        ...action.payload.homeSideBarOpen,
      };
    });
  },
});

// Action creators are generated for each case reducer function
export const { updateHomeSideBarOpen } = homeSideBarOpenSlice.actions;

export default homeSideBarOpenSlice.reducer;
