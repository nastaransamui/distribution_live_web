/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link'
import { doctors_profile, patient_profile, } from '@/public/assets/imagepath';

//Mui
import { useTheme } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import Rating from '@mui/material/Rating';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CustomNoRowsOverlay from '../shared/CustomNoRowsOverlay';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import FavoriteIcon from '@mui/icons-material/Favorite';
//redux
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';

//liberies
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
import { toast } from 'react-toastify';

import ReadMoreText from 'read-more-less-react';
import { PatientProfile, ProfileImageStyledBadge } from './MyPtients';
import dayjs from 'dayjs';

export interface FavPatientProfile {
  _id: string;
  profile: PatientProfile
}

const perPage = 10
const Favourits: FC = (() => {
  const { muiVar, bounce } = useScssVar();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false)
  const [favPatientsProfile, setFavPatientsProfile] = useState<FavPatientProfile[]>([])
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
    let favIdArray = userProfile?.favs_id
    let limit = perPage * page;
    let skip = (page - 1) * perPage
    if (isActive && homeSocket.current !== undefined && userProfile !== null) {
      // if (userProfile?.favs_id && userProfile?.favs_id.length !== 0) {
      homeSocket.current.emit('getUserFavProfile', { userId, favIdArray, limit, skip })
      homeSocket.current.once('getUserFavProfileReturn', (msg: { status: number, userFavProfile: FavPatientProfile[], message?: string }) => {
        const { status, userFavProfile, message } = msg;
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
          if (userFavProfile.length !== 0) {
            setFavPatientsProfile(() => {
              let newState = []
              newState = [...userFavProfile]
              return newState
            })
          } else {
            setFavPatientsProfile(() => { return [] })
          }
          homeSocket.current.once(`updateGetUserFavProfile`, () => {
            setReload(!reload)
          })
          setIsLoading(false)
        }

      })
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


  const doctorComponents = () => {
    return (
      <Grid container spacing={1}>
        {
          favPatientsProfile.map((patient: FavPatientProfile, index: number) => {
            const title = `${patient.profile?.gender !== '' ? `${patient?.profile?.gender}.` : ``} ${patient?.profile?.firstName} ${patient?.profile?.lastName}`;
            return (
              <Grid item xl={3} lg={4} md={minWidth767max923 ? 12 : 6} sm={minWidth767max923 ? 12 : 6} key={patient?._id}>
                <div className="profile-widget">
                  <div className="doc-img">
                    <Link href={`/doctors/dashboard/patient-profile/${btoa(patient?._id)}`} aria-label='doctor profile'>
                      <ProfileImageStyledBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                        online={patient?.profile?.online as boolean}
                      >
                        <Avatar sx={{
                          width: 'auto',
                          height: 'auto',
                          maxHeight: '269px',
                          borderRadius: `5px`,
                          transition: 'all 2000ms cubic-bezier(0.19, 1, 0.22, 1) 0ms',
                          "&:hover": {
                            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                            transform: "scale(1.15)",
                          },

                        }}
                          variant="square"
                          alt=""
                          src={`${patient?.profile?.profileImage}?random=${new Date().getTime()}`}
                          key={patient?.profile?.profileImage}
                        >
                          <img className="img-fluid" src={patient_profile} alt="" />
                        </Avatar>

                      </ProfileImageStyledBadge>
                    </Link>
                  </div>
                  <div className="pro-content">
                    <h3 className="title">
                      <Link href={`/doctors/dashboard/patient-profile/${btoa(patient?._id)}`}>{title}</Link>
                      <i className="fas fa-check-circle verified"></i>
                    </h3>

                    <ul className="available-info">
                      <li>
                        <i className="fas fa-map-marker-alt"></i>
                        {`${patient?.profile?.address1 !== '' ? patient?.profile?.address1 + ',' : ''}`}
                        {`${patient?.profile?.address2 !== '' ? patient?.profile?.address2 + ',' : ''}`}<br />
                        {`${patient?.profile?.city !== '' ? patient?.profile?.city + ',' : ''}`}<br />
                        {`${patient?.profile?.state !== '' ? patient?.profile?.state + ',' : ''}`}<br />
                        {`${patient?.profile?.country !== '' ? patient?.profile?.country + ',' : ''}`}
                      </li>
                      <li>
                        <i className="fas fa-birthday-cake"></i>
                        {dayjs(patient?.profile?.dob).format(`MMMM D, YYYY`)}
                      </li>
                      <li>
                        {patient?.profile.bloodG !== '' ? `🩸  - ${patient?.profile.bloodG}` : ''}
                      </li>
                    </ul>
                    <div className="row row-sm">
                      <div className="col-12">
                        <Button
                          href={`/doctors/dashboard/patient-profile/${btoa(patient?._id)}`}
                          className="btn view-btn">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Grid>
            )
          })
        }
      </Grid>
    )
  }

  return (
    <Fragment>
      <div className="col-md-7 col-lg-8 col-xl-9 " style={muiVar}>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'center', position: 'absolute', minWidth: '100%', top: '-50px' }}>

            {!isLoading &&
              favPatientsProfile.length !== 0 &&
              <Pagination
                showFirstButton
                showLastButton
                hideNextButton
                hidePrevButton
                boundaryCount={1}
                variant="outlined"
                color="secondary"
                count={userProfile ? Math.ceil(userProfile?.favs_id.length / perPage) : 0}
                page={page}
                onChange={handlePageChange}
              />}
          </div>

          {isLoading ?
            <LoadingCompoenent /> :
            favPatientsProfile.length !== 0 ?
              <>{doctorComponents()}</> :
              <div className='card' style={{ minHeight: '90vh', justifyContent: 'center' }}><CustomNoRowsOverlay text='No Favarite Patients' /></div>}



        </div>
        <div className='d-flex align-items-center justify-content-center'>

          {!isLoading &&
            favPatientsProfile.length !== 0 &&
            <Pagination
              showFirstButton
              showLastButton
              hideNextButton
              hidePrevButton
              boundaryCount={1}
              variant="outlined"
              color="secondary"
              count={userProfile ? Math.ceil(userProfile?.favs_id.length / perPage) : 0}
              page={page}
              onChange={handlePageChange}
              sx={{ mb: 3 }}
            />}
        </div>

      </div>
    </Fragment>
  )
});

export default Favourits;