/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import dynamic from 'next/dynamic'
import useScssVar from '@/hooks/useScssVar'
import { featureservice1, featureservice3, featureservice2 } from '../../../public/assets/imagepath';

const OwlCarousel = dynamic(() => import(`react-owl-carousel`), { ssr: false });


const FeaturesSection: FC = (() => {

  const { muiVar } = useScssVar();
  const settings = {
    items: 3,
    loop: true,
    margin: 15,
    dots: true,
    nav: true,
    navContainer: ".slide-nav-1",
    navText: [
      '<i class="fas fa-chevron-left custom-arrow"></i>',
      '<i class="fas fa-chevron-right custom-arrow"></i>',
    ],

    autoplay: false,
    infinite: "true",

    slidestoscroll: 1,
    rtl: "true",
    rows: 1,
    responsive: {
      1049: {
        items: 3
      },
      992: {
        items: 3
      },
      800: {
        items: 3
      },
      776: {
        items: 3
      },
      567: {
        items: 1
      },
      200: {
        items: 1
      }
    }
  };
  return (
    <Fragment>
      <div className="features-section-sixteen" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-header-sixteen text-center">
                <p>OUr services</p>
                <h2>Featured Services</h2>
              </div>
            </div>
          </div>
          <div className="features-slider-sixteen owl-theme">
            <OwlCarousel {...settings}>
              <div className="feature-sixteen-main">
                <div className="feature-six-img">
                  <img src={featureservice1} alt="" className="img-fluid" />
                  <div className="feature-content-six">
                    <div className="feature-content-one">
                      <h5>Mommy Makeover</h5>
                      <span>
                        <i className="fa-solid fa-angle-up" />
                      </span>
                    </div>
                    <div className="feature-content-two">
                      <p>
                        Facial procedures are popular because of their ability to
                        give patients a youthful appearance, reduce the signs of
                        aging and by improving existing features for more
                        aesthetically pleasing results. These methods are in two
                        separate categories and are commonly known as facial
                        rejuvenation and facial contouring. Facial rejuvenation
                        consists of facelift, eyelid lift, neck lift and brow lift.
                      </p>
                      <span>
                        <i className="fa-solid fa-angle-down" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="feature-sixteen-main">
                <div className="feature-six-img">
                  <img src={featureservice3} alt="" className="img-fluid" />
                  <div className="feature-content-six">
                    <div className="feature-content-one">
                      <h5>Face Makeover</h5>
                      <span>
                        <i className="fa-solid fa-angle-up" />
                      </span>
                    </div>
                    <div className="feature-content-two">
                      <p>
                        Facial procedures are popular because of their ability to
                        give patients a youthful appearance, reduce the signs of
                        aging and by improving existing features for more
                        aesthetically pleasing results. These methods are in two
                        separate categories and are commonly known as facial
                        rejuvenation and facial contouring. Facial rejuvenation
                        consists of facelift, eyelid lift, neck lift and brow lift.
                      </p>
                      <span>
                        <i className="fa-solid fa-angle-down" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="feature-sixteen-main">
                <div className="feature-six-img">
                  <img src={featureservice2} alt="" className="img-fluid" />
                  <div className="feature-content-six">
                    <div className="feature-content-one">
                      <h5>BodyTite</h5>
                      <span>
                        <i className="fa-solid fa-angle-up" />
                      </span>
                    </div>
                    <div className="feature-content-two">
                      <p>
                        Facial procedures are popular because of their ability to
                        give patients a youthful appearance, reduce the signs of
                        aging and by improving existing features for more
                        aesthetically pleasing results. These methods are in two
                        separate categories and are commonly known as facial
                        rejuvenation and facial contouring. Facial rejuvenation
                        consists of facelift, eyelid lift, neck lift and brow lift.
                      </p>
                      <span>
                        <i className="fa-solid fa-angle-down" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="feature-sixteen-main">
                <div className="feature-six-img">
                  <img src={featureservice3} alt="" className="img-fluid" />
                  <div className="feature-content-six">
                    <div className="feature-content-one">
                      <h5>BodyTite</h5>
                      <span>
                        <i className="fa-solid fa-angle-up" />
                      </span>
                    </div>
                    <div className="feature-content-two">
                      <p>
                        Facial procedures are popular because of their ability to
                        give patients a youthful appearance, reduce the signs of
                        aging and by improving existing features for more
                        aesthetically pleasing results. These methods are in two
                        separate categories and are commonly known as facial
                        rejuvenation and facial contouring. Facial rejuvenation
                        consists of facelift, eyelid lift, neck lift and brow lift.
                      </p>
                      <span>
                        <i className="fa-solid fa-angle-down" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="feature-sixteen-main">
                <div className="feature-six-img">
                  <img src={featureservice1} alt="" className="img-fluid" />
                  <div className="feature-content-six">
                    <div className="feature-content-one">
                      <h5>BodyTite</h5>
                      <span>
                        <i className="fa-solid fa-angle-up" />
                      </span>
                    </div>
                    <div className="feature-content-two">
                      <p>
                        Facial procedures are popular because of their ability to
                        give patients a youthful appearance, reduce the signs of
                        aging and by improving existing features for more
                        aesthetically pleasing results. These methods are in two
                        separate categories and are commonly known as facial
                        rejuvenation and facial contouring. Facial rejuvenation
                        consists of facelift, eyelid lift, neck lift and brow lift.
                      </p>
                      <span>
                        <i className="fa-solid fa-angle-down" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </OwlCarousel>
          </div>
        </div>
      </div>
    </Fragment>
  )
});

export default FeaturesSection;