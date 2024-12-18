/* eslint-disable @next/next/no-img-element */
import { Fragment, FC } from "react";
import useScssVar from "@/hooks/useScssVar";
import dynamic from 'next/dynamic'
import Link from 'next/link';
import { useTheme } from "@mui/material";
import { clinic_06, clinic_07, clinic_08, clinic_09, clinic_10 } from "@/public/assets/imagepath";
const OwlCarousel = dynamic(() => import('react-owl-carousel'), {
  ssr: false,
})

const ClinicFeature: FC = (() => {

  const { muiVar } = useScssVar();
  const theme = useTheme();
  const availablesettings = {
    loop: true,
    margin: 15,
    dots: false,
    nav: true,
    navContainer: '.slide-nav-3',
    navText: ['<i class="fas fa-chevron-left custom-arrow"></i>', '<i class="fas fa-chevron-right custom-arrow"></i>'],
    navElement: "button  aria-labelledby='slide-nav-1' aria-label='slide-nav-1'",
    items: 4,
    autoplay: false,
    infinite: "true",
    slidestoshow: 5,
    slidestoscroll: 1,
    rtl: "true",
    responsive: {
      '1200': {
        items: 4
      },
      '992': {
        items: 2
      },
      '800': {
        items: 2
      },
      '776': {
        items: 2
      },
      '567': {
        items: 1
      },
      '200': {
        items: 1
      }
    }
  }
  return (
    <Fragment>
      <section className="clinic-features-section" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="section-heading aos" data-aos="fade-up">
                <h2>Availabe Features in Our Clinic</h2>
                <p>Meet our Experts &amp; Book Online</p>
              </div>
            </div>
            <div className="col-md-6 text-end aos" data-aos="fade-up">
              <div className="owl-nav slide-nav-3 text-end nav-control" />
            </div>
          </div>
          <div className="clinic-feature owl-theme aos" data-aos="fade-up">
            <OwlCarousel  {...availablesettings} >
              <div className="item">
                <div className="clinic-features">
                  <img src={clinic_06} className="img-fluid" alt="" />
                </div>
                <div className="clinic-feature-overlay">
                  <Link href="#" aria-label="link" className="img-overlay">Operation</Link>
                </div>
              </div>
              <div className="item">
                <div className="clinic-features">
                  <img src={clinic_07} className="img-fluid" alt="" />
                </div>
                <div className="clinic-feature-overlay">
                  <Link href="#" aria-label="link" className="img-overlay">Medical</Link>
                </div>
              </div>
              <div className="item">
                <div className="clinic-features">
                  <img src={clinic_08} className="img-fluid" alt="" />
                </div>
                <div className="clinic-feature-overlay">
                  <Link href="#" aria-label="link" className="img-overlay">Patient Ward</Link>
                </div>
              </div>
              <div className="item">
                <div className="clinic-features">
                  <img src={clinic_09} className="img-fluid" alt="" />
                </div>
                <div className="clinic-feature-overlay">
                  <Link href="#" aria-label="link" className="img-overlay">TEST ROOM</Link>
                </div>
              </div>
              <div className="item">
                <div className="clinic-features">
                  <img src={clinic_10} className="img-fluid" alt="" />
                </div>
                <div className="clinic-feature-overlay">
                  <Link href="#" aria-label="link" className="img-overlay">ICU</Link>
                </div>
              </div>
            </OwlCarousel>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default ClinicFeature