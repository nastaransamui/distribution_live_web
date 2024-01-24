/* eslint-disable @next/next/no-img-element */
import React, { useEffect, Fragment, FC } from 'react';
import Link from 'next/link';
import AOS from 'aos'
import FeatherIcon from 'feather-icons-react';
import dynamic from 'next/dynamic'
import useScssVar from '@/hooks/useScssVar';
import { useTheme } from '@mui/material';
import { Doc03, Doc04, Doc05, doctors_profile } from '@/public/assets/imagepath';
const OwlCarousel = dynamic(() => import('react-owl-carousel'), {
  ssr: false,
})

const Doctors: FC = (() => {
  const { muiVar } = useScssVar()
  const theme = useTheme();
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);
  const doctersettings = {
    items: 3,
    loop: true,
    margin: 15,
    dots: false,
    nav: true,
    navContainer: '.slide-nav-2',
    navText: ['<i class="fas fa-chevron-left custom-arrow"></i>', '<i class="fas fa-chevron-right custom-arrow"></i>'],

    autoplay: false,
    infinite: "true",

    slidestoscroll: 1,
    rtl: "true",
    rows: 1,
    responsive: {
      1049: {
        items: 4
      },
      800: {
        items: 3
      },
      776: {
        items: 2
      },
      567: {
        items: 2
      },
      200: {
        items: 1
      }
    }
  }

  return (
    <Fragment>
      <section className="our-doctors-section" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-6 aos" data-aos="fade-up">
              <div className="section-header-one section-header-slider">
                <h2 className="section-title imgColorPrimary">Best Doctors</h2>
              </div>
            </div>
            <div className="col-md-6 aos" data-aos="fade-up">
              <div className="owl-nav slide-nav-2 text-end nav-control" />
            </div>
          </div>
          <div
            className="doctor-slider-one owl-theme aos"
            data-aos="fade-up"
          >
            {/* Doctor Item */}
            <OwlCarousel {...doctersettings}>
              <div className="item">
                <div className="doctor-profile-widget">
                  <div className="doc-pro-img">
                    <Link href="/doctors/profile">
                      <div className="doctor-profile-img">
                        <img
                          src={Doc03}
                          className="img-fluid"
                          alt=""
                        />
                      </div>
                    </Link>
                    <div className="doctor-amount">
                      <span>$ 200</span>
                    </div>
                  </div>
                  <div className="doc-content">
                    <div className="doc-pro-info">
                      <div className="doc-pro-name">
                        <Link href="/doctors/profile">Dr. Ruby Perrin</Link>
                        <p>Cardiology</p>
                      </div>
                      <div className="reviews-ratings">
                        <p>
                          <span>
                            <i className="fas fa-star" /> 4.5
                          </span>{" "}
                          (35)
                        </p>
                      </div>
                    </div>
                    <div className="doc-pro-location">
                      <p>
                        <i><FeatherIcon icon="map-pin" style={{ color: muiVar['--color'] }} /></i> Newyork, USA
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Doctor Item */}
              {/* Doctor Item */}
              <div className="item">
                <div className="doctor-profile-widget">
                  <div className="doc-pro-img">
                    <Link href="/doctors/profile">
                      <div className="doctor-profile-img">
                        <img
                          src={Doc04}
                          className="img-fluid"
                          alt=""
                        />
                      </div>
                    </Link>
                    <div className="doctor-amount">
                      <span>$ 360</span>
                    </div>
                  </div>
                  <div className="doc-content">
                    <div className="doc-pro-info">
                      <div className="doc-pro-name">
                        <Link href="/doctors/profile">Dr. Darren Elder</Link>
                        <p>Neurology</p>
                      </div>
                      <div className="reviews-ratings">
                        <p>
                          <span>
                            <i className="fas fa-star" /> 4.0
                          </span>{" "}
                          (20)
                        </p>
                      </div>
                    </div>
                    <div className="doc-pro-location">
                      <p>
                        <i ><FeatherIcon icon="map-pin" style={{ color: muiVar['--color'] }} /></i> Florida, USA
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Doctor Item */}
              {/* Doctor Item */}
              <div className="item">
                <div className="doctor-profile-widget">
                  <div className="doc-pro-img">
                    <Link href="/doctors/profile">
                      <div className="doctor-profile-img">
                        <img
                          src={Doc05}
                          className="img-fluid"
                          alt=""
                        />
                      </div>
                    </Link>
                    <div className="doctor-amount">
                      <span>$ 450</span>
                    </div>
                  </div>
                  <div className="doc-content">
                    <div className="doc-pro-info">
                      <div className="doc-pro-name">
                        <Link href="/doctors/profile">Dr. Sofia Brient</Link>
                        <p>Urology</p>
                      </div>
                      <div className="reviews-ratings">
                        <p>
                          <span>
                            <i className="fas fa-star" /> 4.5
                          </span>{" "}
                          (30)
                        </p>
                      </div>
                    </div>
                    <div className="doc-pro-location">
                      <p>
                        <i ><FeatherIcon icon="map-pin" style={{ color: muiVar['--color'] }} /></i> Georgia, USA
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Doctor Item */}
              {/* Doctor Item */}
              <div className="item">
                <div className="doctor-profile-widget">
                  <div className="doc-pro-img">
                    <Link href="/doctors/profile">
                      <div className="doctor-profile-img">
                        <img
                          style={{ marginTop: -45 }}
                          src={doctors_profile}
                          className="img-fluid"
                          alt=""
                        />
                      </div>
                    </Link>
                    <div className="doctor-amount">
                      <span>$ 570</span>
                    </div>
                  </div>
                  <div className="doc-content">
                    <div className="doc-pro-info">
                      <div className="doc-pro-name">
                        <Link href="/doctors/profile">Dr. Paul Richard</Link>
                        <p>Orthopedic</p>
                      </div>
                      <div className="reviews-ratings">
                        <p>
                          <span>
                            <i className="fas fa-star" /> 4.3
                          </span>{" "}
                          (45)
                        </p>
                      </div>
                    </div>
                    <div className="doc-pro-location">
                      <p>
                        <i ><FeatherIcon icon="map-pin" style={{ color: muiVar['--color'] }} /></i> Michigan, USA
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Doctor Item */}
              {/* Doctor Item */}
              <div className="item">
                <div className="doctor-profile-widget">
                  <div className="doc-pro-img">
                    <Link href="/doctors/profile">
                      <div className="doctor-profile-img">
                        <img
                          style={{ marginTop: -45 }}
                          src={doctors_profile}
                          className="img-fluid"
                          alt=""
                        />
                      </div>
                    </Link>
                    <div className="doctor-amount">
                      <span>$ 880</span>
                    </div>
                  </div>
                  <div className="doc-content">
                    <div className="doc-pro-info">
                      <div className="doc-pro-name">
                        <Link href="/doctors/profile">Dr. John Doe</Link>
                        <p>Dentist</p>
                      </div>
                      <div className="reviews-ratings">
                        <p>
                          <span>
                            <i className="fas fa-star" /> 4.4
                          </span>{" "}
                          (50)
                        </p>
                      </div>
                    </div>
                    <div className="doc-pro-location">
                      <p>
                        <i ><FeatherIcon icon="map-pin" style={{ color: muiVar['--color'] }} /></i> California, USA
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </OwlCarousel>
            {/* /Doctor Item */}
          </div>
        </div>
      </section>
    </Fragment>
  )
})

export default Doctors