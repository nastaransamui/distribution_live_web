
//Mui
import Button from '@mui/material/Button'

//next
import Head from 'next/head'
import { GetServerSideProps, NextPage } from 'next'
import { hasCookie, getCookie, deleteCookie } from 'cookies-next';

//Redux
import { wrapper } from '@/redux/store'
import { updateHomeThemeName } from '@/redux/homeThemeName';
import { updateHomeThemeType } from '@/redux/homeThemeType';
import { updateUserData } from '@/redux/userData';
import { AppState } from '@/redux/store'
import { connect } from 'react-redux';
import HomeSearch from '@/components/home3Sections/HomeSearch';
import ScrollToTop from '@/components/sections/ScrollToTop';
import Footer from '@/components/sections/Footer';
import ClinicSection from '@/components/home3Sections/ClinicSection';
import Specialities from '@/components/home3Sections/Specialities';
import DoctorSection from '@/components/home3Sections/DoctorSection';
import ClinicFeature from '@/components/home3Sections/ClinicFeature';
import BlogNews from '@/components/home3Sections/BlogNews';
import { updateHomeAccessToken } from '@/redux/homeAccessToken';
import CookieConsentComponent from '@/components/shared/CookieConsentComponent';
import { LazyLoadWrapper } from '.';
import { updateHomeExp } from '@/redux/homeExp';
import { updateHomeIAT } from '@/redux/homeIAT';
import { updateHomeRoleName } from '@/redux/homeRoleName';
import { updateHomeServices } from '@/redux/homeServices';
import { updateHomeUserId } from '@/redux/homeUserId';
import { updateUserDoctorProfile } from '@/redux/userDoctorProfile';
import { updateUserPatientProfile } from '@/redux/userPatientProfile';


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
      <ClinicSection />
      <LazyLoadWrapper>
        <Specialities />
        <DoctorSection />
        <ClinicFeature />
        <BlogNews />
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
      let props = {}
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

          case 'general_0':
            destination = "/home"

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
        const accessToken = getCookie('homeAccessToken', ctx);
        const user_id = getCookie('user_id', ctx);
        const services = getCookie('services', ctx);
        const roleName = getCookie('roleName', ctx)
        const iat = getCookie('iat', ctx)
        const exp = getCookie('exp', ctx);
        const res = await fetch(`${process.env.NEXT_PUBLIC_adminUrl}/api/singlePatient?_id=${user_id}`, {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        })
        const data = await res.json();


        if (data.error) {
          deleteCookie('homeAccessToken', ctx);
          deleteCookie('user_id', ctx);
          deleteCookie('services', ctx);
          deleteCookie('roleName', ctx);
          deleteCookie('iat', ctx);
          deleteCookie('exp', ctx);
          return {
            ...props,
            redirect: {
              destination: `/`,
              permanent: false,
            },
          }
        }
        store.dispatch(updateHomeAccessToken(accessToken))
        store.dispatch(updateHomeUserId(user_id))
        store.dispatch(updateHomeServices(services))
        store.dispatch(updateHomeRoleName(roleName))
        store.dispatch(updateHomeIAT(iat))
        store.dispatch(updateHomeExp(exp))
        roleName == 'patient' ?
          store.dispatch(updateUserPatientProfile(data)) :
          store.dispatch(updateUserDoctorProfile(data))
      }
      return {
        props
      }
    } catch (error) {
      let props = {}
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

          case 'general_0':
            destination = "/home"

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
        const accessToken = getCookie('homeAccessToken', ctx);
        const user_id = getCookie('user_id', ctx);
        const services = getCookie('services', ctx);
        const roleName = getCookie('roleName', ctx)
        const iat = getCookie('iat', ctx)
        const exp = getCookie('exp', ctx);
        const res = await fetch(`${process.env.NEXT_PUBLIC_adminUrl}/api/singlePatient?_id=${user_id}`, {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        })
        const data = await res.json();


        if (data.error) {
          deleteCookie('homeAccessToken', ctx);
          deleteCookie('user_id', ctx);
          deleteCookie('services', ctx);
          deleteCookie('roleName', ctx);
          deleteCookie('iat', ctx);
          deleteCookie('exp', ctx);
          return {
            ...props,
            redirect: {
              destination: `/`,
              permanent: false,
            },
          }
        }
        store.dispatch(updateHomeAccessToken(accessToken))
        store.dispatch(updateHomeUserId(user_id))
        store.dispatch(updateHomeServices(services))
        store.dispatch(updateHomeRoleName(roleName))
        store.dispatch(updateHomeIAT(iat))
        store.dispatch(updateHomeExp(exp))
        roleName == 'patient' ?
          store.dispatch(updateUserPatientProfile(data)) :
          store.dispatch(updateUserDoctorProfile(data))
      }
      return {
        props
      }
    }
  })

export default connect((state: AppState) => state)(Home);