/* eslint-disable @next/next/no-img-element */
import React, { useEffect, Fragment, FC, useMemo } from 'react';
import Link from 'next/link';
import AOS from 'aos'
import FeatherIcon from 'feather-icons-react';
import dynamic from 'next/dynamic'
import useScssVar from '@/hooks/useScssVar';
import { Doc03, Doc04, Doc05, doctors_profile } from '@/public/assets/imagepath';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import Skeleton from '@mui/material/Skeleton';
import { formatNumberWithCommas } from '../DoctorDashboardSections/ScheduleTiming';

const OwlCarousel = dynamic(() => import('react-owl-carousel'), {
  ssr: false,
})

const Doctors: FC = (() => {
  const { muiVar } = useScssVar()
  const bestDoctorsData = useSelector((state: AppState) => state.bestDoctorsData)
  const { bestDoctors } = bestDoctorsData;
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
    navContainer: '.slide-nav-2',
    navText: ['<i class="fas fa-chevron-left custom-arrow"></i>', '<i class="fas fa-chevron-right custom-arrow"></i>'],
    navElement: "button    aria-labelledby='slide-nav-1' aria-label='slide-nav-1'",
    autoplay: false,
    infinite: "true",

    slidestoscroll: 1,
    rtl: "true",
    rows: 1,
    responsive: {
      1049: {
        items: 4
      },
      800: {
        items: 3
      },
      776: {
        items: 2
      },
      567: {
        items: 2
      },
      200: {
        items: 1
      }
    }
  }

  const dummyDoctorData = useMemo(() => {
    return [
      {
        img: Doc03,
        price: 200,
        name: 'Dr. Ruby Perrin',
        link: "/doctors/search",
        speciality: 'Cardiology',
        avgRating: 4.5,
        vote: 35,
        city: "Newyork",
        country: "USA"
      },
      {
        img: Doc04,
        price: 360,
        name: 'Dr. Darren Elder',
        link: "/doctors/search",
        speciality: 'Neurology',
        avgRating: 4.0,
        vote: 20,
        city: "Florida",
        country: "USA"
      },
      {
        img: Doc05,
        price: 450,
        name: 'Dr. Sofia Brient',
        link: "/doctors/search",
        speciality: 'Urology',
        avgRating: 4.5,
        vote: 30,
        city: "Georgia",
        country: "USA"
      },
      {
        img: doctors_profile,
        price: 570,
        name: 'Dr. Paul Richard',
        link: "/doctors/search",
        speciality: 'Orthopedic',
        avgRating: 4.3,
        vote: 45,
        city: "Michigan",
        country: "USA"
      },
      {
        img: doctors_profile,
        price: 880,
        name: 'Dr. John Doe',
        link: "/doctors/search",
        speciality: 'Dentist',
        avgRating: 4.4,
        vote: 50,
        city: "California",
        country: "USA"
      }
    ]
  }, [])

  return (
    <Fragment>
      <section className="our-doctors-section" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-6 aos" data-aos="fade-up">
              <div className="section-header-one section-header-slider">
                <h2 className="section-title imgColorPrimary">Best Doctors</h2>
              </div>
            </div>
            <div className="col-md-6 aos" data-aos="fade-up">
              <div className="owl-nav slide-nav-2 text-end nav-control" />
            </div>
          </div>
          <div
            className="doctor-slider-one owl-theme aos"
            data-aos="fade-up"
          >
            {/* Doctor Item */}
            <OwlCarousel {...doctersettings}>
              {
                bestDoctors == null ?
                  <BestDoctorSkeletonHome /> :
                  bestDoctors.length == 0 ?
                    <>
                      {
                        dummyDoctorData.map((doctor, index) => {
                          return (
                            <div className="item" key={index}>
                              <div className="doctor-profile-widget">
                                <div className="doc-pro-img">
                                  <Link href="/doctors/search" aria-label='doctor-profile'>
                                    <div className="doctor-profile-img">
                                      <img
                                        src={doctor.img}
                                        className="img-fluid"
                                        alt=""
                                      />
                                    </div>
                                  </Link>
                                  <div className="doctor-amount">
                                    <span>$ {doctor.price}</span>
                                  </div>
                                </div>
                                <div className="doc-content">
                                  <div className="doc-pro-info">
                                    <div className="doc-pro-name">
                                      <Link href="/doctors/search" aria-label='doctor-profile'>{doctor.name}</Link>
                                      <p>{doctor.speciality}</p>
                                    </div>
                                    <div className="reviews-ratings">
                                      <p>
                                        <span>
                                          <i className="fas fa-star" /> {doctor.avgRating}
                                        </span>{" "}
                                        ({doctor.vote})
                                      </p>
                                    </div>
                                  </div>
                                  <div className="doc-pro-location">
                                    <p>
                                      <i><FeatherIcon icon="map-pin" style={{ color: muiVar['--color'] }} /></i> {doctor.city}, {doctor.country}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      }
                    </> :
                    <>
                      {
                        bestDoctors.map((doctor, index) => {
                          return (
                            <div className="item" key={index}>
                              <div className="doctor-profile-widget">
                                <div className="doc-pro-img">
                                  <Link href={`/doctors/profile/${btoa(doctor?._id)}`} aria-label='doctor-profile'>
                                    <div className="doctor-profile-img">
                                      <img
                                        src={doctor.profileImage !== '' ? doctor.profileImage : doctors_profile}
                                        className="img-fluid"
                                        alt=""
                                      />
                                    </div>
                                  </Link>
                                  <div className="doctor-amount">
                                    <span>{doctor?.currency?.[0]?.currency_symbol} {formatNumberWithCommas(doctor?.timeslots?.[0]?.averageHourlyPrice?.toFixed(0)!)}</span>
                                  </div>
                                </div>
                                <div className="doc-content">
                                  <div className="doc-pro-info">
                                    <div className="doc-pro-name">
                                      <Link href="/doctors/search" aria-label='doctor-profile'>{`Dr. ${doctor.fullName}`}</Link>
                                      <p>{doctor?.specialities?.[0]?.specialities}</p>
                                    </div>
                                    <div className="reviews-ratings">
                                      <p>
                                        <span>
                                          <i className="fas fa-star" /> {doctor?.avgRate}
                                        </span>{" "}
                                        ({doctor.totalVote})
                                      </p>
                                    </div>
                                  </div>
                                  <div className="doc-pro-location">
                                    <p>
                                      <i><FeatherIcon icon="map-pin" style={{ color: muiVar['--color'] }} /></i> {doctor.city},<br /> {doctor.country}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      }
                    </>
              }
            </OwlCarousel>
          </div>
        </div>
      </section>
    </Fragment>
  )
})

export default Doctors

export const BestDoctorSkeletonHome: FC = (() => {
  const { muiVar } = useScssVar()
  return (
    <div className="item">
      <div className="doctor-profile-widget">
        <div className="doc-pro-img">
          <Skeleton animation="wave" variant="rectangular" width="100%" height={180} />
        </div>
        <div className="doctor-amount">
          <Skeleton
            animation="wave"
            variant="rectangular"
            sx={{ borderRadius: '8px', minHeight: '26px', minWidth: '55px' }} />
        </div>

        <div className="doc-content">
          <div className="doc-pro-info">
            <div className="doc-pro-name">
              <Skeleton animation="wave" sx={{ minHeight: '26px', minWidth: '100px' }} />
              <p> <Skeleton animation="wave" /></p>
            </div>
            <div className="reviews-ratings">
              <p>

                <Skeleton animation="wave" sx={{ minHeight: '36px', minWidth: '100px' }} />

              </p>
            </div>
          </div>
          <div className="doc-pro-location">
            <p>
              <i><FeatherIcon icon="map-pin" style={{ color: muiVar['--color'] }} /></i>
              <Skeleton animation="wave" sx={{ minHeight: '26px', minWidth: '100px' }} />
            </p>
          </div>
        </div>
      </div>
    </div>
  )
})