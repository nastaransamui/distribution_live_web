/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect } from 'react'
import Link from 'next/link'
import AOS from 'aos'
import { RiPhoneLine } from 'react-icons/ri'
import { AiOutlineClockCircle, AiOutlineMail } from 'react-icons/ai';
import useScssVar from '@/hooks/useScssVar'
import { logo, payment } from '../../../public/assets/imagepath';
import { useTheme } from '@mui/material';
import packageJson from "../../../package.json";

const Footer: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);

  return (
    <Fragment>
      <footer className="footer footer-fifteen" style={{
        ...muiVar,
        backgroundImage: `url(/assets/images/footer-fift-bg_${theme.palette.primary.main.slice(1)}.webp)`
      }}>
        <div className="footer-top footer-top-fifteen aos" data-aos="fade-up">
          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                <div className="footer-left-fifteen">
                  <div className="footer-fifteen-image">
                    <img src={logo} width={70} height={70} alt="" />
                  </div>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and typesetting
                    industry. Lorem Ipsum has been the industrys standard dummy
                    text ever since the 1500s, when an unknown printer took a galley
                    of type and scrambled it to make a type specimen book. It has
                    survived not only five centuries, but also the leap into
                    electronic typesetting, remaining essentially unchanged.
                  </p>
                  <h6 className="subscribe-fifteen">Subscribe Newsletter</h6>
                  <div className="subscribe-form subscribe-form-fifteen">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter Email Address"
                      name='Enter Email Address'
                    />
                    <button type="submit" className="btn footer-btn">
                      Subscribe
                    </button>
                  </div>
                  <h6 className="subscribe-fifteentwo">Acceptable Payments </h6>
                  <div className="footer-fifteen-image-2">
                    <img src={payment} alt="" />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="footer-right-fifteen">
                  <h6 className="subscribe-fifteenthree">Quick Links</h6>
                  <ul>
                    <li>
                      <Link href="about-us">About</Link>
                    </li>
                    <li>
                      <Link href="search-2">services</Link>
                    </li>
                    <li>
                      <Link href="paitent-details">Patients</Link>
                    </li>
                    <li>
                      <Link href="#">Camp</Link>
                    </li>
                    <li>
                      <Link href="doctor-blog">Doctors</Link>
                    </li>
                    <li>
                      <Link href="#">Treatments</Link>
                    </li>
                    <li>
                      <Link href="#">Facilities</Link>
                    </li>
                  </ul>
                  <h6 className="subscribe-fifteenthree">Contact</h6>
                  <p>38 Simpson Street, Rock Island, Illinois - 61201</p>
                  <div className="user-details-fift">
                    <ul>
                      <li>
                        <div className="contact-fifteen">
                          <div className="contact-form-fift">
                            <RiPhoneLine className="feather-phone" />
                          </div>
                          <div className="contact-content-fift">
                            <h6>Phone Number</h6>
                            <span>1800 - 42657678</span>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="contact-fifteen">
                          <div className="contact-form-fift">
                            <AiOutlineMail className="feather-mail" />
                          </div>
                          <div className="contact-content-fift">
                            <h6>Email</h6>
                            <span>Doccure@example.com</span>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="contact-fifteen">
                          <div className="contact-form-fift">
                            <AiOutlineClockCircle className="feather-clock" />
                          </div>
                          <div className="contact-content-fift">
                            <h6>Opening</h6>
                            <span>Available 24*7</span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <h6 className="subscribe-fifteenthree">Language and Social</h6>
                  <div className="footer-fift-selects">
                    <div className="footer-select click">
                    </div>
                    <div className="social-icon">
                      <ul>
                        <li>
                          <Link href="#" target="_blank">
                            <i className="fa-brands fa-facebook" />{" "}
                          </Link>
                        </li>
                        <li>
                          <Link href="#" target="_blank">
                            <i className="fab fa-twitter" />{" "}
                          </Link>
                        </li>
                        <li>
                          <Link href="#" target="_blank">
                            <i className="fa-brands fa-instagram" />
                          </Link>
                        </li>
                        <li>
                          <Link href="#" target="_blank">
                            <i className="fa-brands fa-linkedin" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="footer-bottom footer-bottom-fifteen">
                    <div className="container">
                      {/* Copyright */}
                      <div className="copyright">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="copyright-text">
                              <p>© 2023 All rights reserve.</p>
                              <small style={{ display: 'flex', justifyContent: 'flex-start' }}> v:{packageJson.version}</small>
                            </div>
                          </div>
                          <div className="col-md-6">
                            {/* Copyright Menu */}
                            <div className="copyright-menu">
                              <ul className="policy-menu">
                                <li>
                                  <Link href="terms-condition">Terms</Link>
                                </li>
                                <li>
                                  <Link href="privacy-policy">Privacy Policy</Link>
                                </li>
                                <li>
                                  <Link href="#">Sitemap</Link>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </Fragment>
  )
});

export default Footer;