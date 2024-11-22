/* eslint-disable @next/next/no-img-element */
import { FC } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import {
  footer_img_01,
  footer_img_02,
  footer_img_03,
  footer_img_04,
  logo,
} from '@/public/assets/imagepath'
import { useTheme } from "@mui/material";

const FooterHomeCare: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  return (
    <footer className="footer footer-sec-fourteen" style={muiVar}>
      <div className="footer-top">
        <div className="row">
          <div className="col-sm-3 col-6 p-0">
            <div className="footer-img">
              <img src={footer_img_01} className="img-fluid w-100" alt="Img" />
            </div>
          </div>
          <div className="col-sm-3 col-6 p-0">
            <div className="footer-img">
              <img src={footer_img_02} className="img-fluid w-100" alt="Img" />
            </div>
          </div>
          <div className="col-sm-3 col-6 p-0">
            <div className="footer-img">
              <img
                src={footer_img_03}
                className="img-fluid w-100"
                alt="Img"
              />
            </div>
          </div>
          <div className="col-sm-3 col-6 p-0">
            <div className="footer-img">
              <img
                src={footer_img_04}
                className="img-fluid w-100"
                alt="Img"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="footer-middle">
        <div className="container">
          <div className="footer-mid-content">
            <p>Would you like to connect with us</p>
            <ul className="social-icons">
              <li>
                <Link href="" onClick={(e) => e.preventDefault()}>
                  <i className="fa-brands fa-facebook-f" />
                </Link>
              </li>
              <li>
                <Link href="" onClick={(e) => e.preventDefault()}>
                  <i className="fa-brands fa-twitter" />
                </Link>
              </li>
              <li>
                <Link href="" onClick={(e) => e.preventDefault()}>
                  <i className="fa-brands fa-linkedin-in" />
                </Link>
              </li>
              <li>
                <Link href="" onClick={(e) => e.preventDefault()}>
                  <i className="fa-brands fa-youtube" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-mid-two">
        <div className="container">
          <div className="row">
            <div
              className="col-xl-4 col-md-6 col-sm-12"
              data-aos="fade-down"
              data-aos-delay={500}
            >
              <div className="footer-logo-col">
                <div className="footer-logo">
                  <img src={logo} alt="Img" height={70} width={70} />
                </div>
                <p>
                  Connect with healthcare professionals, manage appointments
                  &amp; prioritize your well being{" "}
                </p>
                <form >
                  <div className="input-block">
                    <span className="mail-icons">
                      <i className="feather-mail" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter You Email Here"
                    />
                    <button className="btn" type="submit" onClick={(e) => e.preventDefault()}>
                      Subscribe
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div
              className="col-xl-2 col-md-3 col-sm-6"
              data-aos="fade-down"
              data-aos-delay={600}
            >
              <div className="footer-links-middle">
                <h4>QUICK LINKS</h4>
                <ul>
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li>
                    <Link href="/bout">About us</Link>
                  </li>
                  {/* <li>
                    <Link href="/payment">Payments</Link>
                  </li>
                  <li>
                    <Link href="/patient/booking1">Lab Test</Link>
                  </li> */}
                </ul>
              </div>
            </div>
            <div
              className="col-xl-2 col-md-3 col-sm-6"
              data-aos="fade-down"
              data-aos-delay={700}
            >
              <div className="footer-links-middle">
                <h4>SERVICES</h4>
                <ul>
                  <li>
                    <Link href="" onClick={(e) => e.preventDefault()}>Nurse at Home</Link>
                  </li>
                  <li>
                    <Link href="" onClick={(e) => e.preventDefault()}>Physiotherapy</Link>
                  </li>
                  <li>
                    <Link href="" onClick={(e) => e.preventDefault()}>Medical Equipment</Link>
                  </li>
                  <li>
                    <Link href="" onClick={(e) => e.preventDefault()}>Doctor Consultation</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div
              className="col-xl-2 col-md-4 col-sm-6"
              data-aos="fade-down"
              data-aos-delay={800}
            >
              <div className="footer-links-middle">
                <h4>CONSUMER POLICY</h4>
                <ul>
                  <li>
                    <Link href="/privacy">Privacy</Link>
                  </li>
                  <li>
                    <Link href="/terms">Terms and Condition</Link>
                  </li>
                  <li>
                    <Link href="/faq">FAQ</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div
              className="col-xl-2 col-md-4 col-sm-6"
              data-aos="fade-down"
              data-aos-delay={900}
            >
              <div className="footer-links-middle">
                <h4>QUICK CONTACT</h4>
                <ul>
                  <li>
                    <span>
                      <i className="feather-mail" />
                    </span>
                    max@example.com
                  </li>
                  <li>
                    <span>
                      <i className="feather-phone" />
                    </span>
                    +91 XXXXX YYYY65
                  </li>
                  <li>
                    <span>
                      <i className="feather-clock" />
                    </span>
                    We are available 24*7
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="copy-right text-center">
            <p className="mb-0">
              {" "}
              Copyright © 2023{" "}
              <Link
                href="https://nastaransamui.github.io/"
                target="_blank"
                style={{ color: theme.palette.secondary.main, fontSize: 17 }}
              >
                Mj.
              </Link>{" "}
              All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
})

export default FooterHomeCare;