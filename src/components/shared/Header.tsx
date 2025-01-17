/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { FC, useState, useEffect, Fragment } from 'react';
import FeatherIcon from 'feather-icons-react';
import Link from 'next/link';

//next 

import { useRouter } from 'next/router';
import { deleteCookie, getCookie } from 'cookies-next';

import { patient_profile, doctors_profile, logo } from '@/public/assets/imagepath';
import useScssVar from '@/hooks/useScssVar';

//Redux
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { ClinicStatusType } from '@/redux/clinicStatus';
//Mui
import { useTheme } from '@mui/material';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import useMediaQuery from '@mui/material/useMediaQuery';
import HeaderNotification from './HeaderNotification';
import HeaderCart from './HeaderCart';
import MenuIcon from '@mui/icons-material/Menu';
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';
import { toast } from 'react-toastify';
import { updateHomeAccessToken } from '@/redux/homeAccessToken';
import isJsonString from '@/helpers/isJson';
import Avatar from '@mui/material/Avatar'


const Header: FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const maxWidth991 = useMediaQuery('(max-width:991px)');
  const minWidth1200 = useMediaQuery('(min-width:1200px)');
  const clinicStatus = useSelector((state: AppState) => state.clinicStatus.value)
  const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const dispatch = useDispatch();
  const { muiVar, bounce } = useScssVar()
  const [navbar, setNavbar] = useState(false);
  const [clinicsOpen, setClinicsOpen] = useState(false)
  const [conditionOpen, setConditionOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [allClinicsDeactivate, setAllClinicsDeactivate] = useState<boolean>(false)
  const [isSideMenu, setSideMenu] = useState("")
  const [style, setStyle] = useState({})
  const onhandleCloseMenu = () => {
    var root = document.getElementsByTagName("html")[0];
    if (maxWidth991) {
      root.classList.toggle('menu-opened')
    }
  };

  const changeBackground = () => {
    if (window.scrollY >= 95) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  }
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', changeBackground);

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
            return {
              background: theme.palette.primary.light,
            };
          default:
            return { background: "" };
        }
      };

      setStyle(getBackgroundStyle());
    }
  }, [navbar, theme, router])

  const toggleSidebar = (value: string) => {
    setSideMenu(value)

  }
  const handleClickAway = (e: any) => {
    let content = e.target.id
    if (maxWidth991) {
      var root = document.getElementsByTagName("html")[0];
      switch (true) {
        case content == 'clinicsAnchor':
        case content == 'clinicsChevron':
        case content == 'conditionAnchor':
        case content == 'conditionChevron':
        case content == 'patientAnchor':
        case content == 'patientChevron':
        case content == 'doctorsAnchor':
        case content == 'doctorsChevron':
        case content == 'clinicsAnchor':
        case content == 'rounded-circle':
        case content == 'profileRole':
        case content == 'profileName':
        case content == 'profileSpanText':
        case content == 'profileImg':
        case content == 'profileChevron':
        case content == 'doctorList':
        case content == 'patientList':
          break;

        case content == '':
          root.classList.remove('menu-opened')
          break
      }
    }
  }


  useEffect(() => {
    if (clinicStatus.length > 0) {
      setAllClinicsDeactivate(() => clinicStatus.every((a) => !a.active))
    } else {
      setAllClinicsDeactivate(() => true)
    }
  }, [clinicStatus])
  // remove blinking image 
  const [imageTimestamp, setImageTimestamp] = useState(new Date().getTime());

  // Update the timestamp only when the profile image URL changes
  useEffect(() => {
    setImageTimestamp(new Date().getTime());
  }, [userProfile]);

  const PatientHeaderUL = () => {
    return (
      <>
        <ul className="nav header-navbar-rht">
          <HeaderCart />
          <HeaderNotification />
          <li className="nav-item dropdown has-arrow logged-item">
            <Link href="#" className="dropdown-toggle nav-link" data-bs-toggle="dropdown" aria-label='dropdown'>
              <span className="user-img">
                <Avatar alt="" src={`${userProfile?.profileImage}${isClient ? `?random=${imageTimestamp}` : ''}`} key={userProfile?.profileImage}>
                  <img src={patient_profile} alt="" className="rounded-circle" />
                </Avatar>
              </span>
            </Link>
            <div className="dropdown-menu dropdown-menu-end">
              <div className="user-header">
                <div className="avatar avatar-sm">
                  <Avatar alt="" src={`${userProfile?.profileImage}${isClient ? `?random=${imageTimestamp}` : ''}`} >
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
      </>
    )
  }

  const MobilePatientUL = () => {
    return (
      <ClickAwayListener onClickAway={() => {
        if (profileOpen) {
          setProfileOpen(!profileOpen)
        }
      }}>
        <li className={`has-submenu ${router.pathname.startsWith('/patient/dashboard') ? 'active' : ' '}`} id='patientList'>
          <Link href="" id="patientAnchor" className="mobileSubdropDrProficle" aria-label='mobile patinet anchor'
            onMouseEnter={() => toggleSidebar("admin")}
            onClick={(e) => {
              e.preventDefault();
              setProfileOpen(!profileOpen)
              if (profileOpen) {
                setProfileOpen(false)
              }
              if (clinicsOpen) {
                setClinicsOpen(false)
              }
              if (conditionOpen) {
                setConditionOpen(false)
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
              <Link className={router.pathname == `/${userProfile?.roleName}/dashboard` ? 'active' : ''}
                href={`/${userProfile?.roleName}/dashboard`} onClick={(e) => {
                  onhandleCloseMenu()
                }}>Dashboard</Link></li>
            <li><Link
              className={router.pathname == `/${userProfile?.roleName}/dashboard/profile` ? 'active' : ''}
              href={`/${userProfile?.roleName}/dashboard/profile`} onClick={(e) => {
                onhandleCloseMenu()
              }}>Profile Settings</Link></li>
            <li><Link
              href="" onClick={(e) => {
                e.preventDefault()
                logOut();
              }}>Logout</Link></li>
          </ul>
        </li>
      </ClickAwayListener>
    )
  }

  const DoctorHeaderUL = () => {
    return (
      <ul className="nav header-navbar-rht" >
        <HeaderNotification />
        <li className="nav-item dropdown has-arrow logged-item">
          <Link href="#" className="dropdown-toggle nav-link" data-bs-toggle="dropdown" aria-label='dropdown'>
            <span className="user-img">
              <Avatar alt="" src={`${userProfile?.profileImage}`} key={userProfile?.profileImage}>
                <img src={doctors_profile} alt="" className="rounded-circle" />
              </Avatar>
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
  }

  const MobileDoctorUL = () => {
    return (
      <ClickAwayListener onClickAway={() => {
        if (profileOpen) {
          setProfileOpen(!profileOpen)
        }
      }}>
        <li className={`has-submenu ${router.pathname.startsWith('/doctors/dashboard') ? 'active' : ' '}`} id='doctorList'>
          <Link href="" id="doctorsAnchor" className="mobileSubdropDrProficle"
            onMouseEnter={() => toggleSidebar("admin")}
            onClick={(e) => {
              e.preventDefault();
              setProfileOpen(!profileOpen)
              if (profileOpen) {
                setProfileOpen(false)
              }
              if (clinicsOpen) {
                setClinicsOpen(false)
              }
              if (conditionOpen) {
                setConditionOpen(false)
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
              <i id="doctorsChevron" style={{ position: 'absolute', right: '20px', top: '40%' }}
                className={`fas ${profileOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
            </div>
          </Link>
          <ul className={`submenu ${profileOpen ? "d-block submenu-open-on-click" : ''}`}>
            <li >
              <Link className={router.pathname == `/${userProfile?.roleName}/dashboard` ? 'active' : ''}
                href={`/${userProfile?.roleName}/dashboard`} onClick={(e) => {
                  onhandleCloseMenu()
                }}>Dashboard</Link></li>
            <li><Link
              className={router.pathname == `/${userProfile?.roleName}/dashboard/profile` ? 'active' : ''}
              href={`/${userProfile?.roleName}/dashboard/profile`} onClick={(e) => {
                onhandleCloseMenu()
              }}>Profile Settings</Link></li>
            <li><Link
              href="" onClick={(e) => {
                e.preventDefault()
                logOut();
              }}>Logout</Link></li>
          </ul>
        </li>
      </ClickAwayListener>
    )
  }

  const ClinicLi = () => {
    return (
      <ClickAwayListener onClickAway={() => {
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
            router.pathname == '/cosmeticshome'
            ? "active" : ""}`} >
          {!allClinicsDeactivate && <Link href="" id="clinicsAnchor" onClick={(e) => {
            e.preventDefault();
            setClinicsOpen(!clinicsOpen)
            if (conditionOpen) {
              setConditionOpen(false)
            }
          }}>
            <>
              Clinics <i id="clinicsChevron" className={`fas ${clinicsOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
            </>
          </Link>}
          <ul className={`submenu mega-submenu ${clinicsOpen ? "d-block submenu-open-on-click" : ''}`}>
            <li>
              <div className="megamenu-wrapper">
                <div className="row">
                  {
                    clinicStatus.length > 0 &&
                    clinicStatus.map((clinic: ClinicStatusType, index: number) => {
                      let primaryColor = theme.palette.primary.main
                      // const url = clinic.hasThemeImage ? `${clinic?.image.replace('primaryMain', primaryColor.slice(1))}`
                      //   : `${clinic?.image}`

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
                          <Fragment key={index}>
                            <div className="col-lg-2">
                              <div className="single-demo">
                                <div className="demo-img">
                                  <Link
                                    href={clinic.href}
                                    className="inner-demo-img"
                                    onClick={() => {
                                      setClinicsOpen(false)
                                    }}>
                                    <img
                                      src={url}
                                      style={{ maxHeight: 120, minHeight: 120 }}
                                      className="img-fluid"
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
                                    className={`inner-demo-img  ${router.pathname == clinic.href ? 'active' : ''}`}
                                    onClick={(e) => {
                                      onhandleCloseMenu()
                                      setClinicsOpen(false)
                                    }}>
                                    {clinic.name}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </Fragment>
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
  }

  const LoginULFirst = () => {
    return (
      <ul className={`main-nav  ${navbar ? 'dark' : " "}  ${router.pathname == "home4" ? "white-font" : ""}`}>
        <li className={`${router.pathname.includes("/veterinaryhome") || ("/fertilityhome") ? "login-in-fourteen" : "register-btn"}`}>
          <Link
            href="/login"
            className={"btn reg-btn"}>
            <i className="me-2">
              {router.pathname.includes("veterinaryhome") ? <FeatherIcon icon="user" /> : <FeatherIcon icon="lock" />}
            </i>
            Log In
          </Link>
        </li>
        <li className={`register-btn`}>
          <Link href="/register" className={`btn reg-btn`}>
            <i className="me-2"><FeatherIcon icon="user" /></i>
            Sign Up
          </Link>
        </li>
      </ul>
    )
  }
  const LoginULSecond = () => {
    return (
      <ul className="nav header-navbar-rht">
        <li className={`${router.pathname == "/veterinaryhome" || router.pathname == "/home9" ? "login-in-fourteen" : "register-btn"}`}>
          <Link
            href="/login"
            className={
              router.pathname === "/home9"
                ? "btn reg-btn"
                : (router.pathname === "/veterinaryhome"
                  ? "btn reg-btn"
                  : "btn log-btn")
            }
          >
            <i className="me-2">
              {router.pathname == "/veterinaryhome" ? (
                <FeatherIcon icon="user" />
              ) : (
                <FeatherIcon icon="lock" />
              )}
            </i>

            Log In
          </Link>
        </li>
        <li className={`${router.pathname == "/veterinaryhome" || router.pathname == "/home9" ? "login-in-fourteen" : "register-btn"}`}>
          <Link href="/register" className={`${router.pathname == "/veterinaryhome" ? "btn btn-primary reg-btn reg-btn-fourteen" : "btn reg-btn"}`}>
            <i className="me-2"><FeatherIcon icon="user" /></i>
            Sign Up
          </Link>
        </li>
      </ul>
    )
  }
  const EyecarehomeLoginUl = () => {
    return (
      <ul className="nav header-navbar-rht">
        <li className="nav-item">
          <Link className={`nav-link header-login `} href="/login">
            <i className="me-2"><FeatherIcon icon="lock" /></i>
            Register
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link header-login" href="/login">
            <i className="me-2"><FeatherIcon icon="user" /></i>
            Login
          </Link>
        </li>
      </ul>
    )
  }

  const PaediatricLoginUl = () => {
    return (
      <ul className="nav header-navbar-rht">
        <li className="login-link"><Link href="/login">Login / Signup</Link></li>
        <li className="login-in-fourteen">
          <Link href="/login" className="btn reg-btn">Log In</Link>
        </li>
        <li className="login-in-fourteen">
          <Link href="/register" className=" reg-btn-thirteen"><span>Sign Up</span>
            <div className="user-icon-header"><i><FeatherIcon icon="user" /></i></div>
          </Link>
        </li>
      </ul>
    )
  }

  const FertilityLoginUI = () => {
    return (
      <ul className="nav header-navbar-rht">
        <li className={`${router.pathname == "/veterinaryhome" || router.pathname == "/fertilityhome" ? "login-in-fourteen" : "register-btn"}`}>
          <Link
            href="/login"
            className={"btn reg-btn"}>
            <i className="me-2">
              {router.pathname == "veterinaryhome" ? (
                <FeatherIcon icon="user" />
              ) : (
                <FeatherIcon icon="lock" />
              )}
            </i>
            Log In
          </Link>
        </li>
        <li className={`register-btn`}>
          <Link href="/register" className={`btn reg-btn`}>
            <i className="me-2"><FeatherIcon icon="user" /></i>
            Sign Up
          </Link>
        </li>
      </ul>
    )
  }

  const EntLoginUI = () => {
    return (
      <ul className="nav header-navbar-rht">
        <li className="nav-item">
          <Link className={`nav-link header-login `} href="/login">
            login / Signup
          </Link>
        </li>
      </ul>
    )
  }

  const CosmeticLoginUI = () => {
    return (
      <ul className="nav header-navbar-rht">
        <li className="login-link"><Link href="/login">Login / Signup</Link></li>
        <li className="login-in-sixteen">
          <Link href="/login" className="btn reg-btn"><i className="me-2"><FeatherIcon icon="lock" /></i>Login<span></span><span></span><span></span><span></span></Link>
        </li>
        <li className="login-in-sixteen">
          <Link href="/register" className="btn btn-primary reg-btn reg-btn-sixteen"><i className="me-2"><FeatherIcon icon="user" /></i>Sign Up</Link>
        </li>
      </ul>
    )
  }

  const MobileConditionUL = () => {
    return (
      <ClickAwayListener onClickAway={() => {
        if (conditionOpen) {
          setConditionOpen(!conditionOpen)
        }
      }}>
        <li className={`has-submenu ${router.pathname == '/privacy' ||
          router.pathname == '/terms' ||
          router.pathname == '/faq' ? 'active' : ' '}`}>
          <Link href="" id="conditionAnchor" className={isSideMenu == "admin" ? "subdrop" : ""}
            onMouseEnter={() => toggleSidebar("admin")}
            onClick={(e) => {
              e.preventDefault();
              setConditionOpen(!conditionOpen)
              if (conditionOpen) {
                setConditionOpen(false)
              }
              if (clinicsOpen) {
                setClinicsOpen(false)
              }
            }}>
            Conditions<i id="conditionChevron" className={`fas ${conditionOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`} /></Link>
          <ul className={`submenu ${conditionOpen ? "d-block submenu-open-on-click" : ''}`}>
            <li ><Link className={router.pathname == '/privacy' ? 'active' : ''} href="/privacy" onClick={(e) => {
              if (conditionOpen) {
                setConditionOpen(false)
              }
              onhandleCloseMenu()
            }}>Privacy Policy</Link></li>
            <li><Link className={router.pathname == '/terms' ? 'active' : ''} href="/terms" onClick={(e) => {
              if (conditionOpen) {
                setConditionOpen(false)
              }
              onhandleCloseMenu()
            }}>Terms & conditions</Link></li>
            <li><Link className={router.pathname == '/faq' ? 'active' : ''} href="/faq" onClick={(e) => {
              if (conditionOpen) {
                setConditionOpen(false)
              }
              onhandleCloseMenu()
            }}>FAQ</Link></li>
          </ul>
        </li>
      </ClickAwayListener>
    )
  }
  const logOut = () => {
    // dispatch(updateHomeFormSubmit(true))
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
        if (isJsonString(getCookie('homeAccessToken') as string)) {
          const { length } = JSON.parse(getCookie('homeAccessToken') as string)
          for (var i = 0; i < parseInt(length); i++) {
            deleteCookie(`${i}`);
          }
        }
        deleteCookie('homeAccessToken')
        dispatch(updateHomeAccessToken(null))
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
            dispatch(updateHomeFormSubmit(false))
            router.reload();
          }
        });
      }
    })

    // onhandleCloseMenu()
  }

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])
  const getHeaderClass = () => {
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
    if (router.pathname.includes('dashboard')) return "header-fixed-dashboard header-one"
    return "header-fixed header-one";
  };

  return (
    <>
      <header className={`header ${getHeaderClass()}`} style={{ ...style, ...muiVar }}>
        <div className='container'>
          <nav className={`navbar navbar-expand-lg header-nav`}  >
            <div className={`navbar-header col-lg-${userProfile == null ? '1' : userProfile?.roleName == "doctors" ? '2' : '1'}`}>
              <ClickAwayListener onClickAway={handleClickAway}>
                <Link href="" id="mobile_btn" aria-label='mobile menu' onClick={(e) => {
                  e.preventDefault();
                  onhandleCloseMenu();
                }}>
                  <MenuIcon
                    color={router.pathname !== '/home4'
                      && router.pathname !== '/homecare'
                      && router.pathname !== '/eyecarehome' ?
                      'primary' : 'secondary'}
                    fontSize='large' />
                </Link>
              </ClickAwayListener>
              <Link href="/" className="navbar-brand logo" style={{ marginLeft: minWidth1200 ? 0 : 0 }}>
                <img style={{
                  maxWidth: maxWidth991 ? "70px" : "70px",
                  height: 'auto',
                  float: maxWidth991 ? 'right' : 'unset'
                }} src={logo} className={`img-fluid `} alt="Logo" onClick={() => router.push('/')} />
                {/* ${router.pathname !== '/home4' && router.pathname !== '/homecare' && router.pathname !== '/eyecarehome' ? 'imgColorPrimary' : "imgColorSecondary"} */}
              </Link>
              {
                maxWidth991 &&
                <>
                  {
                    userProfile !== null &&
                    <>
                      {
                        userProfile?.roleName == 'doctors'
                          ? <>
                            <HeaderNotification />
                          </> :
                          userProfile?.roleName == 'patient'
                            ? <>
                              <HeaderCart />
                              <HeaderNotification />
                            </> :
                            <>Another 668</>
                      }
                    </>
                  }
                </>
              }
            </div>
            {
              maxWidth991 ?
                <>
                  <div className="main-menu-wrapper"  >
                    <div className="menu-header" >
                      <Link href="/home" className="menu-logo">
                        <img src={logo} className="img-fluid " alt="Logo" />
                      </Link>
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
                        <Link href="/" onClick={() => {
                          onhandleCloseMenu();
                        }}>
                          Home
                        </Link>
                      </li>
                      <ClinicLi />
                      <li className={`has-submenu ${router.pathname.startsWith("/pharmacy") ? "active" : ""}`}>
                        <Link href="/pharmacy" onClick={() => { onhandleCloseMenu() }} className={isSideMenu == "pharmacy" ? "subdrop" : ""}>
                          Pharmacy </Link>
                      </li>
                      <li className={`has-submenu ${router.pathname.startsWith("/blog") ? "active" : ""}`}>
                        <Link href="/blog" onClick={() => { onhandleCloseMenu() }} className={isSideMenu == "blog" ? "subdrop" : ""}>
                          Blog </Link>
                      </li>
                      <li className={`has-submenu ${router.pathname == "/doctors/search" ? "active" : ""}`}>
                        <Link href="/doctors/search" onClick={() => { onhandleCloseMenu() }} className={isSideMenu == "doctors" ? "subdrop" : ""}>
                          Doctors </Link>
                      </li>

                      <MobileConditionUL />
                      <li className={`has-submenu ${router.pathname == "/about" ? "active" : ""}`}>
                        <Link href="/about" onClick={() => { onhandleCloseMenu() }} className={isSideMenu == "about" ? "subdrop" : ""}>
                          About us </Link>
                      </li>
                      <li className={`has-submenu ${router.pathname == "/contact" ? "active" : ""}`}>
                        <Link href="/contact" onClick={() => { onhandleCloseMenu() }} className={isSideMenu == "contact" ? "subdrop" : ""}>
                          Contact us </Link>
                      </li>
                      {
                        userProfile == null ?
                          <>
                            <li className={`has-submenu ${router.pathname == "/login" ? "active" : ""}`}>
                              <Link href="/login" onClick={() => { onhandleCloseMenu() }} className={isSideMenu == "login" ? "subdrop" : ""}>
                                Login </Link>
                            </li>
                            <li className={`has-submenu ${router.pathname == "/register" ? "active" : ""}`}>
                              <Link href="/register" onClick={() => { onhandleCloseMenu() }} className={isSideMenu == "register" ? "subdrop" : ""}>
                                register </Link>
                            </li>
                          </> :
                          <>
                            {
                              userProfile?.roleName == 'doctors'
                                ? <MobileDoctorUL /> :
                                userProfile?.roleName == 'patient'
                                  ? <MobilePatientUL /> :
                                  <>Another 745</>
                            }
                          </>
                      }
                    </ul>
                  </div>
                </> :
                <>
                  <div className={`main-menu-wrapper col-lg-${userProfile == null ?
                    router.pathname !== '/home' && router.pathname !== '/home3' && router.pathname !== '/home4' ? '8' : '9' :
                    (userProfile?.roleName == "doctors") ? (router.pathname !== '/login' && router.pathname !== '/register') ? '8' : '7' : '8'}`} style={{
                      display: 'flex',
                      justifyContent: userProfile == null ? 'flex-end' : (userProfile?.roleName == "doctors") ? 'center' : 'flex-end'
                    }}>
                    <ul className={`main-nav  ${navbar ? 'dark' : " "}  ${router.pathname == "/home4" ? "white-font" : ""}`}>
                      <li className={`has-submenu megamenu  ${router.pathname == "/" ||
                        router.pathname == '/home' ||
                        router.pathname == '/home3' ||
                        router.pathname == '/home4'
                        ? "active" : ""}`} >
                        <Link href="/" onClick={() => {
                          onhandleCloseMenu();
                        }}>
                          Home
                        </Link>
                      </li>
                      <ClinicLi />
                      <li className={`has-submenu ${router.pathname.startsWith("/pharmacy") ? "active" : ""}`}>
                        <Link href="/pharmacy" onClick={() => { onhandleCloseMenu() }} className={isSideMenu == "pharmacy" ? "subdrop" : ""}>
                          Pharmacy </Link>
                      </li>
                      <li className={`has-submenu ${router.pathname.startsWith("/blog") ? "active" : ""}`}>
                        <Link href="/blog" onClick={() => { onhandleCloseMenu() }} className={isSideMenu == "blog" ? "subdrop" : ""}>
                          Blog </Link>
                      </li>
                      <li className={`has-submenu ${router.pathname == "/doctors/search" ? "active" : ""}`}>
                        <Link href="/doctors/search" onClick={() => { onhandleCloseMenu() }} className={isSideMenu == "doctors" ? "subdrop" : ""}>
                          Doctors </Link>
                      </li>
                      <ClickAwayListener onClickAway={() => {
                        if (conditionOpen) {
                          setConditionOpen(!conditionOpen)
                        }
                      }}>
                        <li className={`has-submenu ${router.pathname == '/privacy' ||
                          router.pathname == '/terms' ||
                          router.pathname == '/faq' ? 'active' : ' '}`}>
                          <Link href="" id="conditionAnchor" className={isSideMenu == "admin" ? "subdrop" : ""}
                            onMouseEnter={() => toggleSidebar("admin")}
                            onClick={(e) => {
                              e.preventDefault();
                              setConditionOpen(!conditionOpen)
                              if (conditionOpen) {
                                setConditionOpen(false)
                              }
                              if (clinicsOpen) {
                                setClinicsOpen(false)
                              }
                            }}>
                            Conditions<i id="conditionChevron" className={`fas ${conditionOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`} /></Link>
                          {isSideMenu == "admin" ?

                            <ul className={`submenu ${conditionOpen ? "d-block submenu-open-on-click" : ''}`}>
                              <li ><Link className={router.pathname == '/privacy' ? 'active' : ''} href="/privacy" onClick={(e) => {
                                if (conditionOpen) {
                                  setConditionOpen(false)
                                }
                                onhandleCloseMenu()
                              }}>Privacy Policy</Link></li>
                              <li><Link className={router.pathname == '/terms' ? 'active' : ''} href="/terms" onClick={(e) => {
                                if (conditionOpen) {
                                  setConditionOpen(false)
                                }
                                onhandleCloseMenu()
                              }}>Terms & conditions</Link></li>
                              <li><Link className={router.pathname == '/faq' ? 'active' : ''} href="/faq" onClick={(e) => {
                                if (conditionOpen) {
                                  setConditionOpen(false)
                                }
                                onhandleCloseMenu()
                              }}>FAQ</Link></li>
                            </ul> : ""
                          }
                        </li>
                      </ClickAwayListener>
                      <li className={`has-submenu ${router.pathname == "/about" ? "active" : ""}`}>
                        <Link href="/about" onClick={() => { onhandleCloseMenu() }} className={isSideMenu == "about" ? "subdrop" : ""}>
                          About us </Link>
                      </li>
                      <li className={`has-submenu ${router.pathname == "/contact" ? "active" : ""}`}>
                        <Link href="/contact" onClick={() => { onhandleCloseMenu() }} className={isSideMenu == "contact" ? "subdrop" : ""}>
                          Contact us </Link>
                      </li>
                      <li className="searchbar" style={{ marginRight: 10 }}>
                        <Link href="#" aria-label='search'>
                          <i> <FeatherIcon icon="search" /></i>
                        </Link>
                        <div className="togglesearch" style={{ display: "none" }}>
                          <form >
                            <div className="input-group">
                              <input type="text" className="form-control" name="search" />
                              <button type="submit" className="btn">
                                Search
                              </button>
                            </div>
                          </form>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className={`main-menu-wrapper col-lg-${userProfile == null ?
                    router.pathname !== '/home' &&
                      router.pathname !== '/home3' &&
                      router.pathname !== '/home4' ? '3' : '2' :
                    (userProfile?.roleName == "doctors") ? (router.pathname !== '/login' && router.pathname !== '/register') ? '2' : '3' : '3'}`} style={{
                      display: 'flex',
                      justifyContent: 'flex-end'
                    }}>
                    {
                      userProfile == null ?
                        (router.pathname == '/' || router.pathname == '/cardiohome') ?
                          <LoginULFirst /> :
                          (router.pathname == '/veterinaryhome' ||
                            router.pathname == '/login' ||
                            router.pathname == '/register') ?
                            <LoginULSecond /> :
                            router.pathname == '/paediatrichome' ?
                              <PaediatricLoginUl /> :
                              router.pathname == '/eyecarehome' ?
                                <EyecarehomeLoginUl /> :
                                router.pathname == '/fertilityhome' ?
                                  <FertilityLoginUI /> :
                                  router.pathname == '/enthome' ?
                                    <EntLoginUI /> :
                                    router.pathname == '/cosmeticshome' ?
                                      <CosmeticLoginUI /> :
                                      <EntLoginUI />
                        :
                        (router.pathname == '/login' || router.pathname == '/register')
                          ? <LoginULSecond /> :
                          userProfile?.roleName == 'doctors'
                            ? <DoctorHeaderUL /> :
                            userProfile?.roleName == 'patient'
                              ? <PatientHeaderUL /> :
                              <>Another 880</>
                    }
                  </div>
                </>
            }
          </nav>
        </div>
      </header>
    </>

  );
}

export default Header;