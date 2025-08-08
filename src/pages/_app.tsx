
//Styles
import '@/styles/globals.css'
// import '@/styles/custom-bars.css';
import '@/styles/component.css'
import '@/styles/404.scss'
import '@/styles/login.scss'
import '@/styles/css/bootstrap.min.css'
import '@/styles/css/all.min.css';
import '@/styles/css/feather.css'
import '@/styles/css/custom.css'
// import '@/styles/css/aos.css'
// import 'read-more-less-react/dist/index.css'
// import 'react-toastify/dist/ReactToastify.css';
// import 'animate.css';
// import 'owl.carousel/dist/assets/owl.carousel.css';
// import 'owl.carousel/dist/assets/owl.theme.default.css';
// import "yet-another-react-lightbox/styles.css";
// import 'react-big-calendar/lib/css/react-big-calendar.css'
// import 'react-virtualized/styles.css';
// import "react-multi-date-picker/styles/backgrounds/bg-dark.css"

// import "vanilla-cookieconsent/dist/cookieconsent.css";
//next
import type { AppProps } from 'next/app'

//react

import { useEffect } from 'react';
import AOS from 'aos'

//redux
import { Provider } from 'react-redux'
import { wrapper } from '@/redux/store'


//theme
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '@/theme/createEmotionCache'
import { EmotionCache } from '@emotion/react';
import AppWrapper from '@/theme/AppWrapper';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { AppCacheProvider } from '@mui/material-nextjs/v13-pagesRouter'
import { StyledEngineProvider } from '@mui/material/styles';
import useFirebaseNotifications from '@/hooks/useFirebaseNotifications'
import { getFcmToken } from '@/helpers/firebase'
export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}


const clientSideEmotionCache = createEmotionCache();

export const loadStylesheet = (href: string) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.media = 'print';
  link.onload = () => (link.media = 'all');
  document.head.appendChild(link);
};

const App = ({ Component, ...rest }: MyAppProps) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { router, emotionCache = clientSideEmotionCache, pageProps } = props;
  useFirebaseNotifications();
  useEffect(() => {
    loadStylesheet('/css/owl.carousel.min.css');
    loadStylesheet('/css/owl.theme.default.min.css');
    loadStylesheet('/css/custom-bars.min.css');
    loadStylesheet('/css/aos.css');
    loadStylesheet('/css/read-more-less-react.min.css');
    loadStylesheet('/css/ReactToastify.min.css')
    loadStylesheet('/css/animate.min.css');
    loadStylesheet('/css/cookieconsent.min.css')
    AOS.init({
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
    });
    getFcmToken().then((token) => {
      // console.log('FCM Token:', token);
    });
  }, []);

  return (
    <>
      {/* <AppCacheProvider {...props} > */}
      <Provider store={store}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>
          <AppWrapper>
            <Component {...pageProps} key={router.route} router={router} />
          </AppWrapper>
        </GoogleOAuthProvider>
      </Provider>
      {/* </AppCacheProvider> */}
      {/* CacheProvider break in production */}
      {/* {
        process.env.NODE_ENV == 'development' ?
          <CacheProvider value={emotionCache}>
            <Provider store={store}>
              <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>
                <AppWrapper>
                  <Component {...pageProps} key={router.route} router={router} />
                </AppWrapper>
              </GoogleOAuthProvider>
            </Provider>
          </CacheProvider >
          :
          <Provider store={store}>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>
              <AppWrapper>
                <Component {...pageProps} key={router.route} router={router} />
              </AppWrapper>
            </GoogleOAuthProvider>
          </Provider>

      } */}
    </>
  )
}

export default App