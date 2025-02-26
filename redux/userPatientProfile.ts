import { createSlice } from "@reduxjs/toolkit";
import type { AnyAction, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
export interface UserPatientProfileTypeValue {
  accessToken: string;
  address1: string;
  address2: string;
  billingsIds: string[];
  bloodG?: string;
  city: string;
  country: string;
  createdAt: Date;
  dependentsArray: string[];
  dob: Date | "";
  doctors_id: string[];
  favs_id: string[];
  firstName: string;
  fullName?: string;
  gender: string;
  idle?: boolean;
  invoice_ids: string[];
  isActive: boolean;
  isVerified?: boolean | "google";
  lastLogin?: {
    date: Date;
    ipAddr: string;
    userAgent: string;
  };
  lastName: string;
  lastUpdate: Date;
  medicalRecordsArray: string[];
  mobileNumber: string;
  online: boolean;
  prescriptions_id: string[];
  profileImage: string;
  rate_array: number[];
  reservations_id: string[];
  reviews_array: string[];
  roleName: "patient";
  services: "google" | "password";
  state: string;
  userName: string;
  zipCode: string;
  _id: string;
}
export interface UserPatientProfileType {
  value: {
    accessToken: string;
    address1: string;
    address2: string;
    billingsIds: string[];
    bloodG?: string;
    city: string;
    country: string;
    createdAt: Date;
    dependentsArray: string[];
    dob: Date | "";
    doctors_id: string[];
    favs_id: string[];
    firstName: string;
    gender: string;
    idle?: boolean;
    invoice_ids: string[];
    isActive: boolean;
    isVerified?: boolean | "google";
    lastLogin?: {
      date: Date;
      ipAddr: string;
      userAgent: string;
    };
    lastName: string;
    lastUpdate: Date;
    medicalRecordsArray: string[];
    mobileNumber: string;
    online: boolean;
    prescriptions_id: string[];
    profileImage: string;
    rate_array: number[];
    reservations_id: string[];
    reviews_array: string[];
    roleName: "patient";
    services: "google" | "password";
    state: string;
    userName: string;
    zipCode: string;
    _id: string;
  } | null;
}

const initialState: UserPatientProfileType = {
  value: null,
};

export const userPatientProfileSlice = createSlice({
  name: "userPatientProfile",
  initialState,
  reducers: {
    updateUserPatientProfile: (state, action: PayloadAction<any>) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: AnyAction) => {
      return {
        ...state,
        ...action.payload.userPatientProfile,
      };
    });
  },
});

// Action creators are generated for each case reducer function
export const { updateUserPatientProfile } = userPatientProfileSlice.actions;

export default userPatientProfileSlice.reducer;
