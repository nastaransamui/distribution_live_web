import { FC, Fragment, useEffect, useState } from 'react'
import PageContent from '@/components/DoctorsSections/Profile/PageContent';
import PageTabs from '@/components/DoctorsSections/Profile/PageTabs';
import { useSearchParams, useParams } from 'next/navigation'
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { toast } from 'react-toastify';
import useScssVar from '@/hooks/useScssVar';
import { DoctorProfileType } from '@/components/SearchDoctorSections/SearchDoctorSection';


export const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;


const ProfilePage: FC = (() => {
  const searchParams = useSearchParams();
  const { bounce } = useScssVar();
  const encryptID = searchParams.get('_id')
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
      <div className="content">
        <div className="container">
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
                  <PageContent profile={profile} />
                  <PageTabs profile={profile} />
                </>
            }
          </Fragment>

        </div>
      </div>
    </Fragment>
  )
})


export default ProfilePage;