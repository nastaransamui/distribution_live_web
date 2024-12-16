/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import useScssVar from '@/hooks/useScssVar'
import { servicesixteenicon, treatment1, treatment2, treatment3, treatment4 } from '../../../public/assets/imagepath';

const OwlCarousel = dynamic(() => import(`react-owl-carousel`), { ssr: false });


const TreatmentSection: FC = (() => {
  const { muiVar } = useScssVar();
  const settings = {
    items: 4,
    loop: true,
    margin: 15,
    dots: true,
    dotData: true,
    callbacks: true,
    onInitialized: () => {
      $('.owl-carousel').each(function () {
        // Find each set of dots in this carousel
        $(this).find('.owl-dots').each(function (index) {
          // Add aria-label to the dots container
          $(this).attr('aria-label', index + 1);

          // Add aria-label to each dot button
          $(this).find('.owl-dot').each(function (dotIndex) {
            $(this).attr('aria-label', `Slide ${dotIndex + 1}`);
          });
        });
      });
    },
    nav: true,
    navContainer: ".slide-nav-1",
    navText: [
      '<i class="fas fa-chevron-left custom-arrow"></i>',
      '<i class="fas fa-chevron-right custom-arrow"></i>',
    ],

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
        items: 4
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
  };
  return (
    <Fragment>
      <div className="treatment-section-sixteen" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-header-sixteen text-center">
                <p>OUr services</p>
                <h2>Choose a treatment</h2>
              </div>
            </div>
          </div>
          <div className=" treatment-sixteen-slider owl-theme">
            <OwlCarousel {...settings}>
              <div className="item item-sixteen">
                <div className="doctor-profile-widget">
                  <div className="doc-pro-img">
                    <Link href="/doctors/search" aria-label='search doctor'>
                      <div className="doctor-profile-img">
                        <img src={treatment1} className="img-fluid" alt="" />
                      </div>
                    </Link>
                    <div className="doctor-amount">
                      <span>Face Lift</span>
                    </div>
                  </div>
                  <div className="doc-content">
                    <div className="doc-pro-info">
                      <div className="doc-pro-name">
                        <Link href="/doctors/search" aria-label='search doctor'>
                          Barbara L. Williams
                        </Link>
                        <p>Aesthetic Surgery</p>
                      </div>
                      <div className="reviews-ratings">
                        <p>
                          <span>
                            <i className="fas fa-star" /> 4.5
                          </span>{" "}
                          (35)
                        </p>
                      </div>
                    </div>
                    <div className="doc-pro-location">
                      <p>
                        <i className="feather-map-pin" /> Newyork, USA
                      </p>
                    </div>
                  </div>
                  <div
                    className="blog-btn-sec text-center aos aos-init aos-animate"
                    data-aos="fade-up"
                  >
                    <Link href="/doctors/search" aria-label='search doctor' className="btn btn-view" style={{ minWidth: '100%', }}>
                      Book
                    </Link>
                  </div>
                </div>
              </div>
              <div className="item item-sixteen">
                <div className="doctor-profile-widget">
                  <div className="doc-pro-img">
                    <Link href="/doctors/search" aria-label='search doctor'>
                      <div className="doctor-profile-img">
                        <img src={treatment2} className="img-fluid" alt="" />
                      </div>
                    </Link>
                    <div className="doctor-amount">
                      <span>Implant</span>
                    </div>
                  </div>
                  <div className="doc-content">
                    <div className="doc-pro-info">
                      <div className="doc-pro-name">
                        <Link href="/doctors/search" aria-label='search doctor'>James L. George</Link>
                        <p>Cardiology</p>
                      </div>
                      <div className="reviews-ratings">
                        <p>
                          <span>
                            <i className="fas fa-star" /> 4.5
                          </span>{" "}
                          (35)
                        </p>
                      </div>
                    </div>
                    <div className="doc-pro-location">
                      <p>
                        <i className="feather-map-pin" /> Mexico, USA
                      </p>
                    </div>
                  </div>
                  <div
                    className="blog-btn-sec text-center aos aos-init aos-animate"
                    data-aos="fade-up"
                  >
                    <Link href="/doctors/search" aria-label='search doctor' className="btn btn-view" style={{ minWidth: '100%', }}>
                      Book
                    </Link>
                  </div>
                </div>
              </div>
              <div className="item item-sixteen">
                <div className="doctor-profile-widget">
                  <div className="doc-pro-img">
                    <Link href="/doctors/search" aria-label='search doctor'>
                      <div className="doctor-profile-img">
                        <img src={treatment3} className="img-fluid" alt="" />
                      </div>
                    </Link>
                    <div className="doctor-amount">
                      <span>Blearoplasty</span>
                    </div>
                  </div>
                  <div className="doc-content">
                    <div className="doc-pro-info">
                      <div className="doc-pro-name">
                        <Link href="/doctors/search" aria-label='search doctor'>Matthew R. Paul</Link>
                        <p>Aesthetic Surgery</p>
                      </div>
                      <div className="reviews-ratings">
                        <p>
                          <span>
                            <i className="fas fa-star" /> 4.4
                          </span>{" "}
                          (65)
                        </p>
                      </div>
                    </div>
                    <div className="doc-pro-location">
                      <p>
                        <i className="feather-map-pin" /> Mexico, USA
                      </p>
                    </div>
                  </div>
                  <div
                    className="blog-btn-sec text-center aos aos-init aos-animate"
                    data-aos="fade-up"
                  >
                    <Link href="/doctors/search" aria-label='search doctor' className="btn btn-view" style={{ minWidth: '100%', }}>
                      Book
                    </Link>
                  </div>
                </div>
              </div>
              <div className="item item-sixteen">
                <div className="doctor-profile-widget">
                  <div className="doc-pro-img">
                    <Link href="/doctors/search" aria-label='search doctor'>
                      <div className="doctor-profile-img">
                        <img src={treatment4} className="img-fluid" alt="" />
                      </div>
                    </Link>
                    <div className="doctor-amount">
                      <span>Tummy Tuck</span>
                    </div>
                  </div>
                  <div className="doc-content">
                    <div className="doc-pro-info">
                      <div className="doc-pro-name">
                        <Link href="/doctors/search" aria-label='search doctor'>Carolina F. Paul</Link>
                        <p>Aesthetic Surgery</p>
                      </div>
                      <div className="reviews-ratings">
                        <p>
                          <span>
                            <i className="fas fa-star" /> 4.0
                          </span>{" "}
                          (15)
                        </p>
                      </div>
                    </div>
                    <div className="doc-pro-location">
                      <p>
                        <i className="feather-map-pin" /> Log Angels, USA
                      </p>
                    </div>
                  </div>
                  <div
                    className="blog-btn-sec text-center aos aos-init aos-animate"
                    data-aos="fade-up"
                  >
                    <Link href="/doctors/search" aria-label='search doctor' className="btn btn-view" style={{ minWidth: '100%', }}>
                      Book
                    </Link>
                  </div>
                </div>
              </div>
              <div className="item item-sixteen">
                <div className="doctor-profile-widget">
                  <div className="doc-pro-img">
                    <Link href="/doctors/search" aria-label='search doctor'>
                      <div className="doctor-profile-img">
                        <img src={treatment3} className="img-fluid" alt="" />
                      </div>
                    </Link>
                    <div className="doctor-amount">
                      <span>Blearoplasty</span>
                    </div>
                  </div>
                  <div className="doc-content">
                    <div className="doc-pro-info">
                      <div className="doc-pro-name">
                        <Link href="/doctors/search" aria-label='search doctor'>Matthew R. Paul</Link>
                        <p>Aesthetic Surgery</p>
                      </div>
                      <div className="reviews-ratings">
                        <p>
                          <span>
                            <i className="fas fa-star" /> 4.4
                          </span>{" "}
                          (65)
                        </p>
                      </div>
                    </div>
                    <div className="doc-pro-location">
                      <p>
                        <i className="feather-map-pin" /> Mexico, USA
                      </p>
                    </div>
                  </div>
                  <div
                    className="blog-btn-sec text-center aos aos-init aos-animate"
                    data-aos="fade-up"
                  >
                    <Link href="/doctors/search" aria-label='search doctor' className="btn btn-view" style={{ minWidth: '100%', }}>
                      Book
                    </Link>
                  </div>
                </div>
              </div>
            </OwlCarousel>
          </div>
        </div>
        <div className="service-sixteen-icontwo  imgColorPrimary">
          <img src={servicesixteenicon} alt="" />
        </div>
      </div>
    </Fragment>
  )
});

export default TreatmentSection;