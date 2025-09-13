/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useRef } from 'react'
import Link from 'next/link'
import useScssVar from '@/hooks/useScssVar'
import { servicesixteenicon, treatment1, treatment2, treatment3, treatment4 } from '../../../public/assets/imagepath';
import { useTheme } from '@mui/material';
import { SwiperOptions } from 'swiper/types';
import { FreeMode, Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';


const TreatmentSection: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  const doctersettings: SwiperOptions = {
    slidesPerView: 4,
    slidesPerGroup: 4,
    spaceBetween: 15,
    speed: 1800,
    loop: false,
    pagination: {
      clickable: true,
      el: '.owl-dots-treatment',

    },

    modules: [Navigation, FreeMode, Pagination],
    navigation: {
      prevEl: null,
      nextEl: null,
    },
    breakpoints: {
      1049: { slidesPerView: 4 },
      992: { slidesPerView: 4 },
      800: { slidesPerView: 3 },
      776: { slidesPerView: 3 },
      567: { slidesPerView: 1 },
      200: { slidesPerView: 1 },
    },
  };
  const swiperRef = useRef<SwiperInstance | null>(null);


  return (
    <Fragment>
      <div className="treatment-section-sixteen" style={{ ...muiVar, backgroundColor: theme.palette.background.paper }}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-header-sixteen text-center">
                <p>OUr services</p>
                <h2>Choose a treatment</h2>
              </div>
            </div>
          </div>
          <div className=" treatment-sixteen-slider owl-theme">
            <Swiper
              {...doctersettings}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}>
              <SwiperSlide>
                <div className="item item-sixteen">
                  <div className="doctor-profile-widget">
                    <div className="doc-pro-img">
                      <Link href="/doctors/search" aria-label='search doctor'>
                        <div className="doctor-profile-img">
                          <img src={treatment1} className="img-fluid" style={{ objectFit: 'cover' }} alt="" />
                        </div>
                      </Link>
                      <div className="doctor-amount">
                        <span>Face Lift</span>
                      </div>
                    </div>
                    <div className="doc-content">
                      <div className="doc-pro-info">
                        <div className="doc-pro-name">
                          <Link href="/doctors/search" aria-label='search doctor'>
                            Barbara L. Williams
                          </Link>
                          <p>Aesthetic Surgery</p>
                        </div>
                        <div className="reviews-ratings">
                          <p>
                            <span>
                              <i className="fas fa-star" /> 4.5
                            </span>{" "}
                            (35)
                          </p>
                        </div>
                      </div>
                      <div className="doc-pro-location">
                        <p>
                          <i className="feather-map-pin" /> Newyork, USA
                        </p>
                      </div>
                    </div>
                    <div
                      className="blog-btn-sec text-center aos aos-init aos-animate"
                      data-aos="fade-up"
                    >
                      <Link href="/doctors/search" aria-label='search doctor' className="btn btn-view" style={{ minWidth: '100%', }}>
                        Book
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="item item-sixteen">
                  <div className="doctor-profile-widget">
                    <div className="doc-pro-img">
                      <Link href="/doctors/search" aria-label='search doctor'>
                        <div className="doctor-profile-img">
                          <img src={treatment2} className="img-fluid" style={{ objectFit: 'cover' }} alt="" />
                        </div>
                      </Link>
                      <div className="doctor-amount">
                        <span>Implant</span>
                      </div>
                    </div>
                    <div className="doc-content">
                      <div className="doc-pro-info">
                        <div className="doc-pro-name">
                          <Link href="/doctors/search" aria-label='search doctor'>James L. George</Link>
                          <p>Cardiology</p>
                        </div>
                        <div className="reviews-ratings">
                          <p>
                            <span>
                              <i className="fas fa-star" /> 4.5
                            </span>{" "}
                            (35)
                          </p>
                        </div>
                      </div>
                      <div className="doc-pro-location">
                        <p>
                          <i className="feather-map-pin" /> Mexico, USA
                        </p>
                      </div>
                    </div>
                    <div
                      className="blog-btn-sec text-center aos aos-init aos-animate"
                      data-aos="fade-up"
                    >
                      <Link href="/doctors/search" aria-label='search doctor' className="btn btn-view" style={{ minWidth: '100%', }}>
                        Book
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="item item-sixteen">
                  <div className="doctor-profile-widget">
                    <div className="doc-pro-img">
                      <Link href="/doctors/search" aria-label='search doctor'>
                        <div className="doctor-profile-img">
                          <img src={treatment3} className="img-fluid" style={{ objectFit: 'cover' }} alt="" />
                        </div>
                      </Link>
                      <div className="doctor-amount">
                        <span>Blearoplasty</span>
                      </div>
                    </div>
                    <div className="doc-content">
                      <div className="doc-pro-info">
                        <div className="doc-pro-name">
                          <Link href="/doctors/search" aria-label='search doctor'>Matthew R. Paul</Link>
                          <p>Aesthetic Surgery</p>
                        </div>
                        <div className="reviews-ratings">
                          <p>
                            <span>
                              <i className="fas fa-star" /> 4.4
                            </span>{" "}
                            (65)
                          </p>
                        </div>
                      </div>
                      <div className="doc-pro-location">
                        <p>
                          <i className="feather-map-pin" /> Mexico, USA
                        </p>
                      </div>
                    </div>
                    <div
                      className="blog-btn-sec text-center aos aos-init aos-animate"
                      data-aos="fade-up"
                    >
                      <Link href="/doctors/search" aria-label='search doctor' className="btn btn-view" style={{ minWidth: '100%', }}>
                        Book
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="item item-sixteen">
                  <div className="doctor-profile-widget">
                    <div className="doc-pro-img">
                      <Link href="/doctors/search" aria-label='search doctor'>
                        <div className="doctor-profile-img">
                          <img src={treatment4} className="img-fluid" style={{ objectFit: 'cover' }} alt="" />
                        </div>
                      </Link>
                      <div className="doctor-amount">
                        <span>Tummy Tuck</span>
                      </div>
                    </div>
                    <div className="doc-content">
                      <div className="doc-pro-info">
                        <div className="doc-pro-name">
                          <Link href="/doctors/search" aria-label='search doctor'>Carolina F. Paul</Link>
                          <p>Aesthetic Surgery</p>
                        </div>
                        <div className="reviews-ratings">
                          <p>
                            <span>
                              <i className="fas fa-star" /> 4.0
                            </span>{" "}
                            (15)
                          </p>
                        </div>
                      </div>
                      <div className="doc-pro-location">
                        <p>
                          <i className="feather-map-pin" /> Log Angels, USA
                        </p>
                      </div>
                    </div>
                    <div
                      className="blog-btn-sec text-center aos aos-init aos-animate"
                      data-aos="fade-up"
                    >
                      <Link href="/doctors/search" aria-label='search doctor' className="btn btn-view" style={{ minWidth: '100%', }}>
                        Book
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="item item-sixteen">
                  <div className="doctor-profile-widget">
                    <div className="doc-pro-img">
                      <Link href="/doctors/search" aria-label='search doctor'>
                        <div className="doctor-profile-img">
                          <img src={treatment3} className="img-fluid" style={{ objectFit: 'cover' }} alt="" />
                        </div>
                      </Link>
                      <div className="doctor-amount">
                        <span>Blearoplasty</span>
                      </div>
                    </div>
                    <div className="doc-content">
                      <div className="doc-pro-info">
                        <div className="doc-pro-name">
                          <Link href="/doctors/search" aria-label='search doctor'>Matthew R. Paul</Link>
                          <p>Aesthetic Surgery</p>
                        </div>
                        <div className="reviews-ratings">
                          <p>
                            <span>
                              <i className="fas fa-star" /> 4.4
                            </span>{" "}
                            (65)
                          </p>
                        </div>
                      </div>
                      <div className="doc-pro-location">
                        <p>
                          <i className="feather-map-pin" /> Mexico, USA
                        </p>
                      </div>
                    </div>
                    <div
                      className="blog-btn-sec text-center aos aos-init aos-animate"
                      data-aos="fade-up"
                    >
                      <Link href="/doctors/search" aria-label='search doctor' className="btn btn-view" style={{ minWidth: '100%', }}>
                        Book
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
            <div className="owl-dots-treatment" />
          </div>
        </div>
        <div className="service-sixteen-icontwo  imgColorPrimary">
          <img src={servicesixteenicon} alt="" />
        </div>
      </div>
    </Fragment>
  )
});

export default TreatmentSection;