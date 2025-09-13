/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import useScssVar from '@/hooks/useScssVar'
import AOS from 'aos'
import { DoctThumb10, DoctThumb2, DoctThumb8, DoctThumb9, blog_15, blog_16, blog_17 } from '@/public/assets/imagepath'
import { SwiperOptions } from 'swiper/types';
import { FreeMode, Navigation } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';



const BlogSection: FC = (() => {
  const { muiVar } = useScssVar();
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);
  const doctersettings: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 15,
    loop: false,

    modules: [Navigation, FreeMode],
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

  const handlePrev = useCallback(() => {
    swiperRef.current?.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    swiperRef.current?.slideNext();
  }, []);
  return (
    <Fragment>
      <div className="blog-section-fourteen" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="section-header-fourteen">
                <div className="service-inner-fourteen">
                  <div className="service-inner-fourteen-one"></div>
                  <div className="service-inner-fourteen-two">
                    <h3>Blog</h3>
                  </div>
                  <div className="service-inner-fourteen-three"></div>
                </div>
                <h2>Our Recent Articles</h2>
              </div>
            </div>
            <div className="col-lg-6 aos" data-aos="fade-up">
              <div className="owl-nav slide-nav-15 text-end nav-control" >
                <button className='owl-prev' onClick={handlePrev}>
                  <i className="fa-solid fa-caret-left " />
                </button>
                <button className='owl-next' onClick={handleNext}>
                  <i className="fa-solid fa-caret-right" />
                </button>
              </div>
            </div>
          </div>
          <div className="blog-slider-fourteen owl-theme aos" data-aos="fade-up" >
            <Swiper
              {...doctersettings}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}>
              <SwiperSlide>
                <div className="card blog-inner-fourt-all">
                  <div className="card-body blog-inner-fourt-main">
                    <div className="blog-inner-right-fourt">
                      <Link href="/blog/blog-details">
                        <div className="blog-inner-right-img">
                          <img
                            src={blog_15}
                            alt="image"
                            className="img-fluid blog-inner-right-inner"
                          />
                          <div className="blog-inner-top-content">
                            <img
                              src={DoctThumb2}
                              alt=""
                              className="me-2"
                            />
                            <span>Dr. Pamila Certis</span>
                          </div>
                        </div>
                      </Link>
                      <Link href="/blog/blog-details" className="blog-inner-right-fourt-care">
                        How To Get Pregnant: Tips to Increas it Affect Fertility
                      </Link>
                      <ul className="articles-list nav blog-articles-list">
                        <li>
                          <i className="feather-calendar" /> 13 Aug, 2023
                        </li>
                        <li>
                          <i className="feather-message-square" /> 68
                        </li>
                        <li>
                          <i className="feather-eye" /> 1.5k
                        </li>
                      </ul>
                      <ul className="articles-list nav blog-articles-list-two">
                        <li>Pregnancy</li>
                        <li>Fertility</li>
                      </ul>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore ad minim veniam,
                        quis magna aliqua.{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="card blog-inner-fourt-all">
                  <div className="card-body blog-inner-fourt-main">
                    <div className="blog-inner-right-fourt">
                      <Link href="/blog/blog-details">
                        <div className="blog-inner-right-img">
                          <img
                            src={blog_16}
                            alt="image"
                            className="img-fluid blog-inner-right-inner"
                          />
                          <div className="blog-inner-top-content">
                            <img
                              src={DoctThumb8}
                              alt=""
                              className="me-2"
                            />
                            <span>Dr. James Matthew</span>
                          </div>
                        </div>
                      </Link>
                      <Link href="/blog/blog-details" className="blog-inner-right-fourt-care">
                        Flavourful Recipe of Central India to Boost Fertility
                      </Link>
                      <ul className="articles-list nav blog-articles-list">
                        <li>
                          <i className="feather-calendar" /> 13 Apr, 2023
                        </li>
                        <li>
                          <i className="feather-message-square" /> 87
                        </li>
                        <li>
                          <i className="feather-eye" /> 2.5k
                        </li>
                      </ul>
                      <ul className="articles-list nav blog-articles-list-two">
                        <li>Diet</li>
                        <li>Health</li>
                      </ul>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore ad minim veniam,
                        quis magna aliqua.{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="card blog-inner-fourt-all">
                  <div className="card-body blog-inner-fourt-main">
                    <div className="blog-inner-right-fourt">
                      <Link href="/blog/blog-details">
                        <div className="blog-inner-right-img">
                          <img
                            src={blog_17}
                            alt="image"
                            className="img-fluid blog-inner-right-inner"
                          />
                          <div className="blog-inner-top-content">
                            <img
                              src={DoctThumb9}
                              alt=""
                              className="me-2"
                            />
                            <span>Dr. James Certis</span>
                          </div>
                        </div>
                      </Link>
                      <Link href="/blog/blog-details" className="blog-inner-right-fourt-care">
                        Sperm Morphology – What is it &amp; How Does it Affect Fertility
                      </Link>
                      <ul className="articles-list nav blog-articles-list">
                        <li>
                          <i className="feather-calendar" /> 26 May, 2023
                        </li>
                        <li>
                          <i className="feather-message-square" /> 78
                        </li>
                        <li>
                          <i className="feather-eye" /> 1.6k
                        </li>
                      </ul>
                      <ul className="articles-list nav blog-articles-list-two">
                        <li>Health</li>
                        <li>Fertility</li>
                      </ul>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore ad minim veniam,
                        quis magna aliqua.{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="card blog-inner-fourt-all">
                  <div className="card-body blog-inner-fourt-main">
                    <div className="blog-inner-right-fourt">
                      <Link href="/blog/blog-details">
                        <div className="blog-inner-right-img">
                          <img
                            src={blog_17}
                            alt="image"
                            className="img-fluid blog-inner-right-inner"
                          />
                          <div className="blog-inner-top-content">
                            <img
                              src={DoctThumb10}
                              alt=""
                              className="me-2"
                            />
                            <span>Dr. Pamila Certis</span>
                          </div>
                        </div>
                      </Link>
                      <Link href="/blog/blog-details" className="blog-inner-right-fourt-care">
                        How To Get Pregnant: Tips to Increas Fertility
                      </Link>
                      <ul className="articles-list nav blog-articles-list">
                        <li>
                          <i className="feather-calendar" /> 13 Aug, 2023
                        </li>
                        <li>
                          <i className="feather-message-square" /> 68
                        </li>
                        <li>
                          <i className="feather-eye" /> 1.5k
                        </li>
                      </ul>
                      <ul className="articles-list nav blog-articles-list-two">
                        <li>Pregnancy</li>
                        <li>Fertility</li>
                      </ul>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore ad minim veniam,
                        quis magna aliqua.{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
          <div
            className="blog-btn-sec text-center aos aos-init aos-animate"
            data-aos="fade-up"
          >
            <Link href="/doctors" className="btn btn-primary btn-view">
              Read More Articles
            </Link>
          </div>
        </div>
      </div>
    </Fragment>
  )
})

export default BlogSection;