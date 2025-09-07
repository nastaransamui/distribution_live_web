import { createSlice, AnyAction } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
export interface ClinicStatusType {
  _id: string;
  id: number;
  href: string;
  active: boolean;
  hasThemeImage: boolean;
  image: string;
  name: string;
  customStyle?: {};
  createdAt: Date;
  updatedAt: Date;
}

const initialState = {
  value: [] as ClinicStatusType[],
};

export const clinicStatusSlice = createSlice({
  name: "clinicStatus",
  initialState,
  reducers: {
    updateClinicStatus: (state, action: PayloadAction<any>) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: AnyAction) => {
      return action.payload.clinicStatus || state;
    });
  },
});

// Action creators are generated for each case reducer function
export const { updateClinicStatus } = clinicStatusSlice.actions;

export default clinicStatusSlice.reducer;
