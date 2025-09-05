
//next
import Head from 'next/head'
import { GetServerSideProps, NextPage } from 'next'


//Redux
import { wrapper } from '@/redux/store'
import { AppState } from '@/redux/store'
import { connect } from 'react-redux';
import ScrollToTop from '@/components/sections/ScrollToTop';
import getClinicsStatus from '@/helpers/getClinicsStatus';
import CookieConsentComponent from '@/components/shared/CookieConsentComponent';
import HomeCareBanner from '@/components/HomeCareSections/HomeCareBanner';
import HowItWork from '@/components/HomeCareSections/HowItWork';
import OurServices from '@/components/HomeCareSections/OurServices';
import Nearbynurses from '@/components/HomeCareSections/Nearbynurses';
import Topnurse from '@/components/HomeCareSections/Topnurse';
import OurBest from '@/components/HomeCareSections/OurBest';
import OurBlog from '@/components/HomeCareSections/OurBlog';
import Questions from '@/components/HomeCareSections/Questions';
import FooterHomeCare from '@/components/HomeCareSections/FooterHomeCare';
import { LazyLoadWrapper } from '.';
import { getAndDispatchUserData, setAuthCookiesNoRedirect, setThemeCookiesNoRedirect } from '@/helpers/getServerSidePropsHelpers';



const HomeCare: NextPage = () => {

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
      <div className='main-wrapper home-twelve home-thirteen '>
        <HomeCareBanner />
        <LazyLoadWrapper>
          <HowItWork />
          <OurServices />
          <Nearbynurses />
          <Topnurse />
          <OurBest />
          <OurBlog />
          <Questions />
          <FooterHomeCare />
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

export default connect((state: AppState) => state)(HomeCare);