/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect } from 'react'
import Link from 'next/link'
import useScssVar from '@/hooks/useScssVar'
import dynamic from 'next/dynamic'
import AOS from 'aos'
import { useTheme } from '@mui/material'
import { DoctThumb10, DoctThumb2, DoctThumb8, DoctThumb9, blog_15, blog_16, blog_17 } from '@/public/assets/imagepath'
const OwlCarousel = dynamic(() => import(`react-owl-carousel`), { ssr: false })


const BlogSection: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);
  const doctersettings = {
    items: 3,
    loop: true,
    margin: 15,
    dots: false,
    nav: true,
    navContainer: '.slide-nav-15',
    navText: ['<i class="fa-solid fa-caret-left "></i>', '<i class="fa-solid fa-caret-right"></i>'],

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
      <div className="blog-section-fourteen" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="section-header-fourteen">
                <div className="service-inner-fourteen">
                  <div className="service-inner-fourteen-one"></div>
                  <div className="service-inner-fourteen-two">
                    <h3>Blog</h3>
                  </div>
                  <div className="service-inner-fourteen-three"></div>
                </div>
                <h2>Our Recent Articles</h2>
              </div>
            </div>
            <div className="col-lg-6 aos" data-aos="fade-up">
              <div className="owl-nav slide-nav-15 text-end nav-control" />
            </div>
          </div>
          <div className="blog-slider-fourteen owl-theme aos" data-aos="fade-up" >
            <OwlCarousel {...doctersettings}>
              <div className="card blog-inner-fourt-all">
                <div className="card-body blog-inner-fourt-main">
                  <div className="blog-inner-right-fourt">
                    <Link href="/blog/blog-details">
                      <div className="blog-inner-right-img">
                        <img
                          src={blog_15}
                          alt="image"
                          className="img-fluid blog-inner-right-inner"
                        />
                        <div className="blog-inner-top-content">
                          <img
                            src={DoctThumb2}
                            alt=""
                            className="me-2"
                          />
                          <span>Dr. Pamila Certis</span>
                        </div>
                      </div>
                    </Link>
                    <Link href="/blog/blog-details" className="blog-inner-right-fourt-care">
                      How To Get Pregnant: Tips to Increas it Affect Fertility
                    </Link>
                    <ul className="articles-list nav blog-articles-list">
                      <li>
                        <i className="feather-calendar" /> 13 Aug, 2023
                      </li>
                      <li>
                        <i className="feather-message-square" /> 68
                      </li>
                      <li>
                        <i className="feather-eye" /> 1.5k
                      </li>
                    </ul>
                    <ul className="articles-list nav blog-articles-list-two">
                      <li>Pregnancy</li>
                      <li>Fertility</li>
                    </ul>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore ad minim veniam,
                      quis magna aliqua.{" "}
                    </p>
                  </div>
                </div>
              </div>
              <div className="card blog-inner-fourt-all">
                <div className="card-body blog-inner-fourt-main">
                  <div className="blog-inner-right-fourt">
                    <Link href="/blog/blog-details">
                      <div className="blog-inner-right-img">
                        <img
                          src={blog_16}
                          alt="image"
                          className="img-fluid blog-inner-right-inner"
                        />
                        <div className="blog-inner-top-content">
                          <img
                            src={DoctThumb8}
                            alt=""
                            className="me-2"
                          />
                          <span>Dr. James Matthew</span>
                        </div>
                      </div>
                    </Link>
                    <Link href="/blog/blog-details" className="blog-inner-right-fourt-care">
                      Flavourful Recipe of Central India to Boost Fertility
                    </Link>
                    <ul className="articles-list nav blog-articles-list">
                      <li>
                        <i className="feather-calendar" /> 13 Apr, 2023
                      </li>
                      <li>
                        <i className="feather-message-square" /> 87
                      </li>
                      <li>
                        <i className="feather-eye" /> 2.5k
                      </li>
                    </ul>
                    <ul className="articles-list nav blog-articles-list-two">
                      <li>Diet</li>
                      <li>Health</li>
                    </ul>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore ad minim veniam,
                      quis magna aliqua.{" "}
                    </p>
                  </div>
                </div>
              </div>
              <div className="card blog-inner-fourt-all">
                <div className="card-body blog-inner-fourt-main">
                  <div className="blog-inner-right-fourt">
                    <Link href="/blog/blog-details">
                      <div className="blog-inner-right-img">
                        <img
                          src={blog_17}
                          alt="image"
                          className="img-fluid blog-inner-right-inner"
                        />
                        <div className="blog-inner-top-content">
                          <img
                            src={DoctThumb9}
                            alt=""
                            className="me-2"
                          />
                          <span>Dr. James Certis</span>
                        </div>
                      </div>
                    </Link>
                    <Link href="/blog/blog-details" className="blog-inner-right-fourt-care">
                      Sperm Morphology – What is it &amp; How Does it Affect Fertility
                    </Link>
                    <ul className="articles-list nav blog-articles-list">
                      <li>
                        <i className="feather-calendar" /> 26 May, 2023
                      </li>
                      <li>
                        <i className="feather-message-square" /> 78
                      </li>
                      <li>
                        <i className="feather-eye" /> 1.6k
                      </li>
                    </ul>
                    <ul className="articles-list nav blog-articles-list-two">
                      <li>Health</li>
                      <li>Fertility</li>
                    </ul>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore ad minim veniam,
                      quis magna aliqua.{" "}
                    </p>
                  </div>
                </div>
              </div>
              <div className="card blog-inner-fourt-all">
                <div className="card-body blog-inner-fourt-main">
                  <div className="blog-inner-right-fourt">
                    <Link href="/blog/blog-details">
                      <div className="blog-inner-right-img">
                        <img
                          src={blog_17}
                          alt="image"
                          className="img-fluid blog-inner-right-inner"
                        />
                        <div className="blog-inner-top-content">
                          <img
                            src={DoctThumb10}
                            alt=""
                            className="me-2"
                          />
                          <span>Dr. Pamila Certis</span>
                        </div>
                      </div>
                    </Link>
                    <Link href="/blog/blog-details" className="blog-inner-right-fourt-care">
                      How To Get Pregnant: Tips to Increas Fertility
                    </Link>
                    <ul className="articles-list nav blog-articles-list">
                      <li>
                        <i className="feather-calendar" /> 13 Aug, 2023
                      </li>
                      <li>
                        <i className="feather-message-square" /> 68
                      </li>
                      <li>
                        <i className="feather-eye" /> 1.5k
                      </li>
                    </ul>
                    <ul className="articles-list nav blog-articles-list-two">
                      <li>Pregnancy</li>
                      <li>Fertility</li>
                    </ul>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore ad minim veniam,
                      quis magna aliqua.{" "}
                    </p>
                  </div>
                </div>
              </div>
            </OwlCarousel>
          </div>
          <div
            className="blog-btn-sec text-center aos aos-init aos-animate"
            data-aos="fade-up"
          >
            <Link href="/doctors" className="btn btn-primary btn-view">
              Read More Articles
            </Link>
          </div>
        </div>
      </div>
    </Fragment>
  )
})

export default BlogSection;