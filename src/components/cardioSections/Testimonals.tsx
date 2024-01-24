/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { client07, client08, client09, healthcare } from '../../../public/assets/imagepath';
import { useTheme } from '@mui/material';


const Testimonals: FC = (() => {
  const { muiVar } = useScssVar();

  const theme = useTheme();

  return (
    <Fragment>
      <div className="testimonial-section-ten need-to-know-section" style={muiVar}>
        <div className="floating-bg">
          <img src={healthcare} alt='' />
        </div>
        <div className="container" >
          <div className="row align-items-center">
            <div className="col-md-12 col-lg-5 aos" data-aos="fade-up" style={{ backgroundColor: theme.palette.background.default, borderRadius: `35px` }}>
              <div className="section-header-one section-header-slider">
                <h2 className="section-title" style={{ marginTop: 24 }}>What Our <span>Patients Say</span></h2>
                <div className="need-to-know-content">
                  <p>
                    If one of the valves in your heart becomes diseased it can affect the flow of blood.
                    This can happen in one of two ways: valve stenosis (where the valve does not fully
                    open and obstructs or restricts flow) or valve incompetence (where the valve does
                    not close properly and blood is allowed to leak backwards)....
                  </p>
                  <div className="patient-rating-block">
                    <div className="patient-rating">
                      <div className="circle-rating">
                        <i className="fa-solid fa-circle" />
                        <i className="fa-solid fa-circle" />
                        <i className="fa-solid fa-circle" />
                        <i className="fa-solid fa-circle" />
                        <i className="fa-solid fa-circle-half-stroke" />
                        <span>(4.8/5)</span>
                      </div>
                      <h5 style={{ marginBottom: 30 }}>Overall Customer Ratings</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-lg-7 aos" data-aos="fade-up">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <div className="testimonial-card">
                    <div className="testimonial-user-details">
                      <div className="testimonial-user-img">
                        <img src={client07} className="img-fluid" alt="#" />
                      </div>
                      <div className="testimonial-user-name">
                        <h5>
                          Martin Philips
                        </h5>
                        <div className="circle-rating">
                          <i className="fa-solid fa-circle" />
                          <i className="fa-solid fa-circle" />
                          <i className="fa-solid fa-circle" />
                          <i className="fa-solid fa-circle" />
                          <i className="fa-solid fa-circle-half-stroke" />
                        </div>
                      </div>
                    </div>
                    <div className="testmonial-user-coments">
                      <h6>“ Awesome Impact ”</h6>
                      <p>After suffering from a heart condition for a number of years I was very happy
                        to meet Doccure, from the first consultation where he believed there was a
                        solution...</p>
                    </div>
                  </div>
                  <div className="testimonial-card">
                    <div className="testimonial-user-details">
                      <div className="testimonial-user-img">
                        <img src={client08} className="img-fluid" alt="#" />
                      </div>
                      <div className="testimonial-user-name">
                        <h5>
                          James Anderson
                        </h5>
                        <div className="circle-rating">
                          <i className="fa-solid fa-circle" />
                          <i className="fa-solid fa-circle" />
                          <i className="fa-solid fa-circle" />
                          <i className="fa-solid fa-circle" />
                          <i className="fa-solid fa-circle-half-stroke" />
                        </div>
                      </div>
                    </div>
                    <div className="testmonial-user-coments">
                      <h6>“ I am very grateful ”</h6>
                      <p>Doctors explains everything clearly and helps you to understand even the most
                        complex medical terms</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="testimonial-card">
                    <div className="testimonial-user-details">
                      <div className="testimonial-user-img">
                        <img src={client09} className="img-fluid" alt="#" />
                      </div>
                      <div className="testimonial-user-name">
                        <h5>
                          Christina Louis
                        </h5>
                        <div className="circle-rating">
                          <i className="fa-solid fa-circle" />
                          <i className="fa-solid fa-circle" />
                          <i className="fa-solid fa-circle" />
                          <i className="fa-solid fa-circle" />
                          <i className="fa-solid fa-circle-half-stroke" />
                        </div>
                      </div>
                    </div>
                    <div className="testmonial-user-coments">
                      <h6>“ Excellent Clinician ”</h6>
                      <p>Excellent clinician. Endlessly patient and reassuring.Also a very efficient
                        back up team. He was prepared to spend as long as I needed to understand
                        what he was saying.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
});

export default Testimonals;