import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { useRouter } from 'next/router';

export interface BreadCrumbProps {
  title: string;
  subtitle: string
}

const BreadCrumb: FC<BreadCrumbProps> = (({ title, subtitle }: BreadCrumbProps) => {
  const { muiVar } = useScssVar();
  // const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;
  const router = useRouter();

  return (
    <Fragment>
      <div className="breadcrumb-bar-two" style={muiVar}>
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
                    router.pathname.split('/').length > 2 &&
                    router.pathname.split('/')[router.pathname.split('/').length - 1] !== 'dashboard' &&
                    <li className="breadcrumb-item">
                      <Link href='' onClick={(e) => {
                        e.preventDefault();
                        if (userProfile) {
                          if (router.pathname.split('/')[2] == 'dashboard') {
                            router.push(`/${userProfile?.roleName}/dashboard`)
                          } else {
                            // router.push(`/${router.pathname.split('/')[1]}`)
                            router.push(`/${userProfile?.roleName}/dashboard`)
                            if (document.referrer == '') {

                            } else {
                              // router.back()
                            }

                          }
                        } else {
                          router.push('/doctors/search')
                        }
                      }}>
                        {
                          router.pathname.split('/')[2] == 'dashboard' ?
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
});

export default BreadCrumb;