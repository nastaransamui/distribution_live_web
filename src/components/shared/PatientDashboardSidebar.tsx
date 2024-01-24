/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link'
import StickyBox from 'react-sticky-box'
import { patient_profile } from '@/public/assets/imagepath'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '@/redux/store'
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit'
import { toast } from 'react-toastify'
import { deleteCookie } from 'cookies-next'
import { updateHomeAccessToken } from '@/redux/homeAccessToken'
import dayjs from 'dayjs'
import preciseDiff from 'dayjs-precise-range'
import Avatar from '@mui/material/Avatar'



const PatientDashboardSidebar: FC = (() => {
  const { muiVar, bounce } = useScssVar();
  const router = useRouter()
  const dispatch = useDispatch();
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value);
  const userProfile = useSelector((state: AppState) => state.userProfile.value)


  dayjs.extend(preciseDiff)

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
        dispatch(updateHomeAccessToken(null))
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
                <Link href="#0" className="booking-doc-img">
                  <Avatar alt="" src={`${userProfile?.profileImage}`} sx={{ width: "120px", height: '120px' }} key={userProfile?.profileImage}>
                    <img src={patient_profile} alt="" />
                  </Avatar>
                </Link>
                <div className="profile-det-info">
                  <h3>{userProfile?.firstName} {userProfile?.lastName}</h3>
                  <h6>{userProfile?.userName}</h6>
                  <h6>{`${userProfile?.roleName?.charAt(0).toUpperCase()}${userProfile?.roleName.slice(1)}`}</h6>
                  <div className="patient-details">
                    <h5>
                      <i className="fas fa-birthday-cake"></i>
                      {userProfile?.dob !== '' ? dayjs(userProfile?.dob).format('DD MMM YYYY') : '---- -- --'}
                    </h5>
                    <h6>{`${isNaN(years) ? '--' : years} years ${isNaN(months) ? '--' : months} months ${isNaN(days) ? '--' : days} days`}</h6>
                    <h5 className="mb-0"><i className="fas fa-map-marker-alt"></i>{userProfile?.city} <br />{userProfile?.state} <br />{userProfile?.country}</h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="dashboard-widget">
              <nav className="dashboard-menu">
                <ul>
                  <li className={router.pathname.endsWith("/dashboard") ? "active" : ""}>
                    <Link href="/patient/dashboard">
                      <i className="fas fa-columns"></i>
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li className={router.pathname.includes("/favourites") ? "active" : ""}>
                    <Link href="/patient/dashboard/favourites">
                      <i className="fas fa-bookmark"></i>
                      <span>Favourites</span>
                    </Link>
                  </li>
                  <li className={router.pathname.includes("/dependent") ? "active" : ""}>
                    <Link href="/patient/dashboard/dependent">
                      <i className="fas fa-users"></i>
                      <span>Dependent</span>
                    </Link>
                  </li>
                  <li className={router.pathname.includes("/chat-doctor") ? "active" : ""}>
                    <Link href="/patient/dashboard/patient-chat">
                      <i className="fas fa-comments"></i>
                      <span>Message</span>
                      <small className="unread-msg">23</small>
                    </Link>
                  </li>
                  <li className={router.pathname.includes("/orders") ? "active" : ""}>
                    <Link href="/patient/dashboard/orders">
                      <i className="fas fa-list-alt"></i>
                      <span>Orders</span>
                      <small className="unread-msg">7</small>
                    </Link>
                  </li>
                  <li className={router.pathname.includes("/medicalrecords") ? "active" : ""}>
                    <Link href="/patient/dashboard/medicalrecords">
                      <i className="fas fa-clipboard"></i>
                      <span>Add Medical Records</span>
                    </Link>
                  </li>
                  <li className={router.pathname.includes("/medicaldetails") ? "active" : ""}>
                    <Link href="/patient/dashboard/medicaldetails">
                      <i className="fas fa-file-medical-alt"></i>
                      <span>Medical Details</span>
                    </Link>
                  </li>
                  <li className={router.pathname.includes("/profile") ? "active" : ""}>
                    <Link href="/patient/dashboard/profile">
                      <i className="fas fa-user-cog"></i>
                      <span>Profile Settings</span>
                    </Link>
                  </li>
                  <li className={router.pathname.includes("/change-password") ? "active" : ""}>
                    <Link href="/patient/dashboard/change-password">
                      <i className="fas fa-lock"></i>
                      <span>Change Password</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="" onClick={(e) => {
                      e.preventDefault();
                      logOut();
                    }}>
                      <i className="fas fa-sign-out-alt"></i>
                      <span>Logout</span>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

          </div>
        </StickyBox>
      </div >
    </Fragment >
  )
})

export default PatientDashboardSidebar;