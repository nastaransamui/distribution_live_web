import { createSlice, AnyAction } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

export interface SpecialitiesType {
  _id: string;
  id?: number;
  specialities: string;
  description: string;
  image: string;
  imageId: string;
  createdAt: Date;
  updatedAt: Date;
  users_id: string[];
}

const initialState = {
  value: [] as SpecialitiesType[],
};

export const specialitiesSlice = createSlice({
  name: "specialities",
  initialState,
  reducers: {
    updateSpecialities: (state, action: PayloadAction<any>) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: AnyAction) => {
      return {
        ...state,
        ...action.payload.specialities.value,
      };
    });
  },
});

// Action creators are generated for each case reducer function
export const { updateSpecialities } = specialitiesSlice.actions;

export default specialitiesSlice.reducer;
