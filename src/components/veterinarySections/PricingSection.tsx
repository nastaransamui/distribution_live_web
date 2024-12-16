/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect } from 'react'
import Link from 'next/link'
import AOS from 'aos'
import useScssVar from '@/hooks/useScssVar'

import {
  home_12_pricing_bg_3,
  home_12_pricing_bg_4,
  home_12_pricing_bg_5
} from "../../../public/assets/imagepath";

const PricingSection: FC = (() => {
  const { muiVar } = useScssVar();

  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);
  return (
    <Fragment>
      <section className="home-twelve-pricing" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 aos" data-aos="fade-up">
              <div className="section-header-fourteen service-inner-fourteen">
                <div className="service-inner-fourteen">
                  <div className="service-inner-fourteen-two">
                    <h3>OUR PACKAGES</h3>
                  </div>
                </div>
                <h4>Our Pricing Plan</h4>
                <p>Our Special Package</p>
              </div>
            </div>
          </div>
          <div className="row row-gap justify-content-center">
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div className="price-card-twelve">
                <div className="price-bg">
                  <img src={home_12_pricing_bg_4} alt="" className='img' />
                  <img src={home_12_pricing_bg_5} alt="" className='img' />
                  <img src={home_12_pricing_bg_3} alt="" className='img' />
                </div>
                <div className="price-content">
                  <div className="card-title">
                    <h3>Friendly Pack</h3>
                  </div>
                  <div className="price">
                    <h4>
                      <sup>$</sup> 150 / <span>Visit</span>
                    </h4>
                  </div>
                  <div className="pack-details">
                    <ul>
                      <li>
                        <i className="feather-check-circle" />
                        Basic Checkup
                      </li>
                      <li>
                        <i className="feather-check-circle" />
                        Grooming
                      </li>
                      <li>
                        <i className="feather-check-circle" />
                        Pet Shower
                      </li>
                      <li>
                        <i className="feather-check-circle" />
                        Vaccination
                      </li>
                    </ul>
                  </div>
                  <div className="price-btn">
                    <Link href="pricing" className="btn">
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div className="price-card-twelve active">
                <div className="price-bg">
                  <img src={home_12_pricing_bg_4} alt="" className='imgColorPrimary' />
                  <img src={home_12_pricing_bg_5} alt="" className='imgColorPrimary' />
                  <img src={home_12_pricing_bg_3} alt="" className='imgColorPrimary' />
                </div>
                <div className="price-content">
                  <div className="card-title">
                    <h3>Exclusive Pack</h3>
                    <span>Best Offer</span>
                  </div>
                  <div className="price">
                    <h4>
                      <sup>$</sup> 175 / <span>Visit</span>
                    </h4>
                  </div>
                  <div className="pack-details">
                    <ul>
                      <li>
                        <i className="feather-check-circle" />
                        Basic Checkup
                      </li>
                      <li>
                        <i className="feather-check-circle" />
                        Grooming
                      </li>
                      <li>
                        <i className="feather-check-circle" />
                        Pet Shower
                      </li>
                      <li>
                        <i className="feather-check-circle" />
                        Vaccination
                      </li>
                      <li>
                        <i className="feather-check-circle" />
                        Hair fall Pack
                      </li>
                      <li>
                        <i className="feather-check-circle" />
                        30 day Services
                      </li>
                    </ul>
                  </div>
                  <div className="price-btn">
                    <Link href="pricing" className="btn">
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div className="price-card-twelve">
                <div className="price-bg">
                  <img src={home_12_pricing_bg_4} alt="" className='img' />
                  <img src={home_12_pricing_bg_5} alt="" className='img' />
                  <img src={home_12_pricing_bg_3} alt="" className='img' />
                </div>
                <div className="price-content">
                  <div className="card-title">
                    <h3>Family Pack</h3>
                  </div>
                  <div className="price">
                    <h4>
                      <sup>$</sup> 200 / <span>Visit</span>
                    </h4>
                  </div>
                  <div className="pack-details">
                    <ul>
                      <li>
                        <i className="feather-check-circle" />
                        30 day Services
                      </li>
                      <li>
                        <i className="feather-check-circle" />
                        Grooming
                      </li>
                      <li>
                        <i className="feather-check-circle" />
                        Pet Shower
                      </li>
                      <li>
                        <i className="feather-check-circle" />
                        Vaccination
                      </li>
                    </ul>
                  </div>
                  <div className="price-btn">
                    <Link href="pricing" className="btn">
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default PricingSection;