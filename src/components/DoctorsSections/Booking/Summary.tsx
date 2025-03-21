/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import { doctors_profile } from '@/public/assets/imagepath';
import { DoctorProfileType } from '@/components/SearchDoctorSections/SearchDoctorSection';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import { BookingDoctorProfile } from './BookingPage';

import { FiThumbsUp } from 'react-icons/fi';
import { StyledBadge } from '@/components/DoctorDashboardSections/ScheduleTiming';


const Summary: FC<{ profile: BookingDoctorProfile }> = (({ profile }) => {
  const { muiVar } = useScssVar();

  return (
    <Fragment>
      <div className="col-lg-12 col-md-12" style={muiVar}>
        <div className="card">
          <div className="card-body">
            <div className="booking-doc-info">
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                variant="dot"
                online={profile.online as boolean}
                idle={profile.lastLogin?.idle}
              >
                <Avatar sx={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '5px',
                  marginRight: '18px',
                  transition: 'all 2000ms cubic-bezier(0.19, 1, 0.22, 1) 0ms',
                  "&:hover": {
                    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                    transform: "scale(1.15)",
                  },
                }} variant="square" alt="" src={profile?.profileImage}
                  key={profile?.profileImage}
                >
                  <img className="img-fluid" src={doctors_profile} alt="" />
                </Avatar>
              </StyledBadge>
              <div className="booking-info">
                <h1 style={{ fontSize: '18px' }}>
                  <Link href={`/doctors/profile/${btoa(profile?._id)}`} target='_blank'>
                    Dr. {profile?.fullName}
                  </Link>
                </h1>
                <p className="doc-speciality">
                  {profile?.specialities?.[0]?.specialities}
                </p>
                <span style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                  <Rating name="read-only" precision={0.5} value={profile?.rate_array.length == 0 ? 0 : (profile?.rate_array.reduce((acc, num) => acc + num, 0) / profile?.rate_array.length)} readOnly size='small' />
                  <span className="d-inline-block average-rating" style={{ marginLeft: '6px' }}>({profile?.rate_array.length})</span>
                </span>
                <span className="d-inline-block average-rating" >
                  <FiThumbsUp style={{ marginBottom: 5 }} />&nbsp; {`${profile?.recommendArray && profile?.recommendArray.length !== 0
                    ? ((profile?.recommendArray.filter(vote => vote === 1).length / profile?.recommendArray?.length) * 100).toFixed(0)
                    : `0`}%`}{" "}

                  <span className="votes">({profile?.recommendArray ? profile?.recommendArray?.length : 0} Votes)</span>
                </span>
                <p className="text-muted mb-0">
                  <i className="fas fa-map-marker-alt"></i> &nbsp;
                  {profile?.city}  {profile?.country}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="booking-header">
          <h4 className="booking-title">Booking Summary</h4>
        </div>
        <div className="card booking-card">
          <div className="card-body booking-card-body">
            <div className="booking-doctor-details">
              <div className="booking-doctor-left">
                <div className="booking-doctor-img">
                  <Link href="/doctors/search">
                    <img src={doctor_17} alt="" />
                  </Link>
                </div>
                <div className="booking-doctor-info">
                  <h4><Link href="/doctors/search">Dr. John Doe</Link></h4>
                  <p>MBBS, Dentist</p>
                </div>
              </div>
              <div className="booking-doctor-right">
                <p>
                  <i className="fas fa-check-circle" />
                  <Link href="/patient/profile">Edit</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="card booking-card">
          <div className="card-body booking-card-body">
            <div className="booking-doctor-details">
              <div className="booking-device">
                <div className="booking-device-img">
                  <DeviceMessageSvg />
                </div>
                <div className="booking-doctor-info">
                  <h3>We can help you</h3>
                  <p className="device-text">Call us +1 888-888-8888 (or) chat with our customer support team.</p>
                  <Link href="/patient/patient-chat" className="btn">Chat With Us</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card booking-card mb-0">
          <div className="card-body booking-card-body">
            <div className="booking-doctor-details">
              <div className="booking-device">
                <div className="booking-device-img">
                  <SmartPhoneSvg />
                </div>
                <div className="booking-doctor-info">
                  <h3>Get the App</h3>
                  <p className="device-text">Download our app for better experience and for more feature</p>
                  <div className="app-images">
                    <Link href="#">
                      <GoogleImgSvg />
                    </Link>
                    <Link href="#">
                      <AppImgSvg />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </Fragment>
  )
});

export default Summary;