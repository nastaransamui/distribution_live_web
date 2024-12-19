/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import { Blog1, Blog2, Blog3 } from '../../../public/assets/imagepath';

const Blog: FC = (() => {

  const { muiVar } = useScssVar();

  return (
    <Fragment>
      <section className="latest-blog" style={muiVar}>
        <div className="container">
          <div className="section-header-three text-center">
            <h2>Our Latest Blogs</h2>
            <p className="sub-title" style={{ color: muiVar['--color'] as string }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
          <div className="row">
            <div className="col-md-6 col-lg-4 aos" data-aos="fade-up">
              <div className="blog-wrap">
                <div className="image-holder">
                  <Link href="/blog/blog-details">
                    <img className="img-fluid" src={Blog1} alt="Post Image" />
                  </Link>
                </div>
                <div className="blog-wrap-body">
                  <h3><Link href="/blog/blog-details">In this hospital there are special surgeons</Link></h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                    ut labore et..</p>
                  <div className="blog-footer">
                    <div className="row row-sm align-items-center">
                      <div className="col-6 text-left">
                        <Link href="/blog/blog-details" className="read-txt" tabIndex={0}>Full Article <i className="fas fa-long-arrow-alt-right" /></Link>
                      </div>
                      <div className="col-6 text-right">
                        <Link href="#" className="cal-txt" tabIndex={0}><i className="far fa-calendar-alt" /> Jan 03, 2020</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 aos" data-aos="fade-up">
              <div className="blog-wrap">
                <div className="image-holder">
                  <Link href="/blog/blog-details">
                    <img className="img-fluid" src={Blog2} alt="Post Image" />
                  </Link>
                </div>
                <div className="blog-wrap-body">
                  <h3><Link href="/blog/blog-details">World AIDS Day, designated on 1 December</Link></h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                    ut labore et..</p>
                  <div className="blog-footer">
                    <div className="row row-sm align-items-center">
                      <div className="col-6 text-left">
                        <Link href="/blog/blog-details" className="read-txt" tabIndex={0}>Full Article <i className="fas fa-long-arrow-alt-right" /></Link>
                      </div>
                      <div className="col-6 text-right">
                        <Link href="#" className="cal-txt" tabIndex={0}><i className="far fa-calendar-alt" /> Jan 03, 2020</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 aos" data-aos="fade-up">
              <div className="blog-wrap">
                <div className="image-holder">
                  <Link href="/blog/blog-details">
                    <img className="img-fluid" src={Blog3} alt="Post Image" />
                  </Link>
                </div>
                <div className="blog-wrap-body">
                  <h3><Link href="/blog/blog-details">More then 80 clinical trials launch to test coronavirus</Link></h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                    ut labore et..</p>
                  <div className="blog-footer">
                    <div className="row row-sm align-items-center">
                      <div className="col-6 text-left">
                        <Link href="/blog/blog-details" className="read-txt" tabIndex={0}>Full Article <i className="fas fa-long-arrow-alt-right" /></Link>
                      </div>
                      <div className="col-6 text-right">
                        <Link href="#" className="cal-txt" tabIndex={0}><i className="far fa-calendar-alt" /> Jan 03, 2020</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default Blog;