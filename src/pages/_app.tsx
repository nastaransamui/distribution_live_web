
//Styles
import '../../node_modules/@mui/x-data-grid/index.css';
import '@/styles/globals.css'
import 'react-circular-progressbar/dist/styles.css';
import 'swiper/css/bundle';
import '@/styles/component.css'
import '@/styles/404.scss'
import '@/styles/login.scss'
import '@/styles/css/bootstrap.min.css'
import '@/styles/css/all.min.css';
import '@/styles/css/feather.css'
import '@/styles/css/custom.css'

//next
import type { AppProps } from 'next/app'

//react

import { useEffect } from 'react';
import AOS from 'aos'

//redux
import { Provider } from 'react-redux'
import { wrapper } from '@/redux/store'


//theme
// import createEmotionCache from '@/theme/createEmotionCache'
import { EmotionCache } from '@emotion/react';
import AppWrapper from '@/theme/AppWrapper';

import { GoogleOAuthProvider } from '@react-oauth/google';
import useFirebaseNotifications from '@/hooks/useFirebaseNotifications'
import { getFcmToken } from '@/helpers/firebase'
import { ChatProvider } from '@/hooks/useChat'
import { NextRouter } from 'next/router'
export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}


// const clientSideEmotionCache = createEmotionCache();

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
  const { router,
    // emotionCache = clientSideEmotionCache, 
    pageProps } = props;

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
    getFcmToken().then((token) => { });
  }, []);
  function InnerApp({ Component, pageProps, router }: InnerAppProps) {
    useFirebaseNotifications(); // safe here, because ChatProvider is already wrapping
    return <Component {...pageProps} key={router.route} router={router} />;
  }
  return (
    <>
      {/* <AppCacheProvider {...props} > */}
      <Provider store={store}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>
          <ChatProvider>
            <AppWrapper>
              <InnerApp Component={Component} pageProps={pageProps} router={router} />
            </AppWrapper>
          </ChatProvider>
        </GoogleOAuthProvider>
      </Provider>
    </>
  )
}

export default App

type InnerAppProps = {
  Component: AppProps["Component"];
  pageProps: AppProps["pageProps"];
  router: NextRouter;
};

function InnerApp({ Component, pageProps, router }: InnerAppProps) {
  useFirebaseNotifications(); // now inside ChatProvider tree
  return <Component {...pageProps} key={router.route} router={router} />;
}