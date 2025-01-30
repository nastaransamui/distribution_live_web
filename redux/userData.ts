import { createSlice, AnyAction } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
export interface HomeUserData {
  value: {
    status: "success" | "fail";
    country: string;
    countryCode: string;
    region: string;
    regionName: string;
    city: string;
    zip: string;
    lat: string;
    lon: string;
    timezone: string;
    isp: string;
    org: string;
    as: string;
    query: string;
    userAgent: string;
  } | null;
}

const initialState: HomeUserData = {
  value: null,
};

export const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    updateUserData: (state, action: PayloadAction<any>) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: AnyAction) => {
      return {
        ...state,
        ...action.payload.userData,
      };
    });
  },
});

// Action creators are generated for each case reducer function
export const { updateUserData } = userDataSlice.actions;

export default userDataSlice.reducer;
