/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useState } from 'react'

import useScssVar from '@/hooks/useScssVar'

import MuiSwipeableTabs from '@/shared/MuiSwipeableTabs';

import { DoctorProfileType } from '@/components/SearchDoctorSections/SearchDoctorSection';
import DoctorPublicProfileOverViewTap from './DoctorPublicProfileOverViewTap';
import DoctorPublicProfileAvailabilityTap from './DoctorPublicProfileAvailabilityTap';
import { DoctorPublicProfileReviewsTap } from './DoctorPublicProfileReviewsTap';
import DoctorPublicProfileBusinessHoursTap from './DoctorPublicProfileBusinessHoursTap';

const DoctorPublicProfilePageTab: FC<{ profile: DoctorProfileType }> = (({ profile }) => {

  const { muiVar } = useScssVar();
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsClient(true), 20);
    return () => {
      setIsClient(false)
    }
  }, [])

  return (
    <Fragment>
      <div className={`card ${isClient ? 'animate__animated animate__backInUp' : 'pre-anim-hidden'}`} style={muiVar}>
        <MuiSwipeableTabs
          steps={
            [
              {
                stepName: "Overview",
                stepComponent: <DoctorPublicProfileOverViewTap profile={profile} />,
                stepId: 'Overview',
                isValidated: () => true,
                isDisable: false,
                hasParams: false,
                paramsObj: {}
              },
              {
                stepName: "Availablity",
                stepComponent: <DoctorPublicProfileAvailabilityTap profile={profile} />,
                stepId: 'Availablity',
                isValidated: () => true,
                isDisable: false,
                hasParams: false,
                paramsObj: {}
              },
              {
                stepName: "Reviews",
                stepComponent: <DoctorPublicProfileReviewsTap profile={profile} />,
                stepId: 'Reviews',
                isValidated: () => true,
                isDisable: false,
                hasParams: false,
                paramsObj: {}
              },
              {
                stepName: "Business Hours",
                stepComponent: <DoctorPublicProfileBusinessHoursTap profile={profile} />,
                stepId: 'Business Hours',
                isValidated: () => true,
                isDisable: false,
                hasParams: false,
                paramsObj: {}
              },
            ]
          }
          activeTab={0} />

      </div >


    </Fragment >
  )
});

export default DoctorPublicProfilePageTab;


