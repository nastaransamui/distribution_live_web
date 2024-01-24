/* eslint-disable @next/next/no-img-element */
import { useEffect, Fragment, FC } from "react";
import Link from "next/link";
import AOS from 'aos'
import useScssVar from "@/hooks/useScssVar";
import { useTheme } from "@mui/material";
import { BlogIMG01, BlogIMG02, BlogIMG03, BlogIMG04, IMG01, IMG02, IMG03, IMG04 } from "@/public/assets/imagepath";


const HomeBlog: FC = (() => {
  const theme = useTheme();
  const { muiVar } = useScssVar();
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);

  return (
    <Fragment>
      <section className="section section-blogs" style={muiVar}>
        <div className="container-fluid">
          <div className="section-header text-center aos" >
            <h2>Blogs and News</h2>
            <p className="sub-title">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
          <div className="row blog-grid-row">
            <div className="col-md-6 col-lg-3 col-sm-12">
              <div className="blog grid-blog">
                <div className="blog-image">
                  <Link href="/blog/blog-details"><img className="img-fluid" src={BlogIMG01} alt="Post" /></Link>
                </div>
                <div className="blog-content">
                  <ul className="entry-meta meta-item">
                    <li>
                      <div className="post-author">
                        <Link href="/doctors/profile"><img src={IMG02} alt="Post Author" />
                          <span>Dr. Ruby Perrin</span></Link>
                      </div>
                    </li>
                    <li><i className="far fa-clock"></i> 4 Dec 2019</li>
                  </ul>
                  <h3 className="blog-title">
                    <Link href="/blog/blog-details">Doccure – Making your clinic painless visit?</Link></h3>
                  <p className="mb-0">Lorem ipsum dolor sit amet, consectetur em adipiscing elit, sed do eiusmod tempor.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 col-sm-12">
              <div className="blog grid-blog">
                <div className="blog-image">
                  <Link href="/blog/blog-details"><img className="img-fluid" src={BlogIMG02} alt="Post" /></Link>
                </div>
                <div className="blog-content">
                  <ul className="entry-meta meta-item">
                    <li>
                      <div className="post-author">
                        <Link href="/doctors/profile"><img src={IMG03} alt="Post Author" />
                          <span>Dr. Darren Elder</span></Link>
                      </div>
                    </li>
                    <li><i className="far fa-clock"></i> 3 Dec 2019</li>
                  </ul>
                  <h3 className="blog-title"><Link href="/blog/blog-details">What are the benefits of Online Doctor Booking?</Link></h3>
                  <p className="mb-0">Lorem ipsum dolor sit amet, consectetur em adipiscing elit, sed do eiusmod tempor.</p>
                </div>
              </div>

            </div>
            <div className="col-md-6 col-lg-3 col-sm-12">


              <div className="blog grid-blog">
                <div className="blog-image">
                  <Link href="/blog/blog-details"><img className="img-fluid" src={BlogIMG03} alt="Post" /></Link>
                </div>
                <div className="blog-content">
                  <ul className="entry-meta meta-item">
                    <li>
                      <div className="post-author">
                        <Link href="/doctors/profile"><img src={IMG01} alt="Post Author" />
                          <span>Dr. Deborah Angel</span></Link>
                      </div>
                    </li>
                    <li><i className="far fa-clock"></i> 3 Dec 2019</li>
                  </ul>
                  <h3 className="blog-title"><Link href="/blog/blog-details">Benefits of consulting with an Online Doctor</Link></h3>
                  <p className="mb-0">Lorem ipsum dolor sit amet, consectetur em adipiscing elit, sed do eiusmod tempor.</p>
                </div>
              </div>

            </div>
            <div className="col-md-6 col-lg-3 col-sm-12">


              <div className="blog grid-blog">
                <div className="blog-image">
                  <Link href="/blog/blog-details"><img className="img-fluid" src={BlogIMG04} alt="Post" /></Link>
                </div>
                <div className="blog-content">
                  <ul className="entry-meta meta-item">
                    <li>
                      <div className="post-author">
                        <Link href="/doctors/profile"><img src={IMG04} alt="Post Author" />
                          <span>Dr. Sofia Brient</span></Link>
                      </div>
                    </li>
                    <li><i className="far fa-clock"></i> 2 Dec 2019</li>
                  </ul>
                  <h3 className="blog-title"><Link href="/blog/blog-details">5 Great reasons to use an Online Doctor</Link></h3>
                  <p className="mb-0">Lorem ipsum dolor sit amet, consectetur em adipiscing elit, sed do eiusmod tempor.</p>
                </div>
              </div>


            </div>
          </div>
          <div className="view-all text-center aos" >
            <Link href="#0" className="btn btn-primary">View All</Link>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default HomeBlog;