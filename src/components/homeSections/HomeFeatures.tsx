// @ts-nocheck
/* eslint-disable @next/next/no-img-element */
import useScssVar from '@/hooks/useScssVar';
import { useTheme } from '@mui/material';
import { FC, Fragment } from 'react'
import { feature, featureImg1, featureImg2, featureImg3, featureImg4, featureImg5, featureImg6 } from '../../../public/assets/imagepath'
import Slider from 'react-slick'


const HomeFeatures: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  const settings = {
    dots: true,
    autoplay: false,
    infinite: true,
    variableWidth: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          centerMode: true,
        }
      },
      {
        breakpoint: 993,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,

        }
      }
    ]
  };
  return (
    <Fragment>
      <section className="section section-features" style={muiVar}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-5 features-img aos" >
              <img src={feature} className="img-fluid" alt="Feature" />
            </div>
            <div className="col-md-7">
              <div className="section-header aos" >
                <h2 className="mt-2">Availabe Features in Our Clinic</h2>
                <p>
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.{" "}
                </p>
              </div>
              <div className="features-slider slider aos" >
                <Slider {...settings}>
                  <div>
                    <div className="feature-item text-center">
                      <img src={featureImg1} className="img-fluid" alt="Feature" />
                      <p>Patient Ward</p>
                    </div>
                  </div>
                  <div>
                    <div className="feature-item text-center">
                      <img src={featureImg2} className="img-fluid" alt="Feature" />
                      <p>Test Room</p>
                    </div>
                  </div>
                  <div>
                    <div className="feature-item text-center">
                      <img src={featureImg3} className="img-fluid" alt="Feature" />
                      <p>ICU</p>
                    </div>
                  </div>
                  <div>
                    <div className="feature-item text-center">
                      <img src={featureImg4} className="img-fluid" alt="Feature" />
                      <p>Laboratory</p>
                    </div>
                  </div>
                  <div>
                    <div className="feature-item text-center">
                      <img src={featureImg5} className="img-fluid" alt="Feature" />
                      <p>Operation</p>
                    </div>
                  </div>
                  <div>
                    <div className="feature-item text-center">
                      <img src={featureImg6} className="img-fluid" alt="Feature" />
                      <p>Medical</p>
                    </div>
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

export default HomeFeatures;