/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useMemo } from 'react'
import useScssVar from '@/hooks/useScssVar'
import dynamic from 'next/dynamic'
import Link from 'next/link';
import { AtomBondSvg } from '@/public/assets/images/icons/IconsSvgs';
import {
  add_circle, doctor_25_aspect, doctor_26_aspect, doctor_27_aspect, pulse_1, pulse_2, pulse_3
}
  from '@/public/assets/imagepath'
import { useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import Skeleton from '@mui/material/Skeleton';
const OwlCarousel = dynamic(() => import(`react-owl-carousel`), { ssr: false });


const DoctorsSection: FC = (() => {
  const { muiVar } = useScssVar();
  const settings = {
    items: 3,
    loop: true,
    margin: 55,
    dots: true,
    nav: true,
    navContainer: '.slide-nav-2',
    navText: ['<i class="fas fa-chevron-left custom-arrow"></i>', '<i class="fas fa-chevron-right custom-arrow"></i>'],

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
  const theme = useTheme()
  const bestDoctorsData = useSelector((state: AppState) => state.bestDoctorsData)
  const { bestDoctors } = bestDoctorsData;
  const dummyDoctorData = useMemo(() => {
    return [
      {
        img: doctor_25_aspect,
        avgRate: 4.1,
        speciality: "Paediatrician",
        name: "Dr. Gloria Smith",
        totalVote: 3621,
        totalPatients: 100,
        city: "New York",
        country: "USA"
      },
      {
        img: doctor_27_aspect,
        avgRate: 4.0,
        speciality: "Paediatrician",
        name: "Dr. Mark E. Wong",
        totalVote: 1053,
        totalPatients: 200,
        city: "New Mexico",
        country: "USA"
      },
      {
        img: doctor_26_aspect,
        avgRate: 4.0,
        speciality: "Paediatrician",
        name: "Dr. William M. Williams",
        totalVote: 876,
        totalPatients: 250,
        city: "Los Angels",
        country: "USA"
      },
      {
        img: doctor_25_aspect,
        avgRate: 4.1,
        speciality: "Paediatrician",
        name: "Dr. Gloria Smith",
        totalVote: 3621,
        totalPatients: 100,
        city: "New York",
        country: "USA"
      },
      {
        img: doctor_27_aspect,
        avgRate: 4.0,
        speciality: "Paediatrician",
        name: "Dr. Mark E. Wong",
        totalVote: 1053,
        totalPatients: 200,
        city: "New Mexico",
        country: "USA"
      },
      {
        img: doctor_26_aspect,
        avgRate: 4.0,
        speciality: "Paediatrician",
        name: "Dr. William M. Williams",
        totalVote: 876,
        totalPatients: 250,
        city: "Los Angels",
        country: "USA"
      },
    ]
  }, [])
  return (
    <Fragment>
      <div className="our-doctor-thirteen common-padding" style={{
        ...muiVar,
        backgroundColor: theme.palette.background.paper,
        backgroundImage: `url(/assets/images/cloud-bg_${theme.palette.mode}.webp)`
      }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 aos" data-aos="fade-up">
              <div className="section-header-thirteen">
                <div className="section-inner-thirteen">
                  <AtomBondSvg />
                </div>
                <h2>Our Doctors</h2>
              </div>
            </div>
          </div>
          <div className=" our-slider-thirteen owl-theme aos" data-aos="fade-up" >
            <OwlCarousel {...settings}>
              {
                bestDoctors == null ?
                  (Array(4).fill(0).map((_, index) => (
                    <PadiatricDoctorSkeleton key={index} />
                  ))) :
                  bestDoctors.length == 0 ?
                    dummyDoctorData.map((doctor, index) => {
                      return (
                        <div className="our-doctor-thirteen-all" key={index}>
                          <div className="our-doctor-thirteen-img">
                            <img
                              src={doctor.img}
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <div className="our-doctor-content" style={{ borderRadius: `0px 0px 10px 10px` }}>
                            <Link href="/doctors/search">{doctor.name}</Link>
                            <div className="our-doctor-content-inner">
                              <span>{doctor.speciality}</span>
                              <div className="reviews-ratings">
                                <p>
                                  <span>
                                    <i className="fas fa-star" /> {doctor.avgRate}
                                  </span>{" "}
                                  ({doctor.totalVote})
                                </p>
                              </div>
                            </div>
                            <h6>+{doctor.totalPatients} Patients</h6>
                            <p>
                              <i className="fa-solid fa-location-dot" /> {doctor.city}, {doctor.country}
                            </p>
                            <div className="our-doctor-thirteen-imgone">
                              <img
                                src={add_circle}
                                alt=""
                                className="img-fluid imgColorSecondary"
                              />
                            </div>
                          </div>
                        </div>
                      )
                    }) :
                    (
                      bestDoctors.slice(0, 4).map((doctor, index) => {
                        return (
                          <div className="our-doctor-thirteen-all" key={index}>
                            <div className="our-doctor-thirteen-img">
                              <img
                                src={doctor.profileImage}
                                alt=""
                                className="img-fluid"
                              />
                            </div>
                            <div className="our-doctor-content" style={{ borderRadius: `0px 0px 10px 10px` }}>
                              <Link href={`/doctors/profile/${btoa(doctor._id)}`}>Dr. {doctor.fullName}</Link>
                              <div className="our-doctor-content-inner">
                                <span>{doctor?.specialities?.[0]?.specialities}</span>
                                <div className="reviews-ratings">
                                  <p>
                                    <span>
                                      <i className="fas fa-star" /> {doctor.avgRate}
                                    </span>{" "}
                                    ({doctor?.totalVote})
                                  </p>
                                </div>
                              </div>
                              <h6>+{doctor?.patientCount} Patients</h6>
                              <p>
                                <i className="fa-solid fa-location-dot" /> {doctor?.city}
                              </p>
                              <p>
                                <i className="fa-solid fa-location-dot" />{doctor.country}
                              </p>
                              <div className="our-doctor-thirteen-imgone">
                                <img
                                  src={add_circle}
                                  alt=""
                                  className="img-fluid imgColorSecondary"
                                />
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )
              }
            </OwlCarousel>
          </div>
        </div>
        <div className="our-doctor-thirteen-one">
          <img src={pulse_1} alt="" className='imgColorSecondary' />
          <img src={pulse_3} alt="" className='imgColorSecondary' />
          <img src={pulse_2} alt="" className='imgColorSecondary' />
          <img src={pulse_3} alt="" className='imgColorSecondary' />
        </div>
      </div>
    </Fragment>
  )
});

export default DoctorsSection;

export const PadiatricDoctorSkeleton: FC = (() => {

  return (
    <div className="our-doctor-thirteen-all">
      <div className="our-doctor-thirteen-img">
        <Skeleton animation="wave" variant="rectangular" width="100%" height={450} sx={{ borderRadius: `20px 20px 0px 0px` }} />

      </div>
      <div className="our-doctor-content" style={{ borderRadius: `0px 0px 10px 10px` }}>
        <Skeleton animation="wave" variant="rectangular" width="50%" height={10} sx={{ borderRadius: `5px`, bgcolor: 'primary.light', mb: 3 }} />
        <div className="our-doctor-content-inner">
          {/* <span>Paediatrician</span> */}
          <Skeleton component="span" animation="wave" variant="rectangular" height={25} width={150} />

          <div className="reviews-ratings">
            <p>
              <Skeleton component="span" animation="wave" variant="rectangular" height={10} width={100} sx={{ backgroundColor: '#fbbf24', borderRadius: 2 }} />

            </p>
          </div>
        </div>
        <Skeleton component="h6" animation="wave" variant="rectangular" height={5} width={100} sx={{ bgcolor: 'text.disabled', borderRadius: 2 }} />

        <p>
          <Skeleton component="i" animation="wave" variant="rectangular" height={5} width={100} sx={{ bgcolor: 'text.disabled', borderRadius: 2 }} />

        </p>
        <div className="our-doctor-thirteen-imgone">
          <img
            src={add_circle}
            alt=""
            className="img-fluid imgColorSecondary"
          />
        </div>
      </div>
    </div>
  )
})