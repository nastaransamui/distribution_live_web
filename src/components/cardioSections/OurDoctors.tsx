/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link'
import { doctor_13, doctor_14, doctor_15, doctor_16, ecgwave, hexagon_group_1, hexagon_group_2 } from '../../../public/assets/imagepath';
import { useTheme } from '@mui/material';

const OurDoctors: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();

  return (
    <Fragment>
      <section className="our-doctor-section" style={muiVar}>
        <div className="section-floating-bg">
          <img src={hexagon_group_1} alt="" />
          <img src={hexagon_group_2} alt="" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-12 aos" data-aos="fade-up">
              <div className="section-header-one section-header-slider">
                <h2 className="section-title">
                  Our Specialist <span>Doctors</span>
                </h2>
              </div>
            </div>
          </div>
          <div className="row row-gap aos" data-aos="fade-up">
            <div className="col-md-4 col-sm-12 col-lg-3">
              <div className="module-border-wrap">
                <div className="listing-card">
                  <div className="listing-img">
                    <Link href="/doctors/profile">
                      <img
                        src={doctor_13}
                        className="img-fluid"
                        alt=""
                      />
                    </Link>
                    <div className="fav-item">
                      <div className="featured-rating">
                        <i className="fa fa-star " /> <span>4.5</span>
                      </div>
                      <Link href="#" className="fav-icon">
                        <i className="fa fa-heart" />
                      </Link>
                    </div>
                  </div>
                  <div className="listing-content">
                    <div className="listing-details">
                      <div className="listing-category">
                        <Link href="#" className="listing-category-tag tag-green">Cardiology</Link>
                        <Link href="#" className="listing-category-tag tag-purple">physiology</Link>
                      </div>
                      <div className="listing-profile-details">
                        <div className="listing-floating-img">
                          <img src={ecgwave} alt="" />
                        </div>
                        <div className="listing-user">
                          <div className="listing-user-details">
                            <h6>
                              <Link href="/doctors/profile">Dr Jonathan Behar </Link>
                            </h6>
                            <span>Cardiologist</span>
                          </div>
                        </div>
                        <div className="listing-btn">
                          <Link href="/doctors/booking" className="btn consult-btn">
                            Consult
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-12 col-lg-3">
              <div className="module-border-wrap">
                <div className="listing-card">
                  <div className="listing-img">
                    <Link href="/doctors/profile">
                      <img
                        src={doctor_14}
                        className="img-fluid"
                        alt=""
                      />
                    </Link>
                    <div className="fav-item">
                      <div className="featured-rating">
                        <i className="fa fa-star " /> <span>4.5</span>
                      </div>
                      <Link href="#" className="fav-icon">
                        <i className="fa fa-heart" />
                      </Link>
                    </div>
                  </div>
                  <div className="listing-content">
                    <div className="listing-details">
                      <div className="listing-category">
                        <Link href="#" className="listing-category-tag tag-red">Hypertension</Link>
                        <Link href="#" className="listing-category-tag tag-green">Cardiology</Link>
                      </div>
                      <div className="listing-profile-details">
                        <div className="listing-floating-img">
                          <img src={ecgwave} alt="" />
                        </div>
                        <div className="listing-user">
                          <div className="listing-user-details">
                            <h6>
                              <Link href="/doctors/profile">Dr Piers Clifford</Link>
                            </h6>
                            <span>Consultant Cardiologist</span>
                          </div>
                        </div>
                        <div className="listing-btn">
                          <Link href="/doctors/booking" className="btn consult-btn">
                            Consult
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-12 col-lg-3">
              <div className="module-border-wrap">
                <div className="listing-card">
                  <div className="listing-img">
                    <Link href="/doctors/profile">
                      <img
                        src={doctor_15}
                        className="img-fluid"
                        alt=""
                      />
                    </Link>
                    <div className="fav-item">
                      <div className="featured-rating">
                        <i className="fa fa-star " /> <span>4.5</span>
                      </div>
                      <Link href="#" className="fav-icon">
                        <i className="fa fa-heart" />
                      </Link>
                    </div>
                  </div>
                  <div className="listing-content">
                    <div className="listing-details">
                      <div className="listing-category">
                        <Link href="#" className="listing-category-tag tag-green">Cardiology</Link>
                        <Link href="#" className="listing-category-tag tag-purple">physiology</Link>
                      </div>
                      <div className="listing-profile-details">
                        <div className="listing-floating-img">
                          <img src={ecgwave} alt="" />
                        </div>
                        <div className="listing-user">
                          <div className="listing-user-details">
                            <h6>
                              <Link href="/doctors/profile">Dr Rajan Sharma</Link>
                            </h6>
                            <span>Cardiologist</span>
                          </div>
                        </div>
                        <div className="listing-btn">
                          <Link href="/doctors/booking" className="btn consult-btn">
                            Consult
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-12 col-lg-3">
              <div className="module-border-wrap">
                <div className="listing-card">
                  <div className="listing-img">
                    <Link href="/doctors/profile">
                      <img
                        src={doctor_16}
                        className="img-fluid"
                        alt=""
                      />
                    </Link>
                    <div className="fav-item">
                      <div className="featured-rating">
                        <i className="fa fa-star " /> <span>4.5</span>
                      </div>
                      <Link href="#" className="fav-icon">
                        <i className="fa fa-heart" />
                      </Link>
                    </div>
                  </div>
                  <div className="listing-content">
                    <div className="listing-details">
                      <div className="listing-category">
                        <Link href="#" className="listing-category-tag tag-red">Hypertension</Link>
                        <Link href="#" className="listing-category-tag tag-green">Cardiology</Link>
                      </div>
                      <div className="listing-profile-details">
                        <div className="listing-floating-img">
                          <img src={ecgwave} alt="" />
                        </div>
                        <div className="listing-user">
                          <div className="listing-user-details">
                            <h6>
                              <Link href="/doctors/profile">Dr Julian Collinson</Link>
                            </h6>
                            <span>Consultant Cardiologist</span>
                          </div>
                        </div>
                        <div className="listing-btn">
                          <Link href="/doctors/booking" className="btn consult-btn">
                            Consult
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
})

export default OurDoctors;