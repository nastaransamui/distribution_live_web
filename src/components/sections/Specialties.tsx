/* eslint-disable @next/next/no-img-element */
import React, { FC, Fragment, useEffect, useState } from 'react';
import dynamic from 'next/dynamic'
const OwlCarousel = dynamic(() => import('react-owl-carousel'), {
  ssr: false,
})


import AOS from 'aos'
import Link from 'next/link';
import useScssVar from '@/hooks/useScssVar';
import Button from '@mui/material/Button';

//redux
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';


import TouchBallLoading from 'react-loadingg/lib/TouchBallLoading';
import Tooltip from '@mui/material/Tooltip';


const Specialties: FC = (() => {
  const specialities = useSelector((state: AppState) => state.specialities.value)

  const { muiVar } = useScssVar();

  const specialitysettings = {
    items: 4,
    loop: true,
    margin: 15,
    dots: false,
    nav: true,
    navContainer: '.slide-nav-1',
    navText: ['<i class="fas fa-chevron-left custom-arrow"></i>', '<i class="fas fa-chevron-right custom-arrow"></i>'],
    navElement: "button  aria-labelledby='slide-nav-1' aria-label='slide-nav-1'",
    autoplay: false,
    infinite: "true",
    slidestoscroll: 1,
    rtl: "true",
    rows: 1,
    responsive: {
      1049: {
        items: 6
      },
      800: {
        items: 3
      },
      776: {
        items: 2
      },
      567: {
        items: 2
      },
      200: {
        items: 1
      }
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      AOS.init({
        duration: 1200,
        once: true
      });
    }

  }, []);

  // remove extra button on rerun
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     if (specialities.length !== 0) {
  //       let m = document.getElementById('slide-nav-1')!
  //       if (m !== null && m.childNodes.length >= 2) {
  //         m.childNodes.forEach((child) => {
  //           m.removeChild(child)
  //         })
  //       }
  //     }

  //   }
  // }, [specialities])


  return (
    <Fragment>
      <section className="specialities-section-one" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-6 aos" data-aos="fade-up">
              <div className="section-header-one section-header-slider">
                <h2 className="section-title imgColorPrimary">Specialities</h2>
              </div>
            </div>
            <div className="col-md-6 aos" data-aos="fade-up">
              <div className="owl-nav slide-nav-1 text-end nav-control" id='slide-nav-1' />
            </div>
          </div>
          <div className="specialities-slider-one owl-theme aos" data-aos="fade-up" >


            {
              specialities.length == 0 ?
                <div className="form-search-btn aos" data-aos="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
                  <TouchBallLoading
                    size="large"
                    style={{ position: 'relative' }}
                    color={muiVar['--primaryMain']} /></div> :
                <Fragment>
                  <OwlCarousel {...specialitysettings} key={
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
                          <div className="item" key={spec._id}>
                            <div className="specialities-item">
                              <div className="specialities-img">
                                <span >
                                  <img src={src} alt='' id={spec.imageId} />
                                </span>
                              </div>
                              {
                                spec.specialities.length <= 13 ? <p>{spec.specialities}</p> :
                                  <Tooltip title={spec.specialities} arrow>
                                    <p>{spec.specialities.slice(0, 10) + ' ...'}</p>
                                  </Tooltip>
                              }
                              <p>{spec.users_id.length !== 0 && spec.users_id.length + ` Doctors`}</p>
                            </div>
                          </div>
                        )
                      })
                    }
                  </OwlCarousel>
                </Fragment>
            }

          </div>
          <div className="form-search-btn aos" data-aos="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
            <Button sx={{
              mt: { lg: 1.5, md: 2, sm: 2, xs: 2 },
            }} className="btn" onClick={(e) => e.preventDefault()}>
              See all Specialities
            </Button>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default Specialties