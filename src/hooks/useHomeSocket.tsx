import { useEffect, useRef } from "react";
import _ from "lodash";
import { createSocket } from "@/helpers/socket";
import { updateHomeSocket } from "@/redux/homeSocket";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { updateHomeLoadingBar } from "@/redux/homeLoadingBar";
import appTheme from "@/theme/appTheme";
import { PaletteMode } from "@mui/material";
import { ClinicStatusType, updateClinicStatus } from "@/redux/clinicStatus";
import browserDb, { createBrowserDb } from "@/hooks/useBrowserDb";
import { SpecialitiesType, updateSpecialities } from "@/redux/specialities";
import { LastReviewsDataType, updateLastReviewsData } from "@/redux/lastReviewsData";
import { BestDoctorsDataType, updateBestDoctorsData } from "@/redux/bestDoctorsData";
import { Socket } from "socket.io-client";
import verifyHomeAccessToken from "@/helpers/verifyHomeAccessToken";
import { updateHomeAccessToken } from "@/redux/homeAccessToken";
import { updateHomeExp } from "@/redux/homeExp";
import { updateHomeIAT } from "@/redux/homeIAT";
import { updateHomeServices } from "@/redux/homeServices";
import { updateHomeRoleName } from "@/redux/homeRoleName";
import { updateHomeUserId } from "@/redux/homeUserId";
import { updateUserDoctorProfile } from "@/redux/userDoctorProfile";
import { updateUserPatientProfile } from "@/redux/userPatientProfile";
import { toast } from "react-toastify";
import { NextRouter } from "next/router";
import { BestCardioDoctorsDataType, updateBestCardioDoctorsData } from "@/redux/bestCardioDoctors";
import { updateBestEyeCareDoctorsData } from "@/redux/bestEyeCareDoctors";
export function useHomeSocket({
  dispatch,
  homeAccessToken,
  homeUserId,
  homeRoleName,
  userDoctorProfile,
  userPatientProfile,
  userData,
  homeLoadingBar,
  setHomeTheme,
  clinicStatus,
  router,
  specialities,
}: {
  dispatch: any;
  homeAccessToken: string | null;
  homeUserId: string | null;
  homeRoleName: string | null;
  userDoctorProfile?: any;
  userPatientProfile?: any;
  userData: any;
  homeLoadingBar: number;
  setHomeTheme: (t: any) => void;
  clinicStatus: any[];
  router: NextRouter,
  specialities: SpecialitiesType[]
}) {

  const userDataRef = useRef(userData);
  const tokenRef = useRef(homeAccessToken);
  const userIdRef = useRef(homeUserId);
  const roleRef = useRef(homeRoleName);
  const userDoctorRef = useRef(userDoctorProfile);
  const userPatientRef = useRef(userPatientProfile);
  const loadingBarRef = useRef(homeLoadingBar);

  useEffect(() => { userDataRef.current = userData }, [userData]);
  useEffect(() => { tokenRef.current = homeAccessToken }, [homeAccessToken]);
  useEffect(() => { userIdRef.current = homeUserId }, [homeUserId]);
  useEffect(() => { roleRef.current = homeRoleName }, [homeRoleName]);
  useEffect(() => { userDoctorRef.current = userDoctorProfile }, [userDoctorProfile]);
  useEffect(() => { userPatientRef.current = userPatientProfile }, [userPatientProfile]);
  useEffect(() => { loadingBarRef.current = homeLoadingBar }, [homeLoadingBar]);

  // hold the socket and meta used to decide when to recreate it
  const socketRef = useRef<Socket | null>(null);
  const socketMetaRef = useRef({
    token: homeAccessToken,
    userId: homeUserId,
    userDataHash: JSON.stringify(userData ?? {})
  });
  // helper: create or reuse socket based on current meta (ensures extraHeaders match)
  const ensureSocket = () => {
    const currentMeta = {
      token: tokenRef.current,
      userId: userIdRef.current,
      userDataHash: JSON.stringify(userDataRef.current ?? {})
    };

    const metaChanged =
      socketMetaRef.current.token !== currentMeta.token ||
      socketMetaRef.current.userId !== currentMeta.userId ||
      socketMetaRef.current.userDataHash !== currentMeta.userDataHash;

    if (socketRef.current && !metaChanged) {
      // reuse existing socket
      return socketRef.current;
    }

    // meta changed OR no socket -> replace socket
    try {
      if (socketRef.current) {
        // cleanup old
        socketRef.current.off();
        socketRef.current.disconnect();
      }
    } catch (e) {
      console.error("old socket cleanup failed", e);
    }

    const s = createSocket(userDataRef.current, tokenRef.current, userIdRef.current);
    socketRef.current = s;
    socketMetaRef.current = currentMeta;
    return s;
  };

  // 1) Connect / disconnect effect (empty deps). We control when to connect; recreate if meta changes.
  useEffect(() => {
    // ensure browser DB ready (idempotent)
    createBrowserDb().catch(err => console.error(err));

    const s = ensureSocket();

    // connect once (no-op if connected)
    s.connect();

    s.once("connect", () => {
      // update redux — prefer connected flag or id to avoid re-render loops; but keep your shape if needed
      try {
        dispatch(updateHomeSocket({ current: s })); // if your reducer expects socket object, okay (non-serializable)
      } catch (e) {
        console.error("dispatch(updateHomeSocket) failed", e);
      }
    });

    s.on("disconnect", (reason: any) => {
      // optional: dispatch disconnect
      try {
        dispatch(updateHomeSocket({ connected: false, socketId: null }));
      } catch (e) { }
      console.log("socket disconnected:", reason);
    });

    // cleanup on unmount
    return () => {
      try {
        if (socketRef.current) {
          socketRef.current.off();
          socketRef.current.disconnect();
          socketRef.current = null;
        }
        dispatch(updateHomeSocket({ connected: false, socketId: null }));
      } catch (e) {
        console.error("socket cleanup error", e);
      }
    };
    // empty deps by design — the ensureSocket() logic uses refs + meta check to recreate if necessary
    // but if you prefer to recreate when token/userId/userData changes immediately, add them to deps OR call ensureSocket() elsewhere.
  }, [dispatch]); // keep minimal; creation uses ensureSocket which looks at refs

  // 2) Listeners effect: uses the socketRef (must exist). Named handlers and proper off() cleanup.
  useEffect(() => {
    const s = ensureSocket();
    if (!s) return; // defensive

    // named handlers
    function onGetTheme(msg: { homeThemeName: string; homeThemeType: string; homeActivePage: string }) {

      setCookie("homeThemeType", msg?.homeThemeType || "dark");
      setCookie("homeThemeName", msg?.homeThemeName || "joker");
      setCookie("homeActivePage", msg?.homeActivePage || "default");
      dispatch(updateHomeLoadingBar(loadingBarRef.current === 100 ? 0 : 100));
      setHomeTheme(appTheme(msg?.homeThemeName || "joker", msg?.homeThemeType as PaletteMode || "dark", "ltr"));
    }

    async function onGetClinicStatus(msg: ClinicStatusType[]) {
      dispatch(updateClinicStatus(msg));
      const clinicStatusBrowserTable = await browserDb.clinicStatusBrowserTable.toArray();
      const removedIdMsg = msg.map(item => {
        const { id, ...rest } = item;
        return rest;
      });
      const removedIdIndexDb = clinicStatusBrowserTable.map(item => {
        const { id, ...rest } = item;
        return rest;
      });
      if (_.isEqual(removedIdMsg, removedIdIndexDb)) {
        await browserDb.clinicStatusBrowserTable.clear()
        await browserDb.clinicStatusBrowserTable.bulkAdd(msg)
      } else {
        await browserDb.clinicStatusBrowserTable.clear()
        await browserDb.clinicStatusBrowserTable.bulkAdd(msg)
      }
    }

    async function onGetSpecialities(msg: SpecialitiesType[]) {
      dispatch(updateSpecialities(msg));
    }

    async function onGetUserProfileFromAdmin(msg: string) {
      var { accessToken, user_id, services, roleName, iat, exp, userProfile: newUserProfile } = verifyHomeAccessToken(msg)
      if (getCookie('user_id') !== user_id) return;
      const { isActive } = newUserProfile;
      if (accessToken == '' || !isActive) {
        dispatch(updateHomeAccessToken(null))
        dispatch(updateHomeExp(null));
        dispatch(updateHomeIAT(null))
        dispatch(updateHomeRoleName(null))
        dispatch(updateHomeServices(null));
        dispatch(updateHomeUserId(null));
        if (roleName == 'doctors') {
          dispatch(updateUserDoctorProfile(null))
        } else if (roleName == 'patient') {
          dispatch(updateUserPatientProfile(null));
        }

        deleteCookie('homeAccessToken');
        deleteCookie('user_id');
        deleteCookie('services');
        deleteCookie('roleName');
        deleteCookie('iat');
        deleteCookie('exp');
        dispatch(updateHomeLoadingBar(true));
        toast.info('This user is not eligible to login any more', {
          position: "bottom-center",
          autoClose: 5000,
          toastId: 'connectionError',
          onClose: () => { toast.dismiss('connectionError'); router.reload(); }
        });
        // }
      } else {
        dispatch(updateHomeAccessToken(accessToken))
        dispatch(updateHomeExp(exp));
        dispatch(updateHomeIAT(iat))
        dispatch(updateHomeRoleName(roleName))
        dispatch(updateHomeServices(services));
        dispatch(updateHomeUserId(user_id));
        if (roleName == 'doctors') {
          dispatch(updateUserDoctorProfile(newUserProfile))
        } else if (roleName == 'patient') {
          dispatch(updateUserPatientProfile(newUserProfile));
        }

        setCookie('homeAccessToken', accessToken);
        setCookie('user_id', user_id);
        setCookie('services', services);
        setCookie('roleName', roleName);
        setCookie('iat', iat);
        setCookie('exp', exp);
      }
    }

    function onGetLastReviews(msg: { status: number; data: LastReviewsDataType[] }) {

      const { status, data } = msg;
      if (status === 200) {
        const { lastReviews, totalReviews } = data[0];
        dispatch(updateLastReviewsData({ lastReviews: lastReviews || [], totalReviews: totalReviews ?? 0 }));
      } else {
        dispatch(updateLastReviewsData({ lastReviews: [], totalReviews: 0 }));
      }
    }

    function onGetBestDoctors(msg: { status: number; data: BestDoctorsDataType[] }) {

      const { status, data } = msg;
      if (status === 200) {
        const { bestDoctors, totalBestDoctors, totalDoctors } = data[0];
        dispatch(updateBestDoctorsData({ bestDoctors: bestDoctors || [], totalBestDoctors: totalBestDoctors ?? 0, totalDoctors: totalDoctors ?? 0 }));
      } else {
        dispatch(updateBestDoctorsData({ bestDoctors: [], totalBestDoctors: 0, totalDoctors: 0 }));
      }
    }

    function onGetBestCardiologyDoctorsFromAdmin(msg: { status: number, data: BestCardioDoctorsDataType[] }) {

      const { status, data } = msg;
      if (status == 200) {
        const { bestDoctors, totalBestDoctors, totalDoctors } = data[0];
        dispatch(updateBestCardioDoctorsData({
          bestDoctors: bestDoctors || [],
          totalBestDoctors: totalBestDoctors ?? 0,
          totalDoctors: totalDoctors ?? 0,
        }));
      } else {
        dispatch(updateBestCardioDoctorsData({
          bestDoctors: [],
          totalBestDoctors: 0,
          totalDoctors: 0,
        }));
      }
    }
    function onGetBestOphthalmologyDoctorsFromAdmin(msg: { status: number, data: BestCardioDoctorsDataType[] }) {
      const { status, data } = msg;
      if (status == 200) {
        const { bestDoctors, totalBestDoctors, totalDoctors } = data[0];
        dispatch(updateBestEyeCareDoctorsData({
          bestDoctors: bestDoctors || [],
          totalBestDoctors: totalBestDoctors ?? 0,
          totalDoctors: totalDoctors ?? 0,
        }));
      } else {
        dispatch(updateBestEyeCareDoctorsData({
          bestDoctors: [],
          totalBestDoctors: 0,
          totalDoctors: 0,
        }));
      }
    }


    // connect_error fallback
    async function onConnectError(err: any) {
      const clinicStatusBrowserTable = await browserDb.clinicStatusBrowserTable.toArray();
      const specialitiesBrowserTable = await browserDb.specialitiesBrowserTable.toArray();

      // use the passed-in clinicStatus / specialities that belong to redux the caller provided
      if (clinicStatusBrowserTable.length && (!clinicStatus || clinicStatus.length === 0)) {
        dispatch(updateClinicStatus(clinicStatusBrowserTable));
      }
      if (specialitiesBrowserTable.length !== 0) {
        if (specialities?.length == 0) dispatch(updateSpecialities(specialitiesBrowserTable))
      }
    }

    // attach handlers (off before on to be safe)
    s.off("getThemeFromAdmin", onGetTheme).on("getThemeFromAdmin", onGetTheme);
    s.off("getClinicStatusFromAdmin", onGetClinicStatus).on("getClinicStatusFromAdmin", onGetClinicStatus);
    s.off("getSpecialitiesFromAdmin", onGetSpecialities).on("getSpecialitiesFromAdmin", onGetSpecialities);
    s.off('getUserProfileFromAdmin', onGetUserProfileFromAdmin).on('getUserProfileFromAdmin', onGetUserProfileFromAdmin);
    s.off("getLastReviewsFromAdmin", onGetLastReviews).on("getLastReviewsFromAdmin", onGetLastReviews);
    s.off("getBestDoctorsFromAdmin", onGetBestDoctors).on("getBestDoctorsFromAdmin", onGetBestDoctors);
    s.off('getBestCardiologyDoctorsFromAdmin', onGetBestCardiologyDoctorsFromAdmin).on('getBestCardiologyDoctorsFromAdmin', onGetBestCardiologyDoctorsFromAdmin);
    s.off('getBestOphthalmologyDoctorsFromAdmin', onGetBestOphthalmologyDoctorsFromAdmin).on('getBestOphthalmologyDoctorsFromAdmin', onGetBestOphthalmologyDoctorsFromAdmin);
    s.off("connect_error", onConnectError).on("connect_error", onConnectError);

    // once connect, emit join with latest userProfile and userData
    function onOnceConnect() {
      const userProfile = roleRef.current === "doctors" ? userDoctorRef.current : userPatientRef.current;
      s.emit("webJoin", { userProfile, userData: { ...(userDataRef.current || {}), userAgent: navigator.userAgent } });
    }
    s.once("connect", onOnceConnect);

    // cleanup named handlers (don't disconnect; connect lifecycle handled elsewhere)
    return () => {
      s.off("getThemeFromAdmin", onGetTheme);
      s.off("getClinicStatusFromAdmin", onGetClinicStatus);
      s.off("getSpecialitiesFromAdmin", onGetSpecialities);
      s.off('getUserProfileFromAdmin', onGetUserProfileFromAdmin);
      s.off("getLastReviewsFromAdmin", onGetLastReviews);
      s.off("getBestDoctorsFromAdmin", onGetBestDoctors);
      s.off('getBestCardiologyDoctorsFromAdmin', onGetBestCardiologyDoctorsFromAdmin);
      s.off("getBestOphthalmologyDoctorsFromAdmin", onGetBestOphthalmologyDoctorsFromAdmin)
      s.off("connect_error", onConnectError);
      s.off("connect", onOnceConnect);
    };
    // intentionally empty deps — handlers read latest values via refs and we manage recreate through ensureSocket()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // keep stable

  // 3) listen to router withour rerun multiple time
  useEffect(() => {
    if (!router || !router.events) return;

    const handleRouteChange = (url: string) => {
      try {
        const s = ensureSocket();
        if (!s) return;

        // If socket isn't connected, let ensureSocket recreate/connect; call connect if needed
        if (!s.connected) {
          s.connect();
        }

        // Force server to re-send the latest data for the new page
        const userProfile = roleRef.current === "doctors" ? userDoctorRef.current : userPatientRef.current;
        s.emit("webJoin", { userProfile, userData: { ...(userDataRef.current || {}), userAgent: navigator.userAgent } });

        // trigger the same queries you rely on (safe no-op on server side if they don't apply)
        if (
          !url.startsWith('/doctors/check-out') ||
          !url.startsWith('/doctors/booking') ||
          !url.startsWith('/doctors/payment-success')
        ) {
          s.emit("getLastReviewsFromAdmin");
          s.emit("getBestDoctorsFromAdmin");
          s.emit("getBestCardiologyDoctorsFromAdmin");
          s.emit("getBestOphthalmologyDoctorsFromAdmin");
          s.emit("getClinicStatusFromAdmin");
          s.emit("getSpecialitiesFromAdmin");
        }
      } catch (err) {
        console.error("routeChange socket refresh err", err);
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.events]);
}