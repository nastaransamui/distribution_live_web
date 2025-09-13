/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useCallback, useEffect, useRef } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link'
import { useTheme } from '@mui/material';
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from 'swiper';
import { SwiperOptions } from 'swiper/types';
import { FreeMode, Navigation } from 'swiper/modules';


import {
  clinic_011,
  clinic_012,
  clinic_013,
  clinic_014,
  clinic_015
} from "../../../public/assets/imagepath";
import { EyeIconOneSvg, EyeIconSvg } from '../../../public/assets/images/icons/IconsSvgs';

import AOS from 'aos'
const Specialities: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme()
  const specialitySettings: SwiperOptions = {
    slidesPerView: 4,
    spaceBetween: 15,
    loop: false,
    modules: [Navigation, FreeMode],
    navigation: {
      prevEl: null,
      nextEl: null,
    },
    breakpoints: {
      1049: { slidesPerView: 4 },
      992: { slidesPerView: 3 },
      800: { slidesPerView: 3 },
      776: { slidesPerView: 3 },
      567: { slidesPerView: 1 },
      200: { slidesPerView: 1 },
    },
  };

  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);
  const swiperRef = useRef<SwiperInstance | null>(null);

  const handlePrev = useCallback(() => {
    swiperRef.current?.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    swiperRef.current?.slideNext();
  }, []);
  return (
    <Fragment>
      <section className="special-section" style={{ ...muiVar, backgroundColor: theme.palette.background.paper }}>
        <div className="ban-bg eyeSvg">
          <EyeIconOneSvg />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-12 aos" data-aos="fade-up">
              <div className="section-heading sec-heading-eye text-center">
                <EyeIconSvg />
                <h2>
                  <span>Our</span> Specialties
                </h2>
                <p>The Great Place Of Eyecare Hospital Center</p>
              </div>
            </div>
          </div>
          <div className=" special owl-them aos" data-aos="fade-up">
            <div className="owl-nav " id='slide-nav-1' >

              <button className='owl-prev' onClick={handlePrev} style={{ position: 'absolute', zIndex: 2, transform: 'translateY(50%)' }} >
                <i className="fas fa-chevron-left " />
              </button>
              <button className='owl-next' onClick={handleNext} style={{ position: 'absolute', zIndex: 2, transform: 'translateY(50%)' }} >
                <i className="fas fa-chevron-right " />
              </button>
            </div>
            <Swiper
              {...specialitySettings}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}>
              <SwiperSlide>
                <div className="item">
                  <div className="special-item">
                    <div className="special-img">
                      <Link href="/doctors/search" aria-label='cunsultation'>
                        <img
                          src={clinic_014}
                          alt=""
                          className="img-fluid"
                        />
                      </Link>
                    </div>
                    <div className="special-icon">
                      <Link href="/doctors/search" aria-label='cunsultation'>
                        <i className="fa-solid fa-circle-chevron-right" />
                      </Link>
                    </div>
                    <h3>
                      <Link href="/doctors/search" aria-label='cunsultation'>Cataract</Link>
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="item">
                  <div className="special-item">
                    <div className="special-img">
                      <Link href="/doctors/search" aria-label='cunsultation'>
                        <img
                          // src="assets/img/clinic/clinic-02.webp"
                          src={clinic_012}
                          alt=""
                          className="img-fluid"
                        />
                      </Link>
                    </div>
                    <div className="special-icon">
                      <Link href="/doctors/search" aria-label='cunsultation'>
                        <i className="fa-solid fa-circle-chevron-right" />
                      </Link>
                    </div>
                    <h3>
                      <Link href="/doctors/search">Corneal Ulcer </Link>
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="item">
                  <div className="special-item">
                    <div className="special-img">
                      <Link href="/doctors/search" aria-label='cunsultation'>
                        <img
                          // src="assets/img/clinic/clinic-03.webp"
                          src={clinic_013}
                          alt=""
                          className="img-fluid"
                        />
                      </Link>
                    </div>
                    <div className="special-icon">
                      <Link href="/doctors/search" aria-label='cunsultation'>
                        <i className="fa-solid fa-circle-chevron-right" />
                      </Link>
                    </div>
                    <h3>
                      <Link href="/doctors/search" aria-label='cunsultation'>Keratoconus</Link>
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="item">
                  <div className="special-item">
                    <div className="special-img">
                      <Link href="/doctors/search" aria-label='cunsultation'>
                        <img
                          // src="assets/img/clinic/clinic-01.webp"
                          src={clinic_011}
                          alt=""
                          className="img-fluid"
                        />
                      </Link>
                    </div>
                    <div className="special-icon">
                      <Link href="/doctors/search" aria-label='cunsultation'>
                        <i className="fa-solid fa-circle-chevron-right" />
                      </Link>
                    </div>
                    <h3>
                      <Link href="/doctors/search" aria-label='cunsultation'>Glaucoma</Link>
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="item">
                  <div className="special-item">
                    <div className="special-img">
                      <Link href="/doctors/search" aria-label='cunsultation'>
                        <img
                          // src="assets/img/clinic/clinic-05.webp"
                          src={clinic_015}
                          alt=""
                          className="img-fluid"
                        />
                      </Link>
                    </div>
                    <div className="special-icon">
                      <Link href="/doctors/search" aria-label='cunsultation'>
                        <i className="fa-solid fa-circle-chevron-right" />
                      </Link>
                    </div>
                    <h3>
                      <Link href="/doctors/search">Keratoconus</Link>
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default Specialities;