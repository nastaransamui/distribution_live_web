/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import Link from 'next/link'
import useScssVar from '@/hooks/useScssVar'
import { useTheme } from '@mui/material';
import { featureImg7, featureImg8, featureImg9, featureImg10, featureImg11, featureImg12, doctor_19, doctor_20, doctor_21, doctor_22, doctor_23, doctor_24 } from '@/public/assets/imagepath';

const OurServices: FC = (() => {
  var { muiVar } = useScssVar();
  const theme = useTheme();

  return (
    <Fragment>
      <section className="service-section" style={muiVar}>
        <div className="container" >
          <div className="row" >
            <div className="col-md-12 aos" data-aos="fade-up">
              <div className="section-header-one section-header-slider">
                <h2 className="section-title">Our <span>Services</span></h2>
              </div>
            </div>
          </div>
          <div className="row row-gap aos" data-aos="fade-up" >
            <div className="col-md-6 col-sm-12 col-lg-4">
              <div className="listing-card">
                <div className="listing-img">
                  <Link href="/doctors">
                    <img src={featureImg7} className="img-fluid" alt="#" />
                  </Link>
                  <div className="fav-item">
                    <Link href="#" className="fav-icon">
                      <i className="fa fa-heart" />
                    </Link>
                  </div>
                </div>
                <div className="listing-content">
                  <div className="listing-details">
                    <div className="listing-title">
                      <h3>
                        <Link href="/doctors">Heart Valve Disease</Link>
                      </h3>
                    </div>
                    <div className="listing-profile-details">
                      <div className="listing-user">
                        <div className="listing-profile-img">
                          <Link href="/doctors/profile">
                            <img src={doctor_19} className="img-fluid" alt="#" />
                          </Link>
                        </div>
                        <div className="listing-user-details">
                          <span>Specialist</span>
                          <h6><Link href="/doctors/profile">Dr Anoop Shetty</Link></h6>
                        </div>
                      </div>
                      <div className="listing-btn">
                        <Link href="/doctors/booking" className="btn consult-btn">Consult</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12 col-lg-4">
              <div className="listing-card">
                <div className="listing-img">
                  <Link href="/doctors">
                    <img src={featureImg8} className="img-fluid" alt="#" />
                  </Link>
                  <div className="fav-item">
                    <Link href="#" className="fav-icon">
                      <i className="fa fa-heart" />
                    </Link>
                  </div>
                </div>
                <div className="listing-content">
                  <div className="listing-details">
                    <div className="listing-title">
                      <h3>
                        <Link href="/doctors">Coronary artery disease</Link>
                      </h3>
                    </div>
                    <div className="listing-profile-details">
                      <div className="listing-user">
                        <div className="listing-profile-img">
                          <Link href="/doctors/profile">
                            <img src={doctor_20} className="img-fluid" alt="#" />
                          </Link>
                        </div>
                        <div className="listing-user-details">
                          <span>Specialist</span>
                          <h6><Link href="/doctors/profile">Dr Simon Pearse</Link></h6>
                        </div>
                      </div>
                      <div className="listing-btn">
                        <Link href="/doctors/booking" className="btn consult-btn">Consult</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12 col-lg-4">
              <div className="listing-card">
                <div className="listing-img">
                  <Link href="/doctors">
                    <img src={featureImg9} className="img-fluid" alt="#" />
                  </Link>
                  <div className="fav-item">
                    <Link href="#" className="fav-icon">
                      <i className="fa fa-heart" />
                    </Link>
                  </div>
                </div>
                <div className="listing-content">
                  <div className="listing-details">
                    <div className="listing-title">
                      <h3>
                        <Link href="/doctors">High blood pressure</Link>
                      </h3>
                    </div>
                    <div className="listing-profile-details">
                      <div className="listing-user">
                        <div className="listing-profile-img">
                          <Link href="/doctors/profile">
                            <img src={doctor_21} className="img-fluid" alt="#" />
                          </Link>
                        </div>
                        <div className="listing-user-details">
                          <span>Specialist</span>
                          <h6><Link href="/doctors/profile">Dr Rajan Sharma</Link></h6>
                        </div>
                      </div>
                      <div className="listing-btn">
                        <Link href="/doctors/booking" className="btn consult-btn">Consult</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12 col-lg-4">
              <div className="listing-card">
                <div className="listing-img">
                  <Link href="/doctors">
                    <img src={featureImg10} className="img-fluid" alt="#" />
                  </Link>
                  <div className="fav-item">
                    <Link href="#" className="fav-icon">
                      <i className="fa fa-heart" />
                    </Link>
                  </div>
                </div>
                <div className="listing-content">
                  <div className="listing-details">
                    <div className="listing-title">
                      <h3>
                        <Link href="/doctors">Heart attack</Link>
                      </h3>
                    </div>
                    <div className="listing-profile-details">
                      <div className="listing-user">
                        <div className="listing-profile-img">
                          <Link href="/doctors/profile">
                            <img src={doctor_22} className="img-fluid" alt="#" />
                          </Link>
                        </div>
                        <div className="listing-user-details">
                          <span>Specialist</span>
                          <h6><Link href="/doctors/profile">Dr John Paul</Link></h6>
                        </div>
                      </div>
                      <div className="listing-btn">
                        <Link href="/doctors/booking" className="btn consult-btn">Consult</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12 col-lg-4">
              <div className="listing-card">
                <div className="listing-img">
                  <Link href="/doctors">
                    <img src={featureImg11} className="img-fluid" alt="#" />
                  </Link>
                  <div className="fav-item">
                    <Link href="#" className="fav-icon">
                      <i className="fa fa-heart" />
                    </Link>
                  </div>
                </div>
                <div className="listing-content">
                  <div className="listing-details">
                    <div className="listing-title">
                      <h3>
                        <Link href="/doctors">Heart palpitations</Link>
                      </h3>
                    </div>
                    <div className="listing-profile-details">
                      <div className="listing-user">
                        <div className="listing-profile-img">
                          <Link href="/doctors/profile">
                            <img src={doctor_23} className="img-fluid" alt="#" />
                          </Link>
                        </div>
                        <div className="listing-user-details">
                          <span>Specialist</span>
                          <h6><Link href="/doctors/profile">Dr Marry Peter</Link></h6>
                        </div>
                      </div>
                      <div className="listing-btn">
                        <Link href="/doctors/booking" className="btn consult-btn">Consult</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12 col-lg-4">
              <div className="listing-card">
                <div className="listing-img">
                  <Link href="/doctors">
                    <img src={featureImg12} className="img-fluid" alt="#" />
                  </Link>
                  <div className="fav-item">
                    <Link href="#" className="fav-icon">
                      <i className="fa fa-heart" />
                    </Link>
                  </div>
                </div>
                <div className="listing-content">
                  <div className="listing-details">
                    <div className="listing-title">
                      <h3>
                        <Link href="/doctors">Heart palpitations</Link>
                      </h3>
                    </div>
                    <div className="listing-profile-details">
                      <div className="listing-user">
                        <div className="listing-profile-img">
                          <Link href="/doctors/profile">
                            <img src={doctor_24} className="img-fluid" alt="#" />
                          </Link>
                        </div>
                        <div className="listing-user-details">
                          <span>Specialist</span>
                          <h6><Link href="/doctors/profile">Dr Juliana</Link></h6>
                        </div>
                      </div>
                      <div className="listing-btn">
                        <Link href="/doctors/booking" className="btn consult-btn">Consult</Link>
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

export default OurServices