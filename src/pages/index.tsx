
//next
import Head from 'next/head'
import { GetServerSideProps, NextPage } from 'next'

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

import { useEffect, useRef, useState } from 'react';
import { getAndDispatchUserData, handleHomePageTheme, setAuthCookiesNoRedirect } from '@/helpers/getServerSidePropsHelpers';

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
    // 1) quick geo-ip fetch (best-effort)
    await getAndDispatchUserData(ctx, store)

    // redirect to correct current home route
    const r = await handleHomePageTheme(ctx, store);
    if (r) return r;


    //set auth coockies
    await setAuthCookiesNoRedirect(ctx, store);

    return { props: {} };

  })

export default connect((state: AppState) => state)(Home);
