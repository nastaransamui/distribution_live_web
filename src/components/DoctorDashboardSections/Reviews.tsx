/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { DoctorPublicProfileReviewsTap } from '../DoctorsSections/Profile/DoctorPublicProfileReviewsTap';
import { DoctorProfileType } from '@/components/SearchDoctorSections/SearchDoctorSection';

import { LoadingComponent } from './ScheduleTiming';
import BeatLoader from 'react-spinners/BeatLoader';
const Reviews: FC = (() => {


  // const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;
  const theme = useTheme();
  return (
    <Fragment>
      {
        userProfile == null ?
          <BeatLoader color={theme.palette.primary.main} style={{
            minWidth: '100%',
            display: 'flex',
            justifyContent: 'center',
          }} />
          :
          <>

            <DoctorPublicProfileReviewsTap profile={userProfile as unknown as DoctorProfileType} />
          </>
      }
    </Fragment >
  )
});

export default Reviews;