/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import dynamic from 'next/dynamic'
import useScssVar from '@/hooks/useScssVar'
import { experts2, experts3 } from '../../../public/assets/imagepath';

const OwlCarousel = dynamic(() => import(`react-owl-carousel`), { ssr: false })



const ExpertTeam: FC = (() => {
  const { muiVar } = useScssVar();
  const settings = {
    margin: 0,
    center: true,
    loop: true,
    nav: false,
    dots: false,
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 1,
        margin: 15,
      },
      1000: {
        items: 3,
      }
    }
  };
  return (
    <Fragment>
      <section className="experts-section-sixteen" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-header-sixteen section-header-sixteentwo text-center">
                <p>Our Team</p>
                <h2>Our experts team</h2>
              </div>
            </div>
          </div>
          <div className="slider slider-sixteen aos" data-aos="zoom-in-up">
            <div className=" owl-carousel custome_slides owl-loaded owl-drag" id="slide-experts">
              <OwlCarousel id="customer-testimonoals" {...settings}>
                <div className="test_imgs">
                  <div className="main-reviewimages">
                    <img src={experts2} alt="" className="img-fluid" />
                  </div>
                  <div className="testimonal-contents">
                    <h5>Leslie Alexander</h5>
                    <span>Aesthetic Surgery</span>
                  </div>
                </div>
                <div className="test_imgs">
                  <div className="main-reviewimages">
                    <img src={experts3} alt="" className="img-fluid" />
                  </div>
                  <div className="testimonal-contents">
                    <h5>Leslie Alexander</h5>
                    <span>Aesthetic Surgery</span>
                  </div>
                </div>
                <div className="test_imgs">
                  <div className="main-reviewimages">
                    <img src={experts2} alt="" className="img-fluid" />
                  </div>
                  <div className="testimonal-contents">
                    <h5>Leslie Alexander</h5>
                    <span>Aesthetic Surgery</span>
                  </div>
                </div>
                <div className="test_imgs">
                  <div className="main-reviewimages">
                    <img src={experts2} alt="" className="img-fluid" />
                  </div>
                  <div className="testimonal-contents">
                    <h5>Leslie Alexander</h5>
                    <span>Aesthetic Surgery</span>
                  </div>
                </div>
              </OwlCarousel>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default ExpertTeam;