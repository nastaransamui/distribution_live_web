/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { VscHeart } from 'react-icons/vsc'
import useScssVar from '@/hooks/useScssVar'
import AOS from 'aos'

const Owlcarousel = dynamic(() => import(`react-owl-carousel`), { ssr: false })

import { pharmacy_1, pharmacy_2, pharmacy_3, } from "../../../public/assets/imagepath";

const PharmacySection: FC = (() => {
  const { muiVar } = useScssVar();
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);
  const options = {
    loop: true,
    margin: 24,
    dots: false,
    nav: true,
    smartSpeed: 2000,
    navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
    navElement: "button  aria-labelledby='slide-nav-1' aria-label='slide-nav-1'",
    responsive: {
      0: {
        items: 1
      },
      500: {
        items: 1
      },
      575: {
        items: 1
      },
      768: {
        items: 2
      },
      1000: {
        items: 3
      },
      1300: {
        items: 3
      }
    }
  };

  return (
    <Fragment>
      <section className="pharmacy-section-fifteen" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-header-fifteen text-center">
                <h2>
                  Online <span>Pharmacy Store</span>
                </h2>
                <p>More the quantity, higher the discount. Hurry, Buy Now!</p>
              </div>
            </div>
          </div>
          <div
            className="pharmacy-slider-fifteen owl-theme aos"
            data-aos="fade-up"
          >
            <Owlcarousel className="pharmacy-slider-fifteen owl-theme aos"
              data-aos="fade-up"{...options}>
              <div className="item item-fifteen">
                <div className="doctor-profile-widget doctor-profile-widget-fift">
                  <div className="doc-pro-img doc-pro-img-fifteen">
                    <Link href="/doctors/profile">
                      <div className="doctor-profile-img doctor-profile-img-fifteen">
                        <img
                          src={pharmacy_1}
                          className="img-fluid"
                          alt=""
                        />
                      </div>
                    </Link>
                    <div className="doctor-amount">
                      <Link
                        href="#"
                        className="fav-icon fav-icon-fifteen"
                      >
                        <VscHeart className="feather-heart" />
                      </Link>
                    </div>
                    <div className="item-info">
                      <h6>10% Off</h6>
                    </div>
                  </div>
                  <div className="doc-content-fift">
                    <Link href="#">Otogesic Ear Drops</Link>
                    <p>
                      <span>Sold by:</span> ERIS LIFESCIENCES LTD
                    </p>
                    <div className="rate-fifteen">
                      <div className="rate-four">
                        <span>In Stock</span>
                      </div>
                      <ul className="fift-rate">
                        <li>5ml</li>
                        <li>10ml</li>
                      </ul>
                    </div>
                    <div className="fift-bottom-content">
                      <h3>
                        $25.00<span className="ms-2">$35.00</span>
                      </h3>
                      <Link href="add-prescription">Add to Cart</Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item item-fifteen">
                <div className="doctor-profile-widget doctor-profile-widget-fift">
                  <div className="doc-pro-img doc-pro-img-fifteen">
                    <Link href="/doctors/profile">
                      <div className="doctor-profile-img doctor-profile-img-fifteen">
                        <img
                          src={pharmacy_2}
                          className="img-fluid"
                          alt=""
                        />
                      </div>
                    </Link>
                    <div className="doctor-amount">
                      <Link
                        href="#"
                        className="fav-icon fav-icon-fifteen"
                      >
                        <VscHeart className="feather-heart" />
                      </Link>
                    </div>
                    <div className="item-info">
                      <h6>15% Off</h6>
                    </div>
                  </div>
                  <div className="doc-content-fift">
                    <Link href="#">Himalaya Bresol</Link>
                    <p>
                      <span>Sold by:</span>THE HIMALAYA DRUG
                    </p>
                    <div className="rate-fifteen">
                      <div className="rate-four">
                        <span>In Stock</span>
                      </div>
                      <ul className="fift-rate">
                        <li>5ml</li>
                        <li>10ml</li>
                      </ul>
                    </div>
                    <div className="fift-bottom-content">
                      <h3>
                        $85.00<span className="ms-2">$65.00</span>
                      </h3>
                      <Link href="add-prescription">Add to Cart</Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item item-fifteen">
                <div className="doctor-profile-widget doctor-profile-widget-fift">
                  <div className="doc-pro-img doc-pro-img-fifteen">
                    <Link href="/doctors/profile">
                      <div className="doctor-profile-img doctor-profile-img-fifteen">
                        <img
                          src={pharmacy_3}
                          className="img-fluid"
                          alt=""
                        />
                      </div>
                    </Link>
                    <div className="doctor-amount">
                      <Link
                        href="#"
                        className="fav-icon fav-icon-fifteen"
                      >
                        <VscHeart className="feather-heart" />
                      </Link>
                    </div>
                    <div className="item-info">
                      <h6>10% Off</h6>
                    </div>
                  </div>
                  <div className="doc-content-fift">
                    <Link href="#">Boiron, ThroatCalm</Link>
                    <p>
                      <span>Sold by:</span> BOIRON
                    </p>
                    <div className="rate-fifteen">
                      <div className="rate-four">
                        <span>In Stock</span>
                      </div>
                      <ul className="fift-rate">
                        <li>5ml</li>
                        <li>10ml</li>
                      </ul>
                    </div>
                    <div className="fift-bottom-content">
                      <h3>
                        $55.00<span className="ms-2">$95.00</span>
                      </h3>
                      <Link href="add-prescription">Add to Cart</Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item item-fifteen">
                <div className="doctor-profile-widget doctor-profile-widget-fift">
                  <div className="doc-pro-img doc-pro-img-fifteen">
                    <Link href="/doctors/profile">
                      <div className="doctor-profile-img doctor-profile-img-fifteen">
                        <img
                          src={pharmacy_1}
                          className="img-fluid"
                          alt=""
                        />
                      </div>
                    </Link>
                    <div className="doctor-amount">
                      <Link
                        href="#"
                        className="fav-icon fav-icon-fifteen"
                      >
                        <VscHeart className="feather-heart" />
                      </Link>
                    </div>
                    <div className="item-info">
                      <h6>10% Off</h6>
                    </div>
                  </div>
                  <div className="doc-content-fift">
                    <Link href="#">Otogesic Ear Drops</Link>
                    <p>
                      <span>Sold by:</span> ERIS LIFESCIENCES LTD
                    </p>
                    <div className="rate-fifteen">
                      <div className="rate-four">
                        <span>In Stock</span>
                      </div>
                      <ul className="fift-rate">
                        <li>5ml</li>
                        <li>10ml</li>
                      </ul>
                    </div>
                    <div className="fift-bottom-content">
                      <h3>
                        $25.00<span className="ms-2">$35.00</span>
                      </h3>
                      <Link href="add-prescription">Add to Cart</Link>
                    </div>
                  </div>
                </div>
              </div>
            </Owlcarousel>
          </div>
        </div>
      </section>
    </Fragment>
  )
})

export default PharmacySection;