/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useCallback, useEffect, useRef } from 'react'
import type { Swiper as SwiperInstance } from 'swiper';

import AOS from 'aos'
import Link from 'next/link'
import useScssVar from '@/hooks/useScssVar'
import { useTheme } from '@mui/material'
import { SwiperOptions } from 'swiper/types'
import { Autoplay, FreeMode, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react';


const PartnersSection: FC = (() => {

  const { muiVar } = useScssVar();
  const theme = useTheme();

  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);
  const partnerSettings: SwiperOptions = {
    slidesPerView: 6,
    spaceBetween: 15,
    loop: true,
    autoplay: {
      delay: 1500,
      disableOnInteraction: false,
    },
    modules: [Navigation, FreeMode, Autoplay],
    navigation: {
      prevEl: null,
      nextEl: null,
    },
    breakpoints: {
      992: { slidesPerView: 6 },
      800: { slidesPerView: 3 },
      776: { slidesPerView: 2 },
      567: { slidesPerView: 2 },
      200: { slidesPerView: 1 },
    },
  };

  const swiperRef = useRef<SwiperInstance | null>(null);

  return (
    <Fragment>
      <section className="partners-section" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div
                className="section-header-one text-center aos"
                data-aos="fade-up"
              >
                <h2 className="section-title">Our Partners</h2>
              </div>
            </div>
          </div>
          <div className="partners-info aos" data-aos="fade-up">
            <span className="owl-carousel partners-slider d-flex">
              <Swiper
                {...partnerSettings}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}>
                <SwiperSlide>
                  <span>
                    <Link href="#">
                      <img
                        className="img-fluid"
                        src={`https://placehold.co/124x45/${theme.palette.secondary.main.slice(1)}/white`}
                        alt="partners"
                      />
                    </Link>
                  </span>
                </SwiperSlide>
                <SwiperSlide>
                  <span>
                    <Link href="#">
                      <img
                        className="img-fluid"
                        src={`https://placehold.co/124x45/${theme.palette.primary.main.slice(1)}/white`}
                        alt="partners"
                      />
                    </Link>
                  </span>
                </SwiperSlide>
                <SwiperSlide>
                  <span>
                    <Link href="#">
                      <img
                        className="img-fluid"
                        src={`https://placehold.co/124x45/${theme.palette.secondary.main.slice(1)}/white`}
                        alt="partners"
                      />
                    </Link>
                  </span>
                </SwiperSlide>
                <SwiperSlide>
                  <span>
                    <Link href="#">
                      <img
                        className="img-fluid"
                        src={`https://placehold.co/124x45/${theme.palette.primary.main.slice(1)}/white`}
                        alt="partners"
                      />
                    </Link>
                  </span>
                </SwiperSlide>
                <SwiperSlide>
                  <span>
                    <Link href="#">
                      <img
                        className="img-fluid"
                        src={`https://placehold.co/124x45/${theme.palette.secondary.main.slice(1)}/white`}
                        alt="partners"
                      />
                    </Link>
                  </span>
                </SwiperSlide>
                <SwiperSlide>
                  <span>
                    <Link href="#">
                      <img
                        className="img-fluid"
                        src={`https://placehold.co/124x45/${theme.palette.primary.main.slice(1)}/white`}
                        alt="partners"
                      />
                    </Link>
                  </span>
                </SwiperSlide>
                <SwiperSlide>
                  <span>
                    <Link href="#">
                      <img
                        className="img-fluid"
                        src={`https://placehold.co/124x45/${theme.palette.secondary.main.slice(1)}/white`}
                        alt="partners"
                      />
                    </Link>
                  </span>
                </SwiperSlide>
                <SwiperSlide>
                  <span>
                    <Link href="#">
                      <img
                        className="img-fluid"
                        src={`https://placehold.co/124x45/${theme.palette.primary.main.slice(1)}/white`}
                        alt="partners"
                      />
                    </Link>
                  </span>
                </SwiperSlide>
                <SwiperSlide>
                  <span>
                    <Link href="#">
                      <img
                        className="img-fluid"
                        src={`https://placehold.co/124x45/${theme.palette.secondary.main.slice(1)}/white`}
                        alt="partners"
                      />
                    </Link>
                  </span>
                </SwiperSlide>
                <SwiperSlide>
                  <span>
                    <Link href="#">
                      <img
                        className="img-fluid"
                        src={`https://placehold.co/124x45/${theme.palette.primary.main.slice(1)}/white`}
                        alt="partners"
                      />
                    </Link>
                  </span>
                </SwiperSlide>
                <SwiperSlide>
                  <span>
                    <Link href="#">
                      <img
                        className="img-fluid"
                        src={`https://placehold.co/124x45/${theme.palette.secondary.main.slice(1)}/white`}
                        alt="partners"
                      />
                    </Link>
                  </span>
                </SwiperSlide>
                <SwiperSlide>
                  <span>
                    <Link href="#">
                      <img
                        className="img-fluid"
                        src={`https://placehold.co/124x45/${theme.palette.primary.main.slice(1)}/white`}
                        alt="partners"
                      />
                    </Link>
                  </span>
                </SwiperSlide>
              </Swiper>
            </span>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default PartnersSection;