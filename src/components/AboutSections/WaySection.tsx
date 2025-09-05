/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import { shape06, shape07, wayimg } from '../../../public/assets/imagepath';


const WaySection: FC = (() => {
  const { muiVar } = useScssVar();

  return (
    <Fragment>
      <section className="way-section" style={muiVar}>
        <div className="container">
          <div className="way-bg">
            <div className="way-shapes-img">
              <div className="way-shapes-left">
                <img src={shape06} alt="" />
              </div>
              <div className="way-shapes-right">
                <img src={shape07} alt="" />
              </div>
            </div>
            <div className="row align-items-end">
              <div className="col-lg-7 col-md-12">
                <div className="section-inner-header way-inner-header mb-0">
                  <h2>Be on Your Way to Feeling Better with the Health care</h2>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                  <Link href="/contact" className="btn btn-primary">
                    Contact With Us
                  </Link>
                </div>               </div>
              <div className="col-lg-5 col-md-12">
                <div className="way-img">
                  <img src={wayimg} className="img-fluid" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
});


export default WaySection;