/* eslint-disable @next/next/no-img-element */
import { FC } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import {
  faq_sec_img_01,
  faq_sec_img_02,
  faq_sec_img_03,
  faq_sec_img_04,
} from '@/public/assets/imagepath'
import { useTheme } from '@mui/material';

const Questions: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  return (
    <section className="faq-sec-fourteen" style={{ ...muiVar, backgroundColor: theme.palette.background.paper }}>
      <div className="container">
        <div className="section-head-fourteen">
          <h2>
            Have any <span> Questions? </span>
          </h2>
          <p>No Extra charges, No Surprise Fees</p>
        </div>
        <div className="row">
          <div className="col-lg-7">
            <div className="faq-main-cards" id="accordionExample">
              <div className="faq-card aos" data-aos="fade-down">
                <div className="faq-title">
                  <Link
                    data-bs-toggle="collapse"
                    href="#faqOne"
                    aria-expanded="false"
                  >
                    <span>Q</span>
                    <div className="faq-content">
                      <h3>Is assisted living for me?</h3>
                      <div
                        id="faqOne"
                        className="card-collapse collapse show"
                        data-bs-parent="#accordionExample"
                      >
                        <p>
                          Despite your best efforts to provide elder care at
                          home, you may find that the level of care required is
                          simply too demanding. With increase in dependency, you
                          may find that you’re unable to provide assistance
                          yourself or through at-home caregivers. In such a
                          situation, an assisted living facility is the best
                          option. A team of skilled and experienced caregivers
                          are better suited to be able to take care of your
                          loved ones’ every need.
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="faq-card aos" data-aos="fade-down">
                <div className="faq-title">
                  <Link
                    className="collapsed"
                    data-bs-toggle="collapse"
                    href="#faqtwo"
                    aria-expanded="false"
                  >
                    <span>Q</span>
                    <div className="faq-content">
                      <h3>Is assisted living for me?</h3>
                      <div
                        id="faqtwo"
                        className="card-collapse collapse"
                        data-bs-parent="#accordionExample"
                      >
                        <p>
                          An otolaryngologist is a doctor who specializes in the
                          diagnosis and treatment of ear, nose and throat
                          diseases as well as related structures of the head and
                          neck. Otolaryngologists are also referred to as ENT
                          doctors or physicians. For more information
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="faq-card aos" data-aos="fade-down">
                <div className="faq-title">
                  <Link
                    className="collapsed"
                    data-bs-toggle="collapse"
                    href="#faqthree"
                    aria-expanded="false"
                  >
                    <span>Q</span>
                    <div className="faq-content">
                      <h3>Is there a doctor on the premises?</h3>
                      <div
                        id="faqthree"
                        className="card-collapse collapse"
                        data-bs-parent="#accordionExample"
                      >
                        <p>
                          An otolaryngologist is a doctor who specializes in the
                          diagnosis and treatment of ear, nose and throat
                          diseases as well as related structures of the head and
                          neck. Otolaryngologists are also referred to as ENT
                          doctors or physicians. For more information
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="faq-card aos" data-aos="fade-down">
                <div className="faq-title">
                  <Link
                    className="collapsed"
                    data-bs-toggle="collapse"
                    href="#faqfour"
                    aria-expanded="false"
                  >
                    <span>Q</span>
                    <div className="faq-content">
                      <h3>How can we pay for long-term care?</h3>
                      <div
                        id="faqfour"
                        className="card-collapse collapse"
                        data-bs-parent="#accordionExample"
                      >
                        <p>
                          An otolaryngologist is a doctor who specializes in the
                          diagnosis and treatment of ear, nose and throat
                          diseases as well as related structures of the head and
                          neck. Otolaryngologists are also referred to as ENT
                          doctors or physicians. For more information
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="faq-card aos" data-aos="fade-down">
                <div className="faq-title">
                  <Link
                    className="collapsed"
                    data-bs-toggle="collapse"
                    href="#faqfive"
                    aria-expanded="false"
                  >
                    <span>Q</span>
                    <div className="faq-content">
                      <h3>What is Respite Care?</h3>
                      <div
                        id="faqfive"
                        className="card-collapse collapse"
                        data-bs-parent="#accordionExample"
                      >
                        <p>
                          An otolaryngologist is a doctor who specializes in the
                          diagnosis and treatment of ear, nose and throat
                          diseases as well as related structures of the head and
                          neck. Otolaryngologists are also referred to as ENT
                          doctors or physicians. For more information
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="faq-sec-imgs">
              <span className="faq-img-one">
                <img src={faq_sec_img_01} alt="Img" />
              </span>
              <span className="faq-img-two">
                <img src={faq_sec_img_02} alt="Img" />
              </span>
              <span className="faq-img-three">
                <img src={faq_sec_img_03} alt="Img" />
              </span>
              <span className="faq-img-four">
                <img src={faq_sec_img_04} alt="Img" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

export default Questions;