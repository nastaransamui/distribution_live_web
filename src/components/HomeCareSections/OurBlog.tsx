/* eslint-disable @next/next/no-img-element */
import { FC, useCallback, useRef } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link'
import { blog_18, blog_19, blog_20, blog_bg_14 } from '@/public/assets/imagepath'
import { useTheme } from "@mui/material";
import { SwiperOptions } from 'swiper/types';
import { FreeMode, Navigation } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';


const OurBlog: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme()
  const doctersettings: SwiperOptions = {
    slidesPerView: 5,
    spaceBetween: 30,
    loop: false,

    modules: [Navigation, FreeMode],
    navigation: {
      prevEl: null,
      nextEl: null,
    },
    breakpoints: {
      1170: { slidesPerView: 3 },
      991: { slidesPerView: 3 },
      768: { slidesPerView: 2 },
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
    <section className="our-blog-fourteen" style={{ ...muiVar, backgroundColor: theme.palette.background.paper }}>
      <div className="section-bg">
        <img src={blog_bg_14} alt="Img" />
      </div>
      <div className="container">
        <div className="section-head-fourteen">
          <h2>
            Our <span> Blog </span>
          </h2>
          <p>Our latest articles</p>
        </div>
        <ul className="nav nav-pills inner-tab" id="pills-tab" role="tablist">
          <li
            className="nav-item"
            role="presentation"
            data-aos="fade-up"
            data-aos-delay={500}
          >
            <button
              className="nav-link active"
              id="pills-all-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-all"
              type="button"
              role="tab"
              aria-controls="pills-all"
              aria-selected="false"
            >
              All Blogs
            </button>
          </li>
          <li
            className="nav-item"
            role="presentation"
            data-aos="fade-up"
            data-aos-delay={600}
          >
            <button
              className="nav-link"
              id="pills-family-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-family"
              type="button"
              role="tab"
              aria-controls="pills-family"
              aria-selected="true"
            >
              Health and Safety
            </button>
          </li>
          <li
            className="nav-item"
            role="presentation"
            data-aos="fade-up"
            data-aos-delay={700}
          >
            <button
              className="nav-link"
              id="pills-adult-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-adult"
              type="button"
              role="tab"
              aria-controls="pills-adult"
              aria-selected="false"
            >
              Caregiving
            </button>
          </li>
          <li
            className="nav-item"
            role="presentation"
            data-aos="fade-up"
            data-aos-delay={800}
          >
            <button
              className="nav-link"
              id="pills-accident-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-accident"
              type="button"
              role="tab"
              aria-controls="pills-accident"
              aria-selected="false"
            >
              Food{" "}
            </button>
          </li>
          <li
            className="nav-item"
            role="presentation"
            data-aos="fade-up"
            data-aos-delay={900}
          >
            <button
              className="nav-link"
              id="pills-fitness-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-fitness"
              type="button"
              role="tab"
              aria-controls="pills-fitness"
              aria-selected="false"
            >
              Senior Care
            </button>
          </li>
          <li
            className="nav-item"
            role="presentation"
            data-aos="fade-up"
            data-aos-delay={1000}
          >
            <button
              className="nav-link"
              id="pills-explore-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-explore"
              type="button"
              role="tab"
              aria-controls="pills-explore"
              aria-selected="false"
            >
              Physiotherapy
            </button>
          </li>
        </ul>
        <div className="tab-content pt-0 dashboard-tab">
          <div
            className="tab-pane fade show active"
            id="pills-all"
            role="tabpanel"
            aria-labelledby="pills-all-tab"
          >
            <div className="row">
              <div className="col-md-12">
                <div className="blog-slide-fourteen ">
                  <Swiper
                    {...doctersettings}
                    onSwiper={(swiper) => {
                      swiperRef.current = swiper;
                    }}>
                    <SwiperSlide>
                      <div
                        className="blog-grid-fourteen"
                        data-aos="fade-up"
                        data-aos-delay={500}
                      >
                        <div className="blog-grig-img">
                          <Link href="/blog">
                            <img src={blog_18} alt="Img" />
                          </Link>
                        </div>
                        <div className="blog-grid-content">
                          <div className="grid-head">
                            <h3>Health and Safety</h3>
                            <span>01 May 2023</span>
                          </div>
                          <h4>
                            <Link href="/blog">
                              Adapting Homes for Aging Gracefully: Design Tips for
                              Old Age Comfort
                            </Link>
                          </h4>
                          <p>
                            Explore practical design tips to make living spaces in
                            old age homes adaptable and comfortable, enhancing the
                            quality of life for seniors. Learn about
                            accessibility, safety features, and creating a warm
                            environment.
                          </p>
                          <div className="grid-footer">
                            <span>
                              <i className="feather-eye" />
                              1k views
                            </span>
                            <Link href="/blog">
                              Discover tips for this
                              <i className="feather-arrow-right-circle" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div
                        className="blog-grid-fourteen"
                        data-aos="fade-up"
                        data-aos-delay={600}
                      >
                        <div className="blog-grig-img">
                          <Link href="/blog">
                            <img src={blog_19} alt="Img" />
                          </Link>
                        </div>
                        <div className="blog-grid-content">
                          <div className="grid-head">
                            <h3>Caregiving</h3>
                            <span>06 May 2023</span>
                          </div>
                          <h4>
                            <Link href="/blog">
                              Navigating the Transition: A Guide to Choosing the
                              Right Old Age Home
                            </Link>
                          </h4>
                          <p>
                            Explore factors to consider when selecting age home,
                            ensuring a seamless transition for your loved ones.
                            Gain insights into facility options, care services,
                            and creating a supportive environment.
                          </p>
                          <div className="grid-footer">
                            <span>
                              <i className="feather-eye" />
                              850 views
                            </span>
                            <Link href="/blog">
                              Discover tips for this
                              <i className="feather-arrow-right-circle" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div
                        className="blog-grid-fourteen"
                        data-aos="fade-up"
                        data-aos-delay={700}
                      >
                        <div className="blog-grig-img">
                          <Link href="/blog">
                            <img src={blog_20} alt="Img" />
                          </Link>
                        </div>
                        <div className="blog-grid-content">
                          <div className="grid-head">
                            <h3>Physiotherapy</h3>
                            <span>10 May 2023</span>
                          </div>
                          <h4>
                            <Link href="/blog">
                              Empowering Aging Bodies: The Impact of Physiotherapy
                              in Old Age Home Wellness
                            </Link>
                          </h4>
                          <p>
                            Discover the transformative effects of physiotherapy
                            in home care, focusing on tailored interventions that
                            address mobility challenges, pain management, and
                            overall physical health for elderly residents.
                          </p>
                          <div className="grid-footer">
                            <span>
                              <i className="feather-eye" />
                              4.5k views
                            </span>
                            <Link href="/blog">
                              Discover tips for this
                              <i className="feather-arrow-right-circle" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div
                        className="blog-grid-fourteen"
                        data-aos="fade-up"
                        data-aos-delay={800}
                      >
                        <div className="blog-grig-img">
                          <Link href="/blog">
                            <img src={blog_18} alt="Img" />
                          </Link>
                        </div>
                        <div className="blog-grid-content">
                          <div className="grid-head">
                            <h3>Health and Safety</h3>
                            <span>01 May 2023</span>
                          </div>
                          <h4>
                            <Link href="/blog">
                              Adapting Homes for Aging Gracefully: Design Tips for
                              Old Age Comfort
                            </Link>
                          </h4>
                          <p>
                            Explore practical design tips to make living spaces in
                            old age homes adaptable and comfortable, enhancing the
                            quality of life for seniors. Learn about
                            accessibility, safety features, and creating a warm
                            environment.
                          </p>
                          <div className="grid-footer">
                            <span>
                              <i className="feather-eye" />
                              1k views
                            </span>
                            <Link href="/blog">
                              Discover tips for this
                              <i className="feather-arrow-right-circle" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  </Swiper>
                </div>
              </div>
            </div>
          </div>

          <div className="owl-nav-button">
            <div className="owl-nav slide-nav-2 text-end nav-control" >

              <button className='owl-prev' onClick={handlePrev}>
                <i className="fas fa-chevron-left custom-arrow" />
              </button>
              <button className='owl-next' onClick={handleNext}>
                <i className="fas fa-chevron-right custom-arrow" />
              </button>
            </div>
            <Link href="/blog" className="view-all">
              View All Blogs
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
})

export default OurBlog;