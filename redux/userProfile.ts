import { createSlice } from "@reduxjs/toolkit";
import type { AnyAction, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { UserDoctorProfileType } from "./userDoctorProfile";
import { UserPatientProfileType } from "./userPatientProfile";

export interface UserProfileType {
  value: UserDoctorProfileType | UserPatientProfileType | null;
}

const initialState: UserProfileType = {
  value: null,
};

export const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    updateUserProfile: (state, action: PayloadAction<any>) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: AnyAction) => {
      return {
        ...state,
        ...action.payload.userProfile,
      };
    });
  },
});

// Action creators are generated for each case reducer function
export const { updateUserProfile } = userProfileSlice.actions;

export default userProfileSlice.reducer;
