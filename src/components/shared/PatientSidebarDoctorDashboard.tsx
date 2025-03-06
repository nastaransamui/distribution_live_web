/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useMemo } from 'react'
import Link from 'next/link';
import { patient_profile } from '@/public/assets/imagepath'

import { useTheme } from '@mui/material/styles';

import Avatar from '@mui/material/Avatar';
import dayjs from 'dayjs'
import preciseDiff from 'dayjs-precise-range'
import { getSelectedBackgroundColor, StyledBadge } from "@/components/DoctorDashboardSections/ScheduleTiming"
import { AppointmentReservationExtendType, DoctorPatientProfileTypes } from '../DoctorPatientProfile/DoctorPatientProfile';

import { AppState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { updateHomeSideBarOpen } from '@/redux/homeSideBarOpen';
import { hasCookie, getCookie, setCookie } from 'cookies-next';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DoctorDashboardSidebarType, Drawer, DrawerHeader, OverflowTooltip } from './DoctorDashboardSidebar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useRouter } from 'next/router';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip'


const PatientSidebarDoctorDashboard: FC<DoctorPatientProfileTypes> = (({ doctorPatientProfile }) => {
  const homeSideBarOpen = useSelector((state: AppState) => state.homeSideBarOpen.value)
  const dispatch = useDispatch();
  const isMobile = useMediaQuery('(max-width:991px)');
  const router = useRouter();
  dayjs.extend(preciseDiff)

  const theme = useTheme();
  const doctorsSideBarChildrens: DoctorDashboardSidebarType[] = useMemo(() => {

    return [
      router.pathname.startsWith('/doctors/dashboard/patient-profile/') ? {
        href: "/doctors/dashboard",
        iconClass: "fas fa-columns",
        title: "Main Dashboard",
        hasFunction: false,
        subUrlForActivation: ['/doctors/dashboard/patient-profile/']
      } :
        {
          href: `/doctors/dashboard/patient-profile/${btoa(doctorPatientProfile?._id)}`,
          iconClass: "fas fa-columns",
          title: "Patient Dashboard",
          hasFunction: false,
          subUrlForActivation: ['/doctors/dashboard/add-prescription/', 'doctors/dashboard/editprescription/']
        },
    ]

  }, [doctorPatientProfile?._id, router.pathname])

  useEffect(() => {
    if (hasCookie('homeMiniSidebarOpen')) {
      dispatch(updateHomeSideBarOpen(getCookie('homeMiniSidebarOpen')))
    } else {
      setCookie('homeMiniSidebarOpen', homeSideBarOpen)
    }
  }, [isMobile, dispatch, homeSideBarOpen])


  //@ts-ignore
  let { years, months, days } = dayjs.preciseDiff(doctorPatientProfile?.dob, dayjs(), true)

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
                      online={doctorPatientProfile?.online}
                      idle={doctorPatientProfile?.lastLogin?.idle}
                    >
                      <Avatar alt="" src={`${doctorPatientProfile?.profileImage}`} className={`sidebar-avatar ${homeSideBarOpen ? 'sidebar-avatar-open' : 'sidebar-avatar-close'}`}>
                        <img src={patient_profile} alt="" />
                      </Avatar>
                    </StyledBadge>
                  </Link>
                  <div className={`${homeSideBarOpen ? 'profile-det-info-open' : "profile-det-info-close"}`}>
                    <OverflowTooltip text={`${doctorPatientProfile?.gender == "" ? "" : `${doctorPatientProfile?.gender}. `} ${doctorPatientProfile?.fullName}`} />
                    <OverflowTooltip text={`Patient ID : #${doctorPatientProfile?.id}` || ''} as="h3" />

                    <div className="patient-details-open">
                      <h4>
                        <i className="fas fa-birthday-cake"></i>&nbsp;&nbsp;
                        {doctorPatientProfile?.dob !== '' ? dayjs(doctorPatientProfile?.dob).format('DD MMM YYYY') : '---- -- --'}
                      </h4>
                      <OverflowTooltip
                        text={`${isNaN(years) ? '--' : years} years ${isNaN(months) ? '--' : months} months ${isNaN(days) ? '--' : days} days`}
                        as="h5"
                      />
                      <OverflowTooltip
                        text={`${`City: ${doctorPatientProfile?.city}` || 'City: -----'}`}
                        as="h6"
                        className="mb-0 line-height-30"
                      />
                      <OverflowTooltip
                        text={`${`State: ${doctorPatientProfile?.state}` || 'State: -----'}`}
                        as="h6"
                        className="mb-0 line-height-30"
                      />
                      <OverflowTooltip
                        text={`${`Country: ${doctorPatientProfile?.country}` || 'Country: -----'}`}
                        as="h6"
                        className="mb-0 line-height-30"
                      />
                      <OverflowTooltip
                        text={`${`Phone: ${doctorPatientProfile?.mobileNumber}` || 'Phone: -----'}`}
                        as="h6"
                        className="mb-0 line-height-30"
                      />
                      <OverflowTooltip
                        text={`${`Blood Group: ${doctorPatientProfile?.bloodG !== '' ? `🩸   ${doctorPatientProfile.bloodG}` : '-----------'}` || 'Blood Group: -----'}`}
                        as="h6"
                        className="mb-0 line-height-30"
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

          {doctorPatientProfile?.lastTwoAppointments.length > 0 &&
            <ListItem disablePadding sx={{
              display: 'block',
              transition: 'background-color 500ms ease-in-out',
            }}>
              <ListItemButton sx={{

                visibility: homeSideBarOpen ? 'visible' : "hidden",
                transition: 'visibility 500ms ease-in-out, background 500ms ease-in-out',
              }}>
                <ListItemText inset primary='Last Booking' sx={{
                  opacity: homeSideBarOpen ? 1 : 0,
                  visibility: homeSideBarOpen ? 'visible' : 'hidden',
                  transition: 'opacity 500ms ease-in-out',
                }} />
              </ListItemButton>
            </ListItem>
          }
          {
            doctorPatientProfile?.lastTwoAppointments.length > 0 &&
            doctorPatientProfile?.lastTwoAppointments
              .map((appointment: AppointmentReservationExtendType, index: number) => {
                const drName = `Dr. ${appointment?.doctorProfile?.firstName} ${appointment?.doctorProfile?.lastName}`
                let { specialities } = appointment?.doctorProfile
                return (
                  <Fragment key={appointment.createdDate.toString()}>
                    <ListItemText sx={{
                      padding: 3,
                      margin: 1,
                      border: `1px solid ${theme.palette.secondary.main}`,
                      opacity: homeSideBarOpen ? 1 : 0,
                      visibility: homeSideBarOpen ? 'visible' : 'hidden',
                      transition: 'opacity 500ms ease-in-out',
                    }} >
                      <div className="media align-items-center d-flex">
                        <div className="media-body flex-grow-1">
                          <h5 className="d-block mb-0">
                            <Link aria-label='search' target='_blank' href={`/doctors/profile/${btoa(appointment?.doctorId)}`}
                              style={{ color: theme.palette.secondary.main, maxWidth: '70%', minWidth: '70%' }}>
                              {drName}
                            </Link>
                          </h5>
                          <Typography sx={{ color: theme.palette.primary.main }} variant="caption" display="block" gutterBottom>{dayjs(appointment?.createdDate).format('YYYY MMM DD HH:mm')}</Typography>
                          <span className="d-block text-sm text-muted">
                            {specialities?.[0]?.specialities}
                          </span>
                          <span className="d-block text-sm text-muted">
                            {dayjs(appointment?.selectedDate).format('DD MMM YYYY')} {' '} {appointment?.timeSlot?.period}
                          </span>
                          <span className="d-block text-sm text-muted">

                            <Link href={`/doctors/dashboard/invoice-view/${btoa(appointment?._id!)}`} >{appointment?.invoiceId}</Link>
                          </span>
                        </div>
                      </div>
                    </ListItemText>
                  </Fragment>
                )
              })
          }
          <button className={`${homeSideBarOpen ? 'side-bar-toggle-button-open side-bar-toggle-doctor-patient-button-open' : 'side-bar-toggle-button-close side-bar-toggle-doctor-patient-button-close'}`}
            aria-label="side-bar-toggle-button" onClick={handlesidebar}></button>
        </List>
      </Drawer>
    </Fragment>
  )
});

export default PatientSidebarDoctorDashboard;