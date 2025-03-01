/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect } from 'react'
import useScssVar from '@/hooks/useScssVar'
import AOS from 'aos'

import {
  big_paw,
  small_paw
} from "../../../public/assets/imagepath";
import { BathTubSvg, BottelSvg, InjectionSvg, PetDoctorSvg } from '../../../public/assets/images/icons/IconsSvgs';
import { useTheme } from '@mui/material';






const ServiceSection: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme()
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);
  return (
    <Fragment>
      <section className="services-section-fourteen" style={{ ...muiVar, backgroundColor: theme.palette.background.paper }}>
        <div className="floating-bg">
          <img src={big_paw} alt="" className='imgColorPrimary' />
          <img src={small_paw} alt="" className='img' />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 aos" data-aos="fade-up">
              <div className="section-header-fourteen service-inner-fourteen">
                <div className="service-inner-fourteen">
                  <div className="service-inner-fourteen-two">
                    <h1>OUR SERVICES</h1>
                  </div>
                </div>
                <h2>What can We do</h2>
                <p>Our Professional Services</p>
              </div>
            </div>
          </div>
          <div className="row row-gap justify-content-center">
            <div className="col-lg-3 col-md-4 col-sm-12">
              <div className="our-services-list">
                <div className="service-icon">
                  <InjectionSvg />
                </div>
                <h2>Vaccination</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed.</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-12">
              <div className="our-services-list">
                <div className="service-icon">
                  <BottelSvg />
                </div>
                <h2>Pet Medicine</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed.</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-12">
              <div className="our-services-list">
                <div className="service-icon">
                  <BathTubSvg />
                </div>
                <h2>Pet Grooming</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed.</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-12">
              <div className="our-services-list">
                <div className="service-icon">
                  <PetDoctorSvg />
                </div>
                <h2>Pet Care</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default ServiceSection