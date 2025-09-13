
//next
import Head from 'next/head'
import { GetServerSideProps, NextPage } from 'next'
import { getCookie } from 'cookies-next';
//Redux
import { wrapper } from '@/redux/store'
import { AppState } from '@/redux/store'
import { connect } from 'react-redux';
import BreadCrumb from '@/components/shared/BreadCrumb';
import Footer from '@/components/sections/Footer';
import useScssVar from '@/hooks/useScssVar';
import CookieConsentComponent from '@/components/shared/CookieConsentComponent';
import BillCheckOut from '@/components/PatientSection/BillPayment/BillCheckOut';

import { fetchJSON, getAndDispatchUserData, handleProtectedAuth, setThemeCookiesNoRedirect } from '@/helpers/getServerSidePropsHelpers';


const CheckoutPage: NextPage = (props: any) => {

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
      <BreadCrumb title='Checkout' subtitle='Checkout' currentPath={props.currentPath} />
      <div className="content content-space" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="content">
              <div className="container">
                <div className="row">
                  <BillCheckOut serverSingleBill={props.serverSingleBill} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
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
      const { query } = ctx;
      const { _id: encryptID } = query;
      const billing_id = atob(encryptID as string)
      const patientId = getCookie('user_id', ctx);
      const accessTokenCookies = getCookie("homeAccessToken", ctx);
      if (!patientId || !accessTokenCookies) {
        return {
          redirect: {
            destination: `/login`,
            permanent: false,
          },
        };
      }
      if (!encryptID || !billing_id) {
        return {
          redirect: {
            destination: `/patient/dashboard/billings`,
            permanent: false,
          },
        };
      }
      const resBody = await fetchJSON(
        `${process.env.NEXT_PUBLIC_adminUrl}/api/getSingleBillingForPatient?billing_id=${billing_id}&patientId=${patientId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessTokenCookies}`,
          },
        }
      );

      if (resBody.status !== 200) {
        return {
          redirect: {
            destination: `/patient/dashboard/billings`,
            permanent: false,
          },
        };
      } else if (
        resBody.singleBill[0].status == 'Paid'
      ) {
        return {
          redirect: {
            destination: `/patient/payment-success/${btoa(resBody.singleBill[0]?._id!)}`,
            permanent: false,
          },
        };
      } else {
        props.serverSingleBill = resBody.singleBill[0]
      }

    } catch (error) {
      return {
        redirect: {
          destination: `/patient/dashboard/billings`,
          permanent: false,
        },
      };
    }
    return { props }
  }
)

export default connect((state: AppState) => state)(CheckoutPage);