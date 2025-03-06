/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useMemo } from 'react'
import Link from 'next/link'
import useScssVar from '@/hooks/useScssVar'
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton'
import { featureImg7, featureImg8, featureImg9, featureImg10, featureImg11, featureImg12, doctor_19, doctor_20, doctor_21, doctor_22, doctor_23, doctor_24 } from '@/public/assets/imagepath';
import AOS from 'aos'
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { FavButton } from '../SearchDoctorSections/DoctorSearchResults';
const OurServices: FC = (() => {
  var { muiVar } = useScssVar();
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
        img: featureImg7,
        profileImage: doctor_19,
        href: "/doctors/search",
        title: "Heart Valve Disease",
        name: "Dr. Anoop Shetty"
      },
      {
        img: featureImg8,
        profileImage: doctor_20,
        href: "/doctors/search",
        title: "Coronary artery disease",
        name: "Dr. Simon Pearse"
      },
      {
        img: featureImg9,
        profileImage: doctor_21,
        href: "/doctors/search",
        title: "High blood pressure",
        name: "Dr. Rajan Sharma"
      },
      {
        img: featureImg10,
        profileImage: doctor_22,
        href: "/doctors/search",
        title: "Heart attack",
        name: "Dr. John Paul"
      },
      {
        img: featureImg11,
        profileImage: doctor_23,
        href: "/doctors/search",
        title: "Heart palpitations",
        name: "Dr. Marry Peter"
      },
      {
        img: featureImg12,
        profileImage: doctor_24,
        href: "/doctors/search",
        title: "Heart palpitations",
        name: "Dr. Juliana"
      },
    ]
  }, [])
  return (
    <Fragment>
      <section className="service-section" style={muiVar}>
        <div className="container" >
          <div className="row" >
            <div className="col-md-12 aos" data-aos="fade-up">
              <div className="section-header-one section-header-slider">
                <h2 className="section-title">Our <span>Services</span></h2>
              </div>
            </div>
          </div>
          <div className="row row-gap aos" data-aos="fade-up" >
            {
              bestDoctors == null ?
                (Array(6).fill(0).map((_, index) => (
                  <CardioServiceSkeleton key={index} />
                ))) :
                bestDoctors.length == 0 ?
                  (
                    dummyDoctorData.map((doctor, index) => {
                      return (
                        <div className="col-md-6 col-sm-12 col-lg-4" key={index}>
                          <div className="listing-card">
                            <div className="listing-img">
                              <Link href="/doctors" aria-label="search">
                                <img src={doctor.img} className="img-fluid" alt="#" />
                              </Link>
                              <div className="fav-item">
                                <Link href="#" className="fav-icon" aria-label="fav">
                                  <i className="fa fa-heart" />
                                </Link>
                              </div>
                            </div>
                            <div className="listing-content">
                              <div className="listing-details">
                                <div className="listing-title">
                                  <h3>
                                    <Link href="/doctors" aria-label="search">{doctor.title}</Link>
                                  </h3>
                                </div>
                                <div className="listing-profile-details">
                                  <div className="listing-user">
                                    <div className="listing-profile-img">
                                      <Link href="/doctors/search" aria-label="search">
                                        <img src={doctor.profileImage} className="img-fluid" alt="#" />
                                      </Link>
                                    </div>
                                    <div className="listing-user-details">
                                      <span>Specialist</span>
                                      <Typography component="h4">
                                        <Link href="/doctors/search" aria-label="search">
                                          {doctor.name}
                                        </Link>
                                      </Typography>
                                    </div>
                                  </div>
                                  <div className="listing-btn">
                                    <Link href="/doctors/search" className="btn consult-btn" aria-label="consult">Consult</Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  ) :
                  (
                    dummyDoctorData.map((doctor, index) => {

                      return (
                        <div className="col-md-6 col-sm-12 col-lg-4" key={index}>
                          <div className="listing-card">
                            <div className="listing-img">

                              <img src={doctor.img} className="img-fluid" alt="#" />

                              <div className="fav-item">
                                <Link href="#" onClick={(e) => e.preventDefault()} className="fav-icon" aria-label="fav" style={{ height: bestDoctors?.[index] ? '35px' : '30px', width: bestDoctors?.[index] ? '35px' : '30px' }}>
                                  {
                                    bestDoctors?.[index] ?
                                      <FavButton doctor={bestDoctors?.[index]} index={index} />
                                      : <i className="fa fa-heart" />
                                  }
                                </Link>
                              </div>
                            </div>
                            <div className="listing-content">
                              <div className="listing-details">
                                <div className="listing-title">
                                  <h3>
                                    <Link href="/doctors" aria-label="search">{doctor.title}</Link>
                                  </h3>
                                </div>
                                <div className="listing-profile-details">
                                  <div className="listing-user">
                                    <div className="listing-profile-img">
                                      <Link href={
                                        bestDoctors?.[index]?.fullName ? `/doctors/profile/${btoa(bestDoctors?.[index]?._id)}` : `/doctors/search`
                                      } aria-label="search">
                                        <img src={bestDoctors?.[index]?.profileImage || doctor.profileImage} className="img-fluid" alt="#" />
                                      </Link>
                                    </div>
                                    <div className="listing-user-details">
                                      <span>{bestDoctors?.[index]?.specialities?.[0]?.specialities || "Specialist"}</span>
                                      <Typography component="h4">
                                        <Link href={
                                          bestDoctors?.[index]?.fullName ? `/doctors/profile/${btoa(bestDoctors?.[index]?._id)}` : `/doctors/search`
                                        } aria-label="search">
                                          {`Dr. ${bestDoctors?.[index]?.fullName}` || doctor.name}
                                        </Link>
                                      </Typography>
                                    </div>
                                  </div>
                                  <div className="listing-btn">
                                    <Link href={
                                      bestDoctors?.[index]?.fullName ? `/doctors/profile/${btoa(bestDoctors?.[index]?._id)}` : `/doctors/search`
                                    } className="btn consult-btn" aria-label="consult">Consult</Link>
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

export default OurServices

export const CardioServiceSkeleton: FC = (() => {
  return (
    <div className="col-md-6 col-sm-12 col-lg-4">
      <div className="listing-card">
        <div className="listing-img">
          <Skeleton animation="wave" variant="rectangular" width="100%" height={250} sx={{ borderRadius: `20px` }} />
          <div className="fav-item">
            <Skeleton animation="wave" variant="circular" width={30} height={30} sx={{ backgroundColor: "background.paper" }} />
          </div>
        </div>
        <div className="listing-content">
          <div className="listing-details">
            <div className="listing-title">
              <Skeleton animation="wave" variant="rectangular" width="50%" height={20} sx={{ borderRadius: `5px`, bgcolor: 'primary.main', mb: 2 }} />
            </div>
            <div className="listing-profile-details">
              <div className="listing-user">
                <div className="listing-profile-img">
                  <Skeleton animation="wave" variant="circular" width={50} height={50} sx={{ backgroundColor: "secondary.main" }} />
                </div>
                <div className="listing-user-details" style={{ width: '120px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Skeleton animation="wave" variant="rectangular" width="100%" height={8} sx={{ borderRadius: `5px`, bgcolor: 'text.color' }} />
                  <Skeleton animation="wave" variant="rectangular" width="100%" height={8} sx={{ borderRadius: `5px`, bgcolor: 'text.color' }} />
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
  )
})