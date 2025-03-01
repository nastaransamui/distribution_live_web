
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
import DashboardFooter from '@/components/sections/DashboardFooter';
import { updateHomeAccessToken } from '@/redux/homeAccessToken';
import { ParsedUrlQuery } from "querystring";
import { base64regex } from '@/components/DoctorsSections/Profile/PublicProfilePage';
import DoctorPatientProfile, { doctorPatientInitialLimitsAndSkips } from '@/components/DoctorPatientProfile/DoctorPatientProfile';
export interface Params extends ParsedUrlQuery {
  _id: string;
}
import useScssVar from '@/hooks/useScssVar';
import { updateHomeExp } from '@/redux/homeExp';
import { updateHomeIAT } from '@/redux/homeIAT';
import { updateHomeRoleName } from '@/redux/homeRoleName';
import { updateHomeServices } from '@/redux/homeServices';
import { updateHomeUserId } from '@/redux/homeUserId';
import { updateUserDoctorProfile } from '@/redux/userDoctorProfile';
import { ErrorComponent } from '@/pages/404';
import { updateHomeSideBarOpen } from '@/redux/homeSideBarOpen';
const PatientProfilePage: NextPage = (props: any) => {
  const { doctorPatientProfile } = props;
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
      <BreadCrumb subtitle='Doctor View Patient' title='Doctor View Patient' />
      <div className={`content ${homeSideBarOpen ? 'content-padding-open' : 'content-padding-close'}`} style={muiVar}>
        <div className="container-fluid">
          <div className="row">
            <DoctorPatientProfile doctorPatientProfile={doctorPatientProfile} />
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
      const { params } = ctx
      const { _id: encryptID } = params as Params
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


        if (base64regex.test(encryptID)) {
          let patient_id = atob(encryptID as string)
          const res = await fetch(`${process.env.NEXT_PUBLIC_adminUrl}/methods/findDocterPatientProfileById`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ _id: patient_id, ...doctorPatientInitialLimitsAndSkips }),
          })
          const data = await res.json();
          const { status, user: doctorPatientProfile } = data
          if (status == 200) {
            props = {
              ...props,
              doctorPatientProfile: doctorPatientProfile
            }
          } else {
            return {
              ...props,
              redirect: {
                destination: `/doctors/dashboard`,
                permanent: false,
              },
            }
          }
        } else {
          return {
            ...props,
            redirect: {
              destination: `/doctors/dashboard`,
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
        ...props,
        redirect: {
          destination: `/doctors/dashboard`,
          permanent: false,
        },
      }
    }
  })

export default connect((state: AppState) => state)(PatientProfilePage);