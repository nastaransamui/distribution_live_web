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
import { doctorPatientInitialLimitsAndSkips, DoctorPatientInitialLimitsAndSkipsTypes, PatientProfileExtendType } from '../PrescriptionsPage/PrescriptionPage'
import AddBilling, { BillingType } from '../DoctorDashboardSections/AddBilling'
import EditBilling, { BillingTypeWithDoctorProfile } from '../DoctorDashboardSections/EditBilling'
import SeeBilling from '../PatientDashboardSections/SeeBilling'

export interface PatientProfileExtendBillingType extends PatientProfile {
  user: PatientProfile
  singleBilling: BillingType
}
export interface DoctorPatientProfileBillingTypes {
  doctorPatientProfile: PatientProfileExtendBillingType;
  userType: 'doctor' | 'patient';
  pageType: 'edit' | 'add' | 'see'
}

const BillingPage: FC<DoctorPatientProfileBillingTypes> = (({ doctorPatientProfile, userType, pageType }) => {
  const searchParams = useSearchParams();
  const { bounce, } = useScssVar();
  const encryptID = searchParams.get('_id')
  const router = useRouter()
  const [profile, setProfile] = useState<any>(doctorPatientProfile);
  const [singleBill, setSingleBill] = useState<BillingTypeWithDoctorProfile>();
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  // const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

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
            homeSocket.current.once(`findDocterPatientProfileByIdReturn`, (msg: { status: number, user: PatientProfileExtendBillingType, reason?: string }) => {
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
          } else if (pageType == 'see') {
            homeSocket.current.emit(`getSingleBillingForPatient`, { billing_id: _id, patientId: userProfile?._id })
            homeSocket.current.once(`getSingleBillingForPatientReturn`, (msg: { status: number, singleBill: BillingTypeWithDoctorProfile[], reason?: string }) => {
              const { status, singleBill, reason } = msg;
              if (status !== 200) {
                toast.error(reason || `Error ${status} find Bill`, {
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
                homeSocket.current.once(`updateGetSingleBillingForPatientReturn`, () => {
                  setReload(!reload)
                })
                if (singleBill && singleBill.length > 0) {
                  setSingleBill(singleBill[0])
                }

              }
            })
          } else {
            homeSocket.current.emit(`findBillingForDoctorProfileById`, { _id })
            homeSocket.current.once(`findBillingForDoctorProfileByIdReturn`, (msg: { status: number, user: PatientProfileExtendType, reason?: string }) => {
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
                homeSocket.current.once(`updatefindBillingForDoctorProfileById`, () => {
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
            return <AddBilling doctorPatientProfile={profile} />
          case 'edit':
            return <EditBilling singleBill={profile?.singleBill} />
          default:
            return <>{singleBill && <SeeBilling singleBill={singleBill} />}</>
        }
      })()}
    </Fragment>
  )
})

export default BillingPage;