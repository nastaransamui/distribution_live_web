/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect } from 'react'
import dynamic from 'next/dynamic'
const OwlCarousel = dynamic(() => import('react-owl-carousel'), {
  ssr: false,
})

import AOS from 'aos'
import Link from 'next/link'
import useScssVar from '@/hooks/useScssVar'
import { useTheme } from '@mui/material'


const PartnersSection: FC = (() => {

  const { muiVar } = useScssVar();
  const theme = useTheme();

  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);
  const specialitysettings = {
    items: 6,
    loop: true,
    margin: 15,
    dots: false,
    nav: true,
    navContainer: '.slide-nav-3',

    autoplay: true,
    infinite: "true",

    slidestoscroll: 1,
    rtl: "true",
    rows: 6,
    responsive: {
      992: {
        items: 6
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

  return (
    <Fragment>
      <section className="partners-section" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div
                className="section-header-one text-center aos"
                data-aos="fade-up"
              >
                <h2 className="section-title">Our Partners</h2>
              </div>
            </div>
          </div>
          <div className="partners-info aos" data-aos="fade-up">
            <span className="owl-carousel partners-slider d-flex">
              <OwlCarousel {...specialitysettings}>
                <span>
                  <Link href="#">
                    <img
                      className="img-fluid"
                      src={`https://placehold.co/124x45/${theme.palette.secondary.main.slice(1)}/white`}
                      alt="partners"
                    />
                  </Link>
                </span>
                <span>
                  <Link href="#">
                    <img
                      className="img-fluid"
                      src={`https://placehold.co/124x45/${theme.palette.primary.main.slice(1)}/white`}
                      alt="partners"
                    />
                  </Link>
                </span>
                <span>
                  <Link href="#">
                    <img
                      className="img-fluid"
                      src={`https://placehold.co/124x45/${theme.palette.secondary.main.slice(1)}/white`}
                      alt="partners"
                    />
                  </Link>
                </span>
                <span>
                  <Link href="#">
                    <img
                      className="img-fluid"
                      src={`https://placehold.co/124x45/${theme.palette.primary.main.slice(1)}/white`}
                      alt="partners"
                    />
                  </Link>
                </span>
                <span>
                  <Link href="#">
                    <img
                      className="img-fluid"
                      src={`https://placehold.co/124x45/${theme.palette.secondary.main.slice(1)}/white`}
                      alt="partners"
                    />
                  </Link>
                </span>
                <span>
                  <Link href="#">
                    <img
                      className="img-fluid"
                      src={`https://placehold.co/124x45/${theme.palette.primary.main.slice(1)}/white`}
                      alt="partners"
                    />
                  </Link>
                </span>
                <span>
                  <Link href="#">
                    <img
                      className="img-fluid"
                      src={`https://placehold.co/124x45/${theme.palette.secondary.main.slice(1)}/white`}
                      alt="partners"
                    />
                  </Link>
                </span>
                <span>
                  <Link href="#">
                    <img
                      className="img-fluid"
                      src={`https://placehold.co/124x45/${theme.palette.primary.main.slice(1)}/white`}
                      alt="partners"
                    />
                  </Link>
                </span>
                <span>
                  <Link href="#">
                    <img
                      className="img-fluid"
                      src={`https://placehold.co/124x45/${theme.palette.secondary.main.slice(1)}/white`}
                      alt="partners"
                    />
                  </Link>
                </span>
                <span>
                  <Link href="#">
                    <img
                      className="img-fluid"
                      src={`https://placehold.co/124x45/${theme.palette.primary.main.slice(1)}/white`}
                      alt="partners"
                    />
                  </Link>
                </span>
                <span>
                  <Link href="#">
                    <img
                      className="img-fluid"
                      src={`https://placehold.co/124x45/${theme.palette.secondary.main.slice(1)}/white`}
                      alt="partners"
                    />
                  </Link>
                </span>
                <span>
                  <Link href="#">
                    <img
                      className="img-fluid"
                      src={`https://placehold.co/124x45/${theme.palette.primary.main.slice(1)}/white`}
                      alt="partners"
                    />
                  </Link>
                </span>
              </OwlCarousel>
            </span>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default PartnersSection;