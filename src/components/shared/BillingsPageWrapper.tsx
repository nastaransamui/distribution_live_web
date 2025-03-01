import { AppState } from '@/redux/store'
import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import PatientBillingRecords from './PatientBillingRecords'
import { useRouter } from 'next/router'

const BillingsPageWrapper: FC = () => {
  // const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

  const router = useRouter()
  const patientBillingProps = {
    ...(userProfile?.roleName == 'patient' ? { patientId: userProfile?._id } : undefined),
    ...(userProfile?.roleName == 'doctors' ? { doctorId: userProfile?._id } : undefined),
  }

  return (
    <div className="col-md-12 col-lg-12 col-xl-12   animate__animated animate__backInUp" style={{ minHeight: '100vh' }}>

      <PatientBillingRecords
        userType={router.asPath.startsWith('/doctors') ? 'doctor' : 'patient'}
        {...patientBillingProps} />
    </div>
  )
}

export default BillingsPageWrapper