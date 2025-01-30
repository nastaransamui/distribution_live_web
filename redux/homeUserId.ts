import { createSlice } from "@reduxjs/toolkit";
import type { AnyAction, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
export interface HomeUserIdState {
  value: string | null;
}

const initialState: HomeUserIdState = {
  value: null,
};

export const homeUserIdSlice = createSlice({
  name: "homeUserId",
  initialState,
  reducers: {
    updateHomeUserId: (state, action: PayloadAction<any>) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: AnyAction) => {
      return {
        ...state,
        ...action.payload.homeUserId,
      };
    });
  },
});

// Action creators are generated for each case reducer function
export const { updateHomeUserId } = homeUserIdSlice.actions;

export default homeUserIdSlice.reducer;
