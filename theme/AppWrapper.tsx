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
  const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const userData = useSelector((state: AppState) => state.userData.value)
  const clinicStatus = useSelector((state: AppState) => state.clinicStatus.value)
  const homeAccessToken = useSelector((state: AppState) => state.homeAccessToken.value)
  const specialities = useSelector((state: AppState) => state.specialities.value)


  const [homeTheme, setHomeTheme] = useState({
    ...appTheme(homeThemeName as string,
      homeThemeType as PaletteMode,
      'ltr'
    ),
  });

  const { accessToken, user_id, services, roleName, iat, exp } = verifyHomeAccessToken(homeAccessToken)

  const socket = useRef<any>();

  useEffect(() => {
    if (socket.current == undefined) {

      createBrowserDb().catch(err => console.log(err))
      // NEXT_PUBLIC_SOCKET_URL
      socket.current = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
        extraHeaders: {
          userData: JSON.stringify(userData),
          token: `Bearer ${accessToken}`,
          userid: user_id
        },
        transports: ['websocket'], // Ensure WebSocket is used
        secure: true // Explicitly use secure connection
      });
      socket.current.on('connect', () => {
        // console.log('connect in Appwrapper page first')
        dispatch(updateHomeSocket(socket))
        setPercent(() => 100)
        setShowLoading(false)
      });
      socket.current.on('getThemeFromAdmin', (msg: { homeThemeName: string, homeThemeType: string, homeActivePage: string }) => {
        // if (!hasCookie('homeActivePage')) {
        //   switch (msg.homeActivePage) {
        //     case 'general_0':
        //       router.push('/home')
        //       break;
        //     case 'general_1':
        //       router.push('/home3')
        //       break;
        //     case 'general_2':
        //       router.push('/home4')
        //       break;
        //   }
        // }

        setCookie('homeThemeType', msg.homeThemeType)
        setCookie('homeThemeName', msg.homeThemeName)
        setCookie('homeActivePage', msg.homeActivePage)
        dispatch(updateHomeLoadingBar(homeLoadingBar == 100 ? 0 : 100))
        setHomeTheme((prevState: any) => {
          return {
            ...appTheme(msg.homeThemeName as string,
              msg.homeThemeType as PaletteMode,
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
          await browserDb.specialitiesBrowserTable.bulkAdd(msg)
        } else {
          await browserDb.specialitiesBrowserTable.clear();
          await browserDb.specialitiesBrowserTable.bulkAdd(msg)
        }
      })
      socket.current.on('getUserProfileFromAdmin', async (msg: string) => {
        //Handle update token
        var { accessToken, user_id, services, roleName, iat, exp, userProfile: newUserProfile } = verifyHomeAccessToken(msg)
        const { isActive } = newUserProfile;
        // console.log({ accessToken, user_id, services, roleName, iat, exp, userProfile, isActive })

        if (accessToken == '' || accessToken !== userProfile?.accessToken || !isActive) {
          //Logut users
          if (isJsonString(getCookie('homeAccessToken') as string)) {
            const { length } = JSON.parse(getCookie('homeAccessToken') as string)
            for (var i = 0; i < parseInt(length); i++) {
              deleteCookie(`${i}`);
            }
          }
          if (getCookie('homeAccessToken')) {
            deleteCookie('homeAccessToken')
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
          switch (true) {
            case msg.length <= 4095:
              if (isJsonString(getCookie('homeAccessToken') as string)) {
                const { length } = JSON.parse(getCookie('homeAccessToken') as string)
                for (var i = 0; i < parseInt(length); i++) {
                  deleteCookie(`${i}`);
                }
              }
              dispatch(updateHomeAccessToken(msg))
              dispatch(updateUserProfile(newUserProfile))
              setCookie('homeAccessToken', msg);
              break;
            default:
              const result = chunkString(msg, 4095)
              if (result !== null) {
                setCookie('homeAccessToken', { isSplit: true, length: result.length });
                for (let index = 0; index < result.length; index++) {
                  const element = result[index];
                  setCookie(`${index}`, element)
                }
                dispatch(updateHomeAccessToken(msg))
                dispatch(updateUserProfile(newUserProfile))
              }
              break;
          }
        }

        // dispatch(updateSpecialities(msg))
        // const specialitiesBrowserTable = await browserDb.specialitiesBrowserTable.toArray();
        // if (specialitiesBrowserTable.length == 0) {
        //   await browserDb.specialitiesBrowserTable.bulkAdd(msg)
        // } else {
        //   await browserDb.specialitiesBrowserTable.clear();
        //   await browserDb.specialitiesBrowserTable.bulkAdd(msg)
        // }
      })
      socket.current.emit('webJoin', { userProfile, userData: { ...userData, userAgent: navigator.userAgent } })
      // socket.current.on('event', (data: any) => {
      //   console.log('event in login page', data)
      // });
      socket.current.on('disconnect', () => {
        console.log('disconnect')
      });
      socket.current.on('connect_error', async (error: any) => {
        console.log(error)
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
      // socket.current.on("loginPageUsers", (msg: number) => {
      //   console.log(msg)
      // });
      // socket.current.on('ping', (msg: any) => {
      //   console.log('ping')
      //   console.log(msg)
      // })


    } else {
      if (!socket.current?.connected) {
        console.log('socket.current?.connected in Appwrapper is false')
        // toast.info('Now connection to server is closed you need to refresh the page to be online again', {
        //   position: "bottom-center",
        //   autoClose: 5000,
        //   toastId: 'connectionError',
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        //   transition: bounce,
        //   onClose: () => {
        //     toast.dismiss('connectionError')
        //   }
        // });
        setPercent(() => 100)
        setShowLoading(false)

      }
    }
  }, [
    bounce,
    dispatch,
    homeLoadingBar,
    router,
    userData,
    clinicStatus,
    userProfile,
    homeAccessToken,
    specialities.length,
    accessToken,
    user_id
  ])


  const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
  return (
    <Fragment >
      <ThemeProvider theme={homeTheme}>
        <StylesProvider jss={jss}>
          <CssBaseline />
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
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
            {/* {
              showLoading ?
                <div className="flexy-column" >
                  <div className="progress-factor flexy-item" >
                    <div className="progress-bar" style={{ position: 'absolute', top: '50%', right: 3 }}>
                      <div className="bar has-rotation has-colors dark dots-pattern" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} >
                        <div className="tooltip"></div>
                        <div className="bar-face face-position roof percentage"></div>
                        <div className="bar-face face-position back percentage"></div>
                        <div className="bar-face face-position floor percentage volume-lights"></div>
                        <div className="bar-face face-position left"></div>
                        <div className="bar-face face-position right"></div>
                        <div className="bar-face face-position front percentage volume-lights shine"></div>
                      </div>
                    </div>
                  </div>
                </div>
                :  */}
            <>
              {router.route !== '/404' ?
                <Fragment>
                  {(!router.route.startsWith('/verify-email') && !router.route.startsWith('/reset-password')) && <Header />}
                  <div dir={homeTheme.direction} style={{ background: homeTheme.palette.background.paper, overflowX: 'hidden' }}>
                    {children}
                  </div>
                </Fragment>
                :
                <div dir={homeTheme.direction} >
                  {children}
                </div>
              }
            </>
            {/* } */}
          </>

        </StylesProvider>
      </ThemeProvider>
    </Fragment>
  )
}

export default AppWrapper;