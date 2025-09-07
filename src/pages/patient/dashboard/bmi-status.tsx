
//next
import Head from 'next/head'
import { GetServerSideProps, NextPage } from 'next'
import { hasCookie, getCookie, deleteCookie } from 'cookies-next';
//Redux
import { wrapper } from '@/redux/store'
import { AppState } from '@/redux/store'
import { connect, useSelector } from 'react-redux';
import { updateHomeThemeName } from '@/redux/homeThemeName';
import { updateHomeThemeType } from '@/redux/homeThemeType';
import { updateUserData } from '@/redux/userData';
import BreadCrumb from '@/components/shared/BreadCrumb';
import PatientDashboardSidebar from '@/components/shared/PatientDashboardSidebar';
import DashboardFooter from '@/components/sections/DashboardFooter';
import { updateHomeAccessToken } from '@/redux/homeAccessToken';
import BmiStatus from '@/components/PatientDashboardSections/BmiStatus';
import useScssVar from '@/hooks/useScssVar';
import { updateHomeExp } from '@/redux/homeExp';
import { updateHomeIAT } from '@/redux/homeIAT';
import { updateHomeRoleName } from '@/redux/homeRoleName';
import { updateHomeServices } from '@/redux/homeServices';
import { updateHomeUserId } from '@/redux/homeUserId';
import { updateUserPatientProfile } from '@/redux/userPatientProfile';
import { ErrorComponent } from '@/pages/404';
import { updateHomeSideBarOpen } from '@/redux/homeSideBarOpen';

import { getAndDispatchUserData, handleProtectedAuth, setThemeCookiesNoRedirect } from '@/helpers/getServerSidePropsHelpers';

const BmiStatusPage: NextPage = (props: any) => {
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
      <BreadCrumb subtitle='BMI Status' title='BMI Status' currentPath={props.currentPath} />
      <div className={`content ${homeSideBarOpen ? 'content-padding-open' : 'content-padding-close'}`} style={muiVar}>
        <div className="container-fluid">
          <div className="row">
            <PatientDashboardSidebar />
            <BmiStatus />
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
    props.currentPath = ctx.resolvedUrl ?? ctx.req?.url ?? '';
    return { props }
  }
)

export default connect((state: AppState) => state)(BmiStatusPage);