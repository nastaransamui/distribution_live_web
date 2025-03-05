/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useMemo } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { client07, client08, client09, healthcare } from '../../../public/assets/imagepath';
import { Typography, useTheme } from '@mui/material';
import AOS from 'aos'
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import Skeleton from '@mui/material/Skeleton'

const Testimonals: FC = (() => {
  const { muiVar } = useScssVar();
  const lastReviewsData = useSelector((state: AppState) => state.lastReviewsData)
  const { lastReviews } = lastReviewsData;


  const dummyReviewData = useMemo(() => {
    return [
      {
        img: client07,
        name: "Martin Philips",
        title: "“ Awesome Impact ”",
        body: `After suffering from a heart condition for a number of years I was very happy
        to meet Doccure, from the first consultation where he believed there was a
        solution...`,
        rating: 3
      },
      {
        img: client08,
        name: "James Anderson",
        title: "“ I am very grateful ”",
        body: `Doctors explains everything clearly and helps you to understand even the most
        complex medical terms`,
        rating: 2.5
      },
      {
        img: client09,
        name: "Christina Louis",
        title: "“ Excellent Clinician ”",
        body: `Excellent clinician. Endlessly patient and reassuring.Also a very efficient
        back up team. He was prepared to spend as long as I needed to understand
        what he was saying.`,
        rating: 4.5
      },
    ]
  }, [])
  const theme = useTheme();
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);
  return (
    <Fragment>
      <div className="testimonial-section-ten need-to-know-section" style={{ ...muiVar, backgroundColor: theme.palette.background.paper }}>
        <div className="floating-bg">
          <img src={healthcare} alt='' />
        </div>
        <div className="container" >
          <div className="row align-items-center">
            <div className="col-md-12 col-lg-5 aos" data-aos="fade-up" style={{ backgroundColor: theme.palette.background.default, borderRadius: `35px`, paddingInline: '35px' }}>
              <div className="section-header-one section-header-slider">
                <h2 className="section-title" style={{ marginTop: 24 }}>What Our <span>Patients Say</span></h2>
                <div className="need-to-know-content">
                  <p>
                    If one of the valves in your heart becomes diseased it can affect the flow of blood.
                    This can happen in one of two ways: valve stenosis (where the valve does not fully
                    open and obstructs or restricts flow) or valve incompetence (where the valve does
                    not close properly and blood is allowed to leak backwards)....
                  </p>
                  <div className="patient-rating-block">
                    <div className="patient-rating">
                      <div className="circle-rating">
                        <i className="fa-solid fa-circle" />
                        <i className="fa-solid fa-circle" />
                        <i className="fa-solid fa-circle" />
                        <i className="fa-solid fa-circle" />
                        <i className="fa-solid fa-circle-half-stroke" />
                        <span>(4.8/5)</span>
                      </div>
                      <Typography component="h2" style={{ marginBottom: 30, fontSize: 24 }}>Overall Customer Ratings</Typography>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-lg-7 aos" data-aos="fade-up">
              <div className="row align-items-center">
                {
                  lastReviews == null ?
                    <>
                      <div className="col-lg-6">
                        {
                          Array.from(Array(2).keys()).map((i) => (
                            <CardioTestimonalsSkeleton key={i} />
                          ))
                        }
                      </div>
                      <div className="col-lg-6">
                        {
                          Array.from(Array(1).keys()).map((i) => (
                            <CardioTestimonalsSkeleton key={i} />
                          ))
                        }
                      </div>
                    </> :
                    lastReviews.length == 0 ?
                      <>
                        <div className="col-lg-6">
                          {
                            dummyReviewData.slice(0, 2).map((review, index) => {
                              return (
                                <div className="testimonial-card" key={index}>
                                  <div className="testimonial-user-details">
                                    <div className="testimonial-user-img">
                                      <img src={review.img} className="img-fluid" alt="#" />
                                    </div>
                                    <div className="testimonial-user-name">
                                      <Typography component="h2">
                                        {review.name}
                                      </Typography>
                                      {renderStars(review.rating)}
                                    </div>
                                  </div>
                                  <div className="testmonial-user-coments">
                                    <Typography component="h3">{review.title}</Typography>
                                    <p>{review.body}</p>
                                  </div>
                                </div>
                              )
                            })
                          }
                        </div>
                        <div className="col-lg-6">
                          {
                            dummyReviewData.slice(2, 3).map((review, index) => {
                              return (
                                <div className="testimonial-card" key={index}>
                                  <div className="testimonial-user-details">
                                    <div className="testimonial-user-img">
                                      <img src={review.img} className="img-fluid" alt="#" />
                                    </div>
                                    <div className="testimonial-user-name">
                                      <Typography component="h2">
                                        {review.name}
                                      </Typography>
                                      {renderStars(review.rating)}
                                    </div>
                                  </div>
                                  <div className="testmonial-user-coments">
                                    <Typography component="h3">{review.title}</Typography>
                                    <p>{review.body}</p>
                                  </div>
                                </div>
                              )
                            })
                          }
                        </div>
                      </> :
                      <>
                        <div className="col-lg-6">
                          {
                            lastReviews.slice(0, 2).map((review, index) => {
                              return (
                                <div className="testimonial-card" key={index}>
                                  <div className="testimonial-user-details">
                                    <div className="testimonial-user-img" style={{ border: `1px solid ${theme.palette.secondary.main}` }}>
                                      <img src={review?.authorProfile?.profileImage} className="img-fluid" alt="#" />
                                    </div>
                                    <div className="testimonial-user-name">
                                      <Typography component="h2">
                                        {review?.authorProfile?.gender == "" ? "" : `${review?.authorProfile?.gender}. `} {review?.authorProfile?.fullName}
                                      </Typography>
                                      {renderStars(review.rating)}
                                    </div>
                                  </div>
                                  <div className="testmonial-user-coments">
                                    <Typography component="h3">“{review.title}”</Typography>
                                    <p>{review.body}</p>
                                  </div>
                                </div>
                              )
                            })
                          }
                        </div>
                        <div className="col-lg-6">
                          {
                            lastReviews.slice(2, 3).map((review, index) => {
                              return (
                                <div className="testimonial-card" key={index}>
                                  <div className="testimonial-user-details">
                                    <div className="testimonial-user-img" style={{ border: `1px solid ${theme.palette.secondary.main}` }}>
                                      <img src={review?.authorProfile?.profileImage} className="img-fluid" alt="#" />
                                    </div>
                                    <div className="testimonial-user-name">
                                      <Typography component="h2">
                                        {review?.authorProfile?.gender == "" ? "" : `${review?.authorProfile?.gender}. `} {review?.authorProfile?.fullName}
                                      </Typography>
                                      {renderStars(review.rating)}
                                    </div>
                                  </div>
                                  <div className="testmonial-user-coments">
                                    <Typography component="h3">“{review.title}”</Typography>
                                    <p>{review.body}</p>
                                  </div>
                                </div>
                              )
                            })
                          }
                        </div>
                      </>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
});

export default Testimonals;
const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating); // Full stars count
  const hasHalfStar = rating % 1 !== 0; // Check if there’s a half star
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Remaining empty stars

  return (
    <div className="circle-rating">
      {Array(fullStars).fill(null).map((_, index) => (
        <i key={`full-${index}`} className="fa-solid fa-circle" />
      ))}
      {hasHalfStar && <i className="fa-solid fa-circle-half-stroke" />}
      {Array(emptyStars).fill(null).map((_, index) => (
        <i key={`empty-${index}`} className="fa-regular fa-circle" />
      ))}
    </div>
  );
};
export const CardioTestimonalsSkeleton: FC = (() => {
  const theme = useTheme()
  return (
    <div className="testimonial-card">
      <div className="testimonial-user-details">
        <div className="testimonial-user-img">
          <Skeleton animation="wave" variant="circular" width={85} height={85} sx={{ border: `1px solid ${theme.palette.secondary.main}` }} />
        </div>
        <div className="testimonial-user-name">
          <Typography component="h2">
            <Skeleton animation="wave" sx={{ height: '15px', width: '100%', borderRadius: '5px', backgroundColor: theme.palette.primary.main }} />
          </Typography>
          <div className="circle-rating" style={{ display: 'flex' }}>
            <Skeleton animation="wave" height={28} width={16} sx={{ borderRadius: '50%', backgroundColor: '#ffca42' }} />
            <Skeleton animation="wave" height={28} width={16} sx={{ borderRadius: '50%', backgroundColor: '#ffca42' }} />
            <Skeleton animation="wave" height={28} width={16} sx={{ borderRadius: '50%', backgroundColor: '#ffca42' }} />
            <Skeleton animation="wave" height={28} width={16} sx={{ borderRadius: '50%', backgroundColor: '#ffca42' }} />
            <Skeleton animation="wave" height={28} width={16} sx={{ borderRadius: '50%', backgroundColor: '#ffca42' }} />

          </div>
        </div>
      </div>
      <div className="testmonial-user-coments">
        <Typography component="h3">
          <Skeleton animation="wave" sx={{ height: '15px', width: '50%', borderRadius: '5px', backgroundColor: theme.palette.primary.main }} />
        </Typography>
        <p>
          <Skeleton animation="wave" sx={{ height: '15px', width: '100%', borderRadius: '5px', backgroundColor: theme.palette.primary.main }} />
          <Skeleton animation="wave" sx={{ height: '15px', width: '100%', borderRadius: '5px', backgroundColor: theme.palette.primary.main }} />
          <Skeleton animation="wave" sx={{ height: '15px', width: '100%', borderRadius: '5px', backgroundColor: theme.palette.primary.main }} />

        </p>
      </div>
    </div>

  )
})