import { hasCookie, getCookie, deleteCookie, setCookie } from "cookies-next";
import { updateHomeThemeName } from "@/redux/homeThemeName";
import { updateHomeThemeType } from "@/redux/homeThemeType";
import { updateHomeAccessToken } from "@/redux/homeAccessToken";
import { updateHomeUserId } from "@/redux/homeUserId";
import { updateHomeExp } from "@/redux/homeExp";
import { updateHomeIAT } from "@/redux/homeIAT";
import { updateHomeRoleName } from "@/redux/homeRoleName";
import { updateHomeServices } from "@/redux/homeServices";
import { updateUserDoctorProfile } from "@/redux/userDoctorProfile";
import { updateUserPatientProfile } from "@/redux/userPatientProfile";
import { updateUserData } from "@/redux/userData";
import verifyHomeAccessToken from "./verifyHomeAccessToken";
import { updateHomeSideBarOpen } from "@/redux/homeSideBarOpen";

export async function fetchJSON(url: string, opts: RequestInit = {}) {
  try {
    const r = await fetch(url, opts);
    return await r.json();
  } catch (e) {
    // swallow; caller will handle null
    return null;
  }
}

const COOKIE_OPTIONS = (ctx: any) => ({
  req: ctx.req,
  res: ctx.res,
  maxAge: 60 * 60 * 24 * 30,
}); // 30 days

export async function ensureHomeThemeAndCookies(ctx: any, store: any) {
  // read existing cookies
  const hasType = hasCookie("homeThemeType", ctx);
  const hasName = hasCookie("homeThemeName", ctx);
  const hasActive = hasCookie("homeActivePage", ctx);

  // if all present, dispatch them and exit
  if (hasType)
    store.dispatch(updateHomeThemeType(getCookie("homeThemeType", ctx)));
  if (hasName)
    store.dispatch(updateHomeThemeName(getCookie("homeThemeName", ctx)));

  if (hasType && hasName && hasActive) {
    // nothing to fetch
    return { homeRedirect: undefined };
  }

  // fetch the theme once
  const res = await fetchJSON(
    `${process.env.NEXT_PUBLIC_adminUrl}/publications/homeTheme`,
    { method: "GET" }
  );
  // handle multiple shapes gracefully
  const maybeResult = res?.result ?? res;
  const status = maybeResult?.status ?? res?.status;
  const homeTheme =
    maybeResult?.homeTheme ?? res?.homeTheme ?? res?.hometheme ?? maybeResult; // be permissive

  if (status === 200 && homeTheme) {
    // set missing cookies from the fetched homeTheme
    if (!hasType && homeTheme.homeThemeType) {
      setCookie("homeThemeType", homeTheme.homeThemeType, COOKIE_OPTIONS(ctx));
      store.dispatch(updateHomeThemeType(homeTheme.homeThemeType));
    }
    if (!hasName && homeTheme.homeThemeName) {
      setCookie("homeThemeName", homeTheme.homeThemeName, COOKIE_OPTIONS(ctx));
      store.dispatch(updateHomeThemeName(homeTheme.homeThemeName));
    }
    if (!hasActive && homeTheme.homeActivePage) {
      setCookie(
        "homeActivePage",
        homeTheme.homeActivePage,
        COOKIE_OPTIONS(ctx)
      );
    }

    // Some responses use `homeRedirect`, others may embed differently — normalize:
    const homeRedirect =
      homeTheme.homeRedirect ?? homeTheme.homeredirect ?? undefined;
    return { homeRedirect };
  }

  return { homeRedirect: undefined };
}

export function activePageToRoute(activePage: string | undefined) {
  if (!activePage) return null;
  switch (activePage) {
    case "general_0":
      return "/home";
    case "general_1":
      return "/home3";
    case "general_2":
      return "/home4";
    default:
      return null;
  }
}

export async function fetchAndDispatchUserIfAuth(ctx: any, store: any) {
  if (!hasCookie("homeAccessToken", ctx)) return null;

  const accessToken = getCookie("homeAccessToken", ctx);
  const user_id = getCookie("user_id", ctx);
  const services = getCookie("services", ctx);
  const roleName = getCookie("roleName", ctx);
  const iat = getCookie("iat", ctx);
  const exp = getCookie("exp", ctx);

  const res = await fetchJSON(
    `${process.env.NEXT_PUBLIC_adminUrl}/api/singlePatient?_id=${user_id}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res || res.error) {
    // invalid token / user - clear auth cookies and signal redirect
    deleteCookie("homeAccessToken", ctx);
    deleteCookie("user_id", ctx);
    deleteCookie("services", ctx);
    deleteCookie("roleName", ctx);
    deleteCookie("iat", ctx);
    deleteCookie("exp", ctx);
    return { redirectToLogin: true };
  }

  // valid user: dispatch values
  store.dispatch(updateHomeAccessToken(accessToken));
  store.dispatch(updateHomeUserId(user_id));
  store.dispatch(updateHomeServices(services));
  store.dispatch(updateHomeRoleName(roleName));
  store.dispatch(updateHomeIAT(iat));
  store.dispatch(updateHomeExp(exp));

  console.log({ fitehanddispa: res });
  // remove potential status field and dispatch profile to correct slice

  if (roleName === "patient") {
    store.dispatch(updateUserPatientProfile(res.data));
  } else {
    store.dispatch(updateUserDoctorProfile(res.data));
  }

  return { redirectToLogin: false };
}
/**
 * 1) For all pages: fetch geo-ip user data and dispatch updateUserData
 *    usage: await getAndDispatchUserData(ctx, store)
 */
export async function getAndDispatchUserData(ctx: any, store: any) {
  try {
    const result = await fetch("http://ip-api.com/json/", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    const userData = await result.json().catch(() => null);
    if (userData && userData["status"] === "success") {
      store.dispatch(updateUserData(userData));
      return { ok: true };
    }
    return { ok: false };
  } catch (e) {
    return { ok: false };
  }
}
/**
 * 2) Only for / (home) page:
 *    fetch theme, set cookies (if missing) and dispatch.
 *    If fetched homeRedirect differs from ctx.resolvedUrl -> return redirect object.
 *    usage: const r = await handleHomePageTheme(ctx, store); if (r?.redirect) return r;
 */
export async function handleHomePageTheme(ctx: any, store: any) {
  try {
    const res = await fetchJSON(
      `${process.env.NEXT_PUBLIC_adminUrl}/publications/homeTheme`,
      { method: "GET" }
    );
    const maybeResult = res?.result ?? res;
    const status = maybeResult?.status ?? res?.status;
    const homeTheme =
      maybeResult?.homeTheme ?? res?.homeTheme ?? res?.hometheme ?? maybeResult;

    if (status === 200 && homeTheme) {
      // set cookies always for home page if missing
      if (!hasCookie("homeThemeType", ctx) && homeTheme.homeThemeType) {
        setCookie(
          "homeThemeType",
          homeTheme.homeThemeType,
          COOKIE_OPTIONS(ctx)
        );
        store.dispatch(updateHomeThemeType(homeTheme.homeThemeType));
      } else if (hasCookie("homeThemeType", ctx)) {
        store.dispatch(updateHomeThemeType(getCookie("homeThemeType", ctx)));
      }

      if (!hasCookie("homeThemeName", ctx) && homeTheme.homeThemeName) {
        setCookie(
          "homeThemeName",
          homeTheme.homeThemeName,
          COOKIE_OPTIONS(ctx)
        );
        store.dispatch(updateHomeThemeName(homeTheme.homeThemeName));
      } else if (hasCookie("homeThemeName", ctx)) {
        store.dispatch(updateHomeThemeName(getCookie("homeThemeName", ctx)));
      }

      if (!hasCookie("homeActivePage", ctx) && homeTheme.homeActivePage) {
        setCookie(
          "homeActivePage",
          homeTheme.homeActivePage,
          COOKIE_OPTIONS(ctx)
        );
      }

      const homeRedirect =
        homeTheme.homeRedirect ?? homeTheme.homeredirect ?? undefined;
      if (homeRedirect && homeRedirect !== ctx.resolvedUrl) {
        return {
          redirect: {
            destination: homeRedirect,
            permanent: false,
          },
        };
      }
    } else {
      // ensure dispatch of existing cookies if present
      if (hasCookie("homeThemeType", ctx)) {
        store.dispatch(updateHomeThemeType(getCookie("homeThemeType", ctx)));
      }
      if (hasCookie("homeThemeName", ctx)) {
        store.dispatch(updateHomeThemeName(getCookie("homeThemeName", ctx)));
      }
    }
    return null;
  } catch (e) {
    // fallback to existing cookies
    if (hasCookie("homeThemeType", ctx)) {
      store.dispatch(updateHomeThemeType(getCookie("homeThemeType", ctx)));
    }
    if (hasCookie("homeThemeName", ctx)) {
      store.dispatch(updateHomeThemeName(getCookie("homeThemeName", ctx)));
    }
    return null;
  }
}

/**
 * 3) For all pages: fetch theme and set cookies but DO NOT REDIRECT AT ALL.
 *    usage: await setThemeCookiesNoRedirect(ctx, store)
 */
export async function setThemeCookiesNoRedirect(ctx: any, store: any) {
  try {
    if (hasCookie("homeMiniSidebarOpen", ctx)) {
      store.dispatch(
        updateHomeSideBarOpen(getCookie("homeMiniSidebarOpen", ctx))
      );
    }
    const res = await fetchJSON(
      `${process.env.NEXT_PUBLIC_adminUrl}/publications/homeTheme`,
      { method: "GET" }
    );
    const maybeResult = res?.result ?? res;
    const status = maybeResult?.status ?? res?.status;
    const homeTheme =
      maybeResult?.homeTheme ?? res?.homeTheme ?? res?.hometheme ?? maybeResult;

    if (status === 200 && homeTheme) {
      // only set missing cookies and dispatch; never redirect
      if (homeTheme.homeThemeType) {
        if (!hasCookie("homeThemeType", ctx)) {
          setCookie(
            "homeThemeType",
            homeTheme.homeThemeType,
            COOKIE_OPTIONS(ctx)
          );
        }
        store.dispatch(updateHomeThemeType(homeTheme.homeThemeType));
      } else if (hasCookie("homeThemeType", ctx)) {
        store.dispatch(updateHomeThemeType(getCookie("homeThemeType", ctx)));
      }

      if (homeTheme.homeThemeName) {
        if (!hasCookie("homeThemeName", ctx)) {
          setCookie(
            "homeThemeName",
            homeTheme.homeThemeName,
            COOKIE_OPTIONS(ctx)
          );
        }
        store.dispatch(updateHomeThemeName(homeTheme.homeThemeName));
      } else if (hasCookie("homeThemeName", ctx)) {
        store.dispatch(updateHomeThemeName(getCookie("homeThemeName", ctx)));
      }

      if (homeTheme.homeActivePage) {
        if (!hasCookie("homeActivePage", ctx)) {
          setCookie(
            "homeActivePage",
            homeTheme.homeActivePage,
            COOKIE_OPTIONS(ctx)
          );
        }
      }
    } else {
      // no data - only dispatch existing cookie values if present
      if (hasCookie("homeThemeType", ctx)) {
        store.dispatch(updateHomeThemeType(getCookie("homeThemeType", ctx)));
      }
      if (hasCookie("homeThemeName", ctx)) {
        store.dispatch(updateHomeThemeName(getCookie("homeThemeName", ctx)));
      }
    }
  } catch (e) {
    if (hasCookie("homeThemeType", ctx)) {
      store.dispatch(updateHomeThemeType(getCookie("homeThemeType", ctx)));
    }
    if (hasCookie("homeThemeName", ctx)) {
      store.dispatch(updateHomeThemeName(getCookie("homeThemeName", ctx)));
    }
    if (hasCookie("homeMiniSidebarOpen", ctx)) {
      store.dispatch(
        updateHomeSideBarOpen(getCookie("homeMiniSidebarOpen", ctx))
      );
    }
  }
}

/**
 * 4) For login and other between-auth pages:
 *    call /api/singlePatient?_id and:
 *      - if response.status === 200 -> set cookies & dispatch & redirect to `${roleName}/dashboard`
 *      - otherwise -> delete cookies and do nothing (no redirect)
 *    usage: const r = await handleLoginAuth(ctx, store); if (r?.redirect) return r;
 */
export async function handleLoginAuth(ctx: any, store: any) {
  try {
    const _id = getCookie("user_id", ctx);
    const accessTokenCookies = getCookie("homeAccessToken", ctx);

    if (!_id) return null;
    const resBody = await fetchJSON(
      `${process.env.NEXT_PUBLIC_adminUrl}/api/singlePatient?_id=${_id}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessTokenCookies}`,
        },
      }
    );

    // expected shape: { status: 200, data: { ... } }
    if (resBody && (resBody.status === 200 || resBody?.data)) {
      const bodyData = resBody.data ?? resBody;
      var { accessToken, user_id, services, roleName, iat, exp, userProfile } =
        verifyHomeAccessToken(bodyData);

      // set or update cookies
      if (accessToken) {
        setCookie("homeAccessToken", accessToken, COOKIE_OPTIONS(ctx));
        store.dispatch(updateHomeAccessToken(accessToken));
      }
      if (user_id) {
        setCookie("user_id", user_id, COOKIE_OPTIONS(ctx));
        store.dispatch(updateHomeUserId(user_id));
      }
      if (services) {
        setCookie("services", services, COOKIE_OPTIONS(ctx));
        store.dispatch(updateHomeServices(services));
      }
      if (roleName) {
        setCookie("roleName", roleName, COOKIE_OPTIONS(ctx));
        store.dispatch(updateHomeRoleName(roleName));
      }

      // optionally set iat/exp if present
      if (iat) {
        setCookie("iat", iat, COOKIE_OPTIONS(ctx));
        store.dispatch(updateHomeIAT(iat));
      }
      if (exp) {
        setCookie("exp", exp, COOKIE_OPTIONS(ctx));
        store.dispatch(updateHomeExp(exp));
      }

      // dispatch profile into store
      if (roleName === "patient") {
        store.dispatch(updateUserPatientProfile(userProfile));
      } else {
        store.dispatch(updateUserDoctorProfile(userProfile));
      }
      // redirect to role dashboard
      if (roleName) {
        return {
          redirect: {
            destination: `/${roleName}/dashboard`,
            permanent: false,
          },
        };
      }
    }

    // any non-200 or unexpected shape -> clear auth cookies and do nothing (no redirect)
    deleteCookie("homeAccessToken", ctx);
    deleteCookie("user_id", ctx);
    deleteCookie("services", ctx);
    deleteCookie("roleName", ctx);
    deleteCookie("iat", ctx);
    deleteCookie("exp", ctx);
    return null;
  } catch (e) {
    // on error: clear cookies, but do not redirect
    deleteCookie("homeAccessToken", ctx);
    deleteCookie("user_id", ctx);
    deleteCookie("services", ctx);
    deleteCookie("roleName", ctx);
    deleteCookie("iat", ctx);
    deleteCookie("exp", ctx);
    return null;
  }
}

/**
 * 5) For protected routes:
 *    call /api/singlePatient?_id and:
 *      - if status 200 -> set cookies/dispatch (if necessary) and return { ok: true }
 *      - otherwise -> delete cookies and return { redirectToLogin: true }
 *    usage: const r = await handleProtectedAuth(ctx, store); if (r?.redirectToLogin) return { redirect: { destination: '/login' } }
 */
export async function handleProtectedAuth(ctx: any, store: any) {
  try {
    const _id = getCookie("user_id", ctx);
    const accessTokenCookies = getCookie("homeAccessToken", ctx);
    if (!_id) {
      // no user id cookie -> force login
      deleteCookie("homeAccessToken", ctx);
      deleteCookie("user_id", ctx);
      deleteCookie("services", ctx);
      deleteCookie("roleName", ctx);
      deleteCookie("iat", ctx);
      deleteCookie("exp", ctx);
      return { redirectToLogin: true };
    }

    const resBody = await fetchJSON(
      `${process.env.NEXT_PUBLIC_adminUrl}/api/singlePatient?_id=${_id}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessTokenCookies}`,
        },
      }
    );

    if (resBody && resBody.status === 200 && resBody?.data) {
      const bodyData = resBody.data ?? resBody;
      var { accessToken, user_id, services, roleName, iat, exp, userProfile } =
        verifyHomeAccessToken(bodyData);
      // persist tokens/cookies if present
      if (accessToken) {
        setCookie("homeAccessToken", accessToken, COOKIE_OPTIONS(ctx));
        store.dispatch(updateHomeAccessToken(accessToken));
      }
      if (user_id) {
        setCookie("user_id", user_id, COOKIE_OPTIONS(ctx));
        store.dispatch(updateHomeUserId(user_id));
      }
      if (services) {
        setCookie("services", services, COOKIE_OPTIONS(ctx));
        store.dispatch(updateHomeServices(services));
      }
      if (roleName) {
        setCookie("roleName", roleName, COOKIE_OPTIONS(ctx));
        store.dispatch(updateHomeRoleName(roleName));
      }
      if (iat) {
        setCookie("iat", iat, COOKIE_OPTIONS(ctx));
        store.dispatch(updateHomeIAT(iat));
      }
      if (exp) {
        setCookie("exp", exp, COOKIE_OPTIONS(ctx));
        store.dispatch(updateHomeExp(exp));
      }

      // dispatch profile to store
      if (roleName === "patient") {
        store.dispatch(updateUserPatientProfile(userProfile));
      } else {
        store.dispatch(updateUserDoctorProfile(userProfile));
      }

      return { ok: true };
    }

    // anything else -> remove cookies and force login
    deleteCookie("homeAccessToken", ctx);
    deleteCookie("user_id", ctx);
    deleteCookie("services", ctx);
    deleteCookie("roleName", ctx);
    deleteCookie("iat", ctx);
    deleteCookie("exp", ctx);
    return { redirectToLogin: true };
  } catch (e) {
    console.log({ handleProtectedAuth: e });
    // on error: clear cookies and redirect to login
    deleteCookie("homeAccessToken", ctx);
    deleteCookie("user_id", ctx);
    deleteCookie("services", ctx);
    deleteCookie("roleName", ctx);
    deleteCookie("iat", ctx);
    deleteCookie("exp", ctx);
    return { redirectToLogin: true };
  }
}

/**
 * 6) For all public pages :
 *    call /api/singlePatient?_id and:
 *      - if status 200 -> set cookies/dispatch (if necessary) and return { ok: true }
 *
 */
export async function setAuthCookiesNoRedirect(ctx: any, store: any) {
  try {
    const _id = getCookie("user_id", ctx);
    const accessTokenCookies = getCookie("homeAccessToken", ctx);
    if (!_id) {
      // no user id cookie -> clear auth cookies and return false
      deleteCookie("homeAccessToken", ctx);
      deleteCookie("user_id", ctx);
      deleteCookie("services", ctx);
      deleteCookie("roleName", ctx);
      deleteCookie("iat", ctx);
      deleteCookie("exp", ctx);
      return { ok: false };
    }

    const resBody = await fetchJSON(
      `${process.env.NEXT_PUBLIC_adminUrl}/api/singlePatient?_id=${_id}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessTokenCookies}`,
        },
      }
    );
    // accept either { status:200, data: {...} } or the data object itself
    if (resBody && (resBody.status === 200 || resBody?.data)) {
      const bodyData = resBody.data ?? resBody;
      var { accessToken, user_id, services, roleName, iat, exp, userProfile } =
        verifyHomeAccessToken(bodyData);
      // persist tokens/cookies if present
      if (accessToken) {
        setCookie("homeAccessToken", accessToken, COOKIE_OPTIONS(ctx));
        store.dispatch(updateHomeAccessToken(accessToken));
      }
      if (user_id) {
        setCookie("user_id", user_id, COOKIE_OPTIONS(ctx));
        store.dispatch(updateHomeUserId(user_id));
      }

      if (services) {
        setCookie("services", services, COOKIE_OPTIONS(ctx));
        store.dispatch(updateHomeServices(services));
      }
      if (roleName) {
        setCookie("roleName", roleName, COOKIE_OPTIONS(ctx));
        store.dispatch(updateHomeRoleName(roleName));
      }
      if (iat) {
        setCookie("iat", iat, COOKIE_OPTIONS(ctx));
        store.dispatch(updateHomeIAT(iat));
      }
      if (exp) {
        setCookie("exp", exp, COOKIE_OPTIONS(ctx));
        store.dispatch(updateHomeExp(exp));
      }

      // dispatch profile to store
      if (roleName === "patient") {
        store.dispatch(updateUserPatientProfile(userProfile));
      } else {
        store.dispatch(updateUserDoctorProfile(userProfile));
      }

      return { ok: true, roleName: roleName ?? null };
    }

    // anything else -> remove cookies and return false
    deleteCookie("homeAccessToken", ctx);
    deleteCookie("user_id", ctx);
    deleteCookie("services", ctx);
    deleteCookie("roleName", ctx);
    deleteCookie("iat", ctx);
    deleteCookie("exp", ctx);
    return { ok: false };
  } catch (e) {
    // on error: clear cookies and return false
    console.log({ setAuthCookiesNoRedirect: e });
    deleteCookie("homeAccessToken", ctx);
    deleteCookie("user_id", ctx);
    deleteCookie("services", ctx);
    deleteCookie("roleName", ctx);
    deleteCookie("iat", ctx);
    deleteCookie("exp", ctx);
    return { ok: false };
  }
}
