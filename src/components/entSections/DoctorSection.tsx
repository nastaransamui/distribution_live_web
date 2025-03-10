/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useMemo } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import AOS from 'aos'

import useScssVar from '@/hooks/useScssVar'
import { CiHeart } from 'react-icons/ci'
import { Doc03, Doc07, Doc09, Doc11, fifteen_bg_icon1, fifteen_bg_icon2 } from '../../../public/assets/imagepath'
import { useTheme } from '@mui/material'
import { useSelector } from 'react-redux'
import { AppState } from '@/redux/store'
import Rating from '@mui/material/Rating';
import Skeleton from '@mui/material/Skeleton'
import { FavButton } from '../SearchDoctorSections/DoctorSearchResults'
import { BestDoctorsType } from '@/redux/bestDoctorsData'
import Tooltip from '@mui/material/Tooltip';


const Owlcarousel = dynamic(() => import(`react-owl-carousel`), { ssr: false });


const DoctorSection: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  const bestDoctorsData = useSelector((state: AppState) => state.bestDoctorsData)
  const { bestDoctors } = bestDoctorsData;
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);
  const dummyDoctorData = useMemo(() => {
    return [
      {
        img: Doc11,
        totalExperience: 15,
        name: 'Dr. Brandon Nicholas',
        speciality: 'Ear-Nose-Throat (ENT) Specialist',
        avgRating: 4.8,
        availables: ["Mo", "Tu", "We", "Th", "Fr"]
      },
      {
        img: Doc03,
        totalExperience: 9,
        name: 'Dr. Katherine Victoria',
        speciality: 'MBBS, MS - ENT',
        avgRating: 4.9,
        availables: ["Mo", "Tu", "We", "Th"]
      },
      {
        img: Doc07,
        totalExperience: 10,
        name: 'Dr. Lisa Madeleine',
        speciality: 'MBBS, MS - ENT',
        avgRating: 4.8,
        availables: ["Mo", "Tu", "We", "Th", "Fr"]
      },
      {
        img: Doc09,
        totalExperience: 15,
        name: 'Dr. Brandon Nicholas',
        speciality: 'Ear-Nose-Throat (ENT) Specialist',
        avgRating: 4.8,
        availables: ["Mo", "Tu", "We", "Th"]
      },
    ]
  }, [])

  const options = {
    loop: true,
    margin: 24,
    dots: false,
    nav: true,
    smartSpeed: 2000,
    navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
    navElement: "button  aria-labelledby='slide-nav-1' aria-label='slide-nav-1'",
    responsive: {
      0: {
        items: 1
      },
      500: {
        items: 1
      },
      575: {
        items: 1
      },
      768: {
        items: 2
      },
      1000: {
        items: 3
      },
      1300: {
        items: 3
      }
    }
  };
  return (
    <Fragment>
      <div className="doctors-section-fifteen" style={muiVar}>
        <div className="doctor-fifteen-icon">
          <img src={fifteen_bg_icon2} alt="" />
        </div>
        <div className="doctors-fifteen-icon">
          <img
            src={fifteen_bg_icon1}
            alt=""
            className="aos"
            data-aos="fade-down"
          />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-header-fifteen text-center">
                <h2>
                  Our <span>Expert Doctors</span>
                </h2>
                <p>The Great Place Of ENT Hospital Center</p>
              </div>
            </div>
          </div>
          <div
            className="doctor-slider-fifteen owl-theme aos"
            data-aos="fade-up"
          >
            <Owlcarousel className="doctor-slider-fifteen owl-theme aos"
              data-aos="fade-up"{...options}>
              {
                bestDoctors == null ?
                  (Array(3).fill(0).map((_, index) => (
                    <EntDoctorSkeleton key={index} />
                  ))) :
                  bestDoctors.length == 0 ?
                    (dummyDoctorData.map((doctor, index) => {
                      return (
                        <div className="item item-fifteen" key={index}>
                          <div className="doctor-profile-widget">
                            <div className="doc-pro-img">

                              <div className="doctor-profile-img">
                                <img
                                  src={doctor.img}
                                  className="img-fluid"
                                  alt=""
                                />
                              </div>

                              <div className="doctor-amount">
                                <Link href="#" className="fav-icon" onClick={(e) => e.preventDefault()}>
                                  <CiHeart className="feather-heart" />
                                </Link>
                              </div>
                              <div className="item-info">
                                <h6>{doctor.totalExperience}+ Years Experience</h6>
                              </div>
                            </div>
                            <div className="doc-content-fift">
                              <Link href="/doctors/search">{doctor.name}</Link>
                              <p>{doctor.speciality}</p>
                              <div className="rate-fifteen">
                                <div className="rate-four">
                                  <i className="fas fa-star filled me-2" />
                                  <span>{doctor.avgRating}</span>
                                </div>
                                <ul>
                                  {
                                    doctor.availables.map((a, i) => {
                                      return (<li key={i.toString() + index.toString()}>{a}</li>)
                                    })
                                  }
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })) :
                    (bestDoctors.map((doctor: BestDoctorsType, index) => {
                      return (
                        <div className="item item-fifteen" key={index}>
                          <div className="doctor-profile-widget">
                            <div className="doc-pro-img">

                              <div className="doctor-profile-img">
                                <img
                                  src={doctor.profileImage}
                                  className="img-fluid"
                                  alt=""
                                />
                              </div>

                              <div className="doctor-amount">
                                <Link href="#" className="fav-icon" onClick={(e) => e.preventDefault()}>
                                  {/* <CiHeart className="feather-heart" /> */}
                                  <FavButton doctor={doctor} index={index} />
                                </Link>
                              </div>
                              <div className="item-info">
                                <h6>{doctor.totalExperience}+ Years Experience</h6>
                              </div>
                            </div>
                            <div className="doc-content-fift">
                              <Link href={`/dcotors/profile/${btoa(doctor?._id)}`}>{doctor.fullName}</Link>
                              <p>{doctor?.specialities?.[0]?.specialities}</p>
                              <div className="rate-fifteen">
                                <div className="rate-four">
                                  <i className="fas fa-star filled me-2" />
                                  <span>{doctor?.avgRate}</span>
                                </div>
                                <ul>
                                  {doctor.timeslots.map((slot, index) => (
                                    <Fragment key={index}>
                                      <Tooltip arrow followCursor title={slot.isThisMonthAvailable ? " Available This Month" : 'Not Available This Month'}>
                                        <li style={{ background: slot.isThisMonthAvailable ? theme.palette.background.paper : 'crimson' }}>
                                          {slot.isThisMonthAvailable ? "M" : " M"}
                                        </li>
                                      </Tooltip>
                                      <Tooltip arrow followCursor title={slot.isThisWeekAvailable ? "Available This Week" : 'Not Available This Week'}>
                                        <li style={{ background: slot.isThisWeekAvailable ? theme.palette.background.paper : 'crimson' }}>
                                          {slot.isThisWeekAvailable ? "We" : " We"}
                                        </li>
                                      </Tooltip>
                                      <Tooltip arrow followCursor title={slot.isTodayAvailable ? "Available Today" : 'Not Available Today'}>
                                        <li style={{ background: slot.isTodayAvailable ? theme.palette.background.paper : 'crimson' }}>
                                          {slot.isTodayAvailable ? "To" : "To"}
                                        </li>
                                      </Tooltip>
                                      <Tooltip arrow followCursor title={slot.isTommorowAvailable ? "Available Tomorrow" : 'Not Available Tomorrow'}>
                                        <li style={{ background: slot.isTommorowAvailable ? theme.palette.background.paper : 'crimson' }}>
                                          {slot.isTommorowAvailable ? "Tw" : "Tw"}
                                        </li>
                                      </Tooltip>
                                    </Fragment>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    }))
              }
            </Owlcarousel>
          </div>
        </div>
      </div>
    </Fragment>
  )
});


export default DoctorSection;

export const EntDoctorSkeleton: FC = (() => {

  return (
    <div className="item item-fifteen">
      <div className="doctor-profile-widget">
        <div className="doc-pro-img">

          <div className="doctor-profile-img">
            <Skeleton animation="wave" variant="rectangular" width="100%" height={250} />
          </div>

          <div className="doctor-amount" style={{ borderRadius: '50%' }}>
            <Skeleton animation="wave" variant="circular" width={40} height={40} sx={{ borderRadius: '50%' }} />
          </div>
          <div className="item-info">
            <Skeleton component="h6" animation="wave" variant='rectangular' sx={{ minHeight: "2.5rem", minWidth: '7rem', backgroundColor: 'secondary.main' }} />

          </div>
        </div>
        <div className="doc-content-fift">
          <Skeleton
            animation="wave"
            variant="rectangular"
            width="50%"
            sx={{ borderRadius: '8px', mb: 2 }} />

          <Skeleton
            animation="wave"
            variant="rectangular"
            width="50%"
            sx={{ borderRadius: '8px', mb: 2 }} />
          <Skeleton
            animation="wave"
            variant="rectangular"
            width="70%"
            sx={{ borderRadius: '8px', mb: 2 }} />
          <div className="rate-fifteen">
            <Skeleton component="div" className='rate-four' animation="wave" variant='rectangular' sx={{ minHeight: "1.9rem", minWidth: '3.5rem' }} />

            <ul>
              <Skeleton animation="wave" component="i" variant='rectangular' width={31} height={27} sx={{ borderRadius: '5px', mr: 1 }} />
              <Skeleton animation="wave" component="i" variant='rectangular' width={31} height={27} sx={{ borderRadius: '5px', mr: 1 }} />
              <Skeleton animation="wave" component="i" variant='rectangular' width={31} height={27} sx={{ borderRadius: '5px', mr: 1 }} />
              <Skeleton animation="wave" component="i" variant='rectangular' width={31} height={27} sx={{ borderRadius: '5px', mr: 1 }} />

            </ul>
          </div>
        </div>
      </div>
    </div>
  )
})