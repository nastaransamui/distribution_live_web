/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useState } from 'react'
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


const DoctorDashboardSidebar: FC = (() => {
  const { muiVar, bounce } = useScssVar();
  const router = useRouter()

  const dispatch = useDispatch();
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value);
  // const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;



  dayjs.extend(preciseDiff)
  const logOut = () => {
    dispatch(updateHomeFormSubmit(true))
    dispatch(updateHomeAccessToken(null))

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
        // dispatch(updateHomeAccessToken(null))
      }
    })
  }
  //@ts-ignore
  let { years, months, days } = dayjs.preciseDiff(userProfile?.dob, dayjs(), true)

  return (
    <Fragment>
      <div className="col-md-5 col-lg-4 col-xl-3 theiaStickySidebar" style={muiVar}>
        <StickyBox offsetTop={20} offsetBottom={20}>
          <div className="profile-sidebar">
            <div className="widget-profile pro-widget-content">
              <div className="profile-info-widget">
                <Link href="#" className="booking-doc-img" aria-label='book'>
                  <Avatar alt="" src={`${userProfile?.profileImage}`} sx={{ width: "120px", height: '120px' }}>
                    <img src={doctors_profile} alt="" />
                  </Avatar>
                </Link>
                <div className="profile-det-info">
                  <h1>Dr. {userProfile?.firstName} {userProfile?.lastName}</h1>
                  <h2>{userDoctorProfile?.specialities?.[0]?.specialities}</h2>
                  <h3>{userProfile?.userName}</h3>
                  <h3>{`${userProfile?.roleName?.charAt(0).toUpperCase()}${userProfile?.roleName.slice(1)}`}</h3>
                  <div className="patient-details">
                    <h4>
                      <i className="fas fa-birthday-cake"></i>
                      {userProfile?.dob !== '' ? dayjs(userProfile?.dob).format('DD MMM YYYY') : '---- -- --'}
                    </h4>
                    <h5>{`${isNaN(years) ? '--' : years} years ${isNaN(months) ? '--' : months} months ${isNaN(days) ? '--' : days} days`}</h5>
                    <h6 className="mb-0" style={{ display: 'flex', justifyContent: 'center', gap: 20, alignItems: 'center' }}>
                      <i className="fas fa-map-marker-alt"></i>
                      <span style={{ textAlign: 'left' }}>
                        {userProfile?.city !== "" ? `City: ${userProfile?.city}` : `City: -----`} <br />
                        {userProfile?.state !== "" ? `State: ${userProfile?.state}` : `State: -----`} <br />
                        {userProfile?.country !== "" ? `Country: ${userProfile?.country}` : `Country: -----`}
                      </span>
                    </h6>
                  </div>
                </div>
              </div>
            </div>
            <div className="dashboard-widget">
              <nav className="dashboard-menu">
                <ul>
                  <li className={router.pathname == "/doctors/dashboard" ? "active" : ""}>
                    <Link href="/doctors/dashboard" replace>
                      <i className="fas fa-columns" />
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li className={router.pathname == "/doctors/dashboard/profile" ? "active" : ""}>
                    <Link href="/doctors/dashboard/profile">
                      <i className="fas fa-user-cog" />
                      <span>Profile Settings</span>
                    </Link>
                  </li>
                  <li className={router.pathname == "/doctors/dashboard/favourites" ? "active" : ""}>
                    <Link href="/doctors/dashboard/favourites">
                      <i className="fas fa-bookmark"></i>
                      <span>Favourites</span>
                    </Link>
                  </li>
                  <li className={router.pathname == "/doctors/dashboard/appointments" ? "active" : ""}>
                    <Link href="/doctors/dashboard/appointments">
                      <i className="fas fa-calendar-check" />
                      <span>Appointments</span>
                    </Link>
                  </li>
                  <li className={router.pathname == "/doctors/dashboard/my-patients" ? "active" : ""}>
                    <Link href="/doctors/dashboard/my-patients">
                      <i className="fas fa-user-injured" />
                      <span>My Patients</span>
                    </Link>
                  </li>
                  <li className={router.pathname == "/doctors/dashboard/schedule-timing" ? "active" : ""}>
                    {/* <Link href={`/doctors/dashboard/schedule-timing?filters=${btoa(JSON.parse({ limit: 5, skip: 0 }))}`}> */}
                    <Link href={{ pathname: "/doctors/dashboard/schedule-timing", query: { filters: btoa(JSON.stringify({ limit: 5, skip: 0 })) } }} >
                      <i className="fas fa-hourglass-start" />
                      <span>Schedule Timings</span>
                    </Link>
                  </li>
                  <li className={router.pathname == "/doctors/dashboard/available-timing" ? "active" : ""}>
                    <Link href="/doctors/dashboard/available-timing">
                      <i className="fas fa-clock" />
                      <span>Available Timings</span>
                    </Link>
                  </li>
                  <li className={router.pathname == "/doctors/dashboard/invoice" ? "active" : ""}>
                    <Link href="/doctors/dashboard/invoice">
                      <i className="fas fa-file-invoice" />
                      <span>Appointments / Invoices</span>
                    </Link>
                  </li>
                  <li className={router.pathname == "/doctors/dashboard/billings" ? "active" : ""}>
                    <Link href="/doctors/dashboard/billings">
                      <i className="fas fa-file-invoice" />
                      <span>Billings</span>
                    </Link>
                  </li>
                  <li className={router.pathname == "/doctors/dashboard/account" ? "active" : ""}>
                    <Link href="/doctors/dashboard/account">
                      <i className="fas fa-file-invoice-dollar" />
                      <span>Accounts</span>
                    </Link>
                  </li>
                  <li className={router.pathname == "/doctors/dashboard/review" ? "active" : ""}>
                    <Link href="/doctors/dashboard/review">
                      <i className="fa-solid fa-comments"></i>
                      <span>Reviews</span>
                    </Link>
                  </li>
                  <li className={router.pathname == "/doctors/dashboard/rate" ? "active" : ""}>
                    <Link href="/doctors/dashboard/rates">
                      <i className="fas fa-star" />
                      <span>Rates</span>
                    </Link>
                  </li>
                  <li className={router.pathname == "/doctors/dashboard/chat-doctor" ? "active" : ""}>
                    <Link href="/doctors/dashboard/chat-doctor">
                      <i className="fas fa-comment-alt"></i>
                      <span>Message</span>
                      <small className="unread-msg">23</small>
                    </Link>
                  </li>
                  <li className={router.pathname == "/doctors/dashboard/social-media" ? "active" : ""}>
                    <Link href="/doctors/dashboard/social-media">
                      <i className="fas fa-share-alt" />
                      <span>Social Media</span>
                    </Link>
                  </li>
                  {userProfile?.services && userProfile?.services == 'password' && <li className={router.pathname == "/doctors/dashboard/doctor-change-password" ? "active" : ""}>
                    <Link href="/doctors/dashboard/doctor-change-password">
                      <i className="fas fa-lock" />
                      <span>Change Password</span>
                    </Link>
                  </li>}
                  <li className={router.pathname == "/home" ? "active" : ""}>
                    <Link href="" onClick={(e) => {
                      e.preventDefault();
                      logOut()
                    }}>
                      <i className="fas fa-sign-out-alt" />
                      <span>Logout</span>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </StickyBox>
      </div>
    </Fragment>
  )
});

export default DoctorDashboardSidebar;