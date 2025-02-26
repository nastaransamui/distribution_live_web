// @ts-nocheck
/* eslint-disable @next/next/no-img-element */
import { Fragment, FC, useEffect } from "react";
import Link from "next/link";
import Slider from "react-slick";
import AOS from 'aos'
import useScssVar from "@/hooks/useScssVar";
import { useTheme } from "@mui/material";
import { Doc01, Doc02, Doc03, Doc04 } from "@/public/assets/imagepath";

const HomeBookDoctor: FC = (() => {
  const { muiVar } = useScssVar();
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);

  const theme = useTheme();

  const settings = {
    width: 400,
    dots: false,

    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerPadding: '0px',
    arrows: true,
    centerMode: true,

    responsive: [
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,

        }
      },
      {
        breakpoint: 993,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,

        }
      }
    ]

  };
  return (
    <Fragment>
      <section className="section section-doctor" style={muiVar}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4">
              <div className="section-header aos">
                <h2>Book Our Doctor</h2>
                <p>Lorem Ipsum is simply dummy text </p>
              </div>
              <div className="about-content aos" >
                <p>It is a long established fact that a reader will be distracted by the readable
                  content of a page when looking at its layout. The point of using Lorem Ipsum.</p>
                <p>web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes</p>
                <Link href="#" >Read More..</Link>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="doctor-slider slider ">
                <Slider {...settings}>
                  <div>
                    <div className="profile-widget">
                      <div className="doc-img">
                        <Link href="/doctors/search">
                          <img className="img-fluid" alt="User" src={Doc01} />
                        </Link>
                        <Link href="#" className="fav-btn">
                          <i className="far fa-bookmark"></i>
                        </Link>
                      </div>
                      <div className="pro-content">
                        <h3 className="title">
                          <Link href="/doctors/search">Ruby Perrin</Link>
                          <i className="fas fa-check-circle verified"></i>
                        </h3>
                        <p className="speciality">MDS - Periodontology and Oral Implantology, BDS</p>
                        <div className="rating">
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <span className="d-inline-block average-rating">(17)</span>
                        </div>
                        <ul className="available-info">
                          <li>
                            <i className="fas fa-map-marker-alt"></i> Florida, USA
                          </li>
                          <li>
                            <i className="far fa-clock"></i> Available on Fri, 22 Mar
                          </li>
                          <li>
                            <i className="far fa-money-bill-alt"></i> $300 - $1000 {" "}
                            <i className="fas fa-info-circle" data-toggle="tooltip" title="Lorem Ipsum"></i>
                          </li>
                        </ul>
                        <div className="row row-sm">
                          <div className="col-6">
                            <Link href="/doctors/search" className="btn view-btn">View Profile</Link>
                          </div>
                          <div className="col-6">
                            <Link href="/doctors/search" className="btn book-btn">Book Now</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="profile-widget">
                      <div className="doc-img">
                        <Link href="/doctors/search">
                          <img className="img-fluid" alt="User" src={Doc02} />
                        </Link>
                        <Link href="#" className="fav-btn">
                          <i className="far fa-bookmark"></i>
                        </Link>
                      </div>
                      <div className="pro-content">
                        <h3 className="title">
                          <Link href="/doctors/search">Darren Elder</Link>
                          <i className="fas fa-check-circle verified"></i>
                        </h3>
                        <p className="speciality">BDS, MDS - Oral & Maxillofacial Surgery</p>
                        <div className="rating">
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star"></i>
                          <span className="d-inline-block average-rating">(35)</span>
                        </div>
                        <ul className="available-info">
                          <li>
                            <i className="fas fa-map-marker-alt"></i> Newyork, USA
                          </li>
                          <li>
                            <i className="far fa-clock"></i> Available on Fri, 22 Mar
                          </li>
                          <li>
                            <i className="far fa-money-bill-alt"></i> $50 - $300{" "}
                            <i className="fas fa-info-circle" data-toggle="tooltip" title="Lorem Ipsum"></i>
                          </li>
                        </ul>
                        <div className="row row-sm">
                          <div className="col-6">
                            <Link href="/doctors/search" className="btn view-btn">View Profile</Link>
                          </div>
                          <div className="col-6">
                            <Link href="/doctors/search" className="btn book-btn">Book Now</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="profile-widget">
                      <div className="doc-img">
                        <Link href="/doctors/search">
                          <img className="img-fluid" alt="User" src={Doc03} />
                        </Link>
                        <Link href="#" className="fav-btn">
                          <i className="far fa-bookmark"></i>
                        </Link>
                      </div>
                      <div className="pro-content">
                        <h3 className="title">
                          <Link href="/doctors/search">Deborah Angel</Link>
                          <i className="fas fa-check-circle verified"></i>
                        </h3>
                        <p className="speciality">MBBS, MD - General Medicine, DNB - Cardiology</p>
                        <div className="rating">
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star"></i>
                          <span className="d-inline-block average-rating">(27)</span>
                        </div>
                        <ul className="available-info">
                          <li>
                            <i className="fas fa-map-marker-alt"></i> Georgia, USA
                          </li>
                          <li>
                            <i className="far fa-clock"></i> Available on Fri, 22 Mar
                          </li>
                          <li>
                            <i className="far fa-money-bill-alt"></i> $100 - $400{" "}
                            <i className="fas fa-info-circle" data-toggle="tooltip" title="Lorem Ipsum"></i>
                          </li>
                        </ul>
                        <div className="row row-sm">
                          <div className="col-6">
                            <Link href="/doctors/search" className="btn view-btn">View Profile</Link>
                          </div>
                          <div className="col-6">
                            <Link href="/doctors/search" className="btn book-btn">Book Now</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="profile-widget">
                      <div className="doc-img">
                        <Link href="/doctors/search">
                          <img className="img-fluid" alt="User" src={Doc04} />
                        </Link>
                        <Link href="#" className="fav-btn">
                          <i className="far fa-bookmark"></i>
                        </Link>
                      </div>
                      <div className="pro-content">
                        <h3 className="title">
                          <Link href="/doctors/search">Sofia Brient</Link>
                          <i className="fas fa-check-circle verified"></i>
                        </h3>
                        <p className="speciality">MBBS, MS - General Surgery, MCh - Urology</p>
                        <div className="rating">
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star"></i>
                          <span className="d-inline-block average-rating">(4)</span>
                        </div>
                        <ul className="available-info">
                          <li>
                            <i className="fas fa-map-marker-alt"></i> Louisiana, USA
                          </li>
                          <li>
                            <i className="far fa-clock"></i> Available on Fri, 22 Mar
                          </li>
                          <li>
                            <i className="far fa-money-bill-alt"></i> $150 - $250{" "}
                            <i className="fas fa-info-circle" data-toggle="tooltip" title="Lorem Ipsum"></i>
                          </li>
                        </ul>
                        <div className="row row-sm">
                          <div className="col-6">
                            <Link href="/doctors/search" className="btn view-btn">View Profile</Link>
                          </div>
                          <div className="col-6">
                            <Link href="/doctors/search" className="btn book-btn">Book Now</Link>
                          </div>
                        </div>
                      </div>
                    </div>



                  </div>

                </Slider>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
})

export default HomeBookDoctor;