/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useCallback, useEffect, useRef } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link'
import { useTheme } from '@mui/material';
import { EyeIconSvg } from '../../../public/assets/images/icons/IconsSvgs';
import { DoctThumb1_small, DoctThumb10, DoctThumb2, DoctThumb8, DoctThumb9, EyeBlog01, EyeBlog02, EyeBlog03, EyeBlog04 } from '@/public/assets/imagepath';
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from 'swiper';
import { SwiperOptions } from 'swiper/types';
import { FreeMode, Navigation } from 'swiper/modules';


import AOS from 'aos'
const BlogPost: FC = (() => {
  const theme = useTheme();
  const { muiVar } = useScssVar();
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);
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
      1049: { slidesPerView: 4 },
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
      <section className="our-blog-section eye-blog" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-12 aos" data-aos="fade-up">
              <div className="section-heading text-center sec-heading-eye">
                <EyeIconSvg />
                <h2>
                  <span>Blog</span> Post
                </h2>
                <p>The Great Place Of Eyecare Hospital Center</p>
              </div>
            </div>
          </div>
          <div className="eye-blogslider owl-them aos" data-aos="fade-up" >
            <div className="owl-nav " id='slide-nav-1' >

              <button className='owl-prev' onClick={handlePrev} style={{ position: 'absolute', zIndex: 2, transform: 'translateY(50%)' }} >
                <i className="fas fa-chevron-left " />
              </button>
              <button className='owl-next' onClick={handleNext} style={{ position: 'absolute', zIndex: 2, transform: 'translateY(50%)' }} >
                <i className="fas fa-chevron-right " />
              </button>
            </div>
            <Swiper
              {...specialitySettings}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}>

              <SwiperSlide className="item">
                <div className="our-blogs">
                  <div className="blogs-img" style={{ borderRadius: `15px 15px 0px 0px` }}>
                    <Link href="/blog/blog-details" aria-label='blog post'>
                      <img
                        src={EyeBlog01}
                        alt=""
                        className="img-fluid blog-inner-img"
                      />
                    </Link>
                    <div className="blogs-overlay" style={{ borderLeft: `1px solid ${theme.palette.secondary.main}`, borderRight: `1px solid ${theme.palette.secondary.main}` }}>
                      <div className="blog-name">
                        <img
                          src={DoctThumb1_small}
                          alt=""
                          className="img-fluid"
                        />
                        <div>
                          <Link href="#">Deirdre Carolyn</Link>
                          <p>04-April-2023</p>
                        </div>
                      </div>
                      <span className="blog-cat">Orthoptics</span>
                    </div>
                  </div>
                  <div className="blogs-info" style={{ borderRadius: `0px 0px 15px 15px`, borderTop: 'none' }}>
                    <h3>
                      <Link href="/blog/blog-details" aria-label='blog post'>
                        Lorem Ipsum is simply dummy text of the printing?
                      </Link>
                    </h3>
                    <p>
                      It is a long established fact that a reader will be distracted by
                      the readable content
                    </p>
                    <Link href="/blog/blog-details" aria-label='blog post' className="blogs-btn">
                      Blog post
                      <i className="fa-solid fa-chevron-right" />
                    </Link>
                  </div>
                </div>
              </SwiperSlide>


              <SwiperSlide className="item">
                <div className="our-blogs">
                  <div className="blogs-img" style={{ borderRadius: `15px 15px 0px 0px` }}>
                    <Link href="/blog/blog-details" aria-label='blog post'>
                      <img
                        src={EyeBlog02}
                        alt=""
                        className="img-fluid blog-inner-img"
                      />
                    </Link>
                    <div className="blogs-overlay" style={{ borderLeft: `1px solid ${theme.palette.secondary.main}`, borderRight: `1px solid ${theme.palette.secondary.main}` }}>
                      <div className="blog-name">
                        <img
                          src={DoctThumb2}
                          alt=""
                          className="img-fluid"
                        />
                        <div>
                          <Link href="#">Jessica</Link>
                          <p>03-April-2023</p>
                        </div>
                      </div>
                      <span className="blog-cat">Glaucoma</span>
                    </div>
                  </div>
                  <div className="blogs-info" style={{ borderRadius: `0px 0px 15px 15px`, borderTop: 'none' }}>
                    <h3>
                      <Link href="/blog/blog-details" aria-label='blog post'>
                        It is a long established fact that a reader will be distracted
                      </Link>
                    </h3>
                    <p>Lorem Ipsum is simply dummy text of the printing</p>
                    <Link href="/blog/blog-details" aria-label='blog post' className="blogs-btn">
                      Blog post
                      <i className="fa-solid fa-chevron-right" />
                    </Link>
                  </div>
                </div>
              </SwiperSlide>


              <SwiperSlide className="item">
                <div className="our-blogs">
                  <div className="blogs-img" style={{ borderRadius: `15px 15px 0px 0px` }}>
                    <Link href="/blog/blog-details" aria-label='blog post'>
                      <img
                        src={EyeBlog03}
                        alt=""
                        className="img-fluid blog-inner-img"
                      />
                    </Link>
                    <div className="blogs-overlay" style={{ borderLeft: `1px solid ${theme.palette.secondary.main}`, borderRight: `1px solid ${theme.palette.secondary.main}` }}>
                      <div className="blog-name">
                        <img
                          src={DoctThumb8}
                          alt=""
                          className="img-fluid"
                        />
                        <div>
                          <Link href="#">Christopher</Link>
                          <p>06-April-2023</p>
                        </div>
                      </div>
                      <span className="blog-cat">Corneal Ulcer </span>
                    </div>
                  </div>
                  <div className="blogs-info" style={{ borderRadius: `0px 0px 15px 15px`, borderTop: 'none' }}>
                    <h3>
                      <Link href="/blog/blog-details" aria-label='blog post'>
                        Contrary to popular belief, Lorem Ipsum is not simply random
                        text
                      </Link>
                    </h3>
                    <p>It has roots in a piece of classical Latin literature</p>
                    <Link href="/blog/blog-details" aria-label='blog post' className="blogs-btn">
                      Blog post
                      <i className="fa-solid fa-chevron-right" />
                    </Link>
                  </div>
                </div>
              </SwiperSlide>


              <SwiperSlide className="item">
                <div className="our-blogs">
                  <div className="blogs-img" style={{ borderRadius: `15px 15px 0px 0px` }}>
                    <Link href="/blog/blog-details" aria-label='blog post'>
                      <img
                        src={EyeBlog04}
                        alt=""
                        className="img-fluid blog-inner-img"
                      />
                    </Link>
                    <div className="blogs-overlay" style={{ borderLeft: `1px solid ${theme.palette.secondary.main}`, borderRight: `1px solid ${theme.palette.secondary.main}` }}>
                      <div className="blog-name">
                        <img
                          src={DoctThumb9}
                          alt=""
                          className="img-fluid"
                        />
                        <div>
                          <Link href="#">Lily Olivia</Link>
                          <p>04-April-2023</p>
                        </div>
                      </div>
                      <span className="blog-cat">Keratoconus</span>
                    </div>
                  </div>
                  <div className="blogs-info" style={{ borderRadius: `0px 0px 15px 15px`, borderTop: 'none' }}>
                    <Link href="/blog/blog-details" aria-label='blog post'>
                      <h3>There are many variations of passages</h3>
                    </Link>
                    <p>
                      If you are going to use a passage of Lorem Ipsum, you need to be
                      sure there isn t anything
                    </p>
                    <Link href="/blog/blog-details" aria-label='blog post' className="blogs-btn">
                      Blog post
                      <i className="fa-solid fa-chevron-right" />
                    </Link>
                  </div>
                </div>
              </SwiperSlide>


              <SwiperSlide className="item">
                <div className="our-blogs">
                  <div className="blogs-img" style={{ borderRadius: `15px 15px 0px 0px` }}>
                    <Link href="/blog/blog-details" aria-label='blog post'>
                      <img
                        src={EyeBlog03}
                        alt=""
                        className="img-fluid blog-inner-img"
                      />
                    </Link>
                    <div className="blogs-overlay" style={{ borderLeft: `1px solid ${theme.palette.secondary.main}`, borderRight: `1px solid ${theme.palette.secondary.main}` }}>
                      <div className="blog-name">
                        <img
                          src={DoctThumb10}
                          alt=""
                          className="img-fluid"
                        />
                        <div>
                          <Link href="#">John Doe</Link>
                          <p>01-April-2023</p>
                        </div>
                      </div>
                      <span className="blog-cat">Orthoptics</span>
                    </div>
                  </div>
                  <div className="blogs-info" style={{ borderRadius: `0px 0px 15px 15px`, borderTop: 'none' }}>
                    <Link href="/blog/blog-details" aria-label='blog post'>
                      <h3>There are many variations of passages</h3>
                    </Link>
                    <p>
                      If you are going to use a passage of Lorem Ipsum, you need to be
                      sure there isnt anything
                    </p>
                    <Link href="/blog/blog-details" aria-label='blog post' className="blogs-btn">
                      Blog post
                      <i className="fa-solid fa-chevron-right" />
                    </Link>
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

export default BlogPost;