/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useTheme } from '@mui/material';
import {
  clinic_bg_01, eyeDoctor01, eyeDoctor02, eyeDoctor03, eyeDoctor04, eyeDoctor05
} from "../../../public/assets/imagepath";
import { EyeIconSvg } from '../../../public/assets/images/icons/IconsSvgs';
const OwlCarousel = dynamic(() => import('react-owl-carousel'), {
  ssr: false,
})

const ClinicSection: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  const doctersettings = {
    items: 3,
    loop: true,
    margin: 15,
    dots: false,
    nav: true,
    //   navContainer: '.slide-nav-2',
    navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
    navElement: "button  aria-labelledby='slide-nav-1' aria-label='slide-nav-1'",
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
  }

  return (
    <Fragment>
      <section className="eyeclinics-section" style={muiVar}>
        <div className="container" >
          <div className="row">
            <div className="col-md-12 aos" data-aos="fade-up">
              <div className="section-heading text-center sec-heading-eye">
                <EyeIconSvg />
                <h2>
                  <span>Our</span> Specialties
                </h2>
                <p>The Great Place Of Eyecare Hospital Center</p>
              </div>
            </div>
          </div>
          <div className="eye-clinic owl-them aos" data-aos="fade-up" style={{ position: 'relative', zIndex: 2 }}>
            <OwlCarousel {...doctersettings}>
              <div className="item">
                <div className="our-doctors-card eye-doc">
                  <div className="doctors-header">
                    <Link href="/doctors/search" aria-label='doctor search'>
                      <img
                        src={eyeDoctor01}
                        alt=""
                        className="img-fluid"
                      />
                    </Link>
                  </div>
                  <div className="doctors-body">
                    <h3>
                      <Link href="/doctors/search" aria-label='doctor search'>Dr. Andrea</Link>
                    </h3>
                    <p>MBBS, DOMS, DNB - Ophthalmology</p>
                    <h4>8+ Years Experience Overall</h4>
                    <div className="rating">
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <span>3.8</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="our-doctors-card eye-doc">
                  <div className="doctors-header">
                    <Link href="/doctors/search" aria-label='doctor search'>
                      <img
                        src={eyeDoctor02}
                        alt=""
                        className="img-fluid"
                      />
                    </Link>
                  </div>
                  <div className="doctors-body">
                    <h3>
                      <Link href="/doctors/search" aria-label='doctor search'>Dr. Elizabeth Bella</Link>
                    </h3>
                    <p>MBBS, MS - Ophthalmology</p>
                    <h4>6+ Years Experience Overall</h4>
                    <div className="rating">
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <span>4.5</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="our-doctors-card eye-doc">
                  <div className="doctors-header">
                    <Link href="/doctors/search" aria-label='doctor search'>
                      <img
                        src={eyeDoctor03}
                        alt=""
                        className="img-fluid"
                      />
                    </Link>
                  </div>
                  <div className="doctors-body">
                    <h3>
                      <Link href="/doctors/search" aria-label='doctor search'>Dr. Christian</Link>
                    </h3>
                    <p>MBBS, DOMS, DNB - Ophthalmology</p>
                    <h4>7+ Years Experience Overall</h4>
                    <div className="rating">
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <span>4.0</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="our-doctors-card eye-doc">
                  <div className="doctors-header">
                    <Link href="/doctors/search" aria-label='doctor search'>
                      <img
                        src={eyeDoctor04}
                        alt=""
                        className="img-fluid"
                      />
                    </Link>
                  </div>
                  <div className="doctors-body">
                    <h3>
                      <Link href="/doctors/search" aria-label='doctor search'>Dr. Gabrielle Carolyn</Link>
                    </h3>
                    <p>MBBS, MS - Surgeon</p>
                    <h4>4+ Years Experience Overall</h4>
                    <div className="rating">
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <span>3.7</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="our-doctors-card eye-doc">
                  <div className="doctors-header">
                    <Link href="/doctors/search" aria-label='doctor search'>
                      <img
                        src={eyeDoctor05}
                        alt=""
                        className="img-fluid"
                      />
                    </Link>
                  </div>
                  <div className="doctors-body">
                    <h3>
                      <Link href="/doctors/search" aria-label='doctor search'>Dr. Gaby Carl</Link>
                    </h3>
                    <p>MBBS, DNB - Ophthalmology</p>
                    <h4>5+ Years Experience Overall</h4>
                    <div className="rating">
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <span>3.5</span>
                    </div>
                  </div>
                </div>
              </div>
            </OwlCarousel>
          </div>
        </div>
        <div className="ban-bg" style={{ opacity: 0.3, position: 'relative', top: -390, left: 0 }}>
          <img
            src={clinic_bg_01}
            alt=""
            className="img-fluid bg-08 img"

          />
        </div>
      </section>
    </Fragment>
  )
})

export default ClinicSection;