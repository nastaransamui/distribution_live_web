/* eslint-disable @next/next/no-img-element */
import { Fragment, FC } from "react";
import useScssVar from "@/hooks/useScssVar";
import dynamic from 'next/dynamic'
import Link from 'next/link';
import { useTheme } from "@mui/material";
import { BlogWrap01, BlogWrap02, BlogWrap03, BlogWrap04, IMG01, IMG02, IMG03, IMG04 } from "@/public/assets/imagepath";
const OwlCarousel = dynamic(() => import('react-owl-carousel'), {
  ssr: false,
})



const BlogNews: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme()
  const blog = {
    loop: true,
    margin: 15,
    dots: false,
    nav: true,
    navContainer: '.slide-nav-4',
    navText: ['<i class="fas fa-chevron-left custom-arrow"></i>', '<i class="fas fa-chevron-right custom-arrow"></i>'],
    navElement: "button  aria-labelledby='slide-nav-1' aria-label='slide-nav-1'",
    autoplay: false,
    infinite: "true",
    slidestoshow: 4,
    slidestoscroll: 1,
    rtl: "true",
    responsive: {
      '1200': {
        items: 3
      },
      '992': {
        items: 3
      },
      '800': {
        items: 3
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
      <section className="our-blog-section" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="section-heading aos" data-aos="fade-up">
                <h2>Blogs and News</h2>
                <p>Read Professional Articles and Latest Articles</p>
              </div>
            </div>
            <div className="col-md-6 text-end aos" data-aos="fade-up">
              <div className="owl-nav slide-nav-4 text-end nav-control" />
            </div>
          </div>
          <div className="blogs owl-theme aos" data-aos="fade-up">
            <OwlCarousel {...blog}>
              <div className="item">
                <div className="our-blogs">
                  <div className="blogs-img">
                    <Link href="/blog/blog-details" aria-label="blogs">
                      <img src={BlogWrap01} className="img-fluid" alt="" />
                    </Link>
                    <div className="blogs-overlay d-flex">
                      <img src={IMG01} className="img-fluid" alt="" />
                      <span className="blogs-writter">Dr. Ruby Perrin</span>
                    </div>
                  </div>
                  <div className="blogs-info">
                    <span>Urology</span>
                    <Link href="/blog/blog-details" aria-label="blogs"><h3>Health care – Making your clinic painless visit?</h3></Link>
                    <p>Lorem ipsum dolor sit amet, consectetur em adipiscing elit, sed do eiusmod tempor.</p>
                    <span className="blogs-time"><i className="far fa-clock" /> 3 Dec 2021</span>
                  </div>
                  <div className="blogs-nav">
                    <Link href="/blog/blog-details" aria-label="blogs" className="blogs-btn">Full Article</Link>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="our-blogs">
                  <div className="blogs-img">
                    <Link href="/blog/blog-details" aria-label="blogs">
                      <img src={BlogWrap02} className="img-fluid" alt="" />
                    </Link>
                    <div className="blogs-overlay d-flex">
                      <img src={IMG02} className="img-fluid" alt="" />
                      <span className="blogs-writter">Dr. Ruby Perrin</span>
                    </div>
                  </div>
                  <div className="blogs-info">
                    <span>Neurology</span>
                    <Link href="/blog/blog-details" aria-label="blogs"><h3>What are the benefits of Online Doctor Booking?</h3></Link>
                    <p>Lorem ipsum dolor sit amet, consectetur em adipiscing elit, sed do eiusmod tempor.</p>
                    <span className="blogs-time"><i className="far fa-clock" /> 3 Dec 2021</span>
                  </div>
                  <div className="blogs-nav">
                    <Link href="/blog/blog-details" aria-label="blogs" className="blogs-btn">Full Article</Link>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="our-blogs">
                  <div className="blogs-img">
                    <Link href="/blog/blog-details" aria-label="blogs">
                      <img src={BlogWrap03} className="img-fluid" alt="" />
                    </Link>
                    <div className="blogs-overlay d-flex">
                      <img src={IMG03} className="img-fluid" alt="" />
                      <span className="blogs-writter">Dr. Ruby Perrin</span>
                    </div>
                  </div>
                  <div className="blogs-info">
                    <span>Orthopedic</span>
                    <Link href="/blog/blog-details" aria-label="blogs"><h3>Benefits of consulting with an Online Doctor</h3></Link>
                    <p>Lorem ipsum dolor sit amet, consectetur em adipiscing elit, sed do eiusmod tempor.</p>
                    <span className="blogs-time"><i className="far fa-clock" /> 3 Dec 2021</span>
                  </div>
                  <div className="blogs-nav">
                    <Link href="/blog/blog-details" aria-label="blogs" className="blogs-btn">Full Article</Link>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="our-blogs">
                  <div className="blogs-img">
                    <Link href="/blog/blog-details" aria-label="blogs">
                      <img src={BlogWrap04} className="img-fluid" alt="" />
                    </Link>
                    <div className="blogs-overlay d-flex">
                      <img src={IMG04} className="img-fluid" alt="" />
                      <span className="blogs-writter">Dr. Ruby Perrin</span>
                    </div>
                  </div>
                  <div className="blogs-info">
                    <span>Cardiologist</span>
                    <Link href="/blog/blog-details" aria-label="blogs"><h3>5 Great reasons to use an Online Doctor</h3></Link>
                    <p>Lorem ipsum dolor sit amet, consectetur em adipiscing elit, sed do eiusmod tempor.</p>
                    <span className="blogs-time"><i className="far fa-clock" /> 3 Dec 2021</span>
                  </div>
                  <div className="blogs-nav">
                    <Link href="/blog/blog-details" aria-label="blogs" className="blogs-btn">Full Article</Link>
                  </div>
                </div>
              </div>
            </OwlCarousel>
          </div>
        </div>
      </section>
    </Fragment>
  )
})

export default BlogNews;