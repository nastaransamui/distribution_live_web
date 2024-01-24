/* eslint-disable @next/next/no-img-element */
import React, { Fragment, useEffect, FC, useState } from "react";
import Link from 'next/link';
import AOS from 'aos'
import useScssVar from '@/hooks/useScssVar';
import Button from '@mui/material/Button';

import {
  PriceSvg1,
  PriceSvg2,
  PriceSvg3,
} from '../../../public/assets/images/icons/IconsSvgs'

const Pricing: FC = (() => {

  const { muiVar } = useScssVar();
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);

  const [pathnames, setPathnames] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPathnames(() => window.location.pathname)
    }
  }, [])

  return (
    <Fragment>
      <section className="pricing-section" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center aos" data-aos="fade-up">
              <div className="section-header-one imgColorPrimary">
                {pathnames.includes("/pages/pricing-plan") ? (
                  <h2>Our Pricing Plan</h2>
                ) : (
                  <h2 className="section-title">Pricing Plan</h2>
                )}
                {pathnames.includes("/pages/pricing-plan") ? (
                  <div className="plan-choose-info">
                    <label className="monthly-plan">Monthly</label>
                    <div className="status-toggle">
                      <input type="checkbox" id="status_1" className="check" />
                      <label htmlFor="status_1" className="checktoggle">
                        checkbox
                      </label>
                    </div>
                    <label className="yearly-plan">Yearly</label>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div
            className={`row justify-content-center ${pathnames.includes("/") || pathnames.includes("/cosmeticshome") ? " align-items-center" : " "
              }`}
          >
            <div
              className={`col-lg-4 ${pathnames.includes("/")
                || pathnames.includes("/cosmeticshome")
                ? "col-sm-12 aos"
                : "col-md-6 d-flex"
                }`}
              data-aos="fade-up"
            >
              <div className="card pricing-card">
                <div className="card-body">
                  <div className="pricing-header">
                    <div className="pricing-header-info">
                      <div className="pricing-icon">
                        <span>
                          <PriceSvg1 />
                        </span>
                      </div>
                      <div className="pricing-title">
                        <p>For individuals</p>
                        <h4>Basic</h4>
                      </div>
                    </div>
                    <div className="pricing-header-text">
                      <p>
                        Lorem ipsum dolor consectetur adipiscing elit,sed do
                        eiusmod tempor
                      </p>
                    </div>
                  </div>
                  <div className="pricing-info">
                    <div className="pricing-amount">
                      <h2>
                        $99 <span>/monthly</span>
                      </h2>
                      <h6>What’s included</h6>
                    </div>
                    <div className="pricing-list">
                      <ul>
                        <li>Lorem ipsum dolor amet, consectetur </li>
                        <li>Lorem ipsum amet, consectetur </li>
                        <li>Lorem ipsum dolor amet, consectetur </li>
                        <li>Lorem ipsum amet, consectetur </li>
                      </ul>
                    </div>

                    <div className="form-search-btn aos" data-aos="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
                      <Button className="btn" onClick={(e) => e.preventDefault()}>
                        Choose Plan
                      </Button>
                    </div>
                  </div>
                  {pathnames == "/home" ? (
                    <ul className="nav header-navbar-rht">
                      <li className="nav-item">
                        <Link className="nav-link header-login" href="/login">
                          login / Signup
                        </Link>
                      </li>
                    </ul>
                  ) : null}
                </div>
              </div>
            </div>
            <div
              className={`col-lg-4 ${pathnames.includes("/") || pathnames.includes("/cosmeticshome")
                ? "col-sm-12 aos"
                : "col-md-6 d-flex"
                }`}
              data-aos="fade-up"
            >
              <div
                //  className="card pricing-card pricing-card-active"
                className={`card pricing-card pricing-card${pathnames.includes("/") || pathnames.includes("/cosmeticshome") ? "-active" : ""
                  }`}
              >
                <div className="card-body">
                  <div className="pricing-header">
                    <div className="pricing-header-info">
                      <div className="pricing-icon">
                        <span>
                          <PriceSvg2 />
                        </span>
                      </div>
                      <div className="pricing-title">
                        <p>For startups</p>
                        <h4>Pro</h4>
                      </div>
                      <div className="pricing-tag">
                        <span>Popular</span>
                      </div>
                    </div>
                    <div className="pricing-header-text">
                      <p>
                        Lorem ipsum dolor consectetur adipiscing elit,sed do
                        eiusmod tempor
                      </p>
                    </div>
                  </div>
                  <div className="pricing-info">
                    <div className="pricing-amount">
                      <h2>
                        $199 <span>/monthly</span>
                      </h2>
                      <h6>What’s included</h6>
                    </div>
                    <div className="pricing-list">
                      <ul>
                        <li>Lorem ipsum dolor amet, consectetur</li>
                        <li>Lorem ipsum amet, consectetur</li>
                        <li>Neque porro quisquam est, qui dolorem</li>
                        <li>Lorem ipsum amet, consectetur</li>
                        {
                          pathnames.includes("index") || pathnames.includes("/cosmeticshome") ? (
                            <>
                              <li>Lorem ipsum amet, consectetur</li>
                              <li>Sed ut perspiciatis unde</li>
                              <li>Nemo enim ipsam voluptatem</li>
                            </>
                          ) : (
                            null
                          )
                        }

                      </ul>
                    </div>

                    <div className="form-search-btn aos" data-aos="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
                      <Button className="btn" onClick={(e) => e.preventDefault()}>
                        Choose Plan
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`col-lg-4 ${pathnames.includes("/") || pathnames.includes("/cosmeticshome")
                ? "col-sm-12 aos"
                : "col-md-6 d-flex"
                }`}
              data-aos="fade-up"
            >
              <div className="card pricing-card">
                <div className="card-body">
                  <div className="pricing-header">
                    <div className="pricing-header-info">
                      <div className="pricing-icon">
                        <span>
                          <PriceSvg3 />
                        </span>
                      </div>
                      <div className="pricing-title">
                        <p>For big companies</p>
                        <h4>Enterprise</h4>
                      </div>
                    </div>
                    <div className="pricing-header-text">
                      <p>
                        Lorem ipsum dolor consectetur adipiscing elit,sed do
                        eiusmod tempor
                      </p>
                    </div>
                  </div>
                  <div className="pricing-info">
                    <div className="pricing-amount">
                      <h2>
                        $399 <span>/monthly</span>
                      </h2>
                      <h6>Whats included</h6>
                    </div>
                    <div className="pricing-list">
                      <ul>
                        <li>Lorem ipsum dolor amet, consectetur </li>
                        <li>Lorem ipsum amet, consectetur </li>
                        <li>Lorem ipsum dolor amet, consectetur </li>
                        <li>Lorem ipsum amet, consectetur </li>
                      </ul>
                    </div>
                    <div className="form-search-btn aos" data-aos="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
                      <Button className="btn" onClick={(e) => e.preventDefault()}>
                        Choose Plan
                      </Button>
                    </div>
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

export default Pricing;