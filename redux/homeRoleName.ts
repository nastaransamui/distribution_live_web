import { createSlice } from "@reduxjs/toolkit";
import type { AnyAction, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
export interface HomeRoleNameState {
  value: "doctors" | "patient" | "pharmacist" | null;
}

const initialState: HomeRoleNameState = {
  value: null,
};

export const homeRoleNameSlice = createSlice({
  name: "homeRoleName",
  initialState,
  reducers: {
    updateHomeRoleName: (state, action: PayloadAction<any>) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: AnyAction) => {
      return {
        ...state,
        ...action.payload.homeRoleName,
      };
    });
  },
});

// Action creators are generated for each case reducer function
export const { updateHomeRoleName } = homeRoleNameSlice.actions;

export default homeRoleNameSlice.reducer;
