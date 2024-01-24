import { createSlice } from '@reduxjs/toolkit';
import type { AnyAction, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
export interface AccessTokenState {
  value: string | null;
}

const initialState: AccessTokenState = {
  value: null,
};

export const homeAccessTokenSlice = createSlice({
  name: 'homeAccessToken',
  initialState,
  reducers: {
    updateHomeAccessToken: (state, action: PayloadAction<any>) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: AnyAction) => {
      return {
        ...state,
        ...action.payload.homeAccessToken,
      };
    });
  },
});

// Action creators are generated for each case reducer function
export const { updateHomeAccessToken } = homeAccessTokenSlice.actions;

export default homeAccessTokenSlice.reducer;
