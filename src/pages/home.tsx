
//next
import Head from 'next/head'
import { GetServerSideProps, NextPage } from 'next'

//Redux
import { wrapper } from '@/redux/store'
import { AppState } from '@/redux/store'
import { connect } from 'react-redux';
import HomeSearch from '@/components/homeSections/HomeSearch';
import ScrollToTop from '@/components/sections/ScrollToTop';
import Footer from '@/components/sections/Footer';
import LookingFor from '@/components/homeSections/LookingFor';
import HomeSpecialities from '@/components/homeSections/HomeSpecialities';
import DoctorSection from '@/components/home3Sections/DoctorSection';
import HomeFeatures from '@/components/homeSections/HomeFeatures';
import HomeBlog from '@/components/homeSections/HomeBlog';
import CookieConsentComponent from '@/components/shared/CookieConsentComponent';
import { getAndDispatchUserData, handleHomePageTheme, setAuthCookiesNoRedirect } from '@/helpers/getServerSidePropsHelpers';


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
      <HomeSpecialities />
      <DoctorSection />
      <HomeFeatures />
      <HomeBlog />
      <Footer />
      <CookieConsentComponent />
      <ScrollToTop />
    </>
  )
}


export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    // 1) quick geo-ip fetch (best-effort)
    await getAndDispatchUserData(ctx, store)

    // redirect to correct current home route
    const r = await handleHomePageTheme(ctx, store);
    if (r) return r;


    //set auth coockies
    await setAuthCookiesNoRedirect(ctx, store);

    return { props: {} };

  })


export default connect((state: AppState) => state)(Home);