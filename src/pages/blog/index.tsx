
//next
import Head from 'next/head'
import { GetServerSideProps, NextPage } from 'next'
//Redux
import { wrapper } from '@/redux/store'
import { AppState } from '@/redux/store'
import { connect } from 'react-redux';
import useMediaQuery from '@mui/material/useMediaQuery';

import BreadCrumb from '@/components/shared/BreadCrumb';
import BlogsList from '@/components/BlogSections/BlogsList';
import BlogStickySide from '@/components/BlogSections/BlogStickySide';
import { useState } from 'react';
import Footer from '@/components/sections/Footer';
import CookieConsentComponent from '@/components/shared/CookieConsentComponent';
import useScssVar from '@/hooks/useScssVar';
import { getAndDispatchUserData, setAuthCookiesNoRedirect, setThemeCookiesNoRedirect } from '@/helpers/getServerSidePropsHelpers';

const Blog: NextPage = () => {

  const [blogView, setBlogView] = useState('listView')

  const matches = useMediaQuery('(max-width:991px)');
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
      <BreadCrumb title='Blog List' subtitle='Blog' />
      <div className="content" style={muiVar}>
        <div className="container">
          <div className="row">
            {
              matches ?
                <>
                  <BlogStickySide blogView={blogView} setBlogView={setBlogView} />
                  <BlogsList blogView={blogView} />
                </> :
                <>
                  <BlogsList blogView={blogView} />
                  <BlogStickySide blogView={blogView} setBlogView={setBlogView} />
                </>
            }
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

export default connect((state: AppState) => state)(Blog);