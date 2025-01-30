
//next
import Head from 'next/head'
import { GetServerSideProps, NextPage } from 'next'
import { hasCookie, getCookie, deleteCookie } from 'cookies-next';
//Redux
import { wrapper } from '@/redux/store'
import { AppState } from '@/redux/store'
import { connect } from 'react-redux';
import { updateHomeThemeName } from '@/redux/homeThemeName';
import { updateHomeThemeType } from '@/redux/homeThemeType';
import { updateUserData } from '@/redux/userData';
import Footer from '@/components/sections/Footer';
import { updateHomeAccessToken } from '@/redux/homeAccessToken';
import CookieConsentComponent from '@/components/shared/CookieConsentComponent';
import BillPaymentSuccess from '@/components/PatientSection/BillPayment/BillPaymentSuccess';
import { updateHomeExp } from '@/redux/homeExp';
import { updateHomeIAT } from '@/redux/homeIAT';
import { updateHomeRoleName } from '@/redux/homeRoleName';
import { updateHomeServices } from '@/redux/homeServices';
import { updateHomeUserId } from '@/redux/homeUserId';
import { updateUserPatientProfile } from '@/redux/userPatientProfile';
import { ErrorComponent } from '@/pages/404';


const CheckoutPage: NextPage = (props: any) => {

  if (props.error) {
    return <ErrorComponent errorCode={props.errorCode} errorText={props.error} />;
  }
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
      <div className="main-wrapper">
        <BillPaymentSuccess />
        <Footer />
        <CookieConsentComponent />
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    try {
      const result = await fetch('http://ip-api.com/json/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      })


      let props: any = {}
      const userData = await result.json();
      if (userData['status'] == 'success') {
        store.dispatch(updateUserData(userData))
      }
      if (hasCookie('homeThemeType', ctx)) {
        store.dispatch(updateHomeThemeType(getCookie('homeThemeType', ctx)))
      }
      if (hasCookie('homeThemeName', ctx)) {
        store.dispatch(updateHomeThemeName(getCookie('homeThemeName', ctx)))
      }

      if (hasCookie('homeAccessToken', ctx)) {
        const accessToken = getCookie('homeAccessToken', ctx);
        const user_id = getCookie('user_id', ctx);
        const services = getCookie('services', ctx);
        const roleName = getCookie('roleName', ctx)
        const iat = getCookie('iat', ctx)
        const exp = getCookie('exp', ctx);
        const res = await fetch(`${process.env.NEXT_PUBLIC_adminUrl}/api/singlePatient?_id=${user_id}`, {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        })
        // Check if the response is JSON
        const contentType = res.headers.get("content-type");
        if (!res.ok) {
          return {
            props: { ...props, error: `API Error: ${res.status} - ${res.statusText}`, errorCode: 502 },
          };
        }

        if (!contentType || !contentType.includes("application/json")) {
          return {
            props: { ...props, error: `Invalid response from API`, errorCode: 415 },
          };
        }
        const data = await res.json();


        if (data.error) {
          deleteCookie('homeAccessToken', ctx);
          deleteCookie('user_id', ctx);
          deleteCookie('services', ctx);
          deleteCookie('roleName', ctx);
          deleteCookie('iat', ctx);
          deleteCookie('exp', ctx);
          return {
            ...props,
            redirect: {
              destination: `/`,
              permanent: false,
            },
          }
        }
        if (roleName == 'patient') {
          store.dispatch(updateHomeAccessToken(accessToken))
          store.dispatch(updateHomeUserId(user_id))
          store.dispatch(updateHomeServices(services))
          store.dispatch(updateHomeRoleName(roleName))
          store.dispatch(updateHomeIAT(iat))
          store.dispatch(updateHomeExp(exp))
          store.dispatch(updateUserPatientProfile(data))
        } else {
          return {
            redirect: {
              destination: `/${roleName}/dashboard`,
              permanent: false,
            },
          }
        }
      } else {
        return {
          ...props,
          redirect: {
            destination: `/login`,
            permanent: false,
          },
        }
      }
      return {
        props
      }
    } catch (error) {
      console.log(error)
      let props = {}
      if (hasCookie('homeThemeType', ctx)) {
        store.dispatch(updateHomeThemeType(getCookie('homeThemeType', ctx)))
      }
      if (hasCookie('homeThemeName', ctx)) {
        store.dispatch(updateHomeThemeName(getCookie('homeThemeName', ctx)))
      }

      if (hasCookie('homeAccessToken', ctx)) {
        const accessToken = getCookie('homeAccessToken', ctx);
        const user_id = getCookie('user_id', ctx);
        const services = getCookie('services', ctx);
        const roleName = getCookie('roleName', ctx)
        const iat = getCookie('iat', ctx)
        const exp = getCookie('exp', ctx);
        const res = await fetch(`${process.env.NEXT_PUBLIC_adminUrl}/api/singlePatient?_id=${user_id}`, {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        })
        const data = await res.json();


        if (data.error) {
          deleteCookie('homeAccessToken', ctx);
          deleteCookie('user_id', ctx);
          deleteCookie('services', ctx);
          deleteCookie('roleName', ctx);
          deleteCookie('iat', ctx);
          deleteCookie('exp', ctx);
          return {
            ...props,
            redirect: {
              destination: `/`,
              permanent: false,
            },
          }
        }
        if (roleName == 'patient') {
          store.dispatch(updateHomeAccessToken(accessToken))
          store.dispatch(updateHomeUserId(user_id))
          store.dispatch(updateHomeServices(services))
          store.dispatch(updateHomeRoleName(roleName))
          store.dispatch(updateHomeIAT(iat))
          store.dispatch(updateHomeExp(exp))
          store.dispatch(updateUserPatientProfile(data))
        } else {
          return {
            redirect: {
              destination: `/${roleName}/dashboard`,
              permanent: false,
            },
          }
        }
      }
      return {
        props
      }
    }
  })

export default connect((state: AppState) => state)(CheckoutPage);