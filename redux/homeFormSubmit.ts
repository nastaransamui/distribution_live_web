import { createSlice } from '@reduxjs/toolkit';
import type { AnyAction, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
export interface FormSubmitState {
  value: boolean;
}

const initialState: FormSubmitState = {
  value: false,
};

export const homeFormSubmitSlice = createSlice({
  name: 'homeFormSubmit',
  initialState,
  reducers: {
    updateHomeFormSubmit: (state, action: PayloadAction<any>) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: AnyAction) => {
      return {
        ...state,
        ...action.payload.homeFormSubmit,
      };
    });
  },
});

// Action creators are generated for each case reducer function
export const { updateHomeFormSubmit } = homeFormSubmitSlice.actions;

export default homeFormSubmitSlice.reducer;
