/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import CountUp from 'react-countup'

import {
  counter_bg,
  counter_bg_01
} from "../../../public/assets/imagepath";
import { CountFourSvg, CountOneSvg, CountThreeSvg, CountTwoSvg } from '../../../public/assets/images/icons/IconsSvgs';
import { useTheme } from '@mui/material';

const Counter: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme()

  return (
    <Fragment>
      <section className="counter-section" style={muiVar}>
        <div className="ban-bg">
          <img
            src={counter_bg}
            alt=""
            className="img-fluid bg-06"
          />
          <img
            src={counter_bg_01}
            alt=""
            className="img-fluid bg-07"
          />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-sm-6 ">
              <div className="count-box">
                <span className="count-icon">
                  <CountOneSvg />
                  {/* <img
                    src={count_01}
                    alt=""
                    className="img-fluid"
                  /> */}
                </span>
                <div className="count-info">
                  <h1>
                    <span className="count-digit"><CountUp start={1} end={180} /></span>+
                  </h1>
                  <p style={{ color: theme.palette.background.paper }}>Expert Doctors</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="count-box">
                <span className="count-icon">
                  <CountTwoSvg />
                  {/* <img
                    src={count_02}
                    alt=""
                    className="img-fluid"
                  /> */}
                </span>
                <div className="count-info">
                  <h1>
                    <span className="count-digit"><CountUp start={1} end={26} /></span>+
                  </h1>
                  <p style={{ color: theme.palette.background.paper }}>Expert Services</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="count-box">
                <span className="count-icon">
                  <CountThreeSvg />
                  {/* <img
                    src={count_03}
                    alt=""
                    className="img-fluid"
                  /> */}
                </span>
                <div className="count-info">
                  <h1>
                    <span className="count-digit"><CountUp start={1} end={10} /></span>K+
                  </h1>
                  <p style={{ color: theme.palette.background.paper }}>Happy Customers</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="count-box">
                <span className="count-icon">
                  <CountFourSvg />
                  {/* <img
                    src={count_04}
                    alt=""
                    className="img-fluid"
                  /> */}
                </span>
                <div className="count-info">
                  <h1>
                    <span className="count-digit"><CountUp start={1} end={150} /></span>+
                  </h1>
                  <p style={{ color: theme.palette.background.paper }}>Best Awards Winner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default Counter;