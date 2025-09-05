
//next
import Head from 'next/head'
import { GetServerSideProps, NextPage } from 'next'

//Redux
import { wrapper } from '@/redux/store'
import { AppState } from '@/redux/store'
import { connect } from 'react-redux';
import ScrollToTop from '@/components/sections/ScrollToTop';
import HomeSearch from '@/components/fertilitySections/HomeSearch';
import OurServices from '@/components/fertilitySections/OurServices';
import TeamSection from '@/components/fertilitySections/TeamSection';
import BlogSection from '@/components/fertilitySections/BlogSection';
import WhyChooseUs from '@/components/fertilitySections/WhyChooseUs';
import TestimonialsSection from '@/components/fertilitySections/TestimonialsSection';
import ContactSection from '@/components/fertilitySections/ContactSection';
import Footer from '@/components/fertilitySections/Footer';
import getClinicsStatus from '@/helpers/getClinicsStatus';
import CookieConsentComponent from '@/components/shared/CookieConsentComponent';
import { LazyLoadWrapper } from '.';
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
      <HomeSearch />
      <OurServices />
      <LazyLoadWrapper>
        <TeamSection />
        <BlogSection />
        <WhyChooseUs />
        <TestimonialsSection />
        <ContactSection />
        <Footer />
      </LazyLoadWrapper>
      <CookieConsentComponent />
      <ScrollToTop />
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