import { FC, Fragment, useEffect, useState } from 'react'
import { PatientProfile } from '../DoctorDashboardSections/MyPtients'
import PatientSidebarDoctorDashboard from '../shared/PatientSidebarDoctorDashboard'
import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'
import { AppState } from '@/redux/store'
import { useSelector } from 'react-redux'
import { base64regex } from '../DoctorsSections/Profile/ProfilePage'
import { toast } from 'react-toastify'
import useScssVar from '@/hooks/useScssVar'
import _ from 'lodash'
import { AppointmentReservationType } from '../DoctorsSections/CheckOut/PaymentSuccess'
import { DoctorProfileType } from '../SearchDoctorSections/SearchDoctorSection'
import PatientDashboardSidebar from '../shared/PatientDashboardSidebar'
import AddPrescription from '../DoctorDashboardSections/AddPrescription'
import SeePrescription, { PrescriptionsTypeWithDoctorProfile } from '../DoctorDashboardSections/SeePrescription'
import EditPrescription from '../DoctorDashboardSections/EditPrescription'

export interface DoctorPatientInitialLimitsAndSkipsTypes {
  appointMentsLimit: number;
  appointMentsSkip: number;
  prescriptionLimit: number;
  prescriptionSkip: number;
  medicalRecordLimit: number;
  medicalRecordSkip: number;
  billingLimit: number;
  billingSkip: number;
}

export const doctorPatientInitialLimitsAndSkips: DoctorPatientInitialLimitsAndSkipsTypes = {
  appointMentsLimit: 5,
  appointMentsSkip: 0,
  prescriptionLimit: 5,
  prescriptionSkip: 0,
  medicalRecordLimit: 5,
  medicalRecordSkip: 0,
  billingLimit: 5,
  billingSkip: 0,
}
export interface AppointmentReservationExtendType extends AppointmentReservationType {
  doctorProfile: DoctorProfileType;
  createdDate: string;
}
export interface PatientProfileExtendType extends PatientProfile {
  appointments: AppointmentReservationExtendType[];
  lastTwoAppointments: AppointmentReservationExtendType[];
  prescriptions: any[];
  singlePrescription: PrescriptionsTypeWithDoctorProfile;
}
export interface DoctorPatientProfileTypes {
  doctorPatientProfile: PatientProfileExtendType;
  userType: 'doctor' | 'patient';
  pageType: 'edit' | 'add' | 'see'
}
const PrescriptionPage: FC<DoctorPatientProfileTypes> = (({ doctorPatientProfile, userType, pageType }) => {
  const searchParams = useSearchParams();
  const { bounce, } = useScssVar();
  const encryptID = searchParams.get('_id')
  const router = useRouter()
  const [profile, setProfile] = useState<PatientProfileExtendType>(doctorPatientProfile);
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const [reload, setReload] = useState<boolean>(false)
  const [dataGridFilters, setDataGridFilters] = useState<DoctorPatientInitialLimitsAndSkipsTypes>(doctorPatientInitialLimitsAndSkips);

  useEffect(() => {
    let active = true;
    if (encryptID) {
      if (base64regex.test(encryptID)) {
        let _id = atob(encryptID as string)
        if (active && homeSocket?.current) {
          if (pageType == 'add') {
            homeSocket.current.emit(`findDocterPatientProfileById`, { _id, ...dataGridFilters })
            homeSocket.current.once(`findDocterPatientProfileByIdReturn`, (msg: { status: number, user: PatientProfileExtendType, reason?: string }) => {
              const { status, user, reason } = msg;
              if (status !== 200) {
                toast.error(reason || `Error ${status} find Doctor`, {
                  position: "bottom-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  transition: bounce,
                  onClose: () => {
                    router.back()
                  }
                });
              } else {
                homeSocket.current.once(`updatefindDocterPatientProfileById`, () => {
                  setReload(!reload)
                })
                if (!_.isEqual(user, doctorPatientProfile)) {
                  setProfile(user)
                }
              }
            })
          } else {
            homeSocket.current.emit(`findPrescriptionForDoctorProfileById`, { _id })
            homeSocket.current.once(`findPrescriptionForDoctorProfileByIdReturn`, (msg: { status: number, user: PatientProfileExtendType, reason?: string }) => {
              const { status, user, reason } = msg;
              if (status !== 200) {
                toast.error(reason || `Error ${status} find Doctor`, {
                  position: "bottom-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  transition: bounce,
                  onClose: () => {
                    router.back()
                  }
                });
              } else {
                homeSocket.current.once(`updatefindPrescriptionForDoctorProfileById`, () => {
                  setReload(!reload)
                })
                if (!_.isEqual(user, doctorPatientProfile)) {
                  setProfile(user)
                }
              }
            })
          }
        }
      } else {
        router.back()
      }
    }
    return () => {
      active = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encryptID, homeSocket, reload, dataGridFilters])

  return (
    <Fragment>
      {userType == 'doctor' ?
        <PatientSidebarDoctorDashboard doctorPatientProfile={profile} /> :
        <PatientDashboardSidebar />
      }

      {(() => {
        switch (pageType) {
          case 'add':
            return <AddPrescription doctorPatientProfile={profile} />
          case 'edit':
            return <EditPrescription singlePrescription={profile?.singlePrescription} />
          default:
            return <SeePrescription singlePrescription={profile?.singlePrescription} />
        }
      })()}
    </Fragment>
  )
})

export default PrescriptionPage;