// @ts-nocheck
/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import Slider from 'react-slick'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import { Docslide1 } from '../../../public/assets/imagepath';

const HomeSearch: FC = (() => {
  const { muiVar } = useScssVar();
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    cssEase: "linear"
  };
  return (
    <Fragment>
      <section className="section full-slide-home  top-space" style={muiVar}>
        <div>
          <div className="slick-wrapper">
            <div className="slider-1">
              {/*slide*/}
              <Slider {...settings}>
                <div className="col-12 d-flex ">
                  <div className="col-12 col-lg-6">
                    <div className="slide-image">
                      <span className="text-uppercase d-block mb-3">Introducing Prime Doctors</span>
                      <h2 className="mb-3">Hassle-free appoinments <br /> with Prime Doctors</h2>
                      <ul className="list-inline slide-ul">
                        <li className="list-inline-item">Reasonable wait time</li>
                        <li className="list-inline-item">Fixed Consultation Fee</li>
                        <li className="list-inline-item">Consulation with the preferred doctor</li>
                      </ul>
                      <div className="d-inline-block">
                        <Link href="/pharmacy/results" className="btn book-btn1" tabIndex={0}>Pharmacy</Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-lg-6 d-flex justify-content-center">
                    <img src={Docslide1} alt="#" />
                  </div>
                </div>

                {/*/slide*/}
                <div className="col-12 d-flex">
                  <div className="col-12 col-lg-6">
                    <div className="slide-image">
                      <span className="text-secondary text-uppercase d-block mb-3">Introducing Prime Doctors</span>
                      <h2 className="mb-3">Hassle-free appoinments <br /> with Prime Doctors</h2>
                      <ul className="list-inline slide-ul">
                        <li className="list-inline-item">Reasonable wait time</li>
                        <li className="list-inline-item">Fixed Consultation Fee</li>
                        <li className="list-inline-item">Consulation with the preferred doctor</li>
                      </ul>
                      <div className="d-inline-block">
                        <Link href="/doctors/search" className="btn book-btn1" tabIndex={0}>Book Now</Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-12 col-lg-6 d-flex justify-content-center">
                    <img src={Docslide1} alt="#" />
                  </div>
                </div>

                {/*slide*/}

              </Slider>
              {/*/slide*/}
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default HomeSearch;