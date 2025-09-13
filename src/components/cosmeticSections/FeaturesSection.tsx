/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useRef } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { featureservice1, featureservice3, featureservice2 } from '../../../public/assets/imagepath';
import { SwiperOptions } from 'swiper/types';
import { FreeMode, Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';


const FeaturesSection: FC = (() => {

  const { muiVar } = useScssVar();
  const doctersettings: SwiperOptions = {
    slidesPerView: 3,
    slidesPerGroup: 3,
    spaceBetween: 15,
    loop: false,
    speed: 1800,
    pagination: {
      clickable: true,
      el: '.owl-dots-feature',

    },

    modules: [Navigation, FreeMode, Pagination],
    navigation: {
      prevEl: null,
      nextEl: null,
    },
    breakpoints: {
      1049: { slidesPerView: 3 },
      992: { slidesPerView: 3 },
      800: { slidesPerView: 3 },
      776: { slidesPerView: 3 },
      567: { slidesPerView: 1 },
      200: { slidesPerView: 1 },
    },
  };

  const swiperRef = useRef<SwiperInstance | null>(null);

  return (
    <Fragment>
      <div className="features-section-sixteen" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-header-sixteen text-center">
                <p>OUr services</p>
                <h2>Featured Services</h2>
              </div>
            </div>
          </div>
          <div className="features-slider-sixteen owl-theme">
            <Swiper
              {...doctersettings}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}>
              <SwiperSlide>
                <div className="feature-sixteen-main">
                  <div className="feature-six-img">
                    <img src={featureservice1} alt="" className="img-fluid" />
                    <div className="feature-content-six">
                      <div className="feature-content-one">
                        <h1>Mommy Makeover</h1>
                        <span>
                          <i className="fa-solid fa-angle-up" />
                        </span>
                      </div>
                      <div className="feature-content-two">
                        <p>
                          Facial procedures are popular because of their ability to
                          give patients a youthful appearance, reduce the signs of
                          aging and by improving existing features for more
                          aesthetically pleasing results. These methods are in two
                          separate categories and are commonly known as facial
                          rejuvenation and facial contouring. Facial rejuvenation
                          consists of facelift, eyelid lift, neck lift and brow lift.
                        </p>
                        <span>
                          <i className="fa-solid fa-angle-down" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="feature-sixteen-main">
                  <div className="feature-six-img">
                    <img src={featureservice3} alt="" className="img-fluid" />
                    <div className="feature-content-six">
                      <div className="feature-content-one">
                        <h1>Face Makeover</h1>
                        <span>
                          <i className="fa-solid fa-angle-up" />
                        </span>
                      </div>
                      <div className="feature-content-two">
                        <p>
                          Facial procedures are popular because of their ability to
                          give patients a youthful appearance, reduce the signs of
                          aging and by improving existing features for more
                          aesthetically pleasing results. These methods are in two
                          separate categories and are commonly known as facial
                          rejuvenation and facial contouring. Facial rejuvenation
                          consists of facelift, eyelid lift, neck lift and brow lift.
                        </p>
                        <span>
                          <i className="fa-solid fa-angle-down" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="feature-sixteen-main">
                  <div className="feature-six-img">
                    <img src={featureservice2} alt="" className="img-fluid" />
                    <div className="feature-content-six">
                      <div className="feature-content-one">
                        <h1>Body Tite</h1>
                        <span>
                          <i className="fa-solid fa-angle-up" />
                        </span>
                      </div>
                      <div className="feature-content-two">
                        <p>
                          Facial procedures are popular because of their ability to
                          give patients a youthful appearance, reduce the signs of
                          aging and by improving existing features for more
                          aesthetically pleasing results. These methods are in two
                          separate categories and are commonly known as facial
                          rejuvenation and facial contouring. Facial rejuvenation
                          consists of facelift, eyelid lift, neck lift and brow lift.
                        </p>
                        <span>
                          <i className="fa-solid fa-angle-down" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="feature-sixteen-main">
                  <div className="feature-six-img">
                    <img src={featureservice3} alt="" className="img-fluid" />
                    <div className="feature-content-six">
                      <div className="feature-content-one">
                        <h1>Body Tite</h1>
                        <span>
                          <i className="fa-solid fa-angle-up" />
                        </span>
                      </div>
                      <div className="feature-content-two">
                        <p>
                          Facial procedures are popular because of their ability to
                          give patients a youthful appearance, reduce the signs of
                          aging and by improving existing features for more
                          aesthetically pleasing results. These methods are in two
                          separate categories and are commonly known as facial
                          rejuvenation and facial contouring. Facial rejuvenation
                          consists of facelift, eyelid lift, neck lift and brow lift.
                        </p>
                        <span>
                          <i className="fa-solid fa-angle-down" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="feature-sixteen-main">
                  <div className="feature-six-img">
                    <img src={featureservice1} alt="" className="img-fluid" />
                    <div className="feature-content-six">
                      <div className="feature-content-one">
                        <h1>Body Tite</h1>
                        <span>
                          <i className="fa-solid fa-angle-up" />
                        </span>
                      </div>
                      <div className="feature-content-two">
                        <p>
                          Facial procedures are popular because of their ability to
                          give patients a youthful appearance, reduce the signs of
                          aging and by improving existing features for more
                          aesthetically pleasing results. These methods are in two
                          separate categories and are commonly known as facial
                          rejuvenation and facial contouring. Facial rejuvenation
                          consists of facelift, eyelid lift, neck lift and brow lift.
                        </p>
                        <span>
                          <i className="fa-solid fa-angle-down" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
            <div className='owl-dots-feature' />
          </div>
        </div>
      </div>
    </Fragment>
  )
});

export default FeaturesSection;