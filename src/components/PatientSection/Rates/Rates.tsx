/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import ScrollToTop from '@/components/sections/ScrollToTop';

import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';

import { useTheme } from '@mui/material/styles';
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
import PatientRates from './PatientRates';
import { UserPatientProfileType } from '@/redux/userPatientProfile';
const Rates: FC = (() => {
  const { muiVar } = useScssVar();

  // const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value) as UserPatientProfileType['value'];
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

  const theme = useTheme();

  return (
    <Fragment>
      <div className="col-md-7 col-lg-8 col-xl-9" style={muiVar}>
        <div className="doc-review review-listing" >
          {
            userProfile == null ?
              <CircleToBlockLoading color={theme.palette.primary.main} size="small" style={{
                minWidth: '100%',
                display: 'flex',
                justifyContent: 'center',
              }} />
              :
              <>
                {userPatientProfile !== null && <PatientRates profile={userPatientProfile} />}
              </>
          }
        </div>
        <ScrollToTop />
      </div>
    </Fragment>
  )
});

export default Rates;