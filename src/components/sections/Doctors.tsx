/* eslint-disable @next/next/no-img-element */
import React, { FC, Fragment, useCallback, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import AOS from 'aos'
import { MapPin } from "react-feather";
import useScssVar from '@/hooks/useScssVar';
import { Doc03, Doc04, Doc05, doctors_profile } from '@/public/assets/imagepath';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import Skeleton from '@mui/material/Skeleton';
import { formatNumberWithCommas } from '../DoctorDashboardSections/ScheduleTiming';
import { SwiperOptions } from 'swiper/types';
import { FreeMode, Navigation } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

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

  const doctersettings: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 15,
    loop: false,

    modules: [Navigation, FreeMode],
    navigation: {
      prevEl: null,
      nextEl: null,
    },
    breakpoints: {
      1049: { slidesPerView: 4 },
      800: { slidesPerView: 3 },
      776: { slidesPerView: 2 },
      567: { slidesPerView: 2 },
      200: { slidesPerView: 1 },
    },
  };

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
  const swiperRef = useRef<SwiperInstance | null>(null);

  const handlePrev = useCallback(() => {
    swiperRef.current?.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    swiperRef.current?.slideNext();
  }, []);
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
              <div className="owl-nav slide-nav-2 text-end nav-control" >

                <button className='owl-prev' onClick={handlePrev}>
                  <i className="fas fa-chevron-left custom-arrow" />
                </button>
                <button className='owl-next' onClick={handleNext}>
                  <i className="fas fa-chevron-right custom-arrow" />
                </button>
              </div>
            </div>
          </div>
          <div
            className="doctor-slider-one owl-theme aos"
            data-aos="fade-up"
          >
            <Swiper
              {...doctersettings}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}>
              {
                bestDoctors == null ?
                  <BestDoctorSkeletonHome /> :
                  bestDoctors.length == 0 ?
                    <>
                      {
                        dummyDoctorData.map((doctor, index) => {
                          return (
                            <SwiperSlide className="item" key={index}>
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
                                      <MapPin color={muiVar["--color"] as string} /> {doctor.city}, {doctor.country}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </SwiperSlide>
                          )
                        })
                      }
                    </> :
                    <>
                      {
                        bestDoctors.map((doctor, index) => {
                          return (
                            <SwiperSlide className="item" key={index}>
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
                                      <MapPin color={muiVar["--color"] as string} /> {doctor.city},<br /> {doctor.country}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </SwiperSlide>
                          )
                        })
                      }
                    </>
              }
            </Swiper>
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
              <MapPin color={muiVar["--color"] as string} />
              <Skeleton animation="wave" sx={{ minHeight: '26px', minWidth: '100px' }} />
            </p>
          </div>
        </div>
      </div>
    </div>
  )
})