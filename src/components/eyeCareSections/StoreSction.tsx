/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useTheme } from '@mui/material';
import {
  store01,
  store02,
  store03,
  store04,
  store05,
  store06,
  store07,
  store08,
  store09,
  store09J,
  store10,
  store14,
  store15,
  store16,
  store_bg_01
} from "../../../public/assets/imagepath";
import { EyeIconSvg } from '../../../public/assets/images/icons/IconsSvgs';
const OwlCarousel = dynamic(() => import('react-owl-carousel'), {
  ssr: false,
})
import AOS from 'aos'
const StoreSection: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme()
  const doctersettings = {
    items: 4,
    loop: true,
    margin: 15,
    dots: false,
    nav: true,
    navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
    navElement: "button  aria-labelledby='slide-nav-1' aria-label='slide-nav-1'",
    autoplay: false,
    infinite: "true",

    slidestoscroll: 1,
    rtl: "true",
    rows: 1,
    responsive: {
      1049: {
        items: 4
      },
      992: {
        items: 3
      },
      800: {
        items: 3
      },
      776: {
        items: 3
      },
      567: {
        items: 1
      },
      200: {
        items: 1
      }
    }
  }
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);
  return (
    <Fragment>
      <section className="store-section" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-12 aos" data-aos="fade-up">
              <div className="section-heading text-center sec-heading-eye">
                <EyeIconSvg />
                <h2>
                  <span>Our</span> Store
                </h2>
                <p>Great Reasons For People Choose Doccure Store</p>
              </div>
              <ul className="store-tab nav">
                <li>
                  <Link
                    href="#"
                    className="active"
                    data-bs-toggle="tab"
                    data-bs-target="#eyeglass"
                  >
                    Eye Glasses
                  </Link>
                </li>
                <li>
                  <Link href="#" data-bs-toggle="tab" data-bs-target="#computer">
                    Computer Glasses
                  </Link>
                </li>
                <li>
                  <Link href="#" data-bs-toggle="tab" data-bs-target="#kids">
                    Kids Glasses
                  </Link>
                </li>
                <li>
                  <Link href="#" data-bs-toggle="tab" data-bs-target="#lense">
                    Contact Lenses
                  </Link>
                </li>
                <li>
                  <Link href="#" data-bs-toggle="tab" data-bs-target="#sunglass">
                    Sunglasses
                  </Link>
                </li>
                <li>
                  <Link href="#" data-bs-toggle="tab" data-bs-target="#readingglass">
                    Reading Glasses
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="tab-content">
            {/* Eye Glass */}
            <div className="tab-pane active" id="eyeglass">
              <div className="eye-blogslider owl-them aos" data-aos="fade-up" >
                <OwlCarousel {...doctersettings}>
                  <div className="item">
                    <div className="store-item">
                      <div className="store-img">
                        <Link href="/pharmacy" aria-label='pharmacy'>
                          <img
                            src={store01}
                            alt=""
                            className="img-fluid"
                          />
                        </Link>
                        <span className="glass-cat">Power Glass</span>
                      </div>
                      <div className="store-content">
                        <span className="store-cat">New</span>
                        <h3>
                          <Link href="/pharmacy" aria-label='pharmacy'>Nerdlane</Link>
                        </h3>
                        <p>Black Full Frame Wayfarer Eyeglasses</p>
                        <div className="price-tag">
                          <h4>$490</h4>
                          <ul className="color-selection">
                            <li>
                              <span className="black-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                            <li>
                              <span className="blue-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <div className="store-item">
                      <div className="store-img">
                        <Link href="/pharmacy" aria-label='pharmacy'>
                          <img
                            src={store02}
                            alt=""
                            className="img-fluid"
                          />
                        </Link>
                        <span className="glass-cat">Power Glass</span>
                      </div>
                      <div className="store-content">
                        <span className="store-cat">New</span>
                        <h3>
                          <Link href="/pharmacy" aria-label='pharmacy'>
                            Mirar Aviator Eyeglasses
                          </Link>
                        </h3>
                        <p>Gold Full Frame for Men and Women</p>
                        <div className="price-tag">
                          <h4>$480</h4>
                          <ul className="color-selection">
                            <li>
                              <span className="gold-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                            <li>
                              <span className="grey-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <div className="store-item">
                      <div className="store-img">
                        <Link href="/pharmacy" aria-label='pharmacy'>
                          <img
                            src={store03}
                            alt=""
                            className="img-fluid"
                          />
                        </Link>
                        <span className="glass-cat">Power Glass</span>
                      </div>
                      <div className="store-content">
                        <span className="store-cat">New</span>
                        <h3>
                          <Link href="/pharmacy" aria-label='pharmacy'>Izibuko</Link>
                        </h3>
                        <p>Glossy Blue Full Frame Cateye Eyeglasses for Women</p>
                        <div className="price-tag">
                          <h4>$450</h4>
                          <ul className="color-selection">
                            <li>
                              <span className="black-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                            <li>
                              <span className="blue-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <div className="store-item">
                      <div className="store-img">
                        <Link href="/pharmacy" aria-label='pharmacy'>
                          <img
                            src={store04}
                            alt=""
                            className="img-fluid"
                          />
                        </Link>
                        <span className="glass-cat">Power Glass</span>
                      </div>
                      <div className="store-content">
                        <span className="store-cat">New</span>
                        <h3>
                          <Link href="/pharmacy" aria-label='pharmacy'>Vistazo</Link>
                        </h3>
                        <p>Gold Full Frame Cateye Eyeglasses for Men and Women</p>
                        <div className="price-tag">
                          <h4>$490</h4>
                          <ul className="color-selection">
                            <li>
                              <span className="sand-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                            <li>
                              <span className="green-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <div className="store-item">
                      <div className="store-img">
                        <Link href="/pharmacy" aria-label='pharmacy'>
                          <img
                            src={store05}
                            alt=""
                            className="img-fluid"
                          />
                        </Link>
                        <span className="glass-cat">Power Glass</span>
                      </div>
                      <div className="store-content">
                        <span className="store-cat">New</span>
                        <h3>
                          <Link href="/pharmacy" aria-label='pharmacy'>Tintin</Link>
                        </h3>
                        <p>Full Frame tintin Eyeglasses</p>
                        <div className="price-tag">
                          <h4>$400</h4>
                          <ul className="color-selection">
                            <li>
                              <span className="black-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                            <li>
                              <span className="blue-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </OwlCarousel>
              </div>
            </div>
            {/* /Eye Glass */}
            {/* Computer Glass */}
            <div className="tab-pane fade" id="computer">
              <div className="eye-blogslider owl-them aos" data-aos="fade-up" >
                <OwlCarousel {...doctersettings}>
                  <div className="item">
                    <div className="store-item">
                      <div className="store-img">
                        <Link href="/pharmacy" aria-label='pharmacy'>
                          <img
                            src={store03}
                            alt=""
                            className="img-fluid"
                          />
                        </Link>
                        <span className="glass-cat">Computer Glass</span>
                      </div>
                      <div className="store-content">
                        <span className="store-cat">New</span>
                        <h3>
                          <Link href="/pharmacy" aria-label='pharmacy'>Danzier</Link>
                        </h3>
                        <p>Black Frame Eyeglasses</p>
                        <div className="price-tag">
                          <h4>$390</h4>
                          <ul className="color-selection">
                            <li>
                              <span className="black-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                            <li>
                              <span className="blue-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <div className="store-item">
                      <div className="store-img">
                        <Link href="/pharmacy" aria-label='pharmacy'>
                          <img
                            src={store06}
                            alt=""
                            className="img-fluid"
                          />
                        </Link>
                        <span className="glass-cat">Computer Glass</span>
                      </div>
                      <div className="store-content">
                        <span className="store-cat">New</span>
                        <h3>
                          <Link href="/pharmacy" aria-label='pharmacy'>Fasil</Link>
                        </h3>
                        <p>Black Frame Computer Eyeglasses</p>
                        <div className="price-tag">
                          <h4>$230</h4>
                          <ul className="color-selection">
                            <li>
                              <span className="black-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                            <li>
                              <span className="blue-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <div className="store-item">
                      <div className="store-img">
                        <Link href="/pharmacy" aria-label='pharmacy'>
                          <img
                            src={store02}
                            alt=""
                            className="img-fluid"
                          />
                        </Link>
                        <span className="glass-cat">Computer Glass</span>
                      </div>
                      <div className="store-content">
                        <span className="store-cat">New</span>
                        <h3>
                          <Link href="/pharmacy" aria-label='pharmacy'>Coolers</Link>
                        </h3>
                        <p>Gold Full Frame for Men and Women</p>
                        <div className="price-tag">
                          <h4>$370</h4>
                          <ul className="color-selection">
                            <li>
                              <span className="grey-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                            <li>
                              <span className="gold-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <div className="store-item">
                      <div className="store-img">
                        <Link href="/pharmacy" aria-label='pharmacy'>
                          <img
                            src={store05}
                            alt=""
                            className="img-fluid"
                          />
                        </Link>
                        <span className="glass-cat">Computer Glass</span>
                      </div>
                      <div className="store-content">
                        <span className="store-cat">New</span>
                        <h3>
                          <Link href="/pharmacy" aria-label='pharmacy'>Eye Protect</Link>
                        </h3>
                        <p>Frame Cateye Eyeglasses for Women</p>
                        <div className="price-tag">
                          <h4>$410</h4>
                          <ul className="color-selection">
                            <li>
                              <span className="black-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                            <li>
                              <span className="blue-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <div className="store-item">
                      <div className="store-img">
                        <Link href="/pharmacy" aria-label='pharmacy'>
                          <img
                            src={store03}
                            alt=""
                            className="img-fluid"
                          />
                        </Link>
                        <span className="glass-cat">Computer Glass</span>
                      </div>
                      <div className="store-content">
                        <span className="store-cat">New</span>
                        <h3>
                          <Link href="/pharmacy" aria-label='pharmacy'>Viratio</Link>
                        </h3>
                        <p>Gold Full Frame Cateye Eyeglasses for Men and Women</p>
                        <div className="price-tag">
                          <h4>$420</h4>
                          <ul className="color-selection">
                            <li>
                              <span className="sand-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                            <li>
                              <span className="green-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </OwlCarousel>
              </div>
            </div>
            {/* /Computer Glass */}
            {/* Kids Glass */}
            <div className="tab-pane fade" id="kids">
              <div className="eye-blogslider owl-them aos" data-aos="fade-up" >
                <OwlCarousel {...doctersettings}>
                  <div className="item">
                    <div className="store-item">
                      <div className="store-img">
                        <Link href="/pharmacy" aria-label='pharmacy'>
                          <img
                            src={store03}
                            alt=""
                            className="img-fluid"
                          />
                        </Link>
                        <span className="glass-cat">Kids Glass</span>
                      </div>
                      <div className="store-content">
                        <span className="store-cat">New</span>
                        <h3>
                          <Link href="/pharmacy" aria-label='pharmacy'>Readers</Link>
                        </h3>
                        <p>Black Full Frame kids Eyeglasses</p>
                        <div className="price-tag">
                          <h4>$490</h4>
                          <ul className="color-selection">
                            <li>
                              <span className="black-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                            <li>
                              <span className="blue-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <div className="store-item">
                      <div className="store-img">
                        <Link href="/pharmacy" aria-label='pharmacy'>
                          <img
                            src={store07}
                            alt=""
                            className="img-fluid"
                          />
                        </Link>
                        <span className="glass-cat">Kids Glass</span>
                      </div>
                      <div className="store-content">
                        <span className="store-cat">New</span>
                        <h3>
                          <Link href="/pharmacy" aria-label='pharmacy'>Sight Care</Link>
                        </h3>
                        <p>Black Full Frame Kids Eyeglasses</p>
                        <div className="price-tag">
                          <h4>$690</h4>
                          <ul className="color-selection">
                            <li>
                              <span className="black-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                            <li>
                              <span className="blue-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <div className="store-item">
                      <div className="store-img">
                        <Link href="/pharmacy" aria-label='pharmacy'>
                          <img
                            src={store08}
                            alt=""
                            className="img-fluid"
                          />
                        </Link>
                        <span className="glass-cat">Kids Glass</span>
                      </div>
                      <div className="store-content">
                        <span className="store-cat">New</span>
                        <h3>
                          <Link href="/pharmacy" aria-label='pharmacy'>Aviator</Link>
                        </h3>
                        <p>Gold Full Frame for Men and Women</p>
                        <div className="price-tag">
                          <h4>$240</h4>
                          <ul className="color-selection">
                            <li>
                              <span className="grey-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                            <li>
                              <span className="gold-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <div className="store-item">
                      <div className="store-img">
                        <Link href="/pharmacy" aria-label='pharmacy'>
                          <img
                            src={store09}
                            alt=""
                            className="img-fluid"
                          />
                        </Link>
                        <span className="glass-cat">Kids Glass</span>
                      </div>
                      <div className="store-content">
                        <span className="store-cat">New</span>
                        <h3>
                          <Link href="/pharmacy" aria-label='pharmacy'>Zibuko</Link>
                        </h3>
                        <p>Glossy Full Frame Cateye Eyeglasses for Women</p>
                        <div className="price-tag">
                          <h4>$430</h4>
                          <ul className="color-selection">
                            <li>
                              <span className="black-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                            <li>
                              <span className="blue-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <div className="store-item">
                      <div className="store-img">
                        <Link href="/pharmacy" aria-label='pharmacy'>
                          <img
                            src={store01}
                            alt=""
                            className="img-fluid"
                          />
                        </Link>
                        <span className="glass-cat">Kids Glass</span>
                      </div>
                      <div className="store-content">
                        <span className="store-cat">New</span>
                        <h3>
                          <Link href="/pharmacy" aria-label='pharmacy'>Seeier</Link>
                        </h3>
                        <p>Gold Full Frame Cateye Eyeglasses for Men and Women</p>
                        <div className="price-tag">
                          <h4>$480</h4>
                          <ul className="color-selection">
                            <li>
                              <span className="sand-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                            <li>
                              <span className="green-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </OwlCarousel>
              </div>
            </div>
            {/* /Kids Glass */}
            {/* Lense Glass */}
            <div className="tab-pane fade" id="lense">
              <div className=" eye-blogslider owl-them aos" data-aos="fade-up" >
                <OwlCarousel {...doctersettings}>
                  <div className="item">
                    <div className="store-item">
                      <div className="store-img">
                        <Link href="/pharmacy" aria-label='pharmacy'>
                          <img
                            src={store14}
                            alt=""
                            className="img-fluid"
                          />
                        </Link>
                      </div>
                      <div className="store-content">
                        <span className="store-cat">New</span>
                        <h3>
                          <Link href="/pharmacy" aria-label='pharmacy'>Lenzomania</Link>
                        </h3>
                        <p>Wayfarer Contact Lense</p>
                        <div className="price-tag">
                          <h4>$120</h4>
                          <ul className="color-selection">
                            <li>
                              <span className="black-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                            <li>
                              <span className="blue-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <div className="store-item">
                      <div className="store-img">
                        <Link href="/pharmacy" aria-label='pharmacy'>
                          <img
                            src={store15}
                            alt=""
                            className="img-fluid"
                          />
                        </Link>
                      </div>
                      <div className="store-content">
                        <span className="store-cat">New</span>
                        <h3>
                          <Link href="/pharmacy" aria-label='pharmacy'>Contacto</Link>
                        </h3>
                        <p>Contact Lense</p>
                        <div className="price-tag">
                          <h4>$290</h4>
                          <ul className="color-selection">
                            <li>
                              <span className="black-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                            <li>
                              <span className="blue-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <div className="store-item">
                      <div className="store-img">
                        <Link href="/pharmacy" aria-label='pharmacy'>
                          <img
                            src={store16}
                            alt=""
                            className="img-fluid"
                          />
                        </Link>
                      </div>
                      <div className="store-content">
                        <span className="store-cat">New</span>
                        <h3>
                          <Link href="/pharmacy" aria-label='pharmacy'>Viator Lense</Link>
                        </h3>
                        <p>Contact Lense</p>
                        <div className="price-tag">
                          <h4>$190</h4>
                          <ul className="color-selection">
                            <li>
                              <span className="grey-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                            <li>
                              <span className="gold-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <div className="store-item">
                      <div className="store-img">
                        <Link href="/pharmacy" aria-label='pharmacy'>
                          <img
                            src={store14}
                            alt=""
                            className="img-fluid"
                          />
                        </Link>
                      </div>
                      <div className="store-content">
                        <span className="store-cat">New</span>
                        <h3>
                          <Link href="/pharmacy" aria-label='pharmacy'>Eizio Cart</Link>
                        </h3>
                        <p>Glossy Blue Lenses</p>
                        <div className="price-tag">
                          <h4>$430</h4>
                          <ul className="color-selection">
                            <li>
                              <span className="black-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                            <li>
                              <span className="blue-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <div className="store-item">
                      <div className="store-img">
                        <Link href="/pharmacy" aria-label='pharmacy'>
                          <img
                            src={store14}
                            alt=""
                            className="img-fluid"
                          />
                        </Link>
                      </div>
                      <div className="store-content">
                        <span className="store-cat">New</span>
                        <h3>
                          <Link href="/pharmacy" aria-label='pharmacy'>ContactLense Cart</Link>
                        </h3>
                        <p>Gold Full Frame Cateye Eyeglasses for Men and Women</p>
                        <div className="price-tag">
                          <h4>$280</h4>
                          <ul className="color-selection">
                            <li>
                              <span className="sand-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                            <li>
                              <span className="green-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </OwlCarousel>
              </div>
            </div>
            {/* /Lense Glass */}
            {/* Sunglass Glass */}
            <div className="tab-pane fade" id="sunglass">
              <div className=" eye-blogslider owl-them aos" data-aos="fade-up" >
                <OwlCarousel {...doctersettings}>
                  <div className="item">
                    <div className="store-item">
                      <div className="store-img">
                        <Link href="/pharmacy" aria-label='pharmacy'>
                          <img
                            src={store02}
                            alt=""
                            className="img-fluid"
                          />
                        </Link>
                        <span className="glass-cat">Sun Glass</span>
                      </div>
                      <div className="store-content">
                        <span className="store-cat">New</span>
                        <h3>
                          <Link href="/pharmacy" aria-label='pharmacy'>Sunglass</Link>
                        </h3>
                        <p>Black Sunglasses</p>
                        <div className="price-tag">
                          <h4>$350</h4>
                          <ul className="color-selection">
                            <li>
                              <span className="black-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                            <li>
                              <span className="blue-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <div className="store-item">
                      <div className="store-img">
                        <Link href="/pharmacy" aria-label='pharmacy'>
                          <img
                            src={store09J}
                            alt=""
                            className="img-fluid"
                          />
                        </Link>
                        <span className="glass-cat">Sun Glass</span>
                      </div>
                      <div className="store-content">
                        <span className="store-cat">New</span>
                        <h3>
                          <Link href="/pharmacy" aria-label='pharmacy'>Carezio</Link>
                        </h3>
                        <p>Black Frame sun Eyeglasses</p>
                        <div className="price-tag">
                          <h4>$550</h4>
                          <ul className="color-selection">
                            <li>
                              <span className="black-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                            <li>
                              <span className="blue-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <div className="store-item">
                      <div className="store-img">
                        <Link href="/pharmacy" aria-label='pharmacy'>
                          <img
                            src={store10}
                            alt=""
                            className="img-fluid"
                          />
                        </Link>
                        <span className="glass-cat">Sun Glass</span>
                      </div>
                      <div className="store-content">
                        <span className="store-cat">New</span>
                        <h3>
                          <Link href="/pharmacy" aria-label='pharmacy'>Aviator Sunglasses</Link>
                        </h3>
                        <p>Gold Frame for Men and Women</p>
                        <div className="price-tag">
                          <h4>$390</h4>
                          <ul className="color-selection">
                            <li>
                              <span className="grey-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                            <li>
                              <span className="gold-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <div className="store-item">
                      <div className="store-img">
                        <Link href="/pharmacy" aria-label='pharmacy'>
                          <img
                            src={store04}
                            alt=""
                            className="img-fluid"
                          />
                        </Link>
                        <span className="glass-cat">Sun Glass</span>
                      </div>
                      <div className="store-content">
                        <span className="store-cat">New</span>
                        <h3>
                          <Link href="/pharmacy" aria-label='pharmacy'>Buzanio Glass</Link>
                        </h3>
                        <p>Glossy Blue sun Cateye Eyeglasses for Women</p>
                        <div className="price-tag">
                          <h4>$430</h4>
                          <ul className="color-selection">
                            <li>
                              <span className="black-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                            <li>
                              <span className="blue-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <div className="store-item">
                      <div className="store-img">
                        <Link href="/pharmacy" aria-label='pharmacy'>
                          <img
                            src={store01}
                            alt=""
                            className="img-fluid"
                          />
                        </Link>
                        <span className="glass-cat">Sun Glass</span>
                      </div>
                      <div className="store-content">
                        <span className="store-cat">New</span>
                        <h3>
                          <Link href="/pharmacy" aria-label='pharmacy'>Sunrace Buy</Link>
                        </h3>
                        <p>Full Frame Cateye Eyeglasses for Men and Women</p>
                        <div className="price-tag">
                          <h4>$480</h4>
                          <ul className="color-selection">
                            <li>
                              <span className="sand-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                            <li>
                              <span className="green-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </OwlCarousel>
              </div>
            </div>
            {/* /Sun Glass */}
            {/* Reading Glass */}
            <div className="tab-pane fade" id="readingglass">
              <div className="eye-blogslider owl-them aos" data-aos="fade-up" >
                <OwlCarousel  {...doctersettings}>
                  <div className="item">
                    <div className="store-item">
                      <div className="store-img">
                        <Link href="/pharmacy" aria-label='pharmacy'>
                          <img
                            src={store02}
                            alt=""
                            className="img-fluid"
                          />
                        </Link>
                        <span className="glass-cat">Power Glass</span>
                      </div>
                      <div className="store-content">
                        <span className="store-cat">New</span>
                        <h3>
                          <Link href="/pharmacy" aria-label='pharmacy'>Nerdlane</Link>
                        </h3>
                        <p>Black Full Frame Wayfarer Eyeglasses</p>
                        <div className="price-tag">
                          <h4>$390</h4>
                          <ul className="color-selection">
                            <li>
                              <span className="black-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                            <li>
                              <span className="blue-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <div className="store-item">
                      <div className="store-img">
                        <Link href="/pharmacy" aria-label='pharmacy'>
                          <img
                            src={store03}
                            alt=""
                            className="img-fluid"
                          />
                        </Link>
                        <span className="glass-cat">Power Glass</span>
                      </div>
                      <div className="store-content">
                        <span className="store-cat">New</span>
                        <h3>
                          <Link href="/pharmacy" aria-label='pharmacy'>
                            Mirar Aviator Eyeglasses
                          </Link>
                        </h3>
                        <p>Gold Full Frame for Men and Women</p>
                        <div className="price-tag">
                          <h4>$580</h4>
                          <ul className="color-selection">
                            <li>
                              <span className="gold-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                            <li>
                              <span className="grey-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <div className="store-item">
                      <div className="store-img">
                        <Link href="/pharmacy" aria-label='pharmacy'>
                          <img
                            src={store04}
                            alt=""
                            className="img-fluid"
                          />
                        </Link>
                        <span className="glass-cat">Power Glass</span>
                      </div>
                      <div className="store-content">
                        <span className="store-cat">New</span>
                        <h3>
                          <Link href="/pharmacy" aria-label='pharmacy'>Izibuko</Link>
                        </h3>
                        <p>Blue Full Frame Eyeglasses for Women</p>
                        <div className="price-tag">
                          <h4>$450</h4>
                          <ul className="color-selection">
                            <li>
                              <span className="black-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                            <li>
                              <span className="blue-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <div className="store-item">
                      <div className="store-img">
                        <Link href="/pharmacy" aria-label='pharmacy'>
                          <img
                            src={store07}
                            alt=""
                            className="img-fluid"
                          />
                        </Link>
                        <span className="glass-cat">Power Glass</span>
                      </div>
                      <div className="store-content">
                        <span className="store-cat">New</span>
                        <h3>
                          <Link href="/pharmacy" aria-label='pharmacy'>Vistazo</Link>
                        </h3>
                        <p>Gold Full Frame Eyeglasses</p>
                        <div className="price-tag">
                          <h4>$370</h4>
                          <ul className="color-selection">
                            <li>
                              <span className="sand-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                            <li>
                              <span className="green-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <div className="store-item">
                      <div className="store-img">
                        <Link href="/pharmacy" aria-label='pharmacy'>
                          <img
                            src={store07}
                            alt=""
                            className="img-fluid"
                          />
                        </Link>
                        <span className="glass-cat">Power Glass</span>
                      </div>
                      <div className="store-content">
                        <span className="store-cat">New</span>
                        <h3>
                          <Link href="/pharmacy" aria-label='pharmacy'>Dlanerz</Link>
                        </h3>
                        <p>Full Frame Eyeglasses</p>
                        <div className="price-tag">
                          <h4>$320</h4>
                          <ul className="color-selection">
                            <li>
                              <span className="black-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                            <li>
                              <span className="blue-glass">
                                <i className="fa-solid fa-circle" />
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </OwlCarousel>
              </div>
            </div>
            {/* /Reading Glass */}
          </div>
        </div>
        <div className="ban-bg">
          <img
            src={store_bg_01}
            alt=""
            className="img-fluid bg-10"
          />
        </div>
      </section>
    </Fragment>
  )
})

export default StoreSection;