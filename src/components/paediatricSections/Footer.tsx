/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { FiLinkedin, FiTwitter, FiFacebook, FiInstagram, FiYoutube } from 'react-icons/fi';
import Link from 'next/link';
import { cloud_2, logo, rainbow_2 } from '../../../public/assets/imagepath';

const Footer: FC = (() => {
  const { muiVar } = useScssVar();

  return (
    <Fragment>
      <footer className="footer footer-thirteen" style={muiVar}>
        <div className="footer-bg-icon">
          <img src={cloud_2} alt="#" className="aos" data-aos="fade-right" />
          <img src={rainbow_2} alt="#" className="aos" data-aos="fade-left" />
        </div>
        <div className="footer-top aos" data-aos="fade-up">
          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                <div className="row">
                  <div className="col-md-6">
                    <div className="footer-widget footer-menu">
                      <h2 className="footer-title">About us</h2>
                      <ul>
                        <li>
                          <Link href="#">Our Doctors</Link>
                        </li>
                        <li>
                          <Link href="#">Why us</Link>
                        </li>
                        <li>
                          <Link href="#">How it works</Link>
                        </li>
                        <li>
                          <Link href="#">Our News &amp; Events</Link>
                        </li>
                        <li>
                          <Link href="#">FAQ</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="footer-widget footer-menu">
                      <h2 className="footer-title">Our cabins</h2>
                      <ul>
                        <li>
                          <Link href="#">North of London</Link>
                        </li>
                        <li>
                          <Link href="#">Golden Hideaway</Link>
                        </li>
                        <li>
                          <Link href="#">Oak Treehouse</Link>
                        </li>
                        <li>
                          <Link href="#">Acacia Retreat</Link>
                        </li>
                        <li>
                          <Link href="#">Blue Lagoon</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="row">
                  <div className="col-md-4">
                    <div className="footer-widget footer-menu">
                      <h2 className="footer-title">Services</h2>
                      <ul>
                        <li>
                          <Link href="#">Prenatal/New-born</Link>
                        </li>
                        <li>
                          <Link href="#">Vaccinations</Link>
                        </li>
                        <li>
                          <Link href="#">Blood tests</Link>
                        </li>
                        <li>
                          <Link href="#">Diagnostic tests</Link>
                        </li>
                        <li>
                          <Link href="#">Parents training classes</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="footer-widget footer-menu footer-menu-thirteen">
                      <h2 className="footer-title">Services</h2>
                      <ul>
                        <li>
                          <Link href="#">Our Doctors</Link>
                        </li>
                        <li>
                          <Link href="#">Why us</Link>
                        </li>
                        <li>
                          <Link href="#">How it works</Link>
                        </li>
                        <li>
                          <Link href="#">Our News &amp; Events</Link>
                        </li>
                        <li>
                          <Link href="/pages/faq">FAQ</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="footer-widget footer-menu">
                      <h2 className="footer-title">Support</h2>
                      <ul>
                        <li>
                          <Link href="#">Help Us</Link>
                        </li>
                        <li>
                          <Link href="/privacy">Privacy Policy</Link>
                        </li>
                        <li>
                          <Link href="/pages/contactus">Contact Us</Link>
                        </li>
                        <li>
                          <Link href="/terms">Terms of Service</Link>
                        </li>
                        <li>
                          <Link href="#">Complaints Policy</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer-contents-thirteen-main">
              <div className="row">
                <div className="col-lg-6">
                  <div className="footer-thirt-inner">
                    <h4>Sign up to our Newsletter</h4>
                    <p>For a weekly curated collection of 3 things you can watch,
                      read or listen to switch off from the busy everyday.</p>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="subscribe-form">
                    <form action="#">
                      <input type="email" className="form-control" placeholder="mjcode2020@gmail.com" />
                      <button type="submit" className="btn">Subscribe <i className="feather-arrow-right ms-2" /></button>
                    </form>
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
              <div className="row align-items-center">
                <div className="col-md-4 col-lg-4">
                  <div className="copyright-img">
                    <Link href="/index10"><img src={logo} alt="#" /></Link>
                  </div>
                </div>
                <div className="col-md-4 col-lg-4">
                  <div className="copyright-text">
                    <p className="mb-0"> Copyright © 2023 All Rights Reserved</p>
                  </div>
                </div>
                <div className="col-md-4 col-lg-4">
                  {/* Copyright Menu */}
                  <div className="copyright-menu">
                    <ul className="policy-menu">
                      <li><Link href="#"><FiLinkedin /></Link></li>
                      <li><Link href="#"><FiTwitter /></Link></li>
                      <li><Link href="#"><FiFacebook /></Link></li>
                      <li><Link href="#"><FiInstagram /></Link></li>
                      <li><Link href="#"><FiYoutube /></Link></li>
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
});

export default Footer;