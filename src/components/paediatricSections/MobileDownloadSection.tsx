/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import Link from 'next/link'
import useScssVar from '@/hooks/useScssVar'
import { app_store, feedback_inner, google_play, pulse_1, pulse_2, pulse_3 } from '../../../public/assets/imagepath';
import { useTheme } from '@mui/material';

const MobileDownloadSection: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  return (
    <Fragment>
      <section className="feedback-section-thirteen common-padding" style={{
        ...muiVar,
        background: `url(/assets/images/feedback-bg_${theme.palette.mode}.png)`
      }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="feedback-main-thirteen">
                <div className="feedback-all-img">
                  <img
                    src={feedback_inner}
                    alt="image"
                    className="img-fluid"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="feedback-main-content">
                <h2>
                  Download <br />
                  The Doccure App Today!
                </h2>
                <p>
                  Rasakan kemudahan pembayaran melalui aplikasi SmartInPays.
                  Jalan-jalan, membayar tagihan, donasi di ujung jari Anda.{" "}
                </p>
                <div className="feedback-inner-img">
                  <div className="feedback-inner-imgone">
                    <Link href="#">
                      <img src={app_store} alt="" className='colorFill' />
                    </Link>
                  </div>
                  <div className="feedback-inner-imgtwo">
                    <Link href="#">
                      <img src={google_play} alt="" className='colorFill' />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="feedback-bg-icons">
          <img src={pulse_1} alt="" className='imgColorSecondary' />
          <img src={pulse_2} alt="" className='imgColorSecondary' />
          <img src={pulse_3} alt="" className='imgColorSecondary' />
          <img src={pulse_3} alt="" className='imgColorSecondary' />
          <img src={pulse_1} alt="" className='imgColorSecondary' />
        </div>
      </section>
    </Fragment>
  )
});

export default MobileDownloadSection;