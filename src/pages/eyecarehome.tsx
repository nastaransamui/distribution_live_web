
//next
import Head from 'next/head'
import { GetServerSideProps, NextPage } from 'next'

//Redux
import { wrapper } from '@/redux/store'
import { AppState } from '@/redux/store'
import { connect } from 'react-redux';
import ScrollToTop from '@/components/sections/ScrollToTop';
import HomeSearch from '@/components/eyeCareSections/HomeSearch';
import Specialities from '@/components/eyeCareSections/Specialties';
import WhoWeAre from '@/components/eyeCareSections/WhoWeAre';
import Counter from '@/components/eyeCareSections/Counter';
import ClinicSection from '@/components/eyeCareSections/ClinicSection';
import StoreSection from '@/components/eyeCareSections/StoreSction';
import FacilitiesSection from '@/components/eyeCareSections/FacilitiesSection';
import BlogPost from '@/components/eyeCareSections/BlogPost';
import Testimonials from '@/components/eyeCareSections/Testimonials';
import AppointmentSection from '@/components/eyeCareSections/AppointmentSection';
import Faq from '@/components/eyeCareSections/Faq';
import Footer from '@/components/eyeCareSections/Footer';
import OfferSection from '@/components/eyeCareSections/OfferSection';
import getClinicsStatus from '@/helpers/getClinicsStatus';
import CookieConsentComponent from '@/components/shared/CookieConsentComponent';
import { LazyLoadWrapper } from './index';
import { getAndDispatchUserData, setAuthCookiesNoRedirect, setThemeCookiesNoRedirect } from '@/helpers/getServerSidePropsHelpers';



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
      <div className='main-wrapper home-ten'>
        <HomeSearch />
        <LazyLoadWrapper>
          <Specialities />
          <WhoWeAre />
          <Counter />
          <ClinicSection />
          <StoreSection />
          <OfferSection />
          <FacilitiesSection />
          <BlogPost />
          <Testimonials />
          <AppointmentSection />
          <Faq />
          <Footer />
        </LazyLoadWrapper>
        <CookieConsentComponent />
        <ScrollToTop />
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


export default connect((state: AppState) => state)(Home);