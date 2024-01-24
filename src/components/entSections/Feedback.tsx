/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect } from 'react'
import Link from 'next/link'
import AOS from 'aos'
import useScssVar from '@/hooks/useScssVar'
import { feedback_fifteen, logo_03 } from '../../../public/assets/imagepath';


const Feedback: FC = (() => {
  const { muiVar } = useScssVar();
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);
  return (
    <Fragment>
      <section className="feedback-section-fifteen" style={muiVar}>
        <div className="container">
          <div className="feedback-schedule-all">
            <div className="row">
              <div className="col-lg-5">
                <div className="feedback-inner-main">
                  <img
                    src={feedback_fifteen}
                    alt="image"
                    className="img-fluid"
                  />
                </div>
              </div>
              <div className="col-lg-7">
                <div className="feedback-fifteen-content">
                  <div className="feedback-fift-img">
                    <img src={logo_03} alt="" className='colorFill' />
                  </div>
                  <h3>Consult top doctors online for any health concern</h3>
                  <p>Connect within 60secs</p>
                  <Link href="#">Signup Now</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default Feedback;