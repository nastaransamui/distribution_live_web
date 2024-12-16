/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect } from 'react'
import Link from 'next/link'
import AOS from 'aos'
import useScssVar from '@/hooks/useScssVar'
import { logo } from '../../../public/assets/imagepath'


const Footer: FC = (() => {
  const { muiVar } = useScssVar();
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);
  return (
    <Fragment>
      <footer className="footer footer-one footer-fourteen footer-twelve" style={muiVar}>
        <div className="footer-top aos" data-aos="fade-up">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-4">
                <div className="footer-widget footer-about">
                  <div className="footer-logo">
                    <Link href="index-10">
                      <img src={logo} alt="logo" className='img' />
                    </Link>
                  </div>
                  <div className="footer-about-content">
                    <p>
                      Lorem ipsum dolor sit amet, consecte adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna ad minim
                      veniam aliqua.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="row">
                  <div className="col-lg-3 col-md-4">
                    <div className="footer-widget footer-menu">
                      <h2 className="footer-title">Company</h2>
                      <ul>
                        <li>
                          <Link href="index-10">Home</Link>
                        </li>
                        <li>
                          <Link href="#">Specialities</Link>
                        </li>
                        <li>
                          <Link href="#">Consult</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-4">
                    <div className="footer-widget footer-menu">
                      <h2 className="footer-title">Specialities</h2>
                      <ul>
                        <li>
                          <Link href="#">Neurology</Link>
                        </li>
                        <li>
                          <Link href="#">Cardiologist</Link>
                        </li>
                        <li>
                          <Link href="#">Dentist</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-4">
                    <div className="footer-widget footer-contact">
                      <h2 className="footer-title">Contact Us</h2>
                      <div className="footer-contact-info">
                        <div className="footer-address">
                          <p>
                            <i className="feather-map-pin" /> 3556 Beech Street, USA
                          </p>
                        </div>
                        <div className="footer-address">
                          <p>
                            <i className="feather-phone-call" /> +1 315 369 5943
                          </p>
                        </div>
                        <div className="footer-address mb-0">
                          <p>
                            <i className="feather-mail" /> mjcode2020@gmail.com
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-7">
                <div className="footer-widget">
                  <h2 className="footer-title">Join Our Newsletter</h2>
                  <div className="subscribe-form">
                    <form noValidate>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter Email"
                        name='Enter Email'
                      />
                      <button onClick={(e) => { e.preventDefault() }} type="submit" className="btn">
                        Subscribe
                      </button>
                    </form>
                  </div>
                  <div className="social-icon">
                    <ul>
                      <li>
                        <Link href="#" target="_blank">
                          <i className="fab fa-facebook" />{" "}
                        </Link>
                      </li>
                      <li>
                        <Link href="#" target="_blank">
                          <i className="fab fa-instagram" />
                        </Link>
                      </li>
                      <li>
                        <Link href="#" target="_blank">
                          <i className="fab fa-twitter" />{" "}
                        </Link>
                      </li>
                      <li>
                        <Link href="#" target="_blank">
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
                    <p className="mb-0"> Copyright © 2023 All Rights Reserved</p>
                  </div>
                </div>
                <div className="col-md-6 col-lg-6">
                  {/* Copyright Menu */}
                  <div className="copyright-menu">
                    <ul className="policy-menu">
                      <li>
                        <Link href="privacy-policy">Privacy Policy</Link>
                      </li>
                      <li>
                        <Link href="terms-condition">Terms and Conditions</Link>
                      </li>
                      <li>
                        <Link href="login">Login &amp; Register</Link>
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
    </Fragment>
  )
})

export default Footer;