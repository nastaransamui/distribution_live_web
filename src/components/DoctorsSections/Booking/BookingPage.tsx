/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useState, useEffect } from 'react'
import useScssVar from '@/hooks/useScssVar'

import { useRouter, useSearchParams } from 'next/navigation';

import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { DoctorProfileType } from '@/components/SearchDoctorSections/SearchDoctorSection';
import { base64regex } from '@/components/DoctorsSections/Profile/ProfilePage';
import { toast } from 'react-toastify';
import Summary from './Summary';
import Calendar from './Calendar';
import { useTheme } from '@mui/material/styles';

import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';



const BookingPage: FC = (() => {
  const searchParams = useSearchParams();
  const encryptID = searchParams.get('_id')
  const { bounce, muiVar } = useScssVar();
  const router = useRouter()
  const theme = useTheme();
  const [profile, setProfile] = useState<DoctorProfileType | null>(null);
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const [reload, setReload] = useState<boolean>(false)

  useEffect(() => {
    let active = true;
    if (encryptID) {
      if (base64regex.test(encryptID)) {
        let _id = atob(encryptID as string)
        if (active && homeSocket?.current) {
          homeSocket.current.emit(`findUserById`, { _id })
          homeSocket.current.once(`findUserByIdReturn`, (msg: { status: number, user: DoctorProfileType, reason?: string }) => {
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
              homeSocket.current.once(`updateFindUserById`, () => {
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
  }, [encryptID, homeSocket, router, reload])

  return (
    <Fragment>
      {
        profile == null ?
          <CircleToBlockLoading color={theme.palette.primary.main} size="small" style={{
            minWidth: '100%',
            display: 'flex',
            justifyContent: 'center',
          }} />
          :
          <>
            <Summary profile={profile} />
            {
              profile.timeslots.length > 0 ?
                <Calendar profile={profile} /> :
                <div className="col-lg-12 col-md-12" style={muiVar}>
                  <div className="card booking-card" >
                    <div className="card-body time-slot-card-body">
                      <p>Not Available</p>
                    </div>
                  </div>
                </div>
            }
          </>
      }
    </Fragment>
  )
})


export default BookingPage