/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { FC, Fragment } from 'react'
import {
  Category1,
  Shape3, Shape4,
} from '../../../public/assets/imagepath';
import useScssVar from '@/hooks/useScssVar';

import TouchBallLoading from 'react-loadingg/lib/TouchBallLoading';
import Tooltip from '@mui/material/Tooltip';
//redux
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';


const Specialities: FC = (() => {

  const { muiVar } = useScssVar();
  const specialities = useSelector((state: AppState) => state.specialities.value)

  return (
    <Fragment>
      <section className="specialities-section" style={muiVar}>
        <div className="shapes">
          <img src={Shape3} className="img-fluid shape-3" alt='' />
          <img src={Shape4} className="img-fluid shape-4" alt='' />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="section-heading bg-area">
                <h2>Browse by Specialities</h2>
                <p>Find experienced doctors across all specialties</p>
              </div>
            </div>
          </div>
          <div className="row">
            {
              specialities.length == 0 ?
                <div className="form-search-btn aos" data-aos="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
                  <TouchBallLoading
                    size="large"
                    style={{ position: 'relative' }}
                    color={muiVar['--secondaryMain']} /></div> :
                <Fragment>
                  {
                    specialities.map((spec) => {
                      let img = document.getElementById(spec.imageId) as any
                      let src = `${spec.image}?random=${new Date().getTime()}`
                      if (img !== null) {
                        src = `${spec.image}?random=${new Date().getTime()}`
                        img.src = src
                      }
                      return (
                        <div className="col-lg-3 col-md-6" key={
                          spec?.specialities +
                          spec?.image +
                          spec?.imageId +
                          spec?.users_id.toString()
                        }>
                          <div className="specialist-card d-flex">
                            <div className="specialist-img">
                              <img src={src} className="img-fluid" alt='' id={spec.imageId} />
                            </div>
                            <div className="specialist-info">
                              <Link href="#">
                                {
                                  spec.specialities.length <= 13 ? <h4>{spec.specialities}</h4> :
                                    <Tooltip title={spec.specialities} arrow>
                                      <h4>{spec.specialities.slice(0, 10) + ' ...'}</h4>
                                    </Tooltip>
                                }
                              </Link>
                              <p>{spec.users_id.length} Doctors</p>
                            </div>
                            <div className="specialist-nav ms-auto">
                              <Link href="#"><i className="fas fa-long-arrow-alt-right" /></Link>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                </Fragment>
            }

          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default Specialities;