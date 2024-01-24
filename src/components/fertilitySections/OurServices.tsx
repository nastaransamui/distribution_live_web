/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import { useTheme } from '@mui/material';
import { service_six_1, service_six_2, service_six_3, service_six_4, services_six_1 } from '../../../public/assets/imagepath';
import { ServeImageIconOneSvg, ServeImageIconThreeSvg, ServeImageIconTwoSvg } from '../../../public/assets/images/icons/IconsSvgs';

const OurServices: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();

  return (
    <Fragment>
      <section className="services-section-fourteen" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 aos" data-aos="fade-up">
              <div className="section-header-fourteen service-inner-fourteen">
                <div className="service-inner-fourteen">
                  <div className="service-inner-fourteen-one"></div>
                  <div className="service-inner-fourteen-two">
                    <h3>Our Services</h3>
                  </div>
                  <div className="service-inner-fourteen-three"></div>
                </div>
                <h2>Best Quality Services for you</h2>
              </div>
              <div className="service-inner-img-fourt-all">
                <div className="service-inner-img-fourt">
                  <img
                    src={services_six_1}
                    alt="image"
                    className="img-fluid"
                  />
                </div>
                <div className="service-inner-img-fourtone">
                  <ServeImageIconTwoSvg />
                </div>
                <div className="service-inner-img-fourttwo">
                  <ServeImageIconOneSvg />
                </div>
                <div className="service-inner-img-fourtthree">
                  <ServeImageIconThreeSvg />
                </div>
              </div>
            </div>
            <div className="col-lg-6 aos" data-aos="fade-up">
              <div className="row">
                <div className="col-lg-6 col-md-4 col-sm-6">
                  <div className="card service-inner-fourt-all">
                    <div className="card-body service-inner-fourt-main">
                      <div className="service-inner-right-fourt">
                        <Link href="/pages/patient-details">
                          <div className="service-inner-right-img">
                            <img src={service_six_1} alt="image" />
                          </div>
                        </Link>
                        <Link
                          href="/pages/patient-details"
                          className="service-inner-right-fourt-care"
                        >
                          Pregnancy Care
                        </Link>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                          sed.
                        </p>
                        <Link
                          href="/patient-details"
                          className="service-inner-right-fourt-caretwo"
                        >
                          Learn More <i className="fa-solid fa-arrow-right ms-2" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-4 col-sm-6">
                  <div className="card service-inner-fourt-all">
                    <div className="card-body service-inner-fourt-main">
                      <div className="service-inner-right-fourt">
                        <Link href="/pages/patient-details">
                          <div className="service-inner-right-img">
                            <img src={service_six_2} alt="image" />
                          </div>
                        </Link>
                        <Link
                          href="/patient-details"
                          className="service-inner-right-fourt-care"
                        >
                          Fertility Medication
                        </Link>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                          sed.
                        </p>
                        <Link
                          href="/patient-details"
                          className="service-inner-right-fourt-caretwo"
                        >
                          Learn More <i className="fa-solid fa-arrow-right ms-2" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-4 col-sm-6">
                  <div className="card service-inner-fourt-all">
                    <div className="card-body service-inner-fourt-main">
                      <div className="service-inner-right-fourt">
                        <Link href="/patient-details">
                          <div className="service-inner-right-img">
                            <img src={service_six_3} alt="image" />
                          </div>
                        </Link>
                        <Link
                          href="/patient-details"
                          className="service-inner-right-fourt-care"
                        >
                          Gynecology
                        </Link>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                          sed.
                        </p>
                        <Link
                          href="/patient-details"
                          className="service-inner-right-fourt-caretwo"
                        >
                          Learn More <i className="fa-solid fa-arrow-right ms-2" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-4 col-sm-6">
                  <div className="card service-inner-fourt-all">
                    <div className="card-body service-inner-fourt-main">
                      <div className="service-inner-right-fourt">
                        <Link href="/patient-details">
                          <div className="service-inner-right-img">
                            <img src={service_six_4} alt="image" />
                          </div>
                        </Link>
                        <Link
                          href="/patient-details"
                          className="service-inner-right-fourt-care"
                        >
                          Prenatal Ultrasound
                        </Link>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                          sed.
                        </p>
                        <Link
                          href="/patient-details"
                          className="service-inner-right-fourt-caretwo"
                        >
                          Learn More <i className="fa-solid fa-arrow-right ms-2" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="btn-sec-fourteen">
                <Link href="/patient-profile" className="btn btn-primary btns-view">
                  View All Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default OurServices;