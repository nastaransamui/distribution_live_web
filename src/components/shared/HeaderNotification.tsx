/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import { clinet01_scale, clinet02_scale, clinet05_scale, client04_scale } from '@/public/assets/imagepath';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material';

const HeaderNotification: FC = (() => {
  const { muiVar } = useScssVar();
  const router = useRouter();
  const theme = useTheme()



  return (
    <Fragment>
      <li className="nav-item dropdown noti-nav me-3 pe-0" style={muiVar}>
        <Link
          href="#"
          className="dropdown-toggle nav-link p-0"
          data-bs-toggle="dropdown"
        >
          <i className={`fa-solid fa-bell ${router.pathname == "/home4" ||
            router.pathname == "/eyecarehome"
            ? 'imgColorSecondary'
            : 'imgColorPrimary'}`} />
          <span id="badge-header-notification" className="badge" style={{ backgroundColor: router.pathname == "/home4" ? theme.palette.secondary.dark : theme.palette.secondary.dark }}>5</span>
        </Link>
        <div className="dropdown-menu notifications dropdown-menu-end ">
          <div className="topnav-dropdown-header">
            <span className="notification-title">Notifications</span>
          </div>
          <div className="noti-content">
            <ul className="notification-list">
              <li className="notification-message">
                <Link href="#">
                  <div className="media d-flex">
                    <span className="avatar">
                      <img
                        className="avatar-img"
                        alt=""
                        src={clinet01_scale}
                      />
                    </span>
                    <div className="media-body">
                      <h6>
                        Travis Tremble{" "}
                        <span className="notification-time">18.30 PM</span>
                      </h6>
                      <p className="noti-details">
                        Sent a amount of $210 for his Appointment{" "}
                        <span className="noti-title">Dr.Ruby perin </span>
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
              <li className="notification-message">
                <Link href="#">
                  <div className="media d-flex">
                    <span className="avatar">
                      <img
                        className="avatar-img"
                        alt=""
                        src={clinet02_scale}
                      />
                    </span>
                    <div className="media-body">
                      <h6>
                        Travis Tremble{" "}
                        <span className="notification-time">12 Min Ago</span>
                      </h6>
                      <p className="noti-details">
                        {" "}
                        has booked her appointment to{" "}
                        <span className="noti-title">Dr. Hendry Watt</span>
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
              <li className="notification-message">
                <Link href="#">
                  <div className="media d-flex">
                    <div className="avatar">
                      <img
                        className="avatar-img"
                        alt=""
                        src={clinet05_scale}
                      />
                    </div>
                    <div className="media-body">
                      <h6>
                        Travis Tremble{" "}
                        <span className="notification-time">6 Min Ago</span>
                      </h6>
                      <p className="noti-details">
                        {" "}
                        Sent a amount $210 for his Appointment{" "}
                        <span className="noti-title">Dr.Maria Dyen</span>
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
              <li className="notification-message">
                <Link href="#">
                  <div className="media d-flex">
                    <div className="avatar avatar-sm">
                      <img
                        className="avatar-img"
                        alt=""
                        src={client04_scale}
                      />
                    </div>
                    <div className="media-body">
                      <h6>
                        Travis Tremble{" "}
                        <span className="notification-time">8.30 AM</span>
                      </h6>
                      <p className="noti-details"> Send a message to his doctor</p>
                    </div>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </li>
    </Fragment>
  )
})

export default HeaderNotification;