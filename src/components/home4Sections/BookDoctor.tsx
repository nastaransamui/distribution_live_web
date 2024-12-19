/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import { useTheme } from '@mui/material';

import { Doc01, Doc02, Doc03, Doc04, alarm, consult, exper, mapplus } from '../../../public/assets/imagepath';


const BookDoctor: FC = (() => {
  const { muiVar } = useScssVar();

  const theme = useTheme();

  return (
    <Fragment>
      <section className="book-section" style={muiVar}>
        <div className="container">
          <div className="section-header-three text-center">
            <h2>Book Our Best Doctor</h2>
            <p className="sub-title" style={{ color: theme.palette.text.color }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-6 aos" data-aos="fade-up">
              <div className="book-best-doctors">
                <div className="book-header">
                  <Link href="/doctors/search" aria-label='doctors'>
                    <img src={Doc01} alt="" className="img-fluid" />
                  </Link>
                  <div className="img-overlay">
                    <i className="fas fa-star" />
                  </div>
                </div>
                <div className="doctors-body">
                  <div className="inner-section">
                    <span className="float-left">PSICOLOGIST</span>
                    <div className="rating text-right">
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star" />
                      <span className="d-inline-block average-ratings">3.5</span>
                    </div>
                    <Link href="/doctors/search" aria-label='doctors'><h3>Dr. Ruby Perrin</h3></Link>
                    <p>MBBS, MD - General Medicine, DNB - Cardiology</p>
                  </div>
                  <div className="row row-sm loc-details">
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <Link href="#" aria-label='doctors'>
                          <img src={mapplus} alt="" className='img' />
                        </Link>
                        <Link href="#" aria-label='doctors'>
                          <span className="available-info">Location</span>
                          <span className="data-info">Newyork, USA</span>
                        </Link>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <Link href="#" aria-label='doctors'>
                          <img src={alarm} alt="" className='img' />
                        </Link>
                        <Link href="#" aria-label='doctors'>
                          <span className="available-info">Available on</span>
                          <span className="data-info">Fri, 22 March</span>
                        </Link>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <Link href="#" aria-label='doctors'>
                          <img src={consult} alt="" className='img' />
                        </Link>
                        <Link href="#" aria-label='doctors'>
                          <span className="available-info">Consulting</span>
                          <span className="data-info">500+ Patients</span>
                        </Link>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <Link href="#" aria-label='doctors'>
                          <img src={exper} alt="" className='img' />
                        </Link>
                        <Link href="#" aria-label='doctors'>
                          <span className="available-info">EXPERIENCE</span>
                          <span className="data-info">25+ Years</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="row row-sm align-items-center p-3">
                    <div className="col-6">
                      <Link href="/doctors/search" aria-label='doctors' className="amt-txt" tabIndex={0}>$50 - $100</Link>
                    </div>
                    <div className="col-6">
                      <Link href="/doctors/search" aria-label='doctors' className="btn book-btn" tabIndex={0}>Book Now</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 aos" data-aos="fade-up">
              <div className="book-best-doctors">
                <div className="book-header">
                  <Link href="/doctors/search" aria-label='doctors'>
                    <img src={Doc02} alt="" className="img-fluid" />
                  </Link>
                  <div className="img-overlay">
                    <i className="fas fa-star" />
                  </div>
                </div>
                <div className="doctors-body">
                  <div className="inner-section">
                    <span className="float-left">PSICOLOGIST</span>
                    <div className="rating text-right">
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star" />
                      <span className="d-inline-block average-ratings">3.5</span>
                    </div>
                    <Link href="/doctors/search" aria-label='doctors'><h3>Dr. Darren Elder</h3></Link>
                    <p>MBBS, MD - General Medicine, DNB - Cardiology</p>
                  </div>
                  <div className="row row-sm loc-details">
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <Link href="#" aria-label='doctors'>
                          <img src={mapplus} alt='' className='img' />
                        </Link>
                        <Link href="#" aria-label='doctors'>
                          <span className="available-info">Location</span>
                          <span className="data-info">Newyork, USA</span>
                        </Link>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <Link href="#" aria-label='doctors'>
                          <img src={alarm} alt='' className='img' />
                        </Link>
                        <Link href="#" aria-label='doctors'>
                          <span className="available-info">Available on</span>
                          <span className="data-info">Fri, 22 March</span>
                        </Link>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <Link href="#" aria-label='doctors'>
                          <img src={consult} alt='' className='img' />
                        </Link>
                        <Link href="#" aria-label='doctors'>
                          <span className="available-info">Consulting</span>
                          <span className="data-info">500+ Patients</span>
                        </Link>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <Link href="#" aria-label='doctors'>
                          <img src={exper} alt='' className='img' />
                        </Link>
                        <Link href="#" aria-label='doctors'>
                          <span className="available-info">EXPERIENCE</span>
                          <span className="data-info">25+ Years</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="row row-sm align-items-center p-3">
                    <div className="col-6">
                      <Link href="/doctors/search" aria-label='doctors' className="amt-txt" tabIndex={0}>$50 - $100</Link>
                    </div>
                    <div className="col-6">
                      <Link href="/doctors/search" aria-label='doctors' className="btn book-btn" tabIndex={0}>Book Now</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 aos" data-aos="fade-up">
              <div className="book-best-doctors">
                <div className="book-header">
                  <Link href="/doctors/search" aria-label='doctors'>
                    <img src={Doc03} alt="" className="img-fluid" />
                  </Link>
                  <div className="img-overlay">
                    <i className="fas fa-star" />
                  </div>
                </div>
                <div className="doctors-body">
                  <div className="inner-section">
                    <span className="float-left">PSICOLOGIST</span>
                    <div className="rating text-right">
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star" />
                      <span className="d-inline-block average-ratings">3.5</span>
                    </div>
                    <Link href="/doctors/search" aria-label='doctors'><h3>Dr. Deborah Angel</h3></Link>
                    <p>MBBS, MD - General Medicine, DNB - Cardiology</p>
                  </div>
                  <div className="row row-sm loc-details">
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <Link href="#" aria-label='doctors'>
                          <img src={mapplus} alt="" className='img' />
                        </Link>
                        <Link href="#" aria-label='doctors'>
                          <span className="available-info">Location</span>
                          <span className="data-info">Newyork, USA</span>
                        </Link>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <Link href="#" aria-label='doctors'>
                          <img src={alarm} alt="" className='img' />
                        </Link>
                        <Link href="#" aria-label='doctors'>
                          <span className="available-info">Available on</span>
                          <span className="data-info">Fri, 22 March</span>
                        </Link>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <Link href="#" aria-label='doctors'>
                          <img src={consult} alt="" className='img' />
                        </Link>
                        <Link href="#" aria-label='doctors'>
                          <span className="available-info">Consulting</span>
                          <span className="data-info">500+ Patients</span>
                        </Link>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <Link href="#" aria-label='doctors'>
                          <img src={exper} alt="" className='img' />
                        </Link>
                        <Link href="#" aria-label='doctors'>
                          <span className="available-info">EXPERIENCE</span>
                          <span className="data-info">25+ Years</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="row row-sm align-items-center p-3">
                    <div className="col-6">
                      <Link href="/doctors/search" aria-label='doctors' className="amt-txt" tabIndex={0}>$50 - $100</Link>
                    </div>
                    <div className="col-6">
                      <Link href="/doctors/search" aria-label='doctors' className="btn book-btn" tabIndex={0}>Book Now</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 aos" data-aos="fade-up">
              <div className="book-best-doctors">
                <div className="book-header">
                  <Link href="/doctors/search" aria-label='doctors'>
                    <img src={Doc04} alt="" className="img-fluid" />
                  </Link>
                  <div className="img-overlay">
                    <i className="fas fa-star" />
                  </div>
                </div>
                <div className="doctors-body">
                  <div className="inner-section">
                    <span className="float-left">PSICOLOGIST</span>
                    <div className="rating text-right">
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star filled" />
                      <i className="fas fa-star" />
                      <span className="d-inline-block average-ratings">3.5</span>
                    </div>
                    <Link href="/doctors/search" aria-label='doctors'><h3>Dr. Sofia Brient</h3></Link>
                    <p>MBBS, MD - General Medicine, DNB - Cardiology</p>
                  </div>
                  <div className="row row-sm loc-details">
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <Link href="#" aria-label='doctors'>
                          <img src={mapplus} alt="" className='img' />
                        </Link>
                        <Link href="#" aria-label='doctors'>
                          <span className="available-info">Location</span>
                          <span className="data-info">Newyork, USA</span>
                        </Link>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <Link href="#" aria-label='doctors'>
                          <img src={alarm} alt="" className='img' />
                        </Link>
                        <Link href="#" aria-label='doctors'>
                          <span className="available-info">Available on</span>
                          <span className="data-info">Fri, 22 March</span>
                        </Link>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <Link href="#" aria-label='doctors'>
                          <img src={consult} alt="" className='img' />
                        </Link>
                        <Link href="#" aria-label='doctors'>
                          <span className="available-info">Consulting</span>
                          <span className="data-info">500+ Patients</span>
                        </Link>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <Link href="#" aria-label='doctors'>
                          <img src={exper} alt="" className='img' />
                        </Link>
                        <Link href="#" aria-label='doctors'>
                          <span className="available-info">EXPERIENCE</span>
                          <span className="data-info">25+ Years</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="row row-sm align-items-center p-3">
                    <div className="col-6">
                      <Link href="/doctors/search" aria-label='doctors' className="amt-txt" tabIndex={0}>$50 - $100</Link>
                    </div>
                    <div className="col-6">
                      <Link href="/doctors/search" aria-label='doctors' className="btn book-btn" tabIndex={0}>Book Now</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="view-all-more text-center aos" data-aos="fade-up">
            <Link href="/doctors/search" aria-label='doctors' className="btn book-btn">View More</Link>
          </div>
        </div>
      </section>
    </Fragment>
  )
});


export default BookDoctor;