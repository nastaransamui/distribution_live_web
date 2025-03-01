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
import { UserProfileType, updateUserProfile } from '@/redux/userProfile';
import isJsonString from '@/helpers/isJson';
import { updateHomeAccessToken } from '@/redux/homeAccessToken';
import chunkString from '@/helpers/chunkString';
import { updateHomeExp } from '@/redux/homeExp';
import { updateHomeIAT } from '@/redux/homeIAT';
import { updateHomeRoleName } from '@/redux/homeRoleName';
import { updateUserDoctorProfile } from '@/redux/userDoctorProfile';
import { updateUserPatientProfile } from '@/redux/userPatientProfile';
import { updateHomeServices } from '@/redux/homeServices';
import { updateHomeUserId } from '@/redux/homeUserId';

export type ChildrenProps = {
  children: JSX.Element;
};

const AppWrapper = ({ children }: ChildrenProps) => {
  const [percent, setPercent] = useState<number>(50)
  const [showLoading, setShowLoading] = useState<boolean>(true)
  const dispatch = useDispatch()
  const router = useRouter();
  const { bounce } = useScssVar();


  const homeThemeName = useSelector((state: AppState) => state.homeThemeName.value)
  const homeThemeType = useSelector((state: AppState) => state.homeThemeType.value)
  const homeLoadingBar = useSelector((state: AppState) => state.homeLoadingBar.value)
  const homeFormSubmit = useSelector((state: AppState) => state.homeFormSubmit.value)
  // const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userData = useSelector((state: AppState) => state.userData.value)
  const clinicStatus = useSelector((state: AppState) => state.clinicStatus.value)
  const homeAccessToken = useSelector((state: AppState) => state.homeAccessToken.value)
  const specialities = useSelector((state: AppState) => state.specialities.value)
  const homeUserId = useSelector((state: AppState) => state.homeUserId.value)

  const [homeTheme, setHomeTheme] = useState({
    ...appTheme(homeThemeName as string,
      homeThemeType as PaletteMode,
      'ltr'
    ),
  });

  // const { accessToken, user_id, services, roleName, iat, exp } = verifyHomeAccessToken(homeAccessToken)

  const socket = useRef<any>();

  useEffect(() => {
    if (socket.current == undefined) {
      const userProfile = homeRoleName == "doctors" ? userDoctorProfile : userPatientProfile
      createBrowserDb().catch(err => console.log(err))
      socket.current = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
        extraHeaders: {
          userData: JSON.stringify(userData),
          token: `Bearer ${homeAccessToken}`,
          userid: homeUserId || ''
        },
        // transports: ['websocket'], // Ensure WebSocket is used
        secure: true // Explicitly use secure connection
      });
      socket.current.on('connect', () => {
        dispatch(updateHomeSocket(socket))
        setPercent(() => 100)
        setShowLoading(false)
      });
      socket.current.on('getThemeFromAdmin', (msg: { homeThemeName: string, homeThemeType: string, homeActivePage: string }) => {

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
        if (clinicStatusBrowserTable.length == 0) {
          await browserDb.clinicStatusBrowserTable.bulkAdd(msg)
        } else {
          await browserDb.clinicStatusBrowserTable.clear()
          await browserDb.clinicStatusBrowserTable.bulkAdd(msg)
        }
      })
      socket.current.on('getSpecialitiesFromAdmin', async (msg: SpecialitiesType[]) => {
        dispatch(updateSpecialities(msg))
        const specialitiesBrowserTable = await browserDb.specialitiesBrowserTable.toArray();
        if (specialitiesBrowserTable.length == 0) {
          // Remove 'id' from all items before adding
          const specialitiesWithoutId = msg.map(({ id, ...rest }) => rest);
          await browserDb.specialitiesBrowserTable.bulkAdd(specialitiesWithoutId);
        } else {
          await browserDb.specialitiesBrowserTable.clear();
          // Again, remove 'id' from all items before adding
          const specialitiesWithoutId = msg.map(({ id, ...rest }) => rest);
          await browserDb.specialitiesBrowserTable.bulkAdd(specialitiesWithoutId);
        }
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
      socket.current.emit('webJoin', { userProfile, userData: { ...userData, userAgent: navigator.userAgent } })

      socket.current.on('disconnect', () => {
        console.log('disconnect')
      });
      socket.current.on('connect_error', async (err: any) => {
        console.log('connect_error')
        // the reason of the error, for example "xhr poll error"
        console.log(err.message);

        // some additional description, for example the status code of the initial HTTP response
        console.log(err.description);

        // some additional context, for example the XMLHttpRequest object
        console.log(err.context);
        const clinicStatusBrowserTable = await browserDb.clinicStatusBrowserTable.toArray();

        const specialitiesBrowserTable = await browserDb.specialitiesBrowserTable.toArray();

        if (clinicStatusBrowserTable.length !== 0) {
          if (clinicStatus.length == 0) dispatch(updateClinicStatus(clinicStatusBrowserTable))
        }
        if (specialitiesBrowserTable.length !== 0) {
          if (specialities.length == 0) dispatch(updateSpecialities(specialitiesBrowserTable))
        }
        // socket.current.disconnect()
      });
      socket.current.on('connect_failed', () => {
        console.log('connect_failed ')
      });



    } else {
      if (!socket.current?.connected) {
        setPercent(() => 100)
        setShowLoading(false)

      }
    }
    return () => {

      // socket.current.disconnect()
    }


  }, [bounce, clinicStatus, dispatch, homeAccessToken, homeLoadingBar, homeRoleName, homeUserId, router, specialities, userData, userDoctorProfile, userPatientProfile])


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