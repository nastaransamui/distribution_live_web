// BreadCrumb.tsx (replace existing file)
import { FC, Fragment, useEffect, useRef, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { useRouter } from 'next/router';

export interface BreadCrumbProps {
  title: string;
  subtitle: string;
  currentPath?: string; // optional prop coming from getServerSideProps
}

const BreadCrumb: FC<BreadCrumbProps> = ({ title, subtitle, currentPath }: BreadCrumbProps) => {
  const { muiVar } = useScssVar();
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;
  const router = useRouter();

  // Prefer server-provided path for deterministic SSR+CSR rendering
  const pathname = (typeof currentPath === 'string' && currentPath.length > 0) ? currentPath : (router?.pathname ?? '');

  // decide whether to skip animation
  const shouldSkipAnim = pathname.startsWith('/doctors/dashboard/chat-doctor') || pathname.startsWith('/patient/dashboard/patient-chat');
  // const shouldSkipAnim = false;

  // server renders with preAnimate = true so markup matches SSR.
  // On client we toggle `animate` and remove `preAnimate` when animation starts or after timeout.
  const [animate, setAnimate] = useState(false);
  const [preAnimate, setPreAnimate] = useState(true);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // only run on client
    if (shouldSkipAnim) {
      // no animation: immediately reveal (client-side)
      setPreAnimate(false);
      return;
    }

    // trigger animate class addition
    setAnimate(true);

    let cleanedUp = false;
    // fallback: if animation doesn't start within this time, reveal anyway
    const fallbackTimer = setTimeout(() => {
      if (!cleanedUp) {
        setPreAnimate(false);
        cleanedUp = true;
      }
    }, 900); // 900ms fallback (adjust if your animation is longer)

    const node = wrapperRef.current;
    const handleAnimStart = () => {
      if (!cleanedUp) {
        setPreAnimate(false);
        cleanedUp = true;
      }
    };
    const handleAnimEnd = () => {
      if (!cleanedUp) {
        setPreAnimate(false);
        cleanedUp = true;
      }
    };

    if (node) {
      node.addEventListener('animationstart', handleAnimStart);
      node.addEventListener('animationend', handleAnimEnd);
    }

    return () => {
      clearTimeout(fallbackTimer);
      if (node) {
        node.removeEventListener('animationstart', handleAnimStart);
        node.removeEventListener('animationend', handleAnimEnd);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // build classes deterministically for SSR; client updates via state
  const preClass = preAnimate ? 'breadcrumb-pre-animate' : '';
  const animClass = animate ? 'animate__animated animate__backInDown' : '';
  const classes = `${preClass} ${animClass}`.trim();

  return (
    <Fragment>
      {/* local CSS: hide initially and ensure animation retains final state */}
      <style jsx>{`
        /* ensure the element starts hidden so it won't be visible before the animation plays */
        .breadcrumb-pre-animate {
          opacity: 0;
        }
        /* ensure animate.css animations keep their final state */
        .animate__animated {
          animation-fill-mode: both;
        }
      `}</style>

      <div ref={wrapperRef} className={`breadcrumb-bar-two ${classes}`} style={muiVar}>
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <h2 className="breadcrumb-title">{title}</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href="/">Home</Link>
                  </li>
                  {
                    pathname.split('/').length > 2 &&
                    pathname.split('/')[pathname.split('/').length - 1] !== 'dashboard' &&
                    <li className="breadcrumb-item">
                      <Link href='' onClick={(e) => {
                        e.preventDefault();
                        if (userProfile) {
                          if (pathname.split('/')[2] == 'dashboard') {
                            router.push(`/${userProfile?.roleName}/dashboard`)
                          } else {
                            router.push(`/${userProfile?.roleName}/dashboard`)
                          }
                        } else {
                          router.push('/doctors/search')
                        }
                      }}>
                        {
                          pathname.split('/')[2] == 'dashboard' ?
                            'Dashboard' :
                            userProfile ? `${userProfile?.roleName.charAt(0).toUpperCase()}${userProfile?.roleName.slice(1)}` : 'Doctors'
                        }
                      </Link>
                    </li>
                  }
                  <li className="breadcrumb-item" aria-current="page">
                    {subtitle}
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
};

export default BreadCrumb;
