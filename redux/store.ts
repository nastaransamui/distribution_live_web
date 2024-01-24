import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { Store } from 'redux';

import { createWrapper } from 'next-redux-wrapper';

import homeAccessTokenReducer from './homeAccessToken';
import homeThemeNameReducer from './homeThemeName';
import homeThemeTypeReducer from './homeThemeType';
import homeLoadingBarReducer from './homeLoadingBar';
import homeFormSubmitReducer from './homeFormSubmit';
import userDataReducer from './userData';
import clinicStatusReducer from './clinicStatus';
import homeSocketReducer from './homeSocket';
import userProfileReducer from './userProfile';
import specialitiesReducer from './specialities';

export function makeStore() {
  return configureStore({
    reducer: {
      homeAccessToken: homeAccessTokenReducer,
      homeThemeName: homeThemeNameReducer,
      homeThemeType: homeThemeTypeReducer,
      homeLoadingBar: homeLoadingBarReducer,
      homeFormSubmit: homeFormSubmitReducer,
      userData: userDataReducer,
      clinicStatus: clinicStatusReducer,
      homeSocket: homeSocketReducer,
      userProfile: userProfileReducer,
      specialities: specialitiesReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;
export const wrapper = createWrapper<Store<AppState>>(makeStore, {
  debug: false,
});
export default store;
