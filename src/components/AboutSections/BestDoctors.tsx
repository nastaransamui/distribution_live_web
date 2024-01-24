/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import { doctorImg1, doctorImg2, doctorImg3, doctorImg4 } from '../../../public/assets/imagepath';


const BestDoctors: FC = (() => {
  const { muiVar } = useScssVar()

  return (
    <Fragment>
      <section className="doctors-section professional-section" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-inner-header text-center">
                <h2>Best Doctors</h2>
              </div>
            </div>
          </div>
          <div className="row">
            {/* Doctor Item */}
            <div className="col-lg-3 col-md-6 d-flex">
              <div className="doctor-profile-widget w-100">
                <div className="doc-pro-img">
                  <Link href="/doctors/profile">
                    <div className="doctor-profile-img">
                      <img
                        src={doctorImg1}
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
                      <i className="feather-map-pin" /> Newyork, USA
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* /Doctor Item */}
            {/* Doctor Item */}
            <div className="col-lg-3 col-md-6 d-flex">
              <div className="doctor-profile-widget w-100">
                <div className="doc-pro-img">
                  <Link href="/doctors/profile">
                    <div className="doctor-profile-img">
                      <img
                        src={doctorImg2}
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
                      <i className="feather-map-pin" /> Florida, USA
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* /Doctor Item */}
            {/* Doctor Item */}
            <div className="col-lg-3 col-md-6 d-flex">
              <div className="doctor-profile-widget w-100">
                <div className="doc-pro-img">
                  <Link href="/doctors/profile">
                    <div className="doctor-profile-img">
                      <img
                        src={doctorImg3}
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
                      <i className="feather-map-pin" /> Georgia, USA
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* /Doctor Item */}
            {/* Doctor Item */}
            <div className="col-lg-3 col-md-6 d-flex">
              <div className="doctor-profile-widget w-100">
                <div className="doc-pro-img">
                  <Link href="/doctors/profile">
                    <div className="doctor-profile-img">
                      <img
                        src={doctorImg4}
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
                      <i className="feather-map-pin" /> Michigan, USA
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* /Doctor Item */}
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default BestDoctors;