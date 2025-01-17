import { AppState } from '@/redux/store'
import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import PatientBillingRecords from './PatientBillingRecords'
import { useRouter } from 'next/router'

const BillingsPageWrapper: FC = () => {
  const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const router = useRouter()
  const patientBillingProps = {
    ...(userProfile?.roleName == 'patient' ? { patientId: userProfile?._id } : undefined),
    ...(userProfile?.roleName == 'doctors' ? { doctorId: userProfile?._id } : undefined),
  }

  return (
    <div className="col-md-7 col-lg-8 col-xl-9 " style={{ minHeight: '100vh' }}>

      <PatientBillingRecords
        userType={router.asPath.startsWith('/doctors') ? 'doctor' : 'patient'}
        {...patientBillingProps} />
    </div>
  )
}

export default BillingsPageWrapper