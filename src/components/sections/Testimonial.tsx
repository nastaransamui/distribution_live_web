/* eslint-disable @next/next/no-img-element */
import useScssVar from '@/hooks/useScssVar';
import { useTheme } from '@mui/material';
import { FC, Fragment } from 'react'
import Slider from 'react-slick'
import { client04, client03, client06, client07 } from '../../../public/assets/imagepath';

const Testimonial: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  const settings = {
    arrows: true,
    dots: false,
    autoplay: false,
    infinite: true,
    // prevArrow: true,
    // nextArrow: false,
    rtl: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [{
      breakpoint: 992,
      settings: {
        slidesToShow: 1
      }
    },
    {
      breakpoint: 776,
      settings: {
        slidesToShow: 1
      }
    },
    {
      breakpoint: 567,
      settings: {
        slidesToShow: 1
      }
    }]
  };
  return (
    <Fragment>
      <section className="testimonial-section" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="testimonial-slider slick">
                <Slider {...settings}>
                  <div className="testimonial-grid">
                    <div className="testimonial-info">
                      <div className="testimonial-img">
                        <img
                          src={client04}
                          className="img-fluid"
                          alt=""
                        />
                      </div>
                      <div className="testimonial-content">
                        <div className="section-header section-inner-header testimonial-header">
                          <h1>Testimonials</h1>
                          <h2>What Our Client Says</h2>
                        </div>
                        <div className="testimonial-details">
                          <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                            sed do eiusmod tempor incididunt ut labore et dolore magna
                            aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            Duis aute irure dolor in reprehenderit in voluptate velit
                            esse cillum dolore eu fugiat nulla pariatur.
                          </p>
                          <h3>
                            <span>John Doe</span> New York
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="testimonial-grid">
                    <div className="testimonial-info">
                      <div className="testimonial-img">
                        <img
                          src={client03}
                          className="img-fluid"
                          alt=""
                        />
                      </div>
                      <div className="testimonial-content">
                        <div className="section-header section-inner-header testimonial-header">
                          <h5>Testimonials</h5>
                          <h2>What Our Client Says</h2>
                        </div>
                        <div className="testimonial-details">
                          <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                            sed do eiusmod tempor incididunt ut labore et dolore magna
                            aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            Duis aute irure dolor in reprehenderit in voluptate velit
                            esse cillum dolore eu fugiat nulla pariatur.
                          </p>
                          <h6>
                            <span>Amanda Warren</span> Florida
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="testimonial-grid">
                    <div className="testimonial-info">
                      <div className="testimonial-img">
                        <img
                          src={client06}
                          className="img-fluid"
                          alt=""
                        />
                      </div>
                      <div className="testimonial-content">
                        <div className="section-header section-inner-header testimonial-header">
                          <h5>Testimonials</h5>
                          <h2>What Our Client Says</h2>
                        </div>
                        <div className="testimonial-details">
                          <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                            sed do eiusmod tempor incididunt ut labore et dolore magna
                            aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            Duis aute irure dolor in reprehenderit in voluptate velit
                            esse cillum dolore eu fugiat nulla pariatur.
                          </p>
                          <h6>
                            <span>Betty Carlson</span> Georgia
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="testimonial-grid">
                    <div className="testimonial-info">
                      <div className="testimonial-img">
                        <img
                          src={client07}
                          className="img-fluid"
                          alt=""
                        />
                      </div>
                      <div className="testimonial-content">
                        <div className="section-header section-inner-header testimonial-header">
                          <h5>Testimonials</h5>
                          <h2>What Our Client Says</h2>
                        </div>
                        <div className="testimonial-details">
                          <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                            sed do eiusmod tempor incididunt ut labore et dolore magna
                            aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            Duis aute irure dolor in reprehenderit in voluptate velit
                            esse cillum dolore eu fugiat nulla pariatur.
                          </p>
                          <h6>
                            <span>Veronica</span> California
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="testimonial-grid">
                    <div className="testimonial-info">
                      <div className="testimonial-img">
                        <img
                          src={client07}
                          className="img-fluid"
                          alt=""
                        />
                      </div>
                      <div className="testimonial-content">
                        <div className="section-header section-inner-header testimonial-header">
                          <h5>Testimonials</h5>
                          <h2>What Our Client Says</h2>
                        </div>
                        <div className="testimonial-details">
                          <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                            sed do eiusmod tempor incididunt ut labore et dolore magna
                            aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            Duis aute irure dolor in reprehenderit in voluptate velit
                            esse cillum dolore eu fugiat nulla pariatur.
                          </p>
                          <h6>
                            <span>Richard</span> Michigan
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
})

export default Testimonial