/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useRef } from 'react'
import Link from 'next/link'
import useScssVar from '@/hooks/useScssVar'
import { servicesixteenicon } from '../../../public/assets/imagepath';
import { DiscoverFiveSvg, DiscoverFourSvg, DiscoverOneSvg, DiscoverThreeSvg, DiscoverTwoSvg } from '../../../public/assets/images/icons/IconsSvgs';
import { useTheme } from '@mui/material';
import { SwiperOptions } from 'swiper/types';
import { FreeMode, Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';



const ServicesSection: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  const doctersettings: SwiperOptions = {
    slidesPerView: 4,
    slidesPerGroup: 4,
    spaceBetween: 10,
    speed: 2800,
    loop: false,
    pagination: {
      clickable: true,
      el: '.owl-dots',

    },
    modules: [Navigation, FreeMode, Pagination],
    navigation: {
      prevEl: null,
      nextEl: null,
    },
    breakpoints: {
      1300: { slidesPerView: 4 },
      1000: { slidesPerView: 5 },
      768: { slidesPerView: 2 },
      575: { slidesPerView: 2 },
      500: { slidesPerView: 1 },
      0: { slidesPerView: 1 },
    },
  };


  const swiperRef = useRef<SwiperInstance | null>(null);



  return (
    <Fragment>
      <section className="services-section-sixteen" style={{ ...muiVar, backgroundColor: theme.palette.background.paper }}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-header-sixteen text-center">
                <p>Recapture the beauty of self-confidence</p>
                <h2>Discover a New you</h2>
              </div>
            </div>
          </div>
          <div className="discover-slider owl-theme">
            <Swiper
              {...doctersettings}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}>
              <SwiperSlide>
                <div className="discover-you-main">
                  <div className="discover-you-image">
                    <DiscoverFiveSvg />
                  </div>
                  <Link href="#">Body</Link>
                  <p>Lorem Ipsum is simply dummy typesetting industry.</p>
                  <Link href="#" className="discov-innner">
                    Get your answers
                    <i className="fa-solid fa-chevron-right ms-2" />
                  </Link>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="discover-you-main">
                  <div className="discover-you-image">
                    <DiscoverFourSvg />
                  </div>
                  <Link href="#">Face</Link>
                  <p>Lorem Ipsum is simply dummy typesetting industry.</p>
                  <Link href="#" className="discov-innner">
                    Get your answers
                    <i className="fa-solid fa-chevron-right ms-2" />
                  </Link>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="discover-you-main">
                  <div className="discover-you-image">
                    <DiscoverThreeSvg />
                  </div>
                  <Link href="#">Breast</Link>
                  <p>Lorem Ipsum is simply dummy typesetting industry.</p>
                  <Link href="#" className="discov-innner">
                    Get your answers
                    <i className="fa-solid fa-chevron-right ms-2" />
                  </Link>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="discover-you-main">
                  <div className="discover-you-image">
                    <DiscoverTwoSvg />
                  </div>
                  <Link href="#">Nose</Link>
                  <p>Lorem Ipsum is simply dummy typesetting industry.</p>
                  <Link href="#" className="discov-innner">
                    Get your answers
                    <i className="fa-solid fa-chevron-right ms-2" />
                  </Link>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="discover-you-main">
                  <div className="discover-you-image">
                    <DiscoverOneSvg />
                  </div>
                  <Link href="#">Fillers</Link>
                  <p>Lorem Ipsum is simply dummy typesetting industry.</p>
                  <Link href="#" className="discov-innner">
                    Get your answers
                    <i className="fa-solid fa-chevron-right ms-2" />
                  </Link>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="discover-you-main">
                  <div className="discover-you-image">
                    <DiscoverThreeSvg />
                  </div>
                  <Link href="#">Face</Link>
                  <p>Lorem Ipsum is simply dummy typesetting industry.</p>
                  <Link href="#" className="discov-innner">
                    Get your answers
                    <i className="fa-solid fa-chevron-right ms-2" />
                  </Link>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="discover-you-main">
                  <div className="discover-you-image">
                    <DiscoverFourSvg />
                  </div>
                  <Link href="#">Body</Link>
                  <p>Lorem Ipsum is simply dummy typesetting industry.</p>
                  <Link href="#" className="discov-innner">
                    Get your answers
                    <i className="fa-solid fa-chevron-right ms-2" />
                  </Link>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="discover-you-main">
                  <div className="discover-you-image">
                    <DiscoverThreeSvg />
                  </div>
                  <Link href="#">Nose</Link>
                  <p>Lorem Ipsum is simply dummy typesetting industry.</p>
                  <Link href="#" className="discov-innner">
                    Get your answers
                    <i className="fa-solid fa-chevron-right ms-2" />
                  </Link>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="discover-you-main">
                  <div className="discover-you-image">
                    <DiscoverTwoSvg />
                  </div>
                  <Link href="#">Fillers</Link>
                  <p>Lorem Ipsum is simply dummy typesetting industry.</p>
                  <Link href="#" className="discov-innner">
                    Get your answers
                    <i className="fa-solid fa-chevron-right ms-2" />
                  </Link>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="discover-you-main">
                  <div className="discover-you-image">
                    <DiscoverFourSvg />
                  </div>
                  <Link href="#">Breast</Link>
                  <p>Lorem Ipsum is simply dummy typesetting industry.</p>
                  <Link href="#" className="discov-innner">
                    Get your answers
                    <i className="fa-solid fa-chevron-right ms-2" />
                  </Link>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="discover-you-main">
                  <div className="discover-you-image">
                    <DiscoverTwoSvg />
                  </div>
                  <Link href="#">Body</Link>
                  <p>Lorem Ipsum is simply dummy typesetting industry.</p>
                  <Link href="#" className="discov-innner">
                    Get your answers
                    <i className="fa-solid fa-chevron-right ms-2" />
                  </Link>
                </div>
              </SwiperSlide>
            </Swiper>
            <div className="owl-dots" />
          </div>
        </div>
        <div className="service-sixteen-icon imgColorPrimary">
          <img src={servicesixteenicon} alt="" />
        </div>
      </section>
    </Fragment>
  )
});

export default ServicesSection;