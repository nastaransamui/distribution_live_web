/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useMemo, useRef } from 'react';
import useScssVar from '@/hooks/useScssVar';
import { testimonial2, client04, client03, client06_small, client07 } from '@/public/assets/imagepath';
import { AppState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { EyeTestimonialImagesSkeleton, EyeTestimonialSkeleton } from '../eyeCareSections/Testimonials';
import { SwiperOptions } from 'swiper/types';
import { FreeMode, Navigation } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';


const TestimonialSection: FC = (() => {
  const { muiVar } = useScssVar();

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
      <div className="testimonal-section-sixteen" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-header-sixteen text-center">
                <p>OUr services</p>
                <h2>Featured Services</h2>
              </div>
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-md-5">
              <div className="testi-img">
                <img src={testimonial2} alt="" className="img-fluid" />
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
              <Swiper
                {...doctersettings}
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
                            <SwiperSlide key={index}>
                              <div className="testimonial-wrap" >
                                <h3>{review.title}</h3>
                                <p style={{
                                  minHeight: '270px',
                                  alignContent: 'center',
                                }}>{review.body}</p>
                                <div className="testimonial-user">
                                  <h4>{review.name}</h4>
                                  <p>{review.city}, {review.country}</p>
                                </div>
                              </div>
                            </SwiperSlide>
                          )
                        })
                      ) :
                      (
                        lastReviews.map((review, index) => {
                          return (
                            <SwiperSlide key={index}>
                              <div className="testimonial-wrap" >
                                <h3>{review.title}</h3>
                                <p style={{
                                  minHeight: '270px',
                                  alignContent: 'center',
                                }}>{review.body}</p>
                                <div className="testimonial-user">
                                  <h4>{review.authorProfile?.fullName}</h4>
                                  <p>{review?.authorProfile?.city}, {review?.authorProfile?.country}</p>
                                </div>
                              </div>
                            </SwiperSlide>
                          )
                        })
                      )
                }
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
});

export default TestimonialSection;