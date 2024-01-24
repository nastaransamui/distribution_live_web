/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { ChooseIconFourSvg, ChooseIconOneSvg, ChooseIconThreeSvg, ChooseIconTwoSvg, ServeImageIconOneSvg } from '../../../public/assets/images/icons/IconsSvgs';
import { choose_us_six } from '../../../public/assets/imagepath';
import { useTheme } from '@mui/material';


const WhyChooseUs: FC = (() => {

  const { muiVar } = useScssVar();
  const theme = useTheme();
  return (
    <Fragment>
      <section className="choose-us-fourteen" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-header-fourteen text-center">
                <div className="service-inner-fourteen justify-content-center">
                  <div className="service-inner-fourteen-one"></div>
                  <div className="service-inner-fourteen-two">
                    <h3>Why Us</h3>
                  </div>
                  <div className="service-inner-fourteen-three"></div>
                </div>
                <h2>Why Choose Us</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">
              <div className="you-get-list">
                <ul>
                  <li>
                    <div className="get-list-content" style={{ backgroundImage: `url(/assets/images/chooseus-ryt-1_${theme.palette.mode}.png)` }}>
                      <div className="get-icon">
                        <ChooseIconOneSvg />
                      </div>
                      <div className="get-icon-right">
                        <h3>Award Winning Service</h3>
                        <p>
                          Duas molestias excepturi sint occaecati cupiditate non
                          provident, similique sunt in culpa qui offici
                        </p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="get-list-content second-bg" style={{ backgroundImage: `url(/assets/images/chooseus-ryt-2_${theme.palette.mode}.png)` }}>
                      <div className="get-icon">
                        <ChooseIconTwoSvg />
                      </div>
                      <div className="get-icon-right">
                        <h3>Best Quality Pregnancy Care</h3>
                        <p>
                          Duas molestias excepturi sint occaecati cupiditate non
                          provident, similique sunt in culpa qui offici
                        </p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="get-list-content" style={{ backgroundImage: `url(/assets/images/chooseus-ryt-1_${theme.palette.mode}.png)` }}>
                      <div className="get-icon">
                        <ChooseIconThreeSvg />
                      </div>
                      <div className="get-icon-right">
                        <h3>Complete Medical Equipment</h3>
                        <p>
                          Duas molestias excepturi sint occaecati cupiditate non
                          provident, similique sunt in culpa qui offici
                        </p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="get-list-content second-bg" style={{ backgroundImage: `url(/assets/images/chooseus-ryt-2_${theme.palette.mode}.png)` }}>
                      <div className="get-icon">
                        <ChooseIconFourSvg />
                      </div>
                      <div className="get-icon-right">
                        <h3>Dedicated Emergency Care</h3>
                        <p>
                          Duas molestias excepturi sint occaecati cupiditate non
                          provident, similique sunt in culpa qui offici
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="choose-us-right-main">
                <img
                  src={choose_us_six}
                  alt="image"
                  className="img-fluid"
                />
                <div className="banner-imgfourteenten">
                  <ServeImageIconOneSvg />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
})

export default WhyChooseUs;