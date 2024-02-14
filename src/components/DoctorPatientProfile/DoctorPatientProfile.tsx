import { FC, Fragment, useEffect, useState } from 'react'
import { PatientProfile } from '../DoctorDashboardSections/MyPtients'
import PatientSidebarDoctorDashboard from '../shared/PatientSidebarDoctorDashboard'
import PatientProfileTabs from '../DoctorDashboardSections/PatientProfileTabs'
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
  createdDate: Date;
}
export interface PatientProfileExtendType extends PatientProfile {
  appointments: AppointmentReservationExtendType[];
  lastTwoAppointments: AppointmentReservationExtendType[];
  prescriptions: any[];
}
export interface DoctorPatientProfileTypes {
  doctorPatientProfile: PatientProfileExtendType
}
const DoctorPatientProfile: FC<DoctorPatientProfileTypes> = (({ doctorPatientProfile }) => {
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

  const [isMobile, setIsmobile] = useState(false)
  useEffect(() => {
    setIsmobile(typeof window !== 'undefined' && window.mobileCheck())
  }, [])
  return (
    <Fragment>
      <PatientSidebarDoctorDashboard doctorPatientProfile={profile} />

      <div className="col-md-7 col-lg-8 col-xl-9 dct-appoinment" >
        <PatientProfileTabs isMobile={isMobile} doctorPatientProfile={profile} userType='doctor' dataGridFilters={dataGridFilters} setDataGridFilters={setDataGridFilters} />
      </div>
    </Fragment>
  )
})

export default DoctorPatientProfile;