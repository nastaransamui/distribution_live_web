
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
import HomeSearch from '@/components/cosmeticSections/HomeSearch';
import ServicesSection from '@/components/cosmeticSections/ServicesSection';
import TreatmentSection from '@/components/cosmeticSections/TreatmentSection';
import FeaturesSection from '@/components/cosmeticSections/FeaturesSection';
import FactSection from '@/components/cosmeticSections/FactSection';
import ExpertTeam from '@/components/cosmeticSections/ExpertTeam';
import Pricing from '@/components/sections/Pricing';
import TestimonialSection from '@/components/cosmeticSections/TestimonialSection';
import FeedbackSection from '@/components/cosmeticSections/FeedbackSection';
import Footer from '@/components/eyeCareSections/Footer';
import verifyHomeAccessToken from '@/helpers/verifyHomeAccessToken';
import { updateUserProfile } from '@/redux/userProfile';
import { updateHomeAccessToken } from '@/redux/homeAccessToken';
import isJsonString from '@/helpers/isJson';
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
      <div className="main-wrapper">
        <HomeSearch />
        <ServicesSection />
        <LazyLoadWrapper>
          <TreatmentSection />
          <FeaturesSection />
        </LazyLoadWrapper>
        <FactSection />
        <LazyLoadWrapper>
          <ExpertTeam />
          <Pricing />
          <TestimonialSection />
          <FeedbackSection />
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

export default connect((state: AppState) => state)(Home);