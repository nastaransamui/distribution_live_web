
//Mui
import Button from '@mui/material/Button'

//next
import Head from 'next/head'
import { GetServerSideProps, NextPage } from 'next'
import { hasCookie, getCookie } from 'cookies-next';

//Redux
import { wrapper } from '@/redux/store'
import { updateHomeThemeName } from '@/redux/homeThemeName';
import { updateHomeThemeType } from '@/redux/homeThemeType';
import { updateUserData } from '@/redux/userData';
import { AppState } from '@/redux/store'
import { connect } from 'react-redux';
import HomeSearch from '@/components/homeSections/HomeSearch';
import ScrollToTop from '@/components/sections/ScrollToTop';
import Footer from '@/components/sections/Footer';
import LookingFor from '@/components/homeSections/LookingFor';
import HomeSpecialities from '@/components/homeSections/HomeSpecialities';
import HomeBookDoctor from '@/components/homeSections/HomeBookDoctor';
import HomeFeatures from '@/components/homeSections/HomeFeatures';
import HomeBlog from '@/components/homeSections/HomeBlog';
import verifyHomeAccessToken from '@/helpers/verifyHomeAccessToken';
import { updateUserProfile } from '@/redux/userProfile';
import { updateHomeAccessToken } from '@/redux/homeAccessToken';
import isJsonString from '@/helpers/isJson';
import CookieConsentComponent from '@/components/shared/CookieConsentComponent';
import { LazyLoadWrapper } from '.';


const Home: NextPage = () => {

  return (
    <>
      <Head>
        <meta charSet='UTF-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1" />
        <meta charSet='utf-8' />
        <meta name="description" content="We eager to bring health and health care service to you by easiest way that possible." />
        <meta name="theme-color" />
        <meta name="emotion-insertion-point" content="" />
        <title>Welcome to Health Care page</title>
      </Head>
      <HomeSearch />
      <LookingFor />
      <LazyLoadWrapper>
        <HomeSpecialities />
        <HomeBookDoctor />
        <HomeFeatures />
        <HomeBlog />
        <Footer />
      </LazyLoadWrapper>
      <CookieConsentComponent />
      <ScrollToTop />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    try {
      const result = await fetch('http://ip-api.com/json/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      })
      const userData = await result.json();
      if (userData['status'] == 'success') {
        store.dispatch(updateUserData(userData))
      }
      if (hasCookie('homeThemeType', ctx)) {
        store.dispatch(updateHomeThemeType(getCookie('homeThemeType', ctx)))
      }
      if (hasCookie('homeThemeName', ctx)) {
        store.dispatch(updateHomeThemeName(getCookie('homeThemeName', ctx)))
      }

      if (hasCookie('homeActivePage', ctx)) {
        let destination;
        switch (getCookie('homeActivePage', ctx)) {
          case 'default':
            destination = "/"

            return {
              redirect: {
                destination: destination,
                permanent: false,
              },
            }

          case 'general_1':
            destination = "/home3"

            return {
              redirect: {
                destination: destination,
                permanent: false,
              },
            }
          case 'general_2':
            destination = "/home4"

            return {
              redirect: {
                destination: destination,
                permanent: false,
              },
            }
        }
      } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_adminUrl}/publications/homeTheme`, { method: 'GET', })
        const homeObject = await res.json();
        const hometheme = homeObject['hometheme']
        let redirect = hometheme[0]?.['homeRedirect']
        if (redirect !== ctx.resolvedUrl) {
          return {
            redirect: {
              destination: redirect,
              permanent: false,
            },
          }
        }
      }

      if (hasCookie('homeAccessToken', ctx)) {
        switch (true) {
          case isJsonString(getCookie('homeAccessToken', ctx) as string):
            const { length } = JSON.parse(getCookie('homeAccessToken', ctx) as string)
            var fullToken: string = '';
            for (var i = 0; i < parseInt(length); i++) {
              fullToken += getCookie(`${i}`, ctx);
            }
            if (fullToken !== '') {
              var { accessToken, user_id, services, roleName, iat, exp, userProfile } = verifyHomeAccessToken(fullToken)
              store.dispatch(updateUserProfile(userProfile))
              store.dispatch(updateHomeAccessToken(fullToken))
            }
            break;

          default:
            var { accessToken, user_id, services, roleName, iat, exp, userProfile } = verifyHomeAccessToken(getCookie('homeAccessToken', ctx))
            store.dispatch(updateUserProfile(userProfile))
            store.dispatch(updateHomeAccessToken(getCookie('homeAccessToken', ctx)))
            break;
        }
      }
      let props = {}
      return {
        props
      }
    } catch (error) {
      if (hasCookie('homeThemeType', ctx)) {
        store.dispatch(updateHomeThemeType(getCookie('homeThemeType', ctx)))
      }
      if (hasCookie('homeThemeName', ctx)) {
        store.dispatch(updateHomeThemeName(getCookie('homeThemeName', ctx)))
      }

      if (hasCookie('homeActivePage', ctx)) {
        let destination;
        switch (getCookie('homeActivePage', ctx)) {
          case 'default':
            destination = "/"

            return {
              redirect: {
                destination: destination,
                permanent: false,
              },
            }

          case 'general_1':
            destination = "/home3"

            return {
              redirect: {
                destination: destination,
                permanent: false,
              },
            }
          case 'general_2':
            destination = "/home4"

            return {
              redirect: {
                destination: destination,
                permanent: false,
              },
            }
        }
      } else {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_adminUrl}/publications/homeTheme`, { method: 'GET', })
          const homeObject = await res.json();
          const hometheme = homeObject['hometheme']
          let redirect = hometheme[0]?.['homeRedirect']
          if (redirect !== ctx.resolvedUrl) {
            return {
              redirect: {
                destination: redirect,
                permanent: false,
              },
            }
          }
        } catch (e) {
          console.error(e);
        } finally {
          console.log('We do cleanup here');
        }

      }

      if (hasCookie('homeAccessToken', ctx)) {
        switch (true) {
          case isJsonString(getCookie('homeAccessToken', ctx) as string):
            const { length } = JSON.parse(getCookie('homeAccessToken', ctx) as string)
            var fullToken: string = '';
            for (var i = 0; i < parseInt(length); i++) {
              fullToken += getCookie(`${i}`, ctx);
            }
            if (fullToken !== '') {
              var { accessToken, user_id, services, roleName, iat, exp, userProfile } = verifyHomeAccessToken(fullToken)
              store.dispatch(updateUserProfile(userProfile))
              store.dispatch(updateHomeAccessToken(fullToken))
            }
            break;

          default:
            var { accessToken, user_id, services, roleName, iat, exp, userProfile } = verifyHomeAccessToken(getCookie('homeAccessToken', ctx))
            store.dispatch(updateUserProfile(userProfile))
            store.dispatch(updateHomeAccessToken(getCookie('homeAccessToken', ctx)))
            break;
        }
      }
      let props = {}
      return {
        props
      }
    }
  })

export default connect((state: AppState) => state)(Home);