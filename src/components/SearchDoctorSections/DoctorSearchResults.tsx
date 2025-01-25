

/* eslint-disable @next/next/no-img-element */
import { CSSProperties, FC, Fragment, RefObject, createRef, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { FiCalendar, FiThumbsUp } from 'react-icons/fi';
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
import Button from '@mui/material/Button'
import { DoctorListSearchSkeleton, DoctorGridSearchSkeleton } from '@/shared/DoctorSearchSkeleton'

import CustomNoRowsOverlay from '@/shared/CustomNoRowsOverlay';
import DoctorTopSearchSkeleton from '../shared/DoctorTopSearchSkeleton';
import { styled, Theme } from '@mui/material/styles';
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
import { AvailableType, formatNumberWithCommas } from '../DoctorDashboardSections/ScheduleTiming';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { LoginBox } from '@/components/AuthSections/LoginSection';
import useScssVar from '@/hooks/useScssVar'
import { Transition } from '@/components/shared/Dialog';
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';

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
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { toast } from 'react-toastify';
import { ProfileImageStyledBadge } from '../DoctorDashboardSections/MyPtients';
import { loadStylesheet } from '@/pages/_app';
import { getCookies, setCookie } from 'cookies-next';
import makeStyles from '@mui/styles/makeStyles';

export interface DoctorSearchResultsPropsType {
  doctorResults: DoctorProfileType[];
  totalDoctors: number;
  page: number;
  setPage: Function;
  perPage: number;
  setPerPage: Function;
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

const useStyles = makeStyles((theme: Theme) => {
  return {
    noResult: {
      height: '50vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    topFilterLeftGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      [theme.breakpoints.down("sm")]: {
        width: "100%"
      }
    },
    topFilterRightGrid: {
      display: "flex",
      flexDirection: "column",
      gap: 10, // Default gap
      marginTop: 0, // Default margin top
      [theme.breakpoints.down("sm")]: {
        gap: 16,
        marginTop: 3,
        width: "100%"
      },
      [theme.breakpoints.down("xs")]: {
        gap: 2,
        marginTop: 3,
      },
    },
    topPagination: {
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    bottomPagination: {
      marginLeft: 'auto',
      marginRight: 'auto',
      display: 'flex',
      justifyContent: 'center'
    },
    ListCard: {
      '& .MuiBadge-root': {
        display: 'grid',
      },
      '& .MuiBadge-badge': {
        top: '5%',
        left: '5%'
      }
    },
    ListAvatar: {
      width: 'auto',
      height: 'auto',
      borderRadius: `5px 0px 15px 0px`,
      transition: 'all 2000ms cubic-bezier(0.19, 1, 0.22, 1) 0ms',
      "&:hover": {
        boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
        transform: "scale(1.15)",
      },

    },
    ListContent: {
      flex: '1 0 auto',
      maxHeight: 190,
      transition: theme.transitions.create('all', { duration: 200, }),
    },
    ListDoctorName: {
      wordBreak: 'break-all',
      fontSize: '1rem'
    },
    listAbout: { fontSize: "14px" },
    responsiveFontSize: {
      fontSize: "16px !important", // Default for `sm` and `xs`
      [theme.breakpoints.up("md")]: {
        fontSize: "14px !important",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "16px !important",
      },
      [theme.breakpoints.up("xl")]: {
        fontSize: "18px !important",
      },
    },
    listServiceChevron: {
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    //Grid doctor
    gridCardHeader: {
      backgroundColor: theme.palette.background.paper,
    },
    gridSpecialityAvatar: {
      '& .MuiAvatar-img': {
        objectFit: 'fill'
      }
    },
    gridMainAvatar: {
      width: '100%',
      height: 'auto',
      borderRadius: '5px',
      transition: 'all 2000ms cubic-bezier(0.19, 1, 0.22, 1) 0ms',
      "&:hover": {
        boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
        transform: "scale(1.15)",
      },
    },
    gridCardContain: {
      backgroundColor: theme.palette.background.paper,
      zIndex: 5,
      minHeight: 120,

    },
    gridCardAction: {
      backgroundColor: theme.palette.background.paper,
      zIndex: 5,
      position: "relative"
    },
    gridExpandContent: {
      position: 'absolute',
      backgroundColor: theme.palette.background.paper,
      zIndex: 6,
      borderRadius: `0px 0px 4px 4px`,
      boxShadow: `${theme.shadows[2]}`,
      paddingLeft: 1,
      "&:last-child": {
        paddingBottom: 0
      },
    },
    gridAvailaibityButton: { width: '100%', textAlign: 'center' },
    gridVoteUL: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    gridClinicImageWrapper: {
      display: 'inline-block',
      paddingRight: '5px',
    },
    gridClinicImage: { width: '40px', borderRadius: '5px' },

  }
});

const DoctorSearchResults: FC<DoctorSearchResultsPropsType> = ((
  {
    sortBy,
    setSortBy,
    page,
    setPage,
    perPage,
    setPerPage,
    doctorResults,
    totalDoctors,
    isLoading,
  }) => {
  const [displayType, setDisplayType] = useState<'list' | 'grid' | null>(null); // Default to null to defer rendering.
  const classes = useStyles();

  useEffect(() => {
    // Get display type from cookies once the component mounts (client-side).
    const cookieDisplayType = getCookies()?.['displayType'] as 'list' | 'grid';
    setDisplayType(cookieDisplayType || 'list');
    if (cookieDisplayType == 'grid') {
      setPerPage(12)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [elRefs, setElRefs] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({
    0: false,
  });
  useEffect(() => {
    // add  refs
    setElRefs((elRefs) =>
      Array(totalDoctors)
        .fill("")
        .map((_, i) => elRefs[i] || createRef())
    );
  }, [totalDoctors, displayType]);

  useEffect(() => {
    loadStylesheet('/css/react-virtualized-styles.min.css')
    loadStylesheet('/css/yet-another-react-lightbox-styles.css')
  }, [])


  // Render nothing until `displayType` is determined.
  if (displayType === null) {
    return null; // Or a placeholder/spinner if needed.
  }
  return (
    <Fragment>
      {
        isLoading ?
          <DoctorTopSearchSkeleton /> :
          <TopFilter
            isLoading={isLoading}
            totalDoctors={totalDoctors}
            displayType={displayType}
            setDisplayType={setDisplayType}
            sortBy={sortBy}
            setSortBy={setSortBy}
            setPerPage={setPerPage}
          />
      }
      {
        isLoading ?
          <>
            {
              displayType == "list" ?
                <DoctorListSearchSkeleton /> :
                <>
                  <Grid container direction="row"
                    justifyContent="center"
                    alignItems="center" spacing={2}>
                    {Array.from(Array(3).keys()).map((i) => (
                      <Grid item lg={4} xs={12} sm={6} md={4} key={i}>
                        <DoctorGridSearchSkeleton />
                      </Grid>
                    ))
                    }
                  </Grid>
                </>
            }
          </> :
          <>
            <TopPagination
              totalDoctors={totalDoctors}
              page={page}
              perPage={perPage}
              setPage={setPage}
              placement="top"
            />
            {
              displayType == "list" ?
                <>
                  {
                    totalDoctors !== 0 ?
                      doctorResults.map((doctor: DoctorProfileType, index: number) => {

                        return (
                          <Grid item lg={4} xs={12} sm={6} md={4} sx={{ m: 2 }} role="columnheader" key={index}>
                            <DoctorListComponent
                              elRefs={elRefs}
                              aria-label="card"
                              expanded={expanded}
                              index={index}
                              doctor={doctor} />
                          </Grid>
                        )
                      }) :
                      <div className={classes.noResult}>
                        <CustomNoRowsOverlay text="No Doctors for this search" />
                      </div>
                  }
                </> :
                <>
                  <Grid container direction="row"
                    justifyContent="center"
                    alignItems="center" spacing={2}>
                    {
                      totalDoctors !== 0 ?
                        doctorResults.map((doctor: DoctorProfileType, index: number) => {

                          return (
                            <Grid item lg={4} xs={12} sm={6} md={4} role="columnheader" key={index}>
                              <DoctorGridComponent
                                elRefs={elRefs}
                                aria-label="card"
                                expanded={expanded}
                                index={index}
                                doctor={doctor}
                                setExpanded={setExpanded} />
                            </Grid>
                          )
                        }) :
                        <div className={classes.noResult}>
                          <CustomNoRowsOverlay text="No Doctors for this search" />
                        </div>
                    }
                  </Grid>
                </>
            }
            <TopPagination
              totalDoctors={totalDoctors}
              page={page}
              perPage={perPage}
              setPage={setPage}
              placement="bottom"
            />
          </>
      }


    </Fragment>
  )
})


export default DoctorSearchResults

export interface TopFilterType {
  isLoading: boolean;
  totalDoctors: number;
  displayType: 'list' | 'grid';
  setDisplayType: Function;
  sortBy: string;
  setSortBy: Function;
  setPerPage: Function;
}
export const TopFilter: FC<TopFilterType> = (({
  isLoading,
  totalDoctors,
  displayType,
  setDisplayType,
  sortBy,
  setSortBy,
  setPerPage
}) => {
  const searchParams = useSearchParams();
  const specialities = searchParams.get('specialities')
  const available = searchParams.get('available')
  const keyWord = searchParams.get('keyWord')
  const gender = searchParams.get('gender')
  const country = searchParams.get('country')
  const state = searchParams.get('state')
  const city = searchParams.get('city')
  const classes = useStyles();
  const dispatch = useDispatch();
  var nextTenDays = new Date();
  nextTenDays.setDate(nextTenDays.getDate() + 10)
  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as string);
    window.localStorage.setItem('sortBy', event.target.value as string)
  };
  const viewChange = () => {
    dispatch(updateHomeFormSubmit(true))
    setPerPage(displayType == 'list' ? 12 : 10);
    setCookie('displayType', displayType == 'list' ? 'grid' : 'list')
    setDisplayType((prevState: 'list' | 'grid') => {
      return prevState == 'list' ? 'grid' : 'list'
    })
  }
  return (
    <Grid container justifyContent="space-between" sx={{ mb: 2 }}>

      <Grid item className={classes.topFilterLeftGrid}>

        <div className="doctors-found">
          <p>
            <span>{!isLoading && totalDoctors} Doctors found for:</span>{' '}
            {available} {specialities} {country} {state} {city} {gender} {keyWord}
          </p>
        </div>
        <div className="doctor-filter-availability">
          <p>Grid View</p>
          <div className="status-toggle status-tog ">
            <input type="checkbox" id="status_6" className="check" checked={displayType == 'list'}
              onChange={viewChange} />
            <label htmlFor="status_6" className="checktoggle"
              style={{
                ["--beforeUrl" as string]: `url('/assets/images/icons/${displayType == 'grid' ? 'x-icon' : 'check'}.svg')` as CSSProperties,
                ["--afterUrl" as string]: `url('/assets/images/icons/${displayType == 'grid' ? 'check' : 'x-icon'}.svg')` as CSSProperties,
              }}
            >
              checkbox
            </label>
          </div>
          <p>&nbsp;&nbsp;List View</p>
        </div>

      </Grid>
      <Grid item className={classes.topFilterRightGrid}>
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
            onChange={handleSortChange}
            fullWidth
            size='small'
          >
            <MenuItem value="profile.userName">User Name</MenuItem>
            <MenuItem value="createdAt">Join Date</MenuItem>
          </Select>
        </FormControl>
        <div className="doctor-filter-sort">
          <p className="filter-today d-flex align-items-center">
            <FiCalendar /> Today:  {dayjs().format(`D MMM`)}
          </p>
        </div>
      </Grid>
    </Grid>
  )
})

export interface TopPaginationType {
  totalDoctors: number;
  perPage: number;
  page: number;
  setPage: Function;
  placement: "top" | "bottom"
}

export const TopPagination: FC<TopPaginationType> = (({
  totalDoctors,
  page,
  perPage,
  setPage,
  placement,
}) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    dispatch(updateHomeFormSubmit(true))
    setPage(value);
    //Close all service on page change
    document.querySelectorAll('.collapse-service').forEach(element => {
      if (element.classList.contains('show-service')) {
        element.classList.remove('show-service');
        element.classList.add('hide-service');
      }
    })
    document.querySelectorAll('.serviceCollapse').forEach(element => {
      element.setAttribute('aria-expanded', 'false')
    })
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'center', minWidth: '100%', }}>
      {
        placement == 'top' ?
          <Stack spacing={2}>
            <Pagination
              showFirstButton
              showLastButton
              hideNextButton
              hidePrevButton
              boundaryCount={1}
              variant="outlined"
              color="secondary"
              count={Math.ceil(totalDoctors / perPage)}
              page={page}
              onChange={handlePageChange}
              className={classes.topPagination}
            />
            <Typography variant='h5' align='center' gutterBottom>Total: {totalDoctors} doctors</Typography>
          </Stack> :
          <Stack spacing={2}>
            <Typography variant='h5' align='center' gutterBottom>Total: {totalDoctors} doctors</Typography>
            <Pagination
              showFirstButton
              showLastButton
              hideNextButton
              hidePrevButton
              boundaryCount={1}
              variant="outlined"
              color="secondary"
              count={Math.ceil(totalDoctors / perPage)}
              page={page}
              onChange={handlePageChange}
              className={classes.bottomPagination}
            />
          </Stack>
      }
    </div>
  )
})

interface StyledCardProps {
  expanded: Record<number, boolean>;
  index: number;
}

const ListStyledCard = styled(Card)<StyledCardProps>(({ theme, expanded, index }) => ({
  transition: theme.transitions.create("all", { duration: 200 }),
  display: "flex",
  flexDirection: "row",
  opacity:
    Object.keys(expanded).length === 0 && Object.keys(expanded)[0] === undefined
      ? 1
      : expanded[index]
        ? 1
        : Object.values(expanded)[0] === undefined || !Object.values(expanded)[0]
          ? 1
          : 0.2,
  borderRadius: "10px",
  borderColor: theme.palette.secondary.main,
  borderWidth: "2px",
  borderStyle: "solid",
  position: "relative",
  flexWrap: "wrap",
  "&:hover": {
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
  },
}));

// Component Props
interface DoctorListComponentProps {
  index: number;
  elRefs: RefObject<HTMLDivElement>[];
  expanded: Record<number, boolean>;
  doctor: DoctorProfileType;
}

export const DoctorListComponent: React.FC<DoctorListComponentProps> = ({
  index,
  elRefs,
  expanded,
  doctor }) => {
  dayjs.extend(preciseDiff)
  const classes = useStyles();
  const [imageTimestamp, setImageTimestamp] = useState(new Date().getTime());
  useEffect(() => {
    setImageTimestamp(new Date().getTime());
  }, [doctor]);
  const [openImage, setOpenImage] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [Images, setImages] = useState<ClinicImagesType[]>([]);
  const [openAvailabilityTooltip, setOpenAvailabilityTooltip] = useState<{ [key: string]: boolean }>({ 0: false });
  const doctorStarRate =
    doctor?.rate_array.length == 0 ?
      0 :
      (doctor?.rate_array.reduce((acc, num) => acc + num, 0) / doctor?.rate_array.length)
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

  // @ts-ignore
  let { years, } = dayjs.preciseDiff(doctor?.dob, dayjs(), true);
  const serviceClicked = (e: any) => {

    const target = document.getElementById(`collapseservices_${index}`)!
    const service = document.getElementById(`${index}`)!
    if (target.classList.contains("hide-service")) {
      target.classList.add("show-service");
      target.classList.remove("hide-service");
      service.setAttribute('aria-expanded', 'true')
    } else {
      target.classList.remove("show-service");
      target.classList.add("hide-service");
      service.setAttribute('aria-expanded', 'false')
    }
    document.querySelectorAll('.collapse-service').forEach(element => {
      if (element.id !== `collapseservices_${index}`) {
        if (element.classList.contains('show-service')) {
          element.classList.remove('show-service');
          element.classList.add('hide-service');
        }
      }
    })
    document.querySelectorAll('.serviceCollapse').forEach(element => {
      if (element.id !== `${index}`) {
        element.setAttribute('aria-expanded', 'false')
      }
    })
  }
  const clicnicClicked = (e: any, index: number) => {
    e.preventDefault();
    setOpenImage(true);
    setImageIndex(index)
    setImages((prevState) => {
      prevState = []
      prevState = [...doctor.clinicImages]
      return prevState;
    })
  }

  const availabilityTooltipTitle = () => {
    return (
      <Fragment>
        {
          doctor.timeslots[0]?.availableSlots.map((time: AvailableType, j: number) => {
            return (
              <Fragment key={j}>
                <Typography component='span' className={classes.responsiveFontSize}>
                  From: {time.startDate}
                </Typography>
                {" "}
                <Typography component='span' className={classes.responsiveFontSize}>
                  to: {time.finishDate}
                </Typography><br />

              </Fragment>
            )
          })
        }
      </Fragment>
    )
  }

  return (
    <Fragment>
      <ListStyledCard ref={elRefs[index]} id={`${index}_card`} aria-label="card" expanded={expanded} index={index}>
        <Grid container >
          <Grid item xl={3} lg={2.87} md={2.87} sm={2} xs={12} >
            <CardMedia className={classes.ListCard}>
              <Link href={`/doctors/profile/${btoa(doctor?._id)}`} aria-label='doctor single'>
                <ProfileImageStyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                  variant="dot"
                  online={doctor.online as boolean}
                >
                  <Avatar
                    className={classes.ListAvatar}
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
                          clicnicClicked(e, index)
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
            <CardContent className={classes.ListContent}>
              <Typography component="div" variant="h5" className={classes.ListDoctorName}>
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
              <Rating
                name="read-only"
                precision={0.5}
                value={doctorStarRate}
                readOnly
                size='small' />
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
              <h2 className={classes.listAbout}>About: </h2>
              <Typography component='div' variant="body2" color="text.secondary" id={`${index}_typoGrapy`}>

                <ReadMoreText
                  key={doctor?.aboutMe}
                  lines={6}
                  type='html'
                  aria-expanded="false"
                  text={doctor?.aboutMe}
                />
              </Typography>
            </CardContent>
          </Grid>
          <Grid item xl={3} lg={3.63} md={4.03} sm={4} xs={12}>
            <CardContent id={`${index}_context`}>
              <ul >
                <li style={{ marginBottom: 10 }}>
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
                          title={availabilityTooltipTitle()}
                        >
                          <button className="available-date available-today" onClick={() => {
                            openAvailabilityTooltip[index] ? handleTooltipClose(index) : handleTooltipOpen(index)
                          }}  >
                            Check Availability
                          </button>
                        </Tooltip>
                      </span>
                    </ClickAwayListener> :
                    <Button variant='contained' disabled className="available-date">Not Available</Button>}
                </li>
                <li style={{ marginBottom: 10 }}>
                  <FiThumbsUp />&nbsp;
                  {
                    `${doctor?.recommendArray ?
                      ((doctor?.recommendArray.filter(vote => vote === 1).length
                        / doctor?.recommendArray?.length) * 100).toFixed(0) : `0`}%`
                  }
                  {" "}
                  <span className="votes">
                    (
                    {doctor?.recommendArray ? doctor?.recommendArray?.length : 0}
                    Votes
                    )
                  </span>
                </li>
                <li>
                  <i className="far fa-money-bill-alt" />{" "}
                  <Tooltip arrow title="Averrage price per hour">
                    <span> A/H:</span>
                  </Tooltip>{" "}
                  {
                    doctor?.currency && doctor?.currency.length > 0 &&
                    `${doctor?.currency[0]?.currency_symbol}`
                  }
                  {" "}
                  {
                    doctor?.timeslots && doctor?.timeslots.length > 0 &&
                      doctor?.timeslots[0]?.averageHourlyPrice ?
                      formatNumberWithCommas(`${doctor?.timeslots[0]?.averageHourlyPrice?.toFixed(0)}`) : 0
                  }
                  {" "}
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
                  href={`/doctors/profile/${btoa(doctor?._id)}`}
                  disabled={doctor?.timeslots.length == 0}>
                  Online Consultation
                </Button>
              </div>
            </CardContent>
          </Grid>
        </Grid>
        <CardActionArea aria-label='card action area' id={`${index}_cardActionArea`}>
          <div id={`collapseservices_${index}`} className="collapse-service hide-service ">
            <Grid container rowGap={1} columnGap={1} sx={{ paddingRight: 1, paddingLeft: 1 }}
              className="clinic-services"
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
          sx={{ flex: 1 }}
        >
          <FavButton doctor={doctor} index={index} />
          <ShareButtons doctor={doctor} displayType='list' />
          <Link
            aria-label='services'
            style={{ marginLeft: 'auto' }}
            className='collapsed serviceCollapse'
            href="#"
            id={`${index}`}
            aria-expanded="false"
            onClick={(e: any) => {
              e.preventDefault();
              serviceClicked(e);
            }}>
            <ExpandMoreIcon
              className={`serviceChavron ${classes.listServiceChevron}`} />Services
          </Link>
        </CardActions>
      </ListStyledCard>
      <Lightbox
        open={openImage}
        close={() => setOpenImage(false)}
        slides={Images}
        index={imageIndex}
      />
    </Fragment>
  );
};

const GridStyledCard = styled(Card)<StyledCardProps>(({ theme, expanded, index }) => ({
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
}));

interface DoctorGridComponentProps {
  index: number;
  elRefs: RefObject<HTMLDivElement>[];
  expanded: Record<number, boolean>;
  doctor: DoctorProfileType;
  setExpanded: Function
}
export const DoctorGridComponent: React.FC<DoctorGridComponentProps> = ({
  index,
  elRefs,
  expanded,
  doctor,
  setExpanded }) => {
  const [imageTimestamp, setImageTimestamp] = useState(new Date().getTime());
  const classes = useStyles();
  const theme = useTheme();
  const doctorName = `Dr. ${doctor?.firstName} ${doctor?.lastName}`
  const [openImage, setOpenImage] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [Images, setImages] = useState<ClinicImagesType[]>([]);
  const [openAvailabilityTooltip, setOpenAvailabilityTooltip] = useState<{ [key: string]: boolean }>({ 0: false });
  const [open, setOpen] = useState(false);
  const doctorStarRate =
    doctor?.rate_array.length == 0 ?
      0 :
      (doctor?.rate_array.reduce((acc, num) => acc + num, 0) / doctor?.rate_array.length)
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
  const expandClicked = () => {
    setExpanded(() => {
      return { [index]: !expanded[index] }
    });
  }
  const clicnicClicked = (e: any, index: number) => {
    e.preventDefault();
    setOpenImage(true);
    setImageIndex(index)
    setImages((prevState) => {
      prevState = []
      prevState = [...doctor.clinicImages]
      return prevState;
    })
  }

  const availabilityTooltipTitle = () => {
    return (
      <Fragment>
        {
          doctor.timeslots[0]?.availableSlots.map((time: AvailableType, j: number) => {
            return (
              <Fragment key={j}>
                <Typography component='span' className={classes.responsiveFontSize}>
                  From: {time.startDate}
                </Typography>
                {" "}
                <Typography component='span' className={classes.responsiveFontSize}>
                  to: {time.finishDate}
                </Typography><br />

              </Fragment>
            )
          })
        }
      </Fragment>
    )
  }

  const dividerSx = () => {
    return {
      color: theme.palette.secondary.main,
      minWidth: elRefs[index]?.current?.offsetWidth,
      maxWidth: elRefs[index]?.current?.offsetWidth,
    }
  }
  return (
    <Fragment>
      <GridStyledCard style={setCardStyle(index, expanded)} ref={elRefs[index]} id={`${index}_card`} aria-label="card" expanded={expanded} index={index}>
        <Tooltip arrow title={doctorName.length > 18 ? doctorName : ""} followCursor TransitionComponent={Zoom}>
          <span style={{ zIndex: 3 }}>
            <CardHeader
              className={classes.gridCardHeader}
              avatar={
                <Avatar alt=""
                  src={doctor?.specialities?.[0]?.image}
                  variant="square"
                  className={classes.gridSpecialityAvatar}
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
        <Link href={`/doctors/profile/${btoa(doctor?._id)}`} aria-label='doctor single'>
          <ProfileImageStyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            variant="dot"
            online={doctor.online as boolean}
          >
            <Avatar
              className={classes.gridMainAvatar}
              variant="square"
              alt=""
              src={`${doctor?.profileImage}?random=${imageTimestamp}`}
              key={doctor?.profileImage}
            >
              <img className="img-fluid" src={doctors_profile} alt="" />
            </Avatar>
          </ProfileImageStyledBadge>
        </Link>
        <CardContent className={classes.gridCardContain}>
          <Typography component='div' variant="body2" color="text.secondary">
            <ReadMoreText
              key={doctor?.aboutMe}
              lines={2}
              type='html'
              text={doctor?.aboutMe}
            />
          </Typography>
        </CardContent>
        <CardActions disableSpacing className={classes.gridCardAction}>
          <FavButton doctor={doctor} index={index} />
          <ShareButtons doctor={doctor} displayType='grid' />
          <ExpandMore
            expand={expanded[index as keyof typeof expanded]}
            onClick={expandClicked}
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
              setExpanded({ [index]: false });
            }}>
            <CardContent className={classes.gridExpandContent}
              sx={{
                minWidth: elRefs[index]?.current?.offsetWidth,
                maxWidth: elRefs[index]?.current?.offsetWidth,
              }}
            >
              <MuiList disablePadding dense >
                <Divider sx={dividerSx()} />
                <ListItem >
                  <ListItemIcon>
                    Speciality:
                  </ListItemIcon>
                  <ListItemAvatar >
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
                <Divider sx={dividerSx()} />
                <ListItem >
                  <ListItemIcon>
                    Rate:
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Rating
                        name="read-only"
                        precision={0.5}
                        value={doctorStarRate}
                        readOnly
                        size='small' />
                    }
                  />
                </ListItem>
                <Divider sx={dividerSx()} />
                <ListItem >
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
                <Divider sx={dividerSx()} />

                {
                  doctor?.clinicImages?.length > 0 &&
                  <>
                    <ListItem >
                      <ListItemIcon>
                        Clinick Images: &nbsp;
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          doctor && doctor.clinicImages &&
                          doctor.clinicImages.map((img: any, j: number) => {
                            return (
                              <span key={j} className={classes.gridClinicImageWrapper}>
                                <Link href="" onClick={(e) => { clicnicClicked(e, index) }} >
                                  <img src={img.src} alt='' className={classes.gridClinicImage} />
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
                    }} />
                  </>
                }

                <ListItem >
                  <ListItemText
                    primary={
                      <div className="doctor-widget-one">
                        <div className="doc-info-right">
                          <div className="clini-infos" style={{ marginBottom: 0, }}>
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
                                        title={availabilityTooltipTitle()}
                                      >
                                        <button className={`available-date available-today ${classes.gridAvailaibityButton}`} onClick={() => {
                                          openAvailabilityTooltip[index] ? handleTooltipClose(index) : handleTooltipOpen(index)
                                        }}  >
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
                <Divider sx={dividerSx()} />

                <ListItem >
                  <ListItemText
                    primary={
                      <div className="doctor-widget-one">
                        <div className="doc-info-right">
                          <div className="clini-infos" style={{ marginBottom: 0 }}>
                            <ul className={classes.gridVoteUL}>
                              <li>
                                <FiThumbsUp />&nbsp;
                                {
                                  `${doctor?.recommendArray ?
                                    ((doctor?.recommendArray.filter(vote => vote === 1).length /
                                      doctor?.recommendArray?.length) * 100).toFixed(0) : `0`}%`}
                                {" "}
                                <span className="votes">({doctor?.recommendArray ? doctor?.recommendArray?.length : 0} Votes)</span>
                              </li>
                              <li>
                                <i className="far fa-money-bill-alt" />{" "}
                                <Tooltip arrow title="Averrage price per hour">
                                  <span> A/H:</span>
                                </Tooltip>{" "}
                                {doctor?.currency && doctor?.currency.length > 0 && `${doctor?.currency[0]?.currency_symbol}`}{" "}
                                {doctor?.timeslots && doctor?.timeslots.length > 0 &&
                                  doctor?.timeslots[0]?.averageHourlyPrice ? formatNumberWithCommas(`${doctor?.timeslots[0]?.averageHourlyPrice?.toFixed(0)}`) : 0
                                }
                                {" "}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    }
                  />
                </ListItem>
                <Divider sx={dividerSx()} />

                <ListItem >
                  <ListItemText
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
                <Divider sx={dividerSx()} />

                <ListItem >
                  <ListItemText
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
                <Divider sx={dividerSx()} />
                <ListItem >
                  <ListItemText
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
      </GridStyledCard>
      <Lightbox
        open={openImage}
        close={() => setOpenImage(false)}
        slides={Images}
        index={imageIndex}
      />
    </Fragment >
  )
};

export interface FavButtonTypes {
  doctor: DoctorProfileType;
  index: number
}
export const FavButton: FC<FavButtonTypes> = (({ doctor, index }) => {
  const { bounce, muiVar } = useScssVar();
  const [loginDialog, setLoginDialog] = useState<boolean>(false)
  const userProfile = useSelector((state: AppState) => state.userProfile.value)
  let isFav = !!userProfile ? doctor?.favs_id?.includes(userProfile?._id as string) : false
  const [favIconLoading, setFavIconLoading] = useState<{ [key: string]: boolean }>({ 0: false });
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)

  const favClicked = () => {
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
  }
  return (
    <Fragment>
      <Tooltip arrow title={!userProfile ? 'Login in to add to favorit.' : `${isFav ? 'Remove' : 'Add'} doctor to favorite.`}>
        <IconButton
          disableFocusRipple
          disableRipple
          aria-label="add to favorites"
          onClick={() => {
            favClicked();
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
})

export interface ShareButtonTypes {
  doctor: DoctorProfileType;
  displayType: 'list' | 'grid'
}

export const ShareButtons: FC<ShareButtonTypes> = (({ doctor, displayType }) => {
  const marrgin = displayType == 'grid' ?
    { ["--bottom" as string]: `13px` as CSSProperties } :
    { ["--bottom" as string]: `10px` as CSSProperties }
  const theme = useTheme();
  const title = `Dr. ${doctor?.firstName} ${doctor?.lastName}`
  let shareUrl = `${process.env.NEXT_PUBLIC_webUrl}/doctors/profile/${btoa(doctor?._id)}`
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
          paddingBottom: displayType == 'grid' ? `2px` : '5px',
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
})