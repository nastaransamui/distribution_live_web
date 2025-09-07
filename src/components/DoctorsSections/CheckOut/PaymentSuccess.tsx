/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import dayjs from 'dayjs'
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { formatNumberWithCommas, TimeType } from '@/components/DoctorDashboardSections/ScheduleTiming';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

import { useTheme } from '@mui/material/styles';
import BeatLoader from 'react-spinners/BeatLoader';
import { base64regex } from '../Profile/PublicProfilePage';
import { DoctorProfileType } from '@/components/SearchDoctorSections/SearchDoctorSection';
import { PatientProfile } from '@/components/DoctorDashboardSections/MyPtients';
import { doctor_17, doctors_profile } from '@/public/assets/imagepath';
import { AppImgSvg, DeviceMessageSvg, GoogleImgSvg, SmartPhoneSvg } from '@/public/assets/images/icons/IconsSvgs';

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

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsClient(true), 20);
    return () => {
      setIsClient(false)
    }
  }, [])
  console.log({ reservation })

  return (
    <Fragment>
      <div className="content success-page-cont" style={{ ...muiVar, }}>
        {
          reservation == null ?
            <BeatLoader color={theme.palette.primary.main} style={{
              minWidth: '100%',
              display: 'flex',
              justifyContent: 'center',
            }} />
            :
            <div className={`container-fluid ${isClient ? 'animate__animated animate__backInUp' : 'pre-anim-hidden'}`} style={{ marginTop: '10vh' }}>

              <div className="row justify-content-center">
                <div className="col-lg-6">
                  <div className="card success-card">
                    <div className="card-body">
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

                    </div>
                  </div>
                </div>
              </div>
              <div className="row justify-content-center">
                <div className="col-lg-6">
                  <div className="booking-header">
                    <h4 className="booking-title">Booking Summary</h4>
                  </div>
                </div>
              </div>
              <div className="row justify-content-center">
                <div className="col-lg-6">
                  <div className="card booking-card">
                    <div className="card-body booking-card-body">
                      <div className="booking-doctor-details">
                        <div className="booking-doctor-left">
                          <div className="booking-doctor-img">
                            <Link href={`/doctors/profile/${btoa(reservation?.doctorId)}`}>
                              <img src={reservation?.doctorProfile?.profileImage !== '' ? reservation?.doctorProfile?.profileImage : doctors_profile} alt="" />
                            </Link>
                          </div>
                          <div className="booking-doctor-info">
                            <h4><Link href={`/doctors/profile/${btoa(reservation?.doctorId)}`}>Dr. {reservation?.doctorProfile?.firstName} {reservation?.doctorProfile?.lastName}</Link></h4>
                            <p>{reservation?.doctorProfile?.specialities[0]?.specialities}</p>
                          </div>

                        </div>
                        <div className="booking-doctor-right">
                          <p>
                            <i className="fas fa-check-circle" />

                          </p>
                        </div>
                      </div>
                      <div style={{ marginTop: 10 }}>
                        <small>{reservation?.doctorProfile?.specialities[0]?.description}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row justify-content-center">
                <div className="col-lg-6">
                  <div className="card booking-card">
                    <div className="card-body booking-card-body">
                      <div className="booking-doctor-details">
                        <div className="booking-device">
                          <div className="booking-device-img">
                            <DeviceMessageSvg />
                          </div>
                          <div className="booking-doctor-info">
                            <h3>We can help you</h3>
                            <p className="device-text">Call us (or) email to our customer support team.</p>
                            <Link
                              href={`mailto:mjcode2020@gmail.com?subject="Support Request"`}
                              className="btn"
                            >Email Us</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row justify-content-center">
                <div className="col-lg-6">
                  <div className="card booking-card mb-0">
                    <div className="card-body booking-card-body">
                      <div className="booking-doctor-details">
                        <div className="booking-device">
                          <div className="booking-device-img">
                            <SmartPhoneSvg />
                          </div>
                          <div className="booking-doctor-info">
                            <h3>Get the App</h3>
                            <p className="device-text">Download our app for better experience and for more feature</p>
                            <div className="app-images">
                              <Link href="https://play.google.com/store/apps/details?id=com.healthCareApp&pli=1" target='_blank'  >
                                <GoogleImgSvg />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        }
      </div>
    </Fragment>
  )
});

export default PaymentSuccess