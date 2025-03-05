
//next
import Head from 'next/head'
import { GetServerSideProps, NextPage } from 'next'
import { hasCookie, getCookie, deleteCookie } from 'cookies-next';

//Redux
import { wrapper } from '@/redux/store'
import { AppState } from '@/redux/store'
import { connect } from 'react-redux';
import dynamic from 'next/dynamic';

// Lazy load all components except HomeBanner
const Specialties = dynamic(() => import('@/components/sections/Specialties'), { ssr: true });
const Doctors = dynamic(() => import('@/components/sections/Doctors'), { ssr: true });
// const Pricing = dynamic(() => import('@/components/sections/Pricing'), { ssr: true });
// const WorkSection = dynamic(() => import('@/components/sections/WorkSection'), { ssr: false });
const LatestArticle = dynamic(() => import('@/components/sections/LatestArticle'), { ssr: true });
const MobileAppSection = dynamic(() => import('@/components/sections/MobileAppSection'), { ssr: true });
const FaqSection = dynamic(() => import('@/components/sections/FaqSection'), { ssr: true });
const Testimonial = dynamic(() => import('@/components/sections/Testimonial'), { ssr: true });
const PartnersSection = dynamic(() => import('@/components/sections/PartnersSection'), { ssr: true });
const Footer = dynamic(() => import('@/components/sections/Footer'), { ssr: true });

// Non-lazy loaded component
import HomeBanner from '@/components/sections/HomeBanner';
import CookieConsentComponent from '@/components/shared/CookieConsentComponent';
import WorkSection from '@/components/sections/WorkSection';
import ScrollToTop from '@/components/sections/ScrollToTop';
import { updateHomeThemeName } from '@/redux/homeThemeName';
import { updateHomeThemeType } from '@/redux/homeThemeType';
import { updateUserData } from '@/redux/userData';
import { updateHomeAccessToken } from '@/redux/homeAccessToken';
import { useEffect, useRef, useState } from 'react';
import { updateHomeUserId } from '@/redux/homeUserId';
import { updateHomeExp } from '@/redux/homeExp';
import { updateHomeIAT } from '@/redux/homeIAT';
import { updateHomeRoleName } from '@/redux/homeRoleName';
import { updateHomeServices } from '@/redux/homeServices';
import { updateUserDoctorProfile } from '@/redux/userDoctorProfile';
import { updateUserPatientProfile } from '@/redux/userPatientProfile';
export const LazyLoadWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        rootMargin: '200px',
        threshold: 0.2,
      }
    );
    const currentRef = ref.current; // Store ref.current in a variable
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return <div ref={ref}>{isVisible && children}</div>;
};

const Home: NextPage = (props: any) => {
  // console.log(props)
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
        <link rel="preload" href="/assets/images/banner-bg.webp" as="image"></link>
        <title>Welcome to Health Care page</title>
      </Head>
      <HomeBanner />
      <LazyLoadWrapper>
        <Specialties />
      </LazyLoadWrapper>
      <LazyLoadWrapper>
        <Doctors />
      </LazyLoadWrapper>
      {/* <Pricing /> */}
      <WorkSection />
      <LazyLoadWrapper>
        <LatestArticle />
      </LazyLoadWrapper>
      <LazyLoadWrapper>
        <MobileAppSection />
      </LazyLoadWrapper>
      <LazyLoadWrapper>
        <FaqSection />
      </LazyLoadWrapper>
      <LazyLoadWrapper>
        <Testimonial />
      </LazyLoadWrapper>
      <LazyLoadWrapper>
        <PartnersSection />
      </LazyLoadWrapper>
      <LazyLoadWrapper>
        <Footer />
      </LazyLoadWrapper>
      <ScrollToTop />
      <CookieConsentComponent />
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
      if (hasCookie('homeActivePage', ctx)) {
        let destination;
        switch (getCookie('homeActivePage', ctx)) {
          case 'general_0':
            destination = "/home"

            return {
              redirect: {
                destination: destination,
                permanent: false,
              },
            }
          case 'general_1':
            destination = "/home3"

            return {
              redirect: {
                destination: destination,
                permanent: false,
              },
            }
          case 'general_2':
            destination = "/home4"

            return {
              redirect: {
                destination: destination,
                permanent: false,
              },
            }
        }
      } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_adminUrl}/publications/homeTheme`, { method: 'GET', })
        const homeObject = await res.json();
        const hometheme = homeObject['hometheme']
        let redirect = hometheme[0]?.['homeRedirect']
        if (redirect !== ctx.resolvedUrl) {
          return {
            redirect: {
              destination: redirect,
              permanent: false,
            },
          }
        }
      }
      // const res = await fetch(`${process.env.NEXT_PUBLIC_adminUrl}/api/bestDoctors`, {
      //   method: 'GET',
      //   headers: {
      //     'Accept': 'application/json',
      //     'Content-Type': 'application/json'
      //   }
      // })

      // const data = await res.json();

      // // if (!data?.error && data.length > 0) {
      // //   const { bestDoctors, totalBestDoctors, totalDoctors } = data[0];
      // //   store.dispatch(updateBestDoctorsData({
      // //     bestDoctors: bestDoctors || [],
      // //     totalBestDoctor: totalBestDoctors ?? 0, // Ensure it's a number
      // //     totalDoctors: totalDoctors ?? 0, // Ensure it's a number
      // //   }));

      // // }
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
              destination: `/login`,
              permanent: false,
            },
          }
        }
        store.dispatch(updateHomeAccessToken(accessToken))
        store.dispatch(updateHomeUserId(user_id))
        store.dispatch(updateHomeServices(services))
        store.dispatch(updateHomeRoleName(roleName))
        store.dispatch(updateHomeIAT(iat))
        store.dispatch(updateHomeExp(exp))
        roleName == 'patient' ?
          store.dispatch(updateUserPatientProfile(data)) :
          store.dispatch(updateUserDoctorProfile(data))
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
      if (hasCookie('homeActivePage', ctx)) {
        let destination;
        switch (getCookie('homeActivePage', ctx)) {
          case 'general_0':
            destination = "/home"

            return {
              redirect: {
                destination: destination,
                permanent: false,
              },
            }
          case 'general_1':
            destination = "/home3"

            return {
              redirect: {
                destination: destination,
                permanent: false,
              },
            }
          case 'general_2':
            destination = "/home4"

            return {
              redirect: {
                destination: destination,
                permanent: false,
              },
            }
        }
      } else {
        try {

          const res = await fetch(`${process.env.NEXT_PUBLIC_adminUrl}/publications/homeTheme`, { method: 'GET', })
          const homeObject = await res.json();
          const hometheme = homeObject['hometheme']
          let redirect = hometheme[0]?.['homeRedirect']
          if (redirect !== ctx.resolvedUrl) {
            return {
              redirect: {
                destination: redirect,
                permanent: false,
              },
            }
          }
        } catch (e) {
          console.error(e);
        } finally {
          console.log('We do cleanup here');
        }
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
              destination: `/login`,
              permanent: false,
            },
          }
        }
        store.dispatch(updateHomeAccessToken(accessToken))
        store.dispatch(updateHomeUserId(user_id))
        store.dispatch(updateHomeServices(services))
        store.dispatch(updateHomeRoleName(roleName))
        store.dispatch(updateHomeIAT(iat))
        store.dispatch(updateHomeExp(exp))
        roleName == 'patient' ?
          store.dispatch(updateUserPatientProfile(data)) :
          store.dispatch(updateUserDoctorProfile(data))
      }
      return {
        props
      }
    }
  })

export default connect((state: AppState) => state)(Home);