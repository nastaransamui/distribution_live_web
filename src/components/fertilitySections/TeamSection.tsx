/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useMemo } from 'react'
import Link from 'next/link'
import useScssVar from '@/hooks/useScssVar'
import AOS from 'aos'
import dynamic from 'next/dynamic'
import { useTheme } from '@mui/material'
import { ServeImageIconOneSvg, ServeImageIconTwoSvg } from '../../../public/assets/images/icons/IconsSvgs'
import { doctor_15_aspect, doctor_16_aspect, doctor_17_aspect, doctors_profile } from '@/public/assets/imagepath'
import { useSelector } from 'react-redux'
import { AppState } from '@/redux/store'
import { formatNumberWithCommas } from '../DoctorDashboardSections/ScheduleTiming'
const OwlCarousel = dynamic(() => import(`react-owl-carousel`), { ssr: false })
import Rating from '@mui/material/Rating'
import Skeleton from '@mui/material/Skeleton'


const TeamSection: FC = (() => {

  const { muiVar } = useScssVar();
  const theme = useTheme();
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);
  const doctersettings = {
    items: 2,
    loop: true,
    margin: 15,
    dots: false,
    nav: true,
    navContainer: '.slide-nav-14',
    navText: ['<i class="fa-solid fa-caret-left "></i>', '<i class="fa-solid fa-caret-right"></i>'],
    navElement: "button  aria-labelledby='slide-nav-1' aria-label='slide-nav-1'",
    autoplay: false,
    infinite: "true",

    slidestoscroll: 1,
    rtl: "true",
    rows: 1,
    responsive: {
      1049: {
        items: 2
      },
      992: {
        items: 2
      },
      800: {
        items: 2
      },
      776: {
        items: 2
      },
      567: {
        items: 1
      },
      200: {
        items: 1
      }
    }
  }
  const bestDoctorsData = useSelector((state: AppState) => state.bestDoctorsData)
  const { bestDoctors } = bestDoctorsData;
  const dummyDoctorData = useMemo(() => {
    return [
      {
        img: doctor_15_aspect,
        name: "Dr. Marie Wells",
        speciality: "Pregnancy Specialist",
        totalPatients: 200,
        totalRating: 3,
        totalVote: 35,
        avgPrice: 200,
        city: "New York",
        country: "USA"
      },
      {
        img: doctor_16_aspect,
        name: "Dr. Justin Parker",
        speciality: "Surgeon",
        totalPatients: 120,
        totalVote: 35,
        avgPrice: 600,
        totalRating: 2.5,
        city: "New York",
        country: "USA"
      },
      {
        img: doctor_17_aspect,
        name: "Dr. Marie Wells",
        speciality: "Pregnancy Specialist",
        totalPatients: 72,
        totalVote: 35,
        avgPrice: 200,
        totalRating: 4.5,
        city: "New York",
        country: "USA"
      },
    ]
  }, [])
  return (
    <Fragment>
      <div className="team-section-fourteen" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="section-header-fourteen">
                <div className="service-inner-fourteen">
                  <div className="service-inner-fourteen-one"></div>
                  <div className="service-inner-fourteen-two">
                    <h3>Our Team</h3>
                  </div>
                  <div className="service-inner-fourteen-three"></div>
                </div>
                <h2>Our Qualified Doctors</h2>
              </div>
            </div>
            <div className="col-lg-6 aos" data-aos="fade-up">
              <div className="owl-nav slide-nav-14 text-end nav-control" />
            </div>
          </div>
          <div className="owl-theme team-fourteen-slider">
            <OwlCarousel {...doctersettings}>
              {
                bestDoctors == null ?
                  (Array(2).fill(0).map((_, index) => (
                    <FertilityDoctorSkeleton key={index} />
                  ))) :
                  bestDoctors.length == 0 ?
                    (dummyDoctorData.map((doctor, index) => {
                      return (
                        <div className="articles-grid articles-grid-fourteen w-100" key={index}>
                          <div className="articles-info">
                            <div className="articles-left">
                              <Link href="/doctors/search" aria-label='search'>
                                <div className="articles-img articles-img-fourteen">
                                  <img
                                    src={doctor.img}
                                    alt=""
                                    className="img-fluid"
                                  />
                                </div>
                              </Link>
                            </div>
                            <div className="articles-right">
                              <div className="articles-content articles-content-fourteen">
                                <Link href="/doctors/search" aria-label='search'>{doctor.name}</Link>
                                <ul className="articles-list nav">
                                  <li className="Qualified-doctors-fourteen">
                                    {doctor.speciality}
                                  </li>
                                  <li className="Qualified-doctors-fourteentwo">
                                    +{doctor.totalPatients} Patients
                                  </li>
                                </ul>
                                <div className="rating rating-fourteen" style={{ display: 'flex' }}>
                                  <Rating
                                    name="read-only"
                                    precision={0.5}
                                    value={doctor.totalRating}
                                    readOnly
                                    size='small' />
                                  <span className="d-inline-block average-rating">({doctor.totalVote})</span>
                                </div>
                                <p className="text-muted">
                                  <i className="feather-map-pin" />
                                  {doctor.city}, {doctor.country}
                                </p>
                                <ul className="articles-list nav mb-0">
                                  <li className="Qualified-doctors-fourteenthree">$ {doctor.avgPrice}</li>
                                  <li className="Qualified-doctors-fourteenfour">
                                    <Link href="/doctors/search" aria-label='search'>Consult Now</Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })) :
                    (bestDoctors.map((doctor, index) => {
                      return (
                        <div className="articles-grid articles-grid-fourteen " style={{ width: '99%' }} key={index}>
                          <div className="articles-info">
                            <div className="articles-left">
                              <Link href={`/doctors/profile/${btoa(doctor._id)}`} aria-label='search'>
                                <div className="articles-img articles-img-fourteen">
                                  <img
                                    src={doctor.profileImage !== '' ? doctor.profileImage : doctors_profile}
                                    alt=""
                                    className="img-fluid"
                                  />
                                </div>
                              </Link>
                            </div>
                            <div className="articles-right">
                              <div className="articles-content articles-content-fourteen">
                                <Link href={`/doctors/profile/${btoa(doctor._id)}`} aria-label='search'>{doctor.fullName}</Link>
                                <ul className="articles-list nav">
                                  <li className="Qualified-doctors-fourteen">
                                    {doctor?.specialities?.[0]?.specialities}
                                  </li>
                                  <li className="Qualified-doctors-fourteentwo">
                                    +{doctor.patientCount} Patients
                                  </li>
                                </ul>
                                <div className="rating rating-fourteen" style={{ display: 'flex' }}>
                                  <Rating
                                    name="read-only"
                                    precision={0.5}
                                    value={doctor.avgRate}
                                    readOnly
                                    size='small' />
                                  <span className="d-inline-block average-rating">({doctor.totalVote})</span>
                                </div>
                                <p className="text-muted">
                                  <i className="feather-map-pin" />
                                  {doctor.city}
                                </p>
                                <p className="text-muted">
                                  <i className="feather-map-pin" />
                                  {doctor.country}
                                </p>
                                <ul className="articles-list nav mb-0">
                                  <li className="Qualified-doctors-fourteenthree">{doctor?.currency?.[0]?.currency_symbol} {formatNumberWithCommas(doctor?.timeslots?.[0]?.averageHourlyPrice?.toFixed(0) || "0")}</li>
                                  <li className="Qualified-doctors-fourteenfour">
                                    <Link href={`/doctors/profile/${btoa(doctor._id)}`} aria-label='search'>Consult Now</Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    }))
              }
            </OwlCarousel>
          </div>
        </div>
        <div className="banner-imgfourteenseven">
          <ServeImageIconOneSvg />
        </div>
        <div className="banner-imgfourteeneight">
          <ServeImageIconTwoSvg />
        </div>
        <div className="banner-imgfourteennine">
          <ServeImageIconTwoSvg />
        </div>
      </div>
    </Fragment>
  )
})

export default TeamSection;

export const FertilityDoctorSkeleton: FC = (() => {
  return (
    <div className="articles-grid articles-grid-fourteen w-100">
      <div className="articles-info">
        <div className="articles-left" style={{ minWidth: '230px' }}>
          <Link href="/doctors/search" onClick={(e) => e.preventDefault()} aria-label='search'>
            <Skeleton className="articles-img articles-img-fourteen" animation="wave" component="div" variant="rectangular" width="100%" height={250} sx={{ borderRadius: `20px` }} />

          </Link>
        </div>
        <div className="articles-right">
          <div className="articles-content articles-content-fourteen">
            <Skeleton animation="wave" variant="rectangular" width="50%" height={20} sx={{ borderRadius: `5px`, bgcolor: 'primary.main', mb: 2 }} />

            <ul className="articles-list nav">
              <Skeleton animation="wave" component="li" className="Qualified-doctors-fourteen" variant="rectangular" width="80%" height={35} sx={{ borderRadius: `5px`, bgcolor: 'primary.main', mb: 2 }} />

              <Skeleton animation="wave" component="li" variant="rectangular" width="40%" height={10} sx={{ borderRadius: `5px`, bgcolor: 'text.disabled', mt: 2 }} />

            </ul>
            <Skeleton animation="wave" variant="rectangular" width="80%" height={20} sx={{ borderRadius: `5px`, bgcolor: '#ffaf14', mb: 2 }} />

            <p className="text-muted">
              <Skeleton animation="wave" component="li" variant="rectangular" width="70%" height={10} sx={{ borderRadius: `5px`, bgcolor: 'text.disabled', mt: 2 }} />

            </p>
            <ul className="articles-list nav mb-0">
              <Skeleton animation="wave" component="li" className="Qualified-doctors-fourteenthree" sx={{ minHeight: '55px', minWidth: '55px' }} />
              <Skeleton animation="wave" component="li" className="Qualified-doctors-fourteenfour" sx={{ minHeight: '75px', minWidth: '75px', backgroundColor: "primary.main" }} />

            </ul>
          </div>
        </div>
      </div>
    </div>
  )
})