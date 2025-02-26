/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import ScrollToTop from '@/components/sections/ScrollToTop';

import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { DoctorPublicProfileReviewsTap } from '../DoctorsSections/Profile/DoctorPublicProfileReviewsTap';
import { DoctorProfileType } from '@/components/SearchDoctorSections/SearchDoctorSection';

import { useTheme } from '@mui/material/styles';
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
import { LoadingComponent } from './ScheduleTiming';
const Reviews: FC = (() => {
  const { muiVar } = useScssVar();


  // const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

  const theme = useTheme();

  return (
    <Fragment>
      <div className="col-md-7 col-lg-8 col-xl-9  animate__animated animate__backInUp">
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