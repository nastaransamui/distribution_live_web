
//next
import Head from 'next/head'
import { GetServerSideProps, NextPage } from 'next'
//Redux
import { wrapper } from '@/redux/store'
import { AppState } from '@/redux/store'
import { connect } from 'react-redux';
import BreadCrumb from '@/components/shared/BreadCrumb';
import DashboardFooter from '@/components/sections/DashboardFooter';
import Invoice from '@/components/DoctorsSections/CheckOut/Invoice';
import CookieConsentComponent from '@/components/shared/CookieConsentComponent';
import DoctorDashboardSidebar from '@/components/shared/DoctorDashboardSidebar';
import useScssVar from '@/hooks/useScssVar';
import { getAndDispatchUserData, handleProtectedAuth, setThemeCookiesNoRedirect } from '@/helpers/getServerSidePropsHelpers';



const InvoiceViewPage: NextPage = (props: any) => {
  const { homeRoleName } = props;
  const { value: roleName } = homeRoleName
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
      <BreadCrumb
        title={`${roleName.charAt(0).toLocaleUpperCase()}${roleName.slice(1)} Invoice`}
        currentPath={props.currentPath}
        subtitle={`${roleName.charAt(0).toLocaleUpperCase()}${roleName.slice(1)} Invoice`} />
      <span style={muiVar}>
        <DoctorDashboardSidebar />
      </span>
      <Invoice />
      <DashboardFooter />
      <CookieConsentComponent />
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


export default connect((state: AppState) => state)(InvoiceViewPage);