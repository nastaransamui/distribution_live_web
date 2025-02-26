/* eslint-disable @next/next/no-img-element */

import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { useTheme } from '@mui/material';


const ComingSoon: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();

  return (
    <Fragment>
      <section className="error-section" style={muiVar}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-12 text-center">
              <div className="error-info">
                <div className="error-img">
                  <img
                    src={`/assets/images/coming-soon_${theme.palette.primary.main.slice(1)}.webp`}
                    className="img-fluid"
                    alt=""
                  />
                </div>
                <div className="error-content">
                  <h2>We re Launching Soon!</h2>
                  <p>We re currently working hard on this page.</p>
                </div>
                <div className="coming-soon-info">
                  <div className="coming-soon-count">
                    <h4 id="day-box">5</h4>
                    <p>Days</p>
                  </div>
                  <div className="coming-soon-count">
                    <h4 id="hr-box">8</h4>
                    <p>Hours</p>
                  </div>
                  <div className="coming-soon-count">
                    <h4 id="min-box">48</h4>
                    <p>Minutes</p>
                  </div>
                  <div className="coming-soon-count">
                    <h4 id="sec-box">20</h4>
                    <p>Seconds</p>
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

export default ComingSoon;