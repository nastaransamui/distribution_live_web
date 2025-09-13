/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useCallback, useEffect, useMemo, useRef } from 'react'
import AOS from 'aos'
import useScssVar from '@/hooks/useScssVar'
import { SwiperOptions } from 'swiper/types';
import { FreeMode, Navigation } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { client09, client10, home_12_testimonial, two_paw } from "../../../public/assets/imagepath";
import { useSelector } from 'react-redux'
import { AppState } from '@/redux/store';
import Rating from '@mui/material/Rating'
import Skeleton from '@mui/material/Skeleton'

const TestimonialSection: FC = (() => {

  const { muiVar } = useScssVar();
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
      1300: { slidesPerView: 1 },
      1000: { slidesPerView: 1 },
      768: { slidesPerView: 1 },
      500: { slidesPerView: 1 },
      0: { slidesPerView: 1 },
    },
  };

  const lastReviewsData = useSelector((state: AppState) => state.lastReviewsData)
  const { lastReviews } = lastReviewsData;


  const dummyReviewData = useMemo(() => {
    return [
      {
        img: client09,
        name: "Jenifer Robinson",
        body: `“Thank you! for giving excellent care of my doggies, the
        best pet care ever! I recommend”`,
        rating: 3,
        city: "Texas",
        country: 'USA'
      },
      {
        img: client10,
        name: "Ronald Jacobs",
        body: `“Thank you! for giving excellent care of my doggies, the
        best pet care ever! I recommend”`,
        rating: 4,
        city: "Texas",
        country: 'USA'
      },
    ]
  }, [])
  const swiperRef = useRef<SwiperInstance | null>(null);

  const handlePrev = useCallback(() => {
    swiperRef.current?.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    swiperRef.current?.slideNext();
  }, []);
  return (
    <Fragment>
      <section className="clients-section-fourteen" style={muiVar}>
        <div className="floating-bg">
          <img src={two_paw} alt="" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-5">
              <div className="client-inner-main">
                <img
                  src={home_12_testimonial}
                  alt="image"
                  className="img-fluid"
                />
              </div>
            </div>
            <div className="col-lg-7 col-md-12">
              <div className="section-header-fourteen service-inner-fourteen">
                <div className="service-inner-fourteen">
                  <div className="service-inner-fourteen-two">
                    <h3>CLIENT REVIEWS</h3>
                  </div>
                </div>
                <h2>Testimonials</h2>
                <p>What our customers says about us</p>
              </div>
              <div
                className="feedback-slider-fourteen owl-theme aos"
                data-aos="fade-up"
              >
                <Swiper
                  {...doctersettings}
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                  }} className="feedback-slider-fourteen owl-theme aos" data-aos="fade-up">
                  {
                    lastReviews == null ?
                      (Array(1).fill(0).map((_, index) => (
                        <VetTestimonialSkeleton key={index} />
                      ))) :
                      lastReviews.length == 0 ?
                        dummyReviewData.map((review, index) => {
                          return (
                            <SwiperSlide className="card feedback-card" key={index}>
                              <div className="card-body feedback-card-body">
                                <div className="feedback-inner-main">
                                  <div className="feedback-inner-img">
                                    <img
                                      src={review.img}
                                      alt="image"
                                      className="img-fluid"
                                    />
                                    <div className="feedback-user-details">
                                      <h4>{review.name}</h4>
                                      <h6>{review.city}, {review.country}</h6>
                                      <div className="rating rating-fourteen">
                                        <Rating
                                          name="read-only"
                                          precision={0.5}
                                          value={review?.rating}
                                          readOnly
                                          size='small' />
                                      </div>
                                    </div>
                                  </div>
                                  <p>{review?.body}</p>
                                </div>
                              </div>
                            </SwiperSlide>
                          )
                        })
                        :
                        lastReviews.map((review, index) => {
                          return (
                            <SwiperSlide className="card feedback-card" key={index}>
                              <div className="card-body feedback-card-body">
                                <div className="feedback-inner-main">
                                  <div className="feedback-inner-img">
                                    <img
                                      src={review.authorProfile?.profileImage}
                                      alt="image"
                                      className="img-fluid"
                                    />
                                    <div className="feedback-user-details">
                                      <h4>{review?.authorProfile?.gender !== "" && `${review?.authorProfile?.gender}. `} {review?.authorProfile?.fullName}</h4>
                                      <h6>{review?.authorProfile?.city}, {review?.authorProfile?.country}</h6>
                                      <div className="rating rating-fourteen">
                                        <Rating
                                          name="read-only"
                                          precision={0.5}
                                          value={review?.rating}
                                          readOnly
                                          size='small' />
                                      </div>
                                    </div>
                                  </div>
                                  <p>{review?.body}</p>
                                </div>
                              </div>
                            </SwiperSlide>
                          )
                        })
                  }
                </Swiper>

                <div className="owl-nav" >

                  <button className='owl-prev' onClick={handlePrev}>
                    <i className="fa-solid fa-caret-left "></i>
                  </button>
                  <button className='owl-next' onClick={handleNext}>
                    <i className="fa-solid fa-caret-right"></i>
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
})

export default TestimonialSection;

export const VetTestimonialSkeleton: FC = (() => {

  return (
    <div className="card feedback-card">
      <div className="card-body feedback-card-body">
        <div className="feedback-inner-main">
          <div className="feedback-inner-img">
            <Skeleton animation="wave" variant="rectangular" width={100} height={100} sx={{ borderRadius: `20px` }} />

            <div className="feedback-user-details">
              <h4><Skeleton animation="wave" variant="rectangular" width="80%" height={10} sx={{ borderRadius: `5px`, bgcolor: 'primary.main' }} /></h4>
              <h6><Skeleton animation="wave" variant="rectangular" width="60%" height={10} sx={{ borderRadius: `5px`, bgcolor: 'color.disabled' }} /></h6>
              <div className="rating rating-fourteen" style={{ minWidth: '200px' }}>
                <Skeleton animation="wave" variant="rectangular" width="100%" height={10} sx={{ borderRadius: `5px`, bgcolor: '#ffc001' }} />
              </div>
            </div>
          </div>
          <p >
            <Skeleton animation="wave" variant="rectangular" width="80%" height={10} sx={{ mt: 2, borderRadius: `5px`, bgcolor: 'color.disabled' }} />
            <Skeleton animation="wave" variant="rectangular" width="80%" height={10} sx={{ mt: 2, borderRadius: `5px`, bgcolor: 'color.disabled' }} />
            <Skeleton animation="wave" variant="rectangular" width="80%" height={10} sx={{ mt: 2, borderRadius: `5px`, bgcolor: 'color.disabled' }} />
            <Skeleton animation="wave" variant="rectangular" width="80%" height={10} sx={{ mt: 2, borderRadius: `5px`, bgcolor: 'color.disabled' }} />
          </p>
        </div>
      </div>
    </div>
  )
})