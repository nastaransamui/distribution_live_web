/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useState } from "react";

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
  bannerFifteen,
  doctors_profile
} from "../../../public/assets/imagepath";
import useScssVar from "@/hooks/useScssVar";
import CheckBox from "@mui/icons-material/CheckBox";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button'
import HomeSearchBox from "@/shared/HomeSearchBox";
import Head from "next/head";
import { useSelector } from "react-redux";
import { AppState } from "@/redux/store";
import { StyledBadge } from "../DoctorDashboardSections/ScheduleTiming";
import { useRouter } from "next/router";
import { BestDoctorsType } from "@/redux/bestDoctorsData";
import Tooltip from '@mui/material/Tooltip'
import Skeleton from '@mui/material/Skeleton'



const HomeBanner: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme()
  const [showFilter, setShowFilter] = useState<boolean>(false)
  const router = useRouter();
  const bestDoctorsData = useSelector((state: AppState) => state.bestDoctorsData)
  const { bestDoctors, totalDoctors } = bestDoctorsData;
  const avatar2Sx = { background: theme.palette.background.paper, mt: 3, width: 50, height: 50, ' & .MuiAvatar-img': { mt: bestDoctors == null ? '12px' : 'unset', objectFit: 'scale-down' } }
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
                    <Typography
                      sx={{ ml: 1, mt: 1 }}
                      display="block"
                      gutterBottom
                      component="a"
                      href="/doctors/search"
                    >
                      Regular Checkup
                    </Typography>
                  </div>
                </div>
                <div className="banner-img2">
                  <div className="banner-img2-div" >
                    {
                      bestDoctors == null ?
                        <Skeleton animation="wave" variant="circular" sx={{ ...avatar2Sx, border: `1px solid ${theme.palette.secondary.main}` }} /> :
                        <Link aria-label='profile' className=" mx-2" href={`/doctors/profile/${btoa(bestDoctors?.[0]?._id)}`} >
                          <StyledBadge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            variant="dot"
                            online={bestDoctors?.[0]?.online}
                          >
                            <Avatar sx={avatar2Sx} alt="" src={bestDoctors?.[0]?.profileImage || doctors_profile}>
                              <img src={doctors_profile} alt="" className="avatar" />
                            </Avatar>
                          </StyledBadge>
                        </Link>
                    }
                    <Typography
                      sx={{ ml: 1, mt: 1 }}
                      display="block"
                      gutterBottom
                      component={bestDoctors !== null && bestDoctors.length == 0 ? 'span' : 'a'}
                      href={bestDoctors !== null && bestDoctors.length == 0 ? "/" : `/doctors/profile/${bestDoctors !== null && btoa(bestDoctors?.[0]?._id)}`}
                    >
                      {bestDoctors == null ? <Skeleton
                        animation="wave"
                        variant="rectangular"
                        sx={{ borderRadius: '8px', height: '6px', width: '95px' }} /> : bestDoctors?.[0]?.fullName || `John Doe`}
                    </Typography>
                    <Typography sx={{ ml: 1, mt: 1, mb: 2, color: 'secondary.main' }} variant="caption" gutterBottom>
                      {bestDoctors == null ? <Skeleton
                        animation="wave"
                        variant="rectangular"
                        sx={{ borderRadius: '8px', height: '6px', width: '95px' }} /> : bestDoctors?.[0]?.specialities?.[0]?.specialities || 'MMBBS, Cardiologist'}
                    </Typography>
                    <Button variant="contained" onClick={() => {
                      if (bestDoctors !== null && bestDoctors?.length !== 0) {
                        router.push(`/doctors/profile/${bestDoctors !== null && btoa(bestDoctors?.[0]?._id)}`)
                      }
                    }}>Book Now</Button>
                  </div>
                </div>
                <div className="banner-img3">
                  <div className="banner-img3-div" >
                    <Typography sx={{ ml: -10, mt: 2 }} display="block" gutterBottom>Meet our doctors</Typography>
                    {
                      bestDoctors == null ?
                        <span style={{ display: 'flex' }}>
                          {
                            Array.from(Array(6).keys()).map((i) => (
                              <Skeleton
                                key={i}
                                animation="wave"
                                variant="circular"
                                sx={{
                                  ...avatar3Sx,
                                  border: `1px solid ${theme.palette.secondary.main}`
                                }} />
                            ))
                          }
                          <Avatar sx={avatarTextSx} alt="" >.....</Avatar>
                        </span>
                        :
                        bestDoctors.length == 0 ?
                          <span style={{ display: 'flex' }}>
                            <Avatar sx={avatar3Sx} alt="" src={doctor1} />
                            <Avatar sx={avatar3Sx} alt="" src={doctor2} />
                            <Avatar sx={avatar3Sx} alt="" src={doctor3} />
                            <Avatar sx={avatar3Sx} alt="" src={doctor4} />
                            <Avatar sx={avatar3Sx} alt="" src={doctor5} />
                            <Avatar sx={avatar3Sx} alt="" src={doctor6} />
                            <Avatar sx={avatarTextSx} alt="" >120+</Avatar>

                          </span> :
                          <span style={{ display: 'flex' }}>
                            {
                              bestDoctors.slice(0, 6).map((bestDoctor: BestDoctorsType, index: number) => (
                                <Tooltip key={index} arrow placement="top" title={`Dr. ${bestDoctor.fullName}`}>
                                  <Link href={`/doctors/profile/${btoa(bestDoctor._id)}`} >
                                    <StyledBadge
                                      overlap="circular"
                                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                      variant="dot"
                                      online={bestDoctor?.online}
                                    >
                                      <Avatar sx={avatar3Sx} alt="" src={bestDoctor?.profileImage} >
                                        <img src={doctors_profile} alt="" className="avatar" />
                                      </Avatar>
                                    </StyledBadge>
                                  </Link>
                                </Tooltip>
                              ))
                            }
                            <Avatar sx={avatarTextSx} alt="" >{`${totalDoctors}+`}</Avatar>

                          </span>
                    }
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