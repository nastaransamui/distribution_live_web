/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect } from 'react'
import AOS from 'aos'
import CountUp from 'react-countup'
import useScssVar from '@/hooks/useScssVar'
import { fifteen_bg_icon3 } from '../../../public/assets/imagepath';
import { WeAreIconOneSvg, WeAreIconThreeSvg, WeAreIconTwoSvg } from '../../../public/assets/images/icons/IconsSvgs';
import { useTheme } from '@mui/material';


const WhoWeAre: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme()
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);

  return (
    <Fragment>
      <div className="Patients-section-fifteen" style={muiVar}>
        <div className="patient-fifteen-icon shapeFill">
          <img src={fifteen_bg_icon3} alt="" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="patients-left-front patients-left-img">
                <img
                  src={`/assets/images/patients-img-fifteen_${theme.palette.primary.main.slice(1)}.webp`}
                  alt=""
                  style={{ zIndex: 2, position: 'relative' }}
                  className="img-fluid"
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="section-header-fifteen section-header-fifteenpatient">
                <h2>
                  Who <span>We Are</span>
                </h2>
                <p>
                  Our goal is to give the patient maximum relief within minimal pain
                  inflicted
                </p>
              </div>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry s standard dummy text
                ever since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book. It has survived not
                only five centuries
              </p>
              <p>
                It is a long established fact that a reader will be distracted by
                the readable content of a page when looking at its layout. The point
                of using Lorem Ipsum is that it has a more-or-less normal
                distribution of letters
              </p>
              <div className="row">
                <div className="col-md-4">
                  <div className="service-patient-inflict">
                    <div className="service-patient-inflictimg">
                      <span>
                        <WeAreIconOneSvg />
                      </span>
                    </div>
                    <div className="clients-fifteen-span">
                      <h3 className="counter-up">
                        <CountUp end={14500} duration={5} />
                      </h3>
                    </div>
                    <h6>ENT Surgery</h6>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="service-patient-inflict">
                    <div className="service-patient-inflictimg">
                      <span>
                        <WeAreIconTwoSvg />
                      </span>
                    </div>
                    <div className="clients-fifteen-span">
                      <h3 className="counter-up">
                        <CountUp end={50000} duration={5} />
                        <span>+</span>
                      </h3>
                    </div>
                    <h6>Happy Patients</h6>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="service-patient-inflict">
                    <div className="service-patient-inflictimg">
                      <span>
                        <WeAreIconThreeSvg />
                      </span>
                    </div>
                    <div className="clients-fifteen-span">
                      <h3 className="counter-up">
                        <CountUp end={30} duration={5} />
                        <span>+</span>
                      </h3>
                    </div>
                    <h6>Years of Service</h6>
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

export default WhoWeAre;