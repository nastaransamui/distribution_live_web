/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faMapMarker, faPhone } from '@fortawesome/free-solid-svg-icons'
import {
  ecg,
  footermap,
  hexagon_group_4,
  hexagon_group_5
} from '../../../public/assets/imagepath'
import { FooterLogoSvg } from '../../../public/assets/images/icons/IconsSvgs'
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
  const userProfile = useSelector((state: AppState) => state.userProfile.value)

  return (
    <Fragment>
      <footer className="footer footer-one footer-ten" style={muiVar}>
        <div className="footer-ten-bg">
          <img src={hexagon_group_4} alt="#" className='img' />
          <img src={hexagon_group_5} alt="#" className='img' />
          <img src={ecg} alt="#" />
        </div>
        <div className="footer-top aos" data-aos="fade-up">
          <div className="container">
            <div className="footer-details">
              <div className="row">
                <div className="col-lg-4 col-md-6 col-sm-12">
                  <div className="footer-widget footer-about">
                    <div className="footer-logo">
                      {/* <img src={footerlogo} alt="logo" /> */}
                      <FooterLogoSvg />
                    </div>
                    <div className="footer-about-content">
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                        tempor </p>
                    </div>
                    <div className="social-icon">
                      <ul>
                        <li>
                          <Link href="#" target="_blank"><i className="fab fa-facebook" />
                          </Link>
                        </li>
                        <li>
                          <Link href="#" target="_blank"><i className="fab fa-instagram" /></Link>
                        </li>
                        <li>
                          <Link href="#" target="_blank"><i className="fab fa-twitter" />
                          </Link>
                        </li>
                        <li>
                          <Link href="#" target="_blank"><i className="fab fa-linkedin-in" /></Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-12">
                  <div className="footer-widget footer-contact">
                    <h2 className="footer-title">&nbsp;</h2>
                    <div className="footer-contact-info">
                      <div className="footer-address">
                        <p> <FontAwesomeIcon icon={faMapMarker} /> &nbsp; 3556 Beech Street, USA</p>
                      </div>
                      <div className="footer-address">
                        <p><FontAwesomeIcon icon={faPhone} />  &nbsp;+1 315 369 5943</p>
                      </div>
                      <div className="footer-address mb-0">
                        <p><FontAwesomeIcon icon={faEnvelope} />  &nbsp;doccure@example.com</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-12">
                  <div className="footer-map">
                    <img src={footermap} className="img-fluid" alt="#" />
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-2 col-md-4">
                <div className="footer-widget footer-menu">
                  <h2 className="footer-title">Services by city</h2>
                  <ul>
                    <li><Link href="#">New York</Link></li>
                    <li><Link href="#">Los Angeles</Link></li>
                    <li><Link href="#">Chicago</Link></li>
                    <li><Link href="#">Houston</Link></li>
                    <li><Link href="#">Phoenix</Link></li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-2 col-md-4">
                <div className="footer-widget footer-menu">
                  <h2 className="footer-title">Services by city</h2>
                  <ul>
                    <li><Link href="#">New York</Link></li>
                    <li><Link href="#">Los Angeles</Link></li>
                    <li><Link href="#">Chicago</Link></li>
                    <li><Link href="#">Houston</Link></li>
                    <li><Link href="#">Phoenix</Link></li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-2 col-md-4">
                <div className="footer-widget footer-menu">
                  <h2 className="footer-title">For Patients</h2>
                  <ul>
                    <li><Link href="/doctors">Search for Doctors</Link></li>
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
                    <li><Link href="/doctors/dashboard/appointments">Appointments</Link></li>
                    <li><Link href="/patient/dashboard/patient-chat">Chat</Link></li>
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
              {/* <div className="col-lg-2 col-md-5">
							
						</div> */}
              <div className="col-lg-4 col-md-7">
                <div className="footer-widget">
                  <h2 className="footer-title">Subscribe to newsletter</h2>
                  <div className="subscribe-form">
                    <Paper
                      component="form"
                      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 350, bgcolor: muiVar[`--bgDefault`] }}
                    >
                      <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Enter Email"
                        inputProps={{ 'aria-label': 'Enter Email' }}
                        name='Enter Email'
                      />
                      <IconButton color="secondary" aria-label="directions" onClick={(e) => { e.preventDefault() }}>
                        <SendIcon />
                      </IconButton>
                    </Paper>
                  </div>
                  <span className="mail-note">* Will send you weekly updates for your better
                    finance management.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            {/* Copyright */}
            <div className="copyright">
              <div className="copyright-text">
                <p className="mb-0">© 2023 MJ. All Rights Reserved.</p>
              </div>
              {/* Copyright Menu */}
              <div className="copyright-menu">
                <ul className="policy-menu">
                  <li><Link href="/privacy">Privacy Policy</Link></li>
                  <li><Link href="/terms">Terms and Conditions</Link></li>
                </ul>
              </div>
              {/* /Copyright Menu */}
            </div>
            {/* /Copyright */}

          </div>
        </div>
      </footer>
    </Fragment>
  )
})

export default Footer;