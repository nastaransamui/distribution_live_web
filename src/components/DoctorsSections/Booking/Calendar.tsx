import { FC, Fragment, useEffect, useMemo, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'


import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Calendar as CalendarComponent, DateObject } from "react-multi-date-picker"
import { AvailableType, TimeType, afterNoonFinish, afterNoonStart, eveningFinish, eveningStart, formatNumberWithCommas, morningFinish, morningStart } from '@/components/DoctorDashboardSections/ScheduleTiming';
import type { Dayjs, ManipulateType } from 'dayjs';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
//utilites
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { LoginBox } from '@/components/AuthSections/LoginSection';
import { useRouter } from 'next/router';
import _ from 'lodash'
import { Transition } from '@/components/shared/Dialog';
import { loadStylesheet } from '@/pages/_app';
import { disablePastTime } from '@/components/DoctorDashboardSections/Invoices';
import { BookingTimeSlotType } from './BookingPage';
import { toast } from 'react-toastify';
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';
import CountdownTimer from '@/components/shared/CountdownTimer';
export function dayjsRange(start: Dayjs, end: Dayjs, unit: ManipulateType) {
  const range = [];
  let current = start;
  while (!current.isAfter(end)) {
    range.push(current);
    current = current.add(1, unit);
  }
  return range;
}


export interface OccupyTimeType {
  _id?: string;
  timeSlot: TimeType;
  selectedDate: Date;
  dayPeriod: string;
  doctorId: string;
  patientId: string;
  startDate: Date;
  finishDate: Date,
  slotId: string,
  expireAt: Date,
}
export interface AppointmentReservationType {
  _id?: string;
  timeSlot: TimeType;
  selectedDate: Date;
  dayPeriod: string;
  doctorId: string;
  startDate: Date;
  finishDate: Date;
  slotId: string;
  patientId: string;
  paymentToken: string;
  paymentType: string;
}


const Calendar: FC<{ bookingTimeSlot: BookingTimeSlotType }> = (({ bookingTimeSlot }) => {
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const dispatch = useDispatch();
  dayjs.extend(isBetween)
  const { muiVar, bounce } = useScssVar();
  const theme = useTheme();
  const router = useRouter();
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  useEffect(() => {
    if (remainingTime !== null) {
      const interval = setInterval(() => {
        setRemainingTime((prev) => (prev && prev > 1000 ? prev - 1000 : 0));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [remainingTime]);
  const [calendarValue, setCalendarValue] = useState<any>()
  const widthOnlyXl = useMediaQuery(theme.breakpoints.only('xl'));
  const widthOnlyLg = useMediaQuery(theme.breakpoints.only('lg'));
  const widthOnlySm = useMediaQuery(theme.breakpoints.only('sm'));
  const widthOnlyXs = useMediaQuery(theme.breakpoints.only('xs'));
  const minWidth767max991 = useMediaQuery('@media (min-width:767px) and (max-width: 991px)');
  const [loginDialog, setLoginDialog] = useState<boolean>(false)
  useEffect(() => {
    loadStylesheet('/css/react-multi-date-picker-bg-dark.min.css');
  }, [])
  const availableDates = useMemo(() => {
    let days: any = []
    bookingTimeSlot?.availableSlots.forEach((available: AvailableType, i: number) => {
      let availableDates = dayjsRange(
        dayjs(available.startDate),
        dayjs(available.finishDate),
        'day'
      ).map((a) =>
        dayjs(a).format()
      )
      days.push(...availableDates)
    })
    return days
  }, [bookingTimeSlot])
  const [occupyTime, setOccupyTime] = useState<OccupyTimeType>()
  const calendarMapDays = (params: any) => {
    const { date, isSameDate }: { date: any, selectedDate: any[], isSameDate: Function } = params;
    let props = {} as any
    let isWeekend = [0, 6].includes(date.weekDay.index)
    if (isWeekend) {
      props.style = { color: 'red' }
    }

    availableDates.forEach((a: any) => {
      if (dayjs(date.format('')).isSame(dayjs(a).format(''), 'day')) {
        props.style = {
          ...props.style,
          color: isWeekend ? 'crimson' : theme.palette.primary.contrastText,
          backgroundColor: theme.palette.primary.light,
          fontWeight: "bold",
          border: `1px solid ${theme.palette.secondary.main}`
        }
      }
      if (calendarValue) {
        if (isSameDate(calendarValue, date)) {
          props.style = {
            ...props.style,
            backgroundColor: theme.palette.secondary.main,
          }
        }
      }
    })
    return { ...props }

  }

  const calendarOnChange = (dateObject: any | null,) => {
    if (dateObject) {
      availableDates.forEach((a: any) => {
        if (dayjs(a).isSame(dayjs(dateObject), 'day')) {
          setCalendarValue(dateObject)
        }
      })
      return false;
    }
  }


  useEffect(() => {
    if (occupyTime && !calendarValue) {
      setCalendarValue(new DateObject(dayjs(occupyTime?.selectedDate).format('YYYY/MM/DD')))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [occupyTime])

  const periodButtonClick = (e: any, timeSlot: TimeType, isSelect: boolean, slot: AvailableType, dayPeriod: string) => {

    e.preventDefault();

    if (isSelect) {
      setOccupyTime(undefined);
    } else {
      setOccupyTime(() => ({
        timeSlot,
        selectedDate: dayjs.tz(calendarValue, process.env.NEXT_PUBLIC_TZ).startOf('day').toDate(),
        dayPeriod: dayPeriod,
        doctorId: bookingTimeSlot?.doctorId,
        patientId: userProfile?._id!,
        startDate: dayjs(slot?.startDate).toDate(),
        finishDate: dayjs(slot?.finishDate).toDate(),
        slotId: bookingTimeSlot?._id!,
        expireAt: bookingTimeSlot.occupyTime[0]?.expireAt
      }))
    }

  }

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

  const nextButtonClick = () => {
    dispatch(updateHomeFormSubmit(true))
    if (homeSocket?.current && occupyTime) {
      occupyTime.timeSlot.reservations = []
      homeSocket.current.emit(`createOccupyTime`, occupyTime)
      homeSocket.current.once(`createOccupyTimeReturn`, (msg: { status: number, newOccupy: OccupyTimeType, reason?: string, message?: string }) => {

        const { status, reason, message } = msg;
        if (status == 409) {
          toast.error(message, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: bounce,
            toastId: "409-toast",
            onClose: () => {
              toast.dismiss('409-toast')
              dispatch(updateHomeFormSubmit(false))
            }
          });
        } else
          if (status !== 200) {
            toast.error(reason || `Error ${status} find Doctor`, {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              transition: bounce,
              toastId: "booking-toast",
              onClose: () => {
                router.back();
                toast.dismiss('booking-toast')
                dispatch(updateHomeFormSubmit(false))
              }
            });
          } else {
            // dispatch(updateHomeFormSubmit(false))
            const { newOccupy } = msg;
            router.push(`/doctors/check-out/${btoa(newOccupy._id!)}`)
          }
      })
    }
  }

  const deleteOccupationFromDb = (deleteIds: string[]) => {
    dispatch(updateHomeFormSubmit(true))
    if (homeSocket?.current) {
      homeSocket.current.emit(`deleteOccupyTime`, { deleteIds: deleteIds })
      homeSocket.current.once(`deleteOccupyTimeReturn`, (msg: { status: number, reason?: string, message?: string }) => {

        const { status, reason, message } = msg;
        if (status !== 200) {
          toast.error(reason || message || `Error ${status} find Doctor`, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: bounce,
            toastId: "delete-toast",
            onClose: () => {
              router.back();
              toast.dismiss('delete-toast')
              dispatch(updateHomeFormSubmit(false))
            }
          });
        } else {
          dispatch(updateHomeFormSubmit(false))

        }
      })
    }
  }
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsClient(true), 20);

    return () => {
      setIsClient(false)
    }
  }, [])
  return (
    <Fragment>
      <div className={`col-md-12 col-lg-12 col-xl-12 ${isClient ? 'animate__animated animate__zoomInDown' : 'pre-anim-hidden'}`} style={muiVar}>
        <div className="booking-header">
          <h1 className="booking-title">Select Available Slots</h1>
        </div>
        <div className="card booking-card">
          <div className="card-body time-slot-card-body">
            <div className="schedule-header">
              <div className="row">
                <div className="col-md-12">
                  <div className="day-slot">
                    <CalendarComponent
                      minDate={dayjs().toDate()}
                      highlightToday={true}
                      numberOfMonths={widthOnlyXl ? 4 : widthOnlyLg ? 3 : minWidth767max991 ? 2 : widthOnlySm ? 2 : widthOnlyXs ? 1 : 2}
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
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row" style={{ marginTop: 40 }}>
              {
                !calendarValue ? <div className="col-lg-12 col-md-12" style={{ display: 'flex', justifyContent: 'center', marginBottom: 30, color: theme.palette.secondary.main }}>
                  Select available date to continue
                </div> :
                  <>
                    <div className="col-lg-12 col-md-12" style={{ display: 'flex', justifyContent: 'center', marginBottom: 30, color: theme.palette.secondary.main }}>
                      {calendarValue && dayjs(calendarValue).format(`MMMM D, YYYY`)}
                    </div>

                    {calendarValue &&
                      bookingTimeSlot?.availableSlots.map((slot: AvailableType, slotIndex: number) => {
                        if (dayjs(calendarValue.format('')).isBetween(dayjs(slot.startDate).format(''), dayjs(slot.finishDate).format(''), 'day', "[]")) {
                          return (
                            <Grid key={slotIndex} container direction="column">
                              {
                                Object.entries(slot).map((entrie, j) => {
                                  let smallText = entrie[0] == 'morning' ?
                                    `${dayjs(morningStart).minute(0).format('HH:mm')} to ${dayjs(morningFinish).minute(0).format('HH:mm')}` :
                                    entrie[0] == 'afternoon' ?
                                      `${dayjs(afterNoonStart).minute(0).format('HH:mm')} to ${dayjs(afterNoonFinish).minute(0).format('HH:mm')}` :
                                      `${dayjs(eveningStart).minute(0).format('HH:mm')} to ${dayjs(eveningFinish).minute(0).format('HH:mm')}`
                                  let slotTimeKey: 'morning' | 'afternoon' | 'evening' | undefined
                                  if (Array.isArray(entrie[1])) {
                                    slotTimeKey = entrie[0] as 'morning' | 'afternoon' | 'evening'
                                  }
                                  if (Array.isArray(entrie[1]) && entrie[1].length > 0) {
                                    const atListOneActive = entrie[1].some((a) => a.active);
                                    if (atListOneActive)
                                      return (
                                        <div key={slotIndex.toString() + j.toString()} className="time-slot time-slot-blk">
                                          <Fragment >
                                            {
                                              <Divider variant="middle" sx={{ m: 2 }}>
                                                <Typography variant="body1">
                                                  {entrie[0].charAt(0).toUpperCase()}{entrie[0].slice(1)}<br />
                                                  <small style={{ marginTop: -10 }}>{smallText}</small>
                                                </Typography>
                                              </Divider>
                                            }
                                            <div className="time-slot-list">
                                              <ul style={{ display: 'flex', flexWrap: 'wrap' }}>
                                                {
                                                  entrie[1].map((newTimeslot: TimeType, i: number) => {
                                                    if (newTimeslot.active) {
                                                      let isSelect = _.isEqual(newTimeslot, occupyTime?.timeSlot)
                                                        &&
                                                        dayjs(occupyTime?.selectedDate).isSame(dayjs(calendarValue), 'day')
                                                      const selectedDate = dayjs(calendarValue).format(`DD MMM YYYY`);
                                                      const period = newTimeslot.period;
                                                      let isPassed: boolean = !disablePastTime(selectedDate, period);
                                                      let isBooked: boolean = false;
                                                      if (newTimeslot.reservations && newTimeslot.reservations.length > 0) {
                                                        newTimeslot.reservations.forEach((elem) => {
                                                          if (dayjs(elem.selectedDate).format('DD MMM YYYY') == calendarValue.format('')) {
                                                            if (elem.timeSlot.period == period) {
                                                              isBooked = true
                                                            }
                                                          }

                                                        })
                                                      }
                                                      const isOccupied = bookingTimeSlot.occupyTime.some(
                                                        (occupy) => occupy.timeSlot.period === newTimeslot.period && dayjs(occupy.selectedDate).isSame(dayjs(calendarValue), 'day')

                                                      );
                                                      const patientHasOccupiedTime = bookingTimeSlot?.occupyTime?.filter((a) => `${dayjs(a.selectedDate).format('DD MMM YYYY')} ${a?.timeSlot?.period}` == `${selectedDate} ${period}`).some(
                                                        (occupy) => occupy.patientId === userProfile?._id
                                                      )
                                                      const occupyTimeDeleteArrayOfIds = bookingTimeSlot.occupyTime
                                                        .filter((a) => a.patientId == userProfile?._id)
                                                        .map((a) => a._id)
                                                        .filter(Boolean) as string[]
                                                      const occupiedPeriod = bookingTimeSlot.occupyTime.filter((a) => a.patientId == userProfile?._id).map((a) => `${dayjs(a.selectedDate).format('DD MMM YYYY')} ${a?.timeSlot?.period}`).join(', ')
                                                      const dayAndPeriodOfOcupy = bookingTimeSlot.occupyTime.map((a) => `${dayjs(a.selectedDate).format('DD MMM YYYY')} ${a?.timeSlot?.period}`).join(', ')
                                                      const eachDayAndPeriod = `${dayjs(calendarValue).format('DD MMM YYYY')} ${newTimeslot.period}`
                                                      const disableExactOccupy = eachDayAndPeriod == dayAndPeriodOfOcupy
                                                      const disabled = isPassed
                                                        ? true
                                                        : isBooked
                                                          ? true
                                                          : patientHasOccupiedTime
                                                            ? false // Allow action for the user's occupied time
                                                            : bookingTimeSlot.occupyTime.some((a) => a.patientId === userProfile?._id)
                                                              ? true // If the user has any occupied time, disable all other buttons
                                                              : disableExactOccupy; // Otherwise, allow selection
                                                      return (
                                                        <li style={{ width: 'inherit' }} key={slotIndex.toString() + " " + j.toString() + i.toString()}>
                                                          <Tooltip placement='top' arrow title={
                                                            isPassed ?
                                                              'This time is Passed' :
                                                              isBooked ? "This period is reserved." :
                                                                isOccupied ?
                                                                  patientHasOccupiedTime ? `You need to finish or remove this in process booking first.` :
                                                                    "There is booking in process." :
                                                                  bookingTimeSlot.occupyTime.some((a) => a.patientId === userProfile?._id) ? `You have appointment that in process on ${occupiedPeriod} and not finish yet first remove that.` :
                                                                    ""}>
                                                            <span>
                                                              <Button
                                                                disabled={disabled}
                                                                className={`timing ${isSelect ? 'active' : ' '}`}
                                                                sx={{
                                                                  bgcolor: isBooked ? `${theme.palette.primary.main} !Important` : isOccupied ? '#ffa500 !important' : '',
                                                                  color: theme.palette.text.color,
                                                                  display: 'flex', flexDirection: 'column'
                                                                }}
                                                                onClick={(e) => {
                                                                  if (isOccupied) {
                                                                    deleteOccupationFromDb(occupyTimeDeleteArrayOfIds)
                                                                  } else {
                                                                    periodButtonClick(e, newTimeslot, isSelect, slot, entrie[0])
                                                                  }
                                                                }}>
                                                                <span><i className={isPassed ? "feather-x-circle" : "feather-clock"} />{period}</span>
                                                                <span>{formatNumberWithCommas(newTimeslot.total.toString())} {" "} {newTimeslot.currencySymbol || 'THB'}</span>

                                                              </Button>
                                                              {isOccupied &&
                                                                <>
                                                                  {
                                                                    bookingTimeSlot?.occupyTime
                                                                      .filter((a) => {
                                                                        return `${dayjs(a.selectedDate).format('DD MMM YYYY')} ${a?.timeSlot?.period}` == `${selectedDate} ${period}`
                                                                      })
                                                                      .map((a) => {
                                                                        return (
                                                                          <CountdownTimer key={a._id} expireAt={a?.expireAt} />
                                                                        )
                                                                      })
                                                                  }
                                                                </>
                                                              }
                                                            </span>
                                                          </Tooltip>
                                                        </li>
                                                      )
                                                    }
                                                  })
                                                }
                                              </ul>
                                            </div>
                                          </Fragment>
                                        </div>
                                      )

                                  }
                                })
                              }
                            </Grid>
                          )
                        }
                      })
                    }</>
              }
            </div>
          </div>
        </div>
        <div className="submit-section proceed-btn text-end" style={{ marginTop: 40 }}>
          {
            occupyTime &&
            <Button
              disabled={bookingTimeSlot?.doctorProfile?._id === userProfile?._id || userProfile?.roleName == 'doctors'}
              onClick={(e) => {
                e.preventDefault()
                if (!userProfile || bookingTimeSlot?.doctorProfile?._id === userProfile?._id) {
                  setLoginDialog(true)
                } else {
                  nextButtonClick()
                }
              }}
              className="btn btn-primary prime-btn justify-content-center align-items-center">
              {!userProfile ? `Login to reserve` :
                bookingTimeSlot?.doctorProfile?._id === userProfile?._id ?
                  `You can't reserve to your own account.` :
                  userProfile?.roleName == 'doctors' ?
                    `You can't reserve with doctor user please create patient user.` :
                    <>Next <i className="feather-arrow-right-circle" />
                    </>}
            </Button>
          }
        </div>
      </div>

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
      >
        <DialogTitle id="login">Login</DialogTitle>
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

export default Calendar;