import { FC, Fragment, useEffect, useState } from 'react'
import { PatientProfile } from '../DoctorDashboardSections/MyPtients'
import PatientSidebarDoctorDashboard from '../shared/PatientSidebarDoctorDashboard'
import PatientProfileTabs from '../DoctorDashboardSections/PatientProfileTabs'
import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'
import { AppState } from '@/redux/store'
import { useSelector } from 'react-redux'
import { base64regex } from '../DoctorsSections/Profile/PublicProfilePage'
import { toast } from 'react-toastify'
import useScssVar from '@/hooks/useScssVar'
import _ from 'lodash'
import { AppointmentReservationType } from '../DoctorsSections/CheckOut/PaymentSuccess'
import { DoctorProfileType } from '../SearchDoctorSections/SearchDoctorSection'
import BeatLoader from 'react-spinners/BeatLoader'
import { useTheme } from '@mui/material/styles';


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
}
export interface DoctorPatientProfileTypes {
  doctorPatientProfile: PatientProfileExtendType
}
const DoctorPatientProfile: FC = (() => {
  const searchParams = useSearchParams();
  const homeSideBarOpen = useSelector((state: AppState) => state.homeSideBarOpen.value)

  const { bounce, muiVar } = useScssVar();
  const router = useRouter()
  const encryptID = router.query._id;
  const [profile, setProfile] = useState<PatientProfileExtendType>();
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const [reload, setReload] = useState<boolean>(false)
  const [dataGridFilters, setDataGridFilters] = useState<DoctorPatientInitialLimitsAndSkipsTypes>(doctorPatientInitialLimitsAndSkips);

  const theme = useTheme();

  useEffect(() => {
    let active = true;
    if (encryptID) {
      if (base64regex.test(encryptID as string)) {
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
              setProfile(user)

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


  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsClient(true), 20);
    return () => {
      setIsClient(false)
    }
  }, [])

  return (
    <Fragment>
      <div
        className={`content ${homeSideBarOpen ? 'content-padding-open' : 'content-padding-close'}`}
        style={muiVar}>

        {
          profile == null ?
            <BeatLoader color={theme.palette.primary.main} style={{
              display: 'flex',
              justifyContent: 'center',
            }} /> :
            <>
              <div className="container-fluid">
                <div className="row">
                  <PatientSidebarDoctorDashboard doctorPatientProfile={profile} />

                  <div className={`col-md-12 col-lg-12 col-xl-12 dct-appoinment ${isClient ? 'animate__animated animate__backInUp' : 'pre-anim-hidden'}`} >
                    {
                      profile && isClient && <PatientProfileTabs doctorPatientProfile={profile} userType='doctor' />
                    }
                  </div>

                </div>
              </div>
            </>}
      </div>
    </Fragment>
  )
})

export default DoctorPatientProfile;