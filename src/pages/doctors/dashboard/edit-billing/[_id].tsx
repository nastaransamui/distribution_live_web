
//next
import Head from 'next/head'
import { GetServerSideProps, NextPage } from 'next'
//Redux
import { wrapper } from '@/redux/store'
import { AppState } from '@/redux/store'
import { connect, useSelector } from 'react-redux';
import BreadCrumb from '@/components/shared/BreadCrumb';
import DashboardFooter from '@/components/sections/DashboardFooter';
import useScssVar from '@/hooks/useScssVar';
import BillingPage from '@/components/BillingPage/BilingPage';
import { getAndDispatchUserData, handleProtectedAuth, setThemeCookiesNoRedirect } from '@/helpers/getServerSidePropsHelpers';
// import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { base64regex } from '@/components/DoctorsSections/Profile/PublicProfilePage';
import { getCookie } from 'cookies-next';
import { Params } from 'next/dist/server/request/params';


const AddBillingPage: NextPage = (props: any) => {
  const { isSameDoctor } = props;
  const { muiVar } = useScssVar();
  const homeSideBarOpen = useSelector((state: AppState) => state.homeSideBarOpen.value)


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
      <BreadCrumb currentPath={props.currentPath} subtitle={isSameDoctor ? 'Edit Bill' : 'View Bill'} title={isSameDoctor ? 'Edit Bill' : 'View Bill'} />
      <div className={`content ${homeSideBarOpen ? 'content-padding-open' : 'content-padding-close'}`} style={muiVar}>
        <div className="container-fluid">
          <div className="row">
            <BillingPage pageType="edit" userType='doctor' />
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


    try {
      const { params } = ctx
      const { _id: encryptID } = params as Params
      if (!base64regex.test(encryptID as string)) return { props }
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
        const isSameDoctor = getCookie('user_id', ctx) === doctorPatientProfile?.singleBill?.doctorId;
        props = {
          ...props,
          isSameDoctor
        }
      }
    } catch (error) {
      return { props }
    }
    return { props }
  }
)

export default connect((state: AppState) => state)(AddBillingPage);