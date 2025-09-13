/* eslint-disable @next/next/no-img-element */
import { Fragment, FC, useEffect, useMemo } from "react";
import Link from "next/link";
import Slider from "react-slick";
import AOS from 'aos'
import useScssVar from "@/hooks/useScssVar";
import { useTheme } from "@mui/material";
import { Doc01, Doc02, Doc03, Doc04, doctors_profile } from "@/public/assets/imagepath";
import { useSelector } from "react-redux";
import { AppState } from "@/redux/store";
import Rating from '@mui/material/Rating'
import Skeleton from '@mui/material/Skeleton'
import { formatNumberWithCommas } from "../DoctorDashboardSections/ScheduleTiming";
import { FavButton } from "../SearchDoctorSections/DoctorSearchResults";
const HomeBookDoctor: FC = (() => {
  const { muiVar } = useScssVar();
  const bestDoctorsData = useSelector((state: AppState) => state.bestDoctorsData)
  const { bestDoctors } = bestDoctorsData;
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);
  useEffect(() => {
    const prevArrow = document.querySelector(".slick-prev");
    if (prevArrow) {
      (prevArrow as HTMLElement).style.left = "-35px";
    }
  }, [bestDoctorsData]);
  const theme = useTheme();
  const settings = {
    width: 400,
    dots: false,

    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerPadding: '0px',
    arrows: true,
    centerMode: true,

    responsive: [
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,

        }
      },
      {
        breakpoint: 993,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,

        }
      }
    ]

  };
  const dummyDoctorData = useMemo(() => {
    return [
      {
        img: Doc01,
        name: 'Dr. Ruby Perrin',
        link: "/doctors/search",
        specialities: 'MDS - Periodontology and Oral Implantology, BDS',
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
        specialities: 'BDS, MDS - Oral & Maxillofacial Surgery',
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
        specialities: 'MBBS, MD - General Medicine, DNB - Cardiology',
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
        specialities: 'MBBS, MS - General Surgery, MCh - Urology',
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
      <section className="section section-doctor" style={muiVar}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4">
              <div className="section-header aos">
                <h2>Book Our Doctor</h2>
                <p>Lorem Ipsum is simply dummy text </p>
              </div>
              <div className="about-content aos" >
                <p>It is a long established fact that a reader will be distracted by the readable
                  content of a page when looking at its layout. The point of using Lorem Ipsum.</p>
                <p>web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes</p>
                <Link href="/doctors/search" >Reserve</Link>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="doctor-slider slider ">
                <Slider {...settings}>
                  {
                    bestDoctors == null ?
                      (
                        Array(3).fill(0).map((_, index) => (
                          <div key={index}>
                            <DoctorSkeletonHome />
                          </div>
                        ))
                      ) :
                      bestDoctors.length == 0 ?
                        (
                          dummyDoctorData.map((doctor, index) => {
                            return (
                              <div key={index}>
                                <div className="profile-widget">
                                  <div className="doc-img">
                                    <Link href={doctor.link}>
                                      <img className="img-fluid" alt="User" src={doctor.img} />
                                    </Link>
                                    <Link href="#" className="fav-btn">
                                      <i className="far fa-bookmark"></i>
                                    </Link>
                                  </div>
                                  <div className="pro-content">
                                    <h3 className="title">
                                      <Link href={doctor.link}>{doctor.name}</Link>
                                      <i className="fas fa-check-circle verified"></i>
                                    </h3>
                                    <p className="speciality">{doctor.specialities}</p>
                                    <div className="rating" style={{ display: 'flex' }}>
                                      <Rating
                                        name="read-only"
                                        precision={0.5}
                                        value={doctor.avgRating}
                                        readOnly
                                        size='small' />
                                      <span className="d-inline-block average-rating">({doctor.vote})</span>
                                    </div>
                                    <ul className="available-info">
                                      <li>
                                        <i className="fas fa-map-marker-alt"></i> {doctor.city}, {doctor.country}
                                      </li>
                                      <li>
                                        <i className="far fa-clock"></i> {doctor.available}
                                      </li>
                                      <li>
                                        <i className="far fa-money-bill-alt"></i>{doctor.avaragePrice} {" "}
                                        <i className="fas fa-info-circle" data-toggle="tooltip" title="Lorem Ipsum"></i>
                                      </li>
                                    </ul>
                                    <div className="row row-sm">
                                      <div className="col-6">
                                        <Link href={doctor.link} className="btn view-btn">View Profile</Link>
                                      </div>
                                      <div className="col-6">
                                        <Link href={doctor.link} className="btn view-btn">Book Now</Link>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })
                        ) :
                        (bestDoctors.map((doctor, index) => {
                          return (
                            <div key={index}>
                              <div className="profile-widget">
                                <div className="doc-img">
                                  <Link href={`/doctors/profile/${btoa(doctor?._id)}`}>
                                    <img className="img-fluid" alt="User" src={doctor.profileImage == '' ? doctors_profile : doctor.profileImage} />
                                  </Link>
                                  <Link href="#" onClick={(e) => e.preventDefault()} className="fav-btn">
                                    <FavButton index={index} doctor={doctor} />
                                  </Link>
                                </div>
                                <div className="pro-content">
                                  <h3 className="title">
                                    <Link href={`/doctors/profile/${btoa(doctor?._id)}`}>{`Dr. ${doctor.fullName}`}</Link>
                                    <i className="fas fa-check-circle verified"></i>
                                  </h3>
                                  <p className="speciality">{doctor?.specialities?.[0]?.specialities}</p>
                                  <div className="rating" style={{ display: 'flex' }}>
                                    <Rating
                                      name="read-only"
                                      precision={0.5}
                                      value={doctor.avgRate}
                                      readOnly
                                      size='small' />
                                    <span className="d-inline-block average-rating">({doctor.recommendScore})</span>
                                  </div>
                                  <ul className="available-info">
                                    <li>
                                      <i className="fas fa-map-marker-alt"></i> {doctor.city}, {doctor.country}
                                    </li>
                                    {doctor.timeslots.map((slot, index) => (
                                      <Fragment key={index}>
                                        <li>
                                          <i className="fa fa-check" style={{ width: "10px", color: slot.isThisMonthAvailable ? "green" : "crimson" }}></i>
                                          {slot.isThisMonthAvailable ? " Available This Month" : " Not Available This Month"}
                                        </li>
                                        <li>
                                          <i className="fa fa-check" style={{ width: "10px", color: slot.isThisWeekAvailable ? "green" : "crimson" }}></i>
                                          {slot.isThisWeekAvailable ? " Available This Week" : " Not Available This Week"}
                                        </li>
                                        <li>
                                          <i className="fa fa-check" style={{ width: "10px", color: slot.isTodayAvailable ? "green" : "crimson" }}></i>
                                          {slot.isTodayAvailable ? " Available Today" : " Not Available Today"}
                                        </li>
                                        <li>
                                          <i className="fa fa-check" style={{ width: "10px", color: slot.isTommorowAvailable ? "green" : "crimson" }}></i>
                                          {slot.isTommorowAvailable ? " Available Tomorrow" : " Not Available Tomorrow"}
                                        </li>
                                      </Fragment>
                                    ))}
                                    <li>
                                      <i className="far fa-money-bill-alt"></i>
                                      {" "} {doctor?.currency?.[0]?.currency_symbol}
                                      {formatNumberWithCommas(doctor?.timeslots?.[0]?.averageHourlyPrice?.toFixed(0) || '0')} {" "}

                                    </li>
                                  </ul>
                                  <div className="row row-sm">
                                    <div className="col-6">
                                      <Link href={`/doctors/profile/${btoa(doctor?._id)}`} className="btn view-btn">View Profile</Link>
                                    </div>
                                    <div className="col-6">
                                      <Link href={`/doctors/search?keyWord=${doctor.fullName}`} className="btn view-btn">Book Now</Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })
                        )
                  }
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
})

export default HomeBookDoctor;

export const DoctorSkeletonHome: FC = (() => {
  const theme = useTheme();
  return (
    <div className="profile-widget">
      <div className="doc-img">
        <Skeleton animation="wave" variant="rectangular" width="100%" height={250} />
      </div>
      <div className="pro-content">
        <Skeleton
          animation="wave"
          variant="rectangular"
          sx={{ borderRadius: '8px', minHeight: '26px', minWidth: '55px' }} />

        <Skeleton
          animation="wave"
          variant="rectangular"
          sx={{ borderRadius: '8px', minHeight: '6px', minWidth: '55px', marginTop: "20px" }} />
        <div className="rating">
          <Skeleton
            animation="wave"
            variant="rectangular"
            sx={{ borderRadius: '8px', minHeight: '6px', minWidth: '25px', marginTop: "20px" }} />
        </div>
        <ul className="available-info">
          <li>
            <Skeleton
              animation="wave"
              variant="rectangular"
              sx={{ borderRadius: '8px', minHeight: '6px', minWidth: '25px', marginTop: "20px" }} />
          </li>
          <li>
            <Skeleton
              animation="wave"
              variant="rectangular"
              sx={{ borderRadius: '8px', minHeight: '6px', minWidth: '25px', marginTop: "20px" }} />
          </li>
          <li>
            <Skeleton
              animation="wave"
              variant="rectangular"
              sx={{ borderRadius: '8px', minHeight: '6px', minWidth: '25px', marginTop: "20px" }} />
          </li>
        </ul>
        <div className="row row-sm">
          <div className="col-6">
            <Skeleton
              animation="wave"
              variant="rectangular"
              sx={{ borderRadius: '4px', height: '40px', border: `1px solid ${theme.palette.secondary.main}` }} />
          </div>
          <div className="col-6">
            <Skeleton
              animation="wave"
              variant="rectangular"
              sx={{ borderRadius: '4px', height: '40px', border: `1px solid ${theme.palette.primary.main}` }} />
          </div>
        </div>
      </div>
    </div >
  )
})