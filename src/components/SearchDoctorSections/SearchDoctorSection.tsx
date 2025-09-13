
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
  dob: string | Date;
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
  rate_array: number[];
  reviews_array: string[];
  recommendArray: number[];
  isVerified: boolean | 'google';
  online: boolean;
  idle?: boolean;
  fullName?: string;
  lastLogin?: {
    date: Date;
    ipAddr: string;
    userAgent: string;
    idle?: boolean;
  };

}
type NullableString = string | null;

// filters shape (matches your useState initializer)
export type Filters = {
  specialities: NullableString;
  keyWord: NullableString;
  gender: NullableString;
  available: NullableString;
  country: NullableString;
  state: NullableString;
  city: NullableString;
}

// the setter you pass down
export type SetFilters = React.Dispatch<React.SetStateAction<Filters>>;

// if you want to pass setPage explicitly typed
export type SetPage = React.Dispatch<React.SetStateAction<number>>;



const SearchDoctorSection: FC = (() => {
  const { muiVar, bounce } = useScssVar();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [reload, setReload] = useState<boolean>(false)
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const searchParams = useSearchParams();

  // Local filters state (initialised from URL once)
  const [filters, setFilters] = useState<Filters>(() => ({
    specialities: searchParams.get('specialities'),
    keyWord: searchParams.get('keyWord'),
    gender: searchParams.get('gender'),
    available: searchParams.get('available'),
    country: searchParams.get('country'),
    state: searchParams.get('state'),
    city: searchParams.get('city'),
  }));
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const [doctorResults, setDoctorResults] = useState<DoctorProfileType[] | []>([])
  const [totalDoctors, setTotalDoctors] = useState<number>(0)
  // const [sortBy, setSortBy] = useState('profile.userName');
  const [sortModel, setSortModel] = useState<any>([
    {
      field: 'profile.userName',
      sort: 'asc',
    },
  ]);
  const componentRef = useRef<any>()
  const fetch = useMemo(() => (
    throttle((
      keyWord: string,
      specialities: string,
      gender: string,
      available: string,
      country: string,
      state: string,
      city: string,
      sortModel: { field: string; sort: "asc" | "desc" | null }[],
      homeSocket: any,
      reload: boolean,
      page: number,
      perPage: number,
    ) => {
      let limit = perPage * page;
      let skip = (page - 1) * perPage
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
        sortModel
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
        }
      })
    }, 1000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [])


  useEffect(() => {


    let active = true;
    if (active && homeSocket?.current) {
      fetch(
        filters.keyWord,
        filters.specialities,
        filters.gender,
        filters.available,
        filters.country,
        filters.state,
        filters.city,
        sortModel,
        homeSocket,
        reload,
        page,
        perPage
      )
    }
    return () => {
      active = false;
    }
  }, [filters, homeSocket, reload, page, sortModel, perPage, fetch])

  useEffect(() => {
    if (!homeSocket?.current) return;
    const socket = homeSocket.current;
    socket.on(`updateDoctorSearch`, (msg: any) => {
      setReload(!reload)
    })
    return () => {
      socket.off('updateDoctorSearch')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeSocket])

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncFiltersFromUrl = () => {
      const sp = new URLSearchParams(window.location.search);
      const next = {
        specialities: sp.get('specialities'),
        keyWord: sp.get('keyWord'),
        gender: sp.get('gender'),
        available: sp.get('available'),
        country: sp.get('country'),
        state: sp.get('state'),
        city: sp.get('city'),
      };
      // only update if actually different (avoid useless setFilters)
      setFilters(prev => {
        if (shallowEqualFilters(prev, next)) return prev;
        return { ...prev, ...next };
      });
    };

    // DO NOT call syncFiltersFromUrl() immediately — initial state already read from URL.
    // only listen for popstate events (back/forward)
    window.addEventListener('popstate', syncFiltersFromUrl);
    return () => window.removeEventListener('popstate', syncFiltersFromUrl);
  }, [setFilters]);
  return (
    <Fragment>
      <div className="doctor-content content" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-xl-12 col-lg-12 map-view">
              <div className="row">
                <div className="col-lg-3  theiaStickySidebar  ">
                  <StickyBox offsetTop={100} offsetBottom={20}>
                    <SearchFilter setPage={setPage} filters={filters} setFilters={setFilters} />
                  </StickyBox>
                </div>
                <div className="col-lg-9" ref={componentRef}>
                  <div className='card   ' style={{ padding: '30px 10px' }}>
                    <DoctorSearchResults
                      doctorResults={doctorResults}
                      totalDoctors={totalDoctors}
                      page={page}
                      setPage={setPage}
                      perPage={perPage}
                      setPerPage={setPerPage}
                      sortModel={sortModel}
                      setSortModel={setSortModel}
                      isLoading={isLoading}
                      filters={filters}
                    />
                  </div>
                  <ScrollToTop />
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

export const shallowEqualFilters = (a: Record<string, any>, b: Record<string, any>) => {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  for (let k of aKeys) {
    if (a[k] !== b[k]) return false;
  }
  return true;
}