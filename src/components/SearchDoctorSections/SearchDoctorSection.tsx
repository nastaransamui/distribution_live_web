
import { FC, Fragment, useEffect, useMemo, useRef, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import SearchFilter from './SearchFilter'
import StickyBox from 'react-sticky-box'
import DoctorSearchResults from './DoctorSearchResults';
import { useSearchParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { toast } from 'react-toastify';
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';
import throttle from 'lodash/throttle';
import ScrollToTop from '@/components/sections/ScrollToTop';
import { DoctorsTimeSlotType } from '../DoctorDashboardSections/ScheduleTiming';
import { CurrenciesType } from '../shared/CurrencyAutocomplete';

export interface ClinicImagesType {
  src: string;
  width: number;
  height: number;
  isSelected: boolean;
  name: string;
  _id: string;
}

export interface EducationType {
  collage: string;
  degree: string;
  yearOfCompletion: string;
}

export interface ExperienceType {
  designation: string;
  from: string;
  hospitalName: string;
  to: string;
}

export interface AwardType {
  award: string;
  year: string;
}

export interface RegistrationsType {
  registration: string;
  year: string;
}

export interface MembershipsType {
  membership: string;
}


export interface SpecialitiesType {
  _id: string;
  specialities: string;
  description: string;
  image: string;
  imageId: string;
  createdAt: Date;
  updatedAt: Date;
  users_id: string[];
}

export interface DoctorProfileType {
  _id: string;
  createdAt: Date;
  lastUpdate: Date;
  userName: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  gender: string;
  dob: string;
  aboutMe: string;
  clinicName: string;
  clinicAddress: string;
  clinicImages: ClinicImagesType[];
  profileImage: string;
  roleName: 'doctors' | 'patient' | 'pharmacist';
  services: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  specialitiesServices: string[];
  specialities: SpecialitiesType[];
  currency: CurrenciesType[];
  bookingsFee: string;
  educations: EducationType[];
  experinces: ExperienceType[];
  awards: AwardType[];
  memberships: MembershipsType[];
  socialMedia: string[];
  registrations: RegistrationsType[];
  accessToken: string;
  isActive: boolean;
  timeSlotId?: string;
  timeslots: DoctorsTimeSlotType[];
  patients_id: string[];
  favs_id: string[];
  reservations_id: string[];
  prescriptions_id: string[];
  isVerified: boolean | 'google';
  online: boolean;
  idle?: boolean;
  lastLogin?: {
    date: Date;
    ipAddr: string;
    userAgent: string;
  };

}



const SearchDoctorSection: FC = (() => {
  const { muiVar, bounce } = useScssVar();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [reload, setReload] = useState<boolean>(false)
  const searchParams = useSearchParams()
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const specialities = searchParams.get('specialities')
  const keyWord = searchParams.get('keyWord')
  const gender = searchParams.get('gender')
  const available = searchParams.get('available')
  const country = searchParams.get('country')
  const state = searchParams.get('state')
  const city = searchParams.get('city')
  const [limit, setLimit] = useState<number>(15)
  const [skip, setSkip] = useState<number>(0)

  const [doctorResults, setDoctorResults] = useState<DoctorProfileType[] | []>([])
  const [totalDoctors, setTotalDoctors] = useState<number>(0)
  const [sortBy, setSortBy] = useState('profile.userName');
  const componentRef = useRef<any>()
  const { width, height } = useContainerDimensions(componentRef)
  const fetch = useMemo(() => (
    throttle((
      keyWord: string,
      specialities: string,
      gender: string,
      available: string,
      country: string,
      state: string,
      city: string,
      limit: number,
      skip: number,
      sortBy: string, homeSocket: any, reload: boolean) => {
      homeSocket.current.emit(`doctorSearch`, {
        keyWord,
        specialities,
        gender,
        available,
        country,
        state,
        city,
        limit,
        skip,
        sortBy
      })
      homeSocket.current.once(`doctorSearchReturn`, (msg: { status: number, message?: string, doctors?: any[], total: number }) => {
        const { status, doctors, message, total } = msg;
        dispatch(updateHomeFormSubmit(true))
        if (status !== 200) {
          toast.error(message, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: bounce,
            onClose: () => {
              dispatch(updateHomeFormSubmit(false))
              setIsLoading(false)
            }
          });
        } else {
          homeSocket.current.on(`updateDoctorSearch`, (msg: any) => {
            setReload(!reload)
          })
          setDoctorResults((prevState) => {
            if (doctors) {
              prevState = [...doctors]
            } else {
              prevState = [...prevState]
            }
            return doctors || prevState
          })
          setTotalDoctors(total || 0)
          dispatch(updateHomeFormSubmit(false))
          setIsLoading(false)
          // if (doctors) {
          //   if (doctors.length < total) {
          //     setHasMore(true)
          //   } else {
          //     setHasMore(false)
          //   }
          // } else {
          //   setHasMore(false)
          // }
        }
      })
    }, 1000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [])


  useEffect(() => {


    let active = true;
    if (active && homeSocket?.current) {
      fetch(keyWord,
        specialities,
        gender,
        available,
        country,
        state,
        city,
        limit,
        skip,
        sortBy, homeSocket, reload)
    }
    return () => {
      active = false;
    }
  }, [city, country, gender, available, homeSocket, keyWord, specialities, state, reload, limit, skip, sortBy,
    // isLoading,
    fetch])

  return (
    <Fragment>
      <div className="doctor-content content" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-xl-12 col-lg-12 map-view">
              <div className="row">
                <div className="col-lg-3  theiaStickySidebar">
                  <StickyBox offsetTop={100} offsetBottom={20}>
                    <SearchFilter setSkip={setSkip} />
                  </StickyBox>
                </div>
                <div className="col-lg-9" ref={componentRef}>
                  <DoctorSearchResults
                    doctorResults={doctorResults}
                    totalDoctors={totalDoctors}
                    limit={limit}
                    skip={skip}
                    setLimit={setLimit}
                    parentHeight={height}
                    parentWidth={width}
                    setSortBy={setSortBy}
                    sortBy={sortBy}
                    isLoading={isLoading}
                    setSkip={setSkip}
                  />
                  <ScrollToTop setLimit={setLimit} setSkip={setSkip} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
})

export default SearchDoctorSection;

export const useContainerDimensions = (myRef: any) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const getDimensions = () => ({
      width: myRef.current.offsetWidth,
      height: myRef.current.offsetHeight
    })

    const handleResize = () => {
      setDimensions(getDimensions())
    }

    if (myRef.current) {
      setDimensions(getDimensions())
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [myRef])

  return dimensions;
};