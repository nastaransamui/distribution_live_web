/* eslint-disable @next/next/no-img-element */
import React, { FC, Fragment } from "react";
import Link from "next/link";
import {
  app_store,
  google_play,
  mobile_img,
  scan_img
} from "../../../public/assets/imagepath"
import useScssVar from "@/hooks/useScssVar";
import { useTheme } from "@mui/material";

const MobileAppSection: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  return (
    <Fragment>
      <section className="app-section" style={muiVar}>
        <div className="container">
          <div className="app-bg" style={{ backgroundImage: `url(/assets/images/app-bg_${theme.palette.secondary.main.slice(1)}.webp)` }}>
            <div className="row align-items-center">
              <div className="col-lg-6 col-md-12">
                <div className="app-content">
                  <div className="app-header aos" data-aos="fade-up">
                    <h5>Working for Your Better Health.</h5>
                    <h2>Download the Health Care App today!</h2>
                  </div>
                  <div className="app-scan aos" data-aos="fade-up">
                    <p>Scan the QR code to get the app now</p>
                    <img src={scan_img} alt="" />
                  </div>
                  <div className="google-imgs aos" data-aos="fade-up">
                    <Link href="#">
                      <img src={google_play} alt="img" />
                    </Link>
                    <Link href="#">
                      <img src={app_store} alt="img" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-12 aos" data-aos="fade-up">
                <div className="mobile-img">
                  <img
                    src={mobile_img}
                    className="img-fluid"
                    alt="img"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
})
export default MobileAppSection;