/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useState, useEffect } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import { patient_profile, doctor_17, doctor_14 } from '@/public/assets/imagepath'

import { useTheme } from '@mui/material/styles';

import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
import { PatientProfile } from '../DoctorDashboardSections/MyPtients';
import Avatar from '@mui/material/Avatar';
import dayjs from 'dayjs'
import preciseDiff from 'dayjs-precise-range'
import { AppointmentReservationExtendType, DoctorPatientProfileTypes } from '../DoctorPatientProfile/DoctorPatientProfile';
import { StyledBadge } from '../DoctorDashboardSections/ScheduleTiming';
import Typography from '@mui/material/Typography';


const PatientSidebarDoctorDashboard: FC<DoctorPatientProfileTypes> = (({ doctorPatientProfile }) => {

  dayjs.extend(preciseDiff)

  const { muiVar } = useScssVar();

  const theme = useTheme();


  //@ts-ignore
  let { years, months, days } = dayjs.preciseDiff(doctorPatientProfile?.dob, dayjs(), true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <Fragment>
      <div className="col-md-5 col-lg-4 col-xl-3 theiaStickySidebar" style={muiVar}>
        {
          doctorPatientProfile == null ?
            <CircleToBlockLoading color={theme.palette.primary.main} size="small" style={{
              minWidth: '100%',
              display: 'flex',
              justifyContent: 'center',
            }} /> :
            <>
              <div className="profile-sidebar">


                <div className="card widget-profile pat-widget-profile">
                  <div className="card-body">
                    <div className="pro-widget-content">
                      <div className="profile-info-widget">
                        <Link href="" className="booking-doc-img" onClick={(e) => e.preventDefault()}>
                          <Avatar alt="" src={`${doctorPatientProfile?.profileImage}${isClient ? `?random=${new Date().getTime()}` : ''}`} sx={{ width: "120px", height: '120px' }} key={doctorPatientProfile?.profileImage}>
                            <img src={patient_profile} alt="" />
                          </Avatar>
                        </Link>
                        <div className="profile-det-info">
                          <h3>{doctorPatientProfile?.gender} {doctorPatientProfile?.firstName} {doctorPatientProfile?.lastName}</h3>

                          <div className="patient-details">
                            <h5>
                              <b>Patient ID :</b> #{doctorPatientProfile?._id}
                            </h5>
                            <h5>
                              <i className="fas fa-birthday-cake"></i>
                              {doctorPatientProfile?.dob !== '' ? dayjs(doctorPatientProfile?.dob).format('DD MMM YYYY') : '---- -- --'}
                            </h5>
                            <h6>{`${isNaN(years) ? '--' : years} years ${isNaN(months) ? '--' : months} months ${isNaN(days) ? '--' : days} days`}</h6>
                            <h5 className="mb-0"><i className="fas fa-map-marker-alt"></i>{doctorPatientProfile?.city} <br />{doctorPatientProfile?.state} <br />{doctorPatientProfile?.country}</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="patient-info">
                      <ul>
                        <li>
                          Phone <span>{doctorPatientProfile?.mobileNumber}</span>
                        </li>
                        <li>
                          Blood Group <span>{doctorPatientProfile?.bloodG}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="card">
                  {doctorPatientProfile?.lastTwoAppointments.length > 0 && <div className="card-header">
                    <h4 className="card-title">Last Booking</h4>
                  </div>}
                  <ul className="list-group list-group-flush">
                    {
                      doctorPatientProfile?.lastTwoAppointments.length > 0 &&
                      doctorPatientProfile?.lastTwoAppointments
                        .map((appointment: AppointmentReservationExtendType, index: number) => {
                          const drName = `Dr. ${appointment?.doctorProfile?.firstName} ${appointment?.doctorProfile?.lastName}`
                          let online = appointment?.doctorProfile?.online
                          let { profileImage, specialities } = appointment?.doctorProfile
                          return (
                            <Fragment key={appointment.createdDate.toString()}>
                              <li className="list-group-item">
                                <div className="media align-items-center d-flex">
                                  <div className="me-3 flex-shrink-0">
                                    <Link className="avatar mx-2" target='_blank' href={`/doctors/profile/${btoa(appointment?.doctorId)}`}>
                                      <StyledBadge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        variant="dot"
                                        online={online}
                                      >
                                        <Avatar sx={{ width: `3rem`, height: `3rem` }} alt=""
                                          src={`${profileImage}${isClient ? `?random=${new Date().getTime()}` : ''}`} key={profileImage}
                                        >
                                          <img src={patient_profile} alt="" className="avatar" />
                                        </Avatar>
                                      </StyledBadge>
                                    </Link>
                                  </div>
                                  <div className="media-body flex-grow-1">
                                    <h5 className="d-block mb-0">
                                      <Link target='_blank' href={`/doctors/profile/${btoa(appointment?.doctorId)}`}
                                        style={{ color: theme.palette.secondary.main, maxWidth: '70%', minWidth: '70%' }}>
                                        {drName}
                                      </Link>
                                    </h5>
                                    <Typography sx={{ color: theme.palette.primary.main }} variant="caption" display="block" gutterBottom>{dayjs(appointment?.createdDate).format('YYYY MMM DD HH:mm')}</Typography>
                                    <span className="d-block text-sm text-muted">
                                      {specialities?.[0]?.specialities}
                                    </span>
                                    <span className="d-block text-sm text-muted">
                                      {appointment?.selectedDate} {' '} {appointment?.timeSlot?.period}
                                    </span>
                                  </div>
                                </div>
                              </li>
                            </Fragment>
                          )
                        })
                    }
                  </ul>
                </div>
              </div>
            </>
        }
      </div>
    </Fragment>
  )
});

export default PatientSidebarDoctorDashboard;