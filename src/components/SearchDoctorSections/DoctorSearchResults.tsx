

/* eslint-disable @next/next/no-img-element */
import { CSSProperties, FC, Fragment, createRef, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { FiCalendar, FiClock, FiDollarSign, FiInfo, FiThumbsUp } from 'react-icons/fi';
import { doctors_profile, } from '@/public/assets/imagepath';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import dayjs from 'dayjs';
import preciseDiff from 'dayjs-precise-range'
import Lightbox from "yet-another-react-lightbox";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CardActionArea, useTheme } from '@mui/material';
import { ClinicImagesType, DoctorProfileType } from './SearchDoctorSection';
import { useSearchParams } from 'next/navigation';
import ReadMoreText from 'read-more-less-react';
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import Rating from '@mui/material/Rating';
import Tooltip from '@mui/material/Tooltip';
import ScrollIntoView from 'react-scroll-into-view'
import Button from '@mui/material/Button'
import { DoctorListSearchSkleton, DoctorGridSearchSkleton } from '@/shared/DoctorSearchSkeleton'
import throttle from 'lodash/throttle';
import { AutoSizer, IndexRange, InfiniteLoader, List, WindowScroller, Grid as VirtualGrid, } from 'react-virtualized';
import useMediaQuery from '@mui/material/useMediaQuery';
import CustomNoRowsOverlay from '@/shared/CustomNoRowsOverlay';
import DoctorTopSearchSkeleton from '../shared/DoctorTopSearchSkeleton';
import { styled } from '@mui/material/styles';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import MuiList from '@mui/material/List'
import ListItem from '@mui/material/ListItem'

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SyncIcon from '@mui/icons-material/Sync';
import Zoom from '@mui/material/Zoom';
import { AvailableType } from '../DoctorDashboardSections/ScheduleTiming';


import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { LoginBox } from '@/components/AuthSections/LoginSection';
import useScssVar from '@/hooks/useScssVar'
import { Transition } from '@/components/shared/Dialog';


import {
  FacebookIcon,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  FacebookShareButton,
  FacebookShareCount,
  LineIcon,
  LineShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  XIcon,
} from "react-share";
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { toast } from 'react-toastify';
import { ProfileImageStyledBadge } from '../DoctorDashboardSections/MyPtients';
import { loadStylesheet } from '@/pages/_app';
export interface DoctorSearchResultsPropsType {
  doctorResults: DoctorProfileType[];
  totalDoctors: number;
  limit: number;
  skip: number;
  setLimit: Function;
  setSkip: Function;
  parentHeight: number;
  parentWidth: number;
  setSortBy: Function;
  sortBy: string;
  isLoading: boolean;
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const initialGridRowHeight = 550
export const initialListRowHeight = 350 + 10

const DoctorSearchResults: FC<DoctorSearchResultsPropsType> = (({ sortBy, setSortBy, parentWidth, parentHeight, doctorResults, totalDoctors, limit, skip, setLimit, setSkip, isLoading, }) => {
  dayjs.extend(preciseDiff)
  const { muiVar, bounce } = useScssVar()
  const maxWidth991 = useMediaQuery('(max-width:991px)');
  const maxWidth767 = useMediaQuery('(max-width:767px)');
  const minWidth767 = useMediaQuery('(min-width:767px)');
  const maxWidth650 = useMediaQuery('(max-width:650px)');
  const maxWidth638 = useMediaQuery('(max-width:638px)');
  const minWidth1400 = useMediaQuery('(min-width:1400px)');
  const minWidth991max1200 = useMediaQuery('@media (min-width:991px) and (max-width: 1200px)');
  const minWidth767max991 = useMediaQuery('@media (min-width:767px) and (max-width: 991px)');
  const minWidth639max766 = useMediaQuery('@media (min-width:639px) and (max-width: 766px)');
  const minWidth470max638 = useMediaQuery('@media (min-width: 470px) and (max-width:638px)');
  const userProfile = useSelector((state: AppState) => state.userProfile.value)

  const theme = useTheme();
  var nextTenDays = new Date();
  nextTenDays.setDate(nextTenDays.getDate() + 10)
  const [openImage, setOpenImage] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [Images, setImages] = useState<ClinicImagesType[]>([]);
  const searchParams = useSearchParams();
  const [dispalyType, setDispalyType] = useState<'list' | 'grid'>('list')
  const [gridRowHeight, setGridRowHeight] = useState<number>(initialGridRowHeight)
  const [listRowHeight, setListRowHeight] = useState<number>(minWidth767 ? initialListRowHeight + 10 : initialListRowHeight)
  const [columnCount, setColumnCount] = useState<1 | 2 | 3>(3)
  const [virtualGridMinHeight, setVirtualGridMinHeight] = useState<number>(0)
  const [virtualGridHight, setVirtualGridHight] = useState<number>(parentHeight)
  const [openAvailabilityTooltip, setOpenAvailabilityTooltip] = useState<{ [key: string]: boolean }>({ 0: false });
  const [favIconLoading, setFavIconLoading] = useState<{ [key: string]: boolean }>({ 0: false });
  const [virtualListMinHeight, setVirtualListMinHeight] = useState<number>(0)
  const [virtualListHight, setVirtualListHight] = useState<number>(parentHeight)
  const [loginDialog, setLoginDialog] = useState<boolean>(false)
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  // remove blinking image 
  const [imageTimestamp, setImageTimestamp] = useState(new Date().getTime());

  useEffect(() => {
    loadStylesheet('/css/react-virtualized-styles.min.css')
  }, [])

  // Update the timestamp only when the profile image URL changes
  useEffect(() => {
    setImageTimestamp(new Date().getTime());
  }, [userProfile]);
  const handleChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as string);
    window.localStorage.setItem('sortBy', event.target.value as string)
  };
  const [elRefs, setElRefs] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({
    0: false,
  });

  const specialities = searchParams.get('specialities')
  const available = searchParams.get('available')
  const keyWord = searchParams.get('keyWord')
  const gender = searchParams.get('gender')
  const country = searchParams.get('country')
  const state = searchParams.get('state')
  const city = searchParams.get('city')

  //Function to check is row loaded and not undefined
  const _isRowLoaded = ({ index }: any) => {
    return !!doctorResults[index];
  }

  let throt_fun = throttle((trotLimit: number, totalDoctors: number) => {
    setLimit((prevState: number) => {
      return prevState < totalDoctors ? trotLimit : totalDoctors
    })
  }, 1000);



  useEffect(() => {
    let rowCount = totalDoctors % columnCount == 0 ? totalDoctors / columnCount : Math.ceil(totalDoctors / columnCount)
    setVirtualGridHight(() => rowCount * gridRowHeight)
    setVirtualGridMinHeight(0)
  }, [columnCount, gridRowHeight, totalDoctors])



  const _share_buttons = (shareUrl: string, title: string, component: 'grid' | 'list') => {
    const marrgin = component == 'grid' ?
      {} :
      { ["--bottom" as string]: `10px` as CSSProperties }
    return (
      <div className="share" style={marrgin}>
        <a className="bg_links social fbMessenger" href="" onClick={(e) => e.preventDefault()}>
          <FacebookMessengerShareButton
            url={shareUrl}
            appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID as string}
            title={title}
            aria-label='facebook messenger'
          >
            <FacebookMessengerIcon size={38} round className='icon' />
          </FacebookMessengerShareButton>
        </a>
        <a className="bg_links social fb" href="" onClick={(e) => e.preventDefault()} >

          <FacebookShareButton
            url={shareUrl}
            title={title}
            aria-label='facebook'
          >
            <FacebookIcon size={38} round className='icon' />
          </FacebookShareButton>
          <div>
            <FacebookShareCount
              url={shareUrl}
              title={title}
            >
              {(count) => count}
            </FacebookShareCount>
          </div>
        </a>
        <a className="bg_links social line" href="" onClick={(e) => e.preventDefault()} >
          <LineShareButton
            url={shareUrl}
            title={title}
            aria-label='line share'
          >
            <LineIcon size={38} round className='icon' />
          </LineShareButton>
        </a>
        <a className="bg_links social linkedin" href="" onClick={(e) => e.preventDefault()}>
          <LinkedinShareButton
            url={shareUrl}
            aria-label='linkedin share'
          >
            <LinkedinIcon size={38} round className='icon' />
          </LinkedinShareButton>
        </a>
        <a className="bg_links social whatsApp" href="" onClick={(e) => e.preventDefault()} >
          <WhatsappShareButton
            url={shareUrl}
            title={title}
            aria-label='whatsapp share'
          >
            <WhatsappIcon size={38} round className='icon' />
          </WhatsappShareButton>
        </a>
        <a className="bg_links social twitter" href="" onClick={(e) => e.preventDefault()}>
          <TwitterShareButton
            url={shareUrl}
            title={title}
            aria-label='x share'
          >
            <XIcon size={38} round className='icon' />
          </TwitterShareButton>
        </a>
        <a className="bg_links social telegram" href="" onClick={(e) => e.preventDefault()}>
          <TelegramShareButton
            url={shareUrl}
            title={title}
            aria-label='telegram share'
          >
            <TelegramIcon size={38} round className='icon' />
          </TelegramShareButton>
        </a>
        <IconButton
          aria-label="share"
          disableFocusRipple
          disableRipple
          disableTouchRipple
          className='shareIconButton'
          edge="start"
          sx={{
            paddingBottom: component == 'grid' ? `2px` : '5px',
            "&:hover": {
              transform: "scale(1.15)",
              transition: theme.transitions.create('all', { duration: 200, }),
              color: theme.palette.primary.main,
            },
          }}>
          <ShareIcon />
        </IconButton>
      </div>
    )
  }


  const _fav_button = (doctor: DoctorProfileType, index: number) => {
    let isFav = !!userProfile ? doctor?.favs_id?.includes(userProfile?._id as string) : false

    return (
      <Tooltip arrow title={!userProfile ? 'Login in to add to favorit.' : `${isFav ? 'Remove' : 'Add'} doctor to favorite.`}>
        <IconButton
          disableFocusRipple
          disableRipple
          aria-label="add to favorites"
          onClick={() => {
            if (!userProfile) {
              setLoginDialog(true)
            } else {
              setFavIconLoading((prevState: { [key: string]: boolean }) => {
                return {
                  ...prevState,
                  [index]: true
                }
              });
              if (!isFav) {
                if (homeSocket?.current && typeof favIconLoading[index] == 'undefined' ||
                  !favIconLoading[index]) {
                  homeSocket.current.emit('addDocToFav', { doctorId: doctor?._id, patientId: userProfile?._id })
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
                      doctor?.favs_id.push(userProfile._id)
                      setFavIconLoading((prevState: { [key: string]: boolean }) => {
                        return {
                          ...prevState,
                          [index]: false
                        }
                      });
                    }
                  })
                }
              } else {
                if (homeSocket?.current && typeof favIconLoading[index] == 'undefined' ||
                  !favIconLoading[index]) {
                  homeSocket.current.emit('removeDocFromFav', { doctorId: doctor?._id, patientId: userProfile?._id })
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
                      setFavIconLoading((prevState: { [key: string]: boolean }) => {
                        return {
                          ...prevState,
                          [index]: false
                        }
                      });
                      const codeIndex = doctor?.favs_id.indexOf(userProfile._id);
                      if (codeIndex > -1) {
                        doctor?.favs_id.splice(codeIndex, 1);
                      }
                    }
                  })
                }
              }
            }
          }}
        >
          {typeof favIconLoading[index] == 'undefined' ||
            !favIconLoading[index] ?
            <FavoriteIcon sx={{
              animation: isFav ? `heartbeat 1s infinite` : 'unset',
              color: isFav ? 'deeppink' : 'unset',
              "&:hover": {
                animation: `heartbeat 1s infinite`,
                color: 'deeppink'
              },
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

  const _rowRenderer = ({
    key,
    index,
    style
  }: any) => {
    const doctor = doctorResults[index];
    //@ts-ignore
    let { years, } = dayjs.preciseDiff(doctor?.dob, dayjs(), true)
    let shareUrl = `${process.env.NEXT_PUBLIC_webUrl}/doctors/profile/${btoa(doctor?._id)}`
    const title = `Dr. ${doctor?.firstName} ${doctor?.lastName}`;
    return (
      <div key={key} style={{ ...style }} role="row">
        {
          !doctor ? index < totalDoctors &&
            <Grid item lg={12} xs={12} sm={6} md={4} sx={{ mr: 2, }} role="columnheader">
              <DoctorGridSearchSkleton />
            </Grid> : <>
            <Grid item lg={12} xs={12} sm={6} md={4} sx={{ mr: 2 }} role="columnheader">
              <Card
                ref={elRefs[index]}
                id={`${index}_card`}
                aria-label='card'
                // sx={setListStyle(index, expanded)}
                sx={{
                  transition: theme.transitions.create('all', { duration: 200, }),
                  display: 'flex',
                  flexDirection: 'row',
                  opacity:
                    Object.keys(expanded).length === 0 &&
                      Object.keys(expanded)[0] == undefined
                      ? 1
                      : expanded[index as keyof typeof expanded] == true
                        ? 1
                        : Object.values(expanded)[0] == undefined ||
                          !Object.values(expanded)[0]
                          ? 1
                          : 0.2,
                  // minHeight: 1500,
                  // zIndex: expanded[index as keyof typeof expanded] ?
                  //   Object.values(expanded)[0] ? 2 : 1 : 1,
                  borderRadius: `10px 10px 10px 10px`,
                  borderColor: theme.palette.secondary.main,
                  borderWidth: `2px 2px 2px 2px`,
                  borderStyle: 'solid',
                  position: 'relative',
                  flexWrap: 'wrap',
                  "&:hover": {
                    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                  },
                }}
              >
                <Grid container >
                  <Grid item xl={3} lg={2.87} md={2.87} sm={2} xs={12} >
                    <CardMedia sx={{
                      '& .MuiBadge-root': {
                        display: 'grid',
                      },
                      '& .MuiBadge-badge': {
                        top: '5%',
                        left: '5%'
                      }
                    }}>
                      <Link href={`/doctors/profile/${btoa(doctor?._id)}`} aria-label='doctor single'>
                        <ProfileImageStyledBadge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                          variant="dot"
                          online={doctor.online as boolean}
                        >
                          <Avatar sx={{
                            width: 'auto',
                            height: 'auto',
                            borderRadius: `5px 0px 15px 0px`,
                            transition: 'all 2000ms cubic-bezier(0.19, 1, 0.22, 1) 0ms',
                            "&:hover": {
                              boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                              transform: "scale(1.15)",
                            },

                          }}
                            variant="square"
                            alt=""
                            src={`${doctor?.profileImage}?random=${imageTimestamp}`}
                            key={doctor?.profileImage}
                          >
                            <img className="img-fluid" src={doctors_profile} alt="" />
                          </Avatar>
                        </ProfileImageStyledBadge>
                      </Link>
                      <ul className="clinic-gallery" >
                        {doctor && doctor.clinicImages &&
                          doctor.clinicImages.map((img: any, j: number) => {
                            return (
                              <li key={j}>
                                <Link aria-label='clinic-gallery' href="" onClick={(e) => {
                                  e.preventDefault();
                                  setOpenImage(true);
                                  setImageIndex(j)
                                  setImages((prevState) => {
                                    prevState = []
                                    prevState = [...doctor.clinicImages]
                                    return prevState;
                                  })
                                }} >
                                  <img src={img.src} alt='' />
                                </Link>
                              </li>
                            )
                          })
                        }
                      </ul>
                    </CardMedia>
                  </Grid>
                  <Grid item xl={3} lg={2.5} md={2.5} sm={3} xs={12} >
                    <CardContent sx={{
                      flex: '1 0 auto',
                      maxHeight: 190,
                      transition: theme.transitions.create('all', { duration: 200, }),
                    }}>
                      <Typography component="div" variant="h5" sx={{ wordBreak: 'break-all', fontSize: '1.2rem' }}>
                        <Link href={`/doctors/profile/${btoa(doctor?._id)}`}>
                          Dr. {doctor?.firstName} {" "} {doctor?.lastName}
                        </Link>
                        &nbsp;
                        <CheckCircleIcon color='secondary' />
                      </Typography>
                      <Typography variant="subtitle1" color="secondary.light" component="div">
                        Gender: {`${doctor?.gender == 'Mr' ? `👨` : `👩`} ${doctor?.gender}`}
                      </Typography>
                      <Typography variant="subtitle1" color="secondary.light" component="div">
                        Age: {`${isNaN(years) ? '--' : years} years `}
                      </Typography>
                      <Typography component='div' variant="body2" color="text.secondary">
                        <Typography component='h1' className="doc-department">
                          <img src={doctor?.specialities?.[0]?.image} className="img-fluid" alt="" />
                          {doctor?.specialities?.[0]?.specialities}
                        </Typography>
                      </Typography>
                      <Rating name="read-only" value={4} readOnly size='small' />
                      <div className="doctor-widget-one">

                        <p className="doc-location" >
                          <i className="fas fa-map-marker-alt"> </i>
                          {doctor?.city}  <br />{doctor?.country}
                        </p>

                      </div>
                    </CardContent>
                  </Grid>
                  <Grid item xl={3} lg={3} md={2.5} sm={3} xs={12}>
                    <CardContent id={`${index}_context`}>
                      <h2 style={{ fontSize: "14px" }}>About: </h2>
                      <Typography component='div' variant="body2" color="text.secondary" id={`${index}_typoGrapy`}>

                        <ReadMoreText
                          key={doctor?.aboutMe}
                          lines={6}
                          type='plainText'
                          aria-expanded="false"
                          text={doctor?.aboutMe}
                          onAction={() => {
                            let container = document.querySelectorAll('.rm-container')
                            let isServicesOpen = document.getElementById(`${index}`)?.getAttribute('aria-expanded') == 'true'
                            container.forEach((element, i) => {
                              let paragraph = element.getElementsByTagName('p');
                              if (paragraph) {
                                if (paragraph[0].textContent === doctor?.aboutMe) {
                                  //Same paragraph
                                  paragraph[0].classList.toggle('rm-text-container')
                                  let sameButton = element.getElementsByTagName('button')[0]
                                  if (sameButton.innerHTML === "More") {
                                    sameButton.innerHTML = "Less";
                                  } else {
                                    sameButton.innerHTML = "More";
                                  }
                                  if (!isServicesOpen) {
                                    Array.from(Array(totalDoctors).keys()).map((i) => {
                                      let card = document.getElementById(`${i}_card`)
                                      let a = document.getElementById(`${i}`)
                                      if (a) {
                                        if (a?.getAttribute('aria-expanded') == 'true') {
                                          let actionArea = document.getElementById(`collapseservices_${a.id}`)
                                          let card = document.getElementById(`${a.id}_card`)

                                          if (actionArea) {
                                            actionArea.classList.remove('show')
                                            actionArea.setAttribute('aria-expanded', 'false')
                                            if (parseInt(a.id) !== index) {
                                              a.setAttribute('aria-expanded', 'false')
                                              card!.style.zIndex = '1'
                                            }
                                          }
                                        }
                                      }
                                      if (i == index) {
                                        if (card) {
                                          card!.style.zIndex = '2'
                                        }
                                      } else {
                                        if (card) {
                                          card!.style.zIndex = '1'
                                        }
                                      }
                                    })
                                  }
                                } else {
                                  //Other paragraphs
                                  let otherButton = element.getElementsByTagName('button')[0]
                                  if (otherButton) {
                                    otherButton.innerHTML = "More";
                                    if (paragraph[0].classList.contains('rm-overflow-hidden')) {
                                      paragraph[0].classList.add('rm-text-container')
                                    }
                                  }
                                }
                              }


                            })
                          }}
                        />
                      </Typography>
                    </CardContent>
                  </Grid>
                  <Grid item xl={3} lg={3.63} md={4.03} sm={4} xs={12}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', }} id={`${index}_context`}>
                      <ul >
                        <li style={{ marginBottom: 10 }}>
                          <FiClock style={{ color: theme.palette.text.color }} /> &nbsp; &nbsp;
                          {doctor?.timeslots.length > 0 ?
                            <ClickAwayListener onClickAway={() => handleTooltipClose(index)}>
                              <span>
                                <Tooltip
                                  PopperProps={{
                                    disablePortal: true,
                                  }}
                                  arrow
                                  followCursor
                                  onClose={() => handleTooltipClose(index)}
                                  open={openAvailabilityTooltip[index] ? openAvailabilityTooltip[index] : false}
                                  disableFocusListener
                                  disableHoverListener
                                  disableTouchListener
                                  title={
                                    <Fragment>
                                      {
                                        doctor.timeslots[0]?.availableSlots.map((time: AvailableType, j: number) => {
                                          return (
                                            <Fragment key={j}>
                                              <Typography component='span'
                                                sx={{ fontSize: { xl: `18px !important`, lg: `16px !important`, md: `14px !important`, sm: `16px !important`, xs: `16px !important` }, }}
                                              >
                                                From: {time.startDate}
                                              </Typography>
                                              {" "}
                                              <Typography component='span'
                                                sx={{ fontSize: { xl: `18px !important`, lg: `16px !important`, md: `14px !important`, sm: `16px !important`, xs: `16px !important` }, }}>
                                                to: {time.finishDate}
                                              </Typography><br />

                                            </Fragment>
                                          )
                                        })
                                      }
                                    </Fragment>
                                  }
                                >
                                  <button className="available-date available-today" onClick={() => {
                                    openAvailabilityTooltip[index] ? handleTooltipClose(index) : handleTooltipOpen(index)
                                  }}  >
                                    {/* Available Today */}
                                    Check Availability
                                  </button>
                                </Tooltip>
                              </span>
                            </ClickAwayListener> :
                            <Button variant='contained' disabled className="available-date">Not Available</Button>}
                        </li>
                        <li style={{ marginBottom: 10 }}>
                          <FiThumbsUp />&nbsp; 98%{" "}
                          <span className="votes">(252 Votes)</span>
                        </li>
                        <li>
                          <FiDollarSign />1500 &nbsp;
                          <FiInfo />
                        </li>
                      </ul>
                      <div className="clinic-booking book-appoint">
                        <Button
                          className={doctor?.timeslots.length > 0 ? "btn btn-primary-light" : 'btn-primary-light-disabled'}
                          href={`/doctors/profile/${btoa(doctor?._id)}`}
                          disabled={doctor?.timeslots.length == 0}
                        >
                          Book Appointment
                        </Button>
                        <Button
                          className={doctor?.timeslots.length > 0 ? "btn btn-primary-light" : 'btn-primary-light-disabled'}
                          href="/doctors/consult-booking"
                          disabled={doctor?.timeslots.length == 0}>
                          Online Consultation
                        </Button>
                      </div>
                    </CardContent>
                  </Grid>
                </Grid>
                <CardActionArea aria-label='card action area' id={`${index}_cardActionArea`}>
                  <div id={`collapseservices_${index}`} className="collapse hide ">
                    <Grid container rowGap={1} columnGap={1} sx={{ paddingRight: 1, paddingLeft: 1 }} className="clinic-services"
                      key={doctor?.specialitiesServices?.toString()}>
                      {doctor?.specialitiesServices &&
                        doctor?.specialitiesServices.map((s: string, i: number) => {
                          return (
                            <Grid key={s + i} item component="span" aria-label='key specilaities'>{s}</Grid>
                          )
                        })
                      }
                    </Grid>
                  </div>

                </CardActionArea>
                <CardActions id={`${index}_cardAction`} disableSpacing
                  // sx={setListCardActionStyle(index, expanded)}
                  sx={{ flex: 1 }}
                >

                  {_fav_button(doctor, index)}
                  {_share_buttons(shareUrl, title, 'list')}
                  <Link
                    aria-label='services'
                    style={{ marginLeft: 'auto' }}
                    data-bs-toggle="collapse"
                    className='collapsed serviceCollapse'
                    href={`/doctors/search#collapseservices_${index}`}
                    id={`${index}`}
                    aria-expanded="false"
                    onClick={(e: any) => {
                      // Toggle another services
                      let all = document.querySelectorAll("a[aria-expanded='true']")
                      let isOpening = e.target?.getAttribute('aria-expanded') == 'true' || e.target?.getAttribute('aria-expanded') == null
                      let container = document.querySelectorAll('.rm-container')
                      let onlyOneOpen = all.length <= 1
                      if (!onlyOneOpen) {
                        all.forEach(element => {
                          let actionArea = document.getElementById(`collapseservices_${element.id}`)
                          let card = document.getElementById(`${element.id}_card`)
                          if (actionArea) {
                            actionArea.classList.remove('show')
                            actionArea.setAttribute('aria-expanded', 'false')
                            if (parseInt(element.id) !== index) {
                              element.setAttribute('aria-expanded', 'false')
                            }
                          }
                          if (card) {
                            if (card?.id == `${index}_card`) {
                              card!.style.zIndex = '2'
                            }
                            else {
                              card!.style.zIndex = '1'
                            }
                          }
                        });
                      } else {

                        if (isOpening) {
                          let card = document.getElementById(`${e.target.id}_card`)
                          if (card) {
                            if (card?.id == `${index}_card`) {
                              card!.style.zIndex = '2'
                            }
                            else {
                              card!.style.zIndex = '1'
                            }
                          }
                        }
                      }
                      container.forEach((element, i) => {
                        let paragraph = element.getElementsByTagName('p');
                        if (paragraph) {
                          if (paragraph[0].textContent === doctor?.aboutMe) {
                            //Same paragraph
                            if (isOpening) {
                              Array.from(Array(totalDoctors).keys()).map((i) => {
                                let card = document.getElementById(`${i}_card`)
                                if (card?.id == `${index}_card`) {
                                  if (card) {
                                    card!.style.zIndex = '2'
                                  }
                                }
                                else {
                                  if (card) {
                                    card!.style.zIndex = '1'
                                  }
                                }
                              })

                            } else {
                              Array.from(Array(totalDoctors).keys()).map((i) => {
                                let card = document.getElementById(`${i}_card`)
                                if (card?.id == `${index}_card`) {
                                  if (card) {
                                    card!.style.zIndex = '1'
                                  }
                                } else {
                                  if (card) {
                                    card!.style.zIndex = '2'
                                  }
                                }
                              })
                            }

                          } else {
                            //Other paragraphs
                            let otherButton = element.getElementsByTagName('button')[0]
                            if (otherButton) {
                              otherButton.innerHTML = "More";
                              if (paragraph[0].classList.contains('rm-overflow-hidden')) {
                                paragraph[0].classList.add('rm-text-container')
                              }
                            }
                          }
                        }
                      })

                    }}>
                    <ExpandMoreIcon className='serviceChavron' sx={{
                      transition: theme.transitions.create('transform', {
                        duration: theme.transitions.duration.shortest,
                      }),
                    }} />Services
                  </Link>
                </CardActions>
              </Card>

            </Grid>
          </>}
      </div>
    );
  };


  const _createOnSectionRendered = (onRowsRendered: any, params: any) => {
    const { rowOverscanStartIndex, rowOverscanStopIndex, columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex } = params
    // const startIndex = (columnStartIndex + rowOverscanStartIndex) + (columnStartIndex + rowOverscanStartIndex)
    const startIndex = (rowOverscanStartIndex * columnCount) + columnStopIndex < totalDoctors ? rowOverscanStartIndex * columnCount : 0
    const stopIndex = (rowOverscanStopIndex * columnCount) + columnStopIndex < totalDoctors
      ? rowOverscanStopIndex * columnCount
      : totalDoctors

    //Fucntion to close expanded if open and not inside view to use click away
    if (Object.values(expanded)[0]) {
      let expandedOpenKey = parseInt(Object.keys(expanded)[0])
      let minIndexToshow = rowStartIndex * columnCount
      let maxIndexToshow = rowStopIndex * columnCount
      let shouldCloseExapnd = expandedOpenKey + columnCount >= minIndexToshow && expandedOpenKey <= maxIndexToshow

      if (!shouldCloseExapnd) {
        setExpanded(() => ({
          [expandedOpenKey]: false,
        }));
        setOpen(false)
      }
    }

    setLimit(() => rowOverscanStopIndex == 0 || stopIndex <= totalDoctors ? totalDoctors : stopIndex)

    onRowsRendered({ startIndex: startIndex, stopIndex: stopIndex > totalDoctors ? totalDoctors : stopIndex })
  }

  const gridRef = useRef<any>(null);
  const listRef = useRef<any>(null);


  const listLoadMoreRows = async ({ startIndex, stopIndex }: IndexRange) => {
    if (stopIndex > limit) {
      setLimit(stopIndex + 1)
    } else {
      throt_fun(limit, totalDoctors)
    }
    return Promise<any>
  }

  // define a function to check if a row is loaded
  const isRowLoaded = ({ index }: { index: number }) => {
    return !!doctorResults[index];
  };

  useEffect(() => {
    // add  refs
    setElRefs((elRefs) =>
      Array(totalDoctors)
        .fill("")
        .map((_, i) => elRefs[i] || createRef())
    );
  }, [totalDoctors, dispalyType]);

  useEffect(() => {
    Array.from(Array(totalDoctors).keys()).map((index) => {
      let currentHeight = elRefs[index]?.current?.offsetHeight
      if (index == 0 && currentHeight) {
        setListRowHeight(minWidth1400 ? currentHeight + 55 : currentHeight + 20)
        setVirtualListHight(() => (totalDoctors * listRowHeight) + (maxWidth650 ? listRowHeight + 50 : maxWidth767 ? listRowHeight + 30 : minWidth767 ? listRowHeight + 10 : 510))
        setVirtualListMinHeight(0)
      }
    })
  }, [elRefs, totalDoctors, parentWidth, listRowHeight, maxWidth650, maxWidth767, minWidth767, minWidth1400])

  const setCardStyle = (index: number, expanded: { [key: string]: boolean }) => {
    return {
      opacity:
        Object.keys(expanded).length === 0 &&
          Object.keys(expanded)[0] == undefined
          ? 1
          : expanded[index as keyof typeof expanded] == true
            ? 1
            : Object.values(expanded)[0] == undefined ||
              !Object.values(expanded)[0]
              ? 1
              : 0.2,
      minHeight: 280,
      boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px'
    };
  };

  // define a function to render a cell
  const cellRenderer = (params: any) => {
    let { columnIndex, key, rowIndex, style, parent } = params

    let index = rowIndex * columnCount + columnIndex
    const doctor = doctorResults[index];
    const doctorName = `Dr. ${doctor?.firstName} ${doctor?.lastName}`
    let shareUrl = `${process.env.NEXT_PUBLIC_webUrl}/doctors/profile/${btoa(doctor?._id)}`
    return (
      <div key={key} style={style} >
        {
          !doctor ? index < totalDoctors &&
            <Grid item lg={12} xs={12} sm={6} md={4} sx={{ mr: 2, }}>
              <DoctorGridSearchSkleton />
            </Grid> : <>
            <Grid item lg={12} xs={12} sm={6} md={4} sx={{ mr: 2, }}>
              <Card
                style={setCardStyle(index, expanded)}
                ref={elRefs[index]}
                sx={{
                  bgcolor: theme.palette.background.paper,
                  "&:hover": {
                    ".MuiCardMedia-root": {
                      transform: "scale(1.15)",
                      zIndex: 1
                    },
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius
                    }px ${expanded[index as keyof typeof expanded] ? '0' : theme.shape.borderRadius}px ${expanded[index as keyof typeof expanded] ? '0' : theme.shape.borderRadius
                    }px`,
                  boxShadow: `${theme.shadows[expanded[index as keyof typeof expanded] ? 12 : 1]}`,
                }}>
                <Fragment>
                  <Tooltip arrow title={doctorName.length > 18 ? doctorName : ""} followCursor TransitionComponent={Zoom}>
                    <span style={{ zIndex: 3 }}>
                      <CardHeader
                        sx={{
                          bgcolor: theme.palette.background.paper,
                        }}
                        avatar={
                          <Avatar alt="" src={doctor?.specialities?.[0]?.image} variant="square" sx={{
                            '.MuiAvatar-img': {
                              objectFit: 'fill'
                            }
                          }}
                            key={doctor?.specialities?.[0]?.image}
                          >
                            <img className="img-fluid" src={doctors_profile} alt="" />
                          </Avatar>
                        }
                        title={<h6 className="doc-name">
                          <Link href={`/doctors/profile/${btoa(doctor?._id)}`}>
                            {doctorName.slice(0, 18)}{doctorName.length > 18 ? '...' : ''}
                          </Link>
                        </h6>}
                        subheader={`Joined: ${dayjs(doctor?.createdAt).format('DD MMM YYYY')} ${index}`}
                      />
                    </span>
                  </Tooltip>
                </Fragment>
                <Link href={`/doctors/profile/${btoa(doctor?._id)}`} aria-label='doctor single'>
                  <ProfileImageStyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                    variant="dot"
                    online={doctor.online as boolean}
                  >
                    <Avatar sx={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '5px',
                      transition: 'all 2000ms cubic-bezier(0.19, 1, 0.22, 1) 0ms',
                      "&:hover": {
                        boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                        transform: "scale(1.15)",
                      },

                    }}
                      variant="square"
                      alt=""
                      src={`${doctor?.profileImage}?random=${imageTimestamp}`}
                      key={doctor?.profileImage}
                    >
                      <img className="img-fluid" src={doctors_profile} alt="" />
                    </Avatar>
                  </ProfileImageStyledBadge>
                </Link>
                <CardContent
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    zIndex: 5,
                    minHeight: 120,
                  }}>
                  <Typography component='div' variant="body2" color="text.secondary">
                    <ReadMoreText
                      key={doctor?.aboutMe}
                      lines={2}
                      type='html'
                      text={doctor?.aboutMe}
                    />
                  </Typography>
                </CardContent>
                <CardActions disableSpacing sx={{
                  bgcolor: theme.palette.background.paper,
                  zIndex: 5,

                }}>
                  {_fav_button(doctor, index)}
                  {_share_buttons(shareUrl, doctorName, 'grid')}
                  <ExpandMore
                    expand={expanded[index as keyof typeof expanded]}
                    onClick={() => {
                      setExpanded((prevState) => {
                        // let isOpening = !prevState[index]
                        // let virtualGridHeight = Math.ceil(totalDoctors / columnCount) * gridRowHeight
                        // let isLastRow = totalDoctors % columnCount == 0 ? ((totalDoctors / columnCount) - 1) == rowIndex : Math.floor(totalDoctors / columnCount) == rowIndex

                        // if (isLastRow && isOpening) {
                        //   setVirtualGridMinHeight(() => virtualGridHeight + 450)
                        // } else {
                        //   setVirtualGridMinHeight(() => 0)
                        // }
                        return { [index]: !expanded[index] }
                      });

                    }}
                    aria-expanded={expanded[index as keyof typeof expanded]}
                    aria-label='show more'>
                    <Tooltip title='Expand to see More' arrow TransitionComponent={Zoom}>
                      <ExpandMoreIcon />
                    </Tooltip>
                  </ExpandMore>
                </CardActions>
                <Collapse in={expanded[index]} timeout='auto' unmountOnExit>
                  <ClickAwayListener
                    onClickAway={() => {
                      setExpanded(() => ({
                        [index]: false,
                      }));
                      setVirtualGridMinHeight(0)
                    }}>
                    <CardContent
                      sx={{
                        position: 'absolute',
                        bgcolor: theme.palette.background.paper,
                        zIndex: 6,
                        borderRadius: `0px 0px 4px 4px`,
                        boxShadow: `${theme.shadows[2]}`,
                        minWidth: elRefs[index]?.current?.offsetWidth,
                        paddingLeft: 1,
                        maxWidth: elRefs[index]?.current?.offsetWidth,
                      }}>
                      <MuiList disablePadding dense >
                        <Divider sx={{
                          color: theme.palette.secondary.main,
                          minWidth: elRefs[index]?.current?.offsetWidth,
                          maxWidth: elRefs[index]?.current?.offsetWidth,
                          marginLeft: -1,
                        }} />
                        <ListItem sx={{
                          pl: 0,
                          pr: 0,
                        }}>
                          <ListItemIcon>
                            Speciality:
                          </ListItemIcon>
                          <ListItemAvatar sx={{

                          }}>
                            <Link className="avatar mx-2" href="" onClick={(e) => e.preventDefault()}>
                              <img src={doctor?.specialities?.[0]?.image} alt='' />
                            </Link>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <h5 className="doc-department">
                                {doctor?.specialities?.[0]?.specialities}
                              </h5>
                            }
                          />
                        </ListItem>
                        <Divider sx={{
                          color: theme.palette.secondary.main,
                          minWidth: elRefs[index]?.current?.offsetWidth,
                          maxWidth: elRefs[index]?.current?.offsetWidth,
                          marginLeft: -1,
                        }} />
                        <ListItem sx={{
                          pl: 0,
                          pr: 0,
                        }}>
                          <ListItemIcon>
                            Rate:
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Rating name="read-only" value={4} readOnly size='small' />
                            }
                          />
                        </ListItem>
                        <Divider sx={{
                          color: theme.palette.secondary.main,
                          minWidth: elRefs[index]?.current?.offsetWidth,
                          maxWidth: elRefs[index]?.current?.offsetWidth,
                          marginLeft: -1,
                        }} />
                        <ListItem sx={{
                          pl: 0,
                          pr: 0,
                        }}>
                          <ListItemIcon>
                            Location: &nbsp;
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <div className="doctor-widget-one">

                                <p className="doc-location" >
                                  <i className="fas fa-map-marker-alt"> </i>
                                  {doctor?.city}  <br />{doctor?.country}
                                </p>

                              </div>
                            }
                          />
                        </ListItem>
                        <Divider sx={{
                          color: theme.palette.secondary.main,
                          minWidth: elRefs[index]?.current?.offsetWidth,
                          maxWidth: elRefs[index]?.current?.offsetWidth,
                          marginLeft: -1,
                        }} />

                        {
                          doctor?.clinicImages?.length > 0 &&
                          <>
                            <ListItem sx={{
                              pl: 0,
                              pr: 0,
                            }}>
                              <ListItemIcon>
                                Clinick Images: &nbsp;
                              </ListItemIcon>
                              <ListItemText
                                sx={{
                                  display: 'flex'
                                }}
                                primary={
                                  doctor && doctor.clinicImages &&
                                  doctor.clinicImages.map((img: any, j: number) => {
                                    return (
                                      <span key={j} style={{
                                        display: 'inline-block',
                                        paddingRight: '5px',
                                      }}>
                                        <Link href="" onClick={(e) => {
                                          e.preventDefault();
                                          setOpenImage(true);
                                          setImageIndex(j)
                                          setImages((prevState) => {
                                            prevState = []
                                            prevState = [...doctor.clinicImages]
                                            return prevState;
                                          })
                                        }} >
                                          <img src={img.src} alt='' style={{ width: '40px', borderRadius: '5px' }} />
                                        </Link>
                                      </span>
                                    )
                                  })

                                }
                              />
                            </ListItem>
                            <Divider sx={{
                              color: theme.palette.secondary.main,
                              minWidth: elRefs[index]?.current?.offsetWidth,
                              maxWidth: elRefs[index]?.current?.offsetWidth,
                              marginLeft: -1,
                            }} />
                          </>
                        }

                        <ListItem sx={{
                          pl: 0,
                          pr: 0,
                        }}>
                          <ListItemText
                            sx={{
                              display: 'flex',
                              justifyContent: 'flex-start'
                            }}
                            primary={
                              <div className="doctor-widget-one">
                                <div className="doc-info-right">
                                  <div className="clini-infos" style={{ marginBottom: 0 }}>
                                    <ul>
                                      <li >
                                        {doctor?.timeslots.length > 0 ?
                                          <ClickAwayListener onClickAway={() => handleTooltipClose(index)}>
                                            <span style={{ minWidth: "100%" }}>
                                              <Tooltip
                                                PopperProps={{
                                                  disablePortal: true,
                                                }}
                                                arrow
                                                followCursor
                                                onClose={() => handleTooltipClose(index)}
                                                open={openAvailabilityTooltip[index] ? openAvailabilityTooltip[index] : false}
                                                disableFocusListener
                                                disableHoverListener
                                                disableTouchListener
                                                title={
                                                  <Fragment>
                                                    {
                                                      doctor.timeslots[0]?.availableSlots.map((time: AvailableType, j: number) => {
                                                        return (
                                                          <Fragment key={j}>
                                                            <Typography component='span'
                                                              sx={{ fontSize: { xl: `18px !important`, lg: `16px !important`, md: `14px !important`, sm: `16px !important`, xs: `16px !important` }, }}
                                                            >
                                                              From: {time.startDate}
                                                            </Typography>
                                                            {" "}
                                                            <Typography component='span'
                                                              sx={{ fontSize: { xl: `18px !important`, lg: `16px !important`, md: `14px !important`, sm: `16px !important`, xs: `16px !important` }, }}>
                                                              to: {time.finishDate}
                                                            </Typography><br />

                                                          </Fragment>
                                                        )
                                                      })
                                                    }
                                                  </Fragment>
                                                }
                                              >
                                                <button className="available-date available-today" style={{ width: '100%', textAlign: 'center' }} onClick={() => {
                                                  openAvailabilityTooltip[index] ? handleTooltipClose(index) : handleTooltipOpen(index)
                                                }}  >
                                                  {/* Available Today */}
                                                  Check Availability
                                                </button>
                                              </Tooltip>
                                            </span>
                                          </ClickAwayListener> :
                                          <Button variant='contained' disabled className="available-date">Not Available</Button>}

                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            }
                          />
                        </ListItem>
                        <Divider sx={{
                          color: theme.palette.secondary.main,
                          minWidth: elRefs[index]?.current?.offsetWidth,
                          maxWidth: elRefs[index]?.current?.offsetWidth,
                          marginLeft: -1,
                        }} />

                        <ListItem sx={{
                          pl: 0,
                          pr: 0,
                        }}>
                          <ListItemText
                            sx={{
                              display: 'flex',
                              justifyContent: 'flex-start'
                            }}
                            primary={
                              <div className="doctor-widget-one">
                                <div className="doc-info-right">
                                  <div className="clini-infos" style={{ marginBottom: 0 }}>
                                    <ul style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 0 }}>
                                      <li>
                                        <FiThumbsUp />&nbsp; 98%{" "}
                                        <span className="votes">(252 Votes)</span>
                                      </li>
                                      <li>
                                        <FiDollarSign />1500 &nbsp;
                                        <FiInfo />
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            }
                          />
                        </ListItem>
                        <Divider sx={{
                          color: theme.palette.secondary.main,
                          minWidth: elRefs[index]?.current?.offsetWidth,
                          maxWidth: elRefs[index]?.current?.offsetWidth,
                          marginLeft: -1,
                        }} />

                        <ListItem sx={{
                          pl: 0,
                          pr: 0,
                        }}>
                          <ListItemText
                            sx={{
                              display: 'flex',
                              justifyContent: 'flex-start'
                            }}
                            primary={
                              <div className="doctor-widget-one">
                                <div className="doc-info-right">
                                  <div className="clinic-booking book-appoint">
                                    <Button
                                      className={doctor?.timeslots.length > 0 ? "btn btn-primary-light" : 'btn-primary-light-disabled'}
                                      href={`/doctors/profile/${btoa(doctor?._id)}`}
                                      disabled={doctor?.timeslots.length == 0}
                                    >
                                      Book Appointment
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            }
                          />
                        </ListItem>
                        <Divider sx={{
                          color: theme.palette.secondary.main,
                          minWidth: elRefs[index]?.current?.offsetWidth,
                          maxWidth: elRefs[index]?.current?.offsetWidth,
                          marginLeft: -1,
                        }} />

                        <ListItem sx={{
                          pl: 0,
                          pr: 0,
                        }}>
                          <ListItemText
                            sx={{
                              display: 'flex',
                              justifyContent: 'flex-start'
                            }}
                            primary={
                              <div className="doctor-widget-one">
                                <div className="doc-info-right">
                                  <div className="clinic-booking book-appoint">
                                    <Button
                                      className={doctor?.timeslots.length > 0 ? "btn btn-primary-light" : 'btn-primary-light-disabled'}
                                      href="/doctors/consult-booking"
                                      disabled={doctor?.timeslots.length == 0}>
                                      Online Consultation
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            }
                          />
                        </ListItem>
                        <Divider sx={{
                          color: theme.palette.secondary.main,
                          minWidth: elRefs[index]?.current?.offsetWidth,
                          maxWidth: elRefs[index]?.current?.offsetWidth,
                          marginLeft: -1,
                        }} />
                        <ListItem sx={{
                          pl: 0,
                          pr: 0,
                        }}>
                          <ListItemText
                            sx={{
                              display: 'flex',
                              justifyContent: 'flex-start'
                            }}
                            primary={
                              <ClickAwayListener onClickAway={() => { setOpen(false) }}>
                                <Tooltip
                                  TransitionComponent={Zoom}
                                  title={
                                    <Grid container rowGap={1} columnGap={1} sx={{ paddingRight: 1, paddingLeft: 1 }} className="clinic-services"
                                      key={doctor?.specialitiesServices?.toString()}>
                                      {doctor?.specialitiesServices &&
                                        doctor?.specialitiesServices.map((s: string, i: number) => {
                                          return (
                                            <Grid key={s + i} item component="span" >{s}</Grid>
                                          )
                                        })
                                      }
                                    </Grid>
                                  }
                                  arrow
                                  placement='top'
                                  PopperProps={{
                                    disablePortal: true,
                                  }}
                                  onClose={() => { setOpen(false) }}
                                  open={open}
                                  disableFocusListener
                                  disableHoverListener
                                  disableTouchListener>
                                  <div className="doctor-widget-one">
                                    <div className="doc-info-right">
                                      <div className="clinic-booking book-appoint">
                                        <Link className="btn btn-primary-light" href="" onClick={(e) => {
                                          e.preventDefault();
                                          setOpen(!open);
                                        }}>
                                          Services
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </Tooltip>
                              </ClickAwayListener>
                            }
                          />
                        </ListItem>
                      </MuiList>
                    </CardContent>
                  </ClickAwayListener>
                </Collapse>
              </Card>
            </Grid>
          </>}
      </div>
    );
  };
  const [open, setOpen] = useState(false);
  const overscanIndicesGetter = ({
    cellCount,
    overscanCellsCount,
    startIndex,
    stopIndex,
  }: any) => {
    return {
      overscanStartIndex: Math.max(0, startIndex - overscanCellsCount),
      overscanStopIndex: Math.min(cellCount - 1, stopIndex + overscanCellsCount),
    };
  }

  useEffect(() => { minWidth1400 ? setGridRowHeight(600) : setGridRowHeight(initialGridRowHeight) }, [minWidth1400])
  useEffect(() => {
    if (minWidth991max1200) {
      setColumnCount(2)
      setGridRowHeight(690)
    } else {
      setColumnCount(3)
      setGridRowHeight(minWidth1400 ? 600 : initialGridRowHeight)
    }
  }, [minWidth1400, minWidth991max1200])
  useEffect(() => {
    if (minWidth767max991) {
      setColumnCount(2)
      setGridRowHeight(790)
    }
  }, [minWidth767max991])
  useEffect(() => {
    if (minWidth639max766) {
      setColumnCount(2)
      setGridRowHeight(650)
    }
  }, [minWidth639max766])
  useEffect(() => {
    if (maxWidth638) {
      setColumnCount(1)
      setGridRowHeight(890)
    }
  }, [maxWidth638])
  useEffect(() => {
    if (minWidth470max638) {
      setColumnCount(1)
      setGridRowHeight(720)
    }
  }, [minWidth470max638])

  useEffect(() => {
    setVirtualListHight(() => (totalDoctors * listRowHeight) + (maxWidth650 ? listRowHeight + 50 : maxWidth767 ? listRowHeight + 30 : minWidth767 ? listRowHeight + 10 : 510))
    setVirtualListMinHeight(0)
  }, [listRowHeight, maxWidth650, maxWidth767, minWidth767, totalDoctors,])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.localStorage.getItem('displayType')) {
        setDispalyType(window.localStorage.getItem('displayType') as "grid" | 'list')
      }
      if (window.localStorage.getItem('sortBy')) {
        setSortBy(window.localStorage.getItem('sortBy'))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const handleTooltipClose = (index: number) => {
    setOpenAvailabilityTooltip((prevState: { [key: string]: boolean }) => {
      return {
        ...prevState,
        [index]: false
      }
    });
  };

  const handleTooltipOpen = (index: number) => {
    setOpenAvailabilityTooltip((prevState: { [key: string]: boolean }) => {
      return {
        ...prevState,
        [index]: true
      }
    });
  };

  return (
    <Fragment>
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
        <DialogTitle id="login" >
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
            sx={{ float: 'right', "&:hover": { color: 'primary.main' } }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <div style={muiVar}>
            <div className="col-md-12">
              <div className="account-content">
                <div className="col-md-12 col-lg-12 login-right">
                  <LoginBox />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>

        </DialogActions>
      </Dialog>
      <Lightbox
        open={openImage}
        close={() => setOpenImage(false)}
        slides={Images}
        index={imageIndex}
      />
      {isLoading ?
        <DoctorTopSearchSkeleton /> :
        <Grid container justifyContent="space-between" sx={{ mb: 2 }}>

          <Grid item sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>

            <div className="doctors-found">
              <p>
                <span>{!isLoading && totalDoctors} Doctors found for:</span>{' '}
                {available} {specialities} {country} {state} {city} {gender} {keyWord}
              </p>
            </div>
            <div className="doctor-filter-availability">
              <p>Grid View</p>
              <div className="status-toggle status-tog ">
                <input type="checkbox" id="status_6" className="check" checked={dispalyType == 'list'} onChange={() => {
                  setDispalyType((prevState: 'list' | 'grid') => {
                    window.localStorage.setItem('displayType', prevState == 'list' ? 'grid' : 'list')
                    return prevState == 'list' ? 'grid' : 'list'
                  })

                }} />
                <label htmlFor="status_6" className="checktoggle" style={{
                  ["--beforeUrl" as string]: `url('/assets/images/icons/${dispalyType == 'grid' ? 'x-icon' : 'check'}.svg')` as CSSProperties,
                  ["--afterUrl" as string]: `url('/assets/images/icons/${dispalyType == 'grid' ? 'check' : 'x-icon'}.svg')` as CSSProperties,
                }}>
                  checkbox
                </label>
              </div>
              <p>&nbsp;&nbsp;List View</p>
            </div>

          </Grid>
          <Grid item sx={{ display: 'flex', flexDirection: 'column', gap: { xl: 1, lg: 1, md: 1, sm: 2, xs: 2 }, mt: { xl: 0, lg: 0, md: 0, sm: 3, xs: 3 } }}>
            <FormControl fullWidth>
              <InputLabel size='small' id="sort-label" htmlFor="sort">Sort</InputLabel>
              <Select
                labelId="sort-label"
                inputProps={{
                  id: "sort",
                  name: 'sort'
                }}
                value={sortBy}
                label="Sort"
                onChange={handleChange}
                fullWidth
                size='small'
              >
                <MenuItem value="profile.userName">User Name</MenuItem>
                <MenuItem value="createdAt">Join Date</MenuItem>
              </Select>
            </FormControl>
            <div className="doctor-filter-sort">
              <p className="filter-today d-flex align-items-center">
                <FiCalendar /> Today:  {dayjs().format(`D MMM`)} to:  {dayjs(nextTenDays.toString()).format(`D MMM`)}
              </p>
            </div>
          </Grid>
        </Grid>}

      <AutoSizer onResize={(autoSizerParams) => {
      }}
        defaultWidth={parentWidth}
        defaultHeight={parentHeight}
        disableHeight={true}
        disableWidth={true}
      >
        {() => {
          return (
            <>
              {
                isLoading ?
                  dispalyType == 'list' ?
                    <DoctorListSearchSkleton /> :
                    <Grid container direction="row"
                      justifyContent="center"
                      alignItems="center" spacing={2}>

                      {Array.from(Array(columnCount).keys()).map((i) => (
                        <Grid item lg={12 / columnCount} xs={12} sm={6} md={4} key={i}>
                          <DoctorGridSearchSkleton />
                        </Grid>))}
                    </Grid> :
                  doctorResults?.length == 0 && !isLoading ?
                    <CustomNoRowsOverlay text='no result for this search' /> :

                    <WindowScroller>
                      {(windowParams) => {
                        return (
                          <InfiniteLoader
                            isRowLoaded={dispalyType == 'list' ? _isRowLoaded : isRowLoaded}
                            loadMoreRows={dispalyType == 'list' ? listLoadMoreRows : async () => { Promise<void> }}
                            rowCount={dispalyType == 'list' ? totalDoctors : totalDoctors % columnCount == 0 ? totalDoctors / columnCount : Math.ceil(totalDoctors / columnCount)}
                            minimumBatchSize={20}
                            threshold={10}>
                            {({ onRowsRendered, registerChild }) => {
                              return (
                                <>
                                  {dispalyType == 'list' ?
                                    <List
                                      ref={(list) => {
                                        listRef.current = list;
                                        registerChild(list);
                                      }}
                                      autoHeight
                                      onRowsRendered={onRowsRendered}
                                      height={listRowHeight}
                                      rowCount={totalDoctors}
                                      rowHeight={maxWidth650 ? listRowHeight + 50 : maxWidth767 ? listRowHeight + 30 : minWidth767 ? listRowHeight + 10 : 510}
                                      listRowHeight={listRowHeight}
                                      rowRenderer={_rowRenderer}
                                      scrollTop={windowParams.scrollTop}
                                      width={maxWidth991 ? windowParams.width - 10 : parentWidth}
                                      virtualListMinHeight={virtualListMinHeight}
                                      containerStyle={{
                                        minHeight: virtualListMinHeight,
                                        height: virtualListHight * 2,
                                        overflow: 'visible'
                                      }}
                                    /> :
                                    <VirtualGrid
                                      ref={(grid) => {
                                        gridRef.current = grid;
                                        registerChild(grid);
                                      }}
                                      cellRenderer={cellRenderer}
                                      columnCount={columnCount}
                                      columnWidth={parentWidth / columnCount}
                                      virtualGridMinHeight={virtualGridMinHeight}
                                      autoHeight
                                      height={gridRowHeight}
                                      containerStyle={{
                                        minHeight: virtualGridMinHeight,
                                        height: virtualGridHight,
                                        overflowY: 'visible'
                                      }}
                                      onRowsRendered={onRowsRendered}
                                      overscanRowCount={5}
                                      rowHeight={gridRowHeight}
                                      rowCount={Math.ceil(totalDoctors / columnCount)}
                                      autoContainerWidth
                                      width={parentWidth}
                                      scrollTop={windowParams.scrollTop}
                                      onSectionRendered={(params) => { _createOnSectionRendered(onRowsRendered, params) }}
                                      overscanIndicesGetter={overscanIndicesGetter}
                                    />
                                  }
                                </>
                              )
                            }}
                          </InfiniteLoader>
                        )
                      }}
                    </WindowScroller>

              }
            </>
          )
        }}
      </AutoSizer>

      <ScrollIntoView selector="#scrollableDiv" >
        <div className="filter-btn apply-btn">
          <div className="row">
            <div className="col-12">
              <Button fullWidth
                className="btn btn-outline-primary" id="backToTop"
                onClick={() => {
                  setLimit(15)
                  setSkip(0)
                }}>
                backToTop
              </Button>
            </div>
          </div>
        </div>
      </ScrollIntoView>
    </Fragment>
  )
})


export default DoctorSearchResults