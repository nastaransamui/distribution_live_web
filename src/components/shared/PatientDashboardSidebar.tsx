/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useMemo, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link'
import { patient_profile } from '@/public/assets/imagepath'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '@/redux/store'
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit'
import { toast } from 'react-toastify'
import { deleteCookie, getCookie, hasCookie, setCookie } from 'cookies-next'
import { updateHomeAccessToken } from '@/redux/homeAccessToken'
import dayjs from 'dayjs'
import preciseDiff from 'dayjs-precise-range'
import Avatar from '@mui/material/Avatar'
import { DoctorDashboardSidebarType, Drawer, DrawerHeader, OverflowTooltip } from './DoctorDashboardSidebar'
import { updateHomeSideBarOpen } from '@/redux/homeSideBarOpen'
import useMediaQuery from '@mui/material/useMediaQuery'
import { isNotNull } from './PatientBillingRecords'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip'
import { useTheme } from '@mui/material'
import { getSelectedBackgroundColor, StyledBadge } from "@/components/DoctorDashboardSections/ScheduleTiming"
import Version from './Version'
import { updateHomeExp } from '@/redux/homeExp'
import { updateHomeIAT } from '@/redux/homeIAT'
import { updateHomeRoleName } from '@/redux/homeRoleName'
import { updateHomeServices } from '@/redux/homeServices'
import { updateHomeUserId } from '@/redux/homeUserId'


const PatientDashboardSidebar: FC = (() => {
  const { bounce } = useScssVar();
  const router = useRouter()
  const dispatch = useDispatch();
  const theme = useTheme()
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value);
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;
  const homeSideBarOpen = useSelector((state: AppState) => state.homeSideBarOpen.value)
  const isMobile = useMediaQuery('(max-width:991px)');


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
              router.reload();
            }
          });
        }
      })

    }
    return [
      {
        href: "/patient/dashboard",
        iconClass: "fas fa-columns",
        title: "Dashboard",
        hasFunction: false,
        subUrlForActivation: ['/patient/dashboard/bmi-status', '/patient/dashboard/clinical-signs-history']
      },
      {
        href: "/patient/dashboard/profile",
        iconClass: "fas fa-user-cog",
        title: "Profile Settings",
        hasFunction: false,
        subUrlForActivation: []
      },
      {
        href: "/patient/dashboard/favourites",
        iconClass: "fas fa-bookmark",
        title: "Favourites",
        hasFunction: false,
        subUrlForActivation: []
      },
      {
        href: "/patient/dashboard/appointments",
        iconClass: "fas fa-calendar-check",
        title: "Appointments",
        hasFunction: false,
        subUrlForActivation: []
      },
      {
        href: "/patient/dashboard/invoice",
        iconClass: "fas fa-file-invoice",
        title: "Appointments / Invoices",
        hasFunction: false,
        subUrlForActivation: []
      },
      {
        href: "/patient/dashboard/billings",
        iconClass: "fas fa-file-invoice",
        title: "Billings",
        hasFunction: false,
        subUrlForActivation: ['/patient/dashboard/see-billing/', '/patient/dashboard/bill-view']
      },
      {
        href: "/patient/dashboard/dependent",
        iconClass: "fas fa-users",
        title: "Dependents",
        hasFunction: false,
        subUrlForActivation: []
      },
      {
        href: "/patient/dashboard/review",
        iconClass: "fa-solid fa-comments",
        title: "Reviews",
        hasFunction: false,
        subUrlForActivation: []
      },
      {
        href: "/patient/dashboard/rates",
        iconClass: "fas fa-star",
        title: "Rates",
        hasFunction: false,
        subUrlForActivation: []
      },
      {
        href: "/patient/dashboard/patient-chat",
        iconClass: "fas fa-comment-alt",
        title: "Message",
        hasFunction: false,
        subUrlForActivation: []
      },
      {
        href: "/patient/dashboard/orders",
        iconClass: "fas fa-list-alt",
        title: "Orders",
        hasFunction: false,
        subUrlForActivation: []
      },
      {
        href: "/patient/dashboard/medicalrecords",
        iconClass: "fas fa-clipboard",
        title: "Medical Records / Prescriptions",
        hasFunction: false,
        subUrlForActivation: ['/patient/dashboard/see-prescription/']
      },
      {
        href: "/patient/dashboard/medicaldetails",
        iconClass: "fas fa-file-medical-alt",
        title: "Medical Details",
        hasFunction: false,
        subUrlForActivation: []
      },
      userProfile?.services && userProfile?.services == 'password' ?
        {
          href: "/patient/dashboard/change-password",
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
        clickFunction: logOut,
        subUrlForActivation: []
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
                  <Link href="#" onClick={(e) => e.preventDefault()} className={`booking-doc-img ${homeSideBarOpen ? "booking-doc-img-open" : 'booking-doc-img-close'}`} aria-label='book'>
                    <StyledBadge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                      variant="dot"
                      online={userProfile?.online!}
                      idle={userProfile?.lastLogin?.idle}
                    >
                      <Avatar className={`sidebar-avatar ${homeSideBarOpen ? 'sidebar-avatar-open' : 'sidebar-avatar-close'}`} alt="" src={`${userProfile?.profileImage}`} key={userProfile?.profileImage}>
                        <img src={patient_profile} alt="" className="rounded-circle" />
                      </Avatar>
                    </StyledBadge>
                  </Link>
                  <div className={`${homeSideBarOpen ? 'profile-det-info-open' : "profile-det-info-close"}`}>
                    <OverflowTooltip text={`${userProfile?.gender == "" ? "" : `${userProfile?.gender}. `} ${userProfile?.fullName}`} />
                    <OverflowTooltip text={userProfile?.userName || ''} as="h3" />
                    <OverflowTooltip text={`${userProfile?.roleName?.charAt(0).toUpperCase()}${userProfile?.roleName?.slice(1)}`} as="h3" />

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
                        text={`${userProfile?.city !== "" ? `City: ${userProfile?.city}` : 'City: -----'}`}
                        as="h6"
                        className="mb-0 line-height-22"
                      />
                      <OverflowTooltip
                        text={`${userProfile?.state !== "" ? `State: ${userProfile?.state}` : 'State: -----'}`}
                        as="h6"
                        className="mb-0 line-height-22"
                      />
                      <OverflowTooltip
                        text={`${userProfile?.country !== "" ? `Country: ${userProfile?.country}` : 'Country: -----'}`}
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
                      transition: 'opacity 500ms ease-in-out, max-width 500ms ease-in-out, max-height 500ms ease-in-out',
                      whiteSpace: homeSideBarOpen ? "normal" : 'nowrap',
                      overflowWrap: 'break-word',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'block',
                      maxHeight: homeSideBarOpen ? '50px' : '0px',
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

        <Version />
      </Drawer>
    </Fragment >
  )
})

export default PatientDashboardSidebar;