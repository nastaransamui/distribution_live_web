/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link'
import { doctors_profile, } from '@/public/assets/imagepath';

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

//redux
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';

//liberies
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
import { toast } from 'react-toastify';
import { DoctorProfileType } from '../SearchDoctorSections/SearchDoctorSection';

import ReadMoreText from 'read-more-less-react';
import { ProfileImageStyledBadge } from '../DoctorDashboardSections/MyPtients';

export interface FavDoctorProfile {
  _id: string;
  profile: DoctorProfileType
}

const perPage = 10
const Favourits: FC = (() => {
  const { muiVar, bounce } = useScssVar();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false)
  const [favDoctorsProfile, setFavDoctorsProfile] = useState<FavDoctorProfile[]>([])
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
      if (userProfile?.favs_id && userProfile?.favs_id.length !== 0) {
        homeSocket.current.emit('getUserFavProfile', { userId, favIdArray, limit, skip })
        homeSocket.current.once('getUserFavProfileReturn', (msg: { status: number, userFavProfile: FavDoctorProfile[], message?: string }) => {
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
              setFavDoctorsProfile(() => {
                let newState = []
                newState = [...userFavProfile]
                return newState
              })
            }
            homeSocket.current.once(`updateGetUserFavProfile`, () => {
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

  const removeFavDoctor = (doctor: FavDoctorProfile) => {
    if (homeSocket?.current) {
      homeSocket.current.emit('removeDocFromFav', { doctorId: doctor?._id, patientId: userProfile?._id })
      homeSocket.current.once('removeDocFromFavReturn', (msg: { status: number, message: string }) => {
        const { status, message } = msg;
        if (status !== 200) {
          toast.error(message, {
            position: "bottom-center",
            toastId: 'error',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: bounce,
            onClose: () => {
              toast.dismiss('error')
            }
          });
        } else {
          setFavDoctorsProfile((prevState: FavDoctorProfile[]) => {
            let newState = prevState.filter((doc: FavDoctorProfile) => doc._id !== doctor?._id)
            return [...newState]
          })
        }
      })
    }
  }

  const doctorComponents = () => {
    return (
      <Grid container spacing={1}>
        {
          favDoctorsProfile.map((doctor: FavDoctorProfile, index: number) => {
            const title = `Dr. ${doctor?.profile?.firstName} ${doctor?.profile?.lastName}`;
            const firstDayAvailable =
              doctor?.profile?.timeslots.length > 0 &&
                doctor?.profile?.timeslots[0]?.availableSlots?.length > 0 ?
                doctor?.profile?.timeslots[0]?.availableSlots?.[0]?.startDate : ''
            const { isTodayAvailable, isTommorowAvailable } =
              doctor?.profile?.timeslots.length > 0 ?
                doctor?.profile?.timeslots[0] : { isTodayAvailable: false, isTommorowAvailable: false }

            return (
              <Grid item xl={3} lg={4} md={minWidth767max923 ? 12 : 6} sm={minWidth767max923 ? 12 : 6} key={doctor?._id}>

                <div className="profile-widget">
                  <div className="doc-img">
                    <Link href={`/doctors/search/${btoa(doctor?._id)}`}>
                      <ProfileImageStyledBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                        online={doctor?.profile?.online as boolean}
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
                          src={`${doctor?.profile?.profileImage}?random=${new Date().getTime()}`}
                          key={doctor?.profile?.profileImage}
                        >
                          <img className="img-fluid" src={doctors_profile} alt="" />
                        </Avatar>

                      </ProfileImageStyledBadge>
                    </Link>
                    <Tooltip arrow title={`Remove doctor to favorite.`}>
                      <Link href="" onClick={(e) => {
                        e.preventDefault();
                        removeFavDoctor(doctor)
                      }} className="fav-btn">
                        <i className="far fa-bookmark"></i>
                      </Link>
                    </Tooltip>
                  </div>
                  <div className="pro-content">
                    <h3 className="title">
                      <Link href={`/doctors/search/${btoa(doctor?._id)}`}>{title}</Link>
                      <i className="fas fa-check-circle verified"></i>
                    </h3>

                    <ReadMoreText
                      key={doctor?.profile?.specialities[0]?.description}
                      lines={1}
                      type='plainText'
                      aria-expanded="false"
                      text={doctor?.profile?.specialities[0]?.description}
                    />

                    <Rating name="read-only" value={3.5} precision={0.5} readOnly size='small' />
                    <span className="d-inline-block average-rating">(17)</span>
                    <ul className="available-info">
                      <li>
                        <i className="fas fa-map-marker-alt"></i>
                        {doctor?.profile?.state}, {doctor?.profile?.country}
                      </li>
                      <li>
                        <i className="far fa-clock"></i>
                        {
                          isTodayAvailable ?
                            `Available on Today` :
                            isTommorowAvailable ?
                              `Available Tommorow` :
                              firstDayAvailable !== '' ?
                                `Available on ${firstDayAvailable}` :
                                `No Have availability.`
                        }
                      </li>
                      <li>
                        <i className="far fa-money-bill-alt"></i>
                        $300 - $1000 {" "}
                        <i className="fas fa-info-circle" data-bs-toggle="tooltip" title="Lorem Ipsum"></i>
                      </li>
                    </ul>
                    <div className="row row-sm">
                      <div className="col-6">
                        <Button
                          href={`/doctors/search/${btoa(doctor?._id)}`}
                          className="btn view-btn">
                          View Profile
                        </Button>
                      </div>
                      <div className="col-6">
                        <Button
                          href={`/doctors/search/${btoa(doctor?._id)}`}
                          className="btn book-btn"
                          sx={{
                            "&.MuiButtonBase-root.Mui-disabled ": {
                              color: 'crimson',
                              background: 'transparent' + ` !important`
                            }
                          }}
                          disabled={doctor?.profile?.timeslots.length == 0}>
                          Book Now
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
              favDoctorsProfile.length !== 0 &&
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
            favDoctorsProfile.length !== 0 ?
              <>{doctorComponents()}</> :
              <div className='card' style={{ minHeight: '90vh', justifyContent: 'center' }}><CustomNoRowsOverlay text='No Favarite doctors' /></div>}



        </div>
        <div className='d-flex align-items-center justify-content-center'>

          {!isLoading &&
            favDoctorsProfile.length !== 0 &&
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