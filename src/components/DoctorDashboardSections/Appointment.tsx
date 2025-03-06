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
import Pagination from '@mui/material/Pagination';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import { patient_profile } from '@/public/assets/imagepath';
import { AppointmentReservationType } from '../DoctorsSections/CheckOut/PaymentSuccess';
import { PatientProfile } from './MyPtients';

//liberies
import { toast } from 'react-toastify';
import CustomNoRowsOverlay from '../shared/CustomNoRowsOverlay';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { formatNumberWithCommas, LoadingComponent, StyledBadge } from './ScheduleTiming';
import Chip from '@mui/material/Chip';
import dataGridStyle from '../shared/dataGridStyle';
export interface EditValueType {
  start: Date;
  end: Date;
  title: string;
  patientProfile: PatientProfile;
  id: number;
  createdDate: string;
  patientId: string;
  currencySymbol: string;
  total: string;
  invoiceId: string;
  doctorPaymentStatus: string;
}


export interface AppointmentReservationExtendType extends AppointmentReservationType {
  patientProfile: PatientProfile;
  createdDate: string;
}
const perPage = 10

const Appointment: FC = (() => {

  dayjs.extend(customParseFormat);
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

  const { theme } = dataGridStyle({});
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)

  useEffect(() => {
    let isActive = true;
    let userId = userProfile?._id
    let reservationsIdArray = userProfile?.reservations_id
    let limit = perPage * page;
    let skip = (page - 1) * perPage
    if (isActive && homeSocket.current !== undefined && userProfile !== null) {
      if (userProfile?.reservations_id && userProfile?.reservations_id.length !== 0) {
        homeSocket.current.emit('getDoctorAppointments', { userId, reservationsIdArray, limit, skip })
        homeSocket.current.once('getDoctorAppointmentsReturn', (msg: { status: number, myAppointment: AppointmentReservationExtendType[], message?: string }) => {
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
            homeSocket.current.once(`updateGetDoctorAppointments`, () => {
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
    const title = `${data.patientProfile?.firstName} ${data.patientProfile?.lastName}`
    const total = data.timeSlot.total;
    const currencySymbol = data.timeSlot.currencySymbol
    setShow(true)
    setEditValues({
      start: s,
      end: e,
      title: title,
      patientProfile: data.patientProfile,
      id: data.id,
      createdDate: data.createdDate,
      patientId: data.patientId,
      total: total.toString(),
      currencySymbol: currencySymbol,
      invoiceId: data.invoiceId,
      doctorPaymentStatus: data.doctorPaymentStatus
    })
  }

  return (
    <Fragment>
      <div className="col-md-12 col-lg-12 col-xl-12  animate__animated animate__backInUp">
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
                      <DoctorAppointmentShowBox handleShow={handleShow} myAppointmentData={myAppointmentData} />
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
            <Link className="avatar mx-2" href={`/doctors/dashboard/patient-profile/${btoa(editValues?.patientId as string)}`}>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                online={editValues?.patientProfile?.online as boolean}
                idle={editValues?.patientProfile?.lastLogin?.idle}
              >
                <Avatar alt="" src={`${editValues?.patientProfile?.profileImage}`} >
                  <img src={patient_profile} alt="" className="avatar" />
                </Avatar>
              </StyledBadge>
            </Link>
            <Typography
              component="a"
              sx={{
                color: theme.palette.primary.main,
                fontSize: '1rem',
                "&:hover": {
                  color: theme.palette.secondary.light
                }
              }} href={`/doctors/dashboard/patient-profile/${btoa(editValues?.patientId as string)}`}>
              {`${editValues?.patientProfile?.gender} ${editValues?.patientProfile?.gender !== '' ? '.' : ''} ${editValues?.patientProfile?.firstName} ${editValues?.patientProfile?.lastName}`}
            </Typography>
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <ul className="info-details" style={muiVar}>
              <li>
                <div className="details-header">
                  <div className="row" style={{ minWidth: 350 }}>
                    <div className="col-md-6">
                      <span className="title" >#{editValues?.id}</span>
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
            {/* <ul className="info-details" style={muiVar}>
              <li>
                <div className="details-header">
                  <div className="row">
                    <div className="col-md-6">
                      <span className="title">{editValues?.invoiceId}</span>
                      <span className="text">{editValues?.selectedDate}</span>
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
                <span className="title">Confirm Date:</span>
                <span className="text">{dayjs(editValues?.createdDate).format('DD MMM YYYY - HH:mm')}</span>
              </li>
              <li>
                <span className="title">Paid Amount</span>
                <span className="text">{formatNumberWithCommas(editValues?.timeSlot?.total!)} {" "} {editValues?.timeSlot?.currencySymbol || "THB"}</span>
              </li>
            </ul> */}
          </DialogContent>
        </BootstrapDialog>
      }
    </Fragment >
  )
});

interface DoctorAppointmentShowBoxType {
  myAppointmentData: AppointmentReservationExtendType[];
  handleShow: (data: AppointmentReservationExtendType) => void;
}

const DoctorAppointmentShowBox: FC<DoctorAppointmentShowBoxType> = (({ myAppointmentData, handleShow }) => {
  const { theme } = dataGridStyle({});
  return (
    <>
      {
        myAppointmentData.map((appointment: AppointmentReservationExtendType, index: number) => {
          const { patientProfile, selectedDate, timeSlot, patientId } = appointment;
          const { period } = timeSlot
          const { profileImage, address1, address2, mobileNumber, userName, online } = patientProfile
          const patientName = `${patientProfile?.gender} ${patientProfile?.gender !== '' ? '.' : ''} ${patientProfile?.firstName} ${patientProfile?.lastName}`;
          return (
            <div className="appointment-list" key={index}>
              <div className="profile-info-widget" >
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                  variant="dot"
                  online={online as boolean}
                  idle={patientProfile?.lastLogin?.idle}
                >
                  <Link aria-label="patient"
                    href={`/doctors/dashboard/patient-profile/${btoa(patientId)}`}
                    className="booking-doc-img"
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
                      <img className="img-fluid" src={patient_profile} alt="" />
                    </Avatar>
                  </Link>
                </StyledBadge>
                <div className="profile-det-info">
                  <h3>
                    <Link aria-label="patient" style={{ color: theme.palette.secondary.main }} href={`/doctors/dashboard/patient-profile/${btoa(patientId)}`}>{patientName}</Link>
                  </h3>
                  <h3>
                    <Link aria-label='id' style={{ color: theme.palette.secondary.main }} href="#" onClick={(e) => e.preventDefault()}>{`#${appointment?.id}`}</Link>
                  </h3>
                  <div className="patient-details">
                    <h4>
                      <i className="far fa-clock"></i> {dayjs(selectedDate).format('DD MMM YYYY')} {' '} {period}
                    </h4>
                    <h4>
                      <i className="fas fa-map-marker-alt"></i> {address1} {' '} {address2}
                    </h4>
                    <h4>
                      <i className="fas fa-envelope"></i>{" "}
                      {userName}
                    </h4>
                    <h4 className="mb-0">
                      <i className="fas fa-phone"></i> {mobileNumber}
                    </h4>
                    <br />
                    <h4 className="mb-0">
                      <Link href={`/doctors/dashboard/invoice-view/${btoa(appointment?._id as string)}`} >
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
                <Link href="" className={`doctorPaymentStatus ${appointment.doctorPaymentStatus.replace(/\s+/g, '').toLowerCase()}`}
                  style={{ lineHeight: '28px', }} onClick={(e) => {
                    e.preventDefault();
                  }}>
                  {appointment.doctorPaymentStatus}
                </Link>
              </div>
            </div>
          )
        })
      }
    </>
  )
})

export default Appointment;