/* eslint-disable @next/next/no-img-element */

import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import { Doctor07, ImgPharmacy1, LabImage } from '../../../public/assets/imagepath';


const LookingFor: FC = (() => {
  const { muiVar } = useScssVar();

  return (
    <Fragment>
      <section className="section home-tile-section" style={muiVar}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-9 m-auto">
              <div className="section-header text-center">
                <h2>What are you looking for?</h2>
              </div>
              <div className="row">
                <div className="col-lg-4 mb-3">
                  <div className="card text-center doctor-book-card">
                    <img src={Doctor07} alt="" className="img-fluid" />
                    <div className="doctor-book-card-content tile-card-content-1">
                      <div>
                        <h3 className="card-title mb-0">Visit a Doctor</h3>
                        <Link href="/doctors" className="btn book-btn1 px-3 py-2 mt-3" tabIndex={0}>Book Now</Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 mb-3">
                  <div className="card text-center doctor-book-card">
                    <img src={ImgPharmacy1} alt="" className="img-fluid" />
                    <div className="doctor-book-card-content tile-card-content-1">
                      <div>
                        <h3 className="card-title mb-0">Find a Pharmacy</h3>
                        <Link href="/pharmacy/results" className="btn book-btn1 px-3 py-2 mt-3" tabIndex={0}>Find Now</Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 mb-3">
                  <div className="card text-center doctor-book-card">
                    <img src={LabImage} alt="" className="img-fluid" />
                    <div className="doctor-book-card-content tile-card-content-1">
                      <div>
                        <h3 className="card-title mb-0">Find a Lab</h3>
                        <Link href="/comingsoon" className="btn book-btn1 px-3 py-2 mt-3" tabIndex={0}>Coming Soon</Link>
                      </div>
                    </div>
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

export default LookingFor;