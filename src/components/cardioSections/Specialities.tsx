/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect } from 'react'
import useScssVar from '@/hooks/useScssVar'
import AOS from 'aos'

import {
  DrugsSvg,
  HealthCareSvg,
  HealthCareLoveSvg,
  SyringeSvg,
  UserDoctorSvg
} from '../../../public/assets/images/icons/IconsSvgs'

import {
  healthcare,
} from '../../../public/assets/imagepath'

const Specialities: FC = (() => {
  const { muiVar } = useScssVar();
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);
  return (
    <Fragment>
      <section className="specialities-section-one" style={muiVar}>
        <div className="floating-bg">
          <img src={healthcare} alt="#" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-12 aos" data-aos="fade-up">
              <div className="section-header-one section-header-slider">
                <h2 className="section-title">Why <span>Us?</span></h2>
              </div>
            </div>
          </div>
          <div className="specialities-block aos" data-aos="fade-up">
            <ul>
              <li>
                <div className="specialities-item">
                  <div className="specialities-img">
                    <div className="hexogen">
                      {/* <img src={healthcarelove} alt="#" /> */}
                      <HealthCareLoveSvg />
                    </div>
                  </div>
                  <p>Personalized Health care</p>
                </div>
              </li>
              <li>
                <div className="specialities-item">
                  <div className="specialities-img">
                    <div className="hexogen">
                      {/* <img src={userdoctor} alt="#" /> */}
                      <UserDoctorSvg />
                    </div>
                  </div>
                  <p>World-Leading
                    Experts</p>
                </div>
              </li>
              <li>
                <div className="specialities-item">
                  <div className="specialities-img">
                    <div className="hexogen">
                      {/* <img src={health} alt="#" /> */}
                      <HealthCareSvg />
                    </div>
                  </div>
                  <p>Regularly
                    Check Up</p>
                </div>
              </li>
              <li>
                <div className="specialities-item">
                  <div className="specialities-img">
                    <div className="hexogen">
                      {/* <img src={drugssvg} alt="#" /> */}
                      <DrugsSvg />
                    </div>
                  </div>
                  <p>Treatment For
                    Complex Conditions</p>
                </div>
              </li>
              <li>
                <div className="specialities-item">
                  <div className="specialities-img">
                    <div className="hexogen">
                      {/* <img src={syringesvg} alt="#" /> */}
                      <SyringeSvg />
                    </div>
                  </div>
                  <p>Minimally Invasive Procedures</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </Fragment>
  )
})

export default Specialities;