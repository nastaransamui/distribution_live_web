import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { Store } from "redux";

import { createWrapper } from "next-redux-wrapper";

import homeAccessTokenReducer from "./homeAccessToken";
import homeRoleNameReducer, { HomeRoleNameState } from "./homeRoleName";
import homeExpReducer from "./homeExp";
import homeIATReducer from "./homeIAT";
import homeServicesReducer from "./homeServices";
import homeUserIdReducer from "./homeUserId";
import homeThemeNameReducer from "./homeThemeName";
import homeThemeTypeReducer from "./homeThemeType";
import homeLoadingBarReducer from "./homeLoadingBar";
import homeFormSubmitReducer from "./homeFormSubmit";
import userDataReducer from "./userData";
import clinicStatusReducer from "./clinicStatus";
import homeSocketReducer from "./homeSocket";
import homeSideBarOpenReducer from "./homeSideBarOpen";

import userPatientProfileReducer, {
  UserPatientProfileType,
} from "./userPatientProfile";
import userDoctorProfileReducer, {
  UserDoctorProfileType,
} from "./userDoctorProfile";
import specialitiesReducer from "./specialities";
import { homeSideBarOpenSlice } from "./homeSideBarOpen";

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
  homeSideBarOpen: ReturnType<typeof homeSideBarOpenReducer>;
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
      homeSideBarOpen: homeSideBarOpenReducer,
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
