import { FC, Fragment, useEffect, useMemo, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';


import { useTheme } from '@mui/material';
import { addDays } from 'date-fns';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DoctorProfileType } from '@/components/SearchDoctorSections/SearchDoctorSection';
import { Calendar as CalendarComponent, DateObject } from "react-multi-date-picker"
import { AvailableType, TimeType, afterNoonFinish, afterNoonStart, eveningFinish, eveningStart, formatNumberWithCommas, morningFinish, morningStart } from '@/components/DoctorDashboardSections/ScheduleTiming';
import type { Dayjs, ManipulateType } from 'dayjs';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button'
//utilites
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { LoginBox } from '@/components/AuthSections/LoginSection';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import { base64regex } from '@/components/DoctorsSections/Profile/ProfilePage';
import _ from 'lodash'
import { Transition } from '@/components/shared/Dialog';
import isJsonString from '@/helpers/isJson';
import { loadStylesheet } from '@/pages/_app';
import { disablePastTime } from '@/components/DoctorDashboardSections/Accounts';
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
  timeSlot: TimeType;
  selectedDate: Date;
  dayPeriod: string;
  doctorId: string;
  startDate: Date;
  finishDate: Date,
  slotId: String,
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

const Calendar: FC<{ profile: DoctorProfileType }> = (({ profile }) => {
  const userProfile = useSelector((state: AppState) => state.userProfile.value)

  dayjs.extend(isBetween)
  const { muiVar } = useScssVar();
  const theme = useTheme();
  const router = useRouter()
  const searchParams = useSearchParams()
  const encryptReservation = searchParams.get('reservation')
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

    profile.timeslots[0]?.availableSlots.forEach((a: AvailableType, i: number) => {
      let availableDates = dayjsRange(
        dayjs(dayjs(a.startDate)),
        dayjs(a.finishDate),
        'day'
      ).map((a) =>
        dayjs(a).format('DD MMM YYYY')
      )
      days.push(...availableDates)
    })
    return days
  }, [profile])


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
    let active = true;

    if (encryptReservation && active) {
      if (base64regex.test(encryptReservation)) {
        let reservation = atob(encryptReservation as string)
        if (isJsonString(reservation)) {
          let resData = JSON.parse(reservation)
          let { startDate, dayPeriod, period, selectedDate, finishDate, doctorId, slotId } = resData;
          let avaliab = profile.timeslots[0]?.availableSlots.filter((a: AvailableType) =>
            dayjs(a.startDate).isSame(dayjs(startDate), 'day') &&
            dayjs(a.finishDate).isSame(dayjs(finishDate), 'day'))[0]
          let arrayOfslotOfDay = avaliab?.[`${dayPeriod}` as keyof typeof avaliab] as TimeType[]
          let occupied: TimeType | undefined
          if (arrayOfslotOfDay) {
            occupied = arrayOfslotOfDay.filter((b: TimeType) => b.period == period)[0]
          }
          if (occupied) {
            setOccupyTime({
              timeSlot: { ...occupied },
              selectedDate: selectedDate,
              dayPeriod: dayPeriod,
              doctorId: doctorId,
              startDate: startDate,
              finishDate: finishDate,
              slotId: slotId,
            })
          }
        }
      }
    }
    if (encryptReservation == null) {
      setOccupyTime(undefined)
    }
    return () => {
      active = false;
    }
  }, [encryptReservation, profile, calendarValue])

  useEffect(() => {
    if (occupyTime && !calendarValue) {
      setCalendarValue(new DateObject(dayjs(occupyTime?.selectedDate).format('YYYY/MM/DD')))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [occupyTime])

  const periodButtonClick = (e: any, s: TimeType, isSelect: boolean, slot: AvailableType, dayPeriod: string) => {

    e.preventDefault();
    let url;
    if (isSelect) {
      delete router.query?.reservation;
      url = {
        pathname: router.pathname,
        query: {
          ...router.query,
        }
      }
    } else {
      url = {
        pathname: router.pathname,
        query: {
          ...router.query,
          reservation: window.btoa(JSON.stringify({
            ...s,
            doctorId: profile?.timeslots[0]?.doctorId,
            slotId: profile?.timeSlotId,
            index: slot?.index,
            startDate: slot?.startDate,
            finishDate: slot?.finishDate,
            selectedDate: calendarValue.format(''),
            dayPeriod: dayPeriod
          }))
        }
      }
    }
    router.push(url, undefined, { shallow: true, scroll: false })

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
      <div className="col-lg-12 col-md-12" style={muiVar}>
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
                      profile.timeslots?.[0]?.availableSlots.map((slot: AvailableType, slotIndex: number) => {
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
                                                entrie[1].map((s: TimeType, i: number) => {
                                                  if (s.active) {
                                                    let isSelect = _.isEqual(s, occupyTime?.timeSlot) && occupyTime?.selectedDate == calendarValue.format('')
                                                    const selectedDate = dayjs(calendarValue).format(`D MMM YYYY`);
                                                    const timeSlot = s.period;
                                                    let isDisabled: boolean = !disablePastTime(selectedDate, timeSlot);
                                                    let isBooked: boolean = false;
                                                    if (s.reservations.length > 0) {
                                                      s.reservations.forEach((elem) => {
                                                        if (elem.selectedDate == calendarValue.format('')) {
                                                          if (elem.timeSlot.period == s.period) {
                                                            isBooked = true
                                                          }
                                                        }

                                                      })
                                                    }
                                                    return (
                                                      <li style={{ width: 'inherit' }} key={slotIndex.toString() + " " + j.toString() + i.toString()}>
                                                        <Button
                                                          disabled={isDisabled || isBooked}
                                                          className={`timing ${isSelect ? 'active' : ' '}`}
                                                          sx={{
                                                            bgcolor: isBooked ? `${theme.palette.primary.main} !Important` : '',
                                                            display: 'flex', flexDirection: 'column'
                                                          }}
                                                          onClick={(e) => { periodButtonClick(e, s, isSelect, slot, entrie[0]) }}>
                                                          <span><i className={isDisabled ? "feather-x-circle" : "feather-clock"} />{s.period}</span>
                                                          <span>{formatNumberWithCommas(s.total)} {" "} {s.currencySymbol || 'THB'}</span>
                                                        </Button>
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
          {occupyTime && <Button
            href={`/doctors/check-out/${btoa(`${JSON.stringify(occupyTime)}`)}`}
            disabled={profile?._id === userProfile?._id || userProfile?.roleName == 'doctors'}
            onClick={(e) => {
              if (!userProfile || profile?._id === userProfile?._id) {
                e.preventDefault()
                setLoginDialog(true)
              }
            }}
            className="btn btn-primary prime-btn justify-content-center align-items-center">
            {!userProfile ? `Login to reserve` :
              profile?._id === userProfile?._id ?
                `You can't reserve to your own account.` :
                userProfile?.roleName == 'doctors' ?
                  `You can't reserve with doctor user please create patient user.` :
                  <>Next <i className="feather-arrow-right-circle" />
                  </>}
          </Button>}
        </div>
      </div>

    </Fragment>
  )
});

export default Calendar;