//Rect
import { Fragment, useState } from 'react'
//Theme
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';


//Redux
import { AppState } from '../redux/store'
import { useDispatch, useSelector } from 'react-redux';


//Utill
import LoadingBar from 'react-top-loading-bar';
import { ToastContainer, toast } from 'react-toastify';

//Mui
import Backdrop from '@mui/material/Backdrop';
import appTheme from './appTheme';
import { PaletteMode } from '@mui/material';
import { StylesProvider } from '@mui/styles';
import { create } from 'jss';
import { jssPreset } from '@mui/styles'
import rtl from 'jss-rtl';

import Header from '@/components/shared/Header';
import { useRouter } from 'next/router';
import useScssVar from '@/hooks/useScssVar';
import _ from 'lodash'
import { useChat } from '@/hooks/useChat';
import { CallDialog } from '@/components/shared/chatComponents/CallDialog';
import BeatLoader from 'react-spinners/BeatLoader';
import { useHomeSocket } from '@/hooks/useHomeSocket';

export type ChildrenProps = {
  children: JSX.Element;
};

const AppWrapper = ({ children }: ChildrenProps) => {
  const dispatch = useDispatch()
  const router = useRouter();
  const { bounce } = useScssVar();
  const {
    voiceCallActive,
    voiceCallToggleFunction,
    videoCallActive,
    videoCallToggleFunction,
  } = useChat()

  const homeThemeName = useSelector((state: AppState) => state.homeThemeName.value)
  const homeThemeType = useSelector((state: AppState) => state.homeThemeType.value)
  const homeLoadingBar = useSelector((state: AppState) => state.homeLoadingBar.value)
  const homeFormSubmit = useSelector((state: AppState) => state.homeFormSubmit.value)
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userData = useSelector((state: AppState) => state.userData.value)
  const homeAccessToken = useSelector((state: AppState) => state.homeAccessToken.value)
  const homeUserId = useSelector((state: AppState) => state.homeUserId.value)
  const clinicStatus = useSelector((state: AppState) => state.clinicStatus.value);
  const specialities = useSelector((state: AppState) => state.specialities.value)


  const [homeTheme, setHomeTheme] = useState({
    ...appTheme(homeThemeName as string,
      homeThemeType as PaletteMode,
      'ltr'
    ),
  });

  useHomeSocket({
    dispatch,
    homeAccessToken,
    homeUserId,
    homeRoleName,
    userDoctorProfile,
    userPatientProfile,
    userData,
    homeLoadingBar,
    setHomeTheme,
    clinicStatus,
    router,
    specialities,
  });

  const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
  return (
    <Fragment >
      <ThemeProvider theme={homeTheme}>

        <StylesProvider jss={jss}>
          <CssBaseline />
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => 4205 }}
            open={homeFormSubmit}
          >
            <BeatLoader color={homeTheme.palette.primary.main} />
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
                {voiceCallActive &&
                  <CallDialog callType='Voice' open={voiceCallActive} toggleFunction={() => {
                    const roomId = router.query.roomId;
                    voiceCallToggleFunction()
                  }} />
                }
                {videoCallActive &&
                  <CallDialog callType='Video' open={videoCallActive} toggleFunction={videoCallToggleFunction} />
                }
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