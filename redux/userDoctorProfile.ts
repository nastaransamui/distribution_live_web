import { createSlice } from "@reduxjs/toolkit";
import type { AnyAction, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { SpecialitiesType } from "./specialities";
import { CurrenciesType } from "@/components/shared/CurrencyAutocomplete";
import { DoctorsTimeSlotType } from "@/components/DoctorDashboardSections/ScheduleTiming";
import {
  AwardType,
  EducationType,
  ExperienceType,
  MembershipsType,
  RegistrationsType,
} from "@/components/SearchDoctorSections/SearchDoctorSection";
export interface UserDoctorProfileTypeValue {
  aboutMe: string;
  accessToken: string;
  address1: string;
  address2: string;
  awards: AwardType[];
  bankId: string;
  billingsIds: string[];
  bookingsFee: string;
  city: string;
  clinicAddress: string;
  clinicImages: string[];
  clinicName: string;
  country: string;
  createdAt: Date;
  currency: CurrenciesType[];
  dob: string;
  educations: EducationType[];
  experinces: ExperienceType[];
  favs_id: string[];
  firstName: string;
  gender: string;
  idle?: boolean;
  invoice_ids: string[];
  isActive: boolean;
  isVerified?: boolean;
  lastLogin?: {
    date: Date;
    ipAddr: string;
    userAgent: string;
  };
  lastName: string;
  lastUpdate: Date;
  memberships: MembershipsType[];
  mobileNumber: string;
  online: boolean;
  patients_id: string[];
  prescriptions_id: string[];
  profileImage: string;
  rate_array: number[];
  recommendArray: number[];
  registrations: RegistrationsType[];
  reviews_array: string[];
  reservations_id: string[];
  roleName: "doctors";
  services: "google" | "password";
  socialMedia: string[];
  specialities: SpecialitiesType[];
  specialitiesServices: string[];
  state: string;
  timeSlotId: string[];
  timeslots?: DoctorsTimeSlotType[];
  userName: string;
  zipCode: string;
  _id: string;
}
export interface UserDoctorProfileType {
  value: {
    aboutMe: string;
    accessToken: string;
    address1: string;
    address2: string;
    awards: AwardType[];
    bankId: string;
    billingsIds: string[];
    bookingsFee: string;
    city: string;
    clinicAddress: string;
    clinicImages: string[];
    clinicName: string;
    country: string;
    createdAt: Date;
    currency: CurrenciesType[];
    dob: string;
    educations: EducationType[];
    experinces: ExperienceType[];
    favs_id: string[];
    firstName: string;
    gender: string;
    idle?: boolean;
    invoice_ids: string[];
    isActive: boolean;
    isVerified?: boolean;
    lastLogin?: {
      date: Date;
      ipAddr: string;
      userAgent: string;
    };
    lastName: string;
    lastUpdate: Date;
    memberships: MembershipsType[];
    mobileNumber: string;
    online: boolean;
    patients_id: string[];
    prescriptions_id: string[];
    profileImage: string;
    rate_array: number[];
    recommendArray: number[];
    registrations: RegistrationsType[];
    reviews_array: string[];
    reservations_id: string[];
    roleName: "doctors";
    services: "google" | "password";
    socialMedia: string[];
    specialities: SpecialitiesType[];
    specialitiesServices: string[];
    state: string;
    timeSlotId: string[];
    timeslots?: DoctorsTimeSlotType[];
    userName: string;
    zipCode: string;
    _id: string;
  } | null;
}

const initialState: UserDoctorProfileType = {
  value: null,
};

export const userDoctorProfileSlice = createSlice({
  name: "userDoctorProfile",
  initialState,
  reducers: {
    updateUserDoctorProfile: (state, action: PayloadAction<any>) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: AnyAction) => {
      return {
        ...state,
        ...action.payload.userDoctorProfile,
      };
    });
  },
});

// Action creators are generated for each case reducer function
export const { updateUserDoctorProfile } = userDoctorProfileSlice.actions;

export default userDoctorProfileSlice.reducer;
