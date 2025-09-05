
//next
import Head from 'next/head'
import { GetServerSideProps, NextPage } from 'next'
//Redux
import { wrapper } from '@/redux/store'
import { AppState } from '@/redux/store'
import { connect } from 'react-redux';
import ScrollToTop from '@/components/sections/ScrollToTop';
import HomeBanner from '@/components/cardioSections/HomeBanner';
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
import getClinicsStatus from '@/helpers/getClinicsStatus';
import CookieConsentComponent from '@/components/shared/CookieConsentComponent';
import { LazyLoadWrapper } from './index';
import { getAndDispatchUserData, setAuthCookiesNoRedirect, setThemeCookiesNoRedirect } from '@/helpers/getServerSidePropsHelpers';


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
        <title>Welcome to Health Care page</title>
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
    let props = {}
    await getAndDispatchUserData(ctx, store)

    await setThemeCookiesNoRedirect(ctx, store)

    await setAuthCookiesNoRedirect(ctx, store);

    return {
      props
    }
  })


export default connect((state: AppState) => state)(CardioHome);