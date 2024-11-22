/* eslint-disable @next/next/no-img-element */
import React, { FC, Fragment } from "react";
import Link from "next/link";
import FeatherIcon from 'feather-icons-react';
import { useTheme } from "@mui/material";
import useScssVar from "@/hooks/useScssVar";
import Button from "@mui/material/Button";
import { BlogIMG11, BlogIMG12, BlogIMG13, BlogIMG14 } from "@/public/assets/imagepath";


const LatestArticle: FC = (() => {

  const theme = useTheme()
  const { muiVar } = useScssVar();
  return (
    <Fragment>
      <section className="articles-section" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-12 aos" data-aos="fade-up">
              <div className="section-header-one text-center">
                <h2 className="section-title imgColorPrimary">Latest Articles</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 col-md-6 d-flex aos" data-aos="fade-up">
              <div className="articles-grid w-100">
                <div className="articles-info">
                  <div className="articles-left">
                    <Link href="/blog/blog-details" aria-label="blog-details">
                      <div className="articles-img">
                        <img
                          src={BlogIMG11}
                          className="img-fluid"
                          alt=""
                        />
                      </div>
                    </Link>
                  </div>
                  <div className="articles-right">
                    <div className="articles-content">
                      <ul className="articles-list nav">
                        <li>
                          <i><FeatherIcon icon="user" /></i> John Doe
                        </li>
                        <li>
                          <i><FeatherIcon icon="calendar" /></i> 13 Aug, 2023
                        </li>
                      </ul>
                      <h3>
                        <Link href="/blog/blog-details" aria-label="blog-details">
                          Making your clinic painless visit?
                        </Link>
                      </h3>
                      <p>
                        Sed perspiciatis unde omnis iste natus error sit voluptatem
                        accusantium{" "}
                      </p>
                      <div className="form-search-btn aos" data-aos="fade-up" style={{ display: 'flex' }}>
                        <Button className="btn" onClick={(e) => e.preventDefault()}>
                          Read More
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 d-flex aos" data-aos="fade-up">
              <div className="articles-grid w-100">
                <div className="articles-info">
                  <div className="articles-left">
                    <Link href="/blog/blog-details" aria-label="blog-details">
                      <div className="articles-img">
                        <img
                          src={BlogIMG12}
                          className="img-fluid"
                          alt=""
                        />
                      </div>
                    </Link>
                  </div>
                  <div className="articles-right">
                    <div className="articles-content">
                      <ul className="articles-list nav">
                        <li>
                          <i><FeatherIcon icon="user" /></i> Darren Elder
                        </li>
                        <li>
                          <i ><FeatherIcon icon="calendar" /></i> 10 Sep, 2023
                        </li>
                      </ul>
                      <h4>
                        <Link href="/blog/blog-details" aria-label="blog-details">
                          What are the benefits of Online Doctor Booking?
                        </Link>
                      </h4>
                      <p>
                        Sed perspiciatis unde omnis iste natus error sit voluptatem
                        accusantium{" "}
                      </p>
                      <div className="form-search-btn aos" data-aos="fade-up" style={{ display: 'flex' }}>
                        <Button className="btn" onClick={(e) => e.preventDefault()}>
                          Read More
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 d-flex aos" data-aos="fade-up">
              <div className="articles-grid w-100">
                <div className="articles-info">
                  <div className="articles-left">
                    <Link href="/blog/blog-details" aria-label="blog-details">
                      <div className="articles-img">
                        <img
                          src={BlogIMG13}
                          className="img-fluid"
                          alt=""
                        />
                      </div>
                    </Link>
                  </div>
                  <div className="articles-right">
                    <div className="articles-content">
                      <ul className="articles-list nav">
                        <li>
                          <i ><FeatherIcon icon="user" /></i> Ruby Perrin
                        </li>
                        <li>
                          <i ><FeatherIcon icon="calendar" /></i> 30 Oct, 2023
                        </li>
                      </ul>
                      <h4>
                        <Link href="/blog/blog-details" aria-label="blog-details">
                          Benefits of consulting with an Online Doctor
                        </Link>
                      </h4>
                      <p>
                        Sed perspiciatis unde omnis iste natus error sit voluptatem
                        accusantium{" "}
                      </p>
                      <div className="form-search-btn aos" data-aos="fade-up" style={{ display: 'flex' }}>
                        <Button className="btn" onClick={(e) => e.preventDefault()}>
                          Read More
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 d-flex aos" data-aos="fade-up">
              <div className="articles-grid w-100">
                <div className="articles-info">
                  <div className="articles-left">
                    <Link href="/blog/blog-details" aria-label="blog-details">
                      <div className="articles-img">
                        <img
                          src={BlogIMG14}
                          className="img-fluid"
                          alt=""
                        />
                      </div>
                    </Link>
                  </div>
                  <div className="articles-right">
                    <div className="articles-content">
                      <ul className="articles-list nav">
                        <li>
                          <i  ><FeatherIcon icon="user" /></i> Sofia Brient
                        </li>
                        <li>
                          <i ><FeatherIcon icon="calendar" /></i> 08 Nov, 2023
                        </li>
                      </ul>
                      <h4>
                        <Link href="/blog/blog-details" aria-label="blog-details">
                          5 Great reasons to use an Online Doctor
                        </Link>
                      </h4>
                      <p>
                        Sed perspiciatis unde omnis iste natus error sit voluptatem
                        accusantium{" "}
                      </p>
                      <div className="form-search-btn aos" data-aos="fade-up" style={{ display: 'flex' }}>
                        <Button className="btn" onClick={(e) => e.preventDefault()}>
                          Read More
                        </Button>
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
})

export default LatestArticle;