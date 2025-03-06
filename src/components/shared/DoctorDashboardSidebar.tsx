/* eslint-disable @next/next/no-img-element */
import { ElementType, FC, Fragment, HTMLAttributes, useEffect, useMemo, useRef, useState } from 'react'
import StickyBox from 'react-sticky-box'
import useScssVar from '@/hooks/useScssVar'
import { useRouter } from 'next/router'
import Link from 'next/link';
import { doctors_profile } from '@/public/assets/imagepath';
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '@/redux/store'
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit'
import { toast } from 'react-toastify'
import { updateHomeAccessToken } from '@/redux/homeAccessToken'
import dayjs from 'dayjs'
import preciseDiff from 'dayjs-precise-range'
import Avatar from '@mui/material/Avatar';

import isJsonString from '@/helpers/isJson';
import { deleteCookie, getCookie, hasCookie, setCookie } from 'cookies-next';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import { updateHomeSideBarOpen } from '@/redux/homeSideBarOpen';
import useMediaQuery from '@mui/material/useMediaQuery';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import { getSelectedBackgroundColor, StyledBadge } from "@/components/DoctorDashboardSections/ScheduleTiming"
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { isNotNull } from './PatientBillingRecords';
import Tooltip from '@mui/material/Tooltip';

export const DrawerHeader = styled('div', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open: boolean;
}>(({ theme, open }) => {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    minHeight: 101,
    ['@media (max-width: 992px)']: {
      minHeight: 72,
      visibility: 'hidden',
      width: '1px'
    },
    zIndex: 1202,
    background: theme.palette.background.default
  }
});
const drawerWidth = 240;
const transitionStyles = (theme: Theme) => ({
  transition: theme.transitions.create(['width', 'background-color'], {
    easing: theme.transitions.easing.sharp,
    duration: 500,
  }),
});
export const openedMixin = (theme: Theme): CSSObject => {
  return {
    width: drawerWidth,
    ...transitionStyles(theme),
    overflowX: 'hidden',
    borderRight: `1px solid ${theme.palette.primary.main} !important`,
    backgroundColor: theme.palette.background.default,
  }
};

export const closedMixin = (theme: Theme): CSSObject => ({
  ...transitionStyles(theme),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  borderRight: `1px solid ${theme.palette.secondary.main} !important`,
  backgroundColor: theme.palette.background.paper,
  ['@media (max-width: 992px)']: {
    left: -37,
    overflowY: 'hidden',
    backgroundColor: 'transparent',
    borderRight: 'none !important',
    "& .profile-info-widget": {
      // visibility: 'hidden'
    },
    "& .MuiListItem-root": {
      visibility: 'hidden'
    }
  },
});

export const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open, variant }) => {
    return {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': {
          ...openedMixin(theme),
        },
      }),

      ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': {
          ...closedMixin(theme),
        },
      }),
      ...(variant === 'permanent' || variant === 'temporary' ? transitionStyles(theme) : {}),
    }
  },
);

export interface DoctorDashboardSidebarType {
  href: string;
  iconClass: string;
  title: string;
  hasFunction: boolean;
  clickFunction?: Function;
  subUrlForActivation: string[]
}

const DoctorDashboardSidebar: FC = (() => {
  const { bounce } = useScssVar();
  const router = useRouter()
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery('(max-width:991px)');
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value);
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;
  const homeSideBarOpen = useSelector((state: AppState) => state.homeSideBarOpen.value)


  const doctorsSideBarChildrens: DoctorDashboardSidebarType[] = useMemo(() => {
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

    }
    return [
      {
        href: "/doctors/dashboard",
        iconClass: "fas fa-columns",
        title: "Dashboard",
        hasFunction: false,
        subUrlForActivation: []
      },
      {
        href: "/doctors/dashboard/profile",
        iconClass: "fas fa-user-cog",
        title: "Profile Settings",
        hasFunction: false,
        subUrlForActivation: []
      },
      {
        href: "/doctors/dashboard/favourites",
        iconClass: "fas fa-bookmark",
        title: "Favourites",
        hasFunction: false,
        subUrlForActivation: []
      },
      {
        href: "/doctors/dashboard/appointments",
        iconClass: "fas fa-calendar-check",
        title: "Appointments",
        hasFunction: false,
        subUrlForActivation: []
      },
      {
        href: "/doctors/dashboard/my-patients",
        iconClass: "fas fa-user-injured",
        title: "My Patients",
        hasFunction: false,
        subUrlForActivation: []
      },
      {
        href: "/doctors/dashboard/schedule-timing",
        iconClass: "fas fa-hourglass-start",
        title: "Schedule Timings",
        hasFunction: false,
        subUrlForActivation: []
      },
      {
        href: "/doctors/dashboard/available-timing",
        iconClass: "fas fa-clock",
        title: "Available Timings",
        hasFunction: false,
        subUrlForActivation: []
      },
      {
        href: "/doctors/dashboard/invoice",
        iconClass: "fas fa-file-invoice",
        title: "Appointments / Invoices",
        hasFunction: false,
        subUrlForActivation: ["/doctors/dashboard/invoice-view"]
      },
      {
        href: "/doctors/dashboard/billings",
        iconClass: "fas fa-file-invoice",
        title: "Billings",
        hasFunction: false,
        subUrlForActivation: [
          '/doctors/dashboard/bill-view',
          '/doctors/dashboard/edit-billing',
          '/doctors/dashboard/add-billing'
        ]
      },
      {
        href: "/doctors/dashboard/account",
        iconClass: "fas fa-file-invoice-dollar",
        title: "Accounts",
        hasFunction: false,
        subUrlForActivation: []
      },
      {
        href: "/doctors/dashboard/review",
        iconClass: "fa-solid fa-comments",
        title: "Reviews",
        hasFunction: false,
        subUrlForActivation: []
      },
      {
        href: "/doctors/dashboard/rates",
        iconClass: "fas fa-star",
        title: "Rates",
        hasFunction: false,
        subUrlForActivation: []
      },
      {
        href: "/doctors/dashboard/chat-doctor",
        iconClass: "fas fa-comment-alt",
        title: "Message",
        hasFunction: false,
        subUrlForActivation: []
      },
      {
        href: "/doctors/dashboard/social-media",
        iconClass: "fas fa-share-alt",
        title: "Social Media",
        hasFunction: false,
        subUrlForActivation: []
      },
      userProfile?.services && userProfile?.services == 'password' ?
        {
          href: "/doctors/dashboard/doctor-change-password",
          iconClass: "fas fa-lock",
          title: "Change Password",
          hasFunction: false,
          subUrlForActivation: []
        } : null,
      {
        href: "",
        iconClass: "fas fa-sign-out-alt",
        title: "Logout",
        hasFunction: true,
        subUrlForActivation: [],
        clickFunction: logOut,
      },
    ].filter(isNotNull)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeSocket, router, userProfile?._id, userProfile?.services])

  useEffect(() => {
    if (hasCookie('homeMiniSidebarOpen')) {
      dispatch(updateHomeSideBarOpen(getCookie('homeMiniSidebarOpen')))
    } else {
      setCookie('homeMiniSidebarOpen', homeSideBarOpen)
    }
  }, [isMobile, dispatch, homeSideBarOpen])

  dayjs.extend(preciseDiff)

  //@ts-ignore
  let { years, months, days } = dayjs.preciseDiff(userProfile?.dob, dayjs(), true)
  const handlesidebar = () => {
    dispatch(updateHomeSideBarOpen(!homeSideBarOpen))
    setCookie('homeMiniSidebarOpen', !homeSideBarOpen)
  }

  return (
    <Fragment>
      <Drawer
        id="sidebar"
        variant="permanent"
        open={homeSideBarOpen}
      >
        <DrawerHeader open={homeSideBarOpen} />
        <List sx={{ paddingTop: 0 }}>
          <ListItem sx={{ paddingLeft: 0, paddingRight: 0 }}>
            <div className="profile-sidebar">
              <div className="widget-profile pro-widget-content">
                <div className="profile-info-widget">
                  <Link href="#" className={`booking-doc-img ${homeSideBarOpen ? "booking-doc-img-open" : 'booking-doc-img-close'}`} aria-label='book'>
                    <StyledBadge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                      variant="dot"
                      online={userProfile?.online!}
                      idle={userProfile?.lastLogin?.idle}
                    >
                      <Avatar className={`sidebar-avatar ${homeSideBarOpen ? 'sidebar-avatar-open' : 'sidebar-avatar-close'}`} alt="" src={`${userProfile?.profileImage}`} key={userProfile?.profileImage}>
                        <img src={doctors_profile} alt="" className="rounded-circle" />
                      </Avatar>
                    </StyledBadge>
                  </Link>
                  <div className={`${homeSideBarOpen ? 'profile-det-info-open' : "profile-det-info-close"}`}>
                    <OverflowTooltip text={`Dr. ${userProfile?.fullName}`} />
                    <OverflowTooltip text={userDoctorProfile?.specialities?.[0]?.specialities || ''} as="h2" />
                    <OverflowTooltip text={userProfile?.userName || ''} as="h3" />
                    <OverflowTooltip text={`${userProfile?.roleName?.charAt(0).toUpperCase()}${userProfile?.roleName.slice(1)}`} as="h3" />

                    <div className="patient-details-open">
                      <h4>
                        <i className="fas fa-birthday-cake"></i>&nbsp;&nbsp;
                        {userProfile?.dob !== '' ? dayjs(userProfile?.dob).format('DD MMM YYYY') : '---- -- --'}
                      </h4>
                      <OverflowTooltip
                        text={`${isNaN(years) ? '--' : years} years ${isNaN(months) ? '--' : months} months ${isNaN(days) ? '--' : days} days`}
                        as="h5"
                      />
                      <OverflowTooltip
                        text={`${`City: ${userProfile?.city}` || 'City: -----'}`}
                        as="h6"
                        className="mb-0 line-height-22"
                      />
                      <OverflowTooltip
                        text={`${`State: ${userProfile?.state}` || 'State: -----'}`}
                        as="h6"
                        className="mb-0 line-height-22"
                      />
                      <OverflowTooltip
                        text={`${`Country: ${userProfile?.country}` || 'Country: -----'}`}
                        as="h6"
                        className="mb-0 line-height-22"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ListItem>
          {doctorsSideBarChildrens.map((item: DoctorDashboardSidebarType, index: number) => {
            const isActiveLink = router.pathname == item.href || item.subUrlForActivation.some(pattern => new RegExp(pattern).test(router.pathname));

            return (
              <ListItem key={index} disablePadding sx={{
                display: 'block',
                transition: 'background-color 500ms ease-in-out',
                backgroundColor: homeSideBarOpen ? isActiveLink ? theme.palette.primary.main : '' : ''
              }}>
                <Tooltip arrow followCursor placement='right' title={homeSideBarOpen ? '' : item.title}>
                  <ListItemButton
                    onClick={() => {
                      if (!item.hasFunction) {
                        router.push(item.href, undefined, { shallow: true })
                      } else {
                        if (item.clickFunction) {
                          item.clickFunction();
                        }
                      }
                    }}
                    sx={{
                      minHeight: 48,
                      justifyContent: homeSideBarOpen ? 'initial' : 'center',
                      px: 2.5,
                      ":hover": {
                        background: getSelectedBackgroundColor(theme.palette.primary.main, theme.palette.mode)
                      }
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        marginRight: homeSideBarOpen ? 3 : 'auto',
                        justifyContent: 'center',
                        transition: 'margin-right 500ms ease-in-out, color 500ms ease-in-out',
                        color: homeSideBarOpen ? theme.palette.text.color : isActiveLink ? theme.palette.secondary.main : theme.palette.text.color
                      }}
                    >
                      <i className={item.iconClass} style={{ fontSize: '1rem' }}></i>
                    </ListItemIcon>
                    <ListItemText primary={item.title} sx={{
                      opacity: homeSideBarOpen ? 1 : 0,
                      visibility: homeSideBarOpen ? 'visible' : 'hidden',
                      transition: 'opacity 500ms ease-in-out',
                    }} />

                  </ListItemButton>
                </Tooltip>
              </ListItem>
            )
          })
          }
          <button className={`${homeSideBarOpen ? 'side-bar-toggle-button-open' : 'side-bar-toggle-button-close'}`}
            aria-label="side-bar-toggle-button" onClick={handlesidebar}></button>
        </List>
      </Drawer>
    </Fragment>
  )
});

export default DoctorDashboardSidebar;


interface OverflowTooltipProps extends HTMLAttributes<HTMLElement> {
  text: string;
  maxWidth?: number;
  as?: ElementType;
}

export const OverflowTooltip: FC<OverflowTooltipProps> = ({
  text,
  maxWidth = 200,
  as: Component = 'h1',
  ...props
}) => {
  const textRef = useRef<HTMLElement | null>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        setIsOverflowing(textRef.current.scrollWidth > textRef.current.clientWidth);
      }
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, []);

  return (
    <Tooltip title={isOverflowing ? text : ''} arrow>
      <Component
        ref={textRef}
        style={{
          display: "inline-block",
          maxWidth: `${maxWidth}px`,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          cursor: isOverflowing ? "pointer" : "default",
        }}
        {...props}
      >
        {text}
      </Component>
    </Tooltip>
  );
};
