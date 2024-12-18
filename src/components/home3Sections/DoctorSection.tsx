/* eslint-disable @next/next/no-img-element */
import { Fragment, FC } from "react";
import useScssVar from "@/hooks/useScssVar";
import dynamic from 'next/dynamic'
import Link from 'next/link';
import { useTheme } from "@mui/material";
import { Doc01, Doc02, Doc03, Doc04 } from "@/public/assets/imagepath";
const OwlCarousel = dynamic(() => import('react-owl-carousel'), {
  ssr: false,
})


const DoctorSection: FC = (() => {
  const theme = useTheme();
  const { muiVar } = useScssVar();
  const clinicsettings = {
    items: 4,
    loop: true,
    margin: 15,
    dots: false,
    nav: true,
    navContainer: '.slide-nav-2',
    navText: ['<i class="fas fa-chevron-left custom-arrow"></i>', '<i class="fas fa-chevron-right custom-arrow"></i>'],
    navElement: "button  aria-labelledby='slide-nav-1' aria-label='slide-nav-1'",
    autoplay: false,
    infinite: "true",
    slidestoshow: 3,
    slidestoscroll: 1,
    rtl: "true",
    rows: 1,
    responsive: {
      '1200': {
        items: 4
      },
      '992': {
        items: 3
      },
      '800': {
        items: 3
      },
      '776': {
        items: 3
      },
      '567': {
        items: 1
      },
      '200': {
        items: 1
      }
    }
  };
  return (
    <Fragment>
      <section className="our-doctors-section" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="section-heading aos" data-aos="fade-up">
                <h2>Clinic &amp; Specialities</h2>
                <p>Access to expert physicians and surgeons, advanced technologies and top-quality surgery facilities right here.</p>
              </div>
            </div>
            <div className="col-md-6 text-end aos" data-aos="fade-up">
              <div className="owl-nav slide-nav-2 text-end nav-control" />
            </div>
          </div>
          <div className="our-doctors owl-theme aos" data-aos="fade-up">
            <OwlCarousel {...clinicsettings} >
              <div className="item">
                <div className="our-doctors-card">
                  <div className="doctors-header">
                    <Link href="#" aria-label="our doctor"><img src={Doc01} className="img-fluid" alt="" /></Link>
                    <div className="img-overlay">
                      <span>$20 - $50</span>
                    </div>
                  </div>
                  <div className="doctors-body">
                    <div className="rating">
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <span className="d-inline-block average-ratings">3.5</span>
                    </div>
                    <Link href="/doctors/search" aria-label="our doctor"><h3>Dr. Ruby Perrin</h3></Link>
                    <p>BDS, MDS - Oral &amp; Maxillofacial Surgery</p>
                    <div className="location d-flex">
                      <p><i className="fas fa-map-marker-alt" /> Georgia, USA</p>
                      <p className="ms-auto"><i className="fas fa-user-md" /> 450 Consultations</p>
                    </div>
                    <div className="row row-sm">
                      <div className="col-6">
                        <Link href="/doctors/search" className="btn view-btn" tabIndex={0} aria-label="our doctor">View Profile</Link>
                      </div>
                      <div className="col-6">
                        <Link href="/doctors/search" className="btn book-btn" tabIndex={0} aria-label="our doctor">Book Now</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="our-doctors-card">
                  <div className="doctors-header">
                    <Link href="#" aria-label="our doctor"><img src={Doc02} className="img-fluid" alt="" /></Link>
                    <div className="img-overlay">
                      <span>$20 - $50</span>
                    </div>
                  </div>
                  <div className="doctors-body">
                    <div className="rating">
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <span className="d-inline-block average-ratings">3.5</span>
                    </div>
                    <Link href="/doctors/search" aria-label="our doctor"><h3>Dr. Deborah Angel</h3></Link>
                    <p>MBBS, MD - General Medicine, DNB</p>
                    <div className="location d-flex">
                      <p><i className="fas fa-map-marker-alt" /> Georgia, USA</p>
                      <p className="ms-auto"><i className="fas fa-user-md" /> 450 Consultations</p>
                    </div>
                    <div className="row row-sm">
                      <div className="col-6">
                        <Link href="/doctors/search" className="btn view-btn" tabIndex={0} aria-label="our doctor">View Profile</Link>
                      </div>
                      <div className="col-6">
                        <Link href="/doctors/search" className="btn book-btn" tabIndex={0} aria-label="our doctor">Book Now</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="our-doctors-card">
                  <div className="doctors-header">
                    <Link href="#" aria-label="our doctor"><img src={Doc03} className="img-fluid" alt="" /></Link>
                    <div className="img-overlay">
                      <span>$20 - $50</span>
                    </div>
                  </div>
                  <div className="doctors-body">
                    <div className="rating">
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <span className="d-inline-block average-ratings">3.5</span>
                    </div>
                    <Link href="/doctors/search" aria-label="our doctor"><h3>Dr. Sofia Brient</h3></Link>
                    <p>MBBS, MS - General Surgery, MCh</p>
                    <div className="location d-flex">
                      <p><i className="fas fa-map-marker-alt" /> Georgia, USA</p>
                      <p className="ms-auto"><i className="fas fa-user-md" /> 450 Consultations</p>
                    </div>
                    <div className="row row-sm">
                      <div className="col-6">
                        <Link href="/doctors/search" className="btn view-btn" tabIndex={0} aria-label="our doctor">View Profile</Link>
                      </div>
                      <div className="col-6">
                        <Link href="/doctors/search" className="btn book-btn" tabIndex={0} aria-label="our doctor">Book Now</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="our-doctors-card">
                  <div className="doctors-header">
                    <Link href="#" aria-label="our doctor"><img src={Doc04} className="img-fluid" alt="" /></Link>
                    <div className="img-overlay">
                      <span>$20 - $50</span>
                    </div>
                  </div>
                  <div className="doctors-body">
                    <div className="rating">
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <span className="d-inline-block average-ratings">3.5</span>
                    </div>
                    <Link href="/doctors/search" aria-label="our doctor"><h3>Dr. Darren Elder</h3></Link>
                    <p>BDS, MDS - Oral &amp; Maxillofacial Surgery</p>
                    <div className="location d-flex">
                      <p><i className="fas fa-map-marker-alt" /> Georgia, USA</p>
                      <p className="ms-auto"><i className="fas fa-user-md" /> 450 Consultations</p>
                    </div>
                    <div className="row row-sm">
                      <div className="col-6">
                        <Link href="/doctors/search" className="btn view-btn" tabIndex={0} aria-label="our doctor">View Profile</Link>
                      </div>
                      <div className="col-6">
                        <Link href="/doctors/search" className="btn book-btn" tabIndex={0} aria-label="our doctor">Book Now</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </OwlCarousel>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default DoctorSection