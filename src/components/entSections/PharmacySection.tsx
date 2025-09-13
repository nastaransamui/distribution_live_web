/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import { VscHeart } from 'react-icons/vsc'
import useScssVar from '@/hooks/useScssVar'

import { SwiperOptions } from 'swiper/types';
import { FreeMode, Navigation } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { pharmacy_1, pharmacy_2, pharmacy_3, } from "../../../public/assets/imagepath";
import { useTheme } from '@mui/material'

const PharmacySection: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme()

  const doctersettings: SwiperOptions = {
    spaceBetween: 24,
    loop: false,

    modules: [Navigation, FreeMode],
    navigation: {
      prevEl: null,
      nextEl: null,
    },
    breakpoints: {
      1300: { slidesPerView: 3 },
      1000: { slidesPerView: 3 },
      768: { slidesPerView: 2 },
      575: { slidesPerView: 1 },
      500: { slidesPerView: 1 },
      0: { slidesPerView: 1 },
    },
  };

  const swiperRef = useRef<SwiperInstance | null>(null);

  const handlePrev = useCallback(() => {
    swiperRef.current?.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    swiperRef.current?.slideNext();
  }, []);
  return (
    <Fragment>
      <section className="pharmacy-section-fifteen" style={{ ...muiVar, backgroundColor: theme.palette.background.paper }}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-header-fifteen text-center">
                <h2>
                  Online <span>Pharmacy Store</span>
                </h2>
                <p>More the quantity, higher the discount. Hurry, Buy Now!</p>
              </div>
            </div>
          </div>
          <div
            className="pharmacy-slider-fifteen owl-theme aos"
            data-aos="fade-up"
          >
            <Swiper
              {...doctersettings}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }} className="pharmacy-slider-fifteen owl-theme aos"
              data-aos="fade-up">
              <SwiperSlide>
                <div className="item item-fifteen">
                  <div className="doctor-profile-widget doctor-profile-widget-fift">
                    <div className="doc-pro-img doc-pro-img-fifteen">
                      <Link href="/doctors/search">
                        <div className="doctor-profile-img doctor-profile-img-fifteen">
                          <img
                            src={pharmacy_1}
                            className="img-fluid"
                            alt=""
                          />
                        </div>
                      </Link>
                      <div className="doctor-amount">
                        <Link
                          href="#"
                          onClick={(e) => e.preventDefault()}
                          className="fav-icon fav-icon-fifteen"
                        >
                          <VscHeart className="feather-heart" />
                        </Link>
                      </div>
                      <div className="item-info">
                        <h6>10% Off</h6>
                      </div>
                    </div>
                    <div className="doc-content-fift">
                      <Link href="#"
                        onClick={(e) => e.preventDefault()}>Otogesic Ear Drops</Link>
                      <p>
                        <span>Sold by:</span> ERIS LIFESCIENCES LTD
                      </p>
                      <div className="rate-fifteen">
                        <div className="rate-four">
                          <span>In Stock</span>
                        </div>
                        <ul className="fift-rate">
                          <li>5ml</li>
                          <li>10ml</li>
                        </ul>
                      </div>
                      <div className="fift-bottom-content">
                        <h3>
                          $25.00<span className="ms-2">$35.00</span>
                        </h3>
                        <Link href="add-prescription" onClick={(e) => e.preventDefault()}>Add to Cart</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="item item-fifteen">
                  <div className="doctor-profile-widget doctor-profile-widget-fift">
                    <div className="doc-pro-img doc-pro-img-fifteen">
                      <Link href="/doctors/search">
                        <div className="doctor-profile-img doctor-profile-img-fifteen">
                          <img
                            src={pharmacy_2}
                            className="img-fluid"
                            alt=""
                          />
                        </div>
                      </Link>
                      <div className="doctor-amount">
                        <Link
                          href="#"
                          onClick={(e) => e.preventDefault()}
                          className="fav-icon fav-icon-fifteen"
                        >
                          <VscHeart className="feather-heart" />
                        </Link>
                      </div>
                      <div className="item-info">
                        <h6>15% Off</h6>
                      </div>
                    </div>
                    <div className="doc-content-fift">
                      <Link href="#"
                        onClick={(e) => e.preventDefault()}>Himalaya Bresol</Link>
                      <p>
                        <span>Sold by:</span>THE HIMALAYA DRUG
                      </p>
                      <div className="rate-fifteen">
                        <div className="rate-four">
                          <span>In Stock</span>
                        </div>
                        <ul className="fift-rate">
                          <li>5ml</li>
                          <li>10ml</li>
                        </ul>
                      </div>
                      <div className="fift-bottom-content">
                        <h3>
                          $85.00<span className="ms-2">$65.00</span>
                        </h3>
                        <Link href="add-prescription" onClick={(e) => e.preventDefault()}>Add to Cart</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="item item-fifteen">
                  <div className="doctor-profile-widget doctor-profile-widget-fift">
                    <div className="doc-pro-img doc-pro-img-fifteen">
                      <Link href="/doctors/search">
                        <div className="doctor-profile-img doctor-profile-img-fifteen">
                          <img
                            src={pharmacy_3}
                            className="img-fluid"
                            alt=""
                          />
                        </div>
                      </Link>
                      <div className="doctor-amount">
                        <Link
                          href="#"
                          onClick={(e) => e.preventDefault()}
                          className="fav-icon fav-icon-fifteen"
                        >
                          <VscHeart className="feather-heart" />
                        </Link>
                      </div>
                      <div className="item-info">
                        <h6>10% Off</h6>
                      </div>
                    </div>
                    <div className="doc-content-fift">
                      <Link href="#"
                        onClick={(e) => e.preventDefault()}>Boiron, ThroatCalm</Link>
                      <p>
                        <span>Sold by:</span> BOIRON
                      </p>
                      <div className="rate-fifteen">
                        <div className="rate-four">
                          <span>In Stock</span>
                        </div>
                        <ul className="fift-rate">
                          <li>5ml</li>
                          <li>10ml</li>
                        </ul>
                      </div>
                      <div className="fift-bottom-content">
                        <h3>
                          $55.00<span className="ms-2">$95.00</span>
                        </h3>
                        <Link href="add-prescription" onClick={(e) => e.preventDefault()}>Add to Cart</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="item item-fifteen">
                  <div className="doctor-profile-widget doctor-profile-widget-fift">
                    <div className="doc-pro-img doc-pro-img-fifteen">
                      <Link href="/doctors/search">
                        <div className="doctor-profile-img doctor-profile-img-fifteen">
                          <img
                            src={pharmacy_1}
                            className="img-fluid"
                            alt=""
                          />
                        </div>
                      </Link>
                      <div className="doctor-amount">
                        <Link
                          href="#"
                          onClick={(e) => e.preventDefault()}
                          className="fav-icon fav-icon-fifteen"
                        >
                          <VscHeart className="feather-heart" />
                        </Link>
                      </div>
                      <div className="item-info">
                        <h6>10% Off</h6>
                      </div>
                    </div>
                    <div className="doc-content-fift">
                      <Link href="#"
                        onClick={(e) => e.preventDefault()}>Otogesic Ear Drops</Link>
                      <p>
                        <span>Sold by:</span> ERIS LIFESCIENCES LTD
                      </p>
                      <div className="rate-fifteen">
                        <div className="rate-four">
                          <span>In Stock</span>
                        </div>
                        <ul className="fift-rate">
                          <li>5ml</li>
                          <li>10ml</li>
                        </ul>
                      </div>
                      <div className="fift-bottom-content">
                        <h3>
                          $25.00<span className="ms-2">$35.00</span>
                        </h3>
                        <Link href="add-prescription" onClick={(e) => e.preventDefault()}>Add to Cart</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>

            </Swiper>
            <div className="owl-nav" >

              <button className='owl-prev' onClick={handlePrev}>
                <i className="fas fa-chevron-left" />
              </button>
              <button className='owl-next' onClick={handleNext}>
                <i className="fas fa-chevron-right" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
})

export default PharmacySection;