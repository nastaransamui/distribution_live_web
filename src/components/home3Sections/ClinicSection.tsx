/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useCallback, useRef } from 'react'
import Link from 'next/link';

//redux
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';


import {
  Shape1,
  Shape2,
} from '../../../public/assets/imagepath'
import useScssVar from '@/hooks/useScssVar';
import { useTheme } from '@mui/material';
import BeatLoader from 'react-spinners/BeatLoader';
import Tooltip from '@mui/material/Tooltip';
import { SwiperOptions } from 'swiper/types';
import { FreeMode, Navigation } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';


function UrlExists(a: string, b: string) {
  return typeof a === 'string' && typeof b === 'string'
    ? a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
    : a === b;
}

const ClinicSection: FC = (() => {
  var { muiVar } = useScssVar();
  const theme = useTheme();
  const specialities = useSelector((state: AppState) => state.specialities.value)

  const specialitysettings = {
    items: 6,
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
      '1200': {
        items: 6
      },
      '992': {
        items: 3
      },
      '800': {
        items: 3
      },
      '776': {
        items: 2
      },
      '567': {
        items: 1
      },
      '200': {
        items: 1
      }
    }
  }

  const clinicSettings: SwiperOptions = {
    slidesPerView: 6,
    spaceBetween: 15,
    loop: false,

    modules: [Navigation, FreeMode],
    navigation: {
      prevEl: null,
      nextEl: null,
    },
    breakpoints: {
      1200: { slidesPerView: 6 },
      992: { slidesPerView: 3 },
      800: { slidesPerView: 3 },
      776: { slidesPerView: 2 },
      567: { slidesPerView: 2 },
      200: { slidesPerView: 1 },
    },
  };

  const swiperRef = useRef<SwiperInstance | null>(null);

  const handlePrev = useCallback(() => {
    swiperRef.current?.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    swiperRef.current?.slideNext();
  }, []);
  return (
    <Fragment>
      <section className="clinics-section" style={muiVar}>
        <div className="shapes">
          <img src={Shape1} className="img-fluid shape-1 shapeFill" alt='' />
          <img src={Shape2} className="img-fluid shape-2 shapeFill" alt='' />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="section-heading">
                <h2>Clinic &amp; Specialities</h2>
                <p>Access to expert physicians and surgeons, advanced technologies and top-quality surgery facilities right here.</p>
              </div>
            </div>
            <div className="col-md-6 text-end aos aos-init aos-animate">
              <div className="owl-nav slide-nav-1 text-end nav-control" id='slide-nav-1'>

                <button className='owl-prev' onClick={handlePrev}>
                  <i className="fas fa-chevron-left custom-arrow" />
                </button>
                <button className='owl-next' onClick={handleNext}>
                  <i className="fas fa-chevron-right custom-arrow" />
                </button>
              </div>
            </div>
          </div>
          <div className="clinics owl-theme aos owl-loaded owl-drag aos-init aos-animate" data-aos="fade-up">
            {
              specialities.length == 0 ?
                <div className="form-search-btn aos" data-aos="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
                  <BeatLoader

                    style={{ position: 'relative' }}
                    color={theme.palette.primary.main} />
                </div> :
                <Fragment>
                  <Swiper
                    {...clinicSettings}
                    onSwiper={(swiper) => {
                      swiperRef.current = swiper;
                    }} key={
                      specialities.map((a) => a?.specialities).toString() +
                      specialities.map((a) => a?.image).toString() +
                      specialities.map((a) => a?.imageId).toString() +
                      specialities.map((a) => a?.users_id).toString()
                    }>
                    {
                      specialities.map((spec) => {
                        let img = document.getElementById(spec.imageId) as any
                        let src = `${spec.image}`
                        // var areEqual = spec.imageId.toUpperCase() === spec.specialities.toUpperCase();
                        if (img !== null) {
                          src = `${spec.image}`
                          img.src = src
                        }
                        let bgImage =
                          UrlExists(spec.imageId, spec.specialities) ?
                            `/assets/images/clinics/${spec.imageId}_scale.webp` :
                            `/assets/images/clinics/defaultBg.webp`
                        return (
                          <SwiperSlide className="item" key={spec._id}>
                            <div className="clinic-item">
                              <div className="clinics-card">
                                <div className="clinics-img">
                                  <img src={bgImage} className="img-fluid" alt='' />
                                </div>
                                <div className="clinics-info">
                                  <img src={src} className="img-fluid " alt='' />
                                  <Link href="/doctors/search" aria-label={`${spec.specialities}`}>
                                    {
                                      spec.specialities.length <= 13 ? <span>{spec.specialities}</span> :
                                        <Tooltip title={spec.specialities} arrow>
                                          <span>{spec.specialities.slice(0, 10) + ' ...'}</span>
                                        </Tooltip>
                                    }
                                  </Link>
                                </div>
                              </div>
                              <div className="clinics-icon">
                                <Link href="/doctors/search" aria-label='clinics-icons'><i className="fas fa-long-arrow-alt-right" /></Link>
                              </div>
                            </div>
                          </SwiperSlide>
                        )
                      })
                    }
                  </Swiper>
                </Fragment>
            }
          </div>
        </div>
      </section>
    </Fragment>
  )
});
export default ClinicSection