
//next
import Head from 'next/head'
import { GetServerSideProps, NextPage } from 'next'

//Redux
import { wrapper } from '@/redux/store'
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
import getClinicsStatus from '@/helpers/getClinicsStatus';
import CookieConsentComponent from '@/components/shared/CookieConsentComponent';
import { LazyLoadWrapper } from '.';
import { getAndDispatchUserData, setAuthCookiesNoRedirect, setThemeCookiesNoRedirect } from '@/helpers/getServerSidePropsHelpers';


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

export default connect((state: AppState) => state)(EntHome);