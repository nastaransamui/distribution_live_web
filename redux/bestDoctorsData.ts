import { createSlice } from "@reduxjs/toolkit";
import type { AnyAction, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { SpecialitiesType } from "./specialities";
import { CurrenciesType } from "@/components/shared/CurrencyAutocomplete";
import { DoctorsTimeSlotType } from "@/components/DoctorDashboardSections/ScheduleTiming";

export interface BestDoctorsType {
  aboutMe: string;
  address1: string;
  address2: string;
  bookingsFee: number;
  city: string;
  clinicAddress: string;
  clinicImages: string[];
  clinicName: string;
  country: string;
  createdAt: Date;
  currency: CurrenciesType[];
  dob: Date | "";
  favs_id: string[];
  firstName: string;
  fullName: string;
  gender: string;
  idle?: boolean;
  isActive: boolean;
  lastLogin?: {
    date: Date;
    ipAddr: string;
    userAgent: string;
  };
  lastName: string;
  lastUpdate: Date;
  mobileNumber: string;
  online: boolean;
  patientCount: number;
  profileImage: string;
  roleName: "doctors";
  socialMedia: [] | { platform: string; link: string }[];
  specialities: SpecialitiesType[];
  state: string;
  timeSlotId: string;
  totalExperience: number;
  totalVote: number;
  userName: string;
  zipCode: string;
  _id: string;
  avgRate: number;
  recommendScore: number;
  timeslots: DoctorsTimeSlotType[];
}

export interface BestDoctorsDataType {
  bestDoctors: BestDoctorsType[] | null;
  totalBestDoctors: number | null;
  totalDoctors: number | null;
}

const initialState: BestDoctorsDataType = {
  bestDoctors: null,
  totalBestDoctors: null,
  totalDoctors: null,
};

export const bestDoctorsDataSlice = createSlice({
  name: "bestDoctorsData",
  initialState,
  reducers: {
    updateBestDoctorsData: (state, action: PayloadAction<any>) => {
      state.bestDoctors = action.payload.bestDoctors;
      state.totalBestDoctors = action.payload.totalBestDoctors;
      state.totalDoctors = action.payload.totalDoctors;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: AnyAction) => {
      return {
        ...state,
        ...action.payload.bestDoctorsData,
      };
    });
  },
});

// Action creators are generated for each case reducer function
export const { updateBestDoctorsData } = bestDoctorsDataSlice.actions;

export default bestDoctorsDataSlice.reducer;
