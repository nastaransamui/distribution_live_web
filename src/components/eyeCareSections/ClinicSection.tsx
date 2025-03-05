/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useMemo } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useTheme } from '@mui/material';
import {
  clinic_bg_01, eyeDoctor01, eyeDoctor02, eyeDoctor03, eyeDoctor04, eyeDoctor05
} from "../../../public/assets/imagepath";
import { EyeIconSvg } from '../../../public/assets/images/icons/IconsSvgs';
const OwlCarousel = dynamic(() => import('react-owl-carousel'), {
  ssr: false,
})
import AOS from 'aos'
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import Rating from '@mui/material/Rating'
import Skeleton from '@mui/material/Skeleton'
const ClinicSection: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  const doctersettings = {
    items: 3,
    loop: true,
    margin: 15,
    dots: false,
    nav: true,
    //   navContainer: '.slide-nav-2',
    navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
    navElement: "button  aria-labelledby='slide-nav-1' aria-label='slide-nav-1'",
    autoplay: false,
    infinite: "true",

    slidestoscroll: 1,
    rtl: "true",
    rows: 1,

    responsive: {
      1049: {
        items: 3
      },
      992: {
        items: 3
      },
      800: {
        items: 3
      },
      776: {
        items: 3
      },
      567: {
        items: 1
      },
      200: {
        items: 1
      }
    }
  }
  const bestEyeCareDoctors = useSelector((state: AppState) => state.bestEyeCareDoctorsData)
  const { bestDoctors } = bestEyeCareDoctors;
  const dummyDoctorData = useMemo(() => {
    return [
      {
        img: eyeDoctor01,
        avgRate: 3.8,
        speciality: "Ophthalmology",
        name: "Dr. Andrea",
        experience: 8
      },
      {
        img: eyeDoctor02,
        avgRate: 4.5,
        speciality: "Ophthalmology",
        name: "Dr. Elizabeth Bella",
        experience: 6
      },
      {
        img: eyeDoctor03,
        avgRate: 4.0,
        speciality: "Ophthalmology",
        name: "Dr. Andrea",
        experience: 7
      },
      {
        img: eyeDoctor04,
        avgRate: 3.7,
        speciality: "Ophthalmology",
        name: "Dr. Gabrielle Carolyn",
        experience: 4
      },
    ]
  }, [])
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);
  return (
    <Fragment>
      <section className="eyeclinics-section" style={{ ...muiVar, backgroundColor: theme.palette.background.paper }}>
        <div className="container" >
          <div className="row">
            <div className="col-md-12 aos" data-aos="fade-up">
              <div className="section-heading text-center sec-heading-eye">
                <EyeIconSvg />
                <h2>
                  <span>Our</span> Specialties
                </h2>
                <p>The Great Place Of Eyecare Hospital Center</p>
              </div>
            </div>
          </div>
          <div className="eye-clinic owl-them aos" data-aos="fade-up" style={{ position: 'relative', zIndex: 2 }}>
            <OwlCarousel {...doctersettings}>
              {
                bestDoctors == null ?
                  (Array(3).fill(0).map((_, index) => (
                    <EyeDoctorSkeleton key={index} />
                  ))) :
                  bestDoctors.length == 0 ?
                    (dummyDoctorData.map((doctor, index) => {
                      return (
                        <div className="item" key={index}>
                          <div className="our-doctors-card eye-doc">
                            <div className="doctors-header">
                              <Link href="/doctors/search" aria-label='doctor search'>
                                <img
                                  src={doctor.img}
                                  alt=""
                                  className="img-fluid"
                                />
                              </Link>
                            </div>
                            <div className="doctors-body">
                              <h3>
                                <Link href="/doctors/search" aria-label='doctor search'>{doctor.name}</Link>
                              </h3>
                              <p>{doctor.speciality}</p>
                              <h4>{doctor.experience}+ Years Experience Overall</h4>
                              <div className="rating" style={{ display: 'flex' }}>
                                <Rating
                                  name="read-only"
                                  precision={0.5}
                                  value={doctor.avgRate}
                                  readOnly
                                  size='small' />
                                <span >{doctor.avgRate}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })) :
                    (bestDoctors.slice(0, 4).map((doctor, index) => {
                      return (
                        <div className="item" key={index}>
                          <div className="our-doctors-card eye-doc">
                            <div className="doctors-header">
                              <Link href={`/doctors/profile/${btoa(doctor?._id)}`} aria-label='doctor search'>
                                <img
                                  src={doctor.profileImage}
                                  alt=""
                                  className="img-fluid"
                                />
                              </Link>
                            </div>
                            <div className="doctors-body">
                              <h3>
                                <Link href={`/doctors/profile/${btoa(doctor?._id)}`} aria-label='doctor search'>Dr. {doctor.fullName}</Link>
                              </h3>
                              <p>{doctor?.specialities?.[0]?.specialities}</p>
                              <h4>{doctor.totalExperience}+ Years Experience Overall</h4>
                              <div className="rating" style={{ display: 'flex' }}>
                                <Rating
                                  name="read-only"
                                  precision={0.5}
                                  value={doctor.avgRate}
                                  readOnly
                                  size='small' />
                                <span >{doctor.avgRate}</span>
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
        <div className="ban-bg" style={{ opacity: 0.3, position: 'relative', top: -390, left: -50 }}>
          <img
            src={clinic_bg_01}
            alt=""
            className="img-fluid bg-08 img"

          />
        </div>
      </section>
    </Fragment>
  )
})

export default ClinicSection;

export const EyeDoctorSkeleton: FC = (() => {
  return (
    <div className="item">
      <div className="our-doctors-card eye-doc">
        <div className="doctors-header">
          <Skeleton animation="wave" variant="rectangular" width="100%" height={450} sx={{ borderRadius: `20px` }} />
        </div>
        <div className="doctors-body">
          <h3>
            <Skeleton animation="wave" variant="rectangular" width="50%" height={10} sx={{ borderRadius: `5px`, bgcolor: 'primary.dark' }} />
          </h3>
          <Skeleton animation="wave" variant="rectangular" width="40%" height={10} sx={{ borderRadius: `5px`, bgcolor: 'text.color', mt: 2 }} />

          <Skeleton animation="wave" variant="rectangular" width="50%" height={10} sx={{ borderRadius: `5px`, bgcolor: 'primary.main', mt: 2 }} />

          <Skeleton animation="wave" variant="rectangular" width="30%" height={10} sx={{ borderRadius: `5px`, bgcolor: '#ffaf14', mt: 2 }} />

        </div>
      </div>
    </div>
  )
})