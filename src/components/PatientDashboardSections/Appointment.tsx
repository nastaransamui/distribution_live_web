/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useMemo, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { Transition, BootstrapDialog, BootstrapDialogTitle } from "@/components/shared/Dialog";
import DialogContent from '@mui/material/DialogContent';
import Link from 'next/link';

//redux
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';

//Mui
import { useTheme } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import { doctors_profile } from '@/public/assets/imagepath';
import { AppointmentReservationType } from '../DoctorsSections/CheckOut/PaymentSuccess';

//liberies
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
import { toast } from 'react-toastify';
import CustomNoRowsOverlay from '../shared/CustomNoRowsOverlay';
import dayjs from 'dayjs';
import { formatNumberWithCommas, LoadingComponent, StyledBadge } from '@/components/DoctorDashboardSections/ScheduleTiming';
import Chip from '@mui/material/Chip';
import { DoctorProfileType } from '../SearchDoctorSections/SearchDoctorSection';
import Grid from '@mui/material/Grid';
import dataGridStyle from '../shared/dataGridStyle';

export interface EditValueType {
  start: Date;
  end: Date;
  title: string;
  doctorProfile: DoctorProfileType;
  id: number;
  createdDate: string;
  doctorId: string;
  currencySymbol: string;
  total: string;
  invoiceId: string;
}

export interface AppointmentReservationExtendType extends AppointmentReservationType {
  doctorProfile: DoctorProfileType;
  createdDate: string;
}
const perPage = 10
const Appointment: FC = (() => {
  const { muiVar, bounce } = useScssVar();
  const [show, setShow] = useState(false);
  const [editValues, setEditValues] = useState<EditValueType>();



  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false)
  const [myAppointmentData, setMyAppointmentData] = useState<AppointmentReservationExtendType[]>([])
  const [page, setPage] = useState(1);
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const theme = useTheme();
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  // const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

  useEffect(() => {
    let isActive = true;
    let userId = userProfile?._id
    let reservationsIdArray = userProfile?.reservations_id
    let limit = perPage * page;
    let skip = (page - 1) * perPage
    if (isActive && homeSocket.current !== undefined && userProfile !== null) {
      if (userProfile?.reservations_id && userProfile?.reservations_id.length !== 0) {
        homeSocket.current.emit('getPatientAppointments', { userId, reservationsIdArray, limit, skip })
        homeSocket.current.once('getPatientAppointmentsReturn', (msg: { status: number, myAppointment: AppointmentReservationExtendType[], message?: string }) => {
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
            }
            homeSocket.current.once(`updateGetPatientAppointments`, () => {
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
  }, [homeSocket, page, reload])




  const handleShow = (data: AppointmentReservationExtendType) => {
    const startTime = data.timeSlot?.period.split(' - ')[0]
    const endTime = data.timeSlot?.period.split(' - ')[1]
    // create a date object with a specific date
    const date = dayjs(data.selectedDate);
    // create a time object with a specific time
    const timeStarted = dayjs(startTime, 'HH:mm');

    const timeFinished = dayjs(endTime, 'HH:mm');
    // combine the date and time objects
    const startDateTime = date.set('hour', timeStarted.hour()).set('minute', timeStarted.minute()).set('second', timeStarted.second());
    const s = dayjs(startDateTime).toDate()

    // combine the date and time objects
    const finishDateTime = date.set('hour', timeFinished.hour()).set('minute', timeFinished.minute()).set('second', timeFinished.second());
    const e = dayjs(finishDateTime).toDate()
    const title = `${data.doctorProfile?.fullName}`
    const total = data.timeSlot.total;
    const currencySymbol = data.timeSlot.currencySymbol
    setShow(true)
    setEditValues({
      start: s,
      end: e,
      title: title,
      doctorProfile: data.doctorProfile,
      id: data.id,
      createdDate: data.createdDate,
      doctorId: data.doctorId,
      total: total.toString(),
      currencySymbol: currencySymbol,
      invoiceId: data.invoiceId,
    })
  }
  return (
    <Fragment>
      <div className="col-md-12 col-lg-12 col-xl-12 animate__animated animate__backInUp">
        {
          isLoading ?
            <>
              <div className="card">
                <LoadingComponent boxMinHeight="500px" />
              </div>
            </> :
            <>
              {
                myAppointmentData.length == 0 ?
                  <div className="card" style={{ display: 'flex', justifyContent: 'center', minWidth: '100%', minHeight: 700 }}>
                    <CustomNoRowsOverlay text='No Appointments' />
                  </div> :
                  <div className="card" style={{ padding: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', minWidth: '100%', }}>
                      <Stack spacing={3} sx={{ mt: 3 }}>
                        <Pagination
                          showFirstButton
                          showLastButton
                          hideNextButton
                          hidePrevButton
                          boundaryCount={1}
                          variant="outlined"
                          color="secondary"
                          count={userProfile ? Math.ceil(userProfile?.reservations_id.length / perPage) : 0}
                          page={page}
                          onChange={handlePageChange}
                          sx={{
                            marginLeft: 'auto',
                            marginRight: 'auto',
                          }}
                        />
                        <Typography variant='h5' align='center' gutterBottom sx={{ pb: 2 }}>Total: {userProfile?.reservations_id.length} reservations</Typography>
                      </Stack>
                    </div>
                    <div className="appointments">
                      <PatientAppointmentShowBox handleShow={handleShow} myAppointmentData={myAppointmentData} />
                    </div>
                    <Pagination
                      showFirstButton
                      showLastButton
                      hideNextButton
                      hidePrevButton
                      boundaryCount={1}
                      variant="outlined"
                      color="secondary"
                      count={userProfile ? Math.ceil(userProfile?.reservations_id.length / perPage) : 0}
                      page={page}
                      onChange={handlePageChange}
                      sx={{
                        mb: 3,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        justifyContent: "center",
                        display: 'flex'
                      }}
                    />
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
            <Link target='_blank' className="avatar mx-2" href={`/doctors/profile/${btoa(editValues?.doctorId as string)}`}>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                online={editValues?.doctorProfile?.online as boolean}
                idle={editValues?.doctorProfile?.lastLogin?.idle}
              >
                <Avatar alt="" src={`${editValues?.doctorProfile?.profileImage}`} >
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
              }} href={`/doctors/profile/${btoa(editValues?.doctorId as string)}`}>
              {`Dr. ${editValues?.doctorProfile?.fullName}`}
            </Typography>
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <ul className="info-details" style={muiVar}>
              <li>
                <div className="details-header">
                  <div className="row" style={{ minWidth: 350 }}>
                    <div className="col-md-6">
                      <span className="title">#{editValues?.id}</span>
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

interface PatientAppointmentShowBoxType {
  myAppointmentData: AppointmentReservationExtendType[];
  handleShow: (data: AppointmentReservationExtendType) => void;
}
const PatientAppointmentShowBox: FC<PatientAppointmentShowBoxType> = (({ myAppointmentData, handleShow }) => {
  const { theme } = dataGridStyle({});
  return (
    <>
      {
        myAppointmentData.map((appointment: AppointmentReservationExtendType, index: number) => {
          const { doctorProfile, selectedDate, timeSlot, doctorId } = appointment;
          const { period } = timeSlot
          const { profileImage, address1, address2, online } = doctorProfile
          const doctorName = `Dr. ${doctorProfile?.firstName} ${doctorProfile?.lastName}`;
          return (
            <div className="appointment-list" key={index}>
              <div className="profile-info-widget" >
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                  variant="dot"
                  online={online as boolean}
                  idle={doctorProfile?.lastLogin?.idle}
                >
                  <Link aria-label="patient"
                    href={`/doctors/profile/${btoa(doctorId)}`}
                    className="booking-doc-img"
                    target='_blank'
                  >
                    <Avatar sx={{
                      width: 'auto',
                      height: 'auto',
                      borderRadius: `5px 5px 5px 5px`,
                      transition: 'all 2000ms cubic-bezier(0.19, 1, 0.22, 1) 0ms',
                      "&:hover": {
                        transform: "scale(1.15)",

                      },
                      background: theme.palette.background.default
                    }}
                      variant="circular"
                      alt=""
                      src={`${profileImage}`}
                      key={profileImage}
                    >
                      <img className="img-fluid" src={doctors_profile} alt="" />
                    </Avatar>
                  </Link>
                </StyledBadge>
                <div className="profile-det-info">
                  <h3>
                    <Link aria-label="patient" style={{ color: theme.palette.secondary.main }} href={`/doctors/profile/${btoa(doctorId)}`} target='_blank'>{doctorName}</Link>
                  </h3>
                  <div className="patient-details">
                    <h4>
                      <i className="far fa-clock"></i> {dayjs(selectedDate).format("DD MMM YYYY")} {' '} {period}
                    </h4>
                    <h4>
                      <i className="fas fa-map-marker-alt"></i> {address1} {' '} {address2}
                    </h4>
                    <h4>
                      <img src={doctorProfile?.specialities[0]?.image} width="20" height="20" alt={doctorProfile?.specialities[0]?.specialities} />
                      {' '}
                      {doctorProfile?.specialities[0]?.specialities}
                    </h4>
                    <br />
                    <h4 className="mb-0">
                      <Link href={`/patient/dashboard/invoice-view/${btoa(appointment?._id as string)}`} target='_blank'>
                        {appointment.invoiceId}
                      </Link>
                    </h4>
                  </div>
                </div>
              </div>
              <div className="appointment-action">
                <Link
                  href=""
                  className="doctorAppointmentView"
                  style={{ lineHeight: '28px', }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleShow(appointment)
                  }}
                >
                  <i className="far fa-eye"></i> View
                </Link>

              </div>
              <div style={{ paddingTop: 30 }}>
                <h4 className="mb-0">
                  <Grid container rowGap={1} columnGap={1} sx={{ paddingRight: 1, paddingLeft: 1 }} className="clinic-services"
                    key={doctorProfile?.specialitiesServices?.toString()}>
                    {doctorProfile?.specialitiesServices &&
                      doctorProfile?.specialitiesServices.map((s: string, i: number) => {
                        return (
                          <Grid key={s + i} item component="span" aria-label='key specilaities'>{s}</Grid>
                        )
                      })
                    }
                  </Grid>
                </h4>
              </div>
            </div>
          )
        })
      }
    </>
  )
})

export default Appointment;