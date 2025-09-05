/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useMemo } from 'react'
import dynamic from 'next/dynamic'
import useScssVar from '@/hooks/useScssVar'
import { Doc04, Doc03, Doc02, Doc01, doctors_profile } from '../../../public/assets/imagepath';
import { AppState } from '@/redux/store';
import { useSelector } from 'react-redux';
import Skeleton from "@mui/material/Skeleton"
const OwlCarousel = dynamic(() => import(`react-owl-carousel`), { ssr: false })



const ExpertTeam: FC = (() => {
  const { muiVar } = useScssVar();
  const bestDoctorsData = useSelector((state: AppState) => state.bestDoctorsData)
  const { bestDoctors } = bestDoctorsData;
  const settings = {
    margin: 0,
    center: true,
    loop: true,
    nav: false,
    dots: false,
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 1,
        margin: 15,
      },
      1000: {
        items: 3,
      }
    }
  };

  const dummyDoctorData = useMemo(() => {
    return [
      {
        img: Doc03,
        name: "Dr. William Wogner",
        speciality: "Cosmetic Surgery",
      },
      {
        img: Doc02,
        name: "Dr. Leslie Alexander",
        speciality: "Aesthetic Surgery",
      },
      {
        img: Doc01,
        name: "Dr. William Wogner",
        speciality: "Cosmetic Surgery",
      },
      {
        img: Doc04,
        name: "Dr. Leslie Alexander",
        speciality: "Aesthetic Surgery",
      },
    ]
  }, [])
  return (
    <Fragment>
      <section className="experts-section-sixteen" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-header-sixteen section-header-sixteentwo text-center">
                <p>Our Team</p>
                <h2>Our experts team</h2>
              </div>
            </div>
          </div>
          <div className="slider slider-sixteen aos" data-aos="zoom-in-up">
            <div className=" owl-carousel custome_slides owl-loaded owl-drag" id="slide-experts">
              <OwlCarousel id="customer-testimonoals" {...settings}>
                {
                  bestDoctors == null ?
                    <>
                      {
                        Array.from(Array(2).keys()).map((i) => (
                          <CosmeticDoctorsSkeleton key={i} />
                        ))
                      }
                    </> :
                    bestDoctors.length == 0 ?
                      <>
                        {
                          dummyDoctorData.map((doctor, index) => {
                            return (
                              <div className="test_imgs" key={index}>
                                <div className="main-reviewimages">
                                  <img src={doctor.img} alt="" className="img-fluid" />
                                </div>
                                <div className="testimonal-contents">
                                  <h3>{doctor.name}</h3>
                                  <span>{doctor.speciality}</span>
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
                              <div className="test_imgs" key={index}>
                                <div className="main-reviewimages">
                                  <img src={doctor.profileImage !== '' ? doctor.profileImage : doctors_profile} alt="" className="img-fluid" />
                                </div>
                                <div className="testimonal-contents">
                                  <h3>Dr. {doctor.fullName}</h3>
                                  <span>{doctor?.specialities?.[0]?.specialities}</span>
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
        </div>
      </section>
    </Fragment>
  )
});

export default ExpertTeam;

export const CosmeticDoctorsSkeleton: FC = (() => {
  return (
    <div className="test_imgs">
      <div className="main-reviewimages">
        <Skeleton animation="wave" variant='rectangular' height={250} sx={{ borderRadius: '5px 5px 0 0' }} />
      </div>
      <div className="testimonal-contents" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <Skeleton component="h3" width={150} animation="wave" variant='rectangular' height={5} sx={{ borderRadius: '8px', backgroundColor: 'primary.main' }} />
        <Skeleton component="span" width={100} animation="wave" variant='rectangular' height={5} sx={{ borderRadius: '8px', backgroundColor: 'secondary.light' }} />

      </div>
    </div>
  )
})