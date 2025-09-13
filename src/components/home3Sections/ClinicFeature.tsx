/* eslint-disable @next/next/no-img-element */
import { Fragment, FC, useCallback, useRef } from "react";
import useScssVar from "@/hooks/useScssVar";
import Link from 'next/link';
import { clinic_06, clinic_07, clinic_08, clinic_09, clinic_10 } from "@/public/assets/imagepath";
import { SwiperOptions } from 'swiper/types';
import { FreeMode, Navigation } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

const ClinicFeature: FC = (() => {

  const { muiVar } = useScssVar();
  const clinicSettings: SwiperOptions = {
    slidesPerView: 4,
    spaceBetween: 15,
    loop: false,

    modules: [Navigation, FreeMode],
    navigation: {
      prevEl: null,
      nextEl: null,
    },
    breakpoints: {
      1200: { slidesPerView: 4 },
      992: { slidesPerView: 2 },
      800: { slidesPerView: 2 },
      776: { slidesPerView: 2 },
      567: { slidesPerView: 1 },
      200: { slidesPerView: 1 },
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
      <section className="clinic-features-section" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="section-heading aos" data-aos="fade-up">
                <h2>Availabe Features in Our Clinic</h2>
                <p>Meet our Experts &amp; Book Online</p>
              </div>
            </div>
            <div className="col-md-6 text-end aos" data-aos="fade-up">
              <div className="owl-nav slide-nav-3 text-end nav-control" >

                <button className='owl-prev' onClick={handlePrev}>
                  <i className="fas fa-chevron-left custom-arrow" />
                </button>
                <button className='owl-next' onClick={handleNext}>
                  <i className="fas fa-chevron-right custom-arrow" />
                </button>
              </div>
            </div>
          </div>
          <div className="clinic-feature owl-theme aos" data-aos="fade-up">
            <Swiper
              {...clinicSettings}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}>
              <SwiperSlide className="item">
                <div className="clinic-features">
                  <img src={clinic_06} className="img-fluid" alt="" />
                </div>
                <div className="clinic-feature-overlay">
                  <Link href="#" aria-label="link" className="img-overlay">Operation</Link>
                </div>
              </SwiperSlide>
              <SwiperSlide className="item">
                <div className="clinic-features">
                  <img src={clinic_07} className="img-fluid" alt="" />
                </div>
                <div className="clinic-feature-overlay">
                  <Link href="#" aria-label="link" className="img-overlay">Medical</Link>
                </div>
              </SwiperSlide>
              <SwiperSlide className="item">
                <div className="clinic-features">
                  <img src={clinic_08} className="img-fluid" alt="" />
                </div>
                <div className="clinic-feature-overlay">
                  <Link href="#" aria-label="link" className="img-overlay">Patient Ward</Link>
                </div>
              </SwiperSlide>
              <SwiperSlide className="item">
                <div className="clinic-features">
                  <img src={clinic_09} className="img-fluid" alt="" />
                </div>
                <div className="clinic-feature-overlay">
                  <Link href="#" aria-label="link" className="img-overlay">TEST ROOM</Link>
                </div>
              </SwiperSlide>
              <SwiperSlide className="item">
                <div className="clinic-features">
                  <img src={clinic_10} className="img-fluid" alt="" />
                </div>
                <div className="clinic-feature-overlay">
                  <Link href="#" aria-label="link" className="img-overlay">ICU</Link>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default ClinicFeature