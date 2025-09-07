/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useMemo } from 'react'
import useScssVar from '@/hooks/useScssVar'
import dynamic from 'next/dynamic'
import AOS from 'aos'
const OwlCarousel = dynamic(() => import(`react-owl-carousel`), { ssr: false })
import { useTheme } from '@mui/material'
import { client03, client04, client09, clinet02, clinet05, feedback_six } from '../../../public/assets/imagepath'
import { useSelector } from 'react-redux'
import { AppState } from '@/redux/store'
import Rating from '@mui/material/Rating'
import Skeleton from '@mui/material/Skeleton'
import dayjs from 'dayjs'
const TestimonialsSection: FC = (() => {
  const theme = useTheme();
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

  const doctersettings = {
    items: 1,
    loop: true,
    margin: 15,
    dots: false,
    nav: true,
    navText: ['<i class="fa-solid fa-caret-left "></i>', '<i class="fa-solid fa-caret-right"></i>'],
    navElement: "button  aria-labelledby='slide-nav-1' aria-label='slide-nav-1'",
    autoplay: false,
    infinite: "true",

    slidestoscroll: 1,
    rtl: "true",
    rows: 1,
    responsive: {
      1049: {
        items: 1
      },
      992: {
        items: 1
      },
      800: {
        items: 1
      },
      776: {
        items: 1
      },
      567: {
        items: 1
      },
      200: {
        items: 1
      }
    }

  }
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
                <OwlCarousel {...doctersettings}>
                  {
                    lastReviews == null ?
                      (Array(1).fill(0).map((_, index) => (
                        <FertilityTestimonialSkeleton key={index} />
                      ))) :
                      lastReviews.length == 0 ?
                        dummyReviewData.map((review, index) => {
                          return (
                            <div className="card feedback-card" key={index}>
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
                          )
                        })
                        :
                        lastReviews.map((review, index) => {
                          return (
                            <div className="card feedback-card" key={index}>
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
                          )
                        })
                  }
                </OwlCarousel>
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