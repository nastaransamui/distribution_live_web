import { createSlice } from "@reduxjs/toolkit";
import type { AnyAction, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { BestDoctorsType } from "./bestDoctorsData";
export interface BestCardioDoctorsType
  extends Omit<BestDoctorsType, "timeslots" | "timeSlotId"> {
  timeSlotId: string[]; // Changed from string to string[]
}

export interface BestCardioDoctorsDataType {
  bestDoctors: BestCardioDoctorsType[] | null;
  totalBestDoctors: number | null;
  totalDoctors: number | null;
}
const initialState: BestCardioDoctorsDataType = {
  bestDoctors: null,
  totalBestDoctors: null,
  totalDoctors: null,
};

export const bestCardioDoctorsDataSlice = createSlice({
  name: "bestCardioDoctorsData",
  initialState,
  reducers: {
    updateBestCardioDoctorsData: (state, action: PayloadAction<any>) => {
      state.bestDoctors = action.payload.bestDoctors;
      state.totalBestDoctors = action.payload.totalBestDoctors;
      state.totalDoctors = action.payload.totalDoctors;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: AnyAction) => {
      return {
        ...state,
        ...action.payload.bestCardioDoctorsData,
      };
    });
  },
});

// Action creators are generated for each case reducer function
export const { updateBestCardioDoctorsData } =
  bestCardioDoctorsDataSlice.actions;

export default bestCardioDoctorsDataSlice.reducer;
