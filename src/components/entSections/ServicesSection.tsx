/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect } from 'react'
import Link from 'next/link'
import AOS from 'aos'
import { useTheme } from '@mui/material'
import useScssVar from '@/hooks/useScssVar'
import { service_service_3, service_service_2, service_service_1 } from '@/public/assets/imagepath'


const ServicesSection: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();

  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);
  return (
    <Fragment>
      <section className="services-section-fifteen" style={{ ...muiVar, backgroundColor: theme.palette.background.paper }}>
        <div className="service-bg-icon">
          <img src={`/assets/images/serive-bg-icon_${theme.palette.secondary.light.slice(1)}.webp`} alt="" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-header-fifteen text-center">
                <h2>
                  Our <span>Services</span>
                </h2>
                <p>
                  Our goal is to give the patient maximum relief within minimal pain
                  inflicted
                </p>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6">
              <div className="item">
                <div className="doctor-profile-widget-fifteen">
                  <div className="doc-pro-img">
                    <Link href="/doctors/search" aria-label='Search doctor'>
                      <div className="doctor-profile-img" style={{ height: 'unset' }}>
                        <img
                          src={service_service_3}
                          className="img-fluid"
                          style={{ objectFit: 'cover' }}
                          alt=""
                        />
                      </div>
                    </Link>
                  </div>
                  <div className="doc-content-bottom">
                    <div className="doc-content-split">
                      <Link href="/doctors/search" aria-label='Search doctor'>EAR Treatment</Link>
                      <span>5+ Services</span>
                    </div>
                    <p>
                      Surgery for the human sensory organs like the ear requires
                      precision to achieve desirable results.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="item">
                <div className="doctor-profile-widget-fifteen">
                  <div className="doc-pro-img">
                    <Link href="/doctors/search" aria-label='Search doctor'>
                      <div className="doctor-profile-img" style={{ height: 'unset' }}>
                        <img
                          src={service_service_2}
                          className="img-fluid"
                          style={{ objectFit: 'cover' }}
                          alt=""
                        />
                      </div>
                    </Link>
                  </div>
                  <div className="doc-content-bottom">
                    <div className="doc-content-split">
                      <Link href="/doctors/search" aria-label='Search doctor'>Nose and Sinus</Link>
                      <span>10+ Services</span>
                    </div>
                    <p>
                      The cranial aspect of the human body commanded respect from
                      patients and doctors alike.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="item">
                <div className="doctor-profile-widget-fifteen">
                  <div className="doc-pro-img">
                    <Link href="/doctors/search" aria-label='Search doctor'>
                      <div className="doctor-profile-img" style={{ height: 'unset' }}>
                        <img
                          src={service_service_1}
                          className="img-fluid"
                          style={{ objectFit: 'cover' }}
                          alt=""
                        />
                      </div>
                    </Link>
                  </div>
                  <div className="doc-content-bottom">
                    <div className="doc-content-split">
                      <Link href="/doctors/search" aria-label='Search doctor'>Throat / Larynx Surgery</Link>
                      <span>15+ Services</span>
                    </div>
                    <p>
                      Laryngoplasty was introduced and popularised by Isshiki in the
                      1970’s.
                    </p>
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

export default ServicesSection;