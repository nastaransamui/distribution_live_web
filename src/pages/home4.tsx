
//next
import Head from 'next/head'
import { GetServerSideProps, NextPage } from 'next'

//Redux
import { wrapper } from '@/redux/store'
import { AppState } from '@/redux/store'
import { connect } from 'react-redux';
import ScrollToTop from '@/components/sections/ScrollToTop';
import Footer from '@/components/sections/Footer';
import HomeSearch from '@/components/home4Sections/HomeSearch';
import CategorySelect from '@/components/home4Sections/CategorySelect';
import ClinicSection from '@/components/home4Sections/ClinicSection';
import Browser from '@/components/home4Sections/Browser';
import DoctorSection from '@/components/home4Sections/DoctorSection';
import BookDoctor from '@/components/home4Sections/BookDoctor';
import Blog from '@/components/home4Sections/Blog';
import CookieConsentComponent from '@/components/shared/CookieConsentComponent';
import { LazyLoadWrapper } from '.';
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
      <CategorySelect />
      <LazyLoadWrapper>
        <ClinicSection />
        <Browser />
        <DoctorSection />
        <BookDoctor />
        <Blog />
        <Footer />
      </LazyLoadWrapper>
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