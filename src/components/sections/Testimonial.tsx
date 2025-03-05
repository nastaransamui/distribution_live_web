/* eslint-disable @next/next/no-img-element */
// @ts-nocheck
import useScssVar from '@/hooks/useScssVar';
import { useTheme } from '@mui/material';
import { FC, Fragment, useMemo } from 'react'
import Slider from 'react-slick'
import { client04, client03, client06, client07 } from '../../../public/assets/imagepath';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import dayjs from 'dayjs';
import Skeleton from '@mui/material/Skeleton'

const Testimonial: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  const settings = {
    arrows: true,
    dots: false,
    autoplay: false,
    infinite: true,
    rtl: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [{
      breakpoint: 992,
      settings: {
        slidesToShow: 1
      }
    },
    {
      breakpoint: 776,
      settings: {
        slidesToShow: 1
      }
    },
    {
      breakpoint: 567,
      settings: {
        slidesToShow: 1
      }
    }]
  };
  const lastReviewsData = useSelector((state: AppState) => state.lastReviewsData)
  const { lastReviews } = lastReviewsData;


  const dummyReviewData = useMemo(() => {
    return [
      {
        img: client04,
        name: "John Doe",
        city: "New York",
        body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                  sed do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                  ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  Duis aute irure dolor in reprehenderit in voluptate velit
                  esse cillum dolore eu fugiat nulla pariatur.`
      },
      {
        img: client06,
        name: "Betty Carlson",
        city: "Georgia",
        body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                  sed do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                  ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  Duis aute irure dolor in reprehenderit in voluptate velit
                  esse cillum dolore eu fugiat nulla pariatur.`
      },
      {
        img: client07,
        name: "Veronica",
        city: "California",
        body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                  sed do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                  ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  Duis aute irure dolor in reprehenderit in voluptate velit
                  esse cillum dolore eu fugiat nulla pariatur.`
      },
      {
        img: client07,
        name: "Richard",
        city: "California",
        body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                  sed do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                  ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  Duis aute irure dolor in reprehenderit in voluptate velit
                  esse cillum dolore eu fugiat nulla pariatur.`
      },
    ]
  }, [])
  return (
    <Fragment>
      <section className="testimonial-section" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="testimonial-slider slick">
                <Slider {...settings}>
                  {
                    lastReviews == null ? (
                      <TestimonialIndexSkeleton />
                    ) :
                      lastReviews.length == 0 ?
                        (
                          dummyReviewData.map((review, index) => (
                            <div className="testimonial-grid" key={index}>
                              <div className="testimonial-info">
                                <div className="testimonial-img">
                                  <img src={review.img} className="img-fluid" alt="" />
                                </div>
                                <div className="testimonial-content">
                                  <div className="section-header section-inner-header testimonial-header">
                                    <h1>Testimonials</h1>
                                    <h2>What Our Client Says</h2>
                                  </div>
                                  <div className="testimonial-details">
                                    <p>{review.body}</p>
                                    <h3>
                                      <span>{review.name}</span> {review.city}
                                    </h3>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) :
                        (
                          lastReviews.map((review, index) => (
                            <div className="testimonial-grid" key={index}>
                              <div className="testimonial-info">
                                <div className="testimonial-img">
                                  <img src={review?.authorProfile?.profileImage} className="img-fluid" alt="" />
                                </div>
                                <div className="testimonial-content">
                                  <div className="section-header section-inner-header testimonial-header">
                                    <h1>Testimonials</h1>
                                    <h2>What Our Client Says</h2>
                                  </div>
                                  <div className="testimonial-details">
                                    <p>{review.body}</p>
                                    <h3>
                                      <span>{`Name: ${review?.authorProfile?.fullName}`}</span><br /><br />
                                      {`${review?.authorProfile?.city == '' ? "City: ------" : `City: ${review?.authorProfile?.city}`}`}<br /><br />
                                      <span>{`Date: ${dayjs(review?.createdAt).format("DD MMM YYYY HH:mm")}`}</span>
                                    </h3>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )
                  }
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
})

export default Testimonial

export const TestimonialIndexSkeleton: FC = (() => {
  const theme = useTheme();
  return (
    <div className="testimonial-grid">
      <div className="testimonial-info">
        <div className="testimonial-img">
          <Skeleton animation="wave" variant="circular" height={212} sx={{ border: `1px solid ${theme.palette.secondary.main}` }} />
        </div>
        <div className="testimonial-content">
          <div className="section-header section-inner-header testimonial-header">
            <h1>Testimonials</h1>
            <h2>What Our Client Says</h2>
          </div>
          <div className="testimonial-details">
            <p><Skeleton animation="wave" sx={{ minHeight: '106px', width: '50vw', borderRadius: '15px', border: `1px solid ${theme.palette.secondary.main}` }} /></p>
            <h3>
              <span><Skeleton animation="wave" sx={{ minHeight: '236px', width: '50vw', borderRadius: '15px', border: `1px solid ${theme.palette.secondary.main}` }} /></span><br />
              <br />
              <span></span>
            </h3>
          </div>
        </div>
      </div>
    </div>
  )
})