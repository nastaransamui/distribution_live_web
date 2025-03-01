/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import ScrollToTop from '@/components/sections/ScrollToTop';

import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';

import { useTheme } from '@mui/material/styles';
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
import PatientReviews from './PatientReviews';
import { LoadingComponent } from '@/components/DoctorDashboardSections/ScheduleTiming';
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
                    <PatientReviews profile={userProfile} />
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