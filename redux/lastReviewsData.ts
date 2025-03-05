import { ReviewTypes } from "@/components/DoctorsSections/Profile/DoctorPublicProfileReviewsTap";
import { createSlice } from "@reduxjs/toolkit";
import type { AnyAction, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

export interface LastReviewsType
  extends Omit<ReviewTypes, "doctorProfile" | "patientProfile"> {
  authorProfile: {
    fullName: string;
    profileImage: string;
    gender: string;
    city: string;
    country: string;
  };
}
export interface LastReviewsDataType {
  lastReviews: LastReviewsType[] | null;
  totalReviews: number | null;
}

const initialState: LastReviewsDataType = {
  lastReviews: null,
  totalReviews: null,
};
export const lastReviewsDataSlice = createSlice({
  name: "lastReviewsData",
  initialState,
  reducers: {
    updateLastReviewsData: (state, action: PayloadAction<any>) => {
      state.lastReviews = action.payload.lastReviews;
      state.totalReviews = action.payload.totalReviews;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: AnyAction) => {
      return {
        ...state,
        ...action.payload.lastReviewsData,
      };
    });
  },
});

// Action creators are generated for each case reducer function
export const { updateLastReviewsData } = lastReviewsDataSlice.actions;

export default lastReviewsDataSlice.reducer;
