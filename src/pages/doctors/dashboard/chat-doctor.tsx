
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
import ChatComponent from '@/components/shared/ChatComponent';
import BreadCrumb from '@/components/shared/BreadCrumb';
import { updateHomeAccessToken } from '@/redux/homeAccessToken';
import { updateHomeExp } from '@/redux/homeExp';
import { updateHomeIAT } from '@/redux/homeIAT';
import { updateHomeRoleName } from '@/redux/homeRoleName';
import { updateHomeServices } from '@/redux/homeServices';
import { updateHomeUserId } from '@/redux/homeUserId';
import { updateUserDoctorProfile } from '@/redux/userDoctorProfile';
import { ErrorComponent } from '@/pages/404';
import DoctorDashboardSidebar from '@/components/shared/DoctorDashboardSidebar';
import { updateHomeSideBarOpen } from '@/redux/homeSideBarOpen';
import useScssVar from '@/hooks/useScssVar';
import DashboardFooter from '@/components/sections/DashboardFooter';

const ChatDoctorPage: NextPage = (props: any) => {
  const homeSideBarOpen = useSelector((state: AppState) => state.homeSideBarOpen.value)
  const { muiVar } = useScssVar();

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
      <BreadCrumb subtitle='Chat' title='Chat' />
      <div className={`content ${homeSideBarOpen ? 'content-padding-open' : 'content-padding-close'}`} style={muiVar}>
        <div className="container-fluid">
          <div className="row">
            <DoctorDashboardSidebar />
            <ChatComponent />
          </div>
        </div>
      </div>
      <DashboardFooter />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    try {
      let props = {}
      const result = await fetch('http://ip-api.com/json/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      })
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
      if (hasCookie('homeMiniSidebarOpen', ctx)) {
        store.dispatch(updateHomeSideBarOpen(getCookie('homeMiniSidebarOpen', ctx)))
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
        if (roleName == 'doctors') {
          store.dispatch(updateHomeAccessToken(accessToken))
          store.dispatch(updateHomeUserId(user_id))
          store.dispatch(updateHomeServices(services))
          store.dispatch(updateHomeRoleName(roleName))
          store.dispatch(updateHomeIAT(iat))
          store.dispatch(updateHomeExp(exp))
          store.dispatch(updateUserDoctorProfile(data))
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
      let props = {}
      console.log(error)
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
        if (roleName == 'doctors') {
          store.dispatch(updateHomeAccessToken(accessToken))
          store.dispatch(updateHomeUserId(user_id))
          store.dispatch(updateHomeServices(services))
          store.dispatch(updateHomeRoleName(roleName))
          store.dispatch(updateHomeIAT(iat))
          store.dispatch(updateHomeExp(exp))
          store.dispatch(updateUserDoctorProfile(data))
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
    }
  })

export default connect((state: AppState) => state)(ChatDoctorPage);