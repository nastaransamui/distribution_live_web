/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { Calendar as BigCalendar, DateRange, dayjsLocalizer, Formats, View, Views } from 'react-big-calendar'
import dayjs from 'dayjs';
import DialogContent from '@mui/material/DialogContent';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { AppointmentReservationExtendType } from './Appointment';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box'
import { BootstrapDialog, BootstrapDialogTitle, Transition } from '../shared/Dialog';
import { PatientProfile } from './MyPtients';
import Link from 'next/link';
import { formatNumberWithCommas, LoadingComponent, StyledBadge } from './ScheduleTiming';
import Avatar from "@mui/material/Avatar";
import { patient_profile } from '@/public/assets/imagepath';
import Typography from '@mui/material/Typography';
import { loadStylesheet } from '@/pages/_app';
import Chip from '@mui/material/Chip';
import dataGridStyle from '../shared/dataGridStyle';
import _ from 'lodash'
export interface EditValueType {
  start: Date;
  end: Date;
  title: string;
  patientProfile: PatientProfile;
  _id: string;
  id: number;
  createdDate: Date;
  patientId: string;
  currencySymbol: string;
  total: string;
  invoiceId: string;
  doctorPaymentStatus: string;
}
//Number of days show in agenda
const agendaDays = 3;
const AvailableTiming: FC = (() => {
  const { muiVar, bounce } = useScssVar();
  const { classes, theme } = dataGridStyle({});
  const [currentDay, setCurrentDay] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>(Views.DAY);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false)
  const localizer = dayjsLocalizer(dayjs)
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const [myAppointmentData, setMyAppointmentData] = useState<AppointmentReservationExtendType[]>([])
  const [show, setShow] = useState(false);
  const [editValues, setEditValues] = useState<EditValueType>();

  useEffect(() => {
    loadStylesheet('/css/react-big-calendar.min.css')
  }, [])
  const handleShow = (data: EditValueType) => {
    setShow(true);
    setEditValues(data)
  }

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

  const handleNavigate = useCallback((date: Date) => {
    setCurrentDay(new Date(date));
  }, []);
  const handleViewChange = useCallback((newView: View) => {
    setCurrentView(newView);
  }, []);
  const isActiveRef = useRef(true);
  useEffect(() => {
    isActiveRef.current = true;
    let userId = userProfile?._id;
    if (isActiveRef.current) {
      if (homeSocket.current !== undefined && userProfile !== null) {
        const mongoFilterModel = buildMongoDBFilter(currentDay, currentView);
        setIsLoading(true);
        homeSocket.current.emit('getDoctorAvailableTime', { userId, mongoFilterModel })
        homeSocket.current.once('getDoctorAvailableTimeReturn', (msg: { status: number, myAppointment: AppointmentReservationExtendType[], message?: string }) => {
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
              const areEqual = _.isEqual(myAppointment, myAppointmentData);
              if (!areEqual) {
                setMyAppointmentData(() => {
                  let newState = []
                  newState = [...myAppointment]
                  return newState
                })
              }
            }
            homeSocket.current.once(`updateGetDoctorAvailableTime`, (msg: string) => {
              setReload(!reload)
            })
            setIsLoading(false)
          }

        })
      }
    }

    return () => {
      isActiveRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeSocket, reload, currentDay, currentView])


  const myEventsList = useMemo(() => {
    let eventArray: any = []
    if (myAppointmentData.length > 0) {
      myAppointmentData.forEach((a: AppointmentReservationExtendType) => {
        const startTime = a?.timeSlot?.period.split(' - ')[0]
        const endTime = a?.timeSlot?.period.split(' - ')[1]
        // create a date object with a specific date
        const date = dayjs.tz(a.selectedDate, process.env.NEXT_PUBLIC_TZ).startOf('day');
        const total = a.timeSlot.total;
        const currencySymbol = a.timeSlot.currencySymbol
        // create a time object with a specific time
        const timeStarted = dayjs(startTime, 'HH:mm');

        const timeFinished = dayjs(endTime, 'HH:mm');

        // combine the date and time objects
        const startDateTime = date.hour(timeStarted.hour()).minute(timeStarted.minute()).second(0);
        const finishDateTime = date.hour(timeFinished.hour()).minute(timeFinished.minute()).second(0);
        const s = startDateTime.local().toDate();
        const e = finishDateTime.local().toDate();
        const title = `${a?.patientProfile?.firstName} ${a?.patientProfile?.lastName}`
        eventArray.push({
          start: s,
          end: e,
          title: title,
          patientProfile: a?.patientProfile,
          _id: a?._id,
          id: a?.id,
          createdDate: a?.createdDate,
          patientId: a?.patientId,
          total: total,
          currencySymbol: currencySymbol,
          invoiceId: a.invoiceId,
          doctorPaymentStatus: a.doctorPaymentStatus
        })
      })
    }

    return [...eventArray]
  }, [myAppointmentData])
  return (
    <Fragment>
      <div className="col-md-12 col-lg-12 col-xl-12  animate__animated animate__backInUp" style={muiVar}>
        {
          isLoading ?
            < div className="card">
              <div className="card-body" style={{ height: '100vh' }}>
                <Box sx={{ minHeight: "90vh", bgcolor: `${theme.palette.background.default} !important` }} className={classes.dataGridOuterBox}>
                  <LoadingComponent boxMinHeight="500px" />
                </Box>
              </div>
            </div> :
            <>
              {
                <div className="card">
                  <div className='card-body'>
                    {/* @ts-ignore */}
                    <BigCalendar
                      localizer={localizer}
                      onSelectEvent={(e) => handleShow(e)}
                      onView={handleViewChange}
                      events={myEventsList}
                      startAccessor="start"
                      endAccessor="end"
                      views={['month', 'week', 'day', 'agenda']}
                      length={agendaDays}
                      date={currentDay}
                      formats={formats}
                      defaultView={currentView}
                      onNavigate={handleNavigate}
                      eventPropGetter={eventPropGetter}
                      style={{
                        height: `100vh`,
                        background: theme.palette.background.default,
                        color: theme.palette.text.color,
                        border: `1px solid ${theme.palette.primary.main}`,
                        borderRadius: 15,
                        padding: 20
                      }}
                    />
                  </div>
                </div>
              }
            </>
        }
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
                <Avatar alt="" src={`${editValues?.patientProfile?.profileImage}`} >
                  <img src={patient_profile} alt="" className="avatar" />
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
                },
                minWidth: '200px'
              }} href={`/doctors/dashboard/patient-profile/${btoa(editValues?.patientId as string)}`}>
              {`${editValues?.patientProfile?.gender} ${editValues?.patientProfile?.firstName} ${editValues?.patientProfile?.lastName}`}
            </Typography>
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <ul className="info-details" style={muiVar}>
              <li>
                <div className="details-header">
                  <div className="row">
                    <div className="col-md-12">
                      <span className="title">#{editValues?.id}</span>
                      <span className="text">{dayjs(editValues?.start).format('DD MMM YYYY')}</span>
                    </div>
                    {/* <div className="col-md-6">
                      <div className="text-end">
                        <button
                          type="button"
                          className="btnLogin"
                          id="topup_status"
                        >
                          Confirmed
                        </button>
                      </div>
                    </div> */}
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
              <li>
                <span className="title">Status:</span>
                <span className="text">
                  <Chip
                    color={
                      editValues?.doctorPaymentStatus == 'Paid' ? 'success' :
                        editValues?.doctorPaymentStatus == 'Awaiting Request' ? 'error' :
                          'primary'}
                    label={`${editValues?.doctorPaymentStatus}`}
                    size="small"
                    sx={{ color: theme.palette.primary.contrastText }} />
                </span>
              </li>
              <li>
                <span className="title">Invoice:</span>
                <span className="text">{editValues?.invoiceId}</span>
              </li>
              <li>
                <span className="title">Price:</span>
                <span className="text">{formatNumberWithCommas(editValues?.total!)} {" "} {editValues?.currencySymbol || "THB"}</span>
              </li>
            </ul>
          </DialogContent>
        </BootstrapDialog>
      }
    </Fragment >
  )
});

export default AvailableTiming;


// Function to get the correct date range for MongoDB
const getDateRange = (date: Date, view: string) => {
  if (view === Views.DAY) {
    return {
      start: dayjs(date).startOf('day').format('YYYY-MM-DD'),
      end: dayjs(date).endOf('day').format('YYYY-MM-DD'),
    };
  } else if (view === Views.WEEK) {
    return {
      start: dayjs(date).startOf('week').format('YYYY-MM-DD'),
      end: dayjs(date).endOf('week').format('YYYY-MM-DD'),
    };
  } else if (view === Views.MONTH) {
    return {
      start: dayjs(date).startOf('month').format('YYYY-MM-DD'),
      end: dayjs(date).endOf('month').format('YYYY-MM-DD'),
    };
  } else if (view === Views.AGENDA) {
    return {
      start: dayjs(date).startOf('day').format('YYYY-MM-DD'),
      end: dayjs(date).add(agendaDays, 'day').endOf('day').format('YYYY-MM-DD'),
    };
  }
  return { start: dayjs(date).format('YYYY-MM-DD'), end: dayjs(date).format('YYYY-MM-DD') };
};

// Define custom formats
const formats: Formats = {
  timeGutterFormat: 'HH:mm',
  agendaTimeFormat: 'HH:mm',
  eventTimeRangeFormat: ({ start, end }) => `${dayjs(start).format('HH:mm')} - ${dayjs(end).format('HH:mm')}`,
  agendaHeaderFormat: ({ start, end }: DateRange) =>
    `${dayjs(start).format('DD MMM YYYY')} – ${dayjs(end).format('DD MMM YYYY')}`,
};


export const buildMongoDBFilter = (currentDay: Date, currentView: string): any => {
  const { start, end } = getDateRange(currentDay, currentView);
  const localStartDate = dayjs(start)
    .tz(process.env.NEXT_PUBLIC_TZ)
    .startOf('day')
    .format('YYYY-MM-DDT00:00:00.000Z');
  const utcStartDate = dayjs(localStartDate).tz('UTC', true).toISOString();
  const localEndDate = dayjs(end)
    .tz(process.env.NEXT_PUBLIC_TZ)
    .startOf('day')
    .format('YYYY-MM-DDT00:00:00.000Z');
  const utcEndDate = dayjs(localEndDate).tz('UTC', true).toISOString();
  return currentView === 'day'
    ? {
      $expr: {
        $eq: [
          {
            $cond: {
              if: { $ne: [{ $type: "$selectedDate" }, "string"] },
              then: { $dateToString: { format: "%Y-%m-%d", date: "$selectedDate" } },
              else: null,
            }
          },
          {
            $dateToString: {
              format: "%Y-%m-%d",
              date: { $dateFromString: { dateString: utcStartDate }, }
            }
          }
        ]
      }
    }
    : {
      $expr: {
        $and: [
          {
            $gte: [
              {
                $cond: {
                  if: { $ne: [{ $type: "$selectedDate" }, "string"] },
                  then: { $dateToString: { format: "%Y-%m-%d", date: "$selectedDate" } },
                  else: null,
                }
              },
              {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: { $dateFromString: { dateString: utcStartDate } }
                }
              }
            ]
          },
          {
            $lte: [
              {
                $cond: {
                  if: { $ne: [{ $type: "$selectedDate" }, "string"] },
                  then: { $dateToString: { format: "%Y-%m-%d", date: "$selectedDate" } },
                  else: null,
                }
              },
              {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: { $dateFromString: { dateString: utcEndDate } }
                }
              }
            ]
          }
        ]
      }
    }
};