/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import Link from 'next/link'
import useScssVar from '@/hooks/useScssVar'
import { FactFiveIconSvg, FactFourIconSvg, FactOneIconSvg, FactThreeIconSvg, FactTwoIconSvg } from '../../../public/assets/images/icons/IconsSvgs';


const FactSection: FC = (() => {
  const { muiVar } = useScssVar();

  return (
    <Fragment>
      <div className="facts-section-sixteen" style={muiVar}>
        <div className="container">
          <div className="facts-section-all">
            <div className="facts-main-sixteen">
              <span>OUr services</span>
              <h2>Facts you need to know ahead</h2>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industrys standard dummy text
                ever since the 1500s, when an unknown printer took a galley of
                type and scrambled it to make a type specimen book.{" "}
              </p>
              <Link href="/doctors/booking">
                Read More
                <i className="fa-solid fa-chevron-right ms-2" />
              </Link>
            </div>
            <div className="facts-content-all">
              <ul>
                <li>
                  <div className="facts-sixteen-img">
                    <FactFiveIconSvg />
                    <div className="facts-content-sixteen">
                      <div className="facts-content-one">
                        <h5>
                          Consequences
                          <i className="fa-solid fa-angle-right ms-2" />
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div className="facts-content-two facts-content-two-solid">
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industrys
                      standard dummy text ever.
                    </p>
                  </div>
                </li>
                <li>
                  <div className="facts-sixteen-img">
                    <FactFourIconSvg />
                    <div className="facts-content-sixteen">
                      <div className="facts-content-one">
                        <h5>
                          Privacy policy
                          <i className="fa-solid fa-angle-right ms-2" />
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div className="facts-content-two facts-content-two-solid">
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industrys
                      standard dummy text ever.
                    </p>
                  </div>
                </li>
                <li>
                  <div className="facts-sixteen-img">
                    <FactThreeIconSvg />
                    <div className="facts-content-sixteen">
                      <div className="facts-content-one">
                        <h5>
                          Surgery preparation
                          <i className="fa-solid fa-angle-right ms-2" />
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div className="facts-content-two facts-content-two-solid">
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industrys
                      standard dummy text ever.
                    </p>
                  </div>
                </li>
                <li>
                  <div className="facts-sixteen-img">
                    <FactTwoIconSvg />
                    <div className="facts-content-sixteen">
                      <div className="facts-content-one">
                        <h5>
                          Age limit
                          <i className="fa-solid fa-angle-right ms-2" />
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div className="facts-content-two facts-content-two-solid">
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industrys
                      standard dummy text ever.
                    </p>
                  </div>
                </li>
                <li>
                  <div className="facts-sixteen-img">
                    <FactOneIconSvg />
                    <div className="facts-content-sixteen">
                      <div className="facts-content-one">
                        <h5>
                          After Surgery
                          <i className="fa-solid fa-angle-right ms-2" />
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div className="facts-content-two facts-content-two-solid">
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industrys
                      standard dummy text ever.
                    </p>
                  </div>
                </li>
                <li>
                  <div className="facts-sixteen-img">
                    <FactFiveIconSvg />
                    <div className="facts-content-sixteen">
                      <div className="facts-content-one">
                        <h5>
                          Consequences
                          <i className="fa-solid fa-angle-right ms-2" />
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div className="facts-content-two facts-content-two-solid">
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industrys
                      standard dummy text ever.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
});

export default FactSection