/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useMemo, useRef } from 'react'
import AOS from 'aos'
import useScssVar from '@/hooks/useScssVar'
import { EyeIconSvg } from '../../../public/assets/images/icons/IconsSvgs';
import { client03, client04, client06_small, client07, eye_care_testimonial, eyeTestimonial } from '@/public/assets/imagepath'
import { useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import Skeleton from '@mui/material/Skeleton'
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from 'swiper';
import { SwiperOptions } from 'swiper/types';
import { FreeMode, Navigation } from 'swiper/modules';



const Testimonials: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme()
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);
  const specialitySettings: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 15,
    loop: false,
    modules: [Navigation, FreeMode],
    navigation: {
      prevEl: null,
      nextEl: null,
    },
  };

  const lastReviewsData = useSelector((state: AppState) => state.lastReviewsData)
  const { lastReviews } = lastReviewsData;


  const dummyReviewData = useMemo(() => {
    return [
      {
        name: "Elizabeth Forsyth",
        title: "“ Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical ”",
        body: `Lorem Ipsum is simply dummy text of the printing and typesetting
                      industry. Lorem Ipsum has been the industrys standard. The point
                      of using Lorem Ipsum is that it has a more-or-less normal
                      distribution of letters, as opposed to using Content here,
                      content here, making it look like readable English. Many desktop
                      publishing packages and web page editors now use Lorem Ipsum as
                      their default model text, and a search for lorem ipsum will
                      uncover many web sites still in their infancy`,
        city: "Las Vegas",
        country: "USA"
      },
      {
        name: "Leigh Baley",
        title: "“ Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical ”",
        body: `Lorem Ipsum is simply dummy text of the printing and typesetting
                      industry. Lorem Ipsum has been the industrys standard. The point
                      of using Lorem Ipsum is that it has a more-or-less normal
                      distribution of letters, as opposed to using Content here,
                      content here, making it look like readable English. Many desktop
                      publishing packages and web page editors now use Lorem Ipsum as
                      their default model text, and a search for lorem ipsum will
                      uncover many web sites still in their infancy`,
        city: "San Jose",
        country: "USA"
      },
      {
        name: "Jon Sparks",
        title: "“ Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical ”",
        body: `It is a long established fact that a reader will be distracted by
                      the readable content of a page when looking at its layout. The
                      point of using Lorem Ipsum is that it has a more-or-less normal
                      distribution of letters, as opposed to using Content here,
                      content here, making it look like readable English. Many desktop
                      publishing packages and web page editors now use Lorem Ipsum as
                      their default model text, and a search for lorem ipsum will
                      uncover many web sites still in their infancy`,
        city: "Irvine",
        country: "USA"
      },
    ]
  }, [])

  const dummyImages = [client04, client03, client06_small, client07]
  const swiperRef = useRef<SwiperInstance | null>(null);



  return (
    <Fragment>
      <section className="eye-testimonial-section" style={{ ...muiVar, backgroundColor: theme.palette.background.paper }}>
        <div className="container">
          <div className="row">
            <div className="col-md-12 aos" data-aos="fade-up">
              <div className="section-heading text-center sec-heading-eye">
                <EyeIconSvg />
                <h2>
                  <span>Client</span> Testimonials
                </h2>
                <p>What our clients say about us</p>
              </div>
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-md-5">
              <div className="testi-img">
                <img src={eyeTestimonial} alt="" className="img-fluid" />
                <span className="testi-icon">
                  <i className="fa-solid fa-quote-left" />
                </span>
              </div>
              <div className="testi-users">
                <div className="nav nav-container slide-11" />
                <ul>
                  {
                    lastReviews == null ?
                      (Array.from(Array(3).keys()).map((i) => <EyeTestimonialImagesSkeleton key={i} />)) :
                      lastReviews.length == 0 ?
                        <>{dummyImages.map((_, index) => <li key={index}><img src={_} alt='' className='img-fluid' /></li>)}</> :
                        <>{lastReviews.map((_, index) => <li key={index}><img src={_.authorProfile?.profileImage} alt='' className='img-fluid' /></li>)}</>
                  }
                </ul>
              </div>
            </div>
            <div className="col-md-7">
              <div className="eye-testislider">
                <Swiper
                  {...specialitySettings}
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                  }}>
                  {
                    lastReviews == null ?
                      (<EyeTestimonialSkeleton />) :
                      lastReviews.length == 0 ?
                        (
                          dummyReviewData.map((review, index) => {
                            return (
                              <SwiperSlide className="testimonial-wrap" key={index}>
                                <h3>{review.title}</h3>
                                <p style={{
                                  minHeight: '270px',
                                  alignContent: 'center',
                                }}>{review.body}</p>
                                <div className="testimonial-user">
                                  <h4>{review.name}</h4>
                                  <p>{review.city}, {review.country}</p>
                                </div>
                              </SwiperSlide>
                            )
                          })
                        ) :
                        (
                          lastReviews.map((review, index) => {
                            return (
                              <SwiperSlide className="testimonial-wrap" key={index}>
                                <h3>{review.title}</h3>
                                <p style={{
                                  minHeight: '270px',
                                  alignContent: 'center',
                                }}>{review.body}</p>
                                <div className="testimonial-user">
                                  <h4>{review.authorProfile?.fullName}</h4>
                                  <p>{review?.authorProfile?.city}, {review?.authorProfile?.country}</p>
                                </div>
                              </SwiperSlide>
                            )
                          })
                        )
                  }
                </Swiper>
              </div>
            </div>
            <div className="ban-bg" style={{ opacity: 0.3, position: 'relative', top: -280, left: -270 }}>
              <img
                src={eye_care_testimonial}
                alt=""
                className="img-fluid bg-08 img"

              />
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default Testimonials

export const EyeTestimonialImagesSkeleton: FC = (() => {
  const theme = useTheme()
  return (
    <li>
      <Skeleton animation="wave" variant="circular" width={45} height={45} sx={{ border: `2px solid ${theme.palette.text.color}`, ml: 2, backgroundColor: 'primary.main' }} />
    </li>
  )
})

export const EyeTestimonialSkeleton: FC = (() => {
  const theme = useTheme();
  return (
    <div className="testimonial-wrap">
      <h3>
        <Skeleton animation="wave" sx={{ height: '15px', width: '100%', borderRadius: '5px', backgroundColor: theme.palette.primary.main }} />

      </h3>
      <p>
        <Skeleton animation="wave" sx={{ height: '15px', width: '100%', mb: 1, borderRadius: '5px', backgroundColor: theme.palette.text.disabled }} />
        <Skeleton animation="wave" sx={{ height: '15px', width: '100%', mb: 1, borderRadius: '5px', backgroundColor: theme.palette.text.disabled }} />
        <Skeleton animation="wave" sx={{ height: '15px', width: '100%', mb: 1, borderRadius: '5px', backgroundColor: theme.palette.text.disabled }} />
        <Skeleton animation="wave" sx={{ height: '15px', width: '100%', mb: 1, borderRadius: '5px', backgroundColor: theme.palette.text.disabled }} />
        <Skeleton animation="wave" sx={{ height: '15px', width: '100%', mb: 1, borderRadius: '5px', backgroundColor: theme.palette.text.disabled }} />

      </p>
      <div className="testimonial-user">
        <h4><Skeleton animation="wave" sx={{ height: '15px', width: '15%', mb: 1, borderRadius: '5px', backgroundColor: theme.palette.secondary.main }} /></h4>
        <p><Skeleton animation="wave" sx={{ height: '15px', width: '15%', mb: 1, borderRadius: '5px', backgroundColor: theme.palette.text.disabled }} /></p>
      </div>
    </div>
  )
})