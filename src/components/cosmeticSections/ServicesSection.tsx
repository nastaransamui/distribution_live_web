/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import useScssVar from '@/hooks/useScssVar'
import { servicesixteenicon } from '../../../public/assets/imagepath';
import { DiscoverFiveSvg, DiscoverFourSvg, DiscoverOneSvg, DiscoverThreeSvg, DiscoverTwoSvg } from '../../../public/assets/images/icons/IconsSvgs';
import $ from 'jquery'
const OwlCarousel = dynamic(() => import(`react-owl-carousel`), { ssr: false });



const ServicesSection: FC = (() => {
  const { muiVar } = useScssVar();
  const settings = {
    items: 5,
    loop: true,
    margin: 10,
    dots: true,
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
    nav: false,
    smartSpeed: 2000,
    responsive: {
      0: {
        items: 1
      },
      500: {
        items: 1
      },
      575: {
        items: 2
      },
      768: {
        items: 2
      },
      1000: {
        items: 5
      },
      1300: {
        items: 4
      }
    }
  };
  return (
    <Fragment>
      <section className="services-section-sixteen" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-header-sixteen text-center">
                <p>Recapture the beauty of self-confidence</p>
                <h2>Discover a New you</h2>
              </div>
            </div>
          </div>
          <div className="discover-slider owl-theme">
            <OwlCarousel {...settings}>
              <div className="discover-you-main">
                <div className="discover-you-image">
                  <DiscoverFiveSvg />
                </div>
                <Link href="#">Body</Link>
                <p>Lorem Ipsum is simply dummy typesetting industry.</p>
                <Link href="#" className="discov-innner">
                  Get your answers
                  <i className="fa-solid fa-chevron-right ms-2" />
                </Link>
              </div>
              <div className="discover-you-main">
                <div className="discover-you-image">
                  <DiscoverFourSvg />
                </div>
                <Link href="#">Face</Link>
                <p>Lorem Ipsum is simply dummy typesetting industry.</p>
                <Link href="#" className="discov-innner">
                  Get your answers
                  <i className="fa-solid fa-chevron-right ms-2" />
                </Link>
              </div>
              <div className="discover-you-main">
                <div className="discover-you-image">
                  <DiscoverThreeSvg />
                </div>
                <Link href="#">Breast</Link>
                <p>Lorem Ipsum is simply dummy typesetting industry.</p>
                <Link href="#" className="discov-innner">
                  Get your answers
                  <i className="fa-solid fa-chevron-right ms-2" />
                </Link>
              </div>
              <div className="discover-you-main">
                <div className="discover-you-image">
                  <DiscoverTwoSvg />
                </div>
                <Link href="#">Nose</Link>
                <p>Lorem Ipsum is simply dummy typesetting industry.</p>
                <Link href="#" className="discov-innner">
                  Get your answers
                  <i className="fa-solid fa-chevron-right ms-2" />
                </Link>
              </div>
              <div className="discover-you-main">
                <div className="discover-you-image">
                  <DiscoverOneSvg />
                </div>
                <Link href="#">Fillers</Link>
                <p>Lorem Ipsum is simply dummy typesetting industry.</p>
                <Link href="#" className="discov-innner">
                  Get your answers
                  <i className="fa-solid fa-chevron-right ms-2" />
                </Link>
              </div>
              <div className="discover-you-main">
                <div className="discover-you-image">
                  <DiscoverThreeSvg />
                </div>
                <Link href="#">Face</Link>
                <p>Lorem Ipsum is simply dummy typesetting industry.</p>
                <Link href="#" className="discov-innner">
                  Get your answers
                  <i className="fa-solid fa-chevron-right ms-2" />
                </Link>
              </div>
              <div className="discover-you-main">
                <div className="discover-you-image">
                  <DiscoverFourSvg />
                </div>
                <Link href="#">Body</Link>
                <p>Lorem Ipsum is simply dummy typesetting industry.</p>
                <Link href="#" className="discov-innner">
                  Get your answers
                  <i className="fa-solid fa-chevron-right ms-2" />
                </Link>
              </div>
              <div className="discover-you-main">
                <div className="discover-you-image">
                  <DiscoverThreeSvg />
                </div>
                <Link href="#">Nose</Link>
                <p>Lorem Ipsum is simply dummy typesetting industry.</p>
                <Link href="#" className="discov-innner">
                  Get your answers
                  <i className="fa-solid fa-chevron-right ms-2" />
                </Link>
              </div>
              <div className="discover-you-main">
                <div className="discover-you-image">
                  <DiscoverTwoSvg />
                </div>
                <Link href="#">Fillers</Link>
                <p>Lorem Ipsum is simply dummy typesetting industry.</p>
                <Link href="#" className="discov-innner">
                  Get your answers
                  <i className="fa-solid fa-chevron-right ms-2" />
                </Link>
              </div>
              <div className="discover-you-main">
                <div className="discover-you-image">
                  <DiscoverFourSvg />
                </div>
                <Link href="#">Breast</Link>
                <p>Lorem Ipsum is simply dummy typesetting industry.</p>
                <Link href="#" className="discov-innner">
                  Get your answers
                  <i className="fa-solid fa-chevron-right ms-2" />
                </Link>
              </div>
              <div className="discover-you-main">
                <div className="discover-you-image">
                  <DiscoverTwoSvg />
                </div>
                <Link href="#">Body</Link>
                <p>Lorem Ipsum is simply dummy typesetting industry.</p>
                <Link href="#" className="discov-innner">
                  Get your answers
                  <i className="fa-solid fa-chevron-right ms-2" />
                </Link>
              </div>
            </OwlCarousel>
          </div>
        </div>
        <div className="service-sixteen-icon imgColorPrimary">
          <img src={servicesixteenicon} alt="" />
        </div>
      </section>
    </Fragment>
  )
});

export default ServicesSection;