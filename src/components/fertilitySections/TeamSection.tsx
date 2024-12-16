/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect } from 'react'
import Link from 'next/link'
import useScssVar from '@/hooks/useScssVar'
import AOS from 'aos'
import dynamic from 'next/dynamic'
import { useTheme } from '@mui/material'
import { ServeImageIconOneSvg, ServeImageIconTwoSvg } from '../../../public/assets/images/icons/IconsSvgs'
import { doctor_15_aspect, doctor_16_aspect, doctor_17_aspect } from '@/public/assets/imagepath'
const OwlCarousel = dynamic(() => import(`react-owl-carousel`), { ssr: false })



const TeamSection: FC = (() => {

  const { muiVar } = useScssVar();
  const theme = useTheme();
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);
  const doctersettings = {
    items: 2,
    loop: true,
    margin: 15,
    dots: false,
    nav: true,
    navContainer: '.slide-nav-14',
    navText: ['<i class="fa-solid fa-caret-left "></i>', '<i class="fa-solid fa-caret-right"></i>'],
    navElement: "button  aria-labelledby='slide-nav-1' aria-label='slide-nav-1'",
    autoplay: false,
    infinite: "true",

    slidestoscroll: 1,
    rtl: "true",
    rows: 1,
    responsive: {
      1049: {
        items: 2
      },
      992: {
        items: 2
      },
      800: {
        items: 2
      },
      776: {
        items: 2
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
      <div className="team-section-fourteen" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="section-header-fourteen">
                <div className="service-inner-fourteen">
                  <div className="service-inner-fourteen-one"></div>
                  <div className="service-inner-fourteen-two">
                    <h3>Our Team</h3>
                  </div>
                  <div className="service-inner-fourteen-three"></div>
                </div>
                <h2>Our Qualified Doctors</h2>
              </div>
            </div>
            <div className="col-lg-6 aos" data-aos="fade-up">
              <div className="owl-nav slide-nav-14 text-end nav-control" />
            </div>
          </div>
          <div className="owl-theme team-fourteen-slider">
            <OwlCarousel {...doctersettings}>
              <div className="articles-grid articles-grid-fourteen w-100">
                <div className="articles-info">
                  <div className="articles-left">
                    <Link href="/doctors/search" aria-label='search'>
                      <div className="articles-img articles-img-fourteen">
                        <img
                          src={doctor_15_aspect}
                          alt=""
                          className="img-fluid"
                        />
                      </div>
                    </Link>
                  </div>
                  <div className="articles-right">
                    <div className="articles-content articles-content-fourteen">
                      <Link href="/doctors/search" aria-label='search'>Dr. Marie Wells</Link>
                      <ul className="articles-list nav">
                        <li className="Qualified-doctors-fourteen">
                          Pregnancy Specialist
                        </li>
                        <li className="Qualified-doctors-fourteentwo">
                          +2000 Patients
                        </li>
                      </ul>
                      <div className="rating rating-fourteen">
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star" />
                        <span className="d-inline-block average-rating">(35)</span>
                      </div>
                      <p className="text-muted">
                        <i className="feather-map-pin" />
                        <span>0.9</span> min - Newyork, USA
                      </p>
                      <ul className="articles-list nav mb-0">
                        <li className="Qualified-doctors-fourteenthree">$ 200</li>
                        <li className="Qualified-doctors-fourteenfour">
                          <Link href="/doctors/search" aria-label='search'>Consult Now</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="articles-grid articles-grid-fourteen w-100">
                <div className="articles-info">
                  <div className="articles-left">
                    <Link href="/doctors/search" aria-label='search'>
                      <div className="articles-img articles-img-fourteen">
                        <img
                          src={doctor_16_aspect}
                          alt=""
                          className="img-fluid"
                        />
                      </div>
                    </Link>
                  </div>
                  <div className="articles-right">
                    <div className="articles-content articles-content-fourteen">
                      <Link href="/doctors/search" aria-label='search'>Dr. Justin Parker</Link>
                      <ul className="articles-list nav">
                        <li className="Qualified-doctors-fourteen">Surgeon</li>
                        <li className="Qualified-doctors-fourteentwo">
                          +4000 Patients
                        </li>
                      </ul>
                      <div className="rating rating-fourteen">
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star" />
                        <span className="d-inline-block average-rating">(125)</span>
                      </div>
                      <p className="text-muted">
                        <i className="feather-map-pin" />
                        <span>1.0</span> min - Newyork, USA
                      </p>
                      <ul className="articles-list nav mb-0">
                        <li className="Qualified-doctors-fourteenthree">$ 600</li>
                        <li className="Qualified-doctors-fourteenfour">
                          <Link href="/doctors/search" aria-label='search'>Consult Now</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="articles-grid articles-grid-fourteen w-100">
                <div className="articles-info">
                  <div className="articles-left">
                    <Link href="/doctors/search" aria-label='search'>
                      <div className="articles-img articles-img-fourteen">
                        <img
                          src={doctor_17_aspect}
                          alt=""
                          className="img-fluid"
                        />
                      </div>
                    </Link>
                  </div>
                  <div className="articles-right">
                    <div className="articles-content articles-content-fourteen">
                      <Link href="/doctors/search" aria-label='search'>Dr. Marie Wells</Link>
                      <ul className="articles-list nav">
                        <li className="Qualified-doctors-fourteen">
                          Pregnancy Specialist
                        </li>
                        <li className="Qualified-doctors-fourteentwo">
                          +2000 Patients
                        </li>
                      </ul>
                      <div className="rating rating-fourteen">
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star" />
                        <span className="d-inline-block average-rating">(35)</span>
                      </div>
                      <p className="text-muted">
                        <i className="feather-map-pin" />
                        <span>0.9</span> min - Newyork, USA
                      </p>
                      <ul className="articles-list nav mb-0">
                        <li className="Qualified-doctors-fourteenthree">$ 200</li>
                        <li className="Qualified-doctors-fourteenfour">
                          <Link href="/doctors/search" aria-label='search'>Consult Now</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </OwlCarousel>
          </div>
        </div>
        <div className="banner-imgfourteenseven">
          <ServeImageIconOneSvg />
        </div>
        <div className="banner-imgfourteeneight">
          <ServeImageIconTwoSvg />
        </div>
        <div className="banner-imgfourteennine">
          <ServeImageIconTwoSvg />
        </div>
      </div>
    </Fragment>
  )
})

export default TeamSection;