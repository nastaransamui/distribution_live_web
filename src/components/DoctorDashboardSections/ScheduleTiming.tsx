/* eslint-disable @next/next/no-img-element */

import { FC, Fragment, useEffect, useState } from 'react'

//next
import Link from 'next/link';

//Mui
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button'
import { styled, useTheme, darken, lighten, } from '@mui/material/styles';
import Box from '@mui/material/Box';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid, GridColDef, GridRenderCellParams, GridValueFormatterParams, GridValueGetterParams } from '@mui/x-data-grid';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Pagination from '@mui/material/Pagination';


//utilites
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

import _, { times } from 'lodash'


//redux
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';

//liberies
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
import { toast } from 'react-toastify';



//Compoenents
import { Transition, BootstrapDialog, BootstrapDialogTitle } from "@/components/shared/Dialog";
import { Calendar, DateObject } from "react-multi-date-picker"

import "react-multi-date-picker/plugins/range_picker_footer";

//hooks
import useScssVar from '@/hooks/useScssVar'
import { useRouter } from 'next/router';
import { AppointmentReservationType } from '@/components/DoctorsSections/CheckOut/PaymentSuccess';
import Chip from '@mui/material/Chip';
import { patient_profile } from '@/public/assets/imagepath';
import CustomNoRowsOverlay from '@/shared/CustomNoRowsOverlay';
import { useSearchParams } from 'next/navigation';
import { base64regex } from '../DoctorsSections/Profile/ProfilePage';
import isJsonString from '@/helpers/isJson';
import { loadStylesheet } from '@/pages/_app';

export const StyledBadge = styled(Badge, {
  shouldForwardProp: (prop) => prop !== 'online'
})
  <{ online: boolean }>(({ theme, online }) => {
    return {
      '& .MuiBadge-badge': {
        backgroundColor: online ? '#44b700' : 'crimson',
        color: online ? '#44b700' : 'crimson',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          animation: 'ripple 1.2s infinite ease-in-out',
          border: '1px solid currentColor',
          content: '""',
        },
      },
      '@keyframes ripple': {
        '0%': {
          transform: 'scale(.8)',
          opacity: 1,
        },
        '100%': {
          transform: 'scale(2.4)',
          opacity: 0,
        },
      },
    }
  });

export const getSelectedBackgroundColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);

export const getSelectedHoverBackgroundColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.4) : lighten(color, 0.4);

export interface TimeType {
  period: string;
  active: boolean;
  isReserved: boolean;
  reservations: AppointmentReservationType[];
}

export interface AvailableType {
  index?: number
  startDate: string;
  finishDate: string;
  morning: TimeType[];
  afternoon: TimeType[];
  evening: TimeType[];
  timeSlot: number;
}

export interface DoctorsTimeSlotType {
  isTommorowAvailable?: boolean;
  isTodayAvailable?: boolean;
  isThisWeekAvailable?: boolean;
  doctorId: string;
  _id: string;
  createDate: Date;
  updateDate: Date;
  availableSlots: AvailableType[];
  reservations?: AppointmentReservationType[];
}


let initialState: AvailableType = {
  startDate: '',
  finishDate: '',
  morning: [],
  afternoon: [],
  evening: [],
  timeSlot: 60,
}


export const morningStart = dayjs().hour(9)
export const morningFinish = dayjs().hour(12)
export const morningHours = morningFinish.diff(morningStart, "minutes")

export const afterNoonStart = dayjs().hour(13)
export const afterNoonFinish = dayjs().hour(16)
export const afterNoonHours = afterNoonFinish.diff(afterNoonStart, "minutes")

export const eveningStart = dayjs().hour(17)
export const eveningFinish = dayjs().hour(20)
export const eveningHours = eveningFinish.diff(eveningStart, "minutes")
const perPage = 5

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{
          p: 1,
        }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ScheduleTiming: FC = (() => {
  const { muiVar, bounce } = useScssVar();
  dayjs.extend(isBetween)
  const theme = useTheme();
  const searchParams = useSearchParams();
  const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const [calendarValue, setCalendarValue] = useState<any>()
  let initStateKey = dayjs().format('DDMMYYYY')
  const [morningCheck, setMorningCheck] = useState<{ [key: string]: boolean }>({})
  const [afterNoonCheck, setAfterNoonCheck] = useState<{ [key: string]: boolean }>({})
  const [eveningCheck, setEveningCheck] = useState<{ [key: string]: boolean }>({})
  const [isPeriodExist, setIsPeriodExist] = useState<{ [key: string]: boolean }>({})
  const [timeSlot, setTimeSlot] = useState<{ [key: string]: number }>({})
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [doctorAvailableTimeSlot, setDoctorAvailableTimeSlot] = useState<DoctorsTimeSlotType | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false)
  const [rows, setRows] = useState<AppointmentReservationType[] | []>([])
  const [editDaySlot, setEditDaySlot] = useState<AvailableType | null>(null)
  const [tabIndex, setTabIndex] = useState(0);
  const dispatch = useDispatch()
  const router = useRouter()
  const [dataGridFilters, setDataGridFilters] = useState({
    limit: 5,
    skip: 0
  });

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setDataGridFilters({
      limit: perPage * value,
      skip: (value - 1) * perPage
    })

    router.push({
      pathname: router.pathname, //undefined, {shallow: true, scroll: false,}
      query: { filters: btoa(JSON.stringify({ limit: perPage * value, skip: (value - 1) * perPage })) },

    }, undefined, { shallow: true, scroll: false })
  };

  const widthOnlyXl = useMediaQuery(theme.breakpoints.only('xl'));
  const widthOnlyLg = useMediaQuery(theme.breakpoints.only('lg'));
  const widthOnlySm = useMediaQuery(theme.breakpoints.only('sm'));
  const widthOnlyXs = useMediaQuery(theme.breakpoints.only('xs'));
  const minWidth767max991 = useMediaQuery('@media (min-width:767px) and (max-width: 991px)');

  useEffect(() => {
    loadStylesheet('/css/react-multi-date-picker-bg-dark.min.css');
  }, [])
  useEffect(() => {
    if (searchParams.get('filters') !== null) {
      if (base64regex.test(searchParams.get('filters') as string)) {
        let filters = atob(searchParams.get('filters') as string)
        if (isJsonString(filters)) {
          setDataGridFilters(JSON.parse(filters))
        }
      }
    }
  }, [searchParams])

  useEffect(() => {
    let isActive = true;
    let userId = userProfile?._id
    if (isActive && homeSocket.current !== undefined) {
      if (userProfile?.timeSlotId && userProfile?.timeSlotId.length !== 0) {
        homeSocket.current.emit('getDoctorTimeSlots', { userId: userId, ...dataGridFilters })
        homeSocket.current.once('getDoctorTimeSlotsReturn', (msg: { status: number, timeSlots: DoctorsTimeSlotType[], message?: string }) => {
          const { status, timeSlots, message } = msg;
          if (status !== 200) {
            toast.error(message || `${status} Error for Slots`, {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              toastId: 'schedule_error',
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              transition: bounce,
              onClose: () => {
                setIsLoading(false)
                // toast.dismiss('schedule_error')
              }
            });
          } else {
            if (timeSlots.length !== 0) {
              let newDoctorAvailableTimeSlot = timeSlots[0]
              let newAvailableSlotFromDb = newDoctorAvailableTimeSlot.availableSlots
              setDoctorAvailableTimeSlot({ ...newDoctorAvailableTimeSlot })

              setRows(() => {
                let newState: AppointmentReservationType[] = []
                if (timeSlots[0]?.reservations && timeSlots[0]?.reservations.length > 0) {
                  newState = [...timeSlots[0]?.reservations];
                }
                return newState
              })

              //Update calendar from Db data
              setCalendarValue((prevState: any) => {
                let newState = prevState
                newState = []
                newAvailableSlotFromDb.forEach((element: AvailableType) => {
                  let formatStartDay = dayjs(element.startDate).format('YYYY/MM/DD')
                  let formatFinishDay = dayjs(element.finishDate).format('YYYY/MM/DD')
                  newState.push([new DateObject(formatStartDay), new DateObject(formatFinishDay)])
                })
                return newState
              })
              //Update time slot from db data
              setTimeSlot((prevState: { [key: string]: number }) => {
                let newState: { [key: string]: number } = {}
                newAvailableSlotFromDb.forEach((element: AvailableType) => {
                  newState[dayjs(element.startDate).format('DDMMYYYY')] = element.timeSlot
                })
                return newState
              })
              //Update period exist from db data
              setIsPeriodExist((prevState: { [key: string]: boolean }) => {
                let newState: { [key: string]: boolean } = {}
                newAvailableSlotFromDb.forEach((element: AvailableType) => {
                  let haveMorning = element!.morning.length == 0 ? false : element!.morning.some((a) => a.active)
                  let haveAfternoon = element!.afternoon.length == 0 ? false : element!.afternoon.some((a) => a.active)
                  let haveEvening = element!.evening.length == 0 ? false : element!.evening.some((a) => a.active)
                  let stateKey = dayjs(element?.startDate).format('DDMMYYYY')
                  if (haveMorning || haveAfternoon || haveEvening) {
                    newState = {
                      ...newState,
                      [stateKey as string]: true
                    }
                  } else {
                    newState = {
                      ...newState,
                      [stateKey as string]: false
                    }
                  }
                })
                return newState
              })

              setMorningCheck((prevState: { [key: string]: boolean }) => {
                let newState: { [key: string]: boolean } = {}
                newAvailableSlotFromDb.forEach((element: AvailableType) => {
                  let haveMorning = element!.morning.length == 0 ? false : true
                  let stateKey = dayjs(element?.startDate).format('DDMMYYYY')
                  if (haveMorning) {
                    newState = {
                      ...newState,
                      [stateKey as string]: true
                    }
                  } else {
                    newState = {
                      ...newState,
                      [stateKey as string]: false
                    }
                  }
                })
                return newState
              })
              setAfterNoonCheck((prevState: { [key: string]: boolean }) => {
                let newState: { [key: string]: boolean } = {}
                newAvailableSlotFromDb.forEach((element: AvailableType) => {
                  let haveAfternoon = element!.afternoon.length == 0 ? false : true
                  let stateKey = dayjs(element?.startDate).format('DDMMYYYY')
                  if (haveAfternoon) {
                    newState = {
                      ...newState,
                      [stateKey as string]: true
                    }
                  } else {
                    newState = {
                      ...newState,
                      [stateKey as string]: false
                    }
                  }
                })
                return newState
              })
              setEveningCheck((prevState: { [key: string]: boolean }) => {
                let newState: { [key: string]: boolean } = {}
                newAvailableSlotFromDb.forEach((element: AvailableType) => {
                  let haveEvening = element!.evening.length == 0 ? false : true
                  let stateKey = dayjs(element?.startDate).format('DDMMYYYY')
                  if (haveEvening) {
                    newState = {
                      ...newState,
                      [stateKey as string]: true
                    }
                  } else {
                    newState = {
                      ...newState,
                      [stateKey as string]: false
                    }
                  }
                })
                return newState
              })
            }
            homeSocket.current.once(`updateGetDoctorTimeSlots`, () => {
              setReload(!reload)
            })
            setIsLoading(false)
          }

        })
      } else {
        //reset all on delete
        isLoading && setIsLoading(false)
        doctorAvailableTimeSlot !== null && setDoctorAvailableTimeSlot(null);
        !_.isEmpty(afterNoonCheck) && setAfterNoonCheck({});
        !!calendarValue && setCalendarValue(undefined);
        !_.isEmpty(eveningCheck) && setEveningCheck({});
        !_.isEmpty(isPeriodExist) && setIsPeriodExist({});
        !_.isEmpty(morningCheck) && setMorningCheck({});
        rows.length !== 0 && setRows([]);
        !_.isEmpty(timeSlot) && setTimeSlot({})
      }
    } else {
      setIsLoading(false)
    }
    return () => {
      isActive = false;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeSocket, reload, dataGridFilters])


  const fixMultipleState = (index: number, keyState: string) => {
    setCalendarValue((prevState: any) => {
      let newState = [...prevState]
      newState.splice(index, 1)
      return [...newState]
    })
    setTimeSlot((prevState: { [key: string]: number }) => {
      let newState = { ...prevState }
      delete newState[keyState]
      return newState
    })
    setIsPeriodExist((prevState: { [key: string]: boolean }) => {

      return {
        ...prevState,
        [keyState as string]: false
      }
    })
    setMorningCheck((prevState: { [key: string]: boolean }) => {

      return {
        ...prevState,
        [keyState as string]: false
      }
    })
    setAfterNoonCheck((prevState: { [key: string]: boolean }) => {

      return {
        ...prevState,
        [keyState as string]: false
      }
    })
    setEveningCheck((prevState: { [key: string]: boolean }) => {

      return {
        ...prevState,
        [keyState as string]: false
      }
    })
    setTabIndex(0)
  }

  const removePeriod = (index: number) => {
    //Check if both time is defined if not remove
    // console.log({ remove: calendarValue[index] })
    if (calendarValue[index].every((a: any) => typeof a !== 'undefined')) {
      //Format start date and finish date of callendar
      let startDate = dayjs(calendarValue[index][0]).format("DD MMM YYYY")
      let finishDate = dayjs(calendarValue[index][1]).format("DD MMM YYYY")
      let keyState = dayjs(calendarValue[index][0]).format("DDMMYYYY")
      //first check if doctor has time slot 
      if (doctorAvailableTimeSlot !== null) {
        //timeslot is empty safe to delete
        if (doctorAvailableTimeSlot.availableSlots.length !== 0) {
          let indexOfStartDate = doctorAvailableTimeSlot.availableSlots.findIndex((s: AvailableType) => dayjs(s.startDate).isSame(startDate))
          let indexOfFinishDate = doctorAvailableTimeSlot.availableSlots.findIndex((s: AvailableType) => dayjs(s.finishDate).isSame(finishDate))

          if (indexOfStartDate == -1 && indexOfFinishDate == -1) {
            fixMultipleState(index, keyState)
          } else {
            let doctorAvailableArray = doctorAvailableTimeSlot.availableSlots[indexOfStartDate]
            let hasMorningReserve = doctorAvailableArray.morning.some((a: TimeType) => a.isReserved)
            let hasAfterNoonReserve = doctorAvailableArray.afternoon.some((a: TimeType) => a.isReserved)
            let hasEveningReserve = doctorAvailableArray.evening.some((a: TimeType) => a.isReserved)
            if (!hasMorningReserve && !hasAfterNoonReserve && !hasEveningReserve) {
              // fixMultipleState(index, keyState)
              // setDoctorAvailableTimeSlot((prevState: DoctorsTimeSlotType | null) => {
              //   if (prevState !== null) {
              //     let newState = { ...prevState }
              //     newState.availableSlots = newState.availableSlots.filter((a: AvailableType, i: number) => i !== indexOfFinishDate || i !== indexOfStartDate)
              //     return { ...newState }
              //   } else {
              //     return prevState
              //   }
              // })

            } else {
              console.log(`has record`)
            }
          }
        } else {
          fixMultipleState(index, keyState)
        }
      } else {
        fixMultipleState(index, keyState)
      }
    } else {
      console.log({ 340: index })
      // fixMultipleState(index, keyState)
    }
  }

  const timeSlotChange = (e: SelectChangeEvent, startDate: number) => {
    setTimeSlot((prevState: { [key: number]: number }) => ({ ...prevState, [startDate]: parseInt(e.target.value) }))
  }

  const addSlotClick = (startDate: string, finishDate: string, index: number) => {
    let statesKey = dayjs(startDate).format('DDMMYYYY')
    if (morningCheck[statesKey] || afterNoonCheck[statesKey] || eveningCheck[statesKey]) {
      setShowDialog(true)
      setEditDaySlot((prevState: AvailableType | null) => {
        let newState = prevState
        if (newState == null) {
          initialState.index = index
          initialState.startDate = startDate;
          initialState.finishDate = finishDate;
          initialState.timeSlot = timeSlot[statesKey]
          initialState.morning = []
          initialState.afternoon = []
          initialState.evening = []
          if (morningCheck[statesKey] && (initialState.morning.length !== [...Array(morningHours / timeSlot[statesKey])].length)) {
            [...Array(morningHours / timeSlot[statesKey])].map((e, i) => {
              initialState.morning.push({
                period: `${dayjs().hour(9).minute(0).add(timeSlot[statesKey] * i, 'minute').format('HH:mm')} - ${dayjs().hour(9).minute(0).add(timeSlot[statesKey] * (i + 1), 'minute').format('HH:mm')}`,
                active: false,
                isReserved: false,
                reservations: []
              })
            })
          }
          if (afterNoonCheck[statesKey] && (initialState.afternoon.length !== [...Array(afterNoonHours / timeSlot[statesKey])].length)) {
            [...Array(afterNoonHours / timeSlot[statesKey])].map((e, i) => {
              initialState.afternoon.push({
                period: `${dayjs().hour(13).minute(0).add(timeSlot[statesKey] * i, 'minute').format('HH:mm')} - ${dayjs().hour(13).minute(0).add(timeSlot[statesKey] * (i + 1), 'minute').format('HH:mm')}`,
                active: false,
                isReserved: false,
                reservations: []
              })
            })
          }
          if (eveningCheck[statesKey] && (initialState.evening.length !== [...Array(eveningHours / timeSlot[statesKey])].length)) {
            [...Array(eveningHours / timeSlot[statesKey])].map((e, i) => {
              initialState.evening.push({
                period: `${dayjs().hour(17).minute(0).add(timeSlot[statesKey] * i, 'minute').format('HH:mm')} - ${dayjs().hour(17).minute(0).add(timeSlot[statesKey] * (i + 1), 'minute').format('HH:mm')}`,
                active: false,
                isReserved: false,
                reservations: []
              })
            })
          }
          newState = initialState
        } else {
          console.log('{ prevState }')
        }
        return newState
      })
    } else {
      toast.error('You need to select on time table at least.', {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        transition: bounce,
        onClose: () => { }
      });
    }
  }


  const selectMoringSlot = (e: any, i: number) => {
    if (editDaySlot !== null) {
      let newDaySlot = { ...editDaySlot }
      newDaySlot.morning[i]['active'] = e.target.checked
      setEditDaySlot({ ...newDaySlot })
    }
  }

  const selectAfternoonSlot = (e: any, i: number) => {
    if (editDaySlot !== null) {
      let newDaySlot = { ...editDaySlot }
      newDaySlot.afternoon[i]['active'] = e.target.checked
      setEditDaySlot({ ...newDaySlot })
    }
  }

  const selectEveningSlot = (e: any, i: number) => {
    if (editDaySlot !== null) {
      let newDaySlot = { ...editDaySlot }
      newDaySlot.evening[i]['active'] = e.target.checked
      setEditDaySlot({ ...newDaySlot })
    }
  }

  const editSlotClick = (startDate: string, finishDate: string) => {

    if (doctorAvailableTimeSlot !== null) {
      let indexOfStartDate = doctorAvailableTimeSlot.availableSlots.findIndex((s: AvailableType) => dayjs(s.startDate).isSame(startDate))
      let indexOfFinishDate = doctorAvailableTimeSlot.availableSlots.findIndex((s: AvailableType) => dayjs(s.finishDate).isSame(finishDate))
      if (indexOfStartDate !== -1 && indexOfFinishDate !== -1) {
        setShowDialog(true)
        // let editDay: AvailableType = doctorAvailableTimeSlot.availableSlots[indexOfStartDate]
        let editDay: AvailableType = _.cloneDeep(doctorAvailableTimeSlot.availableSlots[indexOfStartDate])
        setEditDaySlot(editDay)
      }
    }
  }

  const PeriodPlugin = (props: any) => {
    return (
      <div className="rmdp-range-picker-footer ltr bottom">
        <h6 className="rmdp-week-day">Selected Dates:</h6>
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: ' repeat(auto-fill, minmax(100%, 1fr))' }}>
          {
            calendarValue &&
            calendarValue
              .sort((a: any, b: any) => dayjs(a[0]).isBefore(b[0]) ? -1 : 1)
              .map((calendar: any, i: number) => {
                let stateKey = calendar && calendar[0] ?
                  calendar[0].format('DDMMYYYY')
                  : initStateKey
                let isHide =
                  Object.keys(isPeriodExist)[0] == undefined
                    ? false
                    : isPeriodExist[stateKey as keyof typeof isPeriodExist] == true
                      ? true
                      : Object.values(isPeriodExist)[0] == undefined ||
                        !Object.values(isPeriodExist)[0]
                        ? false
                        : false
                return (
                  <div key={i}>
                    {
                      calendar && (calendar[0] || calendar[1]) &&
                      <Grid container sx={{
                        border: `1px solid `,
                        borderColor: 'primary.main',
                        borderRadius: '5px', padding:
                          `5px`,
                        mb: 1,
                      }}>
                        {/* Two period section with close */}
                        <Grid item sx={{
                          flexBasis: { lg: '85%', md: "70%", sm: '100%', xs: '100%' },
                          textAlign: { xl: 'left', lg: 'left', md: 'left', sm: 'left', xs: 'center' }
                        }}>
                          <div style={{ display: 'inline-block', }} className={widthOnlyXs ? '' : 'form-group'}>
                            {/* <i className="fa fa-times-circle" onClick={() => closeFromClick(i, stateKey)}
                              style={{
                                color: theme.palette.secondary.main,
                                opacity: isHide ? 0.2 : 1,
                                pointerEvents: isHide ? 'none' : 'auto'
                              }}></i> */}
                            <Typography component='span' sx={{ fontSize: { xl: `18px !important`, lg: `16px !important`, md: `14px !important`, sm: `16px !important`, xs: `16px !important` }, }}>
                              From: {calendar && typeof calendar[0] !== 'undefined' ? calendar[0].format("DD MMM YYYY") : 'Select Date'}
                            </Typography>
                          </div>
                          <Typography component='span' style={{ padding: '0px 10px', marginTop: 0 }} sx={{ display: { sm: 'inline-block', xs: 'block' } }}>-</Typography>
                          <div style={{ display: 'inline-block' }}>
                            {/* <i className="fa fa-times-circle" onClick={() => closeToClick(i)} style={{ color: theme.palette.secondary.main, opacity: isHide ? 0.2 : 1, pointerEvents: isHide ? 'none' : 'auto' }}></i> */}
                            <Typography component='span' sx={{ fontSize: { xl: `18px !important`, lg: `16px !important`, md: `14px !important`, sm: `16px !important`, xs: `16px !important` }, }}>
                              To: {calendar && typeof calendar[1] !== 'undefined' ? calendar[1].format("DD MMM YYYY") : 'Select Date'}
                            </Typography>
                          </div>
                        </Grid>

                        {/* Add remove slot */}

                        <Grid item sx={{
                          marginLeft: { xl: 'auto', lg: 'auto', md: 'auto', sm: 'unset', xs: 'unset' },
                          pb: { xl: 'unset', lg: 'unset', md: 'unset', sm: 2, xs: 2 },
                          display: 'flex',
                          flexBasis: { xl: 'unset', lg: 'unset', md: 'unset', sm: '100%', xs: '100%' },
                        }}>
                          {
                            calendar[0] && calendar[1] ?
                              !isHide ?
                                <Grid item sx={{
                                  flexBasis: '100%',
                                  display: 'flex'
                                }}>
                                  <Tooltip arrow title="Remove this time slot">
                                    <span>
                                      <i className="fa fa-minus-circle"
                                        onClick={() => removePeriod(i)}
                                        style={{
                                          color: 'crimson',
                                          cursor: `pointer`,
                                          marginTop: widthOnlyXs ? '0px' : `7px`,
                                          opacity: isHide ? 0.2 : 1,
                                          pointerEvents: isHide ? 'none' : 'auto'
                                        }}></i> &nbsp;
                                    </span>
                                  </Tooltip>
                                  <Link
                                    className="edit-link"
                                    style={{ marginLeft: 'auto' }}
                                    href=""
                                    onClick={(e) => {
                                      e.preventDefault()
                                      addSlotClick(calendar[0].format(''), calendar[1].format(''), i)
                                    }}
                                  >
                                    <i className="fa fa-plus-circle"></i> Add Slot
                                  </Link>
                                </Grid> :
                                <Grid item sx={{
                                  marginLeft: { xl: 'auto', lg: 'auto', md: 'auto', sm: 'unset', xs: 'unset' },
                                  pb: { xl: 'unset', lg: 'unset', md: 'unset', sm: 2, xs: 2 },
                                  display: 'flex',
                                  flexBasis: { xl: 'unset', lg: 'unset', md: 'unset', sm: '100%', xs: '100%' },
                                }}>
                                  <Tooltip arrow title={isHide ? '' : "Remove this time slot"}>
                                    <span>
                                      <i className="fa fa-minus-circle" onClick={() => removePeriod(i)} style={{
                                        color: 'crimson',
                                        cursor: `pointer`,
                                        marginTop: widthOnlyXs ? '0px' : `7px`,
                                        opacity: isHide ? 0.2 : 1,
                                        pointerEvents: isHide ? 'none' : 'auto'
                                      }}></i> &nbsp;
                                    </span>
                                  </Tooltip>
                                  <Link
                                    className="edit-link"
                                    href=""
                                    style={{ marginLeft: 'auto' }}
                                    onClick={(e) => {
                                      e.preventDefault()
                                      editSlotClick(calendar[0].format(''), calendar[1].format(''))
                                    }}
                                  >
                                    <i className="fa fa-edit me-1"></i> Edit
                                  </Link>
                                </Grid> : <></>
                          }
                        </Grid>

                        {
                          calendar[0] && calendar[1] &&
                          <Fragment>
                            <Grid container spacing={{ xl: 2, lg: 2, md: 2, sm: 0 }} className='disabled' sx={{ opacity: isHide ? 0.2 : 1, pointerEvents: isHide ? 'none' : 'auto' }}>
                              {/* time selec */}
                              <Grid item lg={3} md={4} sm={12} xs={12}>

                                <div className='form-group'>
                                  <FormControl fullWidth >
                                    <InputLabel size='small' htmlFor={`${timeSlot[calendar[0].format('DDMMYYYY')]} ${calendar[0]} ${calendar[1]}`} >Timing Slot Duration</InputLabel>

                                    <Select
                                      inputProps={{
                                        name: `${timeSlot[calendar[0].format('DDMMYYYY')]} ${calendar[0]} ${calendar[1]}`,
                                        id: `${timeSlot[calendar[0].format('DDMMYYYY')]} ${calendar[0]} ${calendar[1]}`,
                                      }}
                                      labelId={`${timeSlot[calendar[0].format('DDMMYYYY')]} ${calendar[0]} ${calendar[1]}`}
                                      variant='outlined'
                                      value={timeSlot[calendar[0].format('DDMMYYYY')] ? `${timeSlot[calendar[0].format('DDMMYYYY')]}` : `60`}
                                      label="Timing SlotDur"
                                      size='small'
                                      onChange={(e: SelectChangeEvent) => {
                                        timeSlotChange(e, stateKey)
                                      }}
                                    >
                                      <MenuItem value={15} >15 mins</MenuItem>
                                      <MenuItem value={30} >30 mins</MenuItem>
                                      <MenuItem value={45} >45 mins</MenuItem>
                                      <MenuItem value={60} >60 mins</MenuItem>
                                    </Select>
                                  </FormControl>
                                </div>

                              </Grid>
                              <Grid item lg={9} md={8} sm={12} xs={12} sx={{ display: 'flex', mt: { lg: -1 }, flexDirection: { xl: 'row', lg: 'row', md: 'row', sm: 'row', xs: 'column' } }}>
                                <Stack sx={{ width: '-webkit-fill-available', }} direction={widthOnlyXs ? 'row' : 'column'}>

                                  <FormControlLabel
                                    id={`${morningCheck[stateKey]} ${calendar[0]} ${calendar[1]}`}
                                    control={
                                      <Checkbox
                                        name={`${morningCheck[stateKey]} ${calendar[0]} ${calendar[1]}`}
                                        checked={morningCheck[stateKey]}
                                        onChange={(e: any) => {
                                          setMorningCheck((prevState) => ({ ...prevState, [stateKey]: e.target.checked }))
                                        }} />}
                                    label="Morning"
                                    sx={{
                                      color: (theme) => theme.palette.text.color,
                                      "& .MuiFormControlLabel-label": {
                                        fontSize: { xl: '18px !important', lg: '16px !important', md: `14px !important` }
                                      },
                                      "& .MuiButtonBase-root": {
                                        pl: { xl: "9px", lg: '9px', md: `0px` },
                                        pr: { xl: "9px", lg: '9px', md: `0px` }
                                      }
                                    }} />
                                  <small style={{ marginTop: widthOnlyXs ? 14 : -10, marginLeft: widthOnlyXs ? 'auto' : 'unset', }}>{
                                    dayjs(morningStart).minute(0).format('HH:mm')} to
                                    {dayjs(morningFinish).minute(0).format('HH:mm')}</small>
                                </Stack>
                                <Stack sx={{ width: '-webkit-fill-available' }} direction={widthOnlyXs ? 'row' : 'column'}>
                                  <FormControlLabel
                                    name={`${afterNoonCheck[stateKey]} ${calendar[0]} ${calendar[1]}`}
                                    control={
                                      <Checkbox
                                        name={`${afterNoonCheck[stateKey]} ${calendar[0]} ${calendar[1]}`}
                                        checked={afterNoonCheck[stateKey]}
                                        onChange={(e: any) => {
                                          setAfterNoonCheck((prevState) => ({ ...prevState, [stateKey]: e.target.checked }))
                                        }} />
                                    }
                                    label="Afternoon" sx={{
                                      color: (theme) => theme.palette.text.color,
                                      "& .MuiFormControlLabel-label": {
                                        fontSize: { xl: '18px !important', lg: '16px !important', md: `14px !important` }
                                      },
                                      "& .MuiButtonBase-root": {
                                        pl: { xl: "9px", lg: '9px', md: `0px` },
                                        pr: { xl: "9px", lg: '9px', md: `0px` }
                                      }
                                    }} />
                                  <small style={{ marginTop: widthOnlyXs ? 14 : -10, marginLeft: widthOnlyXs ? 'auto' : 'unset', }}>{dayjs(afterNoonStart).minute(0).format('HH:mm')} to {dayjs(afterNoonFinish).minute(0).format('HH:mm')}</small>
                                </Stack>
                                <Stack sx={{ width: '-webkit-fill-available' }} direction={widthOnlyXs ? 'row' : 'column'}>
                                  <FormControlLabel
                                    name={`${eveningCheck[stateKey]} ${calendar[0]} ${calendar[1]}`}
                                    control={
                                      <Checkbox
                                        id={`${eveningCheck[stateKey]} ${calendar[0]} ${calendar[1]}`}
                                        checked={eveningCheck[stateKey]}
                                        onChange={(e: any) => {
                                          setEveningCheck((prevState) => ({ ...prevState, [stateKey]: e.target.checked }))
                                        }} />}
                                    label="Evening"
                                    sx={{
                                      color: (theme) => theme.palette.text.color,
                                      "& .MuiFormControlLabel-label": {
                                        fontSize: { xl: '18px !important', lg: '16px !important', md: `14px !important` }
                                      },
                                      "& .MuiButtonBase-root": {
                                        pl: { xl: "9px", lg: '9px', md: `0px` },
                                        pr: { xl: "9px", lg: '9px', md: `0px` }
                                      }
                                    }} />
                                  <small style={{ marginTop: widthOnlyXs ? 14 : -10, marginLeft: widthOnlyXs ? 'auto' : 'unset', }}>{dayjs(eveningStart).minute(0).format('HH:mm')} to {dayjs(eveningFinish).minute(0).format('HH:mm')}</small>
                                </Stack>
                              </Grid>
                            </Grid>
                          </Fragment>
                        }
                      </Grid>
                    }
                  </div>
                )
              })
          }
        </div>
      </div>
    )
  }

  const deSelectFunc = () => {
    if (doctorAvailableTimeSlot == null) {
      setCalendarValue(undefined)
    } else {
      if (doctorAvailableTimeSlot.availableSlots.length == 0) {
        setCalendarValue(undefined)
      } else {
        // console.log({ doctorAvailableTimeSlot })
      }

    }
  }
  const todayFunc = () => {
    setCalendarValue((prevState: any) => {
      if (prevState) {
        let isdayBetween: boolean[] = []
        prevState.map((a: any) => {
          typeof a !== 'undefined' && isdayBetween.push(dayjs().isBetween(dayjs(a[0]).format(''), dayjs(a[1]).format(''), 'day', "[]"))
        })
        if (isdayBetween.every((a) => !a)) {
          prevState = [...prevState, [new DateObject()]]
        }

      } else {
        prevState = [[new DateObject()]]
      }
      return prevState
    })
  }


  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setTabIndex(index);
  };

  const calendarOnChange = (dateObject: any[] | null,) => {
    if (dateObject) {
      //Update time slot from db data
      dateObject.forEach((value: DateObject[], index: number, array: DateObject[]) => {
        setTimeSlot((prevState: { [key: string]: number }) => {
          let newState: { [key: string]: number } = prevState
          newState[dayjs(value[0] as any).format('DDMMYYYY') as string] = 60
          return { ...newState }
        })
      })
      if (!calendarValue) {
        setCalendarValue(dateObject)
      } else {
        let dataArray = calendarValue.toString().split(',')
        const rec = Array.from(
          { length: dataArray.length / 2 },
          (_, i) => ({ start: dataArray[2 * i] == '' ? undefined : dataArray[2 * i], finish: dataArray[2 * i + 1] == '' ? undefined : dataArray[2 * i + 1] }));

        if (rec.length == 0) {
          setCalendarValue(dateObject)
        } else {
          let numberOfPeriviousRecord = rec.length
          if (dateObject[numberOfPeriviousRecord]) {
            let startSelect = dateObject[numberOfPeriviousRecord].length == 1
            if (startSelect) {
              setCalendarValue(dateObject)
            } else {
              setCalendarValue(dateObject)
            }
          }

          return false
        }
      }
    }
  }

  const calendarMapDays = (params: any) => {
    const { date, isSameDate }: { date: any, selectedDate: any[], isSameDate: Function } = params;
    let props = {} as any
    let isWeekend = [0, 6].includes(date.weekDay.index)
    if (isWeekend) {
      props.style = { color: 'red' }
    }
    if (calendarValue) {
      calendarValue.forEach((elem: any[], index: number) => {
        if (elem && elem.length == 2 && elem[0] && elem[1]) {
          if (dayjs(date).isBetween(dayjs(elem[0].toString()).format(''), dayjs(elem[1].toString()).format(''), 'day', "[]")) {
            if (isSameDate(date, elem[0])) {
              props['aria-controls'] = 'start'
            }
            if (isSameDate(date, elem[1])) {

              props['aria-controls'] = 'end'
            }
            props.onClick = () => {
              toast.error('Selected day can\'t select again please remove period. ', {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                transition: bounce,
                onClose: () => { }
              });
              return false;
            }
            props.disabled = true;
          }
        }
      })
    }
    return { ...props }

  }


  const calendarComponent = () => {
    return (
      <div className="schedule-header" >
        <div className="schedule-nav">
          <Calendar
            multiple
            range
            numberOfMonths={widthOnlyXl ? 4 : widthOnlyLg ? 3 : minWidth767max991 ? 1 : widthOnlySm ? 2 : widthOnlyXs ? 1 : 2}
            value={calendarValue}
            onChange={calendarOnChange}
            format='DD MMM YYYY'
            rangeHover
            className={theme.palette.mode == 'dark' ? 'bg-dark yellow' : 'bg-light  yellow'}
            mapDays={calendarMapDays}
            plugins={[
              // eslint-disable-next-line react/jsx-key
              <PeriodPlugin position="bottom" />,
            ]}
          >
            <Grid container className="submit-section" sx={{ padding: 1 }} spacing={1}>
              <Grid item lg={6} xs={6}>
                <Button fullWidth className="btn btn-primary submit-btn"
                  disabled={doctorAvailableTimeSlot !== null && doctorAvailableTimeSlot.availableSlots.length > 0}
                  onClick={deSelectFunc}  >DESELECT</Button>
              </Grid>
              <Grid item lg={6} xs={6}>
                <Button fullWidth className="btn btn-primary submit-btn"
                  onClick={todayFunc}  >TODAY</Button>
              </Grid>
            </Grid>
          </Calendar>
        </div>
      </div>
    )
  }

  const LoadingCompoenent = () => (
    <CircleToBlockLoading color={theme.palette.primary.main} size="small"
      style={{
        minWidth: '100%',
        display: 'flex',
        justifyContent: 'center',
      }} />
  )

  const deleteSlotArray = (slot: AvailableType, slotIndex: number) => {
    if (doctorAvailableTimeSlot !== null && doctorAvailableTimeSlot.availableSlots.length !== 0) {

      let isNohaveReserve =
        slot.morning.every((a) => !a.isReserved) &&
        slot.afternoon.every((a) => !a.isReserved) &&
        slot.evening.every((a) => !a.isReserved)
      if (isNohaveReserve) {
        let filterdAvalilableSlot = doctorAvailableTimeSlot.availableSlots.filter((a, i) => i !== slotIndex)
        doctorAvailableTimeSlot.availableSlots = [...filterdAvalilableSlot]
        doctorAvailableTimeSlot._id = doctorAvailableTimeSlot._id;
        let keyState = dayjs(slot.startDate).format("DDMMYYYY")
        setDoctorAvailableTimeSlot({ ...doctorAvailableTimeSlot })
        fixMultipleState(slotIndex, keyState)
        toast.dismiss(`${slotIndex}`)
      } else {
        alert('This time slot has reservation and can\'t be delete.')
      }
    }
  }


  const TabsButtonsCompoenent = () => {
    return (
      <>
        {
          doctorAvailableTimeSlot !== null &&
          doctorAvailableTimeSlot.availableSlots.length > 0 &&
          <div className="schedule-header" >
            <div className="schedule-nav">
              {
                <AppBar position="static">
                  <Tabs
                    value={tabIndex}
                    onChange={handleChangeTab}
                    indicatorColor="secondary"
                    textColor="inherit"
                    variant={doctorAvailableTimeSlot.availableSlots.length <= 2 ? 'fullWidth' : "scrollable"}
                  >
                    {
                      doctorAvailableTimeSlot !== null &&
                      doctorAvailableTimeSlot.availableSlots.length > 0 &&
                      doctorAvailableTimeSlot.availableSlots
                        .sort((a: AvailableType, b: AvailableType) => dayjs(a.startDate).isBefore(b.startDate) ? -1 : 1)
                        .map((slot: AvailableType, index) => {
                          return (
                            <Tab
                              key={index}
                              label={`From: ${dayjs(slot.startDate).format('DD MMM YYYY')} to ${dayjs(slot.finishDate).format('DD MMM YYYY')}`}
                              // wrapped
                              id={`full-width-tab-${index}`}
                              aria-controls={`full-width-tabpanel-${index}`}
                              iconPosition='end'
                              icon={<CloseIcon sx={{ color: 'secondary.main' }} fontSize="small"
                                onClick={() => {
                                  if (index === tabIndex) {
                                    toast.error(() => (
                                      <div style={muiVar}>
                                        <Typography align='center' >Are you sure to delete this whole time slot?</Typography>
                                        <br />
                                        <div style={{ display: 'flex', gap: 5 }}>
                                          <Button
                                            className="btnDelete btn-primary submit-btn"
                                            onClick={() => { deleteSlotArray(slot, index) }}
                                            variant='contained'
                                            fullWidth
                                            size='small'
                                            sx={{ bgcolor: "primary.main" }}>
                                            Delete
                                          </Button>
                                          <Button
                                            fullWidth
                                            onClick={() => { toast.dismiss(`${index}`) }}
                                            variant='contained'
                                            className="btn btn-primary submit-btn"
                                            sx={{
                                              bgcolor: "secondary.main",
                                              "&:hover": {
                                                bgcolor: 'secondary.dark'
                                              }
                                            }}>Cancel</Button>
                                        </div>
                                      </div>
                                    ), {
                                      position: "bottom-center",
                                      toastId: `${index}`,
                                      autoClose: false,
                                      hideProgressBar: false,
                                      closeOnClick: false,
                                      pauseOnHover: false,
                                      draggable: false,
                                      progress: undefined,
                                      transition: bounce,
                                      closeButton: false,
                                      icon: false,
                                      onClose: () => { }
                                    });
                                  }
                                }} />
                              }
                            />
                          )
                        })
                    }
                  </Tabs>
                </AppBar>
              }
            </div>
          </div>
        }
      </>
    )
  }

  const deleteSingleSlot = (time: TimeType, entrie: any[], slotIndex: number, indexOfperiod: number) => {
    if (time.isReserved || time.reservations.length !== 0) {
      toast.error('This Time slot has booking already and can\'t be delete.', {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        transition: bounce,
        onClose: () => { }
      });
    } else {
      if (doctorAvailableTimeSlot !== null) {
        let oldAvalilableSlot = doctorAvailableTimeSlot.availableSlots[slotIndex]
        let dayPeriod = entrie[0]
        let dayTimeSlot = entrie[1]
        let oldDayTimeSlot = dayTimeSlot[indexOfperiod]
        let newDayTimeSlot = { ...oldDayTimeSlot, active: false }

        const newAvailableSlot = { ...oldAvalilableSlot, [dayPeriod]: [...dayTimeSlot.slice(0, indexOfperiod), newDayTimeSlot, ...dayTimeSlot.slice(indexOfperiod + 1)] }

        const newAvailableTimeSlot = [
          ...doctorAvailableTimeSlot.availableSlots.slice(0, slotIndex),
          newAvailableSlot,
          ...doctorAvailableTimeSlot.availableSlots.slice(slotIndex + 1)
        ]
        doctorAvailableTimeSlot.availableSlots = [...newAvailableTimeSlot]
        setDoctorAvailableTimeSlot({ ...doctorAvailableTimeSlot })
        //Update exist on change 
        let allSlotStatus = [...newAvailableTimeSlot[slotIndex].morning.map((a) => a.active), ...newAvailableTimeSlot[slotIndex].afternoon.map((a) => a.active), ...newAvailableTimeSlot[slotIndex].evening.map((a) => a.active)]
        //If all period delete active again the selecting slot
        setIsPeriodExist((prevState: { [key: number]: boolean }) => {
          if (allSlotStatus.every((a) => !a)) {
            return {
              ...prevState,
              [slotIndex]: false
            }
          } else {
            return {
              ...prevState,
              [slotIndex]: true
            }
          }
        })
      }
    }
  }

  const slotSwipeable = () => {
    return (
      <div className="tab-content schedule-cont">
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={tabIndex}
          onChangeIndex={handleChangeIndex}
          style={{ textAlign: 'center' }}
        >
          {
            doctorAvailableTimeSlot !== null ?
              doctorAvailableTimeSlot.availableSlots.length == 0 ? <></> :
                doctorAvailableTimeSlot.availableSlots.length !== 0 &&
                doctorAvailableTimeSlot.availableSlots
                  .sort((a: AvailableType, b: AvailableType) => dayjs(a.startDate).isBefore(b.startDate) ? -1 : 1)
                  .map((slot: AvailableType, slotIndex: number) => {
                    return (
                      <TabPanel key={slotIndex} value={tabIndex} index={slotIndex} dir={theme.direction}>
                        <Fragment>
                          <Typography variant='h4'
                            sx={{
                              fontSize: { xl: '18px !important', lg: '16px !important', md: `16px !important`, sm: `17px !important`, xs: `14px !important` }
                            }}
                            className="card-title d-flex justify-content-between">
                            <span>
                              <span style={{ display: 'flex' }}>Time Slots: </span><br />
                              <span style={{ display: 'flex' }}>From: {dayjs(slot.startDate).format('DD MMM YYYY')}
                                To: {dayjs(slot.finishDate).format('DD MMM YYYY')}
                              </span>
                            </span>
                            <Link
                              className="edit-link"
                              href=""
                              onClick={(e) => {
                                e.preventDefault()
                                editSlotClick(dayjs(slot.startDate).format(''), dayjs(slot.finishDate).format(''))
                              }}
                            >
                              <i className="fa fa-edit me-1"></i> Edit
                            </Link>
                          </Typography>

                          <>
                            {
                              Object.entries(slot).map((entrie, entriesIndex) => {
                                let smallText = entrie[0] == 'morning' ?
                                  `${dayjs(morningStart).minute(0).format('HH:mm')} to ${dayjs(morningFinish).minute(0).format('HH:mm')}` :
                                  entrie[0] == 'afternoon' ?
                                    `${dayjs(afterNoonStart).minute(0).format('HH:mm')} to ${dayjs(afterNoonFinish).minute(0).format('HH:mm')}` :
                                    `${dayjs(eveningStart).minute(0).format('HH:mm')} to ${dayjs(eveningFinish).minute(0).format('HH:mm')}`
                                let slotTimeKey: 'morning' | 'afternoon' | 'evening' | undefined
                                if (Array.isArray(entrie[1])) {
                                  slotTimeKey = entrie[0] as 'morning' | 'afternoon' | 'evening'
                                }
                                if (Array.isArray(entrie[1]) && entrie[1].length > 0 && entrie[1].some((a: TimeType) => a.active)) {
                                  return (
                                    <Fragment key={entriesIndex.toString() + slotIndex.toString()}>
                                      {
                                        <Divider variant="middle" sx={{ m: 2 }}>
                                          <Typography variant="body1">
                                            {entrie[0].charAt(0).toUpperCase()}{entrie[0].slice(1)}<br />
                                            <small style={{ marginTop: -10 }}>{smallText}</small>
                                          </Typography>
                                        </Divider>
                                      }
                                      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                        {
                                          entrie[1].map((time: TimeType, timeIndex: number) => {
                                            return (
                                              <Fragment key={timeIndex.toString() + entriesIndex.toString() + slotIndex.toString()}>
                                                {time.active &&
                                                  <Tooltip arrow title={
                                                    time.reservations?.length > 0 ?
                                                      <Fragment>
                                                        {
                                                          time.reservations.map((res: AppointmentReservationType, resIndex: number) => {
                                                            return (
                                                              <Stack key={timeIndex.toString() + entriesIndex.toString() + slotIndex.toString() + resIndex.toString() + res._id}>
                                                                <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{res.selectedDate}</span>
                                                                <span className="d-block" >{res.timeSlot?.period}</span>
                                                                <Divider />
                                                              </Stack>
                                                            )
                                                          })
                                                        }
                                                      </Fragment> :
                                                      ""} followCursor>
                                                    <div
                                                      className="doc-slot-list" onClick={() => {
                                                        if (time.reservations?.length > 0) {
                                                        }
                                                      }}>
                                                      {time.period}
                                                      <Link href=""
                                                        onClick={(e) => {
                                                          e.preventDefault();
                                                          deleteSingleSlot(time, entrie, slotIndex, timeIndex)
                                                        }} >
                                                        <i className="fa fa-times"></i>
                                                      </Link>
                                                    </div>
                                                  </Tooltip>
                                                }
                                              </Fragment>
                                            )
                                          })
                                        }
                                      </div>
                                    </Fragment>
                                  )
                                }
                              })
                            }
                          </>
                        </Fragment>
                      </TabPanel>
                    )
                  }) :
              <>
                <Typography component='a' >You need to add at least one schedule timing to appear in search result.</Typography>
              </>
          }
        </SwipeableViews>
      </div>
    )
  }

  const selectAllClick = (period: string) => {
    let newSlot: AvailableType = { ...editDaySlot! }
    let periodArray = newSlot[period as keyof typeof newSlot]! as TimeType[]
    if (periodArray.every((a: TimeType) => a.active)) {
      periodArray.map((a: TimeType) => a.active = false)
    } else {
      periodArray.map((a: TimeType) => a.active = true)
    }
    setEditDaySlot({ ...newSlot })
  }


  const SelectCheckBox = ({ period }: { period: 'morning' | 'afternoon' | 'evening' }) => {
    let periodArray = editDaySlot![period as keyof typeof editDaySlot]! as TimeType[]
    let capitalPeriod: string = `${period.charAt(0).toUpperCase()}${period.slice(1)}`
    let selectFunction = period == 'morning' ? selectMoringSlot : period == 'afternoon' ? selectAfternoonSlot : selectEveningSlot;
    return (
      <>
        {
          periodArray.length > 0 &&
          <Fragment>
            <Divider>{capitalPeriod} </Divider>
            <FormControlLabel control={<Checkbox checked={periodArray.every(a => a.active)}
              onChange={() => selectAllClick(period)} />}
              label={periodArray.every(a => a.active) ? `Deselect all ${capitalPeriod}` : `Select all ${capitalPeriod}`}
              sx={{
                color: (theme) => theme.palette.text.color,
                "& .MuiFormControlLabel-label": {
                  fontSize: { xl: '18px !important', lg: '16px !important', md: `16px !important`, sm: `17px !important`, xs: `14px !important` }
                },
                "& .MuiButtonBase-root": {
                  pl: { xl: "9px", lg: '9px', md: `9px`, xs: '0px' },
                  pr: { xl: "9px", lg: '9px', md: `9px`, xs: '0px' }
                }
              }}
            />
            <Grid container >
              <div className="row form-row">
                {
                  periodArray.map((e, i) => {
                    return (
                      <Grid item xl={4} lg={4} md={4} sm={4} xs={6} key={i} >
                        <FormControlLabel
                          control={<Checkbox checked={e.active} onChange={(e: any) => {
                            selectFunction(e, i)
                          }} />}
                          label={e.period}
                          sx={{
                            color: (theme) => theme.palette.text.color,
                            "& .MuiFormControlLabel-label": {
                              fontSize: { xl: '18px !important', lg: '16px !important', md: `16px !important`, sm: `17px !important`, xs: `14px !important` }
                            },
                            "& .MuiButtonBase-root": {
                              pl: { xl: "9px", lg: '9px', md: `9px`, xs: '0px' },
                              pr: { xl: "9px", lg: '9px', md: `9px`, xs: '0px' }
                            }
                          }} />
                      </Grid>
                    )
                  })
                }
              </div>
            </Grid>
          </Fragment>
        }
      </>
    )
  }

  const DialogButton = () => {
    return (
      <button type="submit" className="submitButton w-100" onClick={(e) => {
        e.preventDefault();
        document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
        setTimeout(() => {
          setShowDialog(false)
          setDoctorAvailableTimeSlot((prevState: DoctorsTimeSlotType | null) => {
            if (prevState == null) {
              prevState = {
                _id: '',
                doctorId: userProfile?._id as string,
                createDate: new Date(),
                updateDate: new Date(),
                availableSlots: []
              }
            }
            let indexOfStartDate = prevState.availableSlots.findIndex((s: AvailableType) => dayjs(s.startDate).isSame(editDaySlot!.startDate))
            let indexOfFinishDate = prevState.availableSlots.findIndex((s: AvailableType) => dayjs(s.finishDate).isSame(editDaySlot!.finishDate))
            if (indexOfStartDate !== -1 && indexOfFinishDate !== -1) {
              prevState.availableSlots[indexOfStartDate]['morning'] = [...editDaySlot!.morning]
              prevState.availableSlots[indexOfStartDate]['afternoon'] = [...editDaySlot!.afternoon]
              prevState.availableSlots[indexOfStartDate]['evening'] = [...editDaySlot!.evening]
              // prevState.availableSlots[indexOfStartDate] = { ...editDaySlot! }
            } else {
              prevState?.availableSlots.push({ ...editDaySlot! })
            }
            return { ...prevState }
          })
          setIsPeriodExist((prevState: { [key: string]: boolean }) => {
            let haveMorning = editDaySlot!.morning.length == 0 ? false : editDaySlot!.morning.some((a) => a.active)
            let haveAfternoon = editDaySlot!.afternoon.length == 0 ? false : editDaySlot!.afternoon.some((a) => a.active)
            let haveEvening = editDaySlot!.evening.length == 0 ? false : editDaySlot!.evening.some((a) => a.active)
            let stateKey = dayjs(editDaySlot?.startDate).format('DDMMYYYY')
            if (haveMorning || haveAfternoon || haveEvening) {
              return {
                ...prevState,
                [stateKey as string]: true
              }
            } else {
              return {
                ...prevState,
                [stateKey as string]: false
              }
            }
          })
          setEditDaySlot(null)
        }, 500);
      }}>
        {
          doctorAvailableTimeSlot !== null ?
            doctorAvailableTimeSlot.availableSlots.findIndex((s: AvailableType) => dayjs(s.startDate).isSame(dayjs(editDaySlot!.startDate))) == -1
              ? `Save Changes`
              : `Update Changes`
            : `Save Changes`}
      </button>
    )
  }

  const dialogCompoenent = () => {
    if (showDialog && editDaySlot !== null) {
      return (
        <BootstrapDialog
          TransitionComponent={Transition}
          onClose={(event: object, reason: string) => {
            if (reason !== 'backdropClick') {
              document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
              setTimeout(() => {
                setShowDialog(false)
              }, 500);
            }
          }}
          aria-labelledby="edit_invoice_details"
          open={showDialog}
        >
          <BootstrapDialogTitle
            id="edit_invoice_details" onClose={() => {
              document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
              setTimeout(() => {
                setShowDialog(false)
                setEditDaySlot(null)
              }, 500);
            }}>
            <Typography sx={{ fontSize: { xl: '18px', lg: '17px', md: '17px', xs: '14px' }, }}>
              From: {dayjs(editDaySlot?.startDate).format('DD MMM YYYY')}
            </Typography>
            <Typography sx={{ padding: '0px 10px', marginTop: 0, }}>-</Typography>
            <Typography sx={{ fontSize: { xl: '18px', lg: '17px', md: '17px', xs: '14px' }, }}>
              To: {dayjs(editDaySlot?.finishDate).format('DD MMM YYYY')}
            </Typography>
          </BootstrapDialogTitle>
          <DialogContent dividers >
            <form>
              {/* appy to all */}
              <div className="hours-info" style={muiVar}>
                <div className="">
                  <SelectCheckBox period='morning' />
                  <SelectCheckBox period='afternoon' />
                  <SelectCheckBox period='evening' />
                </div>
              </div>

              <div className="add-more mb-3" > </div>
              <div className="submit-section text-center">
                <DialogButton />
              </div>
            </form>
          </DialogContent>
        </BootstrapDialog>

      )
    }
  }

  const saveTodb = () => {
    if (userProfile) {
      dispatch(updateHomeFormSubmit(true))
      homeSocket.current.emit('createDoctorsTimeslots', doctorAvailableTimeSlot)
      homeSocket.current.once('createDoctorsTimeslotsReturn', (msg: { status: number, message?: string, doctorAvailableTimeSlot?: DoctorsTimeSlotType }) => {
        const { status, message, doctorAvailableTimeSlot: newDoctorRecord } = msg;
        if (status !== 200) {
          toast.error(message, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            toastId: 'save-error',
            progress: undefined,
            transition: bounce,
            onClose: () => {
              dispatch(updateHomeFormSubmit(false))
            }
          });
        } else {
          toast.info("time slot created successfully", {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            toastId: 'save-info',
            draggable: true,
            progress: undefined,
            transition: bounce,
            onClose: () => {
              dispatch(updateHomeFormSubmit(false))
              console.log('first')
              router.push({ pathname: router.asPath }, undefined, { scroll: false, shallow: true })
              if (newDoctorRecord) {
                setDoctorAvailableTimeSlot({ ...newDoctorRecord })
              }
            }
          });
        }
      })
    }
  }

  const updateDb = () => {
    if (userProfile) {
      dispatch(updateHomeFormSubmit(true))
      homeSocket.current.emit('updateDoctorsTimeslots', doctorAvailableTimeSlot)
      homeSocket.current.once('updateDoctorsTimeslotsReturn', (msg: { status: number, message?: string, doctorAvailableTimeSlot?: DoctorsTimeSlotType }) => {
        const { status, message, doctorAvailableTimeSlot: updateDoctor } = msg;
        if (status !== 200) {
          toast.error(message, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            toastId: 'update-error',
            draggable: true,
            progress: undefined,
            transition: bounce,
            onClose: () => {
              dispatch(updateHomeFormSubmit(false))
            }
          });
        } else {
          toast.info("time slot updated successfully", {
            position: "bottom-center",
            autoClose: 5000,
            toastId: 'update-info',
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: bounce,
            onClose: () => {
              dispatch(updateHomeFormSubmit(false))
              router.push({ pathname: router.asPath }, undefined, { scroll: false, shallow: true })
              // if (updateDoctor) {
              //   setDoctorAvailableTimeSlot({ ...updateDoctor })
              // }
            }
          });

        }
      })
    }
  }

  const deleteDb = () => {
    if (userProfile) {
      dispatch(updateHomeFormSubmit(true))
      homeSocket.current.emit('deleteDoctorsTimeslots', doctorAvailableTimeSlot)
      homeSocket.current.once('deleteDoctorsTimeslotsReturn', (msg: { status: number, message?: string }) => {
        const { status, message } = msg;
        if (status !== 200) {
          toast.error(message, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            toastId: 'delete-error',
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: bounce,
            onClose: () => {
              // toast.dismiss()
              dispatch(updateHomeFormSubmit(false))
            }
          });
        } else {
          toast.info(
            message ?
              message : message !== null ?
                message : "time slot deleted successfully", {
            position: "bottom-center",
            toastId: 'delete-info',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: bounce,
            onClose: () => {
              dispatch(updateHomeFormSubmit(false))
              setDoctorAvailableTimeSlot(null)
              setCalendarValue(undefined)
              setIsPeriodExist({})
              setTimeSlot({})
              setMorningCheck({})
              setAfterNoonCheck({})
              setEveningCheck({})
              router.push({ pathname: router.asPath }, undefined, { scroll: false, shallow: true })
            }
          });

        }
      })
    }
  }

  const getConfirmDb = () => {

    toast.error(() => (
      <div style={muiVar}>
        <Typography align='center' >Are you sure to delete this whole time slot?</Typography>
        <br />
        <div style={{ display: 'flex', gap: 5 }}>
          <Button
            className="btnDelete btn-primary submit-btn"
            onClick={() => {
              deleteDb()
              toast.dismiss("delete-confirm")
            }}
            variant='contained'
            fullWidth
            size='small'
            sx={{ bgcolor: "primary.main" }}>
            Delete
          </Button>
          <Button
            fullWidth
            onClick={() => {
              toast.dismiss("delete-confirm")
            }}
            variant='contained'
            className="btn btn-primary submit-btn"
            sx={{
              bgcolor: "secondary.main",
              "&:hover": {
                bgcolor: 'secondary.dark'
              }
            }}>Cancel</Button>
        </div>
      </div>
    ), {
      position: "bottom-center",
      toastId: "delete-confirm",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      transition: bounce,
      closeButton: false,
      icon: false,
      onClose: () => { }
    });

  }

  const reservationsComponent = () => {
    const columns: GridColDef[] = [
      {
        field: 'startDate',
        headerName: 'From - To Period',
        width: 250,
        flex: 1,
        align: 'center',
        headerAlign: 'center',
        valueFormatter(params: GridValueFormatterParams) {
          const { id, api } = params
          return `From: ${api.getCellValue(id as string, 'startDate')} To: ${api.getCellValue(id as string, 'finishDate')}`
        },
      },
      {
        field: 'dayPeriod',
        headerName: 'Day time',
        width: 90,
        align: 'center',
        headerAlign: 'center',
        valueGetter(params: GridRenderCellParams) {
          const { value } = params
          return value.charAt(0).toUpperCase() + value.slice(1)
        }
      },
      {
        field: 'selectedDate',
        headerName: `Apointment Time`,
        align: 'center',
        width: 150,
        headerAlign: 'center',
        renderCell: (params) => {
          return (
            <Stack >
              <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{params?.row?.selectedDate}</span>
              <span className="d-block" >{params?.row?.timeSlot?.period}</span>
            </Stack>
          )
        }

      },
      {
        field: 'patientProfile',
        headerName: `Patient Name`,
        width: 210,
        flex: 1,
        align: 'center',
        headerAlign: 'center',
        valueFormatter(params: GridValueFormatterParams) {
          const { value } = params
          return `${value.gender} ${value?.firstName} ${value?.lastName}`
        },
        renderCell: (params: GridRenderCellParams) => {
          const { row, formattedValue } = params;
          const profileImage = row?.patientProfile?.profileImage == '' ? patient_profile : row?.patientProfile?.profileImage
          const online = row?.patientStatus?.online || false;
          return (
            <>
              <Link className="avatar mx-2" href="" onClick={(e) => e.preventDefault()}>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  online={online}
                >
                  <Avatar alt="" src={`${profileImage}?random=${new Date().getTime()}`} >
                    <img src={patient_profile} alt="" className="avatar avatar-in-schedule-table" />
                  </Avatar>
                </StyledBadge>
              </Link>
              <Link href={`/dashboard/doctor/${btoa(row._id)}`}
                onClick={(e) => e.preventDefault()}
                style={{ color: theme.palette.secondary.main, maxWidth: '70%', minWidth: '70%' }}>
                {formattedValue}
              </Link>
            </>
          )
        }
      },
      {
        field: 'paymentType',
        headerName: `Payment status`,
        width: 120,
        // flex: 1,
        align: 'center',
        headerAlign: 'center',
        renderCell: (data: any) => {
          const { row } = data;
          return (
            <>
              <Chip
                color={row.paymentType == '' ? 'success' : 'secondary'}
                label={'paid'}
                size="small"
                sx={{ color: theme.palette.primary.contrastText }} />
            </>
          )
        }
      },
    ]

    return (
      <Fragment>
        {
          doctorAvailableTimeSlot?.reservations &&
            doctorAvailableTimeSlot?.reservations.length > 0 ?
            <div className="tab-content schedule-cont">
              <Box
                sx={{
                  height: 'auto',
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  mb: 2,
                  mt: 2,
                  boxShadow: 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px',

                  transition: 'all 1s linear',
                }}>
                <Typography variant='h5' align='center' gutterBottom>Total: {userProfile?.reservations_id.length} reservations</Typography>

                <DataGrid
                  autoHeight
                  hideFooter
                  getRowId={(params) => params._id}
                  rowHeight={screen.height / 15.2}
                  rows={rows}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },
                  }}
                  pageSizeOptions={[5]}
                  showCellVerticalBorder
                  showColumnVerticalBorder
                  slots={{
                    // toolbar: CustomToolbar,
                    noResultsOverlay: CustomNoRowsOverlay,
                    noRowsOverlay: CustomNoRowsOverlay
                  }}
                  sx={{
                    ".MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel": {
                      "marginTop": "1em",
                      "marginBottom": "1em"
                    },
                    "&.MuiDataGrid-root .MuiDataGrid-row": {
                      backgroundColor:
                        false ? getSelectedBackgroundColor(
                          theme.palette.primary.dark,
                          theme.palette.mode,
                        ) : '',
                      '&:hover': {
                        backgroundColor: getSelectedHoverBackgroundColor(
                          theme.palette.primary.light,
                          theme.palette.mode,
                        ),
                      }
                    }
                  }}
                />
                <Pagination
                  showFirstButton
                  showLastButton
                  hideNextButton
                  hidePrevButton
                  boundaryCount={1}
                  variant="outlined"
                  color="secondary"
                  count={userProfile ? Math.ceil(userProfile?.reservations_id.length / perPage) : 0}
                  page={dataGridFilters.limit / perPage}
                  sx={{
                    justifyContent: 'center',
                    display: 'flex',
                    minHeight: 70
                  }}
                  onChange={handlePageChange}
                />
              </Box>
            </div> :
            <div className="tab-content schedule-cont">
              <Typography variant='h4' sx={{
                fontSize: { xl: '18px !important', lg: '16px !important', md: `16px !important`, sm: `17px !important`, xs: `14px !important` }
              }}
                className="card-title d-flex justify-content-between">
                <span >No Reservation made yet</span>
              </Typography>
            </div>
        }
      </Fragment>
    )
  }


  return (
    <Fragment>
      <div className="col-md-7 col-lg-8 col-xl-9" style={muiVar}>
        <div className="row">
          <div className="col-md-12">
            <div className="card schedule-widget mb-3">


              {isLoading ? <LoadingCompoenent /> : calendarComponent()}

              {
                isLoading ? <LoadingCompoenent /> : <TabsButtonsCompoenent />
              }
              {slotSwipeable()}
            </div>
            <div className="card schedule-widget mb-3">
              {reservationsComponent()}
            </div>
          </div>
        </div>
        {doctorAvailableTimeSlot !== null &&
          <Grid container className="submit-section" spacing={1}>
            <Grid item lg={doctorAvailableTimeSlot._id == '' ? 12 : 6}>
              <Button fullWidth className="btn btn-primary submit-btn" sx={{ mb: 2 }} onClick={() => {
                if (doctorAvailableTimeSlot._id == '') {
                  saveTodb()
                } else {
                  updateDb()
                }
              }}>
                {doctorAvailableTimeSlot._id == '' ? `Save` : 'Update'}
              </Button>

            </Grid>
            {
              doctorAvailableTimeSlot._id !== '' &&
              <Grid item lg={doctorAvailableTimeSlot._id == '' ? 12 : 6}>
                <Button fullWidth className="btnDelete btn-primary submit-btn" sx={{ mb: 2 }} onClick={getConfirmDb}>
                  Delete Whole Slots
                </Button>
              </Grid>
            }
          </Grid>
        }
      </div >
      {dialogCompoenent()}

    </Fragment >
  )
})

export default ScheduleTiming