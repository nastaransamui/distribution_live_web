//next
import Head from 'next/head'
import { GetServerSideProps, NextPage } from 'next'
import { AppState, wrapper } from '@/redux/store'
import { connect } from 'react-redux';
import VerifyEmail from '@/components/VerifyEmail/VerifyEmail';
import { getAndDispatchUserData, handleLoginAuth, setThemeCookiesNoRedirect } from '@/helpers/getServerSidePropsHelpers';


const VerificationPage: NextPage = (props) => {

  return (
    <>
      <Head>
        <meta charSet='UTF-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1" />
        <meta charSet='utf-8' />
        <meta name='description' />
        <meta name="theme-color" />
        <meta name="emotion-insertion-point" content="" />
        <title>Welcome to Health Care page</title>
      </Head>
      <VerifyEmail {...props} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    let props = {}
    // 1) quick geo-ip fetch (best-effort)
    await getAndDispatchUserData(ctx, store)

    // 2) ensure theme cookies exist (fetch if any missing). Might return homeRedirect.
    await setThemeCookiesNoRedirect(ctx, store)

    // ensure redirect to to correct role/dashboard
    const r = await handleLoginAuth(ctx, store);
    if (r) return r;
    const res = await fetch(`${process.env.NEXT_PUBLIC_adminUrl}/methods/findUserByToken`, {
      method: 'POST',
      body: JSON.stringify({ token: ctx?.query?.token }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    const user = await res.json();
    return {
      props: {
        user: user
      }
    }
  })

export default connect((state: AppState) => state)(VerificationPage);