/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useMemo } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link'
import AOS from 'aos'
import dynamic from 'next/dynamic'
import { big_paw, small_paw, vetDoctor01, vetDoctor02, vetDoctor03, vetDoctor04 } from '../../../public/assets/imagepath'
import { useTheme } from '@mui/material'
import { useSelector } from 'react-redux'
import { AppState } from '@/redux/store'
import { formatNumberWithCommas } from '../DoctorDashboardSections/ScheduleTiming'
const Owlcarousel = dynamic(() => import('react-owl-carousel'), {
  ssr: false,
})
import Skeleton from '@mui/material/Skeleton'
import Rating from '@mui/material/Rating'


const OurDoctors: FC = (() => {
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
  const options = {
    loop: true,
    margin: 24,
    dots: false,
    nav: true,
    smartSpeed: 2000,
    navContainer: '.slide-nav-16',
    navText: ['<i class="fa-solid fa-caret-left "></i>', '<i class="fa-solid fa-caret-right"></i>'],
    navElement: "button  aria-labelledby='slide-nav-1' aria-label='slide-nav-1'",
    responsive: {
      0: {
        items: 1
      },
      500: {
        items: 1
      },
      575: {
        items: 2
      },
      768: {
        items: 2
      },
      1000: {
        items: 4
      },
      1300: {
        items: 4
      }
    }
  };

  const dummyDoctorData = useMemo(() => {
    return [
      {
        img: vetDoctor01,
        avgRating: 4,
        avgPrice: 200,
        speciality: "Veterinarian",
        name: "Dr. Marie Wells",
        city: 'New York',
        country: 'USA',
        vote: 20,
      },
      {
        img: vetDoctor02,
        avgRating: 4,
        avgPrice: 150,
        speciality: "Pet Care Specialist",
        name: "Dr. Justin Parker",
        city: 'Chicago',
        country: 'USA',
        vote: 22,
      },
      {
        img: vetDoctor03,
        avgRating: 4,
        avgPrice: 110,
        speciality: "Veterinarian",
        name: "Dr. Pamela Curtis",
        city: 'Sandiago',
        country: 'USA',
        vote: 30,
      },
      {
        img: vetDoctor04,
        avgRating: 4,
        avgPrice: 250,
        speciality: "Veterinarian",
        name: "Dr. Ronald Jacobs",
        city: 'Texas',
        country: 'USA',
        vote: 45,
      },
      {
        img: vetDoctor02,
        avgRating: 4,
        avgPrice: 200,
        speciality: "Veterinarian",
        name: "Dr. Marie Wells",
        city: 'New York',
        country: 'USA',
        vote: 20,
      },
    ]
  }, [])
  return (
    <Fragment>
      <div className="blog-section-fourteen our-doctor-twelve" style={{ ...muiVar, backgroundColor: theme.palette.background.paper }}>
        <div className="floating-bg">
          <img src={small_paw} alt="" />
          <img src={big_paw} alt="" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-header-fourteen service-inner-fourteen">
                <div className="service-inner-fourteen">
                  <div className="service-inner-fourteen-two">
                    <h3>OUR TEAM</h3>
                  </div>
                </div>
                <h2>Meet Our Doctors</h2>
                <p>Our Qualified Professionals</p>
              </div>
            </div>
          </div>
          <div
            className="blog-slider-twelve owl-theme aos"
            data-aos="fade-up"
          >
            <Owlcarousel className="blog-slider-twelve owl-theme aos"
              data-aos="fade-up"{...options}>
              {
                bestDoctors == null ?
                  (Array(3).fill(0).map((_, index) => (
                    <VetDoctorSkeleton key={index} />
                  ))) :
                  bestDoctors.length == 0 ?
                    (dummyDoctorData.map((doctor, index) => {
                      return (
                        <div className="card blog-inner-fourt-all" key={index}>
                          <div className="card-body blog-inner-fourt-main">
                            <div className="blog-inner-right-fourt">
                              <Link href="/doctors/search">
                                <div className="blog-inner-right-img">
                                  <img
                                    src={doctor.img}
                                    alt="image"
                                    className="img-fluid "
                                  />
                                  <div className="blog-inner-top-content content-pricing">
                                    <span>$ {doctor.avgPrice}</span>
                                  </div>
                                  <div className="blog-inner-top-content">
                                    <span>{doctor.speciality}</span>
                                  </div>
                                </div>
                              </Link>
                              <h4 className="blog-inner-right-fourt-care">
                                <Link href="/doctors/search">{doctor.name}</Link>
                              </h4>
                              <ul className="articles-list nav blog-articles-list">
                                <li>
                                  <i className="fa fa-location-dot" />
                                  {doctor.city}, {doctor.country}
                                </li>
                              </ul>
                              <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Rating
                                  name="read-only"
                                  precision={0.5}
                                  value={doctor.avgRating}
                                  readOnly
                                  size='small' />
                                <span>({doctor?.vote})</span>
                              </div>

                              <div
                                className="blog-btn-sec text-center aos aos-init aos-animate"
                                data-aos="fade-up"
                              >
                                <Link href="/doctors/search" className="btn btn-view">
                                  Consult
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })) :
                    (bestDoctors.map((doctor, index) => {
                      return (
                        <div className="card blog-inner-fourt-all" key={index}>
                          <div className="card-body blog-inner-fourt-main">
                            <div className="blog-inner-right-fourt">
                              <Link href={`/doctors/profile/${btoa(doctor?._id)}`}>
                                <div className="blog-inner-right-img">
                                  <img
                                    src={doctor.profileImage}
                                    alt="image"
                                    className="img-fluid "
                                  />
                                  <div className="blog-inner-top-content content-pricing">
                                    <span>{doctor?.currency?.[0]?.currency_symbol} {formatNumberWithCommas(doctor?.timeslots?.[0]?.averageHourlyPrice?.toFixed(0) || '')}</span>
                                  </div>
                                  <div className="blog-inner-top-content">
                                    <span>{doctor?.specialities?.[0]?.specialities}</span>
                                  </div>
                                </div>
                              </Link>
                              <h4 className="blog-inner-right-fourt-care">
                                <Link href={`/doctors/profile/${btoa(doctor?._id)}`}>{doctor?.fullName}</Link>
                              </h4>
                              <ul className="articles-list nav blog-articles-list" style={{ flexDirection: 'column' }}>
                                <li>
                                  <i className="fa fa-location-dot" />
                                  {doctor.city}
                                </li>
                                <li>
                                  <i className="fa fa-location-dot" />
                                  {doctor.country}
                                </li>
                              </ul>
                              <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Rating
                                  name="read-only"
                                  precision={0.5}
                                  value={doctor.avgRate}
                                  readOnly
                                  size='small' />
                                <span>({doctor?.totalVote})</span>
                              </div>

                              <div
                                className="blog-btn-sec text-center aos aos-init aos-animate"
                                data-aos="fade-up"
                              >
                                <Link href={`/doctors/profile/${btoa(doctor?._id)}`} className="btn btn-view">
                                  Consult
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    }))

              }
            </Owlcarousel>
          </div>
          <div className="owl-nav slide-nav-16 text-end nav-control" />
          <div
            className="blog-btn-sec text-center aos aos-init aos-animate"
            data-aos="fade-up"
          >
            <Link href="/doctors/search" className="btn btn-view">
              See All Doctors
            </Link>
          </div>
        </div>
      </div>
    </Fragment>
  )
});

export default OurDoctors;

const VetDoctorSkeleton: FC = (() => {
  return (
    <div className="card blog-inner-fourt-all">
      <div className="card-body blog-inner-fourt-main">
        <div className="blog-inner-right-fourt">
          <Link href="/doctors/search">
            <div className="blog-inner-right-img">
              <Skeleton animation="wave" variant="rectangular" width="100%" height={250} sx={{ borderRadius: `30px` }} />

              <Skeleton animation="wave" variant="rectangular" className="blog-inner-top-content content-pricing" style={{ minHeight: 8 }} />
              <Skeleton animation="wave" variant="rectangular" className="blog-inner-top-content" style={{ minHeight: 30 }} />

            </div>
          </Link>
          <h4 className="blog-inner-right-fourt-care" style={{ justifyContent: 'center', display: 'flex' }}>
            <Skeleton animation="wave" variant="rectangular" sx={{ bgcolor: 'primary.main', borderRadius: 8, width: '50%' }} />

          </h4>
          <ul className="articles-list nav blog-articles-list">
            <Skeleton animation="wave" variant="rectangular" sx={{ height: 10, bgcolor: 'text.disabled', borderRadius: 8, width: '80%' }} />
          </ul>
          <div className="blog-list-ratings">
            <Skeleton animation="wave" variant="rectangular" sx={{ bgcolor: '#ffc001', borderRadius: 8, width: '50%' }} />

          </div>

          <div
            className="blog-btn-sec text-center aos aos-init aos-animate"
            data-aos="fade-up"
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Skeleton
              animation="wave"
              variant="rectangular"
              className="btn btn-view"
              sx={{ height: "3.2em", width: '130px', }}
            />
          </div>
        </div>
      </div>
    </div>
  )
})