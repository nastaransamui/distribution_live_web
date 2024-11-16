/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useState } from "react";

import Link from "next/link";

import {
  down_arrow_img,
  generalbanner_img,
  header_icon,
  doctor1,
  doctor2,
  doctor3,
  doctor4,
  doctor5,
  doctor6,
  bannerFifteen
} from "../../../public/assets/imagepath";
import useScssVar from "@/hooks/useScssVar";
import CheckBox from "@mui/icons-material/CheckBox";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button'
import HomeSearchBox from "@/shared/HomeSearchBox";
import Head from "next/head";






const HomeBanner: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme()
  const [showFilter, setShowFilter] = useState<boolean>(false)

  const avatar2Sx = { background: theme.palette.background.paper, mt: 3, width: 50, height: 50, ' & .MuiAvatar-img': { mt: '12px', objectFit: 'scale-down' } }
  const avatar3Sx = { background: theme.palette.background.paper, mt: 1, width: 40, height: 40, ml: -1, border: `1px solid ${theme.palette.text.color}` }
  const avatarTextSx = { fontSize: '14px', background: theme.palette.secondary.main, mt: 1, width: 40, height: 40, ml: -1, border: `1px solid ${theme.palette.text.color}` }


  return (
    <Fragment>
      <Head>
        <link rel="preload" href={generalbanner_img} as="image" />
      </Head>
      <section className="banner-section" style={muiVar}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="banner-content aos" data-aos="fade-up">
                <h1>
                  Consult <span>Best Doctors</span> Your Nearby Location.
                </h1>
                <img
                  src={header_icon}
                  className="header-icon imgColorPrimary"
                  alt="header-icon"
                />
                <p>
                  Try to search with or without filter in below box
                </p>
                <Link href="" scroll={false} className="btn" onClick={(e) => {
                  e.preventDefault();
                  setShowFilter(!showFilter)
                }}>
                  Start a Consult
                </Link>
                <div className="banner-arrow-img">
                  <img src={down_arrow_img} className="imgColorPrimary" alt="" />
                </div>
              </div>
              <HomeSearchBox showFilter={showFilter} setShowFilter={setShowFilter} />
            </div>
            <div className="col-lg-6" >
              <div className="banner-img aos" data-aos="fade-up">
                <img src={generalbanner_img} alt="" />
                <div className="banner-img1">
                  <div className="banner-img1-div" >
                    <CheckBox color="secondary" sx={{ fontSize: 38, ml: 1 }} />
                    <Typography sx={{ ml: 1, mt: 1 }} display="block" gutterBottom>Regular Checkup</Typography>
                  </div>
                </div>
                <div className="banner-img2">
                  <div className="banner-img2-div" >
                    <Avatar sx={avatar2Sx} alt="" src={bannerFifteen} />
                    <Typography sx={{ ml: 1, mt: 1 }} display="block" gutterBottom>John Doe</Typography>
                    <Typography sx={{ ml: 1, mt: 1, mb: 2 }} variant="caption" gutterBottom>MMBBS, Cardiologist</Typography>
                    <Button variant="contained">Book Now</Button>
                  </div>
                </div>
                <div className="banner-img3">
                  <div className="banner-img3-div" >
                    <Typography sx={{ ml: -10, mt: 2 }} display="block" gutterBottom>Meet our doctors</Typography>
                    <span style={{ display: 'flex' }}>
                      <Avatar sx={avatar3Sx} alt="" src={doctor1} />
                      <Avatar sx={avatar3Sx} alt="" src={doctor2} />
                      <Avatar sx={avatar3Sx} alt="" src={doctor3} />
                      <Avatar sx={avatar3Sx} alt="" src={doctor4} />
                      <Avatar sx={avatar3Sx} alt="" src={doctor5} />
                      <Avatar sx={avatar3Sx} alt="" src={doctor6} />
                      <Avatar sx={avatarTextSx} alt="" >120+</Avatar>

                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default HomeBanner;