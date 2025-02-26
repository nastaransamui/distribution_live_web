
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
import ScrollToTop from '@/components/sections/ScrollToTop';
import HomeSearch from '@/components/entSections/HomeSearch';
import ServicesSection from '@/components/entSections/ServicesSection';
import WhoWeAre from '@/components/entSections/WhoWeAre';
import DoctorSection from '@/components/entSections/DoctorSection';
import PharmacySection from '@/components/entSections/PharmacySection';
import Feedback from '@/components/entSections/Feedback';
import Contact from '@/components/entSections/Contact';
import TestimonialsSection from '@/components/entSections/TestimonialsSection';
import FaqSection from '@/components/entSections/FaqSection';
import Footer from '@/components/entSections/Footer';
import { updateHomeAccessToken } from '@/redux/homeAccessToken';
import getClinicsStatus from '@/helpers/getClinicsStatus';
import CookieConsentComponent from '@/components/shared/CookieConsentComponent';
import { LazyLoadWrapper } from '.';
import { updateHomeExp } from '@/redux/homeExp';
import { updateHomeIAT } from '@/redux/homeIAT';
import { updateHomeRoleName } from '@/redux/homeRoleName';
import { updateHomeServices } from '@/redux/homeServices';
import { updateHomeUserId } from '@/redux/homeUserId';
import { updateUserDoctorProfile } from '@/redux/userDoctorProfile';
import { updateUserPatientProfile } from '@/redux/userPatientProfile';


const EntHome: NextPage = () => {

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
      <div className="main-wrapper home-fifteen">
        <HomeSearch />
        <ServicesSection />
        <LazyLoadWrapper>
          <WhoWeAre />
          <DoctorSection />
          <PharmacySection />
          <Feedback />
          <Contact />
          <TestimonialsSection />
          <FaqSection />
          <Footer />
        </LazyLoadWrapper>
        <ScrollToTop />
        <CookieConsentComponent />
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    try {
      let props = {}
      const { resolvedUrl } = ctx
      const isClinickActive = await getClinicsStatus(resolvedUrl);
      if (!isClinickActive) {
        return {
          redirect: {
            destination: '/',
            permanent: true,
          },
        }
      }
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
      console.log(error)
      let props = {}
      if (hasCookie('homeThemeType', ctx)) {
        store.dispatch(updateHomeThemeType(getCookie('homeThemeType', ctx)))
      }
      if (hasCookie('homeThemeName', ctx)) {
        store.dispatch(updateHomeThemeName(getCookie('homeThemeName', ctx)))
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

export default connect((state: AppState) => state)(EntHome);