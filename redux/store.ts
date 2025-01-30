import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { Store } from "redux";

import { createWrapper } from "next-redux-wrapper";

import homeAccessTokenReducer, {
  HomeAccessTokenState,
} from "./homeAccessToken";
import homeRoleNameReducer, { HomeRoleNameState } from "./homeRoleName";
import homeExpReducer, { HomeExpState } from "./homeExp";
import homeIATReducer, { HomeIATState } from "./homeIAT";
import homeServicesReducer, { HomeServicesState } from "./homeServices";
import homeUserIdReducer, { HomeUserIdState } from "./homeUserId";
import homeThemeNameReducer, { HomeThemeNameState } from "./homeThemeName";
import homeThemeTypeReducer, { HomeThemeTypeState } from "./homeThemeType";
import homeLoadingBarReducer, { HomeLoadingBarState } from "./homeLoadingBar";
import homeFormSubmitReducer, { HomeFormSubmitState } from "./homeFormSubmit";
import userDataReducer, { HomeUserData } from "./userData";
import clinicStatusReducer, { ClinicStatusType } from "./clinicStatus";
import homeSocketReducer from "./homeSocket";
import userProfileReducer, { UserProfileType } from "./userProfile";
import userPatientProfileReducer, {
  UserPatientProfileType,
} from "./userPatientProfile";
import userDoctorProfileReducer, {
  UserDoctorProfileType,
} from "./userDoctorProfile";
import specialitiesReducer, { SpecialitiesType } from "./specialities";
import { getCookie } from "cookies-next";

export interface AppState {
  homeAccessToken: ReturnType<typeof homeAccessTokenReducer>;
  homeRoleName: HomeRoleNameState;
  homeExp: ReturnType<typeof homeExpReducer>;
  homeIAT: ReturnType<typeof homeIATReducer>;
  homeServices: ReturnType<typeof homeServicesReducer>;
  homeUserId: ReturnType<typeof homeUserIdReducer>;
  homeThemeName: ReturnType<typeof homeThemeNameReducer>;
  homeThemeType: ReturnType<typeof homeThemeTypeReducer>;
  homeLoadingBar: ReturnType<typeof homeLoadingBarReducer>;
  homeFormSubmit: ReturnType<typeof homeFormSubmitReducer>;
  userData: ReturnType<typeof userDataReducer>;
  clinicStatus: ReturnType<typeof clinicStatusReducer>;
  homeSocket: ReturnType<typeof homeSocketReducer>;
  // userProfile: UserProfileType;
  userPatientProfile: UserPatientProfileType;
  userDoctorProfile: UserDoctorProfileType;
  specialities: ReturnType<typeof specialitiesReducer>;
}

export function makeStore() {
  return configureStore({
    reducer: {
      homeAccessToken: homeAccessTokenReducer,
      homeRoleName: homeRoleNameReducer,
      homeExp: homeExpReducer,
      homeIAT: homeIATReducer,
      homeServices: homeServicesReducer,
      homeUserId: homeUserIdReducer,
      homeThemeName: homeThemeNameReducer,
      homeThemeType: homeThemeTypeReducer,
      homeLoadingBar: homeLoadingBarReducer,
      homeFormSubmit: homeFormSubmitReducer,
      userData: userDataReducer,
      clinicStatus: clinicStatusReducer,
      homeSocket: homeSocketReducer,
      userPatientProfile: userPatientProfileReducer,
      userDoctorProfile: userDoctorProfileReducer,
      specialities: specialitiesReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
}
const store = makeStore();

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
