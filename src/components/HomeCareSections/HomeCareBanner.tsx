/* eslint-disable @next/next/no-img-element */

import { FC } from "react";
import useScssVar from "@/hooks/useScssVar";

import Link from "next/link";
import { Banner_img_13, Banner_img_curve_13, Banner_round_vector_13, Banner_cloud_01, Banner_lief_img, Banner_curve_bg } from "@/public/assets/imagepath";
import { BannerCallIcon } from "@/public/assets/images/icons/IconsSvgs";



const HomeCareBanner: FC = (() => {
  const { muiVar } = useScssVar();

  return (
    <section className="banner-section banner-sec-fourteen" style={muiVar}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="banner-content aos" data-aos="fade-up">
              <div className="banner-head">
                <h6>LET’s Take CARE</h6>
                <h1>Home Care Services in Your Area</h1>
                <p>
                  Book an expert caregiver that you can trust. To get started
                </p>
              </div>
              <div className="banner-form-field">
                <span>Home Visit</span>
                <form >
                  <div className="row">
                    <div className="col-xl-6 col-lg-12 col-md-6">
                      <div className="input-block">
                        <div className="icon-badge">
                          <span>
                            <i className="feather-user" />
                          </span>
                        </div>
                        <div className="banner-input-box">
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Health Care"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-12 col-md-6">
                      <div className="input-block">
                        <div className="icon-badge">
                          <span>
                            <i className="feather-smartphone" />
                          </span>
                        </div>
                        <div className="banner-input-box">
                          <label className="form-label">Phone Number</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="66 870 62 46 48"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-12 col-md-6">
                      <div className="input-block">
                        <div className="icon-badge">
                          <span>
                            <i className="feather-mail" />
                          </span>
                        </div>
                        <div className="banner-input-box">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="mjcode2020@gmail.com"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-12 col-md-6">
                      <div className="input-block">
                        <div className="icon-badge">
                          <span>
                            <i className="feather-map-pin" />
                          </span>
                        </div>
                        <div className="banner-input-box">
                          <label className="form-label">Location</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Chiang Mai, Thailand"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="banner-btns">
                <Link href="" onClick={(e) => e.preventDefault()} className="btn appoint-btn">
                  <i className="feather-file me-2" />
                  Book an Appointment
                </Link>
                <Link href="" onClick={(e) => e.preventDefault()} className="btn demo-btn">
                  <i className="feather-video me-2" />
                  Live Demo
                </Link>
              </div>
              <div className="watch-video">
                <Link href="" onClick={(e) => e.preventDefault()}>
                  <span>
                    <i className="fa-solid fa-circle-play" />
                  </span>
                  Watch Video About Us
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="banner-sec-img">
              <span>
                <img src={Banner_img_13} className="img-fluid" alt="Img" />
              </span>
              <span
                className="banner-curve aos"
                data-aos="fade-up"
                data-aos-delay={500}
              >
                <img
                  src={Banner_img_curve_13}
                  className="img-fluid"
                  alt="Img"
                />
              </span>
              <span className="banner-round-bg">
                <img src={Banner_round_vector_13} alt="Img" />
              </span>
              <span
                className="cloud-bg-one"
                data-aos="fade-right"
                data-aos-delay={500}
              >
                <img src={Banner_cloud_01} alt="Img" />
              </span>
              <span
                className="cloud-bg-two"
                data-aos="fade-left"
                data-aos-delay={500}
              >
                <img src={Banner_cloud_01} alt="Img" />
              </span>
              <span className="lief-img">
                <img src={Banner_lief_img} alt="Img" />
              </span>
              <span className="banner-curve-two">
                <img src={Banner_curve_bg} alt="Img" />
              </span>
              <span className="chat-call-btn">
                <Link href="" onClick={(e) => e.preventDefault()}>Chat and Call Now</Link>
              </span>
              <div className="banner-cal-icon">
                <span className="calender-border">
                  <BannerCallIcon />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

export default HomeCareBanner;