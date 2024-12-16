/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link'
import AOS from 'aos'
import dynamic from 'next/dynamic'
import { big_paw, small_paw, vetDoctor01, vetDoctor02, vetDoctor03, vetDoctor04 } from '../../../public/assets/imagepath'
import { useTheme } from '@mui/material'
const Owlcarousel = dynamic(() => import('react-owl-carousel'), {
  ssr: false,
})



const OurDoctors: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);
  const options = {
    loop: true,
    margin: 24,
    dots: false,
    nav: true,
    smartSpeed: 2000,
    navContainer: '.slide-nav-16',
    navText: ['<i class="fa-solid fa-caret-left "></i>', '<i class="fa-solid fa-caret-right"></i>'],
    navElement: "button  aria-labelledby='slide-nav-1' aria-label='slide-nav-1'",
    responsive: {
      0: {
        items: 1
      },
      500: {
        items: 1
      },
      575: {
        items: 2
      },
      768: {
        items: 2
      },
      1000: {
        items: 4
      },
      1300: {
        items: 4
      }
    }
  };

  return (
    <Fragment>
      <div className="blog-section-fourteen our-doctor-twelve" style={muiVar}>
        <div className="floating-bg">
          <img src={small_paw} alt="" />
          <img src={big_paw} alt="" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-header-fourteen service-inner-fourteen">
                <div className="service-inner-fourteen">
                  <div className="service-inner-fourteen-two">
                    <h3>OUR TEAM</h3>
                  </div>
                </div>
                <h2>Meet Our Doctors</h2>
                <p>Our Qualified Professionals</p>
              </div>
            </div>
          </div>
          <div
            className="blog-slider-twelve owl-theme aos"
            data-aos="fade-up"
          >
            <Owlcarousel className="blog-slider-twelve owl-theme aos"
              data-aos="fade-up"{...options}>
              <div className="card blog-inner-fourt-all">
                <div className="card-body blog-inner-fourt-main">
                  <div className="blog-inner-right-fourt">
                    <Link href="/doctors/profile">
                      <div className="blog-inner-right-img">
                        <img
                          src={vetDoctor01}
                          alt="image"
                          className="img-fluid "
                        />
                        <div className="blog-inner-top-content content-pricing">
                          <span>$ 200</span>
                        </div>
                        <div className="blog-inner-top-content">
                          <span>Veterinarian</span>
                        </div>
                      </div>
                    </Link>
                    <h4 className="blog-inner-right-fourt-care">
                      <Link href="/doctors/profile">Dr. Marie Wells</Link>
                    </h4>
                    <ul className="articles-list nav blog-articles-list">
                      <li>
                        <i className="fa fa-location-dot" /> <strong>0.9</strong> min
                        - New York, USA
                      </li>
                    </ul>
                    <div className="blog-list-ratings">
                      <i className="fa-solid fa-star rated" />
                      <i className="fa-solid fa-star rated" />
                      <i className="fa-solid fa-star rated" />
                      <i className="fa-solid fa-star rated" />
                      <i className="fa-solid fa-star" />
                      <span>(20)</span>
                    </div>

                    <div
                      className="blog-btn-sec text-center aos aos-init aos-animate"
                      data-aos="fade-up"
                    >
                      <Link href="/doctors/booking" className="btn btn-view">
                        Consult
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card blog-inner-fourt-all">
                <div className="card-body blog-inner-fourt-main">
                  <div className="blog-inner-right-fourt">
                    <Link href="/doctors/profile">
                      <div className="blog-inner-right-img">
                        <img
                          src={vetDoctor02}
                          alt="image"
                          className="img-fluid "
                        />
                        <div className="blog-inner-top-content content-pricing">
                          <span>$ 150</span>
                        </div>
                        <div className="blog-inner-top-content">
                          <span>Pet Care Specialist</span>
                        </div>
                      </div>
                    </Link>
                    <h4 className="blog-inner-right-fourt-care">
                      <Link href="/doctors/profile">Dr. Justin Parker</Link>
                    </h4>
                    <ul className="articles-list nav blog-articles-list">
                      <li>
                        <i className="fa fa-location-dot" /> <strong>2</strong> hrs -
                        Chicago, USA
                      </li>
                    </ul>
                    <div className="blog-list-ratings">
                      <i className="fa-solid fa-star rated" />
                      <i className="fa-solid fa-star rated" />
                      <i className="fa-solid fa-star rated" />
                      <i className="fa-solid fa-star rated" />
                      <i className="fa-solid fa-star" />
                      <span>(22)</span>
                    </div>

                    <div
                      className="blog-btn-sec text-center aos aos-init aos-animate"
                      data-aos="fade-up"
                    >
                      <Link href="/doctors/booking" className="btn btn-view">
                        Consult
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card blog-inner-fourt-all">
                <div className="card-body blog-inner-fourt-main">
                  <div className="blog-inner-right-fourt">
                    <Link href="/doctors/profile">
                      <div className="blog-inner-right-img">
                        <img
                          src={vetDoctor03}
                          alt="image"
                          className="img-fluid "
                        />
                        <div className="blog-inner-top-content content-pricing">
                          <span>$ 110</span>
                        </div>
                        <div className="blog-inner-top-content">
                          <span>Veterinarian</span>
                        </div>
                      </div>
                    </Link>
                    <h4 className="blog-inner-right-fourt-care">
                      <Link href="/doctors/profile">Dr. Pamela Curtis</Link>
                    </h4>
                    <ul className="articles-list nav blog-articles-list">
                      <li>
                        <i className="fa fa-location-dot" /> <strong>0.8</strong> min
                        - Sandiago, USA
                      </li>
                    </ul>
                    <div className="blog-list-ratings">
                      <i className="fa-solid fa-star rated" />
                      <i className="fa-solid fa-star rated" />
                      <i className="fa-solid fa-star rated" />
                      <i className="fa-solid fa-star rated" />
                      <i className="fa-solid fa-star" />
                      <span>(30)</span>
                    </div>

                    <div
                      className="blog-btn-sec text-center aos aos-init aos-animate"
                      data-aos="fade-up"
                    >
                      <Link href="/doctors/booking" className="btn btn-view">
                        Consult
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card blog-inner-fourt-all">
                <div className="card-body blog-inner-fourt-main">
                  <div className="blog-inner-right-fourt">
                    <Link href="/doctors/profile">
                      <div className="blog-inner-right-img">
                        <img
                          src={vetDoctor04}
                          alt="image"
                          className="img-fluid "
                        />
                        <div className="blog-inner-top-content content-pricing">
                          <span>$ 50</span>
                        </div>
                        <div className="blog-inner-top-content">
                          <span>Veterinarian</span>
                        </div>
                      </div>
                    </Link>
                    <h4 className="blog-inner-right-fourt-care">
                      <Link href="/doctors/profile">Dr.Ronald Jacobs</Link>
                    </h4>
                    <ul className="articles-list nav blog-articles-list">
                      <li>
                        <i className="fa fa-location-dot" /> <strong>10</strong> min -
                        Texas, USA
                      </li>
                    </ul>
                    <div className="blog-list-ratings">
                      <i className="fa-solid fa-star rated" />
                      <i className="fa-solid fa-star rated" />
                      <i className="fa-solid fa-star rated" />
                      <i className="fa-solid fa-star rated" />
                      <i className="fa-solid fa-star" />
                      <span>(45)</span>
                    </div>

                    <div
                      className="blog-btn-sec text-center aos aos-init aos-animate"
                      data-aos="fade-up"
                    >
                      <Link href="/doctors/booking" className="btn btn-view">
                        Consult
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card blog-inner-fourt-all">
                <div className="card-body blog-inner-fourt-main">
                  <div className="blog-inner-right-fourt">
                    <Link href="/doctors/profile">
                      <div className="blog-inner-right-img">
                        <img
                          src={vetDoctor02}
                          alt="image"
                          className="img-fluid "
                        />
                        <div className="blog-inner-top-content content-pricing">
                          <span>$ 200</span>
                        </div>
                        <div className="blog-inner-top-content">
                          <span>Veterinarian</span>
                        </div>
                      </div>
                    </Link>
                    <h4 className="blog-inner-right-fourt-care">
                      <Link href="/doctors/profile">Dr. Marie Wells</Link>
                    </h4>
                    <ul className="articles-list nav blog-articles-list">
                      <li>
                        <i className="fa fa-location-dot" /> <strong>0.9</strong> min
                        - New York, USA
                      </li>
                    </ul>
                    <div className="blog-list-ratings">
                      <i className="fa-solid fa-star rated" />
                      <i className="fa-solid fa-star rated" />
                      <i className="fa-solid fa-star rated" />
                      <i className="fa-solid fa-star rated" />
                      <i className="fa-solid fa-star" />
                      <span>(20)</span>
                    </div>
                    <div
                      className="blog-btn-sec text-center aos aos-init aos-animate"
                      data-aos="fade-up"
                    >
                      <Link href="/doctors/booking" className="btn btn-view">
                        Consult
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Owlcarousel>
          </div>
          <div className="owl-nav slide-nav-16 text-end nav-control" />
          <div
            className="blog-btn-sec text-center aos aos-init aos-animate"
            data-aos="fade-up"
          >
            <Link href="search" className="btn btn-view">
              See All Doctors
            </Link>
          </div>
        </div>
      </div>
    </Fragment>
  )
});

export default OurDoctors;