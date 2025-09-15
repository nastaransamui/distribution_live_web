/* eslint-disable @next/next/no-img-element */
import React, { FC, Fragment, useCallback, useEffect, useRef } from 'react';
import AOS from 'aos'
import useScssVar from '@/hooks/useScssVar';
import Button from '@mui/material/Button';
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";
//redux
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { useTheme } from "@mui/material";

import Tooltip from '@mui/material/Tooltip';
import { useRouter } from 'next/router';
import BeatLoader from 'react-spinners/BeatLoader';
import type { Swiper as SwiperInstance } from 'swiper';
import { SwiperOptions } from 'swiper/types';

const Specialties: FC = (() => {
  const specialities = useSelector((state: AppState) => state.specialities.value)

  const theme = useTheme();
  const { muiVar } = useScssVar();
  const router = useRouter();
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
      1049: { slidesPerView: 6 },
      800: { slidesPerView: 3 },
      776: { slidesPerView: 2 },
      567: { slidesPerView: 2 },
      200: { slidesPerView: 1 },
    },
  };


  useEffect(() => {
    if (typeof window !== 'undefined') {
      AOS.init({
        duration: 1200,
        once: true
      });
    }

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
      <section className="specialities-section-one" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-6 aos" data-aos="fade-up">
              <div className="section-header-one section-header-slider">
                <h2 className="section-title imgColorPrimary">Specialities</h2>
              </div>
            </div>
            <div className="col-md-6 aos" data-aos="fade-up">
              <div className="owl-nav slide-nav-1 text-end nav-control" id='slide-nav-1' >

                <button className='owl-prev' onClick={handlePrev}>
                  <i className="fas fa-chevron-left custom-arrow" />
                </button>
                <button className='owl-next' onClick={handleNext}>
                  <i className="fas fa-chevron-right custom-arrow" />
                </button>
              </div>
            </div>
          </div>
          <div className="specialities-slider-one owl-theme aos " data-aos="fade-up" >


            {
              specialities.length == 0 ?
                <div className="form-search-btn aos" data-aos="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
                  <BeatLoader

                    style={{ position: 'relative' }}
                    color={theme.palette.primary.main} />
                </div> :
                <Fragment>
                  <Swiper
                    {...specialitySettings}
                    onSwiper={(swiper) => {
                      swiperRef.current = swiper;
                    }}
                    key={
                      specialities.map((a) => a?.specialities).toString() +
                      specialities.map((a) => a?.image).toString() +
                      specialities.map((a) => a?.imageId).toString() +
                      specialities.map((a) => a?.users_id).toString()
                    }>
                    {
                      specialities.map((spec) => {
                        let img = document.getElementById(spec.imageId) as any
                        let src = `${spec.image}`
                        if (img !== null) {
                          src = `${spec.image}`
                          img.src = src
                        }
                        return (
                          <SwiperSlide className="item" key={spec._id}>
                            <div className="specialities-item">
                              <div className="specialities-img">
                                <span >
                                  <img src={src} alt='' id={spec.imageId} />
                                </span>
                              </div>
                              {
                                spec.specialities.length <= 13 ? <p>{spec.specialities}</p> :
                                  <Tooltip title={spec.specialities} arrow>
                                    <p>{spec.specialities.slice(0, 10) + ' ...'}</p>
                                  </Tooltip>
                              }
                              <p>{spec.users_id.length !== 0 && spec.users_id.length + ` Doctors`}</p>
                            </div>
                          </SwiperSlide>
                        )
                      })
                    }
                  </Swiper>
                </Fragment>
            }

          </div>
          <div className="form-search-btn aos" data-aos="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
            <Button sx={{
              mt: { lg: 1.5, md: 2, sm: 2, xs: 2 },
            }} className="btn" onClick={(e) => {
              router.push("/doctors/search")
            }}>
              See all Doctors
            </Button>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default Specialties