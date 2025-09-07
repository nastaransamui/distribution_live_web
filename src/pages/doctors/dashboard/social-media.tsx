
//next
import Head from 'next/head'
import { GetServerSideProps, NextPage } from 'next'
//Redux
import { wrapper } from '@/redux/store'
import { AppState } from '@/redux/store'
import { connect, useSelector } from 'react-redux';
import BreadCrumb from '@/components/shared/BreadCrumb';
import DoctorDashboardSidebar from '@/components/shared/DoctorDashboardSidebar';
import SocialMedia from '@/components/DoctorDashboardSections/SocialMedia';
import useScssVar from '@/hooks/useScssVar';
import DashboardFooter from '@/components/sections/DashboardFooter';
import { getAndDispatchUserData, handleProtectedAuth, setThemeCookiesNoRedirect } from '@/helpers/getServerSidePropsHelpers';


const SocialMediaPage: NextPage = (props: any) => {
  const homeSideBarOpen = useSelector((state: AppState) => state.homeSideBarOpen.value)
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
      <BreadCrumb subtitle='Social Media' title='Social Media' currentPath={props.currentPath} />
      <div className={`content ${homeSideBarOpen ? 'content-padding-open' : 'content-padding-close'}`} style={muiVar}>
        <div className="container-fluid">
          <div className="row">
            <DoctorDashboardSidebar />
            <SocialMedia />
          </div>
        </div>
      </div>
      <DashboardFooter />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    let props: any = {}
    // 1) quick geo-ip fetch (best-effort)
    await getAndDispatchUserData(ctx, store)

    // 2) ensure theme cookies exist (fetch if any missing). Might return homeRedirect.
    await setThemeCookiesNoRedirect(ctx, store)

    const r = await handleProtectedAuth(ctx, store);
    if (r?.redirectToLogin) {
      return {
        redirect: {
          destination: '/login',
          permanent: false
        }
      }
    }
    // Add currentPath to props so child components render identically server & client
    props.currentPath = ctx.resolvedUrl ?? ctx.req?.url ?? '';
    return { props }
  }
)

export default connect((state: AppState) => state)(SocialMediaPage);