/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect } from 'react'
import Link from 'next/link'
import AOS from 'aos'
import useScssVar from '@/hooks/useScssVar'
import { feedback_fifteen, logo } from '../../../public/assets/imagepath';
import { useTheme } from '@mui/material';


const Feedback: FC = (() => {
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
      <section className="feedback-section-fifteen" style={{ ...muiVar, backgroundColor: theme.palette.background.paper }}>
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
                  <div style={{ paddingBottom: 10 }}>
                    <img src={logo} height={40} width={40} alt="" />
                  </div>
                  <h3>Consult top doctors online for any health concern</h3>
                  <p>Connect within 60secs</p>
                  <Link href="/register">Signup Now</Link>
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