
//next
import Head from 'next/head'
import { GetServerSideProps, NextPage } from 'next'
import { hasCookie, getCookie } from 'cookies-next';
//Redux
import { wrapper } from '@/redux/store'
import { AppState } from '@/redux/store'
import { connect } from 'react-redux';
import { updateHomeThemeName } from '@/redux/homeThemeName';
import { updateHomeThemeType } from '@/redux/homeThemeType';
import { updateUserData } from '@/redux/userData';
import BreadCrumb from '@/components/shared/BreadCrumb';
import Footer from '@/components/sections/Footer';
import verifyHomeAccessToken from '@/helpers/verifyHomeAccessToken';
import { updateUserProfile } from '@/redux/userProfile';
import { updateHomeAccessToken } from '@/redux/homeAccessToken';
import isJsonString from '@/helpers/isJson';
import PrescriptionPage from '@/components/PrescriptionsPage/PrescriptionPage';
import { Params } from '@/pages/doctors/dashboard/patient-profile/[_id]';
import { base64regex } from '@/components/DoctorsSections/Profile/ProfilePage';
import useScssVar from '@/hooks/useScssVar';
const SeePrescriptionPage: NextPage = (props: any) => {
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
      <BreadCrumb subtitle='Prescription Details' title='Prescription Details' />
      <div className="content" style={muiVar}>
        <div className="container-fluid">
          <div className="row">
            <PrescriptionPage pageType='see' userType='doctor' doctorPatientProfile={doctorPatientProfile} />
            <Footer />
          </div>
        </div>
      </div>
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
      if (hasCookie('homeAccessToken', ctx)) {
        switch (true) {
          case isJsonString(getCookie('homeAccessToken', ctx) as string):
            const { length } = JSON.parse(getCookie('homeAccessToken', ctx) as string)
            var fullToken: string = '';
            for (var i = 0; i < parseInt(length); i++) {
              fullToken += getCookie(`${i}`, ctx);
            }
            if (fullToken !== '') {
              var { accessToken, user_id, services, roleName, iat, exp, userProfile } = verifyHomeAccessToken(fullToken)
              if (roleName == 'doctors') {
                store.dispatch(updateHomeAccessToken(fullToken))
                store.dispatch(updateUserProfile(userProfile))
              } else {
                return {
                  redirect: {
                    destination: `/${roleName}/dashboard`,
                    permanent: false,
                  },
                }
              }
            }
            break;

          default:
            var { accessToken, user_id, services, roleName, iat, exp, userProfile } = verifyHomeAccessToken(getCookie('homeAccessToken', ctx))

            if (roleName == 'doctors') {
              store.dispatch(updateHomeAccessToken(getCookie('homeAccessToken', ctx)))
              store.dispatch(updateUserProfile(userProfile))
            } else {
              return {
                redirect: {
                  destination: `/${roleName}/dashboard`,
                  permanent: false,
                },
              }
            }
            break;
        }
        if (base64regex.test(encryptID)) {
          let prescription_id = atob(encryptID as string)
          const res = await fetch(`${process.env.NEXT_PUBLIC_adminUrl}/methods/findPrescriptionForDoctorProfileById`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ _id: prescription_id, }),
          })
          const data = await res.json();
          const { status, user: doctorPatientProfile } = data
          console.log({ data })
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
        switch (true) {
          case isJsonString(getCookie('homeAccessToken', ctx) as string):
            const { length } = JSON.parse(getCookie('homeAccessToken', ctx) as string)
            var fullToken: string = '';
            for (var i = 0; i < parseInt(length); i++) {
              fullToken += getCookie(`${i}`, ctx);
            }
            if (fullToken !== '') {
              var { accessToken, user_id, services, roleName, iat, exp, userProfile } = verifyHomeAccessToken(fullToken)
              if (roleName == 'doctors') {
                store.dispatch(updateHomeAccessToken(fullToken))
                store.dispatch(updateUserProfile(userProfile))
              } else {
                return {
                  redirect: {
                    destination: `/${roleName}/dashboard`,
                    permanent: false,
                  },
                }
              }
            }
            break;

          default:
            var { accessToken, user_id, services, roleName, iat, exp, userProfile } = verifyHomeAccessToken(getCookie('homeAccessToken', ctx))

            if (roleName == 'doctors') {
              store.dispatch(updateHomeAccessToken(getCookie('homeAccessToken', ctx)))
              store.dispatch(updateUserProfile(userProfile))
            } else {
              return {
                redirect: {
                  destination: `/${roleName}/dashboard`,
                  permanent: false,
                },
              }
            }
            break;
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

export default connect((state: AppState) => state)(SeePrescriptionPage);