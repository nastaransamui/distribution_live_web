/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Slider from 'react-slick'
import { useTheme } from '@mui/material';
import { AboutUsIconSvg } from '../../../public/assets/images/icons/IconsSvgs';
import { aboutus_fift_1, client08, client09, client10, clinet02, clinet05 } from '@/public/assets/imagepath';


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
                  <div className="aboutus-fifteen-main">
                    <div className="aboutus-profile-left">
                      <div className="aboutus-image">
                        <img
                          src={clinet05}
                          alt=""
                          className="img-fluid"
                        />
                      </div>
                      <div className="aboutus-contents">
                        <h6>Madeleine Jennifer</h6>
                        <span>Chennai, Tamilnadu</span>
                      </div>
                    </div>
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and typesetting
                      industry. Lorem Ipsum has been the industry s standard dummy
                      text ever since the 1500s, when an unknown printer took a galley
                      of type and scrambled it to make a type specimen book.
                    </p>
                  </div>
                  <div className="aboutus-fifteen-main">
                    <div className="aboutus-profile-left">
                      <div className="aboutus-image">
                        <img
                          src={client09}
                          alt=""
                          className="img-fluid"
                        />
                      </div>
                      <div className="aboutus-contents">
                        <h6>Madeleine Jennifer</h6>
                        <span>Chennai, Tamilnadu</span>
                      </div>
                    </div>
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and typesetting
                      industry. Lorem Ipsum has been the industry s standard dummy
                      text ever since the 1500s, when an unknown printer took a galley
                      of type and scrambled it to make a type specimen book.
                    </p>
                  </div>
                  <div className="aboutus-fifteen-main">
                    <div className="aboutus-profile-left">
                      <div className="aboutus-image">
                        <img
                          src={clinet02}
                          alt=""
                          className="img-fluid"
                        />
                      </div>
                      <div className="aboutus-contents">
                        <h6>Madeleine Jennifer</h6>
                        <span>Chennai, Tamilnadu</span>
                      </div>
                    </div>
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and typesetting
                      industry. Lorem Ipsum has been the industry s standard dummy
                      text ever since the 1500s, when an unknown printer took a galley
                      of type and scrambled it to make a type specimen book.
                    </p>
                  </div>
                  <div className="aboutus-fifteen-main">
                    <div className="aboutus-profile-left">
                      <div className="aboutus-image">
                        <img
                          src={clinet02}
                          alt=""
                          className="img-fluid"
                        />
                      </div>
                      <div className="aboutus-contents">
                        <h6>Madeleine Jennifer</h6>
                        <span>Chennai, Tamilnadu</span>
                      </div>
                    </div>
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and typesetting
                      industry. Lorem Ipsum has been the industry s standard dummy
                      text ever since the 1500s, when an unknown printer took a galley
                      of type and scrambled it to make a type specimen book.
                    </p>
                  </div>
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