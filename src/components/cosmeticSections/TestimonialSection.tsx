/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react';
import dynamic from 'next/dynamic';
import useScssVar from '@/hooks/useScssVar';
import { testimonial2, client04, client03, client06_small, client07 } from '@/public/assets/imagepath';


const OwlCarousel = dynamic(() => import(`react-owl-carousel`), { ssr: false });


const TestimonialSection: FC = (() => {
  const { muiVar } = useScssVar();
  const testimonialsettings = {
    items: 1,
    loop: true,
    margin: 15,
    dots: true,
    nav: true,
    dotData: true,
    callbacks: true,
    onInitialized: () => {
      $('.owl-carousel').each(function () {
        // Find each set of dots in this carousel
        $(this).find('.owl-dots').each(function (index) {
          // Add aria-label to the dots container
          $(this).attr('aria-label', index + 1);

          // Add aria-label to each dot button
          $(this).find('.owl-dot').each(function (dotIndex) {
            $(this).attr('aria-label', `Slide ${dotIndex + 1}`);
          });
        });
      });
    },
    navContainer: ".slide-nav-1",
    navText: [
      '<i class="fas fa-chevron-left custom-arrow"></i>',
      '<i class="fas fa-chevron-right custom-arrow"></i>',
    ],

    autoplay: false,
    infinite: "true",

    slidestoscroll: 1,
    rtl: "true",
    rows: 1,
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
        items: 1
      },
      1000: {
        items: 1
      },
      1300: {
        items: 1
      }
    }
  };
  return (
    <Fragment>
      <div className="testimonal-section-sixteen" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-header-sixteen text-center">
                <p>OUr services</p>
                <h2>Featured Services</h2>
              </div>
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-md-5">
              <div className="testi-img">
                <img src={testimonial2} alt="" className="img-fluid" />
                <span className="testi-icon">
                  <i className="fa-solid fa-quote-left" />
                </span>
              </div>
              <div className="testi-users">
                <div className="nav nav-container slide-11" />
                <ul>
                  <li>
                    <img src={client04} alt="" className="img-fluid" />
                  </li>
                  <li>
                    <img src={client03} alt="" className="img-fluid" />
                  </li>
                  <li>
                    <img src={client06_small} alt="" className="img-fluid" />
                  </li>
                  <li>
                    <img src={client07} alt="" className="img-fluid" />
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-7">
              {/* <div className="owl-carousel eye-testislider"> */}
              <OwlCarousel {...testimonialsettings}>
                <div className="testimonial-wrap">
                  <h3>
                    Contrary to popular belief, Lorem Ipsum is not simply random
                    text. It has roots in a piece of classical
                  </h3>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry s
                    standard. The point of using Lorem Ipsum is that it has a
                    more-or-less normal distribution of letters, as opposed to
                    using Content here, content here, making it look like
                    readable English. Many desktop publishing packages and web
                    page editors now use Lorem Ipsum as their default model text,
                    and a search fr lorem ipum will uncover many web sites
                    still in their infancy
                  </p>
                  <div className="testimonial-user">
                    <h4>Elizabeth Forsyth</h4>
                    <p>Las Vegas, USA</p>
                  </div>
                </div>
                <div className="testimonial-wrap">
                  <h3>
                    Contrary to popular belief, Lorem Ipsum is not simply random
                    text. It has roots in a piece of classical
                  </h3>
                  <p>
                    It is a long established fact that a reader will be distracted
                    by the readable content of a page when looking at its layout.
                    The point of using Lorem Ipsum is that it has a more-or-less
                    normal distribution of letters, as opposed to using Content
                    here, content here, making it look like readable English.
                    Many desktop publishing packages and web page editors now use
                    Lorem Ipsum as their default model text, and a search for
                    lorem ipsum will uncover many web sites still in their
                    infancy
                  </p>
                  <div className="testimonial-user">
                    <h4>Leigh Baley</h4>
                    <p>San Jose, USA</p>
                  </div>
                </div>
                <div className="testimonial-wrap">
                  <h3>
                    Contrary to popular belief, Lorem Ipsum is not simply random
                    text. It has roots in a piece of classical
                  </h3>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry s
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a type
                    specimen book. It has survived not only five centuries. The
                    point of using Lorem Ipsum is that it has a more-or-less
                    normal distribution of letters, as opposed to using Content
                    here, content here making it look like readable English.
                  </p>
                  <div className="testimonial-user">
                    <h4>Jon Sparks</h4>
                    <p>Irvine, USA</p>
                  </div>
                </div>
              </OwlCarousel>
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
});

export default TestimonialSection;