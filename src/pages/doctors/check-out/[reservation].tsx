
//next
import Head from 'next/head'
import { GetServerSideProps, NextPage } from 'next'
//Redux
import { wrapper } from '@/redux/store'
import { AppState } from '@/redux/store'
import { connect } from 'react-redux';
import BreadCrumb from '@/components/shared/BreadCrumb';
import Footer from '@/components/sections/Footer';
import Checkout from '@/components/DoctorsSections/CheckOut/CheckOut';
import useScssVar from '@/hooks/useScssVar';
import CookieConsentComponent from '@/components/shared/CookieConsentComponent';
import { fetchJSON, getAndDispatchUserData, setAuthCookiesNoRedirect, setThemeCookiesNoRedirect } from '@/helpers/getServerSidePropsHelpers';
import { getCookie } from 'cookies-next';




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
                  <Checkout checkoutDataServer={props.checkoutData} />
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
    await getAndDispatchUserData(ctx, store)

    await setThemeCookiesNoRedirect(ctx, store)

    await setAuthCookiesNoRedirect(ctx, store);

    props.currentPath = ctx.resolvedUrl ?? ctx.req?.url ?? '';
    const { query } = ctx;
    const { reservation: encryptID } = query;
    const occupyId = atob(encryptID as string)
    const patientId = getCookie('user_id', ctx);
    const accessTokenCookies = getCookie("homeAccessToken", ctx);

    if (!encryptID || !occupyId || !patientId || !accessTokenCookies) {
      return {
        redirect: {
          destination: `/doctors/search`,
          permanent: false,
        },
      };
    }
    const resBody = await fetchJSON(
      `${process.env.NEXT_PUBLIC_adminUrl}/api/findOccupyTimeForCheckout?occupyId=${occupyId}&patientId=${patientId}`,
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
          destination: `/doctors/search`,
          permanent: false,
        },
      };
    } else {
      console.log(resBody.checkoutData)
      props.checkoutData = resBody.checkoutData[0]
    }

    return {
      props
    }
  })


export default connect((state: AppState) => state)(CheckoutPage);