/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { Calendar as BigCalendar, dayjsLocalizer, Views } from 'react-big-calendar'
import dayjs from 'dayjs';
import { DialogContent, useTheme } from '@mui/material';
import InputAdornment from "@mui/material/InputAdornment";
import FeatherIcon from "feather-icons-react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { AppointmentReservationExtendType } from './Appointment';
import { toast } from 'react-toastify';
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
import CustomNoRowsOverlay from '../shared/CustomNoRowsOverlay';
import { BootstrapDialog, BootstrapDialogTitle, Transition } from '../shared/Dialog';
import { PatientProfile } from './MyPtients';
import Link from 'next/link';
import { StyledBadge } from './ScheduleTiming';
import Avatar from "@mui/material/Avatar";
import { doctors_profile } from '@/public/assets/imagepath';
import Typography from '@mui/material/Typography';

export interface EditValueType {
  start: Date;
  end: Date;
  title: string;
  patientProfile: PatientProfile;
  _id: string;
  createdDate: Date;
  patientId: string;
}
const AvailableTiming: FC = (() => {
  const { muiVar, bounce } = useScssVar();
  const theme = useTheme();
  const [view, setView] = useState(Views.WEEK)
  const [currentDay, setCurrentDay] = useState(new Date())
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false)
  const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const [myAppointmentData, setMyAppointmentData] = useState<AppointmentReservationExtendType[]>([])
  const onView = useCallback((newView: any) => setView(newView), [setView])
  const [show, setShow] = useState(false);
  const [editValues, setEditValues] = useState<EditValueType>();

  useEffect(() => {
    let isActive = true;
    let userId = userProfile?._id
    let reservationsIdArray = userProfile?.reservations_id
    let limit = 200;
    let skip = 0
    if (isActive && homeSocket.current !== undefined && userProfile !== null) {
      if (userProfile?.reservations_id && userProfile?.reservations_id.length !== 0) {
        homeSocket.current.emit('getMyAppointments', { userId, reservationsIdArray, limit, skip })
        homeSocket.current.once('getMyAppointmentsReturn', (msg: { status: number, myAppointment: AppointmentReservationExtendType[], message?: string }) => {
          const { status, myAppointment, message } = msg;
          if (status !== 200) {
            toast.error(message || `${status}`, {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              toastId: 'socketEror',
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              transition: bounce,
              onClose: () => {
                setIsLoading(false)
                toast.dismiss('socketEror')
              }
            });
          } else {
            if (myAppointment.length !== 0) {
              setMyAppointmentData(() => {
                let newState = []
                newState = [...myAppointment]
                return newState
              })
              if (show) {
                console.log(editValues?._id)
                let appointmentIndex = myAppointment.findIndex((a) => a?._id == editValues?._id)
                if (appointmentIndex !== -1) {
                  setEditValues((prevState: any) => {
                    return {
                      ...prevState,
                      patientProfile: { ...myAppointment[appointmentIndex].patientProfile }
                    }
                  })
                }
              }
            }
            homeSocket.current.once(`updateGetMyAppointments`, () => {
              setReload(!reload)
            })
            setIsLoading(false)
          }

        })
      } else {
        isLoading && setIsLoading(false)

      }
    }
    return () => {
      isActive = false;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeSocket, reload])

  const LoadingCompoenent = () => (
    <CircleToBlockLoading color={theme.palette.primary.main} size="small"
      style={{
        minWidth: '100%',
        display: 'flex',
        justifyContent: 'center',
      }} />
  )
  const handleShow = (data: EditValueType) => {
    setShow(true);
    setEditValues(data)
  }


  const localizer = dayjsLocalizer(dayjs)

  const myEventsList = useMemo(() => {
    let eventArray: any = []
    if (myAppointmentData.length > 0) {
      myAppointmentData.forEach((a: AppointmentReservationExtendType) => {
        // console.log({ a })
        const startTime = a?.timeSlot?.period.split(' - ')[0]
        const endTime = a?.timeSlot?.period.split(' - ')[1]
        // create a date object with a specific date
        const date = dayjs(a.selectedDate);

        // create a time object with a specific time
        const timeStarted = dayjs(startTime, 'HH:mm');

        const timeFinished = dayjs(endTime, 'HH:mm');

        // combine the date and time objects
        const startDateTime = date.set('hour', timeStarted.hour()).set('minute', timeStarted.minute()).set('second', timeStarted.second());
        const s = dayjs(startDateTime).toDate()

        // combine the date and time objects
        const finishDateTime = date.set('hour', timeFinished.hour()).set('minute', timeFinished.minute()).set('second', timeFinished.second());
        const e = dayjs(finishDateTime).toDate()
        const title = `${a?.patientProfile?.firstName} ${a?.patientProfile?.lastName}`
        eventArray.push({
          start: s,
          end: e,
          title: title,
          patientProfile: a?.patientProfile,
          _id: a?._id,
          createdDate: a?.createdDate,
          patientId: a?.patientId
        })
      })
    }

    return [...eventArray]
  }, [myAppointmentData])


  const eventPropGetter = useCallback(
    (event: any, start: Date, end: Date, isSelected: boolean) => {
      return {
        style: {
          backgroundColor: theme.palette.secondary.light,
          color: theme.palette.primary.contrastText,
        },
        ...(isSelected && {
          style: {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.primary.contrastText,
          },
        }),

      }
    },
    [theme]
  )


  const mainCalendar = () => {
    return (
      <BigCalendar
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={(e) => {
          handleShow(e)
        }}
        onView={onView}
        views={['month', 'week', 'work_week', 'day', 'agenda']}
        defaultView={Views.MONTH}
        style={{
          height: `100vh`,
          background: theme.palette.background.default,
          color: theme.palette.text.color,
          border: `1px solid ${theme.palette.primary.main}`,
          borderRadius: 15,
          padding: 20
        }}
        eventPropGetter={eventPropGetter}
      />
    )
  }


  return (
    <Fragment>
      <div className="col-md-7 col-lg-8 col-xl-9" style={muiVar}>
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Schedule Timings</h4>
                <div className="profile-box">
                  <div className="row">
                    <div className="col-sm-6 col-12 avail-time">
                      <div className="mb-3">
                        <div className="schedule-calendar-col justify-content-start">
                          <form className="d-flex flex-wrap">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <MobileDatePicker
                                format="DD MMM YYYY"
                                closeOnSelect
                                defaultValue={dayjs(currentDay)}
                                disablePast
                                sx={{ width: { lg: 250, md: '100%', sm: '100%', xs: '100%' }, }}
                                onChange={(value: any, context: any) => {
                                  setCurrentDay(value)
                                }}
                                slotProps={{
                                  textField: {
                                    size: "small",
                                    InputLabelProps: { shrink: true },
                                    InputProps: {
                                      startAdornment: <InputAdornment position="start">
                                        <i ><FeatherIcon icon="calendar" style={{ width: "16px", color: theme.palette.secondary.main }} /></i>
                                      </InputAdornment>,
                                      classes: {
                                        adornedStart: 'adornedStart',
                                      }
                                    },
                                    placeholder: 'Date'
                                  },
                                }}
                              />
                            </LocalizationProvider>

                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {
                      isLoading ?
                        <LoadingCompoenent /> :
                        myAppointmentData.length !== 0 ?
                          mainCalendar() : <div className='card' style={{ minHeight: '100vh', justifyContent: 'center' }}>
                            <CustomNoRowsOverlay text='No any schedule' />
                          </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        show && <BootstrapDialog
          TransitionComponent={Transition}
          onClose={() => {
            document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
            setTimeout(() => {
              setShow(false)
            }, 500);
          }}
          aria-labelledby="edit_invoice_details"
          open={show}
        >
          <BootstrapDialogTitle
            id="edit_invoice_details" onClose={() => {
              document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
              setTimeout(() => {
                setShow(false)
              }, 500);
            }}>
            <Link
              target='_blank'
              className="avatar mx-2"
              href={`/doctors/dashboard/patient-profile/${btoa(editValues?.patientId as string)}`}>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                online={editValues?.patientProfile?.online as boolean}
              >
                <Avatar alt="" src={`${editValues?.patientProfile?.profileImage}?random=${new Date().getTime()}`} >
                  <img src={doctors_profile} alt="" className="avatar" />
                </Avatar>
              </StyledBadge>
            </Link>
            <Typography
              component="a"
              target='_blank'
              sx={{
                color: theme.palette.primary.main,
                fontSize: '1rem',
                "&:hover": {
                  color: theme.palette.secondary.light
                }
              }} href={`/doctors/dashboard/patient-profile/${btoa(editValues?.patientId as string)}`}>
              {`${editValues?.patientProfile?.gender}. ${editValues?.patientProfile?.firstName} ${editValues?.patientProfile?.lastName}`}
            </Typography>
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <ul className="info-details" style={muiVar}>
              <li>
                <div className="details-header">
                  <div className="row">
                    <div className="col-md-6">
                      <span className="title">#{editValues?._id}</span>
                      <span className="text">{dayjs(editValues?.start).format('DD MMM YYYY')}</span>
                    </div>
                    <div className="col-md-6">
                      <div className="text-end">
                        <button
                          type="button"
                          className="btnLogin"
                          id="topup_status"
                        >
                          Confirmed
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <span className="title">Start:</span>
                <span className="text">{dayjs(editValues?.start).format('HH:mm')}</span>
              </li>
              <li>
                <span className="title">Finish</span>
                <span className="text">{dayjs(editValues?.end).format('HH:mm')}</span>
              </li>
              <li>
                <span className="title">Confirm Date:</span>
                <span className="text">{dayjs(editValues?.createdDate).format('DD MMM YYYY - HH:mm')}</span>
              </li>
            </ul>
          </DialogContent>
        </BootstrapDialog>
      }
    </Fragment>
  )
});

export default AvailableTiming;