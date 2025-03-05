/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useMemo } from 'react'
import AOS from 'aos'
import dynamic from 'next/dynamic'
import useScssVar from '@/hooks/useScssVar'
import { useTheme } from '@mui/material'
const Owlcarousel = dynamic(() => import('react-owl-carousel'), { ssr: false })

import { client09, client10, home_12_testimonial, two_paw } from "../../../public/assets/imagepath";
import { useSelector } from 'react-redux'
import { AppState } from '@/redux/store';
import Rating from '@mui/material/Rating'
import Skeleton from '@mui/material/Skeleton'

const TestimonialSection: FC = (() => {

  const { muiVar } = useScssVar();
  const theme = useTheme();
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);
  const options = {
    loop: true,
    margin: 24,
    dots: false,
    nav: true,
    smartSpeed: 2000,
    navText: ['<i class="fa-solid fa-caret-left "></i>', '<i class="fa-solid fa-caret-right"></i>'],
    navElement: "button  aria-labelledby='slide-nav-1' aria-label='slide-nav-1'",
    responsive: {
      0: {
        items: 1
      },
      500: {
        items: 1
      },
      768: {
        items: 1
      },
      1000: {
        items: 1
      },
      1300: {
        items: 1
      }
    }
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
                <Owlcarousel className="feedback-slider-fourteen owl-theme aos" data-aos="fade-up"{...options}>
                  {
                    lastReviews == null ?
                      (Array(1).fill(0).map((_, index) => (
                        <VetTestimonialSkeleton key={index} />
                      ))) :
                      lastReviews.length == 0 ?
                        dummyReviewData.map((review, index) => {
                          return (
                            <div className="card feedback-card" key={index}>
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
                            </div>
                          )
                        })
                        :
                        lastReviews.map((review, index) => {
                          return (
                            <div className="card feedback-card" key={index}>
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
                            </div>
                          )
                        })
                  }
                </Owlcarousel>
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