/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import dynamic from 'next/dynamic'
import Link from 'next/link';
import { AtomBondSvg } from '@/public/assets/images/icons/IconsSvgs';
import {
  add_circle, doctor_25_aspect, doctor_26_aspect, doctor_27_aspect, pulse_1, pulse_2, pulse_3
}
  from '@/public/assets/imagepath'
import { useTheme } from '@mui/material';

const OwlCarousel = dynamic(() => import(`react-owl-carousel`), { ssr: false });


const DoctorsSection: FC = (() => {
  const { muiVar } = useScssVar();
  const settings = {
    items: 3,
    loop: true,
    margin: 55,
    dots: true,
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
        items: 3
      },
      992: {
        items: 2
      },
      800: {
        items: 2
      },
      776: {
        items: 2
      },
      567: {
        items: 1
      },
      200: {
        items: 1
      }
    }

  }
  const theme = useTheme()
  return (
    <Fragment>
      <div className="our-doctor-thirteen common-padding" style={{
        ...muiVar,
        backgroundImage: `url(/assets/images/cloud-bg_${theme.palette.mode}.webp)`
      }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 aos" data-aos="fade-up">
              <div className="section-header-thirteen">
                <div className="section-inner-thirteen">
                  <AtomBondSvg />
                </div>
                <h2>Our Doctors</h2>
              </div>
            </div>
          </div>
          <div className=" our-slider-thirteen owl-theme aos" data-aos="fade-up" >
            <OwlCarousel {...settings}>
              <div className="our-doctor-thirteen-all">
                <div className="our-doctor-thirteen-img">
                  <img
                    src={doctor_25_aspect}
                    alt=""
                    className="img-fluid"
                  />
                </div>
                <div className="our-doctor-content">
                  <Link href="/doctors/profile">Gloria Smith</Link>
                  <div className="our-doctor-content-inner">
                    <span>Paediatrician</span>
                    <div className="reviews-ratings">
                      <p>
                        <span>
                          <i className="fas fa-star" /> 4.1
                        </span>{" "}
                        (3621)
                      </p>
                    </div>
                  </div>
                  <h6>+1500 Patients</h6>
                  <p>
                    <i className="fa-solid fa-location-dot" /> New York, USA
                  </p>
                  <div className="our-doctor-thirteen-imgone">
                    <img
                      src={add_circle}
                      alt=""
                      className="img-fluid imgColorSecondary"
                    />
                  </div>
                </div>
              </div>
              <div className="our-doctor-thirteen-all">
                <div className="our-doctor-thirteen-img">
                  <img
                    src={doctor_27_aspect}
                    alt=""
                    className="img-fluid"
                  />
                </div>
                <div className="our-doctor-content">
                  <Link href="/doctors/profile">Mark E. Wong</Link>
                  <div className="our-doctor-content-inner">
                    <span>Paediatrician</span>
                    <div className="reviews-ratings">
                      <p>
                        <span>
                          <i className="fas fa-star" /> 4.0
                        </span>{" "}
                        (1053)
                      </p>
                    </div>
                  </div>
                  <h6>+1500 Patients</h6>
                  <p>
                    <i className="fa-solid fa-location-dot" /> Mexico, USA
                  </p>
                  <div className="our-doctor-thirteen-imgone">
                    <img
                      src={add_circle}
                      alt=""
                      className="img-fluid imgColorSecondary"
                    />
                  </div>
                </div>
              </div>
              <div className="our-doctor-thirteen-all">
                <div className="our-doctor-thirteen-img">
                  <img
                    src={doctor_25_aspect}
                    alt=""
                    className="img-fluid"
                  />
                </div>
                <div className="our-doctor-content">
                  <Link href="/doctors/profile">William M. Williams</Link>
                  <div className="our-doctor-content-inner">
                    <span>Paediatrician</span>
                    <div className="reviews-ratings">
                      <p>
                        <span>
                          <i className="fas fa-star" /> 4.5
                        </span>{" "}
                        (3500)
                      </p>
                    </div>
                  </div>
                  <h6>+6500 Patients</h6>
                  <p>
                    <i className="fa-solid fa-location-dot" /> Los Angels, USA
                  </p>
                  <div className="our-doctor-thirteen-imgone">
                    <img
                      src={add_circle}
                      alt=""
                      className="img-fluid imgColorSecondary"
                    />
                  </div>
                </div>
              </div>
              <div className="our-doctor-thirteen-all">
                <div className="our-doctor-thirteen-img">
                  <img
                    src={doctor_26_aspect}
                    alt=""
                    className="img-fluid"
                  />
                </div>
                <div className="our-doctor-content">
                  <Link href="/doctors/profile">Gloria Smith</Link>
                  <div className="our-doctor-content-inner">
                    <span>Paediatrician</span>
                    <div className="reviews-ratings">
                      <p>
                        <span>
                          <i className="fas fa-star" /> 4.5
                        </span>{" "}
                        (35)
                      </p>
                    </div>
                  </div>
                  <h6>+1500 Patients</h6>
                  <p>
                    <i className="fa-solid fa-location-dot" /> Mexico, USA
                  </p>
                  <div className="our-doctor-thirteen-imgone">
                    <img
                      src={add_circle}
                      alt=""
                      className="img-fluid imgColorSecondary"
                    />
                  </div>
                </div>
              </div>
              <div className="our-doctor-thirteen-all">
                <div className="our-doctor-thirteen-img">
                  <img
                    src={doctor_25_aspect}
                    alt=""
                    className="img-fluid"
                  />
                </div>
                <div className="our-doctor-content">
                  <Link href="/doctors/profile">Gloria Smith</Link>
                  <div className="our-doctor-content-inner">
                    <span>Paediatrician</span>
                    <div className="reviews-ratings">
                      <p>
                        <span>
                          <i className="fas fa-star" /> 4.1
                        </span>{" "}
                        (3621)
                      </p>
                    </div>
                  </div>
                  <h6>+1500 Patients</h6>
                  <p>
                    <i className="fa-solid fa-location-dot" /> New York, USA
                  </p>
                  <div className="our-doctor-thirteen-imgone">
                    <img
                      src={add_circle}
                      alt=""
                      className="img-fluid imgColorSecondary"
                    />
                  </div>
                </div>
              </div>
              <div className="our-doctor-thirteen-all">
                <div className="our-doctor-thirteen-img">
                  <img
                    src={doctor_27_aspect}
                    alt=""
                    className="img-fluid"
                  />
                </div>
                <div className="our-doctor-content">
                  <Link href="/doctors/profile">Mark E. Wong</Link>
                  <div className="our-doctor-content-inner">
                    <span>Paediatrician</span>
                    <div className="reviews-ratings">
                      <p>
                        <span>
                          <i className="fas fa-star" /> 4.0
                        </span>{" "}
                        (1053)
                      </p>
                    </div>
                  </div>
                  <h6>+1500 Patients</h6>
                  <p>
                    <i className="fa-solid fa-location-dot" /> Mexico, USA
                  </p>
                  <div className="our-doctor-thirteen-imgone">
                    <img
                      src={add_circle}
                      alt=""
                      className="img-fluid imgColorSecondary"
                    />
                  </div>
                </div>
              </div>
              <div className="our-doctor-thirteen-all">
                <div className="our-doctor-thirteen-img">
                  <img
                    src={doctor_25_aspect}
                    alt=""
                    className="img-fluid"
                  />
                </div>
                <div className="our-doctor-content">
                  <Link href="/doctors/profile">William M. Williams</Link>
                  <div className="our-doctor-content-inner">
                    <span>Paediatrician</span>
                    <div className="reviews-ratings">
                      <p>
                        <span>
                          <i className="fas fa-star" /> 4.5
                        </span>{" "}
                        (3500)
                      </p>
                    </div>
                  </div>
                  <h6>+6500 Patients</h6>
                  <p>
                    <i className="fa-solid fa-location-dot" /> Los Angels, USA
                  </p>
                  <div className="our-doctor-thirteen-imgone">
                    <img
                      src={add_circle}
                      alt=""
                      className="img-fluid imgColorSecondary"
                    />
                  </div>
                </div>
              </div>
            </OwlCarousel>
          </div>
        </div>
        <div className="our-doctor-thirteen-one">
          <img src={pulse_1} alt="" className='imgColorSecondary' />
          <img src={pulse_3} alt="" className='imgColorSecondary' />
          <img src={pulse_2} alt="" className='imgColorSecondary' />
          <img src={pulse_3} alt="" className='imgColorSecondary' />
        </div>
      </div>
    </Fragment>
  )
});

export default DoctorsSection;