

/* eslint-disable @next/next/no-img-element */
import { FC, useState, useEffect, Fragment, ReactNode, useRef, useCallback, useMemo } from 'react';

import Link from 'next/link';

//next 

import { useRouter } from 'next/router';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';

import { patient_profile, doctors_profile, logo } from '@/public/assets/imagepath';
import useScssVar from '@/hooks/useScssVar';
import _ from 'lodash'
//Redux
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { ClinicStatusType } from '@/redux/clinicStatus';
//Mui
import { useTheme } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import useMediaQuery from '@mui/material/useMediaQuery';
import HeaderNotification from './HeaderNotification';
import HeaderCart from './HeaderCart';
import MenuIcon from '@mui/icons-material/Menu';
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';
import { toast } from 'react-toastify';
import { updateHomeAccessToken } from '@/redux/homeAccessToken';
import Avatar from '@mui/material/Avatar'
import { StyledBadge } from '../DoctorDashboardSections/ScheduleTiming';
import ActivityDetector from 'react-activity-detector';
import verifyHomeAccessToken from '@/helpers/verifyHomeAccessToken';
import { updateHomeUserId } from '@/redux/homeUserId';
import { updateHomeServices } from '@/redux/homeServices';
import { updateHomeRoleName } from '@/redux/homeRoleName';
import { updateHomeIAT } from '@/redux/homeIAT';
import { updateHomeExp } from '@/redux/homeExp';
import { updateUserDoctorProfile } from '@/redux/userDoctorProfile';
import { updateUserPatientProfile } from '@/redux/userPatientProfile';
import { Lock, User } from 'feather-icons-react';
const MINUTES_FOR_IDLE = 20;

const Header: FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const maxWidth991 = useMediaQuery('(max-width:991px)');
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const homeSideBarOpen = useSelector((state: AppState) => state.homeSideBarOpen.value)
  const dispatch = useDispatch();
  const { muiVar, bounce } = useScssVar()
  const [navbar, setNavbar] = useState(false);
  const [style, setStyle] = useState({})

  const logOut = () => {
    dispatch(updateHomeFormSubmit(true))
    homeSocket.current.emit('logOutSubmit', userProfile?._id, userProfile?.services)
    homeSocket.current.once('logOutReturn', (msg: any) => {
      if (msg?.status !== 200) {
        toast.error(msg?.reason, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          transition: bounce,
          onClose: () => {
            dispatch(updateHomeFormSubmit(false))
          }
        });
      } else {
        deleteCookie('homeAccessToken')
        deleteCookie('user_id')
        deleteCookie('services')
        deleteCookie('roleName')
        deleteCookie('iat')
        deleteCookie('exp')
        dispatch(updateHomeAccessToken(null))
        dispatch(updateHomeExp(null));
        dispatch(updateHomeIAT(null))
        dispatch(updateHomeRoleName(null))
        dispatch(updateHomeServices(null));
        dispatch(updateHomeUserId(null));
        toast.info('Logout successfully', {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          transition: bounce,
          onClose: () => {
            // dispatch(updateHomeFormSubmit(false))
            router.reload();
          }
        });
      }
    })

  }

  useEffect(() => {
    const handleRouteChange = () => {
      if (maxWidth991) {
        var root = document.getElementsByTagName("html")[0];
        if (root.classList.contains('menu-opened')) {
          root.classList.toggle('menu-opened')
        }
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);

    // Cleanup the event listener on component unmount
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxWidth991]);
  const changeBackground = () => {
    setNavbar(window.scrollY >= 95);
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);

    return () => {
      window.removeEventListener("scroll", changeBackground);
    };
  }, []);
  useEffect(() => {
    const getBackgroundStyle = () => {
      if (!navbar) return { background: "" };
      switch (router.pathname) {
        case "/eyecarehome":
        case "/enthome":
        case "/cosmeticshome":
        case "/fertilityhome":
        case "/home":
        case "/home3":
          return { background: theme.palette.background.default };
        case "/home4":
          return { background: theme.palette.primary.light };
        default:
          return {
            background: maxWidth991 ? theme.palette.background.default : "",

          };
      }
    };

    setStyle(getBackgroundStyle());
  }, [navbar, router.pathname, theme.palette.background.default, theme.palette.primary.light, maxWidth991]); // Updated dependencies to include `router.pathname` only


  const getHeaderClass = () => {
    if (maxWidth991) return "header-fixed header-one";
    if (router.pathname === "/cosmeticshome") return "header-fixed header-fourteen header-sixteen";
    if (router.pathname === "/enthome") return "header-fixed header-fourteen header-fifteen";
    if (router.pathname === "/fertilityhome") return "header-fixed header-fourteen";
    if (router.pathname === "/paediatrichome") return "header-fixed header-fourteen header-twelve header-thirteen";
    if (router.pathname === "/veterinaryhome") return "header-fixed header-fourteen header-twelve";
    if (router.pathname === "/eyecarehome") return userProfile == null ? "header-home4 header-one" : "header-home4 header-one";
    if (router.pathname === "/home4") return userProfile == null ? "header-trans custom" : "header-home4 header-one";
    if (router.pathname === "/cardiohome") return "header header-fixed header-ten";
    if (router.pathname === "/homecare") return "header header-custom header-fixed header-ten home-care-header";
    if (router.pathname === "/home" || router.pathname === "/home3") return userProfile == null ? "header-trans header-two" : "header-fixed header-one";
    if (router.pathname.includes('dashboard')) return `header-fixed-dashboard ${homeSideBarOpen ? 'header-fixed-dashboard-open-side-bar' : 'header-fixed-dashboard-close-side-bar'} header-one`
    return "header-fixed header-one";
  };

  const onhandleCloseMenu = () => {
    var root = document.getElementsByTagName("html")[0];
    if (maxWidth991) {
      root.classList.toggle('menu-opened')
    }
  };
  const homeSocketRef = useRef(homeSocket);
  const userProfileRef = useRef(userProfile);

  // Update refs whenever values change
  useEffect(() => {
    homeSocketRef.current = homeSocket;
    userProfileRef.current = userProfile;
  }, [homeSocket, userProfile]);

  const throttledOnActive = useMemo(() =>
    _.throttle(() => {
      const homeSocket = homeSocketRef.current;
      const userProfile = userProfileRef.current;


      if (userProfile?.idle && homeSocket.current) {
        homeSocket.current.emit('updateUserStatus', {
          userId: userProfile?._id,
          idleStatus: false,
          onlineStatus: userProfile?.online
        });

        homeSocket.current.once('updateUserStatusReturn', (msg: { status: number, accessToken: string }) => {
          if (msg.status === 200) {
            const { accessToken, user_id, services, roleName, iat, exp, userProfile } = verifyHomeAccessToken(msg?.accessToken);

            setCookie('homeAccessToken', accessToken);
            setCookie('user_id', user_id);
            setCookie('services', services);
            setCookie('roleName', roleName);
            setCookie('iat', iat);
            setCookie('exp', exp);

            dispatch(updateHomeAccessToken(accessToken));
            dispatch(updateHomeUserId(user_id));
            dispatch(updateHomeServices(services));
            dispatch(updateHomeRoleName(roleName));
            dispatch(updateHomeIAT(iat));
            dispatch(updateHomeExp(exp));

            roleName === 'patient' ? dispatch(updateUserDoctorProfile(userProfile)) : dispatch(updateUserPatientProfile(userProfile));
          }
        });
      }
    }, 2000),
    [dispatch] // Empty dependency array ensures `throttle` is created once
  );

  const onActive = () => {
    throttledOnActive(); // Now it always uses the latest values
  };
  const onIdle = () => {
    if (homeSocket.current) {
      if (typeof userProfile?.lastLogin?.idle == 'undefined' || !userProfile?.lastLogin?.idle) {
        homeSocket.current.emit('updateUserStatus', { userId: userProfile?._id, idleStatus: true, onlineStatus: userProfile?.online })
        homeSocket.current.once('updateUserStatusReturn', (msg: { status: number, accessToken: string }) => {

          if (msg.status == 200) {
            const { accessToken, user_id, services, roleName, iat, exp, userProfile } = verifyHomeAccessToken(msg?.accessToken);
            setCookie('homeAccessToken', accessToken);
            setCookie('user_id', user_id);
            setCookie('services', services);
            setCookie('roleName', roleName);
            setCookie('iat', iat);
            setCookie('exp', exp);
            dispatch(updateHomeAccessToken(accessToken))
            dispatch(updateHomeUserId(user_id));
            dispatch(updateHomeServices(services));
            dispatch(updateHomeRoleName(roleName));
            dispatch(updateHomeIAT(iat));
            dispatch(updateHomeExp(exp))
            roleName == 'patient' ? dispatch(updateUserDoctorProfile(userProfile)) : dispatch(updateUserPatientProfile(userProfile))

          }
        })
      }
    }
  }
  return (
    <header className={`header ${getHeaderClass()}`} style={{ ...style, ...muiVar, zIndex: 1302 }}>
      <div className='container'>
        <nav className="navbar navbar-expand-lg header-nav">
          <div className={`navbar-header col-lg-${userProfile == null ?
            '1' :
            userProfile?.roleName == "doctors" ?
              '2' :
              '1'
            }`}>


            {
              !maxWidth991 &&
              <Link href="/" className="navbar-brand logo" style={{ marginLeft: 0 }}>
                <img style={{
                  height: 'auto',
                  float: 'unset'
                }} src={logo}
                  className="img-fluid main-logo"
                  alt="Logo" />
              </Link>
            }
          </div>
          {userProfile !== null &&
            <ActivityDetector
              enabled={true}
              timeout={MINUTES_FOR_IDLE * 60 * 1000}
              onIdle={onIdle}
              onActive={onActive} name="default" />}

          {
            maxWidth991 ?
              <Fragment>
                <Link href="/" className="navbar-brand logo" style={{ marginLeft: 0 }}>
                  <img style={{
                    height: 'auto',
                    float: 'unset'
                  }} src={logo}
                    className="img-fluid main-logo"
                    alt="Logo" />
                </Link>
                <span style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <MobileNotificationComponent />
                  <Link href="" id="mobile_btn" aria-label='mobile menu' onClick={(e) => {
                    e.preventDefault();
                    onhandleCloseMenu()
                  }}>
                    <MenuIcon
                      color={router.pathname !== '/home4'
                        && router.pathname !== '/homecare'
                        && router.pathname !== '/eyecarehome' ?
                        'primary' : 'secondary'}
                      fontSize='large' />
                  </Link>
                </span>
                <div className="main-menu-wrapper"  >
                  <div className="menu-header"
                    style={{ backgroundColor: navbar ? theme.palette.background.paper : theme.palette.background.default }}
                  >
                    <button className="menu-logo" style={{ background: 'transparent' }} onClick={() => {
                      if (router.pathname !== "/") {
                        router.push('/')
                      }
                    }}>
                      <img src={logo} className="img-fluid " alt="Logo" />
                    </button>
                    <Link href="" id="menu_close" className="menu-close" aria-label='menu close'
                      onClick={(e) => {
                        e.preventDefault();
                        onhandleCloseMenu()
                      }} >
                      <i className="fas fa-times"></i>
                    </Link>
                  </div>
                  <ul className={`main-nav  ${navbar ? 'dark' : " "}  ${router.pathname == "/home4" ? "white-font" : ""}`}>
                    <li className={`has-submenu megamenu  ${router.pathname == "/" ||
                      router.pathname == '/home' ||
                      router.pathname == '/home3' ||
                      router.pathname == '/home4'
                      ? "active" : ""}`} >
                      <Link href="/" >
                        Home
                      </Link>
                    </li>
                    <MobileClinicMenu />
                    <li className={`has-submenu ${router.pathname.startsWith("/pharmacy") ? "active" : ""}`}>
                      <Link href="/pharmacy">
                        Pharmacy
                      </Link>
                    </li>
                    <li className={`has-submenu ${router.pathname.startsWith("/blog") ? "active" : ""}`}>
                      <Link href="/blog" >
                        Blog
                      </Link>
                    </li>
                    <li className={`has-submenu ${router.pathname == "/doctors/search" ? "active" : ""}`}>
                      <Link href="/doctors/search">
                        Doctors
                      </Link>
                    </li>
                    <ConditionComponent />
                    <li className={`has-submenu ${router.pathname == "/about" ? "active" : ""}`}>
                      <Link href="/about">
                        About us
                      </Link>
                    </li>
                    <li className={`has-submenu ${router.pathname == "/contact" ? "active" : ""}`}>
                      <Link href="/contact" >
                        Contact us
                      </Link>
                    </li>
                    {
                      userProfile == null ?
                        <>
                          <li className={`has-submenu ${router.pathname == "/login" ? "active" : ""}`}>
                            <Link href="/login">
                              Login
                            </Link>
                          </li>
                          <li className={`has-submenu ${router.pathname == "/register" ? "active" : ""}`}>
                            <Link href="/register">
                              register
                            </Link>
                          </li>
                        </> :
                        <>
                          {
                            userProfile?.roleName == 'doctors'
                              ? <MobileDoctorAfterLogin logOut={logOut} /> :
                              userProfile?.roleName == 'patient'
                                ? <MobilePatientAfterLogin logOut={logOut} /> :
                                null
                          }
                        </>
                    }
                  </ul>
                </div>

              </Fragment> :
              <Fragment>
                <MainDiv>
                  <ul
                    className={
                      `main-nav 
                        ${navbar ? 'dark' : " "}  
                        ${router.pathname == "/home4" ? "white-font" : ""}`
                    }>
                    <li
                      className={`has-submenu megamenu  
                      ${router.pathname == "/" ||
                          router.pathname == '/home' ||
                          router.pathname == '/home3' ||
                          router.pathname == '/home4'
                          ? "active" : ""}`
                      } >
                      <Link href="/">
                        Home
                      </Link>
                    </li>
                    <ClinicMenu />
                    <li
                      className={`has-submenu 
                    ${router.pathname.startsWith("/pharmacy") ? "active" : ""}`
                      }>
                      <Link href="/pharmacy">
                        Pharmacy
                      </Link>
                    </li>
                    <li className={`has-submenu ${router.pathname.startsWith("/blog") ? "active" : ""}`}>
                      <Link href="/blog">
                        Blog
                      </Link>
                    </li>
                    <li className={`has-submenu ${router.pathname == "/doctors/search" ? "active" : ""}`}>
                      <Link href="/doctors/search">
                        Doctors
                      </Link>
                    </li>
                    <ConditionComponent />
                    <li className={`has-submenu ${router.pathname == "/about" ? "active" : ""}`}>
                      <Link href="/about" >
                        About us </Link>
                    </li>
                    <li className={`has-submenu ${router.pathname == "/contact" ? "active" : ""}`}>
                      <Link href="/contact">
                        Contact us </Link>
                    </li>
                  </ul>
                </MainDiv>
                <AuthDiv>
                  {
                    userProfile == null ?
                      <Fragment>
                        {
                          (router.pathname == '/' || router.pathname == '/cardiohome') ?
                            <HomeAndCardioAuth navbar={navbar} /> :
                            (router.pathname == '/veterinaryhome' ||
                              router.pathname == '/login' ||
                              router.pathname == '/register') ?
                              <VeterLoginRegisterAuth /> :
                              router.pathname == '/paediatrichome' ?
                                <PaediatricAuth /> :
                                router.pathname == '/eyecarehome' ?
                                  <EyecareAuth /> :
                                  router.pathname == '/fertilityhome' ?
                                    <FertilityAuth /> :
                                    router.pathname == '/enthome' ?
                                      <EntAuth /> :
                                      router.pathname == '/cosmeticshome' ?
                                        <CosmeticAuth /> :
                                        <EyecareAuth />
                        }
                      </Fragment> :
                      userProfile?.roleName == 'doctors'
                        ? <DoctorAfterLogin logOut={logOut} /> :
                        userProfile?.roleName == 'patient'
                          ? <PatientAfterLogin logOut={logOut} /> :
                          <></>
                  }
                </AuthDiv>
              </Fragment>
          }
        </nav>
      </div>
    </header >
  )
};


export default Header;

const MobileNotificationComponent: FC = (() => {
  const maxWidth991 = useMediaQuery('(max-width:991px)');
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

  return (
    <Fragment>
      {maxWidth991 && userProfile !== null && (
        <>
          {userProfile?.roleName === 'doctors' && <HeaderNotification />}

          {userProfile?.roleName === 'patient' && (
            <>
              <HeaderCart />
              <HeaderNotification />
            </>
          )}
        </>
      )}
    </Fragment>
  )
})


interface MainDivProps {
  children: ReactNode;
}
const MainDiv: FC<MainDivProps> = (({ children }) => {
  const router = useRouter();
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;
  return (
    <div
      className={`main-menu-wrapper col-lg-${userProfile == null
        ?
        '8'
        : userProfile?.roleName === "doctors"
          ? router.pathname !== '/login' && router.pathname !== '/register'
            ? '8'
            : '7'
          : '8'
        }`}
      style={{
        display: 'flex',
        justifyContent:
          userProfile == null
            ? 'flex-end'
            : userProfile?.roleName === "doctors"
              ? 'center'
              : 'flex-end',
      }}
    >
      {children}
    </div>
  )
})

const ConditionComponent: FC = (() => {
  const router = useRouter();
  const [conditionOpen, setConditionOpen] = useState(false)
  return (
    <ClickAwayListener onClickAway={() => {
      if (conditionOpen) {
        setConditionOpen(!conditionOpen)
      }
    }}>
      <li className={`has-submenu ${router.pathname == '/privacy' ||
        router.pathname == '/terms' ||
        router.pathname == '/faq' ? 'active' : ' '}`}>
        <Link href=""
          onClick={(e) => {
            e.preventDefault();
            setConditionOpen(!conditionOpen)
            if (conditionOpen) {
              setConditionOpen(false)
            }
          }}>
          Conditions<i id="conditionChevron" className={`fas ${conditionOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`} /></Link>

        <ul className={`submenu ${conditionOpen ? "d-block submenu-open-on-click" : ''}`}>
          <li >
            <Link
              className={router.pathname == '/privacy' ? 'active' : ''}
              href="/privacy"
              onClick={(e) => {
                if (conditionOpen) {
                  setConditionOpen(false)
                }
              }}>
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link
              className={router.pathname == '/terms' ? 'active' : ''}
              href="/terms"
              onClick={(e) => {
                if (conditionOpen) {
                  setConditionOpen(false)
                }
              }}>
              Terms & conditions
            </Link>
          </li>
          <li>
            <Link
              className={router.pathname == '/faq' ? 'active' : ''}
              href="/faq"
              onClick={(e) => {
                if (conditionOpen) {
                  setConditionOpen(false)
                }
              }}>
              FAQ
            </Link>
          </li>
        </ul>
      </li>
    </ClickAwayListener>
  )
})

interface AuthDivProps {
  children: ReactNode;
}
const AuthDiv: FC<AuthDivProps> = (({ children }) => {
  const router = useRouter();
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;
  return (
    <div
      className={
        `main-menu-wrapper col-lg-${userProfile == null ?

          '3' :
          (userProfile?.roleName == "doctors") ?
            (router.pathname !== '/login' &&
              router.pathname !== '/register') ?
              '2' :
              '3' :
            '3'}`
      }
      style={{
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
      {children}
    </div>
  )
})

const HomeAndCardioAuth: FC<{ navbar: boolean }> = ((navbar) => {
  const router = useRouter();
  return (
    <ul className={`main-nav  ${navbar ? 'dark' : " "}  ${router.pathname == "home4" ? "white-font" : ""}`}>
      <li className={`${router.pathname.includes("/veterinaryhome") || ("/fertilityhome") ? "login-in-fourteen" : "register-btn"}`}>
        <Link
          href="/login"
          className={"btn reg-btn"}>
          <i className="me-2">
            {router.pathname.includes("veterinaryhome") ? <User /> : <Lock />}
          </i>
          Log In
        </Link>
      </li>
      <li className={`register-btn`}>
        <Link href="/register" className={`btn reg-btn`}>
          <i className="me-2"><User /></i>
          Sign Up
        </Link>
      </li>
    </ul>
  )
})

const VeterLoginRegisterAuth: FC = (() => {
  const router = useRouter();
  return (
    <ul className="nav header-navbar-rht">
      <li
        className={
          `${router.pathname == "/veterinaryhome" ||
            router.pathname == "/home9" ?
            "login-in-fourteen" : "register-btn"}`
        }>
        <Link
          href="/login"
          className="btn reg-btn"
        >
          <i className="me-2">
            {router.pathname == "/veterinaryhome" ? (
              <User />
            ) : (
              <Lock />
            )}
          </i>
          Log In
        </Link>
      </li>
      <li
        className={
          router.pathname == "/veterinaryhome" ||
            router.pathname == "/home9" ?
            "login-in-fourteen" : "register-btn"
        }>
        <Link href="/register"
          className={
            router.pathname == "/veterinaryhome" ?
              "btn btn-primary reg-btn reg-btn-fourteen" :
              "btn reg-btn"}>
          <i className="me-2"><User /></i>
          Sign Up
        </Link>
      </li>
    </ul>
  )
})

const PaediatricAuth: FC = (() => {
  return (
    <ul className="nav header-navbar-rht">
      <li className="login-link"><Link href="/login">Login / Signup</Link></li>
      <li className="login-in-fourteen">
        <Link href="/login" className="btn reg-btn">Log In</Link>
      </li>
      <li className="login-in-fourteen">
        <Link href="/register" className=" reg-btn-thirteen"><span>Sign Up</span>
          <div className="user-icon-header"><i><User /></i></div>
        </Link>
      </li>
    </ul>
  )
})

const EyecareAuth: FC = (() => {
  return (
    <ul className="nav header-navbar-rht">
      <li className="nav-item">
        <Link className={`nav-link header-login `} href="/register">
          <i className="me-2"><Lock /></i>
          Register
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link header-login" href="/login">
          <i className="me-2"><User /></i>
          Login
        </Link>
      </li>
    </ul>
  )
})

const FertilityAuth: FC = (() => {
  const router = useRouter();
  return (
    <ul className="nav header-navbar-rht">
      <li className={`${router.pathname == "/veterinaryhome" || router.pathname == "/fertilityhome" ? "login-in-fourteen" : "register-btn"}`}>
        <Link
          href="/login"
          className={"btn reg-btn"}>
          <i className="me-2">
            {router.pathname == "veterinaryhome" ? (
              <User />
            ) : (
              <Lock />
            )}
          </i>
          Log In
        </Link>
      </li>
      <li className={`register-btn`}>
        <Link href="/register" className={`btn reg-btn`}>
          <i className="me-2"><User /></i>
          Sign Up
        </Link>
      </li>
    </ul>
  )
})

const EntAuth: FC = (() => {

  return (
    <ul className="nav header-navbar-rht">
      <li className="nav-item">
        <Link className={`nav-link header-login `} href="/login">
          login / Signup
        </Link>
      </li>
    </ul>
  )
})

const CosmeticAuth: FC = (() => {

  return (
    <ul className="nav header-navbar-rht">
      <li className="login-link"><Link href="/login">Login / Signup</Link></li>
      <li className="login-in-sixteen">
        <Link href="/login" className="btn reg-btn"><i className="me-2"><Lock /></i>Login<span></span><span></span><span></span><span></span></Link>
      </li>
      <li className="login-in-sixteen">
        <Link href="/register" className="btn btn-primary reg-btn reg-btn-sixteen"><i className="me-2"><User /></i>Sign Up</Link>
      </li>
    </ul>
  )
})

interface AfterLoginType {
  logOut: Function;
}
const DoctorAfterLogin: FC<AfterLoginType> = (({ logOut }) => {
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;
  return (
    <ul className="nav header-navbar-rht" >
      <HeaderNotification />
      <li className="nav-item dropdown has-arrow logged-item">
        <Link href="#" className="dropdown-toggle nav-link" data-bs-toggle="dropdown" aria-label='dropdown'>
          <span className="user-img">
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
              online={userProfile?.online!}
              idle={userProfile?.lastLogin?.idle}
            >
              <Avatar alt="" src={`${userProfile?.profileImage}`} key={userProfile?.profileImage}>
                <img src={doctors_profile} alt="" className="rounded-circle" />
              </Avatar>
            </StyledBadge>
          </span>
        </Link>
        <div className="dropdown-menu dropdown-menu-end">
          <div className="user-header">
            <div className="avatar avatar-sm">
              <Avatar alt="" src={`${userProfile?.profileImage}`}>
                <img src={doctors_profile} alt="" className="avatar-img rounded-circle" />
              </Avatar>
            </div>
            <div className="user-text">
              <h6>{userProfile?.firstName} {userProfile?.lastName}</h6>
              <p className="text-muted mb-0 text-uppercase">{userProfile?.roleName}</p>
            </div>
          </div>
          <Link className="dropdown-item" href={`/${userProfile?.roleName}/dashboard`}>Dashboard</Link>
          <Link className="dropdown-item" href={`/${userProfile?.roleName}/dashboard/profile`}>Profile Settings</Link>
          <Link className="dropdown-item" href="" onClick={(e) => {
            e.preventDefault()
            logOut()
          }}>Logout</Link>
        </div>
      </li>
    </ul>
  )
})

const MobileDoctorAfterLogin: FC<AfterLoginType> = (({ logOut }) => {
  const router = useRouter();
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;
  const [profileOpen, setProfileOpen] = useState(false)
  return (
    <ClickAwayListener onClickAway={() => {
      if (profileOpen) {
        setProfileOpen(!profileOpen)
      }
    }}>
      <li className={`has-submenu ${router.pathname.startsWith('/doctors/dashboard') ? 'active' : ' '}`} id='doctorList'>
        <Link href="" id="doctorsAnchor" className="mobileSubdropDrProficle"
          onClick={(e) => {
            e.preventDefault();
            setProfileOpen(!profileOpen)
            if (profileOpen) {
              setProfileOpen(false)
            }
          }} >
          <div className='profileImg' id='profileImg'>
            <Avatar alt="" src={`${userProfile?.profileImage}`} key={userProfile?.profileImage}>
              <img src={doctors_profile} alt="" className="rounded-circle" />
            </Avatar>
          </div>
          <span className='profileSpanText' id='profileSpanText'>
            <div className='profileName' id='profileName'>
              {userProfile?.firstName} {userProfile?.lastName}
            </div>
            <div className='profileRole' id='profileRole'>
              {userProfile?.roleName.toUpperCase()}
            </div>
          </span>
          <div className='profileChevron' id='profileChevron'>
            <i
              id="doctorsChevron"
              style={{ position: 'absolute', right: '20px', top: '40%' }}
              className={`fas ${profileOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}
            />
          </div>
        </Link>
        <ul className={`submenu ${profileOpen ? "d-block submenu-open-on-click" : ''}`}>
          <li >
            <Link
              className={router.pathname == `/${userProfile?.roleName}/dashboard` ? 'active' : ''}
              href={`/${userProfile?.roleName}/dashboard`} >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              className={router.pathname == `/${userProfile?.roleName}/dashboard/profile` ? 'active' : ''}
              href={`/${userProfile?.roleName}/dashboard/profile`}>
              Profile Settings
            </Link>
          </li>
          <li>
            <Link
              href="" onClick={(e) => {
                e.preventDefault()
                var root = document.getElementsByTagName("html")[0];
                root.classList.toggle('menu-opened')
                logOut();
              }}>
              Logout
            </Link>
          </li>
        </ul>
      </li>
    </ClickAwayListener>
  )
})

const PatientAfterLogin: FC<AfterLoginType> = (({ logOut }) => {
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;


  return (
    <ul className="nav header-navbar-rht">
      <HeaderCart />
      <HeaderNotification />
      <li className="nav-item dropdown has-arrow logged-item">
        <Link href="#" className="dropdown-toggle nav-link" data-bs-toggle="dropdown" aria-label='dropdown'>
          <span className="user-img">

            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
              online={userProfile?.online!}
              idle={userProfile?.lastLogin?.idle}
            >
              <Avatar alt="" src={`${userProfile?.profileImage}`} key={userProfile?.profileImage}>
                <img src={patient_profile} alt="" className="rounded-circle" />
              </Avatar>
            </StyledBadge>
          </span>
        </Link>
        <div className="dropdown-menu dropdown-menu-end">
          <div className="user-header">
            <div className="avatar avatar-sm">
              <Avatar alt="" src={`${userProfile?.profileImage}`} >
                <img src={patient_profile} alt="" className="avatar-img rounded-circle" />
              </Avatar>
            </div>
            <div className="user-text">
              <h6>{userProfile?.firstName} {userProfile?.lastName} </h6>
              <p className="text-muted mb-0 text-uppercase">{userProfile?.roleName}</p>
            </div>
          </div>
          <Link className="dropdown-item" href={`/${userProfile?.roleName}/dashboard`}>Dashboard</Link>
          <Link className="dropdown-item" href={`/${userProfile?.roleName}/dashboard/profile`}>Profile Settings</Link>
          <Link className="dropdown-item" href="" onClick={(e) => {
            e.preventDefault()
            logOut()
          }}>Logout</Link>
        </div>
      </li>
    </ul>
  )
})

const MobilePatientAfterLogin: FC<AfterLoginType> = (({ logOut }) => {
  const router = useRouter();
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;
  const [profileOpen, setProfileOpen] = useState(false)
  return (
    <ClickAwayListener onClickAway={() => {
      if (profileOpen) {
        setProfileOpen(!profileOpen)
      }
    }}>
      <li className={`has-submenu ${router.pathname.startsWith('/patient/dashboard') ? 'active' : ' '}`} id='patientList'>
        <Link
          href=""
          id="patientAnchor"
          className="mobileSubdropDrProficle"
          aria-label='mobile patinet anchor'
          onClick={(e) => {
            e.preventDefault();
            setProfileOpen(!profileOpen)
            if (profileOpen) {
              setProfileOpen(false)
            }
          }}>
          <div className='profileImg' id='profileImg'>
            <Avatar alt="" src={`${userProfile?.profileImage}`} key={userProfile?.profileImage} >
              <img src={patient_profile} alt="" className="avatar-img rounded-circle" />
            </Avatar>
          </div>
          <span className='profileSpanText' id='profileSpanText'>
            <div className='profileName' id='profileName'>
              {userProfile?.firstName} {userProfile?.lastName}
            </div>
            <div className='profileRole' id='profileRole'>
              {userProfile?.roleName.toUpperCase()}
            </div>
          </span>
          <div className='profileChevron' id='profileChevron'>
            <i id="doctorsChevron" style={{ position: 'absolute', right: '20px', top: '40%' }}
              className={`fas ${profileOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
          </div>

        </Link>

        <ul className={`submenu ${profileOpen ? "d-block submenu-open-on-click" : ''}`}>
          <li >
            <Link
              className={router.pathname == `/${userProfile?.roleName}/dashboard` ? 'active' : ''}
              href={`/${userProfile?.roleName}/dashboard`} >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              className={router.pathname == `/${userProfile?.roleName}/dashboard/profile` ? 'active' : ''}
              href={`/${userProfile?.roleName}/dashboard/profile`}>
              Profile Settings
            </Link>
          </li>
          <li>
            <Link
              href="" onClick={(e) => {
                e.preventDefault()
                var root = document.getElementsByTagName("html")[0];
                root.classList.toggle('menu-opened')
                logOut();
              }}>
              Logout
            </Link>
          </li>
        </ul>
      </li>
    </ClickAwayListener>
  )
})
interface ClinicMenuProps {

}
const ClinicMenu: FC<ClinicMenuProps> = (({ }) => {
  const [clinicsOpen, setClinicsOpen] = useState(false);
  const [allClinicsDeactivate, setAllClinicsDeactivate] = useState<boolean>(false);
  const clinicStatus = useSelector((state: AppState) => state.clinicStatus.value);
  const router = useRouter();
  const theme = useTheme();
  useEffect(() => {
    if (clinicStatus.length > 0) {
      setAllClinicsDeactivate(() => clinicStatus.every((a) => !a.active))
    } else {
      setAllClinicsDeactivate(() => true)
    }
  }, [clinicStatus])
  return (
    <ClickAwayListener
      onClickAway={() => {
        if (clinicsOpen) {
          setClinicsOpen(!clinicsOpen)
        }
      }}>
      <li className={`has-submenu megamenu  
        ${router.pathname == "/cardiohome" ||
          router.pathname == '/eyecarehome' ||
          router.pathname == '/veterinaryhome' ||
          router.pathname == '/paediatrichome' ||
          router.pathname == '/fertilityhome' ||
          router.pathname == '/enthome' ||
          router.pathname == '/cosmeticshome' ||
          router.pathname == '/homecare'
          ? "active" : ""}`} >
        {
          !allClinicsDeactivate ?
            <Link
              href=""
              id="clinicsAnchor"
              onClick={(e) => {
                e.preventDefault();
                setClinicsOpen(!clinicsOpen)
              }}>
              Clinics
              <i id="clinicsChevron" className={`fas ${clinicsOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
            </Link> :
            <Link
              href=""
              id="clinicsAnchor"
              onClick={(e) => {
                e.preventDefault();
              }}>
              Clinics
            </Link>
        }

        <ul
          className={`submenu mega-submenu ${clinicsOpen ?
            "d-block submenu-open-on-click" :
            ''}`}>
          <li>
            <div className="megamenu-wrapper">
              <div className="row">
                {
                  clinicStatus.length > 0 &&
                  clinicStatus.map((clinic: ClinicStatusType, index: number) => {
                    let primaryColor = theme.palette.primary.main
                    const url = clinic.hasThemeImage
                      ? `${clinic?.image
                        .replace('primaryMain', primaryColor.slice(1))
                        .slice(0, clinic?.image
                          .replace('primaryMain', primaryColor.slice(1)).lastIndexOf('.'))}_small${clinic?.image
                            .replace('primaryMain', primaryColor.slice(1)).slice(clinic?.image
                              .replace('primaryMain', primaryColor.slice(1)).lastIndexOf('.'))}`
                      : `${clinic?.image.slice(0, clinic.image.lastIndexOf('.'))}_small${clinic.image.slice(clinic.image.lastIndexOf('.'))}`;
                    if (clinic.active) {
                      return (
                        <div className="col-lg-2" key={index}>
                          <div className="single-demo">
                            <div className="demo-img">
                              <Link
                                href={clinic.href}
                                className='inner-demo-img'
                                onClick={() => setClinicsOpen(false)}>
                                <img
                                  src={url}
                                  className="img-fluid inner-clinic-image"
                                  alt="img"
                                />
                              </Link>
                            </div>
                            <div className="demo-info">
                              <Link
                                href={clinic.href}
                                style={{
                                  color:
                                    `${router.pathname == clinic.href ?
                                      `${theme.palette.primary.light}` :
                                      `${theme.palette.text.color}`}`
                                }}
                                className={
                                  `inner-demo-img  
                                  ${router.pathname == clinic.href ? 'active' : ''}`
                                }
                                onClick={(e) => {
                                  setClinicsOpen(false)
                                }}>
                                {clinic.name}
                              </Link>
                            </div>
                          </div>
                        </div>
                      )
                    }
                  })
                }
              </div>
            </div>
          </li>
        </ul>
      </li>
    </ClickAwayListener>
  )
})

const MobileClinicMenu: FC<ClinicMenuProps> = (({ }) => {
  const [clinicsOpen, setClinicsOpen] = useState(false);
  const [allClinicsDeactivate, setAllClinicsDeactivate] = useState<boolean>(false);
  const clinicStatus = useSelector((state: AppState) => state.clinicStatus.value);
  const router = useRouter();
  const theme = useTheme();
  useEffect(() => {
    if (clinicStatus.length > 0) {
      setAllClinicsDeactivate(() => clinicStatus.every((a) => !a.active))
    } else {
      setAllClinicsDeactivate(() => true)
    }
  }, [clinicStatus])

  return (
    <ClickAwayListener
      onClickAway={() => {
        if (clinicsOpen) {
          setClinicsOpen(!clinicsOpen)
        }
      }}>
      <li className={`has-submenu megamenu  
        ${router.pathname == "/cardiohome" ||
          router.pathname == '/eyecarehome' ||
          router.pathname == '/veterinaryhome' ||
          router.pathname == '/paediatrichome' ||
          router.pathname == '/fertilityhome' ||
          router.pathname == '/enthome' ||
          router.pathname == '/cosmeticshome' ||
          router.pathname == '/homecare'
          ? "active" : ""}`} >
        {
          !allClinicsDeactivate &&
          <Link
            href=""
            id="clinicsAnchor"
            onClick={(e) => {
              e.preventDefault();
              setClinicsOpen(!clinicsOpen)
            }}>
            Clinics
            <i id="clinicsChevron" className={`fas ${clinicsOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
          </Link>
        }

        <ul
          className={`submenu mega-submenu ${clinicsOpen ?
            "d-block submenu-open-on-click" :
            ''}`}>
          <li>
            <div className="megamenu-wrapper">
              <div className="row">
                {
                  clinicStatus.length > 0 &&
                  clinicStatus.map((clinic: ClinicStatusType, index: number) => {
                    let primaryColor = theme.palette.primary.main
                    const url = clinic.hasThemeImage
                      ? `${clinic?.image
                        .replace('primaryMain', primaryColor.slice(1))
                        .slice(0, clinic?.image
                          .replace('primaryMain', primaryColor.slice(1)).lastIndexOf('.'))}_small${clinic?.image
                            .replace('primaryMain', primaryColor.slice(1)).slice(clinic?.image
                              .replace('primaryMain', primaryColor.slice(1)).lastIndexOf('.'))}`
                      : `${clinic?.image.slice(0, clinic.image.lastIndexOf('.'))}_small${clinic.image.slice(clinic.image.lastIndexOf('.'))}`;
                    if (clinic.active) {
                      return (
                        <div className="col-lg-12" key={index}>

                          <Link
                            href={clinic.href}
                            style={{
                              color:
                                `${router.pathname == clinic.href ?
                                  `${theme.palette.primary.light}` :
                                  `${theme.palette.text.color}`}`
                            }}
                            className={
                              `inner-demo-img  
                                  ${router.pathname == clinic.href ? 'active' : ''}`
                            }
                            onClick={(e) => {
                              setClinicsOpen(false)
                            }}>
                            <div className="demo-info" style={{ borderBottom: 'none' }}>
                              {clinic.name}
                            </div>
                          </Link>

                        </div>
                      )
                    }
                  })
                }
              </div>
            </div>
          </li>
        </ul>
      </li>
    </ClickAwayListener>
  )
})