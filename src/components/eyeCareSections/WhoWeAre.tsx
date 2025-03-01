/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect } from 'react'
import Link from 'next/link'
import useScssVar from '@/hooks/useScssVar'

import {
  center_bg,
  hospital
} from "../../../public/assets/imagepath";
import { EyeIconSvg, Doc_1Svg, Doc_2Svg, Doc_3Svg } from '../../../public/assets/images/icons/IconsSvgs';
import { useTheme } from '@mui/material';
import AOS from 'aos'
const WhoWeAre: FC = (() => {
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
      <section className="center-section" style={{ ...muiVar, backgroundColor: theme.palette.background.paper }}>
        <div className="ban-bg">
          <img src={center_bg} alt="" className="img-fluid bg-05 img" style={{ opacity: 0.3 }} />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-5 aos" data-aos="fade-up">
              <div className="center-img">
                <img src={hospital} alt="" className="img-fluid" />
                <div className="center-service">
                  <span>
                    <i className="fa-solid fa-headphones" />
                  </span>
                  <div>
                    <h1>24/7 Service</h1>
                    <p>We are available when you want</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-7 aos" data-aos="fade-up" style={{ borderRadius: '15px', background: theme.palette.background.default, padding: `15px` }}>
              <div className="center-info">
                <div className="section-heading sec-heading-eye">
                  <EyeIconSvg />
                  <h2>
                    <span>Who</span> We Are
                  </h2>
                  <p>The Great Place Of Eyecare Hospital Center</p>
                </div>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and typesetting
                  industry. Lorem Ipsum has been the industry s standard dummy text
                  ever since the 1500s, when an unknown printer took a galley of type
                  and scrambled it to make a type specimen book. It has survived not
                  only five centuries
                </p>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and typesetting
                  industry. Lorem Ipsum has been the industry s standard
                </p>
              </div>
              <div className="row" >
                <div className="col-md-4">
                  <div className="care-box">
                    <span>
                      <Doc_1Svg />
                    </span>
                    <h1>Expert Professionals and World Class Facilities</h1>
                    <Link href="/doctor-search-grid">
                      Find Doctors
                      <i className="fa-solid fa-chevron-right" />
                    </Link>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="care-box">
                    <span>
                      <Doc_2Svg />
                    </span>
                    <h1>Specialty Eyecare treatment for all</h1>
                    <Link href="/doctors/search">
                      Book Now
                      <i className="fa-solid fa-chevron-right" />
                    </Link>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="care-box">
                    <span>
                      <Doc_3Svg />
                    </span>
                    <h1>Online Appointment and Excellent Treatment</h1>
                    <Link href="/doctors/search-2">
                      Make an Appointment
                      <i className="fa-solid fa-chevron-right" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default WhoWeAre;