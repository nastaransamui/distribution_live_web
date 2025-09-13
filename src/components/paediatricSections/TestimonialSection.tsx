/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useRef } from 'react'
import useScssVar from '@/hooks/useScssVar'
import {
  clientSay1,
  clientSay2,
  clientSay3,
  cloud_2,
  rainbow_2,
  rainbow_3,
  rainbow_4,
} from '../../../public/assets/imagepath';
import { AtomBondSvg } from '../../../public/assets/images/icons/IconsSvgs';
import { useTheme } from '@mui/material';
import { SwiperOptions } from 'swiper/types';
import { Pagination } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';


const TestimonialSection: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();

  const doctersettings: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 15,
    loop: true,

    modules: [Pagination],
    navigation: false,
    pagination: { clickable: true, el: '.testimonial-pagination', },
    breakpoints: {
      1049: { slidesPerView: 1 },
      992: { slidesPerView: 1 },
      800: { slidesPerView: 3 },
      776: { slidesPerView: 3 },
      567: { slidesPerView: 1 },
      200: { slidesPerView: 1 },
    },
  };

  const swiperRef = useRef<SwiperInstance | null>(null);

  return (
    <Fragment>
      <section className="client-us-section-thirteen common-padding" style={{ ...muiVar, backgroundColor: theme.palette.background.paper }}>
        <div className="client-us-section-thirteenone aos" data-aos="fade-right">
          <img src={cloud_2} alt="#" />
          <img src={rainbow_2} alt="#" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 aos" data-aos="fade-up">
              <div className="section-header-thirteen">
                <div className="section-inner-thirteen">
                  <AtomBondSvg />
                </div>
                <h2>What Our Client Says?</h2>
              </div>
            </div>
          </div>
          <div className="client-says-thirteen owl-theme">
            <Swiper
              {...doctersettings}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}>
              <SwiperSlide>
                <div className="client-says-all">
                  <div className="clients-says-content">
                    <p>I would like to thank everyone at Health care for the fantastic way you looked after me.
                      I could not fault anyone during the time I spent with you - from the point I arrived in reception,
                      to the catering team and every member of staff throughout the changes of shift during my stay.</p>
                    <h4>
                      Courtney Henry
                    </h4>
                    <p className="location-thirteen"><i className="fa-solid fa-location-dot" /> New York, USA</p>
                    <div className="client-says-imagesone">
                      <img src={rainbow_3} alt="#" />
                      <img src={rainbow_4} alt="#" />
                    </div>
                  </div>
                  <div className="client-says-images">
                    <img src={clientSay1} alt="img-fluid" />
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="client-says-all">
                  <div className="clients-says-content">
                    <p>I would like to thank everyone at Health care for the fantastic way you looked after me.
                      I could not fault anyone during the time I spent with you - from the point I arrived in reception,
                      to the catering team and every member of staff throughout the changes of shift during my stay.</p>
                    <h4>
                      Courtney Henry
                    </h4>
                    <p className="location-thirteen"><i className="fa-solid fa-location-dot" /> New York, USA</p>
                    <div className="client-says-imagesone">
                      <img src={rainbow_3} alt="#" />
                      <img src={rainbow_4} alt="#" />
                    </div>
                  </div>
                  <div className="client-says-images">
                    <img src={clientSay2} alt="img-fluid" />
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="client-says-all">
                  <div className="clients-says-content">
                    <p>I would like to thank everyone at Health care for the fantastic way you looked after me.
                      I could not fault anyone during the time I spent with you - from the point I arrived in reception,
                      to the catering team and every member of staff throughout the changes of shift during my stay.</p>
                    <h4>
                      Courtney Henry
                    </h4>
                    <p className="location-thirteen"><i className="fa-solid fa-location-dot" /> New York, USA</p>
                    <div className="client-says-imagesone">
                      <img src={rainbow_3} alt="#" />
                      <img src={rainbow_4} alt="#" />
                    </div>
                  </div>
                  <div className="client-says-images">
                    <img src={clientSay3} alt="img-fluid" />
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
            <div className="testimonial-pagination" />
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default TestimonialSection;