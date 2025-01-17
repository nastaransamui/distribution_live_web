import { createSlice } from "@reduxjs/toolkit";
import type { AnyAction, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { SpecialitiesType } from "./specialities";
import { CurrenciesType } from "@/components/shared/CurrencyAutocomplete";
export interface UserProfileNotNullType {
  _id: string;
  createdAt: Date;
  userName: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  gender: string;
  dob: string;
  bloodG?: string;
  aboutMe: string;
  clinicName: string;
  clinicAddress: string;
  clinicImages: string[];
  profileImage: string;
  services: "google" | "password";
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  specialitiesServices: string[];
  specialities: SpecialitiesType[];
  currency: CurrenciesType[];
  bookingsFee: string;
  educations: string[];
  experinces: string[];
  awards: string[];
  memberships: string[];
  socialMedia: string[];
  registrations: string[];
  reservations_id: string[];
  doctors_id: string[];
  patients_id: string[];
  dependentsArray: string[];
  favorite_doctors_id: string[];
  roleName: "doctors" | "patient" | "pharmacist";
  accessToken: string;
  timeSlotId: string[];
  favs_id: string[];
  online: boolean;
  idle?: boolean;
  lastLogin?: {
    date: Date;
    ipAddr: string;
    userAgent: string;
  };
}
export interface UserProfileType {
  value: {
    _id: string;
    createdAt: Date;
    userName: string;
    firstName: string;
    lastName: string;
    mobileNumber: string;
    gender: string;
    dob: string;
    bloodG?: string;
    aboutMe: string;
    clinicName: string;
    clinicAddress: string;
    clinicImages: string[];
    profileImage: string;
    services: "google" | "password";
    address1: string;
    address2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    specialitiesServices: string[];
    specialities: SpecialitiesType[];
    currency: CurrenciesType[];
    bookingsFee: string;
    educations: string[];
    experinces: string[];
    awards: string[];
    memberships: string[];
    socialMedia: string[];
    registrations: string[];
    reservations_id: string[];
    doctors_id: string[];
    patients_id: string[];
    dependentsArray: string[];
    favorite_doctors_id: string[];
    roleName: "doctors" | "patient" | "pharmacist";
    accessToken: string;
    timeSlotId: string[];
    favs_id: string[];
    online: boolean;
    idle?: boolean;
    lastLogin?: {
      date: Date;
      ipAddr: string;
      userAgent: string;
    };
  } | null;
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
