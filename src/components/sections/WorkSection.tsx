/* eslint-disable @next/next/no-img-element */
import { useEffect, FC, Fragment } from "react";
import AOS from "aos";
import { work_img } from '../../../public/assets/imagepath'

import {
  WorkSvg1,
  WorkSvg2,
  WorkSvg3,
  WorkSvg4
} from '../../../public/assets/images/icons/IconsSvgs'
import useScssVar from "@/hooks/useScssVar";

const WorkSection: FC = (() => {
  const { muiVar } = useScssVar()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      AOS.init({
        duration: 1200,
        once: true
      });
    }
  }, []);
  return (
    <Fragment>
      <section className="work-section" style={muiVar}>
        <div className="container">
          <div className="row">
            <div
              className="col-lg-4 col-md-12 work-img-info aos"
              data-aos="fade-up"
            >
              <div className="work-img">
                <img src={work_img} className="img-fluid" alt="" />
              </div>
            </div>
            <div className="col-lg-8 col-md-12 work-details">
              <div className="section-header-one aos" data-aos="fade-up">
                <h1>How it Works</h1>
                <h2 className="section-title imgColorPrimary">4 easy steps to get your solution</h2>
              </div>
              <div className="row">
                <div className="col-lg-6 col-md-6 aos" data-aos="fade-up">
                  <div className="work-info">
                    <div className="work-icon">
                      <span>
                        <WorkSvg1 />
                      </span>
                    </div>
                    <div className="work-content">
                      <h3>Search Doctor</h3>
                      <p>
                        Search doctors base on their specialities and availablity.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 aos" data-aos="fade-up">
                  <div className="work-info">
                    <div className="work-icon">
                      <span>
                        <WorkSvg2 />
                      </span>
                    </div>
                    <div className="work-content">
                      <h3>Check Doctor Profile</h3>
                      <p>
                        Check doctor profile and Availablitity and their stars.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 aos" data-aos="fade-up">
                  <div className="work-info">
                    <div className="work-icon">
                      <span>
                        <WorkSvg3 />
                      </span>
                    </div>
                    <div className="work-content">
                      <h3>Schedule Appointment</h3>
                      <p>
                        Check their schedule and book appointment with doctor.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 aos" data-aos="fade-up">
                  <div className="work-info">
                    <div className="work-icon">
                      <span>
                        <WorkSvg4 />
                      </span>
                    </div>
                    <div className="work-content">
                      <h3>Get Your Solution</h3>
                      <p>
                        Attend to meeting and discuss with doctor.
                      </p>
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

export default WorkSection