
//next
import Head from 'next/head'
import { GetServerSideProps, NextPage } from 'next'
//Redux
import { wrapper } from '@/redux/store'

import { AppState } from '@/redux/store'
import { connect } from 'react-redux';
import BreadCrumb from '@/components/shared/BreadCrumb';

import BlogStickySide from '@/components/BlogSections/BlogStickySide';
import Footer from '@/components/sections/Footer';
import BlogDetails from '@/components/BlogSections/BlogDetails';
import CookieConsentComponent from '@/components/shared/CookieConsentComponent';
import useScssVar from '@/hooks/useScssVar';
import { getAndDispatchUserData, setAuthCookiesNoRedirect, setThemeCookiesNoRedirect } from '@/helpers/getServerSidePropsHelpers';



const BlogDetailsPage: NextPage = () => {
  const { muiVar } = useScssVar();

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
      <BreadCrumb title='Blog Details' subtitle='Blog Details' />
      <div className="content" style={muiVar}>
        <div className="container">
          <div className="row">
            <BlogDetails />
            <BlogStickySide />
            <CookieConsentComponent />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    let props = {}
    await getAndDispatchUserData(ctx, store)

    await setThemeCookiesNoRedirect(ctx, store)

    await setAuthCookiesNoRedirect(ctx, store);

    return {
      props
    }
  })

export default connect((state: AppState) => state)(BlogDetailsPage);