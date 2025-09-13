

//next
import Head from 'next/head'
import { GetServerSideProps, NextPage } from 'next'

//Redux
import { wrapper } from '@/redux/store'
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
import getClinicsStatus from '@/helpers/getClinicsStatus';
import CookieConsentComponent from '@/components/shared/CookieConsentComponent';
import { LazyLoadWrapper } from '.';
import { getAndDispatchUserData, setAuthCookiesNoRedirect, setThemeCookiesNoRedirect } from '@/helpers/getServerSidePropsHelpers';
import { useEffect } from 'react';
import { useTheme } from '@mui/material';

const Home: NextPage = () => {
  const theme = useTheme();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const body = document.getElementById('body')
      if (body) {
        body.style.backgroundColor = theme.palette.background.paper
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme.palette])

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