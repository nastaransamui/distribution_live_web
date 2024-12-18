
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
import Footer from '@/components/sections/Footer';
import RegisterSection from '@/components/AuthSections/RegisterSection';
import verifyHomeAccessToken from '@/helpers/verifyHomeAccessToken';
import { updateUserProfile } from '@/redux/userProfile';
import { updateHomeAccessToken } from '@/redux/homeAccessToken';
import isJsonString from '@/helpers/isJson';
import CookieConsentComponent from '@/components/shared/CookieConsentComponent';

const RegisterPage: NextPage = () => {

  return (
    <>
      <Head>
        <meta charSet='UTF-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1" />
        <meta charSet='utf-8' />
        <meta name='description' />
        <meta name="theme-color" />
        <meta name="emotion-insertion-point" content="" />
        <title>Welcome to Health Care page</title>
      </Head>
      <RegisterSection />
      <CookieConsentComponent />
      <Footer />
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
      if (hasCookie('homeAccessToken', ctx)) {
        let destination;
        //Cookies was so big and had to spit it
        if (isJsonString(getCookie('homeAccessToken', ctx) as string)) {
          const { length } = JSON.parse(getCookie('homeAccessToken', ctx) as string)
          var fullToken: string = '';
          for (var i = 0; i < parseInt(length); i++) {
            fullToken += getCookie(`${i}`, ctx);
          }
          if (fullToken !== '') {
            var { accessToken, user_id, services, roleName, iat, exp, userProfile } = verifyHomeAccessToken(fullToken)
            if (roleName !== undefined) {
              store.dispatch(updateHomeAccessToken(fullToken))
              store.dispatch(updateUserProfile(userProfile))
              destination = `/${roleName}/dashboard`
              return {
                redirect: {
                  destination: destination,
                  permanent: false,
                },
              }
            }
          }
        } else {
          var { accessToken, user_id, services, roleName, iat, exp, userProfile } = verifyHomeAccessToken(getCookie('homeAccessToken', ctx))
          store.dispatch(updateUserProfile(userProfile))
          store.dispatch(updateHomeAccessToken(getCookie('homeAccessToken', ctx)))
          destination = `/${roleName}/dashboard`
          return {
            redirect: {
              destination: destination,
              permanent: false,
            },
          }
        }
      }

      let props = {}
      return {
        props
      }
    } catch (error) {
      console.log(error)
      if (hasCookie('homeThemeType', ctx)) {
        store.dispatch(updateHomeThemeType(getCookie('homeThemeType', ctx)))
      }
      if (hasCookie('homeThemeName', ctx)) {
        store.dispatch(updateHomeThemeName(getCookie('homeThemeName', ctx)))
      }
      if (hasCookie('homeAccessToken', ctx)) {
        let destination;
        //Cookies was so big and had to spit it
        if (isJsonString(getCookie('homeAccessToken', ctx) as string)) {
          const { length } = JSON.parse(getCookie('homeAccessToken', ctx) as string)
          var fullToken: string = '';
          for (var i = 0; i < parseInt(length); i++) {
            fullToken += getCookie(`${i}`, ctx);
          }
          if (fullToken !== '') {
            var { accessToken, user_id, services, roleName, iat, exp, userProfile } = verifyHomeAccessToken(fullToken)
            if (roleName !== undefined) {
              store.dispatch(updateHomeAccessToken(fullToken))
              store.dispatch(updateUserProfile(userProfile))
              destination = `/${roleName}/dashboard`
              return {
                redirect: {
                  destination: destination,
                  permanent: false,
                },
              }
            }
          }
        } else {
          var { accessToken, user_id, services, roleName, iat, exp, userProfile } = verifyHomeAccessToken(getCookie('homeAccessToken', ctx))
          store.dispatch(updateUserProfile(userProfile))
          store.dispatch(updateHomeAccessToken(getCookie('homeAccessToken', ctx)))
          destination = `/${roleName}/dashboard`
          return {
            redirect: {
              destination: destination,
              permanent: false,
            },
          }
        }
      }
      let props = {}
      return {
        props
      }
    }
  })

export default connect((state: AppState) => state)(RegisterPage);