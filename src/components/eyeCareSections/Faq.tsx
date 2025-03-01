/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import { EyeIconSvg } from '../../../public/assets/images/icons/IconsSvgs';
import { useTheme } from '@mui/material';
import { center_bg, faq_img_3 } from '../../../public/assets/imagepath';

const Faq: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  return (
    <Fragment>
      <section className="faq-eye-section" style={{ ...muiVar, backgroundColor: theme.palette.background.paper }}>
        <div className="container">
          <div className="row">
            <div className="col-md-12 aos" data-aos="fade-up">
              <div className="section-heading text-center sec-heading-eye">
                <EyeIconSvg />
                <h2>
                  <span>Frequently Asked </span> Questions
                </h2>
                <p>What our clients say about us</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="faq-wrap">
                <ul className="nav">
                  <li>
                    <Link
                      href="#"
                      className="active"
                      data-bs-toggle="tab"
                      data-bs-target="#faq1"
                    >
                      <span>Q</span>
                      How Often should I need to test my eyes?
                    </Link>
                  </li>
                  <li>
                    <Link href="#" data-bs-toggle="tab" data-bs-target="#faq2">
                      <span>Q</span>
                      What are the symptoms of Cataract?
                    </Link>
                  </li>
                  <li>
                    <Link href="#" data-bs-toggle="tab" data-bs-target="#faq3">
                      <span>Q</span>
                      Do I need surgery for Cataract? How would I know that?
                    </Link>
                  </li>
                  <li>
                    <Link href="#" data-bs-toggle="tab" data-bs-target="#faq4">
                      <span>Q</span>
                      What is Myopia or Nearsightedness?
                    </Link>
                  </li>
                  <li>
                    <Link href="#" data-bs-toggle="tab" data-bs-target="#faq5">
                      <span>Q</span>
                      What is Hyperopia or farsightedness?
                    </Link>
                  </li>
                  <li>
                    <Link href="#" data-bs-toggle="tab" data-bs-target="#faq6">
                      <span>Q</span>
                      What is Presbyopia?
                    </Link>
                  </li>
                  <li>
                    <Link href="#" data-bs-toggle="tab" data-bs-target="#faq7">
                      <span>Q</span>
                      My eyes are fine, then why do I need to visit the doctor
                      regularly?
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-6">
              <div className="tab-content pt-0">
                <div className="tab-pane active" id="faq1">
                  <div className="faq-content">
                    <img
                      src={faq_img_3}
                      alt=""
                      className="img-fluid"
                    />
                    <p>
                      As per the American Optometric Association adults who wear
                      glasses or contact lenses and adults who are over 60 years
                      should visit their eye care specialist every year or as
                      suggested by the doctor. If the person doesn’t require any
                      vision correction, then a person between 18 and 60 years should
                      visit the doctor twice a year.
                    </p>
                    <p>
                      This is a condition that results when the visual image is
                      focused behind the retina rather than on the retina. It may be
                      caused due to a small eyeball having a weak focusing power
                      being.
                    </p>
                  </div>
                </div>
                <div className="tab-pane fade" id="faq2">
                  <div className="faq-content">
                    <img
                      src={`https://placehold.co/636x211/${theme.palette.primary.light.slice(1)}/white`}
                      alt=""
                      className="img-fluid"
                    />
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                      labore et dolore magna aliqua.
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      consectetur adipiscing elit, sed do eiusmod.
                    </p>
                  </div>
                </div>
                <div className="tab-pane fade" id="faq3">
                  <div className="faq-content">
                    <img
                      src={`https://placehold.co/636x211/${theme.palette.primary.light.slice(1)}/white`}
                      alt=""
                      className="img-fluid"
                    />
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                      labore et dolore magna aliqua.
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      consectetur adipiscing elit, sed do eiusmod.
                    </p>
                  </div>
                </div>
                <div className="tab-pane fade" id="faq4">
                  <div className="faq-content">
                    <img
                      src={`https://placehold.co/636x211/${theme.palette.primary.light.slice(1)}/white`}
                      alt=""
                      className="img-fluid"
                    />
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                      labore et dolore magna aliqua.
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      consectetur adipiscing elit, sed do eiusmod.
                    </p>
                  </div>
                </div>
                <div className="tab-pane fade" id="faq5">
                  <div className="faq-content">
                    <img
                      src={`https://placehold.co/636x211/${theme.palette.primary.light.slice(1)}/white`}
                      alt=""
                      className="img-fluid"
                    />
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                      labore et dolore magna aliqua.
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      consectetur adipiscing elit, sed do eiusmod.
                    </p>
                  </div>
                </div>
                <div className="tab-pane fade" id="faq6">
                  <div className="faq-content">
                    <img
                      src={`https://placehold.co/636x211/${theme.palette.primary.light.slice(1)}/white`}
                      alt=""
                      className="img-fluid"
                    />
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                      labore et dolore magna aliqua.
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      consectetur adipiscing elit, sed do eiusmod.
                    </p>
                  </div>
                </div>
                <div className="tab-pane fade" id="faq7">
                  <div className="faq-content">
                    <img
                      src={`https://placehold.co/636x211/${theme.palette.primary.light.slice(1)}/white`}
                      alt=""
                      className="img-fluid"
                    />
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                      labore et dolore magna aliqua.
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      consectetur adipiscing elit, sed do eiusmod.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ban-bg">
          <img src={center_bg} alt="" className="img-fluid bg-05 img" />
        </div>
      </section>
    </Fragment>
  )
})

export default Faq;