/* eslint-disable @next/next/no-img-element */
import { Fragment, FC, useMemo } from "react";
import useScssVar from "@/hooks/useScssVar";
import dynamic from 'next/dynamic'
import Link from 'next/link';
import { Rating, useTheme } from "@mui/material";
import { Doc01, Doc02, Doc03, Doc04, doctors_profile } from "@/public/assets/imagepath";
import { useSelector } from "react-redux";
import { AppState } from "@/redux/store";
import { formatNumberWithCommas } from "../DoctorDashboardSections/ScheduleTiming";
import Skeleton from '@mui/material/Skeleton'
const OwlCarousel = dynamic(() => import('react-owl-carousel'), {
  ssr: false,
})


const DoctorSection: FC = (() => {
  const theme = useTheme();
  const { muiVar } = useScssVar();
  const bestDoctorsData = useSelector((state: AppState) => state.bestDoctorsData)
  const { bestDoctors } = bestDoctorsData;
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
  const dummyDoctorData = useMemo(() => {
    return [
      {
        img: Doc01,
        priceRage: '$20 - $50',
        name: 'Dr. Ruby Perrin',
        link: "/doctors/search",
        speciality: 'BDS, MDS - Oral &amp; Maxillofacial Surgery',
        avgRating: 4.5,
        city: "Georgia",
        country: "USA",
        patientCount: 450,
      },
      {
        img: Doc02,
        priceRage: '$20 - $50',
        name: 'Dr. Deborah Angel',
        link: "/doctors/search",
        speciality: 'MBBS, MD - General Medicine, DNB',
        avgRating: 3.5,
        city: "Georgia",
        country: "USA",
        patientCount: 350,
      },
      {
        img: Doc03,
        priceRage: '$20 - $50',
        name: 'Dr. Sofia Brient',
        link: "/doctors/search",
        speciality: 'MBBS, MS - General Surgery, MCh',
        avgRating: 3,
        city: "Georgia",
        country: "USA",
        patientCount: 200,
      },
      {
        img: Doc04,
        priceRage: '$20 - $50',
        name: 'Dr. Darren Elder',
        link: "/doctors/search",
        speciality: 'BDS, MDS - Oral &amp; Maxillofacial Surgery',
        avgRating: 3,
        city: "Georgia",
        country: "USA",
        patientCount: 70,
      },
    ]
  }, [])
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
              {
                bestDoctors == null ?
                  <BestDoctorSkeletonHome3 /> :
                  bestDoctors.length == 0 ?
                    <>
                      {
                        dummyDoctorData.map((doctor, index) => {
                          return (
                            <div className="item" key={index}>
                              <div className="our-doctors-card">
                                <div className="doctors-header">
                                  <Link href="#" aria-label="our doctor"><img src={doctor.img} className="img-fluid" alt="" /></Link>
                                  <div className="img-overlay">
                                    <span>{doctor.priceRage}</span>
                                  </div>
                                </div>
                                <div className="doctors-body">
                                  <div className="rating" style={{ display: 'flex' }}>
                                    <Rating
                                      name="read-only"
                                      precision={0.5}
                                      value={doctor.avgRating}
                                      readOnly
                                      size='small' />
                                    <span className="d-inline-block average-ratings">{doctor.avgRating}</span>
                                  </div>
                                  <Link href="/doctors/search" aria-label="our doctor"><h3>{doctor.name}</h3></Link>
                                  <p>{doctor.speciality}</p>
                                  <div className="location d-flex">
                                    <p><i className="fas fa-map-marker-alt" /> {doctor.city}, {doctor.country}</p>
                                    <p className="ms-auto"><i className="fas fa-user-md" /> {doctor.patientCount} Consultations</p>
                                  </div>
                                  <div className="row row-sm">
                                    <div className="col-6">
                                      <Link href="/doctors/search" className="btn book-btn" tabIndex={0} aria-label="our doctor">View Profile</Link>
                                    </div>
                                    <div className="col-6">
                                      <Link href="/doctors/search" className="btn book-btn" tabIndex={0} aria-label="our doctor">Book Now</Link>
                                    </div>
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
                              <div className="our-doctors-card">
                                <div className="doctors-header">
                                  <Link href="#" aria-label="our doctor">
                                    <img src={doctor.profileImage !== '' ? doctor.profileImage : doctors_profile} className="img-fluid" alt="" />
                                  </Link>
                                  <div className="img-overlay">
                                    <span>
                                      {
                                        `${doctor.currency?.[0]?.currency_symbol} ${formatNumberWithCommas(doctor?.timeslots?.[0]?.averageHourlyPrice?.toFixed(0)!)}`
                                      }
                                    </span>
                                  </div>
                                </div>
                                <div className="doctors-body">
                                  <div className="rating" style={{ display: 'flex' }}>
                                    <Rating
                                      name="read-only"
                                      precision={0.5}
                                      value={doctor.avgRate}
                                      readOnly
                                      size='small' />
                                    <span className="d-inline-block average-ratings">{doctor.avgRate}</span>
                                  </div>
                                  <Link href="/doctors/search" aria-label="our doctor"><h3>Dr. {doctor.fullName}</h3></Link>
                                  <p>{doctor.specialities?.[0]?.specialities}</p>
                                  <div className="location d-flex">
                                    <span >
                                      <p><i className="fas fa-map-marker-alt" /> {doctor.city}</p>
                                      <p>{doctor.country}</p>
                                    </span>
                                    <p className="ms-auto"><i className="fas fa-user-md" /> {doctor.patientCount} Consultations</p>
                                  </div>
                                  <div className="row row-sm">
                                    <div className="col-6">
                                      <Link href={`/doctors/profile/${btoa(doctor?._id)}`} className="btn book-btn" tabIndex={0} aria-label="our doctor">View Profile</Link>
                                    </div>
                                    <div className="col-6">
                                      <Link href="/doctors/search" className="btn book-btn" tabIndex={0} aria-label="our doctor">Book Now</Link>
                                    </div>
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
});

export default DoctorSection

export const BestDoctorSkeletonHome3: FC = (() => {
  return (
    <div className="item">
      <div className="our-doctors-card">
        <div className="doctors-header">
          <Skeleton animation="wave" variant="rectangular" width="100%" height={180} />
          <div className="img-overlay">
            <span><Skeleton animation="wave" variant="rectangular" sx={{ bgcolor: 'primary.dark', width: 40 }} /></span>
          </div>
        </div>
        <div className="doctors-body">
          <Skeleton animation="wave" sx={{ minHeight: '26px', minWidth: '100px' }} />
          <Skeleton animation="wave" sx={{ minHeight: '26px', minWidth: '100px' }} />
          <Skeleton animation="wave" sx={{ minHeight: '26px', minWidth: '100px' }} />
          <div className="location d-flex" style={{ justifyContent: 'space-between' }}>
            <Skeleton animation="wave" sx={{ minHeight: '26px', minWidth: '100px' }} />
            <Skeleton animation="wave" sx={{ minHeight: '26px', minWidth: '100px' }} />
          </div>
          <div className="row row-sm">
            <div className="col-6">
              <Skeleton animation="wave" sx={{ height: '60px', width: '100%', borderRadius: '15px', padding: '34px 0', bgcolor: 'secondary.main' }} />
            </div>
            <div className="col-6">
              <Skeleton animation="wave" sx={{ height: '60px', width: '100%', borderRadius: '15px', padding: '34px 0', bgcolor: 'secondary.main' }} />

            </div>
          </div>
        </div>
      </div>
    </div>
  )
})