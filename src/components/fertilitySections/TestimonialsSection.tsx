/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useCallback, useEffect, useMemo, useRef } from 'react'
import useScssVar from '@/hooks/useScssVar'
import AOS from 'aos'
import { SwiperOptions } from 'swiper/types';
import { FreeMode, Navigation } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { client09, clinet02, clinet05, feedback_six } from '../../../public/assets/imagepath'
import { useSelector } from 'react-redux'
import { AppState } from '@/redux/store'
import Rating from '@mui/material/Rating'
import Skeleton from '@mui/material/Skeleton'
import dayjs from 'dayjs'
const TestimonialsSection: FC = (() => {
  const { muiVar } = useScssVar();
  const lastReviewsData = useSelector((state: AppState) => state.lastReviewsData)
  const { lastReviews } = lastReviewsData;


  const dummyReviewData = useMemo(() => {
    return [
      {
        date: 'March 03, 2024',
        img: clinet05,
        rating: 4,
        name: "Jenifer Robinson",
        body: `After suffering from a heart condition for a number of years I was very happy
          to meet Health care, from the first consultation where he believed there was a
          solution...`,
        city: "Texas",
        country: 'USA'
      },
      {
        date: 'April 04, 2024',
        img: clinet02,
        rating: 3,
        name: "Matthew George",
        body: `After suffering from a heart condition for a number of years I was very happy
          to meet Health care, from the first consultation where he believed there was a
          solution...`,
        city: "Michigan",
        country: 'USA'
      },
      {
        date: 'May 09, 2024',
        img: client09,
        rating: 5,
        name: "Jenifer Paul",
        body: `After suffering from a heart condition for a number of years I was very happy
          to meet Health care, from the first consultation where he believed there was a
          solution...`,
        city: "New Mexico",
        country: 'USA'
      },
    ]
  }, [])
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);
  const doctersettings: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 15,
    loop: false,

    modules: [Navigation, FreeMode],
    navigation: {
      prevEl: null,
      nextEl: null,
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
      <section className="clients-section-fourteen" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="client-inner-main">
                <img
                  src={feedback_six}
                  alt="image"
                  className="img-fluid"
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="section-header-fourteen text-end">
                <div className="service-inner-fourteen justify-content-end">
                  <div className="service-inner-fourteen-one"></div>
                  <div className="service-inner-fourteen-two">
                    <h3>Happy Clients</h3>
                  </div>
                  <div className="service-inner-fourteen-three"></div>
                </div>
                <h2>Our Clients Feedback About Us</h2>
              </div>
              <div className=" feedback-slider-fourteen owl-theme aos" data-aos="fade-up" >
                <Swiper
                  {...doctersettings}
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                  }}>
                  {
                    lastReviews == null ?
                      (Array(1).fill(0).map((_, index) => (
                        <FertilityTestimonialSkeleton key={index} />
                      ))) :
                      lastReviews.length == 0 ?
                        dummyReviewData.map((review, index) => {
                          return (
                            <SwiperSlide key={index}>
                              <div className="card feedback-card">
                                <div className="card-body feedback-card-body">
                                  <div className="feedback-inner-main">
                                    <div className="feedback-inner-img">
                                      <h6>{review.date}</h6>
                                      <img
                                        src={review.img}
                                        alt="image"
                                        className="img-fluid"
                                      />
                                    </div>
                                    <div className="rating rating-fourteen">
                                      <Rating
                                        name="read-only"
                                        precision={0.5}
                                        value={review?.rating}
                                        readOnly
                                        size='small' />
                                    </div>
                                    <p>{review.body}</p>
                                    <h4>{review.name}</h4>
                                    <h6>{review.city}, {review.country}</h6>
                                  </div>
                                </div>
                              </div>
                            </SwiperSlide>
                          )
                        })
                        :
                        lastReviews.map((review, index) => {
                          return (
                            <SwiperSlide key={index}>
                              <div className="card feedback-card">
                                <div className="card-body feedback-card-body">
                                  <div className="feedback-inner-main">
                                    <div className="feedback-inner-img">
                                      <h6>{dayjs(review.createdAt).format('DD MMM YYYY')}</h6>
                                      <img
                                        src={review.authorProfile?.profileImage}
                                        alt="image"
                                        className="img-fluid"
                                      />
                                    </div>
                                    <div className="rating rating-fourteen">
                                      <Rating
                                        name="read-only"
                                        precision={0.5}
                                        value={review?.rating}
                                        readOnly
                                        size='small' />
                                    </div>
                                    <p>{review.body}</p>
                                    <h4>{review?.authorProfile?.fullName}</h4>
                                    <h6>{review?.authorProfile?.city}, {review?.authorProfile?.country}</h6>
                                  </div>
                                </div>
                              </div>
                            </SwiperSlide>
                          )
                        })
                  }
                </Swiper>
                <div className="owl-nav slide-nav-14 text-end nav-control" >
                  <button className='owl-prev' onClick={handlePrev}>
                    <i className="fa-solid fa-caret-left " />
                  </button>
                  <button className='owl-next' onClick={handleNext}>
                    <i className="fa-solid fa-caret-right" />
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

export default TestimonialsSection;

export const FertilityTestimonialSkeleton: FC = (() => {

  return (
    <div className="card feedback-card">
      <div className="card-body feedback-card-body">
        <div className="feedback-inner-main">
          <div className="feedback-inner-img">
            <Skeleton animation="wave" variant='rectangular' component="h6" width={100} height={15} sx={{ borderRadius: 8, backgroundColor: "primary.main" }} />
            <Skeleton animation="wave" variant="rectangular" height={100} width={100} sx={{ borderRadius: '20px', backgroundColor: 'secondary.main' }} />
          </div>
          <div className="rating rating-fourteen">
            <Skeleton animation="wave" variant='rectangular' component="i" width={100} height={15} sx={{ borderRadius: 8, backgroundColor: "#ffc001" }} />

          </div>
          <Skeleton animation="wave" variant="rectangular" component="p" height={10} sx={{ backgroundColor: 'text.disabled', borderRadius: 8 }} />
          <Skeleton animation="wave" variant="rectangular" component="p" height={10} sx={{ backgroundColor: 'text.disabled', borderRadius: 8 }} />
          <Skeleton animation="wave" variant="rectangular" component="p" height={10} sx={{ backgroundColor: 'text.disabled', borderRadius: 8 }} />
          <Skeleton animation="wave" variant="rectangular" component="p" height={10} sx={{ backgroundColor: 'text.disabled', borderRadius: 8 }} />
          {/* <h4>Jenifer Robinson</h4> */}
          <Skeleton animation="wave" variant='rectangular' component="h4" width={150} height={15} sx={{ borderRadius: 8, backgroundColor: "primary.main" }} />
          <Skeleton animation="wave" variant='rectangular' component="h6" width={100} height={15} sx={{ borderRadius: 8, backgroundColor: "text.disabled" }} />

        </div>
      </div>
    </div>
  )
})