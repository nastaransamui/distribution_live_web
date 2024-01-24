import { FC, Fragment, useEffect, useMemo, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';


import { useTheme } from '@mui/material';
import { addDays } from 'date-fns';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DoctorProfileType } from '@/components/SearchDoctorSections/SearchDoctorSection';
import { Calendar as CalendarComponent, DateObject } from "react-multi-date-picker"
import { AvailableType, TimeType, afterNoonFinish, afterNoonStart, eveningFinish, eveningStart, morningFinish, morningStart } from '@/components/DoctorDashboardSections/ScheduleTiming';
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
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { LoginBox } from '@/components/AuthSections/LoginSection';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import { base64regex } from '@/components/DoctorsSections/Profile/ProfilePage';
import _ from 'lodash'
import { Transition } from '@/components/shared/Dialog';
import isJsonString from '@/helpers/isJson';
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
  slot_id: String,
}
export interface AppointmentReservationType {
  _id?: string;
  timeSlot: TimeType;
  selectedDate: Date;
  dayPeriod: string;
  doctorId: string;
  startDate: Date;
  finishDate: Date;
  slot_id: string;
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
          color: isWeekend ? 'red' : theme.palette.primary.contrastText,
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
          let { startDate, dayPeriod, period, selectedDate, finishDate, doctorId, slot_id } = resData;
          let avaliab = profile.timeslots[0]?.availableSlots.filter((a: AvailableType) =>
            dayjs(a.startDate).isSame(dayjs(startDate), 'day') &&
            dayjs(a.finishDate).isSame(dayjs(finishDate), 'day'))[0]
          let arrayOfslotOfDay = avaliab[`${dayPeriod}` as keyof typeof avaliab] as TimeType[]
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
              slot_id: slot_id,
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
            slot_id: profile?.timeSlotId,
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
                  <LoginBox />
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
          <h4 className="booking-title">Select Available Slots</h4>
        </div>
        {/* <div className="row">
          <div className="col-12 col-sm-4 col-md-6">
            <h4 className="mb-1">{dayjs(state[0]['startDate']).add(activeDayIndex, 'day').format(`MMMM D, YYYY`)}</h4>
            <p className="text-muted">{dayjs(state[0]['startDate']).add(activeDayIndex, 'day').format('dddd')}</p>
          </div>
          <div className="col-12 col-sm-8 col-md-6 text-sm-end">
            <TextField
              type="text"
              sx={{ width: 332, }}
              disabled
              value={`${dayjs(state[0]['startDate']).format(`MMM D, YYYY`)} - ${dayjs(state[0]['endDate']).format(`MMM D, YYYY`)}`}
              InputProps={{
                endAdornment: <InputAdornment position="end" onClick={() => {
                  setShowDayPicker((prevState) => !prevState)
                }}>
                  <div className=" btn">
                    <i className="far fa-calendar-alt me-2"></i>
                    <i className="fas fa-chevron-down ms-2"></i>
                  </div>
                </InputAdornment>
              }}
            />
            <div className={` ${showDayPicker ? 'datepicker-icon-show' : 'datepicker-icon'}`}>
              <DateRangePicker
                className="rdrDateRangePickerWrapper"
                onChange={(item: any) => setState([item.selection])}
                showDateDisplay={true}
                editableDateInputs={true}
                moveRangeOnFirstSelection={false}
                months={1}
                ranges={state}
                direction="horizontal"
                minDate={new Date()}
                maxDate={addDays(new Date(), 7)}
                rangeColors={[theme.palette.primary.main]}
              />
            </div>
          </div>
        </div> */}
        <div className="card booking-card">
          <div className="card-body time-slot-card-body">
            <div className="schedule-header">
              <div className="row">
                <div className="col-md-12">
                  <div className="day-slot">
                    <CalendarComponent
                      highlightToday={true}
                      numberOfMonths={widthOnlyXl ? 4 : widthOnlyLg ? 3 : minWidth767max991 ? 2 : widthOnlySm ? 2 : widthOnlyXs ? 1 : 2}
                      value={calendarValue}
                      onChange={calendarOnChange}
                      format='DD MMM YYYY'
                      className={theme.palette.mode == 'dark' ? 'bg-dark yellow' : 'bg-light  yellow'}
                      mapDays={calendarMapDays}
                    />
                    {/* <ul>
                      {
                        [...Array(dayjs(state[0]['endDate']).diff(dayjs(state[0]['startDate']), 'day', true))].map((d, index) => {
                          return (
                            <li style={{ width: `${100 / [...Array(dayjs(state[0]['endDate']).diff(dayjs(state[0]['startDate']), 'day', true))].length}%` }} className={activeDayIndex == index ? 'active' : ''} key={index}
                              onClick={() => {
                                setActiveDayIndex(() => index)
                              }}>
                              <span>
                                {dayjs(state[0]['startDate']).add(index, 'day').format('dddd')}
                              </span>
                              <span className="slot-date">{dayjs(state[0]['startDate']).add(index, 'day').format(`D MMM`)}</span>
                            </li>
                          )
                        })
                      }
                    </ul> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="row" style={{ marginTop: 40 }}>
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
                                              let isDisabled: boolean = false;
                                              if (s.reservations.length > 0) {
                                                s.reservations.forEach((elem) => {
                                                  if (elem.selectedDate == calendarValue.format('')) {
                                                    if (elem.timeSlot.period == s.period) {
                                                      isDisabled = true
                                                    }
                                                  }

                                                })
                                              }
                                              return (
                                                <li style={{ width: 'inherit' }} key={slotIndex.toString() + " " + j.toString() + i.toString()}>
                                                  <Button
                                                    disabled={isDisabled}
                                                    className={`timing ${isSelect ? 'active' : ' '}`}
                                                    sx={{ bgcolor: isDisabled ? `${theme.palette.primary.main} !Important` : '' }}
                                                    onClick={(e) => { periodButtonClick(e, s, isSelect, slot, entrie[0]) }}>
                                                    <span><i className={isDisabled ? "feather-x-circle" : "feather-clock"} />{s.period}</span>
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
              }
            </div>
          </div>
        </div>
        <div className="submit-section proceed-btn text-end" style={{ marginTop: 40 }}>
          {occupyTime && <Button
            href={`/doctors/check-out/${btoa(`${JSON.stringify(occupyTime)}`)}`}
            disabled={profile?._id === userProfile?._id}
            onClick={(e) => {
              if (!userProfile || profile?._id === userProfile?._id) {
                e.preventDefault()
                setLoginDialog(true)
              }
            }}
            className="btn btn-primary prime-btn justify-content-center align-items-center">
            {!userProfile ? `Login to reserve` : profile?._id === userProfile?._id ? `You can't reserve to your own account.` : <>Next <i className="feather-arrow-right-circle" /></>}
          </Button>}
        </div>
      </div>

    </Fragment>
  )
});

export default Calendar;