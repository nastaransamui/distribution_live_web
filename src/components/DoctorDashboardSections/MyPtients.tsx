/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import { patient_profile } from '@/public/assets/imagepath';

//Mui
import { useTheme } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import Avatar from '@mui/material/Avatar';
import CustomNoRowsOverlay from '../shared/CustomNoRowsOverlay';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material';
import Badge from '@mui/material/Badge'
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

//redux
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';


//liberies
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import preciseDiff from 'dayjs-precise-range'

export const ProfileImageStyledBadge = styled(Badge, {
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

export interface PatientProfile {
  _id: string;
  createdAt: Date;
  firstName: string;
  lastName: string;
  dob: string;
  bloodG: string;
  userName: string;
  mobileNumber: string;
  profileImage: string;
  roleName: 'doctors' | 'patient' | 'pharmacist';
  services: string;
  gender: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  accessToken: string;
  invoice_ids: any[],
  reviews_array: any[];
  rate_array: any[];
  reservations_id: any[];
  doctors_id: any[];
  favs_id: any[];
  prescriptions_id: string[];
  online: boolean;
  isActive: boolean;
  lastUpdate: Date;
  isVerified: boolean | 'google';
  idle?: boolean;
  lastLogin?: {
    date: Date;
    ipAddr: string;
    userAgent: string;
  };

}


export interface MyPatientsProfile {
  _id: string;
  profile: PatientProfile
}

const perPage = 10
const MyPtients: FC = (() => {
  const { muiVar, bounce } = useScssVar();
  dayjs.extend(preciseDiff)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false)
  const [patiensDataProfile, setpatiensDataProfile] = useState<MyPatientsProfile[]>([])
  const theme = useTheme();
  const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const minWidth767max923 = useMediaQuery('@media (min-width: 767px) and (max-width:923px)');
  const [page, setPage] = useState(1);
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };


  useEffect(() => {
    let isActive = true;
    let userId = userProfile?._id
    let patientsIdArray = userProfile?.patients_id
    let limit = perPage * page;
    let skip = (page - 1) * perPage
    if (isActive && homeSocket.current !== undefined && userProfile !== null) {
      if (userProfile?.patients_id && userProfile?.patients_id.length !== 0) {
        homeSocket.current.emit('getMyPatientsProfile', { userId, patientsIdArray, limit, skip })
        homeSocket.current.once('getMyPatientsProfileReturn', (msg: { status: number, myPatientsProfile: MyPatientsProfile[], message?: string }) => {
          const { status, myPatientsProfile, message } = msg;
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
            if (myPatientsProfile.length !== 0) {
              setpatiensDataProfile(() => {
                let newState = []
                newState = [...myPatientsProfile]
                return newState
              })
            }
            homeSocket.current.once(`updateGetMyPatientsProfile`, () => {
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


  const patientComponents = () => {
    return (
      <>
        {
          patiensDataProfile.map((patient: MyPatientsProfile, index: number) => {
            const name = `${patient?.profile?.gender} ${patient?.profile?.gender !== '' ? '.' : ''} ${patient?.profile?.firstName} ${patient?.profile?.lastName}`;

            //@ts-ignore
            let { years, months, days } = dayjs.preciseDiff(patient?.profile?.dob, dayjs(), true)
            return (
              <div className="col-md-6 col-lg-4 col-xl-3 " key={index}>
                <div className="card widget-profile pat-widget-profile">
                  <div className="card-body">
                    <div className="pro-widget-content">
                      <div className="profile-info-widget">
                        <Link aria-label="patient"
                          href={`/doctors/dashboard/patient-profile/${btoa(patient?._id as string)}`}
                          className="booking-doc-img"
                        >
                          <ProfileImageStyledBadge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            variant="dot"
                            online={patient?.profile?.online as boolean}
                          >
                            <Avatar sx={{
                              width: 'auto',
                              height: 'auto',
                              borderRadius: `5px 5px 5px 5px`,
                              padding: '5px',
                              transition: 'all 2000ms cubic-bezier(0.19, 1, 0.22, 1) 0ms',
                              "&:hover": {
                                transform: "scale(1.15)",

                              },
                              background: theme.palette.background.default
                            }}
                              variant="circular"
                              alt=""
                              src={`${patient?.profile?.profileImage}?random=${new Date().getTime()}`}
                              key={patient?.profile?.profileImage}
                            >
                              <img className="img-fluid" style={{ borderRadius: '50%' }} src={patient_profile} alt="" />
                            </Avatar>
                          </ProfileImageStyledBadge>
                        </Link>
                        <div className="profile-det-info">
                          <h1>
                            <Link aria-label="patient" href={`/doctors/dashboard/patient-profile/${btoa(patient?._id as string)}`}>
                              {name}
                            </Link>
                          </h1>

                          <div className="patient-details">
                            <h2>
                              <b>Patient ID :</b> {patient._id}
                            </h2>
                            <h2 className="mb-0">
                              <i className="fas fa-map-marker-alt"></i>{" "}
                              {patient.profile.address1}
                            </h2>
                            <h2 className="mb-0">
                              {patient?.profile?.address2}
                            </h2>
                            <h2 className="mb-0">
                              {patient?.profile?.city}
                            </h2>
                            <h2 className="mb-0">
                              {patient?.profile?.state}
                            </h2>
                            <h2 className="mb-0">
                              {patient?.profile?.country}
                            </h2>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="patient-info">
                      <ul>
                        <li>
                          Phone <span>{patient.profile?.mobileNumber}</span>
                        </li>
                        <li>
                          Birthday <span>{patient?.profile?.dob !== '' ? dayjs(patient?.profile?.dob).format('DD MMM YYYY') : '---- -- --'}</span>
                        </li>
                        <li>
                          Age <span>{`${isNaN(years) ? '--' : years} years ${isNaN(months) ? '--' : months} months ${isNaN(days) ? '--' : days} days`}</span>
                        </li>
                        <li>
                          Blood Group <span>{patient.profile?.bloodG}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        }
      </>)
  }

  return (
    <Fragment>
      <div className="col-md-7 col-lg-8 col-xl-9  doctors-appointment-wrapper" style={muiVar}>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'center', minWidth: '100%', top: '-50px' }}>

            {!isLoading &&
              patiensDataProfile.length !== 0 &&
              <Stack spacing={2}>
                <Pagination
                  showFirstButton
                  showLastButton
                  hideNextButton
                  hidePrevButton
                  boundaryCount={1}
                  variant="outlined"
                  color="secondary"
                  count={userProfile ? Math.ceil(userProfile?.patients_id.length / perPage) : 0}
                  page={page}
                  onChange={handlePageChange}
                  sx={{
                    marginLeft: 'auto',
                    marginRight: 'auto'
                  }}
                />
                <Typography variant='h5' align='center' gutterBottom>Total: {userProfile?.patients_id.length} Patients</Typography>
              </Stack>
            }
          </div>

          {isLoading ?
            <LoadingCompoenent /> :
            patiensDataProfile.length !== 0 ?
              <div className="row row-grid">{patientComponents()}</div> :
              <div className='card' style={{ minHeight: '90vh', justifyContent: 'center' }}><CustomNoRowsOverlay text='No Favarite doctors' /></div>}



        </div>
        <div className='d-flex align-items-center justify-content-center'>

          {!isLoading &&
            patiensDataProfile.length !== 0 &&
            <Pagination
              showFirstButton
              showLastButton
              hideNextButton
              hidePrevButton
              boundaryCount={1}
              variant="outlined"
              color="secondary"
              count={userProfile ? Math.ceil(userProfile?.patients_id.length / perPage) : 0}
              page={page}
              onChange={handlePageChange}
              sx={{ mb: 3 }}
            />}
        </div>
      </div>
    </Fragment>
  )
});

export default MyPtients;