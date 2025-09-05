/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useState, useEffect } from 'react'
import useScssVar from '@/hooks/useScssVar'

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { base64regex } from '@/components/DoctorsSections/Profile/PublicProfilePage';
import { toast } from 'react-toastify';
import Summary from './Summary';
import Calendar, { OccupyTimeType } from './Calendar';
import { AvailableType, LoadingComponent } from '@/components/DoctorDashboardSections/ScheduleTiming';
import { SpecialitiesType } from '@/redux/specialities';
import { CurrenciesType } from '@/components/shared/CurrencyAutocomplete';
import BeatLoader from 'react-spinners/BeatLoader';
import { useTheme } from '@mui/material/styles';


export interface BookingDoctorProfile {
  address1: string;
  address2: string;
  city: string;
  idle?: boolean;
  lastLogin: {
    date: Date;
    ipAddr: string;
    userAgent: string;
    idle?: boolean;
  },
  country: string;
  fullName: string;
  online: boolean;
  profileImage: string;
  rate_array: number[];
  recommendArray: number[];
  specialities: SpecialitiesType[];
  currency: CurrenciesType[]
  state: string;
  _id: string;
}
export interface BookingTimeSlotType {
  availableSlots: AvailableType[];
  createDate: Date;
  doctorId: string;
  doctorProfile: BookingDoctorProfile;
  occupyTime: OccupyTimeType[];
  updateDate: Date;
  _id?: string;
  patientId: string;
  expireAt: Date;
}




const BookingPage: FC = (() => {
  const searchParams = useSearchParams();
  const encryptID = searchParams.get('_id')
  const { bounce, muiVar } = useScssVar();
  const router = useRouter()
  const theme = useTheme();
  const [profile, setProfile] = useState<BookingDoctorProfile>();
  const [bookingTimeSlot, setBookingTimeSlot] = useState<BookingTimeSlotType>();
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const [reload, setReload] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    let active = true;
    if (encryptID) {
      if (base64regex.test(encryptID)) {
        let _id = atob(encryptID as string)
        if (active && homeSocket?.current) {
          homeSocket.current.emit(`getBookingPageInformation`, { doctorId: _id })
          homeSocket.current.once(`getBookingPageInformationReturn`, (msg: {
            status: number,
            bookingInformation: BookingTimeSlotType[],
            reason?: string
          }) => {
            const { status, reason } = msg;
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
                toastId: "booking-toast",
                onClose: () => {
                  router.back();
                  toast.dismiss('booking-toast')
                }
              });
            } else {
              const { bookingInformation } = msg;
              if (bookingInformation.length > 0) {

                const { doctorProfile } = bookingInformation[0]
                setProfile(doctorProfile);
                setBookingTimeSlot(bookingInformation[0])
              }
            }
            setIsLoading(false);
            homeSocket.current.once(`updateGetBookingPageInformation`, () => {
              setReload(!reload)
            })
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
  }, [encryptID, homeSocket, router, reload])

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsClient(true), 0);
    return () => {
      setIsClient(false)
    }
  }, [])
  return (
    <Fragment>

      {
        isLoading ?
          <BeatLoader color={theme.palette.primary.main} style={{
            minWidth: '100%',
            display: 'flex',
            justifyContent: 'center',
            minHeight: '30vh'
          }} />
          :
          <>
            {profile && <Summary profile={profile} />}
          </>
      }

      {
        isLoading ?
          <BeatLoader color={theme.palette.primary.main} style={{
            minWidth: '100%',
            display: 'flex',
            justifyContent: 'center',
          }} />
          :
          <>
            {bookingTimeSlot &&
              <>
                {bookingTimeSlot?.availableSlots.length > 0 ?
                  <Calendar bookingTimeSlot={bookingTimeSlot} /> :
                  <div className={`col-lg-12 col-md-12 ${isClient ? 'animate__animated animate__backInUp' : 'pre-anim-hidden'}`} style={muiVar}>
                    <div className="card booking-card" >
                      <div className="card-body time-slot-card-body">
                        <p>Not Available</p>
                      </div>
                    </div>
                  </div>
                }
              </>
            }
          </>
      }
    </Fragment >
  )
})

export default BookingPage