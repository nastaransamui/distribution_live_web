import useScssVar from '@/hooks/useScssVar';
import React, { FC, Fragment } from 'react'
import MuiSwipeableTabs from '../shared/MuiSwipeableTabs';
import MedicalRecords from './MedicalRecords';
import MedicalRecordsPriscription from './MedicalRecordsPriscription';
import { AppState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { PatientProfile } from '../DoctorDashboardSections/MyPtients';

const MedicalRecordsPrepage: FC = (() => {
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

  return (
    <Fragment>
      <div className="col-md-7 col-lg-8 col-xl-9 animate__animated animate__backInUp">
        <div className="row">
          <div className="card">
            <div className="card-body">
              <MuiSwipeableTabs steps={
                [
                  {
                    stepName: "Medical Records",
                    stepComponent: <MedicalRecords patientProfile={userProfile as unknown as PatientProfile} />,
                    stepId: 'Medical Records',
                    isValidated: () => true,
                    isDisable: false,
                    hasParams: false,
                    paramsObj: {}
                  },
                  {
                    stepName: "Priscription Records",
                    stepComponent: <MedicalRecordsPriscription patientProfile={userProfile as unknown as PatientProfile} />,
                    stepId: 'Priscription Records',
                    isValidated: () => true,
                    isDisable: false,
                    hasParams: false,
                    paramsObj: {}
                  }
                ]
              }
                activeTab={0} />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
});

export default MedicalRecordsPrepage
