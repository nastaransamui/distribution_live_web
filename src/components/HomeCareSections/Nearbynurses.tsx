/* eslint-disable @next/next/no-img-element */
import { FC } from 'react'
import useScssVar from '@/hooks/useScssVar'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  nurse_01,
  nurse_02,
  nurse_03,
  nurse_04,
  nurse_05,
  nurse_06,
} from '@/public/assets/imagepath'
import { useTheme } from "@mui/material";

const OwlCarousel = dynamic(() => import(`react-owl-carousel`), { ssr: false })

const Nearbynurses: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme()
  const options = {
    items: 5,
    margin: 30,
    dots: false,
    nav: true,
    smartSpeed: 2000,
    navText: [
      `<i class="fas fa-chevron-left" style="color: ${theme.palette.text.color};"></i>`,
      `<i class="fas fa-chevron-right" style="color: ${theme.palette.text.color};"></i>`,
    ],
    navElement: "button  aria-labelledby='slide-nav-1' aria-label='slide-nav-1'",
    loop: true,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      991: {
        items: 3,
      },
      1170: {
        items: 3,
      },
    },
  };

  return (
    <section className="neraby-nurses-sec" style={muiVar}>
      <div className="container">
        <div className="section-head-fourteen" data-aos="fade-up">
          <h2>
            Nearby <span> Nurses </span>
          </h2>
          <p>Meet your nearby nursess</p>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="nurse-profile-slider">
              <OwlCarousel {...options}>
                <div className="nurse-profile" data-aos="fade-down">
                  <div className="nurse-img">
                    <Link href="" aria-label='fav' onClick={(e) => e.preventDefault()}>
                      <img src={nurse_01} alt="Img" />
                    </Link>
                    <span className="badge">7+ Years Experience</span>
                    <span className="fav-item img-top-item">
                      <Link href="" aria-label='fav' onClick={(e) => e.preventDefault()} className="fav-icon">
                        <i className="feather-heart" />
                      </Link>
                    </span>
                  </div>
                  <div className="nurse-pofile-info">
                    <div className="nurse-name">
                      <h3>
                        <Link href="" aria-label='fav' onClick={(e) => e.preventDefault()}>Elizabeth Penelope</Link>
                      </h3>
                      <span>United States</span>
                    </div>
                    <div className="nurse-details">
                      <h4>
                        <span>
                          <i className="feather-thumbs-up" />
                          98%
                        </span>
                        1856 Patients
                      </h4>
                      <span className="distance">
                        <i className="feather-map-pin" />
                        700 m
                      </span>
                    </div>
                  </div>
                </div>

                <div className="nurse-profile" data-aos="fade-down">
                  <div className="nurse-img">
                    <Link href="" aria-label='fav' onClick={(e) => e.preventDefault()}>
                      <img src={nurse_02} alt="Img" />
                    </Link>
                    <span className="badge">5+ Years Experience</span>
                    <span className="fav-item img-top-item">
                      <Link href="#" className="fav-icon" aria-label='fav'>
                        <i className="feather-heart" />
                      </Link>
                    </span>
                  </div>
                  <div className="nurse-pofile-info">
                    <div className="nurse-name">
                      <h3>
                        <Link href="" aria-label='fav' onClick={(e) => e.preventDefault()}>Dorothy Joanne</Link>
                      </h3>
                      <span>United Kingdom</span>
                    </div>
                    <div className="nurse-details">
                      <h4>
                        <span>
                          <i className="feather-thumbs-up" />
                          97%
                        </span>
                        2589 Patients
                      </h4>
                      <span className="distance">
                        <i className="feather-map-pin" />
                        2.5 m
                      </span>
                    </div>
                  </div>
                </div>
                <div className="nurse-profile" data-aos="fade-down">
                  <div className="nurse-img">
                    <Link href="" aria-label='fav' onClick={(e) => e.preventDefault()}>
                      <img src={nurse_03} alt="Img" />
                    </Link>
                    <span className="badge">8+ Years Experience</span>
                    <span className="fav-item img-top-item">
                      <Link href="#" className="fav-icon" aria-label='fav'>
                        <i className="feather-heart" />
                      </Link>
                    </span>
                  </div>
                  <div className="nurse-pofile-info">
                    <div className="nurse-name">
                      <h3>
                        <Link href="/patient/doctor-profile">Rachel Sophie</Link>
                      </h3>
                      <span>United States</span>
                    </div>
                    <div className="nurse-details">
                      <h4>
                        <span>
                          <i className="feather-thumbs-up" />
                          91%
                        </span>
                        5478 Patients
                      </h4>
                      <span className="distance">
                        <i className="feather-map-pin" />
                        900 m
                      </span>
                    </div>
                  </div>
                </div>
                <div className="nurse-profile" data-aos="fade-down">
                  <div className="nurse-img">
                    <Link href="" aria-label='fav' onClick={(e) => e.preventDefault()}>
                      <img src={nurse_04} alt="Img" />
                    </Link>
                    <span className="badge">7+ Years Experience</span>
                    <span className="fav-item img-top-item">
                      <Link href="#" className="fav-icon" aria-label='fav'>
                        <i className="feather-heart" />
                      </Link>
                    </span>
                  </div>
                  <div className="nurse-pofile-info">
                    <div className="nurse-name">
                      <h3>
                        <Link href="/patient/doctor-profile">Carolyn</Link>
                      </h3>
                      <span>United States</span>
                    </div>
                    <div className="nurse-details">
                      <h4>
                        <span>
                          <i className="feather-thumbs-up" />
                          94%
                        </span>
                        1756 Patients
                      </h4>
                      <span className="distance">
                        <i className="feather-map-pin" />
                        600 m
                      </span>
                    </div>
                  </div>
                </div>
                <div className="nurse-profile" data-aos="fade-down">
                  <div className="nurse-img">
                    <Link href="" aria-label='fav' onClick={(e) => e.preventDefault()}>
                      <img src={nurse_05} alt="Img" />
                    </Link>
                    <span className="badge">10+ Years Experience</span>
                    <span className="fav-item img-top-item">
                      <Link href="#" className="fav-icon" aria-label='fav'>
                        <i className="feather-heart" />
                      </Link>
                    </span>
                  </div>
                  <div className="nurse-pofile-info">
                    <div className="nurse-name">
                      <h3>
                        <Link href="/patient/doctor-profile">Jasmine Madeleine</Link>
                      </h3>
                      <span>United States</span>
                    </div>
                    <div className="nurse-details">
                      <h4>
                        <span>
                          <i className="feather-thumbs-up" />
                          98%
                        </span>
                        1856 Patients
                      </h4>
                      <span className="distance">
                        <i className="feather-map-pin" />
                        700 m
                      </span>
                    </div>
                  </div>
                </div>
                <div className="nurse-profile" data-aos="fade-down">
                  <div className="nurse-img">
                    <Link href="" aria-label='fav' onClick={(e) => e.preventDefault()}>
                      <img src={nurse_06} alt="Img" />
                    </Link>
                    <span className="badge">15+ Years Experience</span>
                    <span className="fav-item img-top-item">
                      <Link href="#" className="fav-icon" aria-label='fav'>
                        <i className="feather-heart" />
                      </Link>
                    </span>
                  </div>
                  <div className="nurse-pofile-info">
                    <div className="nurse-name">
                      <h3>
                        <Link href="/patient/doctor-profile">Samantha Tracey</Link>
                      </h3>
                      <span>United Kingdom</span>
                    </div>
                    <div className="nurse-details">
                      <h4>
                        <span>
                          <i className="feather-thumbs-up" />
                          95%
                        </span>
                        1156 Patients
                      </h4>
                      <span className="distance">
                        <i className="feather-map-pin" />
                        500 m
                      </span>
                    </div>
                  </div>
                </div>
              </OwlCarousel>
            </div>
            <div className="owl-nav-button">
              <div className="owl-nav nurse-slide-nav nav-control" />
              <Link href="/patient/doctor-profile" className="view-all">
                View All Nurses
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

export default Nearbynurses