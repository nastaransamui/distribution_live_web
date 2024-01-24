/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect } from 'react'
import AOS from 'aos'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useTheme } from '@mui/material';
import { EyeIconSvg } from '../../../public/assets/images/icons/IconsSvgs';
import { client03, client04, client06, client07, eyeTestimonial } from '@/public/assets/imagepath'
const OwlCarousel = dynamic(() => import('react-owl-carousel'), {
  ssr: false,
})


const Testimonials: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);
  const doctersettings = {
    items: 1,
    loop: true,
    margin: 15,
    dots: false,
    nav: true,
    navContainer: '.slide-nav-2',
    navText: ['<i class="fas fa-chevron-left custom-arrow"></i>', '<i class="fas fa-chevron-right custom-arrow"></i>'],

    autoplay: false,
    infinite: "true",

    slidestoscroll: 1,
    rtl: "true",
    rows: 1,
    responsive: {
      1049: {
        items: 1
      },
      992: {
        items: 1
      },
      800: {
        items: 1
      },
      776: {
        items: 1
      },
      567: {
        items: 1
      },
      200: {
        items: 1
      }
    }
  }
  return (
    <Fragment>
      <section className="eye-testimonial-section" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-12 aos" data-aos="fade-up">
              <div className="section-heading text-center sec-heading-eye">
                <EyeIconSvg />
                <h2>
                  <span>Client</span> Testimonials
                </h2>
                <p>What our clients say about us</p>
              </div>
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-md-5">
              <div className="testi-img">
                <img src={eyeTestimonial} alt="" className="img-fluid" />
                <span className="testi-icon">
                  <i className="fa-solid fa-quote-left" />
                </span>
              </div>
              <div className="testi-users">
                <div className="nav nav-container slide-11" />
                <ul>
                  <li>
                    <img
                      src={client04}
                      alt=""
                      className="img-fluid"
                    />
                  </li>
                  <li>
                    <img
                      src={client03}
                      alt=""
                      className="img-fluid"
                    />
                  </li>
                  <li>
                    <img
                      src={client06}
                      alt=""
                      className="img-fluid"
                    />
                  </li>
                  <li>
                    <img
                      src={client07}
                      alt=""
                      className="img-fluid"
                    />
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-7">
              <div className="eye-testislider">
                <OwlCarousel {...doctersettings}>
                  <div className="testimonial-wrap">
                    <h4>
                      Contrary to popular belief, Lorem Ipsum is not simply random text.
                      It has roots in a piece of classical
                    </h4>
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and typesetting
                      industry. Lorem Ipsum has been the industrys standard. The point
                      of using Lorem Ipsum is that it has a more-or-less normal
                      distribution of letters, as opposed to using Content here,
                      content here, making it look like readable English. Many desktop
                      publishing packages and web page editors now use Lorem Ipsum as
                      their default model text, and a search for lorem ipsum will
                      uncover many web sites still in their infancy
                    </p>
                    <div className="testimonial-user">
                      <h6>Elizabeth Forsyth</h6>
                      <p>Las Vegas, USA</p>
                    </div>
                  </div>
                  <div className="testimonial-wrap">
                    <h4>
                      Contrary to popular belief, Lorem Ipsum is not simply random text.
                      It has roots in a piece of classical
                    </h4>
                    <p>
                      It is a long established fact that a reader will be distracted by
                      the readable content of a page when looking at its layout. The
                      point of using Lorem Ipsum is that it has a more-or-less normal
                      distribution of letters, as opposed to using Content here,
                      content here, making it look like readable English. Many desktop
                      publishing packages and web page editors now use Lorem Ipsum as
                      their default model text, and a search for lorem ipsum will
                      uncover many web sites still in their infancy
                    </p>
                    <div className="testimonial-user">
                      <h6>Leigh Baley</h6>
                      <p>San Jose, USA</p>
                    </div>
                  </div>
                  <div className="testimonial-wrap">
                    <h4>
                      Contrary to popular belief, Lorem Ipsum is not simply random text.
                      It has roots in a piece of classical
                    </h4>
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and typesetting
                      industry. Lorem Ipsum has been the industry s standard dummy text
                      ever since the 1500s, when an unknown printer took a galley of
                      type and scrambled it to make a type specimen book. It has
                      survived not only five centuries. The point of using Lorem Ipsum
                      is that it has a more-or-less normal distribution of letters, as
                      opposed to using Content here, content here making it look like
                      readable English.
                    </p>
                    <div className="testimonial-user">
                      <h6>Jon Sparks</h6>
                      <p>Irvine, USA</p>
                    </div>
                  </div>
                </OwlCarousel>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default Testimonials