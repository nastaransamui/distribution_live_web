import { FC, Fragment, useEffect, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import dayjs from 'dayjs'
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { formatNumberWithCommas, TimeType } from '@/components/DoctorDashboardSections/ScheduleTiming';
import { toast } from 'react-toastify';


import { useTheme } from '@mui/material/styles';

import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
import { base64regex } from '../Profile/PublicProfilePage';
import { DoctorProfileType } from '@/components/SearchDoctorSections/SearchDoctorSection';
import { PatientProfile } from '@/components/DoctorDashboardSections/MyPtients';

export interface AppointmentReservationType {
  _id?: string;
  id: number;
  timeSlot: TimeType;
  selectedDate: string;
  dayPeriod: string;
  doctorId: string;
  startDate: string;
  finishDate: string;
  slotId: string;
  patientId: string;
  paymentToken: string;
  paymentType: string;
  invoiceId: string;
  doctorPaymentStatus: "Pending" | "Paid" | "Awaiting Request";
  paymentDate: Date | string;
  createdDate: string;
}

export interface AppointmentReservationExtendType extends AppointmentReservationType {
  doctorProfile: DoctorProfileType;
  patientProfile: PatientProfile;
}

const PaymentSuccess: FC = (() => {
  const { muiVar, bounce } = useScssVar();
  const router = useRouter()
  const theme = useTheme();
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const [reload, setReload] = useState<boolean>(false)
  const [reservation, setReservation] = useState<AppointmentReservationExtendType | null>(null)


  const searchParams = useSearchParams();
  const encryptID = searchParams.get('_id')

  useEffect(() => {
    let active = true;
    if (encryptID) {
      if (base64regex.test(encryptID)) {
        let _id = atob(encryptID as string)
        if (active && homeSocket?.current) {
          homeSocket.current.emit(`findReservationById`, { _id })
          homeSocket.current.once(`findReservationByIdReturn`, (msg: { status: number, reservation: AppointmentReservationExtendType, reason?: string }) => {
            const { status, reservation, reason } = msg;
            if (status !== 200) {
              toast.error(reason || `Error ${status} find reservation`, {
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
              homeSocket.current.once(`updateReservationById`, () => {
                setReload(!reload)
              })
              setReservation(reservation)
            }
          })
        }
      }
    }
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encryptID, homeSocket, reload, router])
  return (
    <Fragment>
      <div className="content success-page-cont" style={muiVar}>
        <div className="container-fluid" style={{ marginTop: '10vh' }}>
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="card success-card">
                <div className="card-body">
                  {
                    reservation == null ?
                      <CircleToBlockLoading color={theme.palette.primary.main} size="small" style={{
                        minWidth: '90%',
                        display: 'flex',
                        justifyContent: 'center',
                      }} />
                      :
                      <div className="success-cont">
                        <i className="fas fa-check" />
                        <h3>Appointment booked Successfully!</h3>
                        <p>Appointment booked with &nbsp;
                          <strong>Dr. {reservation?.doctorProfile?.firstName} {reservation?.doctorProfile?.lastName}</strong>
                          <br /> on&nbsp;
                          <strong>{dayjs(reservation?.selectedDate).format('DD MMM YYYY')}&nbsp; {reservation?.timeSlot?.period}</strong>
                          <br />with&nbsp;
                          <strong>{formatNumberWithCommas(reservation?.timeSlot?.total.toString())}&nbsp; {reservation?.timeSlot?.currencySymbol || 'THB'}</strong>

                        </p>
                        <Link href={`/doctors/invoice-view/${btoa(reservation?._id!)}`} className="btn btn-primary view-inv-btn">View Invoice</Link>
                      </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
});

export default PaymentSuccess