
//Styles
import '@/styles/globals.css'
import '@/styles/custom-bars.css';
import '@/styles/component.css'
import '@/styles/404.scss'
import '@/styles/login.scss'
// import '@/styles/scss/home-7.scss'
import '@/styles/css/bootstrap.min.css'
// import '@/styles/css/all.css'
import '@/styles/css/all.min.css';
// import '@/styles/css/fontawesome.css';
import '@/styles/css/feather.css'
import '@/styles/css/custom.css'
import '@/styles/css/aos.css'
import 'read-more-less-react/dist/index.css'
import 'react-toastify/dist/ReactToastify.css';
import 'animate.css';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import "yet-another-react-lightbox/styles.css";
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import 'react-virtualized/styles.css';
import "react-multi-date-picker/styles/backgrounds/bg-dark.css"

import "vanilla-cookieconsent/dist/cookieconsent.css";
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

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}


const clientSideEmotionCache = createEmotionCache();

const App = ({ Component, ...rest }: MyAppProps) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { router, emotionCache = clientSideEmotionCache, pageProps } = props;
  useEffect(() => {
    AOS.init({
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
    });
  }, []);

  return (
    // <CacheProvider value={emotionCache}>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>
        <AppWrapper>
          <Component {...pageProps} key={router.route} router={router} />
        </AppWrapper>
      </GoogleOAuthProvider>
    </Provider>
    // </CacheProvider >
  )
}

export default App