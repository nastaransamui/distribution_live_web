//Rect
import { Fragment, useEffect, useState, useRef } from 'react'
//Theme
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';


//Redux
import { AppState } from '../redux/store'
import { useDispatch, useSelector } from 'react-redux';
import { updateHomeLoadingBar } from '@/redux/homeLoadingBar';


//Utill
import LoadingBar from 'react-top-loading-bar';
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
import { ToastContainer, toast } from 'react-toastify';

//Mui
import Backdrop from '@mui/material/Backdrop';
import appTheme from './appTheme';
import { PaletteMode } from '@mui/material';
import { StylesProvider } from '@mui/styles';
import { create } from 'jss';
import { jssPreset } from '@mui/styles'
import rtl from 'jss-rtl';


//socket 
import io from "socket.io-client";

//Next
import { deleteCookie, getCookie, hasCookie, setCookie, } from 'cookies-next';
import Header from '@/components/shared/Header';
import { useRouter } from 'next/router';
import useScssVar from '@/hooks/useScssVar';
import { ClinicStatusType, updateClinicStatus } from '@/redux/clinicStatus';
import { updateHomeSocket } from '@/redux/homeSocket';
import { SpecialitiesType, updateSpecialities } from '@/redux/specialities';


//indexdb
import browserDb, { createBrowserDb } from '@/hooks/useBrowserDb';
import verifyHomeAccessToken from '@/helpers/verifyHomeAccessToken';
import _ from 'lodash'
import { updateHomeAccessToken } from '@/redux/homeAccessToken';

import { updateHomeExp } from '@/redux/homeExp';
import { updateHomeIAT } from '@/redux/homeIAT';
import { updateHomeRoleName } from '@/redux/homeRoleName';
import { updateUserDoctorProfile } from '@/redux/userDoctorProfile';
import { updateUserPatientProfile } from '@/redux/userPatientProfile';
import { updateHomeServices } from '@/redux/homeServices';
import { updateHomeUserId } from '@/redux/homeUserId';
import { BestDoctorsDataType, updateBestDoctorsData } from '@/redux/bestDoctorsData';
import { LastReviewsDataType, updateLastReviewsData } from '@/redux/lastReviewsData';
import { BestCardioDoctorsDataType, updateBestCardioDoctorsData } from '@/redux/bestCardioDoctors';
import { updateBestEyeCareDoctorsData } from '@/redux/bestEyeCareDoctors';

export type ChildrenProps = {
  children: JSX.Element;
};

const AppWrapper = ({ children }: ChildrenProps) => {
  const dispatch = useDispatch()
  const router = useRouter();
  const { bounce } = useScssVar();


  const homeThemeName = useSelector((state: AppState) => state.homeThemeName.value)
  const homeThemeType = useSelector((state: AppState) => state.homeThemeType.value)
  const homeLoadingBar = useSelector((state: AppState) => state.homeLoadingBar.value)
  const homeFormSubmit = useSelector((state: AppState) => state.homeFormSubmit.value)
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;
  const userData = useSelector((state: AppState) => state.userData.value)
  const homeAccessToken = useSelector((state: AppState) => state.homeAccessToken.value)
  const homeUserId = useSelector((state: AppState) => state.homeUserId.value)
  const [homeTheme, setHomeTheme] = useState({
    ...appTheme(homeThemeName as string,
      homeThemeType as PaletteMode,
      'ltr'
    ),
  });

  const socket = useRef<any>(null);

  useEffect(() => {
    createBrowserDb().catch(err => console.log(err))
    const createSocket = () => {
      const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
        extraHeaders: {
          userData: JSON.stringify(userData),
          token: `Bearer ${homeAccessToken}`,
          userid: homeUserId || '',
        },
        secure: true,
      });

      newSocket.on('connect', () => {
        dispatch(updateHomeSocket({ current: newSocket })); //update homeSocket to the new socket.
        socket.current.on('getThemeFromAdmin', (msg: { homeThemeName: string, homeThemeType: string, homeActivePage: string }) => {
          const body = document.getElementById('body');
          if (body) {
            body.style.backgroundColor = msg?.homeThemeType == "dark" ? '#212121' : '#fff'
          }

          setCookie('homeThemeType', msg?.homeThemeType || "dark")
          setCookie('homeThemeName', msg?.homeThemeName || "joker")
          setCookie('homeActivePage', msg?.homeActivePage || "default")
          dispatch(updateHomeLoadingBar(homeLoadingBar == 100 ? 0 : 100))
          setHomeTheme((prevState: any) => {
            return {
              ...appTheme(msg?.homeThemeName || "joker" as string,
                msg?.homeThemeType as PaletteMode || "dark",
                'ltr'
              )
            }
          })
        })
        socket.current.on('getClinicStatusFromAdmin', async (msg: ClinicStatusType[]) => {
          dispatch(updateClinicStatus(msg))
          const clinicStatusBrowserTable = await browserDb.clinicStatusBrowserTable.toArray();
          const removedIdMsg = msg.map(item => {
            const { id, ...rest } = item;
            return rest;
          });
          const removedIdIndexDb = clinicStatusBrowserTable.map(item => {
            const { id, ...rest } = item;
            return rest;
          });
          if (_.isEqual(removedIdMsg, removedIdIndexDb)) {
            await browserDb.clinicStatusBrowserTable.clear()
            await browserDb.clinicStatusBrowserTable.bulkAdd(msg)
          } else {
            await browserDb.clinicStatusBrowserTable.clear()
            await browserDb.clinicStatusBrowserTable.bulkAdd(msg)
          }
        })
        socket.current.on('getSpecialitiesFromAdmin', async (msg: SpecialitiesType[]) => {
          dispatch(updateSpecialities(msg))

          const specialitiesBrowserTable = await browserDb.specialitiesBrowserTable.toArray();
          const removedIdMsg = msg.map(({ id, ...rest }) => rest);
          const removedIdIndexDb = specialitiesBrowserTable.map(({ id, ...rest }) => rest);

          if (_.isEqual(removedIdMsg, removedIdIndexDb)) {
            await browserDb.specialitiesBrowserTable.clear();
          }

          await browserDb.specialitiesBrowserTable.bulkPut(removedIdMsg);
        })
        socket.current.on('getUserProfileFromAdmin', async (msg: string) => {
          //Handle update token
          var { accessToken, user_id, services, roleName, iat, exp, userProfile: newUserProfile } = verifyHomeAccessToken(msg)

          const { isActive } = newUserProfile;
          if (accessToken == '' || accessToken !== userProfile?.accessToken || !isActive) {
            //Logut users
            if (getCookie('homeAccessToken')) {
              deleteCookie('homeAccessToken')
              dispatch(updateHomeAccessToken(null))
              toast.info('This user is not eligible to login any more', {
                position: "bottom-center",
                autoClose: 5000,
                toastId: 'connectionError',
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                transition: bounce,
                onClose: () => {
                  toast.dismiss('connectionError')
                  router.reload();
                }
              });
            }
          } else {
            dispatch(updateHomeAccessToken(accessToken))
            dispatch(updateHomeExp(exp));
            dispatch(updateHomeIAT(iat))
            dispatch(updateHomeRoleName(roleName))
            dispatch(updateHomeServices(services));
            dispatch(updateHomeUserId(user_id));
            if (roleName == 'doctors') {
              dispatch(updateUserDoctorProfile(newUserProfile))
            } else if (roleName == 'patient') {
              dispatch(updateUserPatientProfile(newUserProfile));
            }

            setCookie('homeAccessToken', accessToken);
            setCookie('user_id', user_id);
            setCookie('services', services);
            setCookie('roleName', roleName);
            setCookie('iat', iat);
            setCookie('exp', exp);
          }

        })
        socket.current.on('getLastReviewsFromAdmin', async (msg: { status: number, data: LastReviewsDataType[] }) => {
          const { status, data } = msg;
          if (status == 200) {
            const { lastReviews, totalReviews } = data[0];
            dispatch(updateLastReviewsData({
              lastReviews: lastReviews || [],
              totalReviews: totalReviews ?? 0
            }));
          } else {
            dispatch(updateLastReviewsData({
              lastReviews: [],
              totalReviews: 0
            }));
          }
        })
        socket.current.on('getBestDoctorsFromAdmin', async (msg: { status: number, data: BestDoctorsDataType[] }) => {
          const { status, data } = msg;
          if (status == 200) {
            const { bestDoctors, totalBestDoctors, totalDoctors } = data[0];
            dispatch(updateBestDoctorsData({
              bestDoctors: bestDoctors || [],
              totalBestDoctors: totalBestDoctors ?? 0,
              totalDoctors: totalDoctors ?? 0,
            }));
          } else {
            dispatch(updateBestDoctorsData({
              bestDoctors: [],
              totalBestDoctors: 0,
              totalDoctors: 0,
            }));
          }
        })


        socket.current.on('getBestCardiologyDoctorsFromAdmin', async (msg: { status: number, data: BestCardioDoctorsDataType[] }) => {
          const { status, data } = msg;
          if (status == 200) {
            const { bestDoctors, totalBestDoctors, totalDoctors } = data[0];
            dispatch(updateBestCardioDoctorsData({
              bestDoctors: bestDoctors || [],
              totalBestDoctors: totalBestDoctors ?? 0,
              totalDoctors: totalDoctors ?? 0,
            }));
          } else {
            dispatch(updateBestCardioDoctorsData({
              bestDoctors: [],
              totalBestDoctors: 0,
              totalDoctors: 0,
            }));
          }
        })
        // getBestOphthalmologyDoctorsFromAdmin
        socket.current.on('getBestOphthalmologyDoctorsFromAdmin', async (msg: { status: number, data: BestCardioDoctorsDataType[] }) => {
          const { status, data } = msg;
          if (status == 200) {
            const { bestDoctors, totalBestDoctors, totalDoctors } = data[0];
            dispatch(updateBestEyeCareDoctorsData({
              bestDoctors: bestDoctors || [],
              totalBestDoctors: totalBestDoctors ?? 0,
              totalDoctors: totalDoctors ?? 0,
            }));
          } else {
            dispatch(updateBestEyeCareDoctorsData({
              bestDoctors: [],
              totalBestDoctors: 0,
              totalDoctors: 0,
            }));
          }
        })
        socket.current.emit('webJoin', { userProfile, userData: { ...userData, userAgent: navigator.userAgent } })

      });

      return newSocket;
    };



    if (!socket.current) {
      socket.current = createSocket();
    } else {
      if (socket.current.disconnected) {
        socket.current = createSocket();
      } else {
        socket.current.emit('getLastReviewsFromAdmin',)
        socket.current.emit('getBestDoctorsFromAdmin',)
        socket.current.emit('getBestCardiologyDoctorsFromAdmin')
        socket.current.emit('getBestOphthalmologyDoctorsFromAdmin',)
      }
    }


    const handleRouteChange = (url: string) => {
      if (socket.current) {
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      if (socket.current) {
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, homeAccessToken, homeUserId, userData, router.asPath]);
  useEffect(() => {
    const loadData = async () => {
      try {
        await createBrowserDb(); // Ensure db is created
        const data = await browserDb.clinicStatusBrowserTable.toArray();
        if (data.length !== 0) {
          dispatch(updateClinicStatus(data));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);




  const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
  return (
    <Fragment >
      <ThemeProvider theme={homeTheme}>

        <StylesProvider jss={jss}>
          <CssBaseline />
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => 1205 }}
            open={homeFormSubmit}
          >
            <CircleToBlockLoading color={homeTheme.palette.primary.main} />
          </Backdrop>
          <LoadingBar
            height={5}
            shadow
            color={homeTheme.palette.secondary.main}
            progress={homeLoadingBar}
            className='top-loading-bar'
            data-testid="loadingBar"
          />
          <ToastContainer
            transition={bounce}
            position="bottom-center"
            autoClose={5000}
            limit={1}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable={false}
            pauseOnHover
            theme={homeTheme?.palette?.mode}
          />
          <>
            {router.route !== '/404' ?
              <Fragment>
                {(!router.route.startsWith('/verify-email') && !router.route.startsWith('/reset-password')) && <Header />}
                <div dir={homeTheme.direction} className='app-wrapper-div' style={{ background: homeTheme.palette.background.paper, }}>
                  {/* overflowX: 'hidden' */}
                  {children}
                </div>
              </Fragment>
              :
              <div dir={homeTheme.direction} >
                {children}
              </div>
            }
          </>

        </StylesProvider>
      </ThemeProvider>
    </Fragment>
  )
}

export default AppWrapper;