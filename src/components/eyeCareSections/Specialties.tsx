/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useTheme } from '@mui/material';
const OwlCarousel = dynamic(() => import('react-owl-carousel'), {
  ssr: false,
})

import {
  clinic_011,
  clinic_012,
  clinic_013,
  clinic_014,
  clinic_015
} from "../../../public/assets/imagepath";
import { EyeIconOneSvg, EyeIconSvg } from '../../../public/assets/images/icons/IconsSvgs';
import $ from 'jquery'
import AOS from 'aos'
const Specialities: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme()
  const doctersettings = {
    items: 4,
    loop: true,
    margin: 15,
    dots: false,
    nav: true,
    navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
    navElement: "button  aria-labelledby='slide-nav-1' aria-label='slide-nav-1'",
    autoplay: false,
    infinite: "true",

    slidestoscroll: 1,
    rtl: "true",
    rows: 1,
    responsive: {
      1049: {
        items: 4
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
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);

  return (
    <Fragment>
      <section className="special-section" style={{ ...muiVar, backgroundColor: theme.palette.background.paper }}>
        <div className="ban-bg eyeSvg">
          <EyeIconOneSvg />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-12 aos" data-aos="fade-up">
              <div className="section-heading sec-heading-eye text-center">
                <EyeIconSvg />
                <h2>
                  <span>Our</span> Specialties
                </h2>
                <p>The Great Place Of Eyecare Hospital Center</p>
              </div>
            </div>
          </div>
          <div className=" special owl-them aos" data-aos="fade-up">
            <OwlCarousel {...doctersettings}>
              <div className="item">
                <div className="special-item">
                  <div className="special-img">
                    <Link href="/doctors/search" aria-label='cunsultation'>
                      <img
                        src={clinic_014}
                        alt=""
                        className="img-fluid"
                      />
                    </Link>
                  </div>
                  <div className="special-icon">
                    <Link href="/doctors/search" aria-label='cunsultation'>
                      <i className="fa-solid fa-circle-chevron-right" />
                    </Link>
                  </div>
                  <h3>
                    <Link href="/doctors/search" aria-label='cunsultation'>Cataract</Link>
                  </h3>
                </div>
              </div>
              <div className="item">
                <div className="special-item">
                  <div className="special-img">
                    <Link href="/doctors/search" aria-label='cunsultation'>
                      <img
                        // src="assets/img/clinic/clinic-02.webp"
                        src={clinic_012}
                        alt=""
                        className="img-fluid"
                      />
                    </Link>
                  </div>
                  <div className="special-icon">
                    <Link href="/doctors/search" aria-label='cunsultation'>
                      <i className="fa-solid fa-circle-chevron-right" />
                    </Link>
                  </div>
                  <h3>
                    <Link href="/doctors/search">Corneal Ulcer </Link>
                  </h3>
                </div>
              </div>
              <div className="item">
                <div className="special-item">
                  <div className="special-img">
                    <Link href="/doctors/search" aria-label='cunsultation'>
                      <img
                        // src="assets/img/clinic/clinic-03.webp"
                        src={clinic_013}
                        alt=""
                        className="img-fluid"
                      />
                    </Link>
                  </div>
                  <div className="special-icon">
                    <Link href="/doctors/search" aria-label='cunsultation'>
                      <i className="fa-solid fa-circle-chevron-right" />
                    </Link>
                  </div>
                  <h3>
                    <Link href="/doctors/search" aria-label='cunsultation'>Keratoconus</Link>
                  </h3>
                </div>
              </div>
              <div className="item">
                <div className="special-item">
                  <div className="special-img">
                    <Link href="/doctors/search" aria-label='cunsultation'>
                      <img
                        // src="assets/img/clinic/clinic-01.webp"
                        src={clinic_011}
                        alt=""
                        className="img-fluid"
                      />
                    </Link>
                  </div>
                  <div className="special-icon">
                    <Link href="/doctors/search" aria-label='cunsultation'>
                      <i className="fa-solid fa-circle-chevron-right" />
                    </Link>
                  </div>
                  <h3>
                    <Link href="/doctors/search" aria-label='cunsultation'>Glaucoma</Link>
                  </h3>
                </div>
              </div>
              <div className="item">
                <div className="special-item">
                  <div className="special-img">
                    <Link href="/doctors/search" aria-label='cunsultation'>
                      <img
                        // src="assets/img/clinic/clinic-05.webp"
                        src={clinic_015}
                        alt=""
                        className="img-fluid"
                      />
                    </Link>
                  </div>
                  <div className="special-icon">
                    <Link href="/doctors/search" aria-label='cunsultation'>
                      <i className="fa-solid fa-circle-chevron-right" />
                    </Link>
                  </div>
                  <h3>
                    <Link href="/doctors/search">Keratoconus</Link>
                  </h3>
                </div>
              </div>
            </OwlCarousel>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default Specialities;