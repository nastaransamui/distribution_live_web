/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';

import { bro1, bro2, bro3, bro4, bro5 } from '../../../public/assets/imagepath';
//redux
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';

//utility
import TouchBallLoading from 'react-loadingg/lib/TouchBallLoading';
import Tooltip from '@mui/material/Tooltip';
import AOS from 'aos'


const Browser: FC = (() => {
  const { muiVar } = useScssVar();
  const specialities = useSelector((state: AppState) => state.specialities.value)

  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);

  return (
    <Fragment>
      <section className="browse-section" style={muiVar}>
        <div className="container">
          <div className="section-header-three text-center aos" data-aos="fade-up">
            <h2>Browse by Specialities</h2>
            <p className="sub-title">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
          <div className="row">
            {
              specialities.length == 0 ?
                <div className="form-search-btn aos" data-aos="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
                  <TouchBallLoading
                    size="large"
                    style={{ position: 'relative' }}
                    color={muiVar['--primaryMain']} />
                </div> :
                <Fragment>
                  {
                    specialities.map((spec) => {
                      let img = document.getElementById(spec.imageId) as any
                      let src = `${spec.image}`
                      if (img !== null) {
                        src = `${spec.image}`
                        img.src = src
                      }
                      return (
                        <div className="col-lg-2 col-md-3 aos" data-aos="fade-up" key={
                          spec?.specialities +
                          spec?.image +
                          spec?.imageId +
                          spec?.users_id.toString()
                        }>
                          <div className="brower-box">
                            <div>
                              <div className="brower-img">
                                <img src={src} alt="" />
                              </div>
                              {/* <h4>Neurology</h4> */}
                              {
                                spec.specialities.length <= 13 ? <h3>{spec.specialities}</h3> :
                                  <Tooltip title={spec.specialities} arrow>
                                    <h3>{spec.specialities.slice(0, 10) + ' ...'}</h3>
                                  </Tooltip>
                              }
                              <p>{spec.users_id.length} <span>Doctors</span></p>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                </Fragment>
            }
          </div>
          <div className="view-all-more text-center aos" data-aos="fade-up">
            <Link href="/doctors/search" className="btn book-btn">View More</Link>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default Browser;