
//next
import Head from 'next/head'
import { GetServerSideProps, NextPage } from 'next'
//Redux
import { wrapper } from '@/redux/store'
import { AppState } from '@/redux/store'
import { connect } from 'react-redux';
import Footer from '@/components/sections/Footer';
import LoginSection from '@/components/AuthSections/LoginSection';
import CookieConsentComponent from '@/components/shared/CookieConsentComponent';
import { getAndDispatchUserData, handleLoginAuth, setThemeCookiesNoRedirect } from '@/helpers/getServerSidePropsHelpers';

const LoginPage: NextPage = () => {

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
      <LoginSection />
      <CookieConsentComponent />
      <Footer />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    // 1) quick geo-ip fetch (best-effort)
    await getAndDispatchUserData(ctx, store)

    // 2) ensure theme cookies exist (fetch if any missing). Might return homeRedirect.
    await setThemeCookiesNoRedirect(ctx, store)

    // ensure redirect to to correct role/dashboard
    const r = await handleLoginAuth(ctx, store);
    if (r) return r;
    return { props: {} }
  })

export default connect((state: AppState) => state)(LoginPage);