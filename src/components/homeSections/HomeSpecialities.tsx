
/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect } from "react";
import Slider from "react-slick";
import AOS from 'aos'
import useScssVar from "@/hooks/useScssVar";

//redux
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { useTheme } from "@mui/material";

//utility
import BeatLoader from 'react-spinners/BeatLoader';
import Tooltip from '@mui/material/Tooltip';

const HomeSpecialities: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  const specialities = useSelector((state: AppState) => state.specialities.value)

  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);
  const settings = {
    dots: true,
    autoplay: false,
    infinite: true,
    variableWidth: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          centerMode: true,
        }
      },
      {
        breakpoint: 993,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,

        }
      }
    ]
  };

  return (
    <Fragment>
      <section className="section section-specialities" style={muiVar}>
        <div className="container-fluid">
          <div className="section-header text-center">
            <h2>Clinic and Specialities</h2>
            {/* <p className="sub-title">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p> */}
          </div>
          <div className="row justify-content-center">
            <div className="col-md-9">
              <div className="specialities-slider slider">
                {
                  specialities.length == 0 ?
                    <div className="form-search-btn aos" data-aos="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
                      <BeatLoader

                        style={{ position: 'relative' }}
                        color={theme.palette.primary.main} />
                    </div> :
                    <Slider {...settings} key={
                      specialities.map((a) => a?.specialities).toString() +
                      specialities.map((a) => a?.image).toString() +
                      specialities.map((a) => a?.imageId).toString() +
                      specialities.map((a) => a?.users_id).toString()
                    }>
                      {
                        specialities.map((spec) => {
                          let img = document.getElementById(spec.imageId) as any
                          let src = `${spec.image}`
                          if (img !== null) {
                            src = `${spec.image}`
                            img.src = src
                          }
                          return (
                            <div key={spec._id}>
                              <div className="speicality-item text-center">
                                <div className="speicality-img">
                                  <img src={src} className="img-fluid" alt="" id={spec.imageId} />
                                  <span><i className="fa fa-circle" aria-hidden="true"></i></span>
                                </div>
                                {
                                  spec.specialities.length <= 13 ? <p>{spec.specialities}</p> :
                                    <Tooltip title={spec.specialities} arrow>
                                      <p>{spec.specialities.slice(0, 10) + ' ...'}</p>
                                    </Tooltip>
                                }
                                <p style={{ marginTop: 10 }}>{spec.users_id.length !== 0 && spec.users_id.length + ` Doctors`}</p>
                              </div>
                            </div>
                          )
                        })
                      }
                    </Slider>
                }

              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default HomeSpecialities;