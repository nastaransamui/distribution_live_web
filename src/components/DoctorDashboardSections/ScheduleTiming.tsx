/* eslint-disable @next/next/no-img-element */

import { FC, Fragment, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

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
import { styled, useTheme, darken, lighten } from '@mui/material/styles';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid, GridAlignment, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel, } from '@mui/x-data-grid';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
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
import { loadStylesheet } from '@/pages/_app';
import TextField from '@mui/material/TextField';
import { Controller, } from 'react-hook-form';
import CustomPagination, { CustomPaginationSlotType } from '../shared/CustomPagination';
import { useTimeSlot } from '@/hooks/useTimeSlot';
import FormHelperText from '@mui/material/FormHelperText';
import CustomToolbar, { convertFilterToMongoDB, createCustomOperators, CustomToolbarPropsType, CustomToolbarSlotType, globalFilterFunctions } from '../shared/CustomToolbar';

import InputAdornment from '@mui/material/InputAdornment';
import BeatLoader from 'react-spinners/BeatLoader';



export const StyledBadge = styled(Badge, {
  shouldForwardProp: (prop) => prop !== 'online' && prop !== 'idle'
})
  <{ online: boolean, idle?: boolean }>(({ theme, online, idle }) => {

    return {
      '& .MuiBadge-badge': {
        backgroundColor: idle ? '#ffa812' : online ? '#44b700' : 'crimson',
        color: idle ? '#ffa812' : online ? '#44b700' : 'crimson',
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
          transform: 'scale(1.4)',
          opacity: 0,
        },
      },
    }
  });

export const getSelectedBackgroundColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);

export const getSelectedHoverBackgroundColor = (color: string, mode: string) =>
  mode === 'dark' ? lighten(color, 0.4) : lighten(color, 0.4);

export interface TimeTypeBase {
  period: string;
  active: boolean;
  isReserved: boolean;
  price: number;
  bookingsFee: number;
  bookingsFeePrice: number;
  total: number;
  currencySymbol: string;
  id?: string;
}

export interface TimeType extends TimeTypeBase {
  reservations?: AppointmentReservationType[];
}

export interface AvailableType {
  afternoon: TimeType[];
  evening: TimeType[];
  finishDate: Date;
  morning: TimeType[];
  startDate: Date;
  timeSlot: number;
  index?: number;
}

export interface DoctorsTimeSlotType {
  _id?: string;
  doctorId: string;
  createDate: Date;
  updateDate: Date;
  availableSlots: AvailableType[];
  isTodayAvailable?: boolean;
  isTommorowAvailable?: boolean;
  isThisWeekAvailable?: boolean;
  isThisMonthAvailable?: boolean;
  totalReservation?: number;
  averageHourlyPrice?: number;
  reservations?: Array<AppointmentReservationType>;
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


const ScheduleTiming: FC = (() => {
  const { muiVar, bounce } = useScssVar();
  dayjs.extend(isBetween)
  const theme = useTheme();
  const {
    setMorningCheck,
    setAfterNoonCheck,
    setEveningCheck,
    setIsPeriodExist,
    setTimeSlot,
    setCalendarValue,
    doctorAvailableTimeSlot,
    setDoctorAvailableTimeSlot,
    timeSlot,
    showDialog,
    editDaySlot,
    mongoFilterModel,
    paginationModel,
    sortModel,
    isLoading,
    setIsLoading,
    reload,
    setReload,
    rows,
    setRows,
    setRowCount,
    morningCheck,
    afterNoonCheck,
    eveningCheck,
    calendarValue,
    isPeriodExist,
  } = useTimeSlot();
  const dispatch = useDispatch()
  const router = useRouter()
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)

  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)

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
  useEffect(() => {
    loadStylesheet('/css/react-multi-date-picker-bg-dark.min.css');
  }, [])

  useEffect(() => {
    let isActive = true;
    let userId = userDoctorProfile?._id
    if (isActive && homeSocket.current !== undefined) {
      if (userDoctorProfile?.timeSlotId && userDoctorProfile?.timeSlotId.length !== 0) {
        homeSocket.current.emit('getDoctorTimeSlots', { userId: userId, paginationModel, sortModel, mongoFilterModel, })
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
                if (message == 'timeSlot not found.') {
                  router.reload();
                }
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
              setCalendarValue(() =>
                newAvailableSlotFromDb.map(convertSlotToCalendarRange)
              );
              //Update time slot from db data
              setTimeSlot(() =>
                newAvailableSlotFromDb.reduce<{ [key: string]: number }>((acc, element) => {
                  acc[getDateKey(element.startDate)] = element.timeSlot;
                  return acc;
                }, {})
              );
              //Update period exist from db data
              setIsPeriodExist(() =>
                newAvailableSlotFromDb.reduce<{ [key: string]: boolean }>((acc, element) => {
                  acc[getDateKey(element.startDate)] = isAnyPeriodActive(element);
                  return acc;
                }, {})
              );

              setMorningCheck(() => updatePeriodCheckState(newAvailableSlotFromDb, 'morning'));
              setAfterNoonCheck(() => updatePeriodCheckState(newAvailableSlotFromDb, 'afternoon'));
              setEveningCheck(() => updatePeriodCheckState(newAvailableSlotFromDb, 'evening'));

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

        homeSocket.current.once(`updateGetDoctorTimeSlots`, () => {
          setReload(!reload)
        })
      }
    } else {
      setIsLoading(false)
    }
    return () => {
      isActive = false;
    }

    // homeSocket, mongoFilterModel, paginationModel, reload, sortModel
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    reload,
    paginationModel,
    homeSocket,
    mongoFilterModel,
    paginationModel,
    sortModel
  ])

  const deleteDb = () => {
    if (userDoctorProfile) {
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
  const saveTodb = () => {
    if (userDoctorProfile) {
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
    if (userDoctorProfile) {
      delete doctorAvailableTimeSlot?.reservations
      delete doctorAvailableTimeSlot?.totalReservation
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


  const getConfirmDb = () => {
    toast.error(() => (
      <ConfirmDeleteToast deleteDb={deleteDb} />
    ), {
      position: 'bottom-center',
      toastId: 'delete-confirm',
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      transition: bounce,
      closeButton: false,
      icon: false,
    });
  };

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsClient(true), 20);
    return () => {
      setIsClient(false)
    }
  }, [])
  return (
    <Fragment>
      {
        userDoctorProfile?.currency?.length == 0 ?
          <>
            <div className={`col-md-12 col-lg-12 col-xl-12 ${isClient ? 'animate__animated animate__backInUp' : 'pre-anim-hidden'}`} style={muiVar}>
              <div className="row">
                <div className="col-md-12">
                  <div className="card schedule-widget mb-3" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <p style={{ color: theme.palette.text.color }}>First choose currency and bookings fee for doctor profile.</p>
                  </div>
                </div>
              </div>
            </div>
          </> :
          <>
            <div className="col-md-12 col-lg-12 col-xl-12">
              {
                isLoading ?
                  <BeatLoader color={theme.palette.primary.main} style={{
                    minWidth: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                  }} /> :
                  <>
                    <div className={`card ${isClient ? 'animate__animated animate__backInUp' : 'pre-anim-hidden'}`}>
                      <div className="card-body">
                        <div className="table-responsive">
                          <CalendarComponent />
                          <TabsButtonsCompoenent />
                          <SlotSwipeable saveTodb={saveTodb} updateDb={updateDb} getConfirmDb={getConfirmDb} />
                        </div>
                      </div>
                    </div>
                    <div className={`card ${isClient ? 'animate__animated animate__backInUp' : 'pre-anim-hidden'}`}>
                      <div className="card-body">
                        <div className="table-responsive">
                          <ReservationsComponent />
                        </div>
                      </div>
                    </div>
                  </>
              }

            </div>
          </>
      }

      {showDialog && editDaySlot !== null && <DialogComponent />}

    </Fragment >
  )
})




const ConfirmDeleteToast: FC<{ deleteDb: Function }> = (({ deleteDb }) => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  return (
    <div style={muiVar}>
      <Typography align="center">Are you sure to delete this whole time slot?</Typography>
      <br />
      <div style={{ display: 'flex', gap: '5px' }}>
        <Button
          className={`btnDelete btn-primary submit-btn `}
          sx={{ backgroundColor: theme.palette.primary.main }}
          onClick={() => {
            deleteDb();
            toast.dismiss('delete-confirm');
          }}
          variant="contained"
          fullWidth
          size="small"
        >
          Delete
        </Button>
        <Button
          fullWidth
          onClick={() => toast.dismiss('delete-confirm')}
          variant="contained"
          className={`btn btn-primary submit-btn `}
          sx={{ backgroundColor: theme.palette.secondary.main, }} >
          Cancel
        </Button>
      </div>
    </div>
  )
})

export const LoadingComponent: FC<{ boxMinHeight?: string }> = ({ boxMinHeight }) => {
  const theme = useTheme();
  return <BeatLoader color={theme.palette.primary.main}
    style={{
      minWidth: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: boxMinHeight,
    }} />
}

const CalendarComponent: FC = (() => {
  const theme = useTheme();
  const { bounce } = useScssVar();
  const widthOnlyXl = useMediaQuery(theme.breakpoints.only('xl'));
  const widthOnlyLg = useMediaQuery(theme.breakpoints.only('lg'));
  const widthOnlySm = useMediaQuery(theme.breakpoints.only('sm'));
  const widthOnlyXs = useMediaQuery(theme.breakpoints.only('xs'));
  const minWidth767max991 = useMediaQuery('@media (min-width:767px) and (max-width: 991px)');

  const {
    calendarValue,
    setCalendarValue,
    setTimeSlot,
    doctorAvailableTimeSlot
  } = useTimeSlot();
  /**
   * Handle calendar changes.
   * The expected type is:
   *    DateObject | DateObject[] | null
   *
   * If multiple/range mode returns an array of arrays, you can check for that.
   */
  const handleCalendarChange = useCallback((selectedDates: any[] | null) => {
    if (!selectedDates) return;
    selectedDates.forEach((value: DateObject[],) => {
      setTimeSlot((prevState: { [key: string]: number }) => {
        let newState: { [key: string]: number } = prevState
        newState[dayjs(value[0] as any).format('DDMMYYYY') as string] = 60
        return { ...newState }
      })
    })
    if (!calendarValue) {
      setCalendarValue(selectedDates)
    } else {
      let dataArray = calendarValue.toString().split(',')
      const rec = Array.from(
        { length: dataArray.length / 2 },
        (_, i) => ({ start: dataArray[2 * i] == '' ? undefined : dataArray[2 * i], finish: dataArray[2 * i + 1] == '' ? undefined : dataArray[2 * i + 1] }));

      if (rec.length == 0) {
        setCalendarValue(selectedDates)
      } else {
        let numberOfPeriviousRecord = rec.length
        if (selectedDates[numberOfPeriviousRecord]) {
          let startSelect = selectedDates[numberOfPeriviousRecord].length == 1
          if (startSelect) {
            setCalendarValue(selectedDates)
          } else {
            setCalendarValue(selectedDates)
          }
        }

        return false
      }
    }
  }, [calendarValue, setCalendarValue, setTimeSlot])

  const mapCalendarDays = useCallback(
    (params: any) => {
      const { date, isSameDate }: { date: any, selectedDate: any[], isSameDate: Function } = params;
      let props = {} as any
      let isWeekend = [0, 6].includes(date.weekDay.index)
      if (isWeekend) {
        props.style = { color: 'red' }
      }
      if (calendarValue) {
        calendarValue.forEach((elem: any[]) => {
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

    },
    [calendarValue, bounce]
  )


  const handleDeselect = useCallback(() => {
    if (!doctorAvailableTimeSlot || doctorAvailableTimeSlot.availableSlots.length === 0) {
      setCalendarValue(undefined);
    }
  }, [doctorAvailableTimeSlot, setCalendarValue]);
  const handleToday = useCallback(() => {
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
  }, [setCalendarValue])
  // Determine the number of months to display based on screen size.
  const numberOfMonths = widthOnlyXl
    ? 4
    : widthOnlyLg
      ? 3
      : minWidth767max991
        ? 1
        : widthOnlySm
          ? 2
          : widthOnlyXs
            ? 1
            : 2;
  return (
    <div className="schedule-header" >
      <div className="schedule-nav">
        <Calendar
          minDate={dayjs().toDate()}
          multiple
          range
          numberOfMonths={numberOfMonths}
          value={calendarValue}
          onChange={handleCalendarChange}
          format='DD MMM YYYY'
          rangeHover
          className={theme.palette.mode == 'dark' ? 'bg-dark yellow' : 'bg-light  yellow'}
          mapDays={mapCalendarDays}
          plugins={[
            // @ts-ignore
            <PeriodPlugin position="bottom" key="periodPlugin" />,
          ]}
        >
          <Grid container className="submit-section" sx={{ padding: 1 }} spacing={1}>
            <Grid size={{ lg: 6, xs: 6 }}>
              <Button fullWidth sx={{ lineHeight: '16px', boxShadow: 'none' }} className="btn btn-primary submit-btn"
                disabled={doctorAvailableTimeSlot !== null && doctorAvailableTimeSlot.availableSlots.length > 0}
                onClick={handleDeselect}>DESELECT</Button>
            </Grid>
            <Grid size={{ lg: 6, xs: 6 }}>
              <Button fullWidth sx={{ lineHeight: '16px', boxShadow: 'none' }} className="btn btn-primary submit-btn"
                onClick={handleToday}>TODAY</Button>
            </Grid>
          </Grid>
        </Calendar>
      </div>
    </div>
  )
})



// Helper to generate a timeslot object
const createTimeSlot = (
  startHour: number,
  slotDuration: number,
  index: number,
  userProfile: any
): TimeType => {
  const startTime = dayjs().hour(startHour).minute(0).add(slotDuration * index, 'minute').format('HH:mm');
  const endTime = dayjs().hour(startHour).minute(0).add(slotDuration * (index + 1), 'minute').format('HH:mm');
  return {
    period: `${startTime} - ${endTime}`,
    active: false,
    isReserved: false,
    price: 0,
    bookingsFee: userProfile?.bookingsFee!,
    bookingsFeePrice: 0,
    total: 0,
    currencySymbol: userProfile?.currency?.[0]?.currency!,
    reservations: []
  };
};

// Helper to generate an array of timeslot objects
const generateTimeSlots = (
  startHour: number,
  totalHours: number,
  slotDuration: number,
  userProfile: any
): TimeType[] => {
  const numSlots = totalHours / slotDuration;
  return Array.from({ length: numSlots }, (_, index) => createTimeSlot(startHour, slotDuration, index, userProfile));
};


const PeriodPlugin: FC = () => {
  const theme = useTheme();
  const { bounce } = useScssVar()
  let initStateKey = dayjs().format('DDMMYYYY');
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const widthOnlyXs = useMediaQuery(theme.breakpoints.only('xs'));
  const {
    morningCheck,
    setMorningCheck,
    afterNoonCheck,
    setAfterNoonCheck,
    eveningCheck,
    setEveningCheck,
    isPeriodExist,
    setIsPeriodExist,
    timeSlot,
    setTimeSlot,
    calendarValue,
    setCalendarValue,
    doctorAvailableTimeSlot,
    setShowDialog,
    setTabIndex,
    setEditDaySlot,
    appendMorning,
    appendAfternoon,
    appendEvening,
  } = useTimeSlot();


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


  /**
   * Removes a period from the calendar.
   *
   * Checks that both dates are defined. If the doctor’s available time slots are either null
   * or empty, or if the dates do not match any available slot, it calls fixMultipleState.
   * Otherwise, if the available slot has no reserved times (morning, afternoon, or evening),
   * additional logic (to be implemented) may be executed.
   */
  const removePeriod = (index: number): void => {
    const [startRaw, finishRaw] = calendarValue[index] || [];
    if (startRaw === undefined || finishRaw === undefined) return;

    const startDateStr = dayjs(startRaw).format("DD MMM YYYY");
    const finishDateStr = dayjs(finishRaw).format("DD MMM YYYY");
    const stateKey = dayjs(startRaw).format("DDMMYYYY");

    // If no available time slot exists, remove period immediately.
    if (doctorAvailableTimeSlot === null || doctorAvailableTimeSlot.availableSlots.length === 0) {
      fixMultipleState(index, stateKey);
      return;
    }

    // Find the available slot indices matching the start and finish dates.
    const startIndex = doctorAvailableTimeSlot.availableSlots.findIndex((slot: AvailableType) =>
      dayjs(slot.startDate).isSame(startDateStr)
    );
    const finishIndex = doctorAvailableTimeSlot.availableSlots.findIndex((slot: AvailableType) =>
      dayjs(slot.finishDate).isSame(finishDateStr)
    );

    // If neither date is found, we can remove the period.
    if (startIndex === -1 && finishIndex === -1) {
      fixMultipleState(index, stateKey);
      return;
    }

    // If a slot exists, check if any time in that slot is reserved.
    const slotToCheck = doctorAvailableTimeSlot.availableSlots[startIndex];
    const isAnyReserved =
      slotToCheck.morning.some((t: TimeType) => t.isReserved) ||
      slotToCheck.afternoon.some((t: TimeType) => t.isReserved) ||
      slotToCheck.evening.some((t: TimeType) => t.isReserved);

    // Only perform deletion logic if no time is reserved.
    if (!isAnyReserved) {

    }
  };

  /**
   * Handles clicking the "Add Slot" button.
   *
   * Validates that at least one of the time tables (morning, afternoon, or evening)
   * is selected. If so, it prepares the initial state for the new time slots and opens a dialog.
   * Otherwise, it displays an error toast.
   */
  const addSlotClick = (startDate: string, finishDate: string, index: number): void => {
    const stateKey = dayjs(startDate).format('DDMMYYYY');

    // Check that at least one of the time tables is selected.
    if (!morningCheck[stateKey] && !afterNoonCheck[stateKey] && !eveningCheck[stateKey]) {
      toast.error('You need to select one time table at least.', {
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
      return;
    }

    setShowDialog(true);

    setEditDaySlot((prevState: AvailableType | null): AvailableType => {
      // Initialize if no previous state exists.
      let newState = prevState;
      if (newState === null) {
        newState = {
          index,
          startDate: new Date(startDate),
          finishDate: new Date(finishDate),
          timeSlot: timeSlot[stateKey],
          morning: [],
          afternoon: [],
          evening: []
        };

        // Generate morning slots if selected.
        if (morningCheck[stateKey]) {
          const morningSlots = generateTimeSlots(9, morningHours, timeSlot[stateKey], userDoctorProfile);
          newState.morning = morningSlots;
          morningSlots.forEach(slot => appendMorning(slot));
        }

        // Generate afternoon slots if selected.
        if (afterNoonCheck[stateKey]) {
          const afternoonSlots = generateTimeSlots(13, afterNoonHours, timeSlot[stateKey], userDoctorProfile);
          newState.afternoon = afternoonSlots;
          afternoonSlots.forEach(slot => appendAfternoon(slot));
        }

        // Generate evening slots if selected.
        if (eveningCheck[stateKey]) {
          const eveningSlots = generateTimeSlots(17, eveningHours, timeSlot[stateKey], userDoctorProfile);
          newState.evening = eveningSlots;
          eveningSlots.forEach(slot => appendEvening(slot));
        }
      }
      return newState;
    });
  };
  /**
   * Handles changes in the time slot duration.
   *
   * Updates the timeSlot state by setting the new duration value for the given startDate key.
   */
  const timeSlotChange = (event: SelectChangeEvent, startDateKey: number): void => {
    const newDuration = parseInt(event.target.value, 10);
    setTimeSlot((prevState: { [key: number]: number }) => ({
      ...prevState,
      [startDateKey]: newDuration
    }));
  };

  /**
   * Handles clicking the "Edit Slot" button.
   *
   * Finds the existing slot based on start and finish dates, clones it, and sets up the
   * dialog for editing by appending the current morning, afternoon, and evening slots.
   */
  const editSlotClick = (startDate: string, finishDate: string): void => {
    if (doctorAvailableTimeSlot === null) return;

    const startIndex = doctorAvailableTimeSlot.availableSlots.findIndex((slot: AvailableType) =>
      dayjs(slot.startDate).isSame(startDate)
    );
    const finishIndex = doctorAvailableTimeSlot.availableSlots.findIndex((slot: AvailableType) =>
      dayjs(slot.finishDate).isSame(finishDate)
    );

    // Only proceed if both start and finish dates match an existing slot.
    if (startIndex === -1 || finishIndex === -1) return;
    let allAvailable = doctorAvailableTimeSlot.availableSlots[startIndex]
    const allTimesFlat = [...allAvailable.afternoon, ...allAvailable.morning, ...allAvailable.evening]
    const hasReservation = allTimesFlat.some((a: TimeType) => a.reservations && a.reservations.length !== 0);
    if (hasReservation) {
      toast.error('This Time slot has booking already and can\'t be edit.', {
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
      const slotToEdit = _.cloneDeep(doctorAvailableTimeSlot.availableSlots[startIndex]);
      setShowDialog(true);

      // Pre-populate the corresponding time arrays.
      if (slotToEdit.morning.length > 0) {
        appendMorning([...slotToEdit.morning]);
      }
      if (slotToEdit.afternoon.length > 0) {
        appendAfternoon([...slotToEdit.afternoon]);
      }
      if (slotToEdit.evening.length > 0) {
        appendEvening([...slotToEdit.evening]);
      }

      setEditDaySlot(slotToEdit);
    }

  };

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

                      <Grid sx={{
                        flexBasis: { lg: '85%', md: "70%", sm: '100%', xs: '100%' },
                        textAlign: { xl: 'left', lg: 'left', md: 'left', sm: 'left', xs: 'center' }
                      }}>
                        <div style={{ display: 'inline-block', }} className={widthOnlyXs ? '' : 'form-group'}>
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

                      <Grid sx={{
                        marginLeft: { xl: 'auto', lg: 'auto', md: 'auto', sm: 'unset', xs: 'unset' },
                        pb: { xl: 'unset', lg: 'unset', md: 'unset', sm: 2, xs: 2 },
                        display: 'flex',
                        flexBasis: { xl: 'unset', lg: 'unset', md: 'unset', sm: '100%', xs: '100%' },
                      }}>
                        {
                          calendar[0] && calendar[1] ?
                            !isHide ?
                              <Grid sx={{
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
                              <Grid sx={{
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
                                  <i className="fa fa-edit me-1"></i> Edit Slot
                                </Link>
                              </Grid> : <></>
                        }
                      </Grid>

                      {
                        calendar[0] && calendar[1] &&
                        <Fragment>
                          <Grid container
                            spacing={{ xl: 2, lg: 2, md: 2, sm: 0 }}
                            className='disabled'
                            sx={{ pointerEvents: isHide ? 'none' : 'auto', minWidth: "100% !important" }}>
                            {/* time selec */}
                            <Grid size={{ lg: 3, md: 4, sm: 12, xs: 12 }}>

                              <div className='form-group'>
                                <FormControl fullWidth >
                                  <InputLabel id={`${timeSlot[calendar[0].format('DDMMYYYY')]} ${calendar[0]} ${calendar[1]}-label`} htmlFor={`${timeSlot[calendar[0].format('DDMMYYYY')]} ${calendar[0]} ${calendar[1]}`} size='small' >Timing Slot Duration</InputLabel>

                                  <Select
                                    inputProps={{
                                      name: `${timeSlot[calendar[0].format('DDMMYYYY')]} ${calendar[0]} ${calendar[1]}_name`,
                                      id: `${timeSlot[calendar[0].format('DDMMYYYY')]} ${calendar[0]} ${calendar[1]}`,
                                    }}
                                    labelId={`${timeSlot[calendar[0].format('DDMMYYYY')]} ${calendar[0]} ${calendar[1]}-label`}
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
                            <Grid size={{ lg: 9, md: 8, sm: 12, xs: 12 }} sx={{ display: 'flex', mt: { lg: -1 }, flexDirection: { xl: 'row', lg: 'row', md: 'row', sm: 'row', xs: 'column' } }}>
                              <Stack sx={{ width: '-webkit-fill-available', }} direction={widthOnlyXs ? 'row' : 'column'}>

                                <FormControlLabel
                                  id={`${morningCheck[stateKey]} ${calendar[0]} ${calendar[1]}`}
                                  control={
                                    <Checkbox
                                      disabled={isHide}
                                      name={`${morningCheck[stateKey]} ${calendar[0]} ${calendar[1]}`}
                                      checked={morningCheck[stateKey] ?? false}
                                      onChange={(e: any) => {
                                        setMorningCheck((prevState: { [key: string]: boolean }) => ({ ...prevState, [stateKey]: e.target.checked }))
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
                                      checked={afterNoonCheck[stateKey] ?? false}
                                      onChange={(e: any) => {
                                        setAfterNoonCheck((prevState: { [key: string]: boolean }) => ({ ...prevState, [stateKey]: e.target.checked }))
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
                                      checked={eveningCheck[stateKey] ?? false}
                                      onChange={(e: any) => {
                                        setEveningCheck((prevState: { [key: string]: boolean }) => ({ ...prevState, [stateKey]: e.target.checked }))
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

const TabsButtonsCompoenent = () => {
  const { muiVar, bounce } = useScssVar();
  const {
    setMorningCheck,
    setAfterNoonCheck,
    setEveningCheck,
    setIsPeriodExist,
    setTimeSlot,
    setCalendarValue,
    doctorAvailableTimeSlot,
    setDoctorAvailableTimeSlot,
    tabIndex,
    setTabIndex,
  } = useTimeSlot();

  const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };
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
  const deleteSlotArray = (slot: AvailableType, slotIndex: number) => {
    if (doctorAvailableTimeSlot !== null && doctorAvailableTimeSlot.availableSlots.length !== 0) {

      let isNohaveReserve =
        slot.morning.every((a) => !a.isReserved) &&
        slot.afternoon.every((a) => !a.isReserved) &&
        slot.evening.every((a) => !a.isReserved)
      if (isNohaveReserve) {
        let filterdAvalilableSlot = doctorAvailableTimeSlot.availableSlots.filter((_a: AvailableType, i: number) => i !== slotIndex)
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
                      .map((slot: AvailableType, index: number) => {
                        return (
                          <Tab
                            key={index}
                            label={`From: ${dayjs(slot.startDate).format('DD MMM YYYY')} to ${dayjs(slot.finishDate).format('DD MMM YYYY')}`}
                            // wrapped
                            id={`full-width-tab-${index}`}
                            aria-controls={`full-width-tabpanel-${index}`}
                            iconPosition='end'
                            sx={{ color: '#000' }}
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

interface SlotSwipeableType {
  saveTodb: Function;
  updateDb: Function;
  getConfirmDb: Function;
}

const SlotSwipeable: FC<SlotSwipeableType> = ({ saveTodb, updateDb, getConfirmDb }) => {
  const theme = useTheme();
  const { bounce } = useScssVar();
  const {
    setIsPeriodExist,
    doctorAvailableTimeSlot,
    setDoctorAvailableTimeSlot,
    setShowDialog,
    tabIndex,
    setTabIndex,
    setEditDaySlot,
    appendMorning,
    appendAfternoon,
    appendEvening,
  } = useTimeSlot();
  const handleChangeIndex = (index: number) => {
    setTabIndex(index);
  };

  const editSlotClick = (startDate: string, finishDate: string) => {

    if (doctorAvailableTimeSlot !== null) {
      let indexOfStartDate = doctorAvailableTimeSlot.availableSlots.findIndex((s: AvailableType) => dayjs(s.startDate).isSame(startDate))
      let indexOfFinishDate = doctorAvailableTimeSlot.availableSlots.findIndex((s: AvailableType) => dayjs(s.finishDate).isSame(finishDate))
      if (indexOfStartDate !== -1 && indexOfFinishDate !== -1) {
        let allAvailable = doctorAvailableTimeSlot.availableSlots[indexOfStartDate]
        const allTimesFlat = [...allAvailable.afternoon, ...allAvailable.morning, ...allAvailable.evening]
        const hasReservation = allTimesFlat.some((a: TimeType) => a.reservations && a.reservations.length !== 0);
        if (hasReservation) {
          toast.error('This Time slot has booking already and can\'t be edit.', {
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
          setShowDialog(true)
          let editDay: AvailableType = _.cloneDeep(doctorAvailableTimeSlot.availableSlots[indexOfStartDate])
          if (editDay?.morning.length !== 0) {
            appendMorning([...editDay.morning])
          }
          if (editDay?.afternoon.length !== 0) {
            appendAfternoon([...editDay.afternoon])
          }
          if (editDay?.evening.length !== 0) {
            appendEvening([...editDay.evening])
          }
          setEditDaySlot(editDay)
        }

      }
    }
  }
  const deleteSingleSlot = (time: TimeType, entrie: any[], slotIndex: number, indexOfperiod: number) => {
    if (time.isReserved || (time.reservations && time.reservations.length !== 0)) {
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
  return (
    <div className="tab-content schedule-cont" style={{ overflowX: 'hidden' }}>
      {
        doctorAvailableTimeSlot !== null ?
          doctorAvailableTimeSlot.availableSlots.length == 0 ? <></> :
            <>{doctorAvailableTimeSlot.availableSlots.length !== 0 &&
              doctorAvailableTimeSlot.availableSlots
                .sort((a: AvailableType, b: AvailableType) => dayjs(a.startDate).isBefore(b.startDate) ? -1 : 1)
                .map((slot: AvailableType, slotIndex: number) => {
                  return (
                    <TabPanel key={slotIndex} value={tabIndex} index={slotIndex} dir={theme.direction}>
                      <Fragment>
                        <div className='animate__animated animate__lightSpeedInRight'>
                          <Typography variant='h4'
                            sx={{
                              fontSize: { xl: '18px !important', lg: '16px !important', md: `16px !important`, sm: `17px !important`, xs: `14px !important` }
                            }}
                            className="card-title d-flex justify-content-between">
                            <span>
                              <span style={{ display: 'flex' }}>
                                Time Slots:
                              </span><br />
                              <span style={{ display: 'flex' }}>
                                From: {dayjs(slot.startDate).format('DD MMM YYYY')} &nbsp;
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
                                slotTimeKey
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
                                                    time.reservations &&
                                                      time.reservations?.length > 0 ?
                                                      <Grid container spacing={2} sx={{ padding: `5px 0px 0px 5px` }}>
                                                        {time.reservations.map((res, resIndex) => (
                                                          <Grid size={{ xs: 4 }} key={res._id}>
                                                            <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>
                                                              {dayjs(res.selectedDate).format(`DD MMM YYYY`)}
                                                            </span>
                                                            <span style={{ display: 'flex', justifyContent: 'center', paddingBottom: '5px', paddingTop: 0 }}>
                                                              {res.timeSlot?.period}
                                                            </span>
                                                            <Divider />
                                                          </Grid>
                                                        ))}
                                                      </Grid> :
                                                      ""} followCursor >
                                                    <div
                                                      className="doc-slot-list" onClick={() => {
                                                        if (time.reservations && time.reservations?.length > 0) {
                                                        }
                                                      }}>
                                                      <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                                        <p style={{ marginBottom: '-2px', color: '#000' }}>Time: {time.period}</p>
                                                        <p style={{ marginBottom: '-2px', color: '#000' }}>Price: {formatNumberWithCommas(time.price.toString())} {time.currencySymbol || 'THB'}</p>
                                                        <p style={{ marginBottom: '-2px', color: '#000' }}>Booking Fee:  {time.currencySymbol || 'THB'} {" "} {formatNumberWithCommas(time.bookingsFeePrice.toString())}</p>
                                                        <p style={{ marginBottom: '-2px', color: '#000' }}>Total Price:  {time.currencySymbol || 'THB'} {" "} {formatNumberWithCommas(time.total.toString())}</p>
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
                        </div>
                      </Fragment>
                    </TabPanel>
                  )
                })}

              {doctorAvailableTimeSlot !== null &&
                <Grid container className="submit-section" spacing={1} sx={{ mt: 2 }}>
                  <Grid size={{ lg: doctorAvailableTimeSlot._id == '' ? 12 : 6 }}>
                    <Button fullWidth className="btn btn-primary submit-btn" sx={{ boxShadow: "none", mb: 2, lineHeight: '16px' }} onClick={() => {
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
                    <Grid size={{ lg: doctorAvailableTimeSlot._id == '' ? 12 : 6 }}>
                      <Button fullWidth
                        className="btnDelete btn-primary submit-btn"
                        sx={{ boxShadow: "none", mb: 2, lineHeight: '16px' }}
                        onClick={() => { getConfirmDb() }} >

                        Delete Whole Slots
                      </Button>
                    </Grid>
                  }
                </Grid>
              }
            </> :
          <>
            <Typography component='a' >You need to add at least one schedule timing to appear in search result.</Typography>
          </>
      }

    </div>
  )
}
const DialogComponent: FC = (() => {
  const { muiVar } = useScssVar();
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const {
    showDialog,
    setShowDialog,
    editDaySlot,
    setEditDaySlot,
    doctorAvailableTimeSlot,
    setDoctorAvailableTimeSlot,
    setIsPeriodExist,
    removeMorning,
    removeAfternoon,
    removeEvening,
    handleSubmit,
    errors,
    setError
  } = useTimeSlot();

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
    const isAnyPeriodActive = data.morning.some((a: TimeType) => a.active) ||
      data.afternoon.some((a: TimeType) => a.active) ||
      data.evening.some((a: TimeType) => a.active)
    if (!isAnyPeriodActive) {
      setError('needActiveAtLeastOne', { message: 'Need Active At Least One TimeSlot.' })
    } else {
      document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
      setTimeout(() => {
        setShowDialog(false)
        setDoctorAvailableTimeSlot((prevState: DoctorsTimeSlotType | null) => {
          if (prevState == null) {
            prevState = {
              _id: '',
              doctorId: userDoctorProfile?._id as string,
              createDate: new Date(),
              updateDate: new Date(),
              availableSlots: []
            }
          }
          let indexOfStartDate = prevState.availableSlots.findIndex((s: AvailableType) => dayjs(s.startDate).isSame(editDaySlot!.startDate))
          let indexOfFinishDate = prevState.availableSlots.findIndex((s: AvailableType) => dayjs(s.finishDate).isSame(editDaySlot!.finishDate))
          const calculateTotalPrice = (array: TimeType[]) => {
            array.map((a: TimeType) => {
              if (a.price !== 0) {
                a.total = +(a.price * (1 + a.bookingsFee / 100)).toFixed(2);
                a.bookingsFeePrice = +(a.price * (a.bookingsFee / 100)).toFixed(2)
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
        removeMorning();
        removeAfternoon();
        removeEvening();
      }, 500);
    }
  }

  return (
    <BootstrapDialog
      sx={{ marginTop: 4 }}
      onClose={(_event: object, reason: string) => {
        if (reason !== 'backdropClick') {
          document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
          setTimeout(() => {
            setShowDialog(false)
            setEditDaySlot(null)
            removeMorning();
            removeAfternoon();
            removeEvening();
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
            removeMorning();
            removeAfternoon();
            removeEvening();
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
          <FormHelperText error>{errors.needActiveAtLeastOne && errors['needActiveAtLeastOne']['message'] as ReactNode}</FormHelperText>
          <div className="add-more mb-3" > </div>
          <div className="submit-section text-center">
            <DialogButton />
          </div>
        </form>
      </DialogContent>
    </BootstrapDialog>
  )
})

const SelectCheckBox = ({ period }: { period: 'morning' | 'afternoon' | 'evening' }) => {
  const {
    control,
    clearErrors,
    setError,
    errors,
    watch,
    setFormValue,
    morningFields,
    replaceMorning,
    updateMorning,
    afternoonFields,
    replaceAfternoon,
    updateAfternoon,
    eveningFields,
    replaceEvening,
    updateEvening,
  } = useTimeSlot();
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  let periodArray = period == 'morning' ? morningFields : period == 'afternoon' ? afternoonFields : eveningFields as TimeType[];
  let capitalPeriod: string = `${period.charAt(0).toUpperCase()}${period.slice(1)}`
  let updateFunction = period == 'morning' ? updateMorning : period == 'afternoon' ? updateAfternoon : updateEvening
  const selectAllClick = (period: string) => {
    let periodArray = period == 'morning' ? morningFields : period == 'afternoon' ? afternoonFields : eveningFields as TimeType[];
    let replaceFunction = period == 'morning' ? replaceMorning : period == 'afternoon' ? replaceAfternoon : replaceEvening
    if (periodArray.every((a: TimeType) => a.active)) {
      periodArray.map((a: TimeType) => a.active = false)
    } else {
      periodArray.map((a: TimeType) => a.active = true)
    }

    replaceFunction([...periodArray]);
    [...morningFields, ...afternoonFields, ...eveningFields].some((a: TimeType) => a.active) ?
      clearErrors('needActiveAtLeastOne') :
      setError('needActiveAtLeastOne', { message: 'Need Active At Least One TimeSlot.' })

  }

  return (
    <>
      {
        periodArray.length > 0 &&
        <Fragment>
          <Divider>{capitalPeriod} </Divider>
          <Grid container >
            <Grid size={{ xl: 6, lg: 6, md: 6, sm: 12, xs: 12 }}>

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
            {/* && periodArray.every(item => item.price === periodArray[0].price) */}
            {periodArray.every(a => a.active) && <Grid size={12}>

              <Controller
                name={period}
                control={control}
                render={(props: any) => {
                  const allPricesEqual = periodArray.every(item => item.price === periodArray[0].price);
                  const { field } = props;
                  const { value: fieldValue } = field;
                  return (
                    <NumericFormat
                      key={`${period}`}
                      value={allPricesEqual ? fieldValue[0]?.price == 0 ? '' : fieldValue[0]?.price : ''}
                      thousandSeparator
                      customInput={TextField}
                      isAllowed={(values) => {
                        const { floatValue } = values;
                        return floatValue === undefined || floatValue >= 0; // Prevent negative values
                      }}
                      onClick={() => {
                        let myInput = document.getElementById(`${period}`)!;
                        myInput.focus();
                        myInput.autofocus = true;
                      }}
                      onChange={(e) => {
                        e.target.focus();
                        e.target.autofocus = true;
                      }}

                      onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        // Return false for invalid keys like '-' or any other disallowed keys
                        if (e.key === '-' || e.key === 'e' || e.key === '+') {
                          e.preventDefault();
                          return false;
                        }
                      }}
                      onValueChange={(values) => {
                        const { floatValue } = values;
                        if (!floatValue) {
                          periodArray.forEach((_p, i) => {
                            setFormValue(`${period}.${i}.price`, 0)
                          })

                        } else {
                          periodArray.forEach((_p, i) => {

                            setFormValue(`${period}.${i}.price`, floatValue)
                          })
                        }
                      }}
                      {...{
                        required: true,
                        id: `${period}`,
                        label: 'Price',
                        fullWidth: true,
                        size: 'small',
                        inputProps: {
                          autoComplete: 'off'
                        },
                        InputProps: {
                          endAdornment: <InputAdornment position="end">
                            {` ${userDoctorProfile?.currency[0]?.currency} `}
                          </InputAdornment>
                        }
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
                    <Grid size={{ xl: 4, lg: 4, md: 4, sm: 4, xs: 6 }} key={i} >
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
                            [...watch('morning'), ...watch('afternoon'), ...watch('evening')].some((a: TimeType) => a.active) ?
                              clearErrors('needActiveAtLeastOne') :
                              setError('needActiveAtLeastOne', { message: 'Need Active At Least One TimeSlot' })
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
                          },
                          "& .MuiStack-root": {
                            minWidth: { xl: '115px' }
                          }
                        }} />
                      {
                        timeObjec.active &&
                        <Controller
                          rules={{
                            required: "This field is required",
                            validate: (value) => value > 0 || 'Price should be greater than Zero.',
                          }}
                          name={`${period}.${i}.price`}
                          control={control}
                          render={(props: any) => {
                            const { field } = props;
                            const { value: fieldValue } = field;
                            return (
                              <NumericFormat
                                key={`${i} ${JSON.stringify(timeObjec)}`}
                                value={fieldValue == 0 ? "" : fieldValue}
                                thousandSeparator
                                customInput={TextField}
                                isAllowed={(values) => {
                                  const { floatValue } = values;
                                  return floatValue === undefined || floatValue >= 0; // Prevent negative values
                                }}
                                onClick={() => {
                                  let myInput = document.getElementById(`${i} ${JSON.stringify(timeObjec)}`)!;
                                  myInput.focus();
                                  myInput.autofocus = true;
                                }}
                                onChange={(e) => {
                                  e.target.focus();
                                  e.target.autofocus = true;
                                }}
                                onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                  // Return false for invalid keys like '-' or any other disallowed keys
                                  if (e.key === '-' || e.key === 'e' || e.key === '+') {
                                    e.preventDefault();
                                    return false;
                                  }
                                }}
                                onValueChange={(values) => {
                                  const { floatValue } = values;
                                  if (!floatValue) {
                                    setFormValue(`${period}.${i}.price`, 0)
                                  } else {
                                    setFormValue(`${period}.${i}.price`, floatValue)
                                  }
                                }}
                                {...{
                                  // autoFocus: true,
                                  // ref: ref,
                                  required: true,
                                  id: `${i} ${JSON.stringify(timeObjec)}`,
                                  label: 'Price',
                                  fullWidth: true,
                                  error: (errors[period] as Record<number, any>)?.[i]?.price !== undefined,
                                  helperText: (errors[period] as Record<number, any>)?.[i]?.price?.message as ReactNode,
                                  size: 'small',
                                  inputProps: {
                                    autoComplete: 'off'
                                  },
                                  InputProps: {
                                    endAdornment: <InputAdornment position="end">
                                      {`${userDoctorProfile?.currency[0]?.currency}`}
                                    </InputAdornment>
                                  }
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


export const formatNumberWithCommas = (number: string) => {
  // Check if the input is a valid number (or can be converted to one)
  const num = Number(number);
  if (isNaN(num)) {
    return number; // Return the original input if it's not a number
  }

  return num.toLocaleString();
}
// --- Helper Functions ---

// Format a given date using dayjs.
const formatDate = (date: Date | string, formatStr: string) =>
  dayjs(date).format(formatStr);

// Create a unique key based on the startDate.
const getDateKey = (date: Date | string) =>
  formatDate(date, 'DDMMYYYY');

// Convert an available slot into a calendar range.
const convertSlotToCalendarRange = (element: AvailableType) => {
  const formattedStartDay = formatDate(element.startDate, 'YYYY/MM/DD');
  const formattedFinishDay = formatDate(element.finishDate, 'YYYY/MM/DD');
  return [new DateObject(formattedStartDay), new DateObject(formattedFinishDay)];
};

// Determine if any period (morning, afternoon, evening) is active.
const isAnyPeriodActive = (element: AvailableType) => {
  const hasActive = (period: Array<{ active: boolean }>) =>
    period.length > 0 && period.some((slot) => slot.active);
  return hasActive(element.morning) || hasActive(element.afternoon) || hasActive(element.evening);
};

// Check if a period exists (i.e. the period array is non-empty).
const doesPeriodExist = (element: AvailableType, period: 'morning' | 'afternoon' | 'evening') =>
  element[period].length > 0;

// Generic function to update check states for a specific period.
const updatePeriodCheckState = (newAvailableSlotFromDb: AvailableType[], period: 'morning' | 'afternoon' | 'evening') =>
  newAvailableSlotFromDb.reduce<{ [key: string]: boolean }>((acc, element) => {
    acc[getDateKey(element.startDate)] = doesPeriodExist(element, period);
    return acc;
  }, {});

const ReservationsComponent: FC = () => {
  const theme = useTheme();
  const {
    rowCount,
    rows,
    isLoading,
    filterModel,
    setMongoFilterModel,
    onFilterChange,
    dataGridRef,
    boxMinHeight,
    setBoxMinHeight,
    sortModel,
    setSortModel,
    paginationModel,
    setPaginationModel,
    columnVisibilityModel,
    setColumnVisibilityModel, } = useTimeSlot();

  const columns: GridColDef[] = useMemo(() => {
    return [
      {
        field: "id",
        headerName: "ID",
        width: 100,
        align: 'center',
        headerAlign: 'center',
        type: 'number',
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().number,
        valueGetter: (_, row) => {
          return row?.id
        },
      },
      {
        field: "createdDate",
        headerName: 'Reserve Day',
        width: 170,
        flex: 1,
        sortable: true,
        searchAble: true,
        align: 'center',
        headerAlign: 'center',
        type: 'date',
        filterOperators: createCustomOperators().date,
        valueFormatter: (_, row) => {
          return `${dayjs(row?.createdDate).tz(process.env.NEXT_PUBLIC_TZ).format('YYYY MMM DD HH:mm')}`
        },
      },
      {
        field: 'dayPeriod',
        headerName: 'Day Time',
        width: 110,
        align: 'center',
        headerAlign: 'center',
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        valueGetter: (_, row) => {
          return row?.dayPeriod.charAt(0).toUpperCase() + row?.dayPeriod.slice(1)
        }
      },
      {
        field: 'invoiceId',
        headerName: 'Invoice No',
        width: 200,
        flex: 1,
        align: 'center',
        headerAlign: 'center',
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        renderCell(params: GridRenderCellParams) {
          const { row } = params
          return <Link href={`/doctors/dashboard/invoice-view/${btoa(row?._id!)}`}>{row?.invoiceId}</Link>
        }
      },
      {
        field: 'selectedDate',
        headerName: `Selected Date`,
        align: 'center',
        width: 200,
        type: 'dateTime',
        searchAble: true,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().date,
        headerAlign: 'center',
        valueGetter: (_, row) => {
          return new Date(row?.selectedDate)
        },
        sortComparator: (v1: any, v2: any) => dayjs(v1).isAfter(dayjs(v2).format('YYYY MM DD HH:mm'), 'minutes') ? 1 : -1,
        renderCell: (params) => {
          const { row } = params
          return (
            <Stack sx={{ height: '100%', justifyContent: 'center' }}>
              <span className="user-name" style={{ justifyContent: 'center', display: 'flex' }}>{dayjs(row?.selectedDate).format(`DD MMM YYYY`)}</span>
              <span className="d-block">{row?.timeSlot?.period}</span>
            </Stack>
          )
        }
      },
      {
        field: 'patientProfile.fullName',
        headerName: 'Patient Name',
        width: 200,
        flex: 1,
        headerAlign: 'center' as GridAlignment,
        searchAble: false,
        sortable: true,
        filterable: true,
        filterOperators: createCustomOperators().string,
        sortComparator: (v1: any, v2: any) => v1.toLowerCase() > v2.toLowerCase() ? 1 : -1,
        renderCell: (params: GridRenderCellParams) => {
          const { row } = params;
          const profileImage = row?.patientProfile?.profileImage == '' ? patient_profile : row?.patientProfile?.profileImage
          const online = row?.patientProfile?.online || false
          return (
            <span style={{ minWidth: "100%", display: 'flex', alignItems: 'center' }}>
              <Link className="avatar mx-2" onClick={() => {
                sessionStorage.setItem('doctorPatientTabValue', '0')
              }} href={`/doctors/dashboard/patient-profile/${btoa(row?.patientId)}`}>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  online={online}
                  idle={row?.patientProfile?.lastLogin?.idle}
                >
                  <Avatar alt="" src={`${profileImage}`} >
                    <img src={patient_profile} alt="" className="avatar avatar-in-schedule-table" />
                  </Avatar>
                </StyledBadge></Link>
              <Link onClick={() => {
                sessionStorage.setItem('doctorPatientTabValue', '0')
              }} href={`/doctors/dashboard/patient-profile/${btoa(row?.patientId)}`} >{`${row?.patientProfile?.gender == '' ? '' : row?.patientProfile?.gender + '.'}`}{row?.patientProfile?.fullName}</Link>
            </span>
          )
        }
      },
      {
        field: 'doctorPaymentStatus',
        headerName: `Payment status`,
        width: 180,
        flex: 1,
        sortable: true,
        searchAble: true,
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
                sx={{ color: theme.palette.primary.contrastText, }} />
            </>
          )
        }
      },
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleChangePage = (
    _event: any | null,
    newPage: number) => {
    setPaginationModel((prevState) => {
      return {
        ...prevState,
        page: newPage - 1
      }
    })
  }


  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPaginationModel((prevState) => {
      var maximuPage: number = prevState.page;
      if (rowCount !== 0) {
        if ((maximuPage + 1) >= (Math.ceil(rowCount / parseInt(event.target.value, 10)))) {
          maximuPage = (Math.ceil(rowCount / parseInt(event.target.value, 10))) - 1
        }
      }
      return {
        page: maximuPage <= 0 ? 0 : maximuPage,
        pageSize: parseInt(event.target.value, 10)
      }
    })
  }
  useEffect(() => {
    const updateDbFilter = (filterModel: GridFilterModel) => {
      const value = filterModel.items[0]?.value;
      if (value && value !== '0' && value !== '') {
        const mongoQuery = convertFilterToMongoDB(filterModel, columns);
        setMongoFilterModel(mongoQuery);
      } else {
        setMongoFilterModel({})
      }
    }
    globalFilterFunctions.applyFilters = updateDbFilter;
    removeMongoFilter(filterModel)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, filterModel])


  useEffect(() => {
    setTimeout(() => {
      if (dataGridRef?.current) {
        setBoxMinHeight(`${dataGridRef.current.clientHeight}px`);
      }
    }, 100);
  }, [paginationModel.pageSize, isLoading, dataGridRef, setBoxMinHeight]);


  //Update page for pagination model in case last page delete or result less than page
  useEffect(() => {
    const totalCount = rowCount;
    const totalPages = Math.ceil(totalCount / paginationModel.pageSize);
    const isOutOfRange = paginationModel.page >= totalPages;

    if (rowCount !== 0) {
      if (isOutOfRange) {
        setPaginationModel((prevState: { page: number, pageSize: number }) => ({
          ...prevState,
          page: Math.max(0, totalPages - 1), // Ensures page never goes below 0
        }));
      }
    } else {
      setPaginationModel((prevState: { page: number, pageSize: number }) => ({
        ...prevState,
        page: 0, // Ensures page never goes below 0
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel.page, paginationModel.pageSize, rowCount])

  const handelFilterModelChange = useCallback((newFilterModel: GridFilterModel) => {
    onFilterChange(newFilterModel);
  }, [onFilterChange])


  const removeMongoFilter = (filterModel: GridFilterModel) => {
    if (filterModel.items.length == 0) { setMongoFilterModel({}) }
    const value = filterModel.items[0]?.value;
    if (!value && value == 0 && value == '') {
      setMongoFilterModel({})
    }
  }
  return (
    <Fragment>
      {
        isLoading ?
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <Box sx={{ minHeight: boxMinHeight }} className="dataGridOuterBox">
                  <LoadingComponent boxMinHeight={boxMinHeight} />
                </Box>
              </div>
            </div>
          </div> :
          <div className="card">
            <div ref={dataGridRef} className="tab-content schedule-cont">
              <Box className="dataGridOuterBox" >
                <Typography className="totalTypo"
                  variant='h5' align='center' gutterBottom >
                  {
                    rowCount !== 0 ?
                      `Total Reservations: ${rowCount}` :
                      `Not any Reservations yet`
                  }
                </Typography>
                <div className="table-responsive" style={{ height: paginationModel?.pageSize == 5 ? 600 : 1000, width: '100%' }}>


                  <DataGrid
                    rowHeight={80}
                    paginationMode='server'
                    filterMode="server"
                    // dont mode server and handle in client side sorting toosortingMode="server"
                    sortModel={sortModel}
                    onSortModelChange={(model: GridSortModel) => {
                      if (model.length > 0) {
                        setSortModel((_prev: GridSortModel) => [...model]);
                      }
                    }}
                    sortingOrder={['desc', 'asc']}
                    filterModel={filterModel}
                    onFilterModelChange={handelFilterModelChange}
                    columnVisibilityModel={columnVisibilityModel}
                    onColumnVisibilityModelChange={(newModel) => {
                      setColumnVisibilityModel(newModel)
                    }}
                    loading={isLoading}
                    showToolbar
                    slots={{
                      toolbar: CustomToolbar as CustomToolbarSlotType,

                      pagination: CustomPagination as CustomPaginationSlotType,
                      noResultsOverlay: CustomNoRowsOverlay,
                      noRowsOverlay: CustomNoRowsOverlay
                    }}
                    slotProps={{
                      toolbar: {
                        printOptions: { disableToolbarButton: true },
                        deleteId: [],
                        deleteClicked: () => { },
                        columnVisibilityModel: columnVisibilityModel,
                      } as CustomToolbarPropsType,
                      pagination: {
                        onRowsPerPageChange: handleChangeRowsPerPage,
                        page: paginationModel.page,
                        rowsPerPage: paginationModel.pageSize,
                        onPageChange: handleChangePage,
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
                    rows={rows}
                    rowCount={rowCount}
                    columns={columns}
                    disableRowSelectionOnClick
                    paginationModel={paginationModel}
                    pageSizeOptions={[5, 10]}
                    showCellVerticalBorder
                    showColumnVerticalBorder
                    sx={{
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
                      "& .MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel": {
                        marginTop: "1em",
                        marginBottom: "1em"
                      },
                      "& .MuiDataGrid-footerContainer": {
                        [theme.breakpoints.only("xs")]: {
                          justifyContent: 'center',
                          marginBottom: '2px'
                        }
                      }
                    }}
                  />
                </div>
              </Box>
            </div>
          </div>
      }
    </Fragment>
  )
}
export default ScheduleTiming