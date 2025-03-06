/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect } from 'react'
import Link from 'next/link'
import AOS from 'aos'
import useScssVar from '@/hooks/useScssVar'
import { appointment_ryt_1 } from "../../../public/assets/imagepath";
import { ExperienceFiveSvg, ExperienceFourSvg, ExperienceOneSvg, ExperienceSixSvg, ExperienceThreeSvg, ExperienceTwoSvg } from '../../../public/assets/images/icons/IconsSvgs';
import { useTheme } from '@mui/material';

const Contact: FC = (() => {
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
      <section className="appointment-section-fifteen" style={{
        ...muiVar,
        backgroundImage: `url(/assets/images/book-appointment-bg_${theme.palette.primary.main.slice(1)}.webp)`
      }}>
        <div className="container">
          <div className="row ">
            <div className="col-lg-7">
              <div className="appointment-schedule-main">
                <h2>Book Appointment</h2>
                <h6>More the quantity, higher the discount. Hurry, Buy Now!</h6>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and typesetting
                  industry. Lorem Ipsum has been the industry s standard dummy text
                  ever since the 1500s, when an unknown printer took a galley of
                  type and scrambled it to make a type specimen book.
                </p>
                <ul>
                  <li>
                    <div className="appointment-schedule-img">
                      <ExperienceFourSvg />
                      <div className="appoint-inner-img">
                        <ExperienceThreeSvg />
                      </div>
                    </div>
                    <span>Find Experience Doctors</span>
                  </li>
                  <li>
                    <div className="appointment-schedule-img">
                      <ExperienceFiveSvg />
                      <div className="appoint-inner-img">
                        <ExperienceOneSvg />
                      </div>
                    </div>
                    <span>Share your Health Issues</span>
                  </li>
                  <li>
                    <div className="appointment-schedule-img">
                      <ExperienceSixSvg />
                      <div className="appoint-inner-img">
                        <ExperienceTwoSvg />
                      </div>
                    </div>
                    <span>Get solution about health</span>
                  </li>
                </ul>
                <Link href="/doctors/search">Book an Appointment</Link>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="appointment-right-image appoint-fift-img">
                <img
                  src={appointment_ryt_1}
                  alt=""
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default Contact;