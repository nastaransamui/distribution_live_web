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

import { patient_profile } from '@/public/assets/imagepath';
import { AppointmentReservationType } from '../DoctorsSections/CheckOut/PaymentSuccess';
import { PatientProfile, ProfileImageStyledBadge } from './MyPtients';

//liberies
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
import { toast } from 'react-toastify';
import CustomNoRowsOverlay from '../shared/CustomNoRowsOverlay';
import dayjs from 'dayjs';
import { formatNumberWithCommas, StyledBadge } from './ScheduleTiming';
import Chip from '@mui/material/Chip';



export interface AppointmentReservationExtendType extends AppointmentReservationType {
  patientProfile: PatientProfile;
  createdDate: string;
}
const perPage = 10
const Appointment: FC = (() => {
  const { muiVar, bounce } = useScssVar();
  const [show, setShow] = useState(false);
  const [editValues, setEditValues] = useState<AppointmentReservationExtendType>();



  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false)
  const [myAppointmentData, setMyAppointmentData] = useState<AppointmentReservationExtendType[]>([])
  const [page, setPage] = useState(1);
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const theme = useTheme();

  // const userProfile = useSelector((state: AppState) => state.userProfile.value)
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
  const LoadingCompoenent = () => (
    <CircleToBlockLoading color={theme.palette.primary.main} size="small"
      style={{
        minWidth: '100%',
        display: 'flex',
        justifyContent: 'center',
      }} />
  )

  const appointmentComponents = () => {

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
                  <ProfileImageStyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                    variant="dot"
                    online={online as boolean}
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
                        src={`${profileImage}?random=${new Date().getTime()}`}
                        key={profileImage}
                      >
                        <img className="img-fluid" src={patient_profile} alt="" />
                      </Avatar>
                    </Link>
                  </ProfileImageStyledBadge>
                  <div className="profile-det-info">
                    <h3>
                      <Link aria-label="patient" style={{ color: theme.palette.secondary.main }} href={`/doctors/dashboard/patient-profile/${btoa(patientId)}`}>{patientName}</Link>
                    </h3>
                    <div className="patient-details">
                      <h4>
                        <i className="far fa-clock"></i> {selectedDate} {' '} {period}
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
                        {appointment.invoiceId}
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="appointment-action">
                  <Link
                    href=""
                    className="btnLogin"
                    style={{ lineHeight: '38px', }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleShow(appointment)
                    }}
                  >
                    <i className="far fa-eye"></i> View
                  </Link>
                  <Link href="" className="btnLogout"
                    style={{ lineHeight: '38px', }} onClick={(e) => {
                      e.preventDefault();
                    }}>
                    <i className="fas fa-check" style={{ color: 'green' }}></i> Accept
                  </Link>
                  <Link href="" className="btnLogin" onClick={(e) => {
                    e.preventDefault();
                  }}
                    style={{ lineHeight: '38px', }}>
                    <i className="fas fa-times" style={{ color: 'crimson' }}></i> Cancel
                  </Link>
                </div>
              </div>
            )
          })
        }
      </>
    )
  }


  const handleShow = (data: AppointmentReservationExtendType) => {
    setShow(true);
    setEditValues(data)
  }
  return (
    <Fragment>
      <div className="col-md-7 col-lg-8 col-xl-9 " style={{ ...muiVar, border: `1px solid ${theme.palette.primary.main}`, borderRadius: '4px', paddingTop: '20px' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'center', minWidth: '100%', }}>

            {!isLoading &&
              myAppointmentData.length !== 0 &&
              <Stack spacing={2}>
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
                    marginRight: 'auto'
                  }}
                />
                <Typography variant='h5' align='center' gutterBottom>Total: {userProfile?.reservations_id.length} reservations</Typography>
              </Stack>
            }
          </div>

          {isLoading ?
            <LoadingCompoenent /> :
            myAppointmentData.length !== 0 ?
              <div className="appointments">{appointmentComponents()}</div> :
              <div className='card' style={{ minHeight: '90vh', justifyContent: 'center' }}>
                <CustomNoRowsOverlay text='No Favarite doctors' />
              </div>}



        </div>
        <div className='d-flex align-items-center justify-content-center'>

          {!isLoading &&
            myAppointmentData.length !== 0 &&
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
            />}
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
            <Link target='_blank' className="avatar mx-2" href={`/doctors/dashboard/patient-profile/${btoa(editValues?.patientId as string)}`}>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                online={editValues?.patientProfile?.online as boolean}
              >
                <Avatar alt="" src={`${editValues?.patientProfile?.profileImage}?random=${new Date().getTime()}`} >
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
                }
              }} href={`/doctors/dashboard/patient-profile/${btoa(editValues?.patientId as string)}`}>
              {`${editValues?.patientProfile?.gender} ${editValues?.patientProfile?.gender !== '' ? '.' : ''} ${editValues?.patientProfile?.firstName} ${editValues?.patientProfile?.lastName}`}
            </Typography>
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <ul className="info-details" style={muiVar}>
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
            </ul>
          </DialogContent>
        </BootstrapDialog>
      }
    </Fragment >
  )
});

export default Appointment;