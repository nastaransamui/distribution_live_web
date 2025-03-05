/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useMemo } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link'
import { doctor_13, doctor_14, doctor_15, doctor_16, ecgwave, hexagon_group_1, hexagon_group_2 } from '../../../public/assets/imagepath';
import { Typography, useTheme } from '@mui/material';
import AOS from 'aos'
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import Skeleton from '@mui/material/Skeleton'
const OurDoctors: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  const bestCardioDoctors = useSelector((state: AppState) => state.bestCardioDoctorsData)
  const { bestDoctors } = bestCardioDoctors;
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);
  const dummyDoctorData = useMemo(() => {
    return [
      {
        img: doctor_13,
        avgRating: 4.5,
        href: "/doctors/search",
        speciality: "Cardiology",
        name: "Dr. Jonathan Behar"
      },
      {
        img: doctor_14,
        avgRating: 4,
        href: "/doctors/search",
        speciality: "Cardiology",
        name: "Dr. Piers Clifford"
      },
      {
        img: doctor_15,
        avgRating: 3,
        href: "/doctors/search",
        speciality: "Cardiology",
        name: "Dr. Rajan Sharma"
      },
      {
        img: doctor_16,
        avgRating: 5,
        href: "/doctors/search",
        speciality: "Cardiology",
        name: "Dr. Julian Collinson"
      },
    ]
  }, [])
  return (
    <Fragment>
      <section className="our-doctor-section" style={{ ...muiVar, backgroundColor: theme.palette.background.paper }}>
        <div className="section-floating-bg">
          <img src={hexagon_group_1} alt="" />
          <img src={hexagon_group_2} alt="" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-12 aos" data-aos="fade-up">
              <div className="section-header-one section-header-slider">
                <h2 className="section-title">
                  Our Specialist <span>Doctors</span>
                </h2>
              </div>
            </div>
          </div>
          <div className="row row-gap aos" data-aos="fade-up">
            {
              bestDoctors == null ?
                (Array(4).fill(0).map((_, index) => (
                  <CardioDoctorSkeleton key={index} />
                ))) :
                bestDoctors.length == 0 ?
                  dummyDoctorData.map((doctor, index) => {
                    return (
                      <div className="col-md-4 col-sm-12 col-lg-3" key={index}>
                        <div className="module-border-wrap">
                          <div className="listing-card">
                            <div className="listing-img">
                              <Link href="/doctors/search" aria-label='profile'>
                                <img
                                  src={doctor.img}
                                  className="img-fluid"
                                  alt=""
                                />
                              </Link>
                              <div className="fav-item">
                                <div className="featured-rating">
                                  <i className="fa fa-star " /> <span>{doctor.avgRating}</span>
                                </div>
                                <Link href="#" onClick={(e) => e.preventDefault()} className="fav-icon" aria-label='fav'>
                                  <i className="fa fa-heart" />
                                </Link>
                              </div>
                            </div>
                            <div className="listing-content">
                              <div className="listing-details">
                                <div className="listing-category">
                                  <Link href="#" onClick={(e) => e.preventDefault()} className="listing-category-tag tag-green" aria-label='category'>{doctor.speciality}</Link>
                                </div>
                                <div className="listing-profile-details">
                                  <div className="listing-floating-img">
                                    <img src={ecgwave} alt="" />
                                  </div>
                                  <div className="listing-user">
                                    <div className="listing-user-details">
                                      <Typography component="h1">
                                        <Link href="/doctors/search" aria-label='profile'>{doctor.name}</Link>
                                      </Typography>
                                      <span>{doctor.speciality}</span>
                                    </div>
                                  </div>
                                  <div className="listing-btn">
                                    <Link href="/doctors/search" aria-label='profile' className="btn consult-btn">
                                      Consult
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }) :
                  (
                    bestDoctors.slice(0, 4).map((doctor, index) => {
                      return (
                        <div className="col-md-4 col-sm-12 col-lg-3" key={index}>
                          <div className="module-border-wrap">
                            <div className="listing-card">
                              <div className="listing-img">
                                <Link href="/doctors/search" aria-label='profile'>
                                  <img
                                    src={doctor.profileImage}
                                    className="img-fluid"
                                    alt=""
                                  />
                                </Link>
                                <div className="fav-item">
                                  <div className="featured-rating">
                                    <i className="fa fa-star " /> <span>{doctor.avgRate}</span>
                                  </div>
                                  <Link href="#" onClick={(e) => e.preventDefault()} className="fav-icon" aria-label='fav'>
                                    <i className="fa fa-heart" />
                                  </Link>
                                </div>
                              </div>
                              <div className="listing-content">
                                <div className="listing-details">
                                  <div className="listing-category">
                                    <Link href="#" onClick={(e) => e.preventDefault()} className="listing-category-tag tag-green" aria-label='category'>{doctor?.specialities?.[0]?.specialities}</Link>
                                  </div>
                                  <div className="listing-profile-details">
                                    <div className="listing-floating-img">
                                      <img src={ecgwave} alt="" />
                                    </div>
                                    <div className="listing-user">
                                      <div className="listing-user-details">
                                        <Typography component="h1">
                                          <Link href={`/doctors/profile/${btoa(doctor?._id)}`} aria-label='profile'>Dr. {doctor.fullName}</Link>
                                        </Typography>
                                        <span>{doctor?.specialities?.[0]?.specialities}</span>
                                      </div>
                                    </div>
                                    <div className="listing-btn">
                                      <Link href={`/doctors/profile/${btoa(doctor?._id)}`} aria-label='profile' className="btn consult-btn">
                                        Consult
                                      </Link>
                                    </div>
                                  </div>
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
        </div>
      </section>
    </Fragment>
  )
})

export default OurDoctors;

export const CardioDoctorSkeleton: FC = (() => {
  return (
    <div className="col-md-4 col-sm-12 col-lg-3">
      <div className="module-border-wrap">
        <div className="listing-card">
          <div className="listing-img">
            <Skeleton animation="wave" variant="rectangular" width="100%" height={250} sx={{ borderRadius: `20px` }} />
            <div className="fav-item">

              <Skeleton animation="wave" variant="rectangular" className="featured-rating" sx={{ width: '40px' }} />
              <Skeleton animation="wave" variant="rectangular" className='fav-icon' />
            </div>
          </div>
          <div className="listing-content">
            <div className="listing-details">
              <div className="listing-category">
                <Skeleton animation="wave" variant="rectangular" className="listing-category-tag tag-green" sx={{ width: '100px', height: '2.2em' }} />

              </div>
              <div className="listing-profile-details">
                <div className="listing-floating-img">
                  <img src={ecgwave} alt="" />
                </div>
                <div className="listing-user">
                  <div className="listing-user-details" style={{ width: '120px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Skeleton animation="wave" variant="rectangular" width="100%" height={10} sx={{ borderRadius: `5px`, bgcolor: 'primary.main' }} />
                    <Skeleton animation="wave" variant="rectangular" width="50%" height={10} sx={{ borderRadius: `5px`, bgcolor: 'text.color' }} />
                  </div>
                </div>
                <div className="listing-btn">
                  <Skeleton
                    animation="wave"
                    variant="rectangular"
                    className='btn book-btn'
                    sx={{ height: "3.2em", width: '130px', borderRadius: '30px !important' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})