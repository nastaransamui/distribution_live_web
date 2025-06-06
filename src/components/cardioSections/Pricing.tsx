/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect } from 'react'
import Link from 'next/link'
import { heartplus } from '../../../public/assets/imagepath'
import useScssVar from '@/hooks/useScssVar'

import AOS from 'aos'
const Pricing: FC = (() => {
  const { muiVar } = useScssVar();
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);
  return (
    <Fragment>
      <section className="pricing-section pricing-section-ten" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center aos" data-aos="fade-up">
              <div className="section-header-one section-header-slider">
                <h2 className="section-title">Our <span>Pricing</span></h2>
                <div className="pricing-options">
                  <p>Choose the package that best suit you</p>
                  <div className="options-group">
                    <label htmlFor='flexSwitchCheckDefault'>Monthly</label>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                    </div>
                    <span>Yearly <span className="discount-plan">30% discount</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-content-center align-items-center">
            <div className="col-lg-3 col-md-6 col-sm-12 aos" data-aos="fade-up">
              <div className="card pricing-card pricing-card-active">
                <div className="card-body">
                  <div className="pricing-header">
                    <div className="pricing-header-info">
                      <div className="pricing-title">
                        <h3 style={{ color: '#000000' }}>Free</h3>
                      </div>
                      <div className="pricing-tag">
                        <div><img src={heartplus} alt="icon" /></div>
                      </div>
                    </div>
                  </div>
                  <div className="pricing-info">
                    <div className="pricing-amount">
                      <h2>$0 </h2>
                      <span>per month</span>
                    </div>
                    <div className="pricing-btn">
                      <Link href="/pages/pricing-plan" className="btn">Choose Plan</Link>
                    </div>
                    <div className="pricing-list">
                      <ul>
                        <li>100 conversations p/m</li>
                        <li>10 websites</li>
                        <li>2 GB data storage</li>
                      </ul>
                    </div>
                    <div className="pricing-list pricing-list-two">
                      <ul>
                        <li>Chat widget</li>
                        <li>Real time support</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 aos" data-aos="fade-up">
              <div className="card pricing-card">
                <div className="card-body">
                  <div className="pricing-header">
                    <div className="pricing-header-info">
                      <div className="pricing-title">
                        <h3>Essentials</h3>
                      </div>
                    </div>
                  </div>
                  <div className="pricing-info">
                    <div className="pricing-amount">
                      <h2>$50 </h2>
                      <span>per month</span>
                    </div>
                    <div className="pricing-btn">
                      <Link href="/pages/pricing-plan" className="btn">Request A Demo</Link>
                    </div>
                    <div className="pricing-list">
                      <ul>
                        <li>500 conversations p/m</li>
                        <li>20 websites</li>
                        <li>20 GB data storage</li>
                      </ul>
                    </div>
                    <div className="pricing-list pricing-list-two">
                      <ul>
                        <li>Chat widget</li>
                        <li>Real time support</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 aos" data-aos="fade-up">
              <div className="card pricing-card">
                <div className="card-body">
                  <div className="pricing-header">
                    <div className="pricing-header-info">
                      <div className="pricing-title">
                        <h3>Team</h3>
                      </div>
                    </div>
                  </div>
                  <div className="pricing-info">
                    <div className="pricing-amount">
                      <h2>$90 </h2>
                      <span>per month</span>
                    </div>
                    <div className="pricing-btn">
                      <Link href="/pages/pricing-plan" className="btn">Request A Demo</Link>
                    </div>
                    <div className="pricing-list">
                      <ul>
                        <li>500 conversations p/m</li>
                        <li>20 websites</li>
                        <li>20 GB data storage</li>
                      </ul>
                    </div>
                    <div className="pricing-list pricing-list-two">
                      <ul>
                        <li>Chat widget</li>
                        <li>Real time support</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 aos" data-aos="fade-up">
              <div className="card pricing-card">
                <div className="card-body">
                  <div className="pricing-header">
                    <div className="pricing-header-info">
                      <div className="pricing-title">
                        <h3>Enterprises</h3>
                      </div>
                    </div>
                  </div>
                  <div className="pricing-info">
                    <div className="pricing-amount">
                      <h2>$150 </h2>
                      <span>per month</span>
                    </div>
                    <div className="pricing-btn">
                      <Link href="/pages/pricing-plan" className="btn">Request A Demo</Link>
                    </div>
                    <div className="pricing-list">
                      <ul>
                        <li>500 conversations p/m</li>
                        <li>20 websites</li>
                        <li>20 GB data storage</li>
                      </ul>
                    </div>
                    <div className="pricing-list pricing-list-two">
                      <ul>
                        <li>Chat widget</li>
                        <li>Real time support</li>
                      </ul>
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