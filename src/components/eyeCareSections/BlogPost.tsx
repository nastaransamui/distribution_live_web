/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useTheme } from '@mui/material';
import { EyeIconSvg } from '../../../public/assets/images/icons/IconsSvgs';
import { DoctThumb1_small, DoctThumb10, DoctThumb2, DoctThumb8, DoctThumb9, EyeBlog01, EyeBlog02, EyeBlog03, EyeBlog04 } from '@/public/assets/imagepath';
const OwlCarousel = dynamic(() => import('react-owl-carousel'), {
  ssr: false,
})

const BlogPost: FC = (() => {

  const { muiVar } = useScssVar();
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
  return (
    <Fragment>
      <section className="our-blog-section eye-blog" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-12 aos" data-aos="fade-up">
              <div className="section-heading text-center sec-heading-eye">
                <EyeIconSvg />
                <h2>
                  <span>Blog</span> Post
                </h2>
                <p>The Great Place Of Eyecare Hospital Center</p>
              </div>
            </div>
          </div>
          <div className="eye-blogslider owl-them aos" data-aos="fade-up" >
            <OwlCarousel {...doctersettings}>
              <div className="item">
                <div className="our-blogs">
                  <div className="blogs-img">
                    <Link href="/blog/blog-details" aria-label='blog post'>
                      <img
                        src={EyeBlog01}
                        alt=""
                        className="img-fluid blog-inner-img"
                      />
                    </Link>
                    <div className="blogs-overlay">
                      <div className="blog-name">
                        <img
                          src={DoctThumb1_small}
                          alt=""
                          className="img-fluid"
                        />
                        <div>
                          <Link href="#">Deirdre Carolyn</Link>
                          <p>04-April-2023</p>
                        </div>
                      </div>
                      <span className="blog-cat">Orthoptics</span>
                    </div>
                  </div>
                  <div className="blogs-info">
                    <h3>
                      <Link href="/blog/blog-details" aria-label='blog post'>
                        Lorem Ipsum is simply dummy text of the printing?
                      </Link>
                    </h3>
                    <p>
                      It is a long established fact that a reader will be distracted by
                      the readable content
                    </p>
                    <Link href="/blog/blog-details" aria-label='blog post' className="blogs-btn">
                      Blog post
                      <i className="fa-solid fa-chevron-right" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="our-blogs">
                  <div className="blogs-img">
                    <Link href="/blog/blog-details" aria-label='blog post'>
                      <img
                        src={EyeBlog02}
                        alt=""
                        className="img-fluid blog-inner-img"
                      />
                    </Link>
                    <div className="blogs-overlay">
                      <div className="blog-name">
                        <img
                          src={DoctThumb2}
                          alt=""
                          className="img-fluid"
                        />
                        <div>
                          <Link href="#">Jessica</Link>
                          <p>03-April-2023</p>
                        </div>
                      </div>
                      <span className="blog-cat">Glaucoma</span>
                    </div>
                  </div>
                  <div className="blogs-info">
                    <h3>
                      <Link href="/blog/blog-details" aria-label='blog post'>
                        It is a long established fact that a reader will be distracted
                      </Link>
                    </h3>
                    <p>Lorem Ipsum is simply dummy text of the printing</p>
                    <Link href="/blog/blog-details" aria-label='blog post' className="blogs-btn">
                      Blog post
                      <i className="fa-solid fa-chevron-right" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="our-blogs">
                  <div className="blogs-img">
                    <Link href="/blog/blog-details" aria-label='blog post'>
                      <img
                        src={EyeBlog03}
                        alt=""
                        className="img-fluid blog-inner-img"
                      />
                    </Link>
                    <div className="blogs-overlay">
                      <div className="blog-name">
                        <img
                          src={DoctThumb8}
                          alt=""
                          className="img-fluid"
                        />
                        <div>
                          <Link href="#">Christopher</Link>
                          <p>06-April-2023</p>
                        </div>
                      </div>
                      <span className="blog-cat">Corneal Ulcer </span>
                    </div>
                  </div>
                  <div className="blogs-info">
                    <h3>
                      <Link href="/blog/blog-details" aria-label='blog post'>
                        Contrary to popular belief, Lorem Ipsum is not simply random
                        text
                      </Link>
                    </h3>
                    <p>It has roots in a piece of classical Latin literature</p>
                    <Link href="/blog/blog-details" aria-label='blog post' className="blogs-btn">
                      Blog post
                      <i className="fa-solid fa-chevron-right" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="our-blogs">
                  <div className="blogs-img">
                    <Link href="/blog/blog-details" aria-label='blog post'>
                      <img
                        src={EyeBlog04}
                        alt=""
                        className="img-fluid blog-inner-img"
                      />
                    </Link>
                    <div className="blogs-overlay">
                      <div className="blog-name">
                        <img
                          src={DoctThumb9}
                          alt=""
                          className="img-fluid"
                        />
                        <div>
                          <Link href="#">Lily Olivia</Link>
                          <p>04-April-2023</p>
                        </div>
                      </div>
                      <span className="blog-cat">Keratoconus</span>
                    </div>
                  </div>
                  <div className="blogs-info">
                    <Link href="/blog/blog-details" aria-label='blog post'>
                      <h3>There are many variations of passages</h3>
                    </Link>
                    <p>
                      If you are going to use a passage of Lorem Ipsum, you need to be
                      sure there isn t anything
                    </p>
                    <Link href="/blog/blog-details" aria-label='blog post' className="blogs-btn">
                      Blog post
                      <i className="fa-solid fa-chevron-right" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="our-blogs">
                  <div className="blogs-img">
                    <Link href="/blog/blog-details" aria-label='blog post'>
                      <img
                        src={EyeBlog03}
                        alt=""
                        className="img-fluid blog-inner-img"
                      />
                    </Link>
                    <div className="blogs-overlay">
                      <div className="blog-name">
                        <img
                          src={DoctThumb10}
                          alt=""
                          className="img-fluid"
                        />
                        <div>
                          <Link href="#">John Doe</Link>
                          <p>01-April-2023</p>
                        </div>
                      </div>
                      <span className="blog-cat">Orthoptics</span>
                    </div>
                  </div>
                  <div className="blogs-info">
                    <Link href="/blog/blog-details" aria-label='blog post'>
                      <h3>There are many variations of passages</h3>
                    </Link>
                    <p>
                      If you are going to use a passage of Lorem Ipsum, you need to be
                      sure there isnt anything
                    </p>
                    <Link href="/blog/blog-details" aria-label='blog post' className="blogs-btn">
                      Blog post
                      <i className="fa-solid fa-chevron-right" />
                    </Link>
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

export default BlogPost;