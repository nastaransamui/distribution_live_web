import { createSlice } from "@reduxjs/toolkit";
import type { AnyAction, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { BestDoctorsType } from "./bestDoctorsData";
export interface BestEyeCareDoctorsType
  extends Omit<BestDoctorsType, "timeslots" | "timeSlotId"> {
  timeSlotId: string[]; // Changed from string to string[]
}

export interface BestEyeCareDoctorsDataType {
  bestDoctors: BestEyeCareDoctorsType[] | null;
  totalBestDoctors: number | null;
  totalDoctors: number | null;
}
const initialState: BestEyeCareDoctorsDataType = {
  bestDoctors: null,
  totalBestDoctors: null,
  totalDoctors: null,
};

export const bestEyeCareDoctorsDataSlice = createSlice({
  name: "bestEyeCareDoctorsData",
  initialState,
  reducers: {
    updateBestEyeCareDoctorsData: (state, action: PayloadAction<any>) => {
      state.bestDoctors = action.payload.bestDoctors;
      state.totalBestDoctors = action.payload.totalBestDoctors;
      state.totalDoctors = action.payload.totalDoctors;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: AnyAction) => {
      return {
        ...state,
        ...action.payload.bestEyeCareDoctors,
      };
    });
  },
});

// Action creators are generated for each case reducer function
export const { updateBestEyeCareDoctorsData } =
  bestEyeCareDoctorsDataSlice.actions;

export default bestEyeCareDoctorsDataSlice.reducer;
