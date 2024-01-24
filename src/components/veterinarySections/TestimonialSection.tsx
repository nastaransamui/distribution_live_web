/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect } from 'react'
import AOS from 'aos'
import dynamic from 'next/dynamic'
import useScssVar from '@/hooks/useScssVar'
import { useTheme } from '@mui/material'
const Owlcarousel = dynamic(() => import('react-owl-carousel'), { ssr: false })

import { client09, client10, home_12_testimonial, two_paw } from "../../../public/assets/imagepath";

const TestimonialSection: FC = (() => {

  const { muiVar } = useScssVar();
  const theme = useTheme();
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);
  const options = {
    loop: true,
    margin: 24,
    dots: false,
    nav: true,
    smartSpeed: 2000,
    navText: ['<i class="fa-solid fa-caret-left "></i>', '<i class="fa-solid fa-caret-right"></i>'],
    responsive: {
      0: {
        items: 1
      },
      500: {
        items: 1
      },
      768: {
        items: 1
      },
      1000: {
        items: 1
      },
      1300: {
        items: 1
      }
    }
  };

  return (
    <Fragment>
      <section className="clients-section-fourteen" style={muiVar}>
        <div className="floating-bg">
          <img src={two_paw} alt="" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-5">
              <div className="client-inner-main">
                <img
                  src={home_12_testimonial}
                  alt="image"
                  className="img-fluid"
                />
              </div>
            </div>
            <div className="col-lg-7 col-md-12">
              <div className="section-header-fourteen service-inner-fourteen">
                <div className="service-inner-fourteen">
                  <div className="service-inner-fourteen-two">
                    <h3>CLIENT REVIEWS</h3>
                  </div>
                </div>
                <h2>Testimonials</h2>
                <p>What our customers says about us</p>
              </div>
              <div
                className="feedback-slider-fourteen owl-theme aos"
                data-aos="fade-up"
              >
                <Owlcarousel className="feedback-slider-fourteen owl-theme aos" data-aos="fade-up"{...options}>
                  <div className="card feedback-card">
                    <div className="card-body feedback-card-body">
                      <div className="feedback-inner-main">
                        <div className="feedback-inner-img">
                          <img
                            src={client09}
                            alt="image"
                            className="img-fluid"
                          />
                          <div className="feedback-user-details">
                            <h4>Jenifer Robinson</h4>
                            <h6>Texas, USA</h6>
                            <div className="rating rating-fourteen">
                              <i className="fas fa-star filled" />
                              <i className="fas fa-star filled" />
                              <i className="fas fa-star filled" />
                              <i className="fas fa-star filled" />
                              <i className="fas fa-star" />
                            </div>
                          </div>
                        </div>
                        <p>
                          “Thank you! for giving excellent care of my doggies, the
                          best pet care ever! I recommend”
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="card feedback-card">
                    <div className="card-body feedback-card-body">
                      <div className="feedback-inner-main">
                        <div className="feedback-inner-img">
                          <img
                            src={client10}
                            alt="image"
                            className="img-fluid"
                          />
                          <div className="feedback-user-details">
                            <h4>Ronald Jacobs</h4>
                            <h6>Texas, USA</h6>
                            <div className="rating rating-fourteen">
                              <i className="fas fa-star filled" />
                              <i className="fas fa-star filled" />
                              <i className="fas fa-star filled" />
                              <i className="fas fa-star filled" />
                              <i className="fas fa-star" />
                            </div>
                          </div>
                        </div>
                        <p>
                          “Thank you! for giving excellent care of my doggies, the
                          best pet care ever! I recommend”
                        </p>
                      </div>
                    </div>
                  </div>
                </Owlcarousel>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
})

export default TestimonialSection;