/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import ScrollToTop from '@/components/sections/ScrollToTop';

import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { DoctorPublicProfileReviewsTap } from '../DoctorsSections/Profile/DoctorPublicProfileReviewsTap';
import { DoctorProfileType } from '@/components/SearchDoctorSections/SearchDoctorSection';

import { LoadingComponent } from './ScheduleTiming';
const Reviews: FC = (() => {


  // const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

  return (
    <Fragment>
      <div className="col-md-12 col-lg-12 col-xl-12  animate__animated animate__backInUp">
        <div className="doc-review review-listing" >
          {
            userProfile == null ?
              <div className="card">
                <LoadingComponent boxMinHeight="100vh" />
              </div>
              :
              <>
                <div className="card" style={{ padding: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'center', minWidth: '100%', }}>
                    <DoctorPublicProfileReviewsTap profile={userProfile as unknown as DoctorProfileType} />
                  </div>
                </div>
              </>
          }
        </div>
        <ScrollToTop />
      </div>
    </Fragment>
  )
});

export default Reviews;