/* eslint-disable @next/next/no-img-element */
import { Fragment, FC, useCallback, useRef } from "react";
import useScssVar from "@/hooks/useScssVar";

import Link from 'next/link';
import { BlogWrap01, BlogWrap02, BlogWrap03, BlogWrap04, IMG01, IMG02, IMG03, IMG04 } from "@/public/assets/imagepath";
import { SwiperOptions } from 'swiper/types';
import { FreeMode, Navigation } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';




const BlogNews: FC = (() => {
  const { muiVar } = useScssVar();
  const blogSettings: SwiperOptions = {
    slidesPerView: 4,
    spaceBetween: 15,
    loop: false,

    modules: [Navigation, FreeMode],
    navigation: {
      prevEl: null,
      nextEl: null,
    },
    breakpoints: {
      1200: { slidesPerView: 3 },
      992: { slidesPerView: 3 },
      800: { slidesPerView: 3 },
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
      <section className="our-blog-section" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="section-heading aos" data-aos="fade-up">
                <h2>Blogs and News</h2>
                <p>Read Professional Articles and Latest Articles</p>
              </div>
            </div>
            <div className="col-md-6 text-end aos" data-aos="fade-up">
              <div className="owl-nav slide-nav-4 text-end nav-control" >

                <button className='owl-prev' onClick={handlePrev}>
                  <i className="fas fa-chevron-left custom-arrow" />
                </button>
                <button className='owl-next' onClick={handleNext}>
                  <i className="fas fa-chevron-right custom-arrow" />
                </button>
              </div>
            </div>
          </div>
          <div className="blogs owl-theme aos" data-aos="fade-up">
            <Swiper
              {...blogSettings}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}>
              <SwiperSlide className="item">
                <div className="our-blogs">
                  <div className="blogs-img">
                    <Link href="/blog/blog-details" aria-label="blogs">
                      <img src={BlogWrap01} className="img-fluid" alt="" style={{ width: "100%" }} />
                    </Link>
                    <div className="blogs-overlay d-flex">
                      <img src={IMG01} className="img-fluid" alt="" />
                      <span className="blogs-writter">Dr. Ruby Perrin</span>
                    </div>
                  </div>
                  <div className="blogs-info">
                    <span>Urology</span>
                    <Link href="/blog/blog-details" aria-label="blogs"><h3>Health care – Making your clinic painless visit?</h3></Link>
                    <p>Lorem ipsum dolor sit amet, consectetur em adipiscing elit, sed do eiusmod tempor.</p>
                    <span className="blogs-time"><i className="far fa-clock" /> 3 Dec 2021</span>
                  </div>
                  <div className="blogs-nav">
                    <Link href="/blog/blog-details" aria-label="blogs" className="blogs-btn">Full Article</Link>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide className="item">
                <div className="our-blogs">
                  <div className="blogs-img">
                    <Link href="/blog/blog-details" aria-label="blogs">
                      <img src={BlogWrap02} className="img-fluid" alt="" style={{ width: "100%" }} />
                    </Link>
                    <div className="blogs-overlay d-flex">
                      <img src={IMG02} className="img-fluid" alt="" />
                      <span className="blogs-writter">Dr. Ruby Perrin</span>
                    </div>
                  </div>
                  <div className="blogs-info">
                    <span>Neurology</span>
                    <Link href="/blog/blog-details" aria-label="blogs"><h3>What are the benefits of Online Doctor Booking?</h3></Link>
                    <p>Lorem ipsum dolor sit amet, consectetur em adipiscing elit, sed do eiusmod tempor.</p>
                    <span className="blogs-time"><i className="far fa-clock" /> 3 Dec 2021</span>
                  </div>
                  <div className="blogs-nav">
                    <Link href="/blog/blog-details" aria-label="blogs" className="blogs-btn">Full Article</Link>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide className="item">
                <div className="our-blogs">
                  <div className="blogs-img">
                    <Link href="/blog/blog-details" aria-label="blogs">
                      <img src={BlogWrap03} className="img-fluid" alt="" style={{ width: "100%" }} />
                    </Link>
                    <div className="blogs-overlay d-flex">
                      <img src={IMG03} className="img-fluid" alt="" />
                      <span className="blogs-writter">Dr. Ruby Perrin</span>
                    </div>
                  </div>
                  <div className="blogs-info">
                    <span>Orthopedic</span>
                    <Link href="/blog/blog-details" aria-label="blogs"><h3>Benefits of consulting with an Online Doctor</h3></Link>
                    <p>Lorem ipsum dolor sit amet, consectetur em adipiscing elit, sed do eiusmod tempor.</p>
                    <span className="blogs-time"><i className="far fa-clock" /> 3 Dec 2021</span>
                  </div>
                  <div className="blogs-nav">
                    <Link href="/blog/blog-details" aria-label="blogs" className="blogs-btn">Full Article</Link>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide className="item">
                <div className="our-blogs">
                  <div className="blogs-img">
                    <Link href="/blog/blog-details" aria-label="blogs">
                      <img src={BlogWrap04} className="img-fluid" alt="" style={{ width: "100%" }} />
                    </Link>
                    <div className="blogs-overlay d-flex">
                      <img src={IMG04} className="img-fluid" alt="" />
                      <span className="blogs-writter">Dr. Ruby Perrin</span>
                    </div>
                  </div>
                  <div className="blogs-info">
                    <span>Cardiologist</span>
                    <Link href="/blog/blog-details" aria-label="blogs"><h3>5 Great reasons to use an Online Doctor</h3></Link>
                    <p>Lorem ipsum dolor sit amet, consectetur em adipiscing elit, sed do eiusmod tempor.</p>
                    <span className="blogs-time"><i className="far fa-clock" /> 3 Dec 2021</span>
                  </div>
                  <div className="blogs-nav">
                    <Link href="/blog/blog-details" aria-label="blogs" className="blogs-btn">Full Article</Link>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </section>
    </Fragment>
  )
})

export default BlogNews;