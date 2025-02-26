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


                <div className="card widget-profile pat-widget-profile" style={{ border: 'none', borderRadius: 'unset' }}>
                  <div className="card-body">
                    <div className="pro-widget-content">
                      <div className="profile-info-widget">
                        <Link aria-label='patient' href="" className="booking-doc-img" onClick={(e) => e.preventDefault()}>
                          <Avatar alt="" src={`${doctorPatientProfile?.profileImage}`} sx={{ width: "120px", height: '120px' }} key={doctorPatientProfile?.profileImage}>
                            <img src={patient_profile} alt="" />
                          </Avatar>
                        </Link>
                        <div className="profile-det-info">
                          <h3>
                            {doctorPatientProfile?.gender == "" ? "" : `${doctorPatientProfile?.gender}. `}
                            {doctorPatientProfile?.fullName}
                          </h3>

                          <div className="patient-details">
                            <h4>
                              <b>Patient ID :</b> #{doctorPatientProfile?.id}
                            </h4>
                            <h5>
                              <i className="fas fa-birthday-cake"></i>
                              {doctorPatientProfile?.dob !== '' ? dayjs(doctorPatientProfile?.dob).format('DD MMM YYYY') : '---- -- --'}
                            </h5>
                            <h5>{`${isNaN(years) ? '--' : years} years ${isNaN(months) ? '--' : months} months ${isNaN(days) ? '--' : days} days`}</h5>
                            <h6 className="mb-0" style={{ display: 'flex', justifyContent: 'center', gap: 20, alignItems: 'center' }}>
                              <i className="fas fa-map-marker-alt"></i>
                              <span style={{ textAlign: 'left' }}>
                                {doctorPatientProfile?.city !== "" ? `City: ${doctorPatientProfile?.city}` : `City: -----`} <br />
                                {doctorPatientProfile?.state !== "" ? `State: ${doctorPatientProfile?.state}` : `State: -----`} <br />
                                {doctorPatientProfile?.country !== "" ? `Country: ${doctorPatientProfile?.country}` : `Country: -----`}
                              </span>
                            </h6>
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
                          Blood Group <span>{doctorPatientProfile?.bloodG !== '' ? `🩸   ${doctorPatientProfile.bloodG}` : '-----------'}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ border: 'none' }}>
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
                                    <Link aria-label='search' className="avatar mx-2" target='_blank' href={`/doctors/search/${btoa(appointment?.doctorId)}`}>
                                      <StyledBadge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        variant="dot"
                                        online={online}
                                      >
                                        <Avatar sx={{ width: `3rem`, height: `3rem` }} alt=""
                                          src={`${profileImage}`} key={profileImage}
                                        >
                                          <img src={patient_profile} alt="" className="avatar" />
                                        </Avatar>
                                      </StyledBadge>
                                    </Link>
                                  </div>
                                  <div className="media-body flex-grow-1">
                                    <h5 className="d-block mb-0">
                                      <Link aria-label='search' target='_blank' href={`/doctors/search/${btoa(appointment?.doctorId)}`}
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

                                      <Link href={`/doctors/invoice-view/${btoa(appointment?._id!)}`} target='_blank'>{appointment?.invoiceId}</Link>
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