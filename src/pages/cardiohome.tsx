
//Mui
import Button from '@mui/material/Button'

//next
import Head from 'next/head'
import { GetServerSideProps, NextPage } from 'next'
import { hasCookie, getCookie } from 'cookies-next';
import dynamic from 'next/dynamic';
//Redux
import { wrapper } from '@/redux/store'
import { updateHomeThemeName } from '@/redux/homeThemeName';
import { updateHomeThemeType } from '@/redux/homeThemeType';
import { updateUserData } from '@/redux/userData';
import { AppState } from '@/redux/store'
import { connect } from 'react-redux';
import ScrollToTop from '@/components/sections/ScrollToTop';
import HomeBanner from '@/components/cardioSections/HomeBanner';
// const Specialities = dynamic(() => import('@/components/cardioSections/Specialities'), { ssr: true });
// const OurServices = dynamic(() => import('@/components/cardioSections/OurServices'), { ssr: true });
// const NeedToKnow = dynamic(() => import('@/components/cardioSections/NeedToKnow'), { ssr: true });
// const OurDoctors = dynamic(() => import('@/components/cardioSections/OurDoctors'), { ssr: true });
// const StepToFollow = dynamic(() => import('@/components/cardioSections/StepToFollow'), { ssr: true });
// const Testimonals = dynamic(() => import('@/components/cardioSections/Testimonals'), { ssr: true });
// const Bookappointment = dynamic(() => import('@/components/cardioSections/Bookappointment'), { ssr: true });
// const Pricing = dynamic(() => import('@/components/cardioSections/Pricing'), { ssr: true });
// const Faq = dynamic(() => import('@/components/cardioSections/Faq'), { ssr: true });
// const Footer = dynamic(() => import('@/components/cardioSections/Footer'), { ssr: true });
import Specialities from '@/components/cardioSections/Specialities';
import OurServices from '@/components/cardioSections/OurServices';
import NeedToKnow from '@/components/cardioSections/NeedToKnow';
import OurDoctors from '@/components/cardioSections/OurDoctors';
import StepToFollow from '@/components/cardioSections/StepToFollow';
import Testimonals from '@/components/cardioSections/Testimonals';
import Bookappointment from '@/components/cardioSections/Bookappointment';
import Pricing from '@/components/cardioSections/Pricing';
import Faq from '@/components/cardioSections/Faq';
import Footer from '@/components/cardioSections/Footer';
import verifyHomeAccessToken from '@/helpers/verifyHomeAccessToken';
import { updateUserProfile } from '@/redux/userProfile';
import { updateHomeAccessToken } from '@/redux/homeAccessToken';
import isJsonString from '@/helpers/isJson';
import getClinicsStatus from '@/helpers/getClinicsStatus';
import CookieConsentComponent from '@/components/shared/CookieConsentComponent';
import { LazyLoadWrapper } from './index';


const CardioHome: NextPage = () => {

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
        <title>Welcome to Distribution Live data</title>
      </Head>
      <div className='main-wrapper home-ten'>
        <HomeBanner />
        <Specialities />
        <OurServices />
        <NeedToKnow />
        <LazyLoadWrapper>
          <OurDoctors />
          <StepToFollow />
          <Testimonals />
          <Bookappointment />
          <Pricing />
          <Faq />
          <Footer />
        </LazyLoadWrapper>
        <ScrollToTop />
        <CookieConsentComponent />
      </div >
    </>
  )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {

    let props = {}
    try {
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
          cache: 'force-cache',
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
      return {
        props
      }
    }
  })


export default connect((state: AppState) => state)(CardioHome);