/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import dynamic from 'next/dynamic'
import useScssVar from '@/hooks/useScssVar'
import {
  clientSay1,
  clientSay2,
  clientSay3,
  clientsays,
  cloud_2,
  rainbow_2,
  rainbow_3,
  rainbow_4,
  re_image_7,
  re_image_8
} from '../../../public/assets/imagepath';
import { AtomBondSvg } from '../../../public/assets/images/icons/IconsSvgs';
import { useTheme } from '@mui/material';
const OwlCarousel = dynamic(() => import(`react-owl-carousel`), { ssr: false });


const TestimonialSection: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  const settings = {
    items: 1,
    loop: true,
    margin: 15,
    dots: true,
    nav: true,
    navContainer: '.slide-nav-2',
    navText: ['<i class="fas fa-chevron-left custom-arrow"></i>', '<i class="fas fa-chevron-right custom-arrow"></i>'],

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


  }
  return (
    <Fragment>
      <section className="client-us-section-thirteen common-padding" style={muiVar}>
        <div className="client-us-section-thirteenone aos" data-aos="fade-right">
          <img src={cloud_2} alt="#" />
          <img src={rainbow_2} alt="#" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 aos" data-aos="fade-up">
              <div className="section-header-thirteen">
                <div className="section-inner-thirteen">
                  <AtomBondSvg />
                </div>
                <h2>What Our Client Says?</h2>
              </div>
            </div>
          </div>
          <div className="client-says-thirteen owl-theme">
            <OwlCarousel {...settings}>
              <div className="client-says-all">
                <div className="clients-says-content">
                  <p>I would like to thank everyone at Doccure for the fantastic way you looked after me.
                    I could not fault anyone during the time I spent with you - from the point I arrived in reception,
                    to the catering team and every member of staff throughout the changes of shift during my stay.</p>
                  <h4>
                    Courtney Henry
                  </h4>
                  <p className="location-thirteen"><i className="fa-solid fa-location-dot" /> New York, USA</p>
                  <div className="client-says-imagesone">
                    <img src={rainbow_3} alt="#" />
                    <img src={rainbow_4} alt="#" />
                  </div>
                </div>
                <div className="client-says-images">
                  <img src={clientSay1} alt="img-fluid" />
                </div>
              </div>
              <div className="client-says-all">
                <div className="clients-says-content">
                  <p>I would like to thank everyone at Doccure for the fantastic way you looked after me.
                    I could not fault anyone during the time I spent with you - from the point I arrived in reception,
                    to the catering team and every member of staff throughout the changes of shift during my stay.</p>
                  <h4>
                    Courtney Henry
                  </h4>
                  <p className="location-thirteen"><i className="fa-solid fa-location-dot" /> New York, USA</p>
                  <div className="client-says-imagesone">
                    <img src={rainbow_3} alt="#" />
                    <img src={rainbow_4} alt="#" />
                  </div>
                </div>
                <div className="client-says-images">
                  <img src={clientSay2} alt="img-fluid" />
                </div>
              </div>
              <div className="client-says-all">
                <div className="clients-says-content">
                  <p>I would like to thank everyone at Doccure for the fantastic way you looked after me.
                    I could not fault anyone during the time I spent with you - from the point I arrived in reception,
                    to the catering team and every member of staff throughout the changes of shift during my stay.</p>
                  <h4>
                    Courtney Henry
                  </h4>
                  <p className="location-thirteen"><i className="fa-solid fa-location-dot" /> New York, USA</p>
                  <div className="client-says-imagesone">
                    <img src={rainbow_3} alt="#" />
                    <img src={rainbow_4} alt="#" />
                  </div>
                </div>
                <div className="client-says-images">
                  <img src={clientSay3} alt="img-fluid" />
                </div>
              </div>
            </OwlCarousel>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default TestimonialSection;