/* eslint-disable @next/next/no-img-element */
import { FC } from 'react'
import useScssVar from '@/hooks/useScssVar'
import {
  Service_doctor_01,
  Service_doctor_02,
  Service_doctor_03,
  Service_doctor_04,
  Service_doctor_05,
  Service_doctor_06,
  Service_doctor_07,
  Service_doctor_08,
  Service_doctor_09,
  Service_doctor_10,
  service_img,
  service_img_01,
  service_img_02,
  service_sec_bg,
} from '@/public/assets/imagepath'

import Link from 'next/link';

const OurServices: FC = (() => {
  const { muiVar } = useScssVar();

  return (
    <section className="service-sec-fourteen" style={muiVar}>
      <div className="section-bg">
        <img src={service_sec_bg} alt="Img" />
      </div>
      <div className="container">
        <div className="section-head-fourteen">
          <h2>
            Our <span> Services</span>
          </h2>
          <p>More the quantity, higher the discount. Hurry, Buy Now!</p>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-4 col-md-12 d-flex">
            <div className="service-type-cards w-100">
              <div className="service-types" data-aos="fade-down">
                <div className="doctor-image">
                  <Link href="" onClick={(e) => e.preventDefault()}>
                    <img src={Service_doctor_01} alt="Img" />
                  </Link>
                </div>
                <div className="service-content">
                  <h3>
                    <Link href="" onClick={(e) => e.preventDefault()}>Nurse at Home</Link>
                  </h3>
                  <Link href="" onClick={(e) => e.preventDefault()} className="explore-link">
                    Explore
                    <i className="feather-arrow-right-circle" />
                  </Link>
                </div>
              </div>
              <div className="service-types" data-aos="fade-down">
                <div className="doctor-image">
                  <Link href="" onClick={(e) => e.preventDefault()}>
                    <img src={Service_doctor_02} alt="Img" />
                  </Link>
                </div>
                <div className="service-content">
                  <h3>
                    <Link href="" onClick={(e) => e.preventDefault()}>Mobility Assistance</Link>
                  </h3>
                  <Link href="" onClick={(e) => e.preventDefault()} className="explore-link">
                    Explore
                    <i className="feather-arrow-right-circle" />
                  </Link>
                </div>
              </div>
              <div className="service-types" data-aos="fade-down">
                <div className="doctor-image">
                  <Link href="" onClick={(e) => e.preventDefault()}>
                    <img src={Service_doctor_03} alt="Img" />
                  </Link>
                </div>
                <div className="service-content">
                  <h3>
                    <Link href="" onClick={(e) => e.preventDefault()}>Physiotherapy</Link>
                  </h3>
                  <Link href="" onClick={(e) => e.preventDefault()} className="explore-link">
                    Explore
                    <i className="feather-arrow-right-circle" />
                  </Link>
                </div>
              </div>
              <div className="service-types" data-aos="fade-down">
                <div className="doctor-image">
                  <Link href="" onClick={(e) => e.preventDefault()}>
                    <img src={Service_doctor_04} alt="Img" />
                  </Link>
                </div>
                <div className="service-content">
                  <h3>
                    <Link href="" onClick={(e) => e.preventDefault()}>Medical Equipment</Link>
                  </h3>
                  <Link href="" onClick={(e) => e.preventDefault()} className="explore-link">
                    Explore
                    <i className="feather-arrow-right-circle" />
                  </Link>
                </div>
              </div>
              <div className="service-types" data-aos="fade-down">
                <div className="doctor-image">
                  <Link href="" onClick={(e) => e.preventDefault()}>
                    <img src={Service_doctor_05} alt="Img" />
                  </Link>
                </div>
                <div className="service-content">
                  <h3>
                    <Link href="" onClick={(e) => e.preventDefault()}>Trained Attendants</Link>
                  </h3>
                  <Link href="" onClick={(e) => e.preventDefault()} className="explore-link">
                    Explore
                    <i className="feather-arrow-right-circle" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 d-flex">
            <div className="services-img-col w-100">
              <div className="sec-img-center">
                <img src={service_img} alt="Img" />
              </div>
              <div
                className="img-center img-center-one"
                data-aos="fade-down"
                data-aos-delay={500}
              >
                <img src={service_img_01} alt="Img" />
              </div>
              <div
                className="img-center img-center-two"
                data-aos="fade-up"
                data-aos-delay={800}
              >
                <img src={service_img_02} alt="Img" />
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-12 d-flex">
            <div className="service-type-cards w-100">
              <div
                className="service-types service-type-right"
                data-aos="fade-down"
              >
                <div className="service-content">
                  <h3>
                    <Link href="" onClick={(e) => e.preventDefault()}>Lab Tests</Link>
                  </h3>
                  <Link href="" onClick={(e) => e.preventDefault()} className="explore-link">
                    Explore
                    <i className="feather-arrow-right-circle" />
                  </Link>
                </div>
                <div className="doctor-image">
                  <Link href="" onClick={(e) => e.preventDefault()}>
                    <img src={Service_doctor_06} alt="Img" />
                  </Link>
                </div>
              </div>
              <div
                className="service-types service-type-right"
                data-aos="fade-down"
              >
                <div className="service-content">
                  <h3>
                    <Link href="" onClick={(e) => e.preventDefault()}>Doctor Consultation</Link>
                  </h3>
                  <Link href="" onClick={(e) => e.preventDefault()} className="explore-link">
                    Explore
                    <i className="feather-arrow-right-circle" />
                  </Link>
                </div>
                <div className="doctor-image">
                  <Link href="" onClick={(e) => e.preventDefault()}>
                    <img src={Service_doctor_07} alt="Img" />
                  </Link>
                </div>
              </div>
              <div
                className="service-types service-type-right"
                data-aos="fade-down"
              >
                <div className="service-content">
                  <h3>
                    <Link href="" onClick={(e) => e.preventDefault()}>Mother &amp; Baby Care</Link>
                  </h3>
                  <Link href="" onClick={(e) => e.preventDefault()} className="explore-link">
                    Explore
                    <i className="feather-arrow-right-circle" />
                  </Link>
                </div>
                <div className="doctor-image">
                  <Link href="" onClick={(e) => e.preventDefault()}>
                    <img src={Service_doctor_08} alt="Img" />
                  </Link>
                </div>
              </div>
              <div
                className="service-types service-type-right"
                data-aos="fade-down"
              >
                <div className="service-content">
                  <h3>
                    <Link href="" onClick={(e) => e.preventDefault()}>Vaccination</Link>
                  </h3>
                  <Link href="" onClick={(e) => e.preventDefault()} className="explore-link">
                    Explore
                    <i className="feather-arrow-right-circle" />
                  </Link>
                </div>
                <div className="doctor-image">
                  <Link href="" onClick={(e) => e.preventDefault()}>
                    <img src={Service_doctor_09} alt="Img" />
                  </Link>
                </div>
              </div>
              <div
                className="service-types service-type-right"
                data-aos="fade-down"
              >
                <div className="service-content">
                  <h3>
                    <Link href="" onClick={(e) => e.preventDefault()}>Tele Consultation</Link>
                  </h3>
                  <Link href="" onClick={(e) => e.preventDefault()} className="explore-link">
                    Explore
                    <i className="feather-arrow-right-circle" />
                  </Link>
                </div>
                <div className="doctor-image">
                  <Link href="" onClick={(e) => e.preventDefault()}>
                    <img src={Service_doctor_10} alt="Img" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

export default OurServices