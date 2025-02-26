/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useState } from 'react'
import Lightbox from "yet-another-react-lightbox";
import Link from 'next/link'
import useScssVar from '@/hooks/useScssVar'
import { doctor_17, doctors_profile } from '@/public/assets/imagepath';
import { DoctorProfileType } from '@/components/SearchDoctorSections/SearchDoctorSection';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import Grid from '@mui/material/Grid';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { ProfileImageStyledBadge } from '@/components/DoctorDashboardSections/MyPtients';
import { loadStylesheet } from '@/pages/_app';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SyncIcon from '@mui/icons-material/Sync';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { LoginBox } from '@/components/AuthSections/LoginSection';
import CloseIcon from '@mui/icons-material/Close';
import { Transition } from '@/components/shared/Dialog';
import { FiCalendar, FiClock, FiDollarSign, FiInfo, FiThumbsUp } from 'react-icons/fi';
import { formatNumberWithCommas } from '@/components/DoctorDashboardSections/ScheduleTiming';

const PageContent: FC<{ profile: DoctorProfileType }> = (({ profile }) => {
  const { muiVar, bounce } = useScssVar();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const router = useRouter();
  // const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

  const [loginDialog, setLoginDialog] = useState<boolean>(false)
  const [favIconLoading, setFavIconLoading] = useState<boolean>(false);
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  useEffect(() => {

    loadStylesheet('/css/yet-another-react-lightbox-styles.css')
  }, [])

  const _fav_button = () => {
    let isFav = !!userProfile ? profile?.favs_id?.includes(userProfile?._id as string) : false

    return (
      <Tooltip arrow title={!userProfile ? 'Login in to add to favorit.' : `${isFav ? 'Remove' : 'Add'} doctor to favorite.`}>
        <IconButton
          disableFocusRipple
          disableRipple
          aria-label="add to favorites"
          sx={{
            padding: 0
          }}
          onClick={() => {
            if (!userProfile) {
              setLoginDialog(true)
            } else {
              setFavIconLoading(true);
              if (!isFav) {
                if (homeSocket?.current && typeof favIconLoading == 'undefined' ||
                  !favIconLoading) {
                  homeSocket.current.emit('addDocToFav', { doctorId: profile?._id, patientId: userProfile?._id })
                  homeSocket.current.once('addDocToFavReturn', (msg: { status: number, message: string }) => {
                    const { status, message } = msg;
                    if (status !== 200) {
                      toast.error(message, {
                        position: "bottom-center",
                        toastId: 'error',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        transition: bounce,
                        onClose: () => {
                          toast.dismiss('error')
                        }
                      });
                    } else {
                      profile?.favs_id.push(userProfile._id)
                      setFavIconLoading(false);
                    }
                  })
                }
              } else {
                if (homeSocket?.current && typeof favIconLoading == 'undefined' ||
                  !favIconLoading) {
                  homeSocket.current.emit('removeDocFromFav', { doctorId: profile?._id, patientId: userProfile?._id })
                  homeSocket.current.once('removeDocFromFavReturn', (msg: { status: number, message: string }) => {
                    const { status, message } = msg;
                    if (status !== 200) {
                      toast.error(message, {
                        position: "bottom-center",
                        toastId: 'error',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        transition: bounce,
                        onClose: () => {
                          toast.dismiss('error')
                        }
                      });
                    } else {
                      setFavIconLoading(false);
                      const codeIndex = profile?.favs_id.indexOf(userProfile._id);
                      if (codeIndex > -1) {
                        profile?.favs_id.splice(codeIndex, 1);
                      }
                    }
                  })
                }
              }
            }
          }}
        >
          {typeof favIconLoading == 'undefined' ||
            !favIconLoading ?
            <FavoriteIcon sx={{
              animation: isFav ? `heartbeat 1s infinite` : 'unset',
              color: isFav ? 'deeppink' : 'unset',
              "&:hover": {
                animation: `heartbeat 1s infinite`,
                color: 'deeppink'
              },
              fontSize: '1.1rem'
            }} />
            :
            <SyncIcon sx={{
              color: 'primary.main',
              animation: `rotate 3s infinite`,
            }} />
          }
        </IconButton>
      </Tooltip>
    )
  }
  return (
    <Fragment>
      <div>
        <div className="card animate__animated animate__backInUp" style={muiVar}>
          <div className="card-body">
            <div className="doctor-widget">
              <div className="doc-info-left">
                <div className="doctor-img">

                  <ProfileImageStyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                    variant="dot"
                    online={profile.online as boolean}
                  >
                    <Avatar sx={{
                      width: 'fit-content',
                      height: 'auto',
                      transition: 'all 2000ms cubic-bezier(0.19, 1, 0.22, 1) 0ms',
                      "&:hover": {
                        boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                        transform: "scale(1.15)",
                      },

                    }} variant="square" alt="" src={profile?.profileImage}
                      key={profile?.profileImage}
                    >
                      <img className="img-fluid" src={doctors_profile} alt="" />
                    </Avatar>
                  </ProfileImageStyledBadge>
                </div>
                <div className="doc-info-cont">
                  <h1 className="doc-name">Dr. {profile?.firstName} {" "} {profile?.lastName}</h1>
                  <p className="doc-speciality">
                    {profile?.specialities?.[0]?.description}
                  </p>
                  <p className="doc-department">
                    <img
                      src={profile?.specialities?.[0]?.image}
                      className="img-fluid"
                      alt="Speciality"
                    />
                    {profile?.specialities?.[0]?.specialities}
                  </p>
                  <span style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                    <Rating name="read-only" precision={0.5} value={profile?.rate_array.length == 0 ? 0 : (profile?.rate_array.reduce((acc, num) => acc + num, 0) / profile?.rate_array.length)} readOnly size='small' />
                    <span className="d-inline-block average-rating" style={{ marginLeft: '6px' }}>({profile?.rate_array.length})</span>
                  </span>
                  <div className="clinic-details">
                    <div className="doctor-widget-one">

                      <p className="doc-location" >
                        <i className="fas fa-map-marker-alt"> </i>
                        {profile?.city}  {profile?.country}
                      </p>

                    </div>
                    <div>

                      <ul className="clinic-gallery">
                        {profile?.clinicImages.length !== 0 &&
                          profile?.clinicImages.map((img, index) => {
                            return (
                              <li key={index}>
                                <Link href="" aria-label='clinic-gallery' onClick={(e) => {
                                  e.preventDefault();
                                  setOpen(true);
                                  setIndex(index)
                                }} >
                                  <img src={img.src} alt='' />
                                </Link>
                              </li>
                            )
                          })
                        }
                      </ul>
                    </div>
                  </div>

                </div>

              </div>
              <div className="doc-info-right">
                <div className="clini-infos">
                  <ul>
                    <li style={{ marginBottom: 10 }}>
                      <FiThumbsUp />&nbsp; {`${profile?.recommendArray && profile?.recommendArray.length !== 0
                        ? ((profile?.recommendArray.filter(vote => vote === 1).length / profile?.recommendArray?.length) * 100).toFixed(0)
                        : `0`}%`}{" "}
                      <span className="votes">({profile?.recommendArray ? profile?.recommendArray?.length : 0} Votes)</span>
                    </li>
                    <li>
                      <i className="far fa-comment" /> {profile?.reviews_array?.length} Feedback
                    </li>
                    <li>
                      <i className="far fa-money-bill-alt" />
                      <Tooltip arrow title="Averrage price per hour">
                        <span> A/H:</span>
                      </Tooltip>{" "}
                      {profile?.currency && profile?.currency.length > 0 && `${profile?.currency[0]?.currency_symbol}`}{" "}
                      {profile?.timeslots && profile?.timeslots.length > 0 && formatNumberWithCommas(`${profile?.timeslots[0]?.averageHourlyPrice?.toFixed(0)}`)}{" "}
                    </li>
                  </ul>
                </div>
                <div className="doctor-action">
                  <Link href={''} onClick={(e) => e.preventDefault()} className="btn btn-white msg-btn">
                    {_fav_button()}
                  </Link>
                  <Link href="/chat-doctor" aria-label='chat' className="btn btn-white msg-btn" onClick={(e) => {
                    e.preventDefault();
                    if (userProfile) {
                    } else {
                      setLoginDialog(true)
                    }
                  }}>
                    <i className="far fa-comment-alt" />
                  </Link>

                  <Link
                    href="#"
                    aria-label='call'
                    className="btn btn-white call-btn"
                    // data-bs-toggle="modal"
                    // data-bs-target="#voice_call"
                    onClick={(e) => {
                      e.preventDefault();

                      if (userProfile) {
                        window.$('#voice_call').modal('toggle')
                      } else {
                        setLoginDialog(true)
                      }
                    }}
                  >
                    <i className="fas fa-phone" />
                  </Link>
                  <Link
                    href="#"
                    className="btn btn-white call-btn"
                    aria-label='video-call'
                    // data-bs-toggle="modal"
                    // data-bs-target="#video_call"
                    onClick={(e) => {
                      e.preventDefault();

                      if (userProfile) {
                        window.$('#video_call').modal('toggle')
                      } else {
                        setLoginDialog(true)
                      }
                    }}
                  >
                    <i className="fas fa-video" />
                  </Link>
                </div>
                <div className="clinic-booking">
                  <Link
                    // className="btn apt-btn" 
                    className={profile?.timeslots.length > 0 ? "btn apt-btn" : 'btn-primary-light-disabled'}
                    href=""
                    style={{ lineHeight: '16px', cursor: profile?.timeslots.length > 0 ? 'pointer' : 'default' }}
                    onClick={(e) => {
                      e.preventDefault();
                      // profile
                      if (userProfile) {
                        if (profile?.timeslots.length > 0) {
                          router.push(`/doctors/booking/${btoa(profile?._id)}`)
                        }
                      } else {
                        setLoginDialog(true)
                      }
                    }}>
                    Book Appointment
                  </Link>
                </div>
              </div>
            </div>
            <Grid container rowGap={1} columnGap={1} sx={{ paddingRight: 1, paddingLeft: 1, mt: 1 }} className="clinic-services"
              key={profile?.specialitiesServices?.toString()}>
              {profile?.specialitiesServices &&
                profile?.specialitiesServices.map((s: string, i: number) => {
                  return (
                    <Grid key={s + i} item component="span" >{s}</Grid>
                  )
                })
              }
            </Grid>
          </div>
        </div>

      </div>
      <div className="modal fade call-modal" id="voice_call" style={muiVar}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <div className="call-box incoming-box">
                <div className="call-wrapper">
                  <div className="call-inner">
                    <div className="call-user">
                      <img
                        alt=""
                        src={profile?.profileImage || doctors_profile}
                        className="call-avatar"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = doctors_profile; // Set fallback image
                        }}
                      />
                      <h4>Dr. {profile?.firstName} {" "} {profile?.lastName}</h4>
                      <span>Connecting...</span>
                    </div>
                    <div className="call-items">
                      <Link
                        href="#"
                        className=" call-item call-end"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      >
                        <i className="material-icons">call_end</i>
                      </Link>
                      <Link href="/voice-call" className=" call-item call-start">
                        <i className="material-icons">call</i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              {/* Outgoing Call */}
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade call-modal" id="video_call" style={muiVar}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body">
              {/* Incoming Call */}
              <div className="call-box incoming-box">
                <div className="call-wrapper">
                  <div className="call-inner">
                    <div className="call-user">
                      <img
                        alt=""
                        src={profile?.profileImage || doctors_profile}
                        className="call-avatar"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = doctors_profile; // Set fallback image
                        }}
                      />
                      <h4>Dr. {profile?.firstName} {" "} {profile?.lastName}</h4>
                      <span>Calling ...</span>
                    </div>
                    <div className="call-items">
                      <Link
                        href="#"
                        className=" call-item call-end"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      >
                        <i className="material-icons">call_end</i>
                      </Link>
                      <Link href="/video-call" className=" call-item call-start">
                        <i className="material-icons">videocam</i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Incoming Call */}
            </div>
          </div>
        </div>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={profile?.clinicImages}
        index={index}
      />
      <Dialog
        TransitionComponent={Transition}
        open={loginDialog}
        onClose={() => {
          document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
          setTimeout(() => {
            setLoginDialog(false)
          }, 500);
        }}
        scroll='body'
        aria-labelledby="login"
        aria-describedby="login"
        maxWidth="xs"
      >
        <DialogTitle id="login">
          Login
          <IconButton
            color="inherit"
            onClick={() => {
              document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
              setTimeout(() => {
                setLoginDialog(false)
              }, 500);
            }}
            aria-label="close"
            sx={{ "&:hover": { color: 'primary.main' }, float: 'right' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <div style={muiVar}>
            <div className="col-md-12">
              <div className="account-content">
                <div className="col-md-12 col-lg-12 login-right">
                  <LoginBox closeDialog={setLoginDialog} />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>

        </DialogActions>
      </Dialog>
    </Fragment>
  )
});

export default PageContent;