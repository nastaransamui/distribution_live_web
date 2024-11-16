/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect } from 'react'
import Link from 'next/link'
import AOS from 'aos'
import FeatherIcon from "feather-icons-react";
import { logo } from '../../../public/assets/imagepath'
import useScssVar from '@/hooks/useScssVar';
import { useRouter } from 'next/router';


//Mui
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';

//redux
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';


const Footer: FC = (() => {
  const { muiVar } = useScssVar();
  const router = useRouter();
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);

  const userProfile = useSelector((state: AppState) => state.userProfile.value)


  const exclusionArray = [
    "/pages/doctor-grid",
    "/pages/doctor-list",
    "/pages/video-call",
    "/pages/voice-call",
    "/pages/chat-doctor",
    "/patient/doctor-list",
    "/patient/doctor-grid",
  ];
  if (exclusionArray.indexOf(router.pathname) >= 0) {
    return "";
  }
  return (
    <Fragment>
      {
        (!router.pathname.includes("/home6") && !router.pathname.includes("/home7") && !router.pathname.includes("/paediatrichome")) &&
        (!router.pathname.includes("/home6") && !router.pathname.includes("/home7") && !router.pathname.includes("/home8")) &&
        <footer className="footer footer-one" style={muiVar}>
          <div className="footer-top">
            <div className="container">
              <div className="row">
                <div className="col-lg-3 col-md-4">
                  <div className="footer-widget footer-about">
                    <div className="footer-logo">
                      <img src={logo} alt="logo" style={{
                        maxWidth: "100px",
                        height: 'auto'
                      }} />
                    </div>
                    <div className="footer-about-content">
                      <p>
                        On line panel for health care and doctors and patients
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 col-md-4">
                  <div className="footer-widget footer-menu">
                    <h2 className="footer-title">For Patients</h2>
                    <ul>
                      <li>
                        <Link href="/patient/dashboard/patient-chat">Chat</Link>
                      </li>
                      <li>
                        <Link href="/doctors">Search for Doctors</Link>
                      </li>
                      {userProfile == null ?
                        <><li>
                          <Link href="/login">Login</Link>
                        </li>
                          <li>
                            <Link href="/register">Register</Link>
                          </li></> :
                        <>
                          {userProfile?.roleName == 'patient' &&
                            <li>
                              <Link href="/patient/dashboard">Dashboard</Link>
                            </li>
                          }
                        </>
                      }
                    </ul>
                  </div>
                </div>
                <div className="col-lg-2 col-md-4">
                  <div className="footer-widget footer-menu">
                    <h2 className="footer-title">For Doctors</h2>
                    <ul>
                      <li>
                        <Link href="/doctors/dashboard/appointments">Appointments</Link>
                      </li>
                      <li>
                        <Link href="/doctors/dashboard/chat-doctor">Chat</Link>
                      </li>
                      {userProfile == null ?
                        <><li>
                          <Link href="/login">Login</Link>
                        </li>
                          <li>
                            <Link href="/register">Register</Link>
                          </li></> :
                        <>
                          {userProfile?.roleName == 'doctors' &&
                            <li>
                              <Link href="/doctors/dashboard">Dashboard</Link>
                            </li>
                          }
                        </>
                      }
                    </ul>
                  </div>
                </div>
                <div className="col-lg-2 col-md-5">
                  <div className="footer-widget footer-contact">
                    <h2 className="footer-title">Contact Us</h2>
                    <div className="footer-contact-info">
                      <div className="footer-address">
                        <p>
                          <i>
                            <FeatherIcon icon="map-pin" style={{ width: "16px", height: "16px" }} />
                          </i> Thailand
                        </p>
                      </div>
                      <div className="footer-address">
                        <p>
                          <i>
                            <FeatherIcon icon="phone-call" style={{ width: "16px", height: "16px" }} />
                          </i> +66(0)870 624648
                        </p>
                      </div>
                      <div className="footer-address mb-0">
                        <p>
                          <i>
                            <FeatherIcon icon="mail" style={{ width: "16px", height: "16px" }} />
                          </i> mjcode2020@gmail.com
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-7">
                  <div className="footer-widget">
                    <h2 className="footer-title">Join Our Newsletter</h2>
                    <div className="subscribe-form">
                      <Paper
                        component="form"
                        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 200, bgcolor: muiVar[`--bgPaper`], backgroundImage: 'none' }}
                      >
                        <InputBase
                          sx={{ ml: 1, flex: 1 }}
                          placeholder="Enter Email"
                          name='Enter Email'
                          inputProps={{ 'aria-label': 'Enter Email' }}
                        />
                        <IconButton color="primary" aria-label="directions" onClick={(e) => { e.preventDefault() }}>
                          <SendIcon />
                        </IconButton>
                      </Paper>
                    </div>
                    <div className="social-icon">
                      <ul>
                        <li>
                          <Link href="#" target="_blank" aria-label="socialmedia">
                            <i className="fab fa-facebook" />{" "}
                          </Link>
                        </li>
                        <li>
                          <Link href="#" target="_blank" aria-label="socialmedia">
                            <i className="fab fa-instagram" />
                          </Link>
                        </li>
                        <li>
                          <Link href="#" target="_blank" aria-label="socialmedia">
                            <i className="fab fa-twitter" />{" "}
                          </Link>
                        </li>
                        <li>
                          <Link href="#" target="_blank" aria-label="socialmedia">
                            <i className="fab fa-linkedin-in" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="container">
              {/* Copyright */}
              <div className="copyright">
                <div className="row">
                  <div className="col-md-6 col-lg-6">
                    <div className="copyright-text">
                      <p className="mb-0">
                        {" "}
                        Copyright © 2023{" "}
                        <Link
                          href="https://nastaransamui.github.io/"
                          target="_blank" aria-label="socialmedia"
                        >
                          Mj.
                        </Link>{" "}
                        All Rights Reserved
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-6">
                    {/* Copyright Menu */}
                    <div className="copyright-menu">
                      <ul className="policy-menu">
                        <li>
                          <Link href="/privacy">Privacy Policy</Link>
                        </li>
                        <li>
                          <Link href="/terms">Terms and Conditions</Link>
                        </li>
                      </ul>
                    </div>
                    {/* /Copyright Menu */}
                  </div>
                </div>
              </div>
              {/* /Copyright */}
            </div>
          </div>
        </footer>
      }
    </Fragment>
  )
})

export default Footer;