/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useMemo } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Slider from 'react-slick'
import { useTheme } from '@mui/material';
import { AboutUsIconSvg } from '../../../public/assets/images/icons/IconsSvgs';
import { aboutus_fift_1, client08, client09, client10, clinet02, clinet05 } from '@/public/assets/imagepath';
import Skeleton from '@mui/material/Skeleton'
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';

const TestimonialsSection: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  const settings = {
    dots: true,
    arrows: true,
    autoplay: false,
    centerMode: true,
    infinite: true,
    slidesToShow: 3,
    vertical: true,
    verticalSwiping: true,
  };
  const lastReviewsData = useSelector((state: AppState) => state.lastReviewsData)
  const { lastReviews } = lastReviewsData;


  const dummyReviewData = useMemo(() => {
    return [
      {
        img: clinet05,
        name: "Madeleine Jennifer",
        body: ` Lorem Ipsum is simply dummy text of the printing and typesetting
    industry. Lorem Ipsum has been the industry s standard dummy
    text ever since the 1500s, when an unknown printer took a galley
    of type and scrambled it to make a type specimen book.`
      },
      {
        img: client09,
        name: "Chennai, Tamilnadu",
        body: ` Lorem Ipsum is simply dummy text of the printing and typesetting
    industry. Lorem Ipsum has been the industry s standard dummy
    text ever since the 1500s, when an unknown printer took a galley
    of type and scrambled it to make a type specimen book.`
      },
      {
        img: clinet02,
        name: "Madeleine Jennifer",
        body: ` Lorem Ipsum is simply dummy text of the printing and typesetting
    industry. Lorem Ipsum has been the industry s standard dummy
    text ever since the 1500s, when an unknown printer took a galley
    of type and scrambled it to make a type specimen book.`
      },
      {
        img: clinet02,
        name: "Madeleine Jennifer",
        body: ` Lorem Ipsum is simply dummy text of the printing and typesetting
    industry. Lorem Ipsum has been the industry s standard dummy
    text ever since the 1500s, when an unknown printer took a galley
    of type and scrambled it to make a type specimen book.`
      },
    ]
  }, [])
  return (
    <Fragment>
      <section className="about-us-section-fifteen" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-header-fifteen text-center">
                <h2>
                  Our <span>Patients Says</span>
                </h2>
                <p>What our Patients say about us</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">
              <div className="aboutus-img-main">
                <img
                  src={aboutus_fift_1}
                  alt="image"
                  className="img-fluid"
                />
                <div className="aboutus-img-one">
                  <AboutUsIconSvg />
                </div>
              </div>
            </div>
            <div className="col-lg-6 position-relative">
              <div className="slider vertical-slider slick-initialized slick-slider slick-vertical">
                <Slider {...settings} className="slider vertical-slider slick-initialized slick-slider slick-vertical">
                  {
                    lastReviews == null ?
                      (
                        Array.from(Array(3).keys()).map((i) => (
                          <EntTestimonialsEskeleton key={i} />
                        ))
                      ) :
                      lastReviews.length == 0 ?
                        (
                          dummyReviewData.map((review, index) => {
                            return (
                              <div className="aboutus-fifteen-main" key={index}>
                                <div className="aboutus-profile-left">
                                  <div className="aboutus-image">
                                    <img
                                      src={review.img}
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </div>
                                  <div className="aboutus-contents">
                                    <h6>{review.name}</h6>
                                  </div>
                                </div>
                                <p>{review.body}</p>
                              </div>
                            )
                          })
                        ) :
                        (
                          lastReviews.map((review, index) => {
                            return (
                              <div className="aboutus-fifteen-main" key={index}>
                                <div className="aboutus-profile-left">
                                  <div className="aboutus-image">
                                    <img
                                      src={review.authorProfile?.profileImage}
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </div>
                                  <div className="aboutus-contents">
                                    <h6>{review?.authorProfile?.gender !== "" && `${review?.authorProfile?.gender} .`}{review?.authorProfile?.fullName}</h6>
                                  </div>
                                </div>
                                <p>{review.body}</p>
                              </div>
                            )
                          })
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
});

export default TestimonialsSection;

const EntTestimonialsEskeleton: FC = (() => {
  return (
    <div className="aboutus-fifteen-main">
      <div className="aboutus-profile-left">
        <div className="aboutus-image">
          <Skeleton animation="wave" variant='circular' width={50} height={50} sx={{ borderRadius: '50%' }} />
        </div>
        <div className="aboutus-contents" style={{ minWidth: '100px' }}>
          <Skeleton component="h6" animation="wave" variant='rectangular' height={5} width={"100%"} sx={{ borderRadius: '8px', backgroundColor: 'primary.main' }} />

        </div>
      </div>
      <Skeleton component="p" animation="wave" variant='rectangular' height={5} width={"100%"} sx={{ borderRadius: '8px', backgroundColor: 'text.disabled' }} />

    </div>
  )
})