/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import AOS from 'aos'
import useScssVar from '@/hooks/useScssVar'
import { useTheme } from '@mui/material'
import { DoctThumb10, DoctThumb2, DoctThumb8, DoctThumb9, VetBlog01, VetBlog02, VetBlog03 } from '@/public/assets/imagepath'
import { SwiperOptions } from 'swiper/types';
import { FreeMode, Navigation } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';


const BlogSection: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();

  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);
  const doctersettings: SwiperOptions = {
    slidesPerView: 3,
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
      <div className="blog-section-fourteen" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-header-fourteen service-inner-fourteen">
                <div className="service-inner-fourteen">
                  <div className="service-inner-fourteen-two">
                    <h3>BLOG</h3>
                  </div>
                </div>
                <h2>Our Blogs</h2>
                <p>Our Recent Articles</p>
              </div>
            </div>
          </div>
          <div
            className="blog-slider-fourteen owl-theme aos"
            data-aos="fade-up"
          >
            <Swiper
              {...doctersettings}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }} className="blog-slider-fourteen owl-theme aos"
              data-aos="fade-up">
              <SwiperSlide>
                <div className="card blog-inner-fourt-all">
                  <div className="card-body blog-inner-fourt-main">
                    <div className="blog-inner-right-fourt">
                      <Link href="/blog">
                        <div className="blog-inner-right-img">
                          <img
                            src={VetBlog01}
                            alt="image"
                            className="img-fluid "
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
                      <Link
                        href="/blog"
                        className="blog-inner-right-fourt-care"
                      >
                        What You Might Not Know About The Best Dog Food in India
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
                        <li>Dog</li>
                        <li>Health</li>
                        <li>Diet Foods</li>
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
                      <Link href="/blog">
                        <div className="blog-inner-right-img">
                          <img
                            src={VetBlog02}
                            alt="image"
                            className="img-fluid "
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
                      <Link
                        href="/blog"
                        className="blog-inner-right-fourt-care"
                      >
                        How to Care for Rabbits in the Winter
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
                        <li>Pet Care</li>
                        <li>Rabbit</li>
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
                      <Link href="/blog">
                        <div className="blog-inner-right-img">
                          <img
                            src={VetBlog03}
                            alt="image"
                            className="img-fluid "
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
                      <Link
                        href="/blog"
                        className="blog-inner-right-fourt-care"
                      >
                        Why Cat Scratches?
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
                        <li>Cat</li>
                        <li>Cat Scratcher</li>
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
                      <Link href="/blog">
                        <div className="blog-inner-right-img">
                          <img
                            src={VetBlog02}
                            alt="image"
                            className="img-fluid "
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
                      <Link
                        href="/blog"
                        className="blog-inner-right-fourt-care"
                      >
                        What You Might Not Know About The Best Dog Food in India
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
                        <li>Dog</li>
                        <li>Health</li>
                        <li>Diet Foods</li>
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
          <div className="owl-nav slide-nav-15 text-end nav-control" >
            <button className='owl-prev' onClick={handlePrev}>
              <i className="fa-solid fa-caret-left "></i>
            </button>
            <button className='owl-next' onClick={handleNext}>
              <i className="fa-solid fa-caret-right"></i>
            </button>
          </div>
          <div
            className="blog-btn-sec text-center aos aos-init aos-animate"
            data-aos="fade-up"
          >
            <Link href="/blog" className="btn btn-primary btn-view">
              Read More Articles
            </Link>
          </div>
        </div>
      </div>
    </Fragment>
  )
});


export default BlogSection;