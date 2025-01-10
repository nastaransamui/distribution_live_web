/* eslint-disable @next/next/no-img-element */

import { FC, Fragment, ReactNode, useEffect, useRef, useState } from 'react'

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
import { NumericFormat } from 'react-number-format'

//utilites
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

import _ from 'lodash'


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
import TextField from '@mui/material/TextField';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import CustomPagination from '../shared/CustomPagination';

export const formatNumberWithCommas = (number: string) => {
  // Check if the input is a valid number (or can be converted to one)
  const num = Number(number);
  if (isNaN(num)) {
    return number; // Return the original input if it's not a number
  }

  return num.toLocaleString();
}

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
  price: string;
  bookingsFee: string;
  bookingsFeePrice: string;
  total: string;
  currencySymbol: string;
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
  totalReservation?: number;
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
  const [rowCount, setRowCount] = useState<number>(0)
  const [editDaySlot, setEditDaySlot] = useState<AvailableType | null>(null)
  const [tabIndex, setTabIndex] = useState(0);
  const dispatch = useDispatch()
  const router = useRouter()
  const perPage = 5;
  const grdiRef = useRef<any>(null)
  const [dataGridFilters, setDataGridFilters] = useState({
    limit: perPage,
    skip: 0
  });

  const {
    handleSubmit,
    clearErrors,
    formState: { errors },
    control,
    setValue: setFormValue,
  } = useForm({})

  const { fields: morningFields, append: appendmorning, remove: removemorning, replace: replacemorning, update: updatemorning } = useFieldArray<any>({
    control,
    name: "morning"
  });
  const { fields: afternoonFields, append: appendafternoon, remove: removeafternoon, replace: replaceafternoon, update: updateafternoon } = useFieldArray<any>({
    control,
    name: "afternoon"
  });
  const { fields: eveningFields, append: appendevening, remove: removeevening, replace: replaceevening, update: updateevening } = useFieldArray<any>({
    control,
    name: "evening"
  });
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  const widthOnlyXl = useMediaQuery(theme.breakpoints.only('xl'));
  const widthOnlyLg = useMediaQuery(theme.breakpoints.only('lg'));
  const widthOnlySm = useMediaQuery(theme.breakpoints.only('sm'));
  const widthOnlyXs = useMediaQuery(theme.breakpoints.only('xs'));
  const minWidth767max991 = useMediaQuery('@media (min-width:767px) and (max-width: 991px)');

  useEffect(() => {
    loadStylesheet('/css/react-multi-date-picker-bg-dark.min.css');
  }, [])
  useEffect(() => {
    const fixAccessibility = () => {
      const dialog = document.querySelector('[role="dialog"]');
      if (dialog && !dialog.getAttribute("aria-label")) {
        dialog.setAttribute("aria-label", "Calendar");
      }
      // prohibited ARIA attributes
      const invalidElements = document.querySelectorAll(".rmdp-day[aria-label]");
      invalidElements.forEach((el) => {
        // Check if the element has invalid attributes
        if (el.classList.contains("rmdp-day-hidden")) {
          el.removeAttribute("aria-label");
        }
      });
    };

    // Run the patch after the component renders
    fixAccessibility();

    // Re-run if the dialog is re-rendered
    const observer = new MutationObserver(fixAccessibility);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);
  // useEffect(() => {
  //   if (searchParams.get('filters') !== null) {
  //     if (base64regex.test(searchParams.get('filters') as string)) {
  //       let filters = atob(searchParams.get('filters') as string)
  //       if (isJsonString(filters)) {
  //         setDataGridFilters(JSON.parse(filters))
  //       }
  //     }
  //   }
  // }, [searchParams])

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
              setRowCount(timeSlots[0].totalReservation!);
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
            }
          }
        } else {
          fixMultipleState(index, keyState)
        }
      } else {
        fixMultipleState(index, keyState)
      }
    } else {
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
                price: '',
                bookingsFee: userProfile?.bookingsFee!,
                bookingsFeePrice: '',
                total: '',
                currencySymbol: userProfile?.currency?.[0]?.currency!,
                reservations: []
              })
              appendmorning({
                period: `${dayjs().hour(9).minute(0).add(timeSlot[statesKey] * i, 'minute').format('HH:mm')} - ${dayjs().hour(9).minute(0).add(timeSlot[statesKey] * (i + 1), 'minute').format('HH:mm')}`,
                active: false,
                isReserved: false,
                price: '',
                bookingsFee: userProfile?.bookingsFee!,
                bookingsFeePrice: '',
                total: '',
                currencySymbol: userProfile?.currency?.[0]?.currency!,
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
                price: '',
                bookingsFee: userProfile?.bookingsFee!,
                bookingsFeePrice: '',
                total: '',
                currencySymbol: userProfile?.currency?.[0]?.currency!,
                reservations: []
              })
              appendafternoon({
                period: `${dayjs().hour(13).minute(0).add(timeSlot[statesKey] * i, 'minute').format('HH:mm')} - ${dayjs().hour(13).minute(0).add(timeSlot[statesKey] * (i + 1), 'minute').format('HH:mm')}`,
                active: false,
                isReserved: false,
                price: '',
                bookingsFee: userProfile?.bookingsFee!,
                bookingsFeePrice: '',
                total: '',
                currencySymbol: userProfile?.currency?.[0]?.currency!,
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
                price: '',
                bookingsFee: userProfile?.bookingsFee!,
                bookingsFeePrice: '',
                total: '',
                currencySymbol: userProfile?.currency?.[0]?.currency!,
                reservations: []
              })
              appendevening({
                period: `${dayjs().hour(17).minute(0).add(timeSlot[statesKey] * i, 'minute').format('HH:mm')} - ${dayjs().hour(17).minute(0).add(timeSlot[statesKey] * (i + 1), 'minute').format('HH:mm')}`,
                active: false,
                isReserved: false,
                price: '',
                bookingsFee: userProfile?.bookingsFee!,
                bookingsFeePrice: '',
                total: '',
                currencySymbol: userProfile?.currency?.[0]?.currency!,
                reservations: []
              })
            })
          }
          newState = initialState
        } else {

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

  const editSlotClick = (startDate: string, finishDate: string) => {

    if (doctorAvailableTimeSlot !== null) {
      let indexOfStartDate = doctorAvailableTimeSlot.availableSlots.findIndex((s: AvailableType) => dayjs(s.startDate).isSame(startDate))
      let indexOfFinishDate = doctorAvailableTimeSlot.availableSlots.findIndex((s: AvailableType) => dayjs(s.finishDate).isSame(finishDate))
      if (indexOfStartDate !== -1 && indexOfFinishDate !== -1) {
        setShowDialog(true)
        let editDay: AvailableType = _.cloneDeep(doctorAvailableTimeSlot.availableSlots[indexOfStartDate])
        if (editDay?.morning.length !== 0) {
          appendmorning([...editDay.morning])
        }
        if (editDay?.afternoon.length !== 0) {
          appendafternoon([...editDay.afternoon])
        }
        if (editDay?.evening.length !== 0) {
          appendevening([...editDay.evening])
        }
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
                            <Grid container spacing={{ xl: 2, lg: 2, md: 2, sm: 0 }} className='disabled' sx={{ pointerEvents: isHide ? 'none' : 'auto' }}>
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
                                      disabled={isHide}
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
                                        disabled={isHide}
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
                                        disabled={isHide}
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
                                        disabled={isHide}
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
              props['data-start'] = true;
            }
            if (isSameDate(date, elem[1])) {

              props['data-end'] = true;
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
            minDate={dayjs().toDate()}
            highlightToday={true}
            numberOfMonths={widthOnlyXl ? 4 : widthOnlyLg ? 3 : minWidth767max991 ? 1 : widthOnlySm ? 2 : widthOnlyXs ? 1 : 2}
            value={calendarValue}
            onChange={calendarOnChange}
            format='DD MMM YYYY'
            className={theme.palette.mode == 'dark' ? 'bg-dark yellow' : 'bg-light  yellow'}
            mapDays={calendarMapDays}
            renderButton={(direction: string, handleClick: () => void) => (
              <button
                type="button"
                className={`rmdp-arrow-container rmdp-${direction}`}
                aria-label={direction === "left" ? "Previous month" : "Next month"}
                onClick={handleClick}
              >
                <i className="rmdp-arrow"></i>
              </button>
            )}
            multiple
            range
            rangeHover
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
                              sx={{
                                color: '#000'
                              }}
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
                              <span style={{ display: 'flex' }}>From: {dayjs(slot.startDate).format('DD MMM YYYY')} &nbsp;
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
                                                      <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                                        <p style={{ marginBottom: '-2px', color: '#000' }}>Time: {time.period}</p>
                                                        <p style={{ marginBottom: '-2px', color: '#000' }}>Price:  {time.currencySymbol || 'THB'} {" "} {formatNumberWithCommas(time.price)}</p>
                                                        <p style={{ marginBottom: '-2px', color: '#000' }}>Booking Fee:  {time.currencySymbol || 'THB'} {" "} {formatNumberWithCommas(time.bookingsFeePrice)}</p>
                                                        <p style={{ marginBottom: '-2px', color: '#000' }}>Total Price:  {time.currencySymbol || 'THB'} {" "} {formatNumberWithCommas(time.total)}</p>
                                                      </span>
                                                      <Link href=""
                                                        aria-label='delete Single Slot'
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
                <Typography component='a' href='#'>You need to add at least one schedule timing to appear in search result.</Typography>
              </>
          }
        </SwipeableViews>
      </div>
    )
  }

  const selectAllClick = (period: string) => {
    let periodArray = period == 'morning' ? morningFields : period == 'afternoon' ? afternoonFields : eveningFields as any[];
    let replaceFunction = period == 'morning' ? replacemorning : period == 'afternoon' ? replaceafternoon : replaceevening
    if (periodArray.every((a: TimeType) => a.active)) {
      periodArray.map((a: TimeType) => a.active = false)
    } else {
      periodArray.map((a: TimeType) => a.active = true)
    }
    replaceFunction([...periodArray])
  }

  const SelectCheckBox = ({ period }: { period: 'morning' | 'afternoon' | 'evening' }) => {
    let periodArray = period == 'morning' ? morningFields : period == 'afternoon' ? afternoonFields : eveningFields as any[];
    let capitalPeriod: string = `${period.charAt(0).toUpperCase()}${period.slice(1)}`
    let updateFunction = period == 'morning' ? updatemorning : period == 'afternoon' ? updateafternoon : updateevening

    return (
      <>
        {
          periodArray.length > 0 &&
          <Fragment>
            <Divider>{capitalPeriod} </Divider>
            <Grid container >
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>

                <FormControlLabel
                  control={<Checkbox checked={periodArray.every(a => a.active)}
                    onChange={() => selectAllClick(period)} name={`${period}_${capitalPeriod}`} />}
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
              </Grid>
              {periodArray.every(a => a.active) && periodArray.every(item => item.price === periodArray[0].price) && <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>

                <Controller

                  name={period}
                  control={control}
                  render={(props: any) => {
                    const allPricesEqual = periodArray.every(item => item.price === periodArray[0].price);
                    const { field } = props;
                    const { value: fieldValue } = field;
                    return (
                      <NumericFormat
                        dir="ltr"
                        key={`${period}`}
                        prefix={` ${userProfile?.currency[0]?.currency} `}
                        value={allPricesEqual ? fieldValue[0].price : ''}
                        thousandSeparator
                        customInput={TextField}
                        onClick={() => {
                          let myInput = document.getElementById(`${period}`)!;
                          myInput.focus();
                          myInput.autofocus = true;
                        }}
                        onChange={(e) => {
                          e.target.focus();
                          e.target.autofocus = true;
                        }}
                        onValueChange={(values) => {
                          const { value, floatValue } = values;
                          if (!floatValue) {
                            periodArray.forEach((p, i) => {
                              setFormValue(`${period}.${i}.price`, '')
                            })

                          } else {
                            periodArray.forEach((p, i) => {

                              setFormValue(`${period}.${i}.price`, value)
                            })
                          }
                        }}
                        {...{
                          required: true,
                          id: `${period}`,
                          label: 'Price',
                          fullWidth: true,
                          size: 'small',
                          className: 'force-perfix-ltr',
                          inputProps: {
                            autoComplete: 'off'
                          },
                        }}
                      />
                    )
                  }}
                />
              </Grid>}
            </Grid>

            <Grid container >
              <div className="row form-row">
                {
                  periodArray.map((timeObjec: TimeType, i: number) => {
                    return (
                      <Grid item xl={4} lg={4} md={4} sm={4} xs={6} key={i} >
                        <FormControlLabel
                          checked={timeObjec.active}
                          {
                          ...control.register(`${period}.${i}.active`,
                          )
                          }
                          required
                          control={<Checkbox
                            onChange={() => {
                              updateFunction(i, { ...timeObjec, active: !timeObjec.active });
                              clearErrors(`${period}.${i}.active`)
                            }}
                          />}
                          label={timeObjec.period}
                          sx={{
                            color: (theme) => theme.palette.text.color,
                            "& .MuiFormControlLabel-label": {
                              fontSize: { xl: '18px !important', lg: '16px !important', md: `16px !important`, sm: `17px !important`, xs: `14px !important` },
                              minWidth: '115px'
                            },
                            "& .MuiButtonBase-root": {
                              pl: { xl: "9px", lg: '9px', md: `9px`, xs: '0px' },
                              pr: { xl: "9px", lg: '9px', md: `9px`, xs: '0px' }
                            }
                          }} />
                        {
                          timeObjec.active &&
                          <Controller
                            rules={{
                              required: "This field is required"
                            }}
                            name={`${period}.${i}.price`}
                            control={control}
                            render={(props: any) => {
                              const { field, fieldState, formState } = props;
                              const { ref, onChange, value: fieldValue } = field;
                              return (
                                <NumericFormat
                                  key={`${i} ${JSON.stringify(timeObjec)}`}
                                  prefix={` ${userProfile?.currency[0]?.currency} `}
                                  value={fieldValue}
                                  thousandSeparator
                                  customInput={TextField}
                                  onClick={() => {
                                    let myInput = document.getElementById(`${i} ${JSON.stringify(timeObjec)}`)!;
                                    myInput.focus();
                                    myInput.autofocus = true;
                                  }}
                                  onChange={(e) => {
                                    e.target.focus();
                                    e.target.autofocus = true;
                                  }}
                                  onValueChange={(values) => {
                                    const { value, floatValue } = values;
                                    if (!floatValue) {
                                      setFormValue(`${period}.${i}.price`, '')
                                    } else {
                                      setFormValue(`${period}.${i}.price`, value)
                                    }
                                  }}
                                  {...{
                                    required: true,
                                    id: `${i} ${JSON.stringify(timeObjec)}`,
                                    label: 'Price',
                                    fullWidth: true,
                                    error: errors?.[`${period}`]?.[i as keyof typeof editDaySlot]?.['price'] == undefined ? false : true,
                                    helperText: errors?.[`${period}`]?.[i as keyof typeof editDaySlot]?.['price'] && errors[`${period}`]?.[i as keyof typeof editDaySlot]['price']['message'] as ReactNode,
                                    size: 'small',
                                    inputProps: {
                                      autoComplete: 'off'
                                    },
                                  }}
                                />
                              )
                            }}
                          />
                        }
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
      <button type="submit" className="submitButton w-100" >
        {
          doctorAvailableTimeSlot !== null ?
            doctorAvailableTimeSlot.availableSlots.findIndex((s: AvailableType) => dayjs(s.startDate).isSame(dayjs(editDaySlot!.startDate))) == -1
              ? `Save Changes`
              : `Update Changes`
            : `Save Changes`}
      </button>
    )
  }

  const onEditDialogSubmit = (data: any) => {
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

        const calculateTotalPrice = (array: TimeType[]) => {
          array.map((a: TimeType) => {
            if (a.price !== '') {
              a.total = Number((Number(a.price) * (1 + Number(a.bookingsFee) / 100)).toFixed(2)).toString();
              a.bookingsFeePrice = (Number(a.price!) * (Number(a.bookingsFee) / 100)).toString()
            }
          })
          return array;
        }
        if (indexOfStartDate !== -1 && indexOfFinishDate !== -1) {
          prevState.availableSlots[indexOfStartDate]['morning'] = [...calculateTotalPrice(data!.morning)]
          prevState.availableSlots[indexOfStartDate]['afternoon'] = [...calculateTotalPrice(data!.afternoon)]
          prevState.availableSlots[indexOfStartDate]['evening'] = [...calculateTotalPrice(data!.evening)]
        } else {
          let haveMorning = data!.morning.length == 0 ? false : data!.morning.some((a: TimeType) => a.active)
          let haveAfternoon = data!.afternoon.length == 0 ? false : data!.afternoon.some((a: TimeType) => a.active)
          let haveEvening = data!.evening.length == 0 ? false : data!.evening.some((a: TimeType) => a.active)
          if (haveMorning) {
            data.morning = calculateTotalPrice(data.morning)
          }
          if (haveAfternoon) {
            data.afternoon = calculateTotalPrice(data.afternoon)
          }
          if (haveEvening) {
            data.evening = calculateTotalPrice(data.evening)
          }
          prevState?.availableSlots.push({
            ...data!,
            startDate: editDaySlot?.startDate,
            finishDate: editDaySlot?.finishDate,
            timeSlot: editDaySlot?.timeSlot,
            index: editDaySlot?.index
          })
        }
        return { ...prevState }
      })
      setIsPeriodExist((prevState: { [key: string]: boolean }) => {
        let haveMorning = data!.morning.length == 0 ? false : data!.morning.some((a: TimeType) => a.active)
        let haveAfternoon = data!.afternoon.length == 0 ? false : data!.afternoon.some((a: TimeType) => a.active)
        let haveEvening = data!.evening.length == 0 ? false : data!.evening.some((a: TimeType) => a.active)
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
      removemorning();
      removeafternoon();
      removeevening();
    }, 500);
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
                removemorning();
                removeafternoon();
                removeevening();
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
            <form noValidate onSubmit={handleSubmit(onEditDialogSubmit)}>
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
              router.reload();
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
              router.reload();
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
              // router.push({ pathname: router.asPath }, undefined, { scroll: false, shallow: true })
              router.reload();
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
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPaginationModel((prevState) => {
      var maximuPage: number = prevState.page;
      if (rowCount !== 0) {
        if ((maximuPage + 1) >= (Math.floor(rowCount / parseInt(event.target.value, 10)))) {
          maximuPage = (Math.floor(rowCount / parseInt(event.target.value, 10))) - 1
        }
      }
      return {
        pageSize: parseInt(event.target.value, 10),
        page: maximuPage <= 0 ? 0 : maximuPage,
      }
    })
    setDataGridFilters((prevState) => {
      var maximuPage: number = prevState.skip;
      if (rowCount !== 0) {
        if ((maximuPage + 1) >= (Math.floor(rowCount / parseInt(event.target.value, 10)))) {
          maximuPage = (Math.floor(rowCount / parseInt(event.target.value, 10))) - 1
        }
      }
      return {
        limit: parseInt(event.target.value, 10),
        skip: maximuPage <= 0 ? 0 : maximuPage,
      }
    })
  }
  const handleChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setDataGridFilters({
      limit: perPage !== paginationModel.pageSize ? paginationModel.pageSize : perPage,
      skip: (value - 1) * perPage
    })
    setPaginationModel((prevState) => {
      return {
        ...prevState,
        page: value - 1
      }
    })
  }
  const reservationsComponent = () => {
    const columns: GridColDef[] = [
      {
        field: "id",
        headerName: "ID",
        width: 20,
        align: 'center',
        headerAlign: 'center'
      },
      {
        field: 'startDate',
        headerName: 'From - To Period',
        width: 250,
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
        field: 'price',
        headerName: 'Price',
        width: 90,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => {
          return (
            <Stack >
              <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{formatNumberWithCommas(params?.row?.timeSlot?.price)}</span>
              <span className="d-block">
                <span style={{ justifyContent: 'center', display: 'flex' }}>{params?.row?.timeSlot?.currencySymbol || 'THB'}</span>
              </span>
            </Stack>
          )
        }
      },
      {
        field: 'bookingsFee',
        headerName: 'Bookings Fee',
        width: 120,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => {
          return (
            <Stack >
              <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{formatNumberWithCommas(
                params?.row?.timeSlot?.bookingsFeePrice
              )}</span>
              <span className="d-block">
                <span style={{ justifyContent: 'center', display: 'flex' }}>{params?.row?.timeSlot?.currencySymbol || 'THB'}</span>
              </span>
            </Stack>
          )
        }
      },
      {
        field: 'total',
        headerName: 'Total',
        width: 90,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => {
          return (
            <Stack >
              <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{formatNumberWithCommas(
                params?.row?.timeSlot?.total
              )}</span>
              <span className="d-block">
                <span style={{ justifyContent: 'center', display: 'flex' }}>{params?.row?.timeSlot?.currencySymbol || 'THB'}</span>
              </span>
            </Stack>
          )
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
        width: 200,
        align: 'left',
        headerAlign: 'center',
        valueFormatter(params: GridValueFormatterParams) {
          const { value } = params
          return `${value.gender} ${value.gender !== '' ? '.' : ''} ${value?.firstName} ${value?.lastName}`
        },
        renderCell: (params: GridRenderCellParams) => {
          const { row, formattedValue } = params;
          const profileImage = row?.patientProfile?.profileImage == '' ? patient_profile : row?.patientProfile?.profileImage
          const online = row?.patientStatus?.online || false;
          return (
            <>
              <Link aria-label='link' className="avatar mx-2" href={`/doctors/dashboard/patient-profile/${btoa(row?.patientId)}`} target='_blank'>
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
              <Stack>
                <Link aria-label='link' href={`/doctors/dashboard/patient-profile/${btoa(row?.patientId)}`}
                  target='_blank'
                  style={{ color: theme.palette.secondary.main, maxWidth: '70%', minWidth: '70%' }}>
                  {formattedValue}
                </Link>
                <Link href={`/doctors/invoice-view/${btoa(row?._id!)}`} target='_blank'>{row.invoiceId}</Link>
              </Stack>
            </>
          )
        }
      },
      {
        field: 'paymentType',
        headerName: `Payment status`,
        width: 120,
        align: 'center',
        headerAlign: 'center',
        renderCell: (data: any) => {
          const { row } = data;
          return (
            <>
              <Chip
                color={
                  row.doctorPaymentStatus == 'Paid' ? 'success' :
                    row.doctorPaymentStatus == 'Awaiting Request' ? 'error' :
                      'primary'}
                label={`${row.doctorPaymentStatus}`}
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
                <Typography variant='h5' align='center' gutterBottom>Total: {rowCount} reservations</Typography>

                <DataGrid
                  paginationMode='server'
                  experimentalFeatures={{ ariaV7: true }}
                  slots={{
                    noResultsOverlay: CustomNoRowsOverlay,
                    noRowsOverlay: CustomNoRowsOverlay,
                    pagination: CustomPagination,
                  }}
                  slotProps={{
                    pagination: { //@ts-ignore
                      handleChangePage: handleChangePage,
                      handleChangeRowsPerPage: handleChangeRowsPerPage,
                      count: rowCount,
                      SelectProps: {
                        inputProps: {
                          id: 'pagination-select',
                          name: 'pagination-select',
                        },
                      },
                    },
                  }}
                  getRowId={(params) => params._id}
                  rowHeight={screen.height / 15.2}
                  rows={rows}
                  rowCount={rowCount}
                  ref={grdiRef}
                  columns={columns}
                  paginationModel={paginationModel}

                  pageSizeOptions={[5, 10]}
                  showCellVerticalBorder
                  showColumnVerticalBorder
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
                    },
                    "& .MuiDataGrid-footerContainer": {
                      [theme.breakpoints.only("xs")]: {
                        justifyContent: 'center',
                        mb: 2
                      }
                    }
                  }}
                />
                {/* <Pagination
                  showFirstButton
                  showLastButton
                  hideNextButton
                  hidePrevButton
                  boundaryCount={1}
                  variant="outlined"
                  color="secondary"
                  count={userProfile ? Math.ceil(rowCount / perPage) : 0}
                  page={dataGridFilters.skip / perPage}
                  sx={{
                    justifyContent: 'center',
                    display: 'flex',
                    minHeight: 70
                  }}
                  onChange={handlePageChange}
                /> */}
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
      {
        userProfile?.currency.length == 0 ?
          <>
            <div className="col-md-7 col-lg-8 col-xl-9" style={muiVar}>
              <div className="row">
                <div className="col-md-12">
                  <div className="card schedule-widget mb-3" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <p style={{ color: theme.palette.text.color }}>First choose currency in profile.</p>
                  </div>
                </div>
              </div>
            </div>
          </>
          :
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
      }
      {dialogCompoenent()}

    </Fragment >
  )
})

export default ScheduleTiming