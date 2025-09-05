
//next
import Head from 'next/head'
import { GetServerSideProps, NextPage } from 'next'
//Redux
import { wrapper } from '@/redux/store'
import { AppState } from '@/redux/store'
import { connect } from 'react-redux';
import BreadCrumb from '@/components/shared/BreadCrumb';
import Footer from '@/components/sections/Footer';
import ContactSection from '@/components/ContactSections/ContactSection';
import CookieConsentComponent from '@/components/shared/CookieConsentComponent';
import { getAndDispatchUserData, setAuthCookiesNoRedirect, setThemeCookiesNoRedirect } from '@/helpers/getServerSidePropsHelpers';

const ContactPage: NextPage = (props: any) => {


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
      <BreadCrumb title='Contact Us' subtitle='Contact Us' currentPath={props.currentPath} />
      <ContactSection />
      <Footer />
      <CookieConsentComponent />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    let props: any = {}
    await getAndDispatchUserData(ctx, store)

    await setThemeCookiesNoRedirect(ctx, store)

    await setAuthCookiesNoRedirect(ctx, store);

    props.currentPath = ctx.resolvedUrl ?? ctx.req?.url ?? '';
    return {
      props
    }
  })
export default connect((state: AppState) => state)(ContactPage);