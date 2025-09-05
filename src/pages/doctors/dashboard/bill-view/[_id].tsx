
//next
import Head from 'next/head'
import { GetServerSideProps, NextPage } from 'next'
//Redux
import { wrapper } from '@/redux/store'
import { AppState } from '@/redux/store'
import { connect } from 'react-redux';
import BreadCrumb from '@/components/shared/BreadCrumb';
import DashboardFooter from '@/components/sections/DashboardFooter';
import CookieConsentComponent from '@/components/shared/CookieConsentComponent';
import BillInvoice from '@/components/PatientSection/BillPayment/BillInvoice';
import useScssVar from '@/hooks/useScssVar';
import DoctorDashboardSidebar from '@/components/shared/DoctorDashboardSidebar';

import { getAndDispatchUserData, handleProtectedAuth, setThemeCookiesNoRedirect } from '@/helpers/getServerSidePropsHelpers';
import { base64regex } from '@/components/DoctorsSections/Profile/PublicProfilePage';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';



const InvoiceViewPage: NextPage = (props: any) => {
  const { doctorPatientProfile } = props;
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
      <BreadCrumb title='Doctor Profile' subtitle='Doctor Profile' currentPath={props.currentPath} />
      <span style={muiVar}>
        <DoctorDashboardSidebar />
      </span>
      <BillInvoice doctorPatientProfile={doctorPatientProfile} />
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
    try {
      const { params } = ctx
      const { _id: encryptID } = params as Params
      if (!base64regex.test(encryptID)) return { props }
      let prescription_id = atob(encryptID as string)
      const res = await fetch(`${process.env.NEXT_PUBLIC_adminUrl}/methods/findBillingForDoctorProfileById`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: prescription_id }),
      })
      const data = await res.json();
      const { status, user: doctorPatientProfile } = data
      if (status == 200) {
        props = {
          ...props,
          doctorPatientProfile
        }
      }
    } catch (error) {
      return { props }
    }
    return { props }
  }
)

export default connect((state: AppState) => state)(InvoiceViewPage);