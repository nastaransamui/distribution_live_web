/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useMemo } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import { useTheme } from '@mui/material';

import { Doc01, Doc02, Doc03, Doc04, alarm, consult, doctors_profile, exper, mapplus } from '../../../public/assets/imagepath';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import Skeleton from '@mui/material/Skeleton'
import Rating from '@mui/material/Rating'
import { formatNumberWithCommas } from '../DoctorDashboardSections/ScheduleTiming';
import { FavButton } from '../SearchDoctorSections/DoctorSearchResults';
import { OverflowTooltip } from '../shared/DoctorDashboardSidebar';
import dayjs from 'dayjs';

const BookDoctor: FC = (() => {
  const { muiVar } = useScssVar();
  const bestDoctorsData = useSelector((state: AppState) => state.bestDoctorsData)
  const { bestDoctors } = bestDoctorsData;
  const theme = useTheme();
  const dummyDoctorData = useMemo(() => {
    return [
      {
        img: Doc01,
        name: 'Dr. Ruby Perrin',
        link: "/doctors/search",
        specialities: 'Neurology',
        avgRating: 4.5,
        vote: 17,
        city: "Florida",
        country: "USA",
        available: "Available on Fri, 22 Mar",
        avaragePrice: "$300 - $1000"
      },
      {
        img: Doc02,
        name: 'Dr. Darren Elder',
        link: "/doctors/search",
        specialities: 'Ophthalmology',
        avgRating: 4,
        vote: 35,
        city: "Newyork",
        country: "USA",
        available: "Available on Fri, 22 Mar",
        avaragePrice: "$50 - $300"
      },
      {
        img: Doc03,
        name: 'Dr. Deborah Angel',
        link: "/doctors/search",
        specialities: 'Cardiology',
        avgRating: 3,
        vote: 27,
        city: "Georgia",
        country: "USA",
        available: "Available on Fri, 22 Mar",
        avaragePrice: "$100 - $400"
      },
      {
        img: Doc04,
        name: 'Dr. Sofia Brient',
        link: "/doctors/search",
        specialities: 'Urology',
        avgRating: 3,
        vote: 4,
        city: "Louisiana",
        country: "USA",
        available: "Available on Fri, 22 Mar",
        avaragePrice: "$150 - $250"
      },
    ]
  }, [])

  return (
    <Fragment>
      <section className="book-section" style={muiVar}>
        <div className="container">
          <div className="section-header-three text-center">
            <h2>Book Our Best Doctor</h2>
            <p className="sub-title" style={{ color: theme.palette.text.color }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
          <div className="row">
            {
              bestDoctors == null ?
                (
                  Array(4).fill(0).map((_, index) => (
                    <DoctorSkeletonHome4 key={index} />
                  ))
                ) :
                bestDoctors.length == 0 ?
                  (
                    dummyDoctorData.map((doctor, index) => {
                      return (
                        <div className="col-lg-3 col-md-6 aos" data-aos="fade-up" key={index}>
                          <div className="book-best-doctors">
                            <div className="book-header">
                              <Link href="/doctors/search" aria-label='doctors'>
                                <img src={doctor.img} alt="" className="img-fluid" />
                              </Link>
                              <div className="img-overlay">
                                <i className="fas fa-heart" style={{ fontSize: 20 }} />
                              </div>
                            </div>
                            <div className="doctors-body">
                              <div className="inner-section">
                                <span className="float-left">{doctor.specialities}</span>
                                <div className="rating text-right" style={{ display: 'flex' }}>
                                  <Rating
                                    name="read-only"
                                    precision={0.5}
                                    value={doctor.avgRating}
                                    readOnly
                                    size='small' />
                                  <span className="d-inline-block average-ratings">{doctor.avgRating}</span>
                                </div>
                                <Link href="/doctors/search" aria-label='doctors'><h3>{doctor.name}</h3></Link>
                                <p>{doctor.specialities}</p>
                              </div>
                              <div className="row row-sm loc-details">
                                <div className="col-6">
                                  <div className="d-flex align-items-center">
                                    <Link href="#" aria-label='doctors'>
                                      <img src={mapplus} alt="" className='img' />
                                    </Link>
                                    <Link href="#" aria-label='doctors'>
                                      <span className="available-info">Location</span>
                                      <span className="data-info">{doctor.city}, {doctor.country}</span>
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
                      )
                    })
                  ) : (bestDoctors.slice(0, 4).map((doctor, index) => {
                    return (
                      <div className="col-lg-3 col-md-6 aos" data-aos="fade-up" key={index}>
                        <div className="book-best-doctors">
                          <div className="book-header">
                            <Link href="/doctors/search" aria-label='doctors'>
                              <img src={doctor.profileImage !== '' ? doctor.profileImage : doctors_profile} alt="" className="img-fluid" />
                            </Link>
                            <div className="img-overlay">
                              <FavButton doctor={doctor} index={index} />
                            </div>
                          </div>
                          <div className="doctors-body">
                            <div className="inner-section">
                              <span className="float-left">{doctor?.specialities?.[0]?.specialities}</span>
                              <div className="rating text-right" style={{ display: 'flex' }}>
                                <Rating
                                  name="read-only"
                                  precision={0.5}
                                  value={doctor.avgRate}
                                  readOnly
                                  size='small' />
                                <span className="d-inline-block average-ratings">{doctor.avgRate}</span>
                              </div>
                              <Link href="/doctors/search" aria-label='doctors'><h3>Dr. {doctor.fullName}</h3></Link>
                              <p>{doctor?.specialities?.[0]?.specialities}</p>
                            </div>
                            <div className="row row-sm loc-details">
                              <div className="col-6">
                                <div className="d-flex align-items-center">
                                  <Link href="#" aria-label='doctors'>
                                    <img src={mapplus} alt="" className='img' />
                                  </Link>
                                  <Link style={{
                                    maxWidth: "70px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }} href="#" onClick={(e) => e.preventDefault()} aria-label='doctors'>
                                    <span className="available-info">Location</span>
                                    <span className="data-info" >
                                      <OverflowTooltip as='span'
                                        text={doctor.city} maxWidth={70} />,<br />
                                    </span>
                                    <span className="data-info" >
                                      <OverflowTooltip as='span'
                                        text={doctor.country} maxWidth={70} />
                                    </span>
                                  </Link>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="d-flex align-items-center">
                                  <Link href="#" aria-label='doctors'>
                                    <img src={alarm} alt="" className={
                                      doctor?.timeslots?.[0]?.isTodayAvailable ? 'img-green' : 'img-crimson'
                                    } />
                                  </Link>
                                  <Link href="#" aria-label='doctors'>
                                    <span className="available-info">Available Today</span>
                                    <span className={
                                      doctor?.timeslots?.[0]?.isTodayAvailable ? 'data-info' : 'data-info-crimson'
                                    }>{dayjs().format('DD MMM YYYY')}</span>
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
                                    <span className="data-info">{doctor?.patientCount} Patients</span>
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
                                    <span className="data-info">{doctor.totalExperience}+ Years</span>
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className="row row-sm align-items-center p-3">
                              <div className="col-6">
                                <Link href={`/doctors/search?keyWord=${doctor.fullName}`} aria-label='doctors' className="amt-txt" tabIndex={0}>
                                  {`${doctor?.currency?.[0]?.currency_symbol} ${formatNumberWithCommas(doctor?.timeslots?.[0]?.averageHourlyPrice?.toFixed(0)!)}`}
                                </Link>
                              </div>
                              <div className="col-6">
                                <Link href={`/doctors/search?keyWord=${doctor.fullName}`} aria-label='doctors' className="btn book-btn" tabIndex={0}>Book Now</Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                  )
            }
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


export const DoctorSkeletonHome4: FC = (() => {

  return (
    <div className="col-lg-3 col-md-6 aos" data-aos="fade-up">
      <div className="book-best-doctors">
        <div className="book-header">
          <Skeleton animation="wave" variant="rectangular" width="100%" height={250} sx={{ borderRadius: `10px 10px 0px 0px` }} />
          <div className="img-overlay" style={{ opacity: 0.5 }}>
            <i className="fas fa-heart" style={{ fontSize: 20 }} />
          </div>
        </div>
        <div className="doctors-body">
          <div className="inner-section">
            <span className="float-left">
              <Skeleton
                animation="wave"
                variant="rectangular"
                sx={{ borderRadius: '8px', minHeight: '16px', width: '80%', mb: 1 }} />
            </span>
            <div className="rating text-right">
              <Skeleton
                animation="wave"
                variant="rectangular"
                sx={{ borderRadius: '8px', minHeight: '16px', width: '155px', bgcolor: '#ffc001' }} />
            </div>
            <Link href="" onClick={(e) => e.preventDefault()} aria-label='doctors'><h3>
              <Skeleton
                animation="wave"
                variant="rectangular"
                sx={{ borderRadius: '8px', minHeight: '16px', width: '155px', bgcolor: 'primary.dark' }} />
            </h3></Link>
            <p><Skeleton
              animation="wave"
              variant="rectangular"
              sx={{ borderRadius: '8px', minHeight: '16px', width: '60%', mt: 1 }} /></p>
          </div>
          <div className="row row-sm loc-details" style={{ padding: 0 }}>
            <Skeleton animation="wave" variant="rectangular" width="100%" height={150}
              sx={{ bgcolor: "background.paper" }} />

          </div>
          <div className="row row-sm align-items-center p-3">
            <div className="col-6">
              <Skeleton
                animation="wave"
                variant="rectangular"
                sx={{ borderRadius: '8px', minHeight: '16px', width: '100%', bgcolor: 'primary.main' }} />
            </div>
            <div className="col-6">
              <Skeleton
                animation="wave"
                variant="rectangular"
                className='btn book-btn'
                sx={{ height: "3.2em" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})