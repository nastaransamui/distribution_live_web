/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import Link from 'next/link'
import useScssVar from '@/hooks/useScssVar'
import { Typography, useTheme } from '@mui/material';
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
                  <Link href="/doctors" aria-label="search">
                    <img src={featureImg7} className="img-fluid" alt="#" />
                  </Link>
                  <div className="fav-item">
                    <Link href="#" className="fav-icon" aria-label="fav">
                      <i className="fa fa-heart" />
                    </Link>
                  </div>
                </div>
                <div className="listing-content">
                  <div className="listing-details">
                    <div className="listing-title">
                      <h3>
                        <Link href="/doctors" aria-label="search">Heart Valve Disease</Link>
                      </h3>
                    </div>
                    <div className="listing-profile-details">
                      <div className="listing-user">
                        <div className="listing-profile-img">
                          <Link href="/doctors/search" aria-label="search">
                            <img src={doctor_19} className="img-fluid" alt="#" />
                          </Link>
                        </div>
                        <div className="listing-user-details">
                          <span>Specialist</span>
                          <Typography component="h4"><Link href="/doctors/search" aria-label="search">Dr Anoop Shetty</Link></Typography>
                        </div>
                      </div>
                      <div className="listing-btn">
                        <Link href="/doctors/search" className="btn consult-btn" aria-label="consult">Consult</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12 col-lg-4">
              <div className="listing-card">
                <div className="listing-img">
                  <Link href="/doctors" aria-label="search">
                    <img src={featureImg8} className="img-fluid" alt="#" />
                  </Link>
                  <div className="fav-item">
                    <Link href="#" className="fav-icon" aria-label="fav">
                      <i className="fa fa-heart" />
                    </Link>
                  </div>
                </div>
                <div className="listing-content">
                  <div className="listing-details">
                    <div className="listing-title">
                      <h3>
                        <Link href="/doctors" aria-label="search">Coronary artery disease</Link>
                      </h3>
                    </div>
                    <div className="listing-profile-details">
                      <div className="listing-user">
                        <div className="listing-profile-img">
                          <Link href="/doctors/search" aria-label="search">
                            <img src={doctor_20} className="img-fluid" alt="#" />
                          </Link>
                        </div>
                        <div className="listing-user-details">
                          <span>Specialist</span>
                          <Typography component="h4"><Link href="/doctors/search" aria-label="search">Dr Simon Pearse</Link></Typography>
                        </div>
                      </div>
                      <div className="listing-btn">
                        <Link href="/doctors/search" className="btn consult-btn" aria-label="consult">Consult</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12 col-lg-4">
              <div className="listing-card">
                <div className="listing-img">
                  <Link href="/doctors" aria-label="search">
                    <img src={featureImg9} className="img-fluid" alt="#" />
                  </Link>
                  <div className="fav-item">
                    <Link href="#" className="fav-icon" aria-label="fav">
                      <i className="fa fa-heart" />
                    </Link>
                  </div>
                </div>
                <div className="listing-content">
                  <div className="listing-details">
                    <div className="listing-title">
                      <h3>
                        <Link href="/doctors" aria-label="search">High blood pressure</Link>
                      </h3>
                    </div>
                    <div className="listing-profile-details">
                      <div className="listing-user">
                        <div className="listing-profile-img">
                          <Link href="/doctors/search" aria-label="search">
                            <img src={doctor_21} className="img-fluid" alt="#" />
                          </Link>
                        </div>
                        <div className="listing-user-details">
                          <span>Specialist</span>
                          <Typography component="h4"><Link href="/doctors/search" aria-label="search">Dr Rajan Sharma</Link></Typography>
                        </div>
                      </div>
                      <div className="listing-btn">
                        <Link href="/doctors/search" className="btn consult-btn" aria-label="consult">Consult</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12 col-lg-4">
              <div className="listing-card">
                <div className="listing-img">
                  <Link href="/doctors" aria-label="search">
                    <img src={featureImg10} className="img-fluid" alt="#" />
                  </Link>
                  <div className="fav-item">
                    <Link href="#" className="fav-icon" aria-label="fav">
                      <i className="fa fa-heart" />
                    </Link>
                  </div>
                </div>
                <div className="listing-content">
                  <div className="listing-details">
                    <div className="listing-title">
                      <h3>
                        <Link href="/doctors" aria-label="search">Heart attack</Link>
                      </h3>
                    </div>
                    <div className="listing-profile-details">
                      <div className="listing-user">
                        <div className="listing-profile-img">
                          <Link href="/doctors/search" aria-label="search">
                            <img src={doctor_22} className="img-fluid" alt="#" />
                          </Link>
                        </div>
                        <div className="listing-user-details">
                          <span>Specialist</span>
                          <Typography component="h4"><Link href="/doctors/search" aria-label="search">Dr John Paul</Link></Typography>
                        </div>
                      </div>
                      <div className="listing-btn">
                        <Link href="/doctors/search" className="btn consult-btn" aria-label="consult">Consult</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12 col-lg-4">
              <div className="listing-card">
                <div className="listing-img">
                  <Link href="/doctors" aria-label="search">
                    <img src={featureImg11} className="img-fluid" alt="#" />
                  </Link>
                  <div className="fav-item">
                    <Link href="#" className="fav-icon" aria-label="fav">
                      <i className="fa fa-heart" />
                    </Link>
                  </div>
                </div>
                <div className="listing-content">
                  <div className="listing-details">
                    <div className="listing-title">
                      <h3>
                        <Link href="/doctors" aria-label="search">Heart palpitations</Link>
                      </h3>
                    </div>
                    <div className="listing-profile-details">
                      <div className="listing-user">
                        <div className="listing-profile-img">
                          <Link href="/doctors/search" aria-label="search">
                            <img src={doctor_23} className="img-fluid" alt="#" />
                          </Link>
                        </div>
                        <div className="listing-user-details">
                          <span>Specialist</span>
                          <Typography component="h4"><Link href="/doctors/search">Dr Marry Peter</Link></Typography>
                        </div>
                      </div>
                      <div className="listing-btn">
                        <Link href="/doctors/search" className="btn consult-btn" aria-label="consult">Consult</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12 col-lg-4">
              <div className="listing-card">
                <div className="listing-img">
                  <Link href="/doctors" aria-label="search">
                    <img src={featureImg12} className="img-fluid" alt="#" />
                  </Link>
                  <div className="fav-item">
                    <Link href="#" className="fav-icon" aria-label="fav">
                      <i className="fa fa-heart" />
                    </Link>
                  </div>
                </div>
                <div className="listing-content">
                  <div className="listing-details">
                    <div className="listing-title">
                      <h3>
                        <Link href="/doctors" aria-label="search">Heart palpitations</Link>
                      </h3>
                    </div>
                    <div className="listing-profile-details">
                      <div className="listing-user">
                        <div className="listing-profile-img">
                          <Link href="/doctors/search" aria-label="search">
                            <img src={doctor_24} className="img-fluid" alt="#" />
                          </Link>
                        </div>
                        <div className="listing-user-details">
                          <span>Specialist</span>
                          <Typography component="h4"><Link href="/doctors/search" aria-label="search">Dr Juliana</Link></Typography>
                        </div>
                      </div>
                      <div className="listing-btn">
                        <Link href="/doctors/search" className="btn consult-btn" aria-label="search">Consult</Link>
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