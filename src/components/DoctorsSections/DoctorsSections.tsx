/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useMemo, useRef, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import {
  Doc01, Doc02, Doc03, Doc04, Doc05, Doc06, Doc07, Doc08, Doc09, Doc10, Doc11, Doc12,
  featureImg1,
  featureImg2,
  featureImg3,
  featureImg4
} from '../../../public/assets/imagepath';
import { FiCalendar, FiClock, FiDollarSign, FiInfo, FiThumbsUp } from 'react-icons/fi';
import dayjs from 'dayjs';
import MapContainer from '@/shared/MapContainer';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

import Lightbox from "yet-another-react-lightbox";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import { AppState } from '@/redux/store';
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';
import { toast } from 'react-toastify';
import { DoctorProfileType, useContainerDimensions } from '../SearchDoctorSections/SearchDoctorSection';
import throttle from 'lodash/throttle';
import Grid from '@mui/material/Grid';
const data = [{
  id: 1,
  doc_name: "Ruby Perrin",
  "speciality": "Digital Marketer",
  "address": "Florida, USA",
  "next_available": "Available on Fri, 22 Mar",
  "amount": "$300 - $1000",
  lat: -33.847927,
  lng: 150.6517938,
  "icons": "default",
  "profile_link": "/doctors/search",
  "total_review": "17",
  "image": Doc01
},
{

  id: 2,
  doc_name: "Darren Elder",
  "speciality": "Digital Marketer",
  "address": "Newyork, USA",
  "next_available": "Available on Fri, 23 Mar",
  "amount": "$50 - $300",
  lat: -37.9722342,
  lng: 144.7729561,
  "icons": "default",
  "profile_link": "/doctors/search",
  "total_review": "35",
  "image": Doc02
}, {
  id: 3,
  doc_name: "Deborah Angel",
  "speciality": "UNIX, Calculus, Trigonometry",
  "address": "Georgia, USA",
  "next_available": "Available on Fri, 24 Mar",
  "amount": "$100 - $400",
  lat: -31.9546904,
  lng: 112.8350292,
  "icons": "default",
  "profile_link": "/doctors/search",
  "total_review": "27",
  "image": Doc03
}, {
  id: 4,
  doc_name: "Sofia Brient",
  "speciality": "Computer Programming",
  "address": "Louisiana, USA",
  "next_available": "Available on Fri, 25 Mar",
  "amount": "$150 - $250",
  lat: -32.9546904,
  lng: 115.8350292,
  "icons": "default",
  "profile_link": "/doctors/search",
  "total_review": "4",
  "image": Doc04
}, {
  id: 5,
  doc_name: "Marvin Campbell",
  "speciality": "ASP.NET,Computer Gaming",
  "address": "Michigan, USA",
  "next_available": "Available on Fri, 25 Mar",
  "amount": "$50 - $700",
  lat: -34.9546904,
  lng: 125.8650292,
  "icons": "default",
  "profile_link": "/doctors/search",
  "total_review": "66",
  "image": Doc05
}, {
  id: 6,
  doc_name: "Katharine Berthold",
  "speciality": "Digital Marketer",
  "address": "Texas, USA",
  "next_available": "Available on Fri, 25 Mar",
  "amount": "$100 - $500",
  lat: -35.9546904,
  lng: 153.8350292,
  "icons": "default",
  "profile_link": "/doctors/search",
  "total_review": "52",
  "image": Doc06
}, {
  id: 7,
  doc_name: "Linda Tobin",
  "speciality": "UNIX, Calculus, Trigonometry",
  "address": "Kansas, USA",
  "next_available": "Available on Fri, 25 Mar",
  "amount": "$100 - $1000",
  lat: -36.9548904,
  lng: 105.8350292,
  "icons": "default",
  "profile_link": "/doctors/search",
  "total_review": "43",
  "image": Doc07
}, {
  id: 8,
  doc_name: "Paul Richard",
  "speciality": "Computer Programming",
  "address": "California, USA",
  "next_available": "Available on Fri, 25 Mar",
  "amount": "$100 - $400",
  lat: -38.9556904,
  lng: 110.8350292,
  "icons": "default",
  "profile_link": "/doctors/search",
  "total_review": "49",
  "image": Doc08
}, {
  id: 9,
  doc_name: "John Gibbs",
  "speciality": "ASP.NET,Computer Gaming",
  "address": "Oklahoma, USA",
  "next_available": "Available on Fri, 25 Mar",
  "amount": "$500 - $2500",
  lat: -33.2191198,
  lng: 120.8350292,
  "icons": "default",
  "profile_link": "/doctors/search",
  "total_review": "112",
  "image": Doc09
}, {
  id: 10,
  doc_name: "Olga Barlow",
  "speciality": "Periodontology and Oral",
  "address": "Montana, USA",
  "next_available": "Available on Fri, 25 Mar",
  "amount": "$75 - $250",
  lat: -37.1382198,
  lng: 115.9359404,
  "icons": "default",
  "profile_link": "/doctors/search",
  "total_review": "65",
  "image": Doc10
}, {
  id: 11,
  doc_name: "Julia Washington",
  "speciality": "Endocrinology",
  "address": "Oklahoma, USA",
  "next_available": "Available on Fri, 25 Mar",
  "amount": "$275 - $450",
  lat: -31.1546904,
  lng: 145.8350292,
  "icons": "default",
  "profile_link": "/doctors/search",
  "total_review": "5",
  "image": Doc11
}, {
  id: 12,
  doc_name: "Shaun Aponte",
  "speciality": "Diploma in (DLO)",
  "address": "Indiana, USA",
  "next_available": "Available on Fri, 25 Mar",
  "amount": "$150 - $350",
  lat: -35.1586194,
  lng: 155.8350292,
  "icons": "default",
  "profile_link": "/doctors/search",
  "total_review": "5",
  "image": Doc12
}
];
const DoctorsSections: FC = (() => {

  const matches = useMediaQuery('(max-width:991px)');
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
  const [dispalyType, setDispalyType] = useState<'list' | 'grid'>('list')
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
  useEffect(() => {
    if (matches) {
      setDispalyType('grid')
    }
  }, [matches])

  useEffect(() => {
    document.body.classList.add("map-page");

    return () => document.body.classList.remove("map-page");
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as string);
  };
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const Images = useMemo(() => {
    return [
      {
        src: featureImg1,
        alt: 'featureImg1',
      }, {
        src: featureImg2,
        alt: 'featureImg2',
      }, {
        src: featureImg3,
        alt: 'featureImg3',
      }, {
        src: featureImg4,
        alt: 'featureImg4',
      },
    ]
  }, [])


  return (
    <Fragment>
      <div className="content top-space" style={muiVar} ref={componentRef}>
        {dispalyType == 'grid' ?
          <div className="container-fluid">

            <div className="row">
              <div className="col-xl-6 col-lg-12 order-md-last order-sm-last order-last map-left">

                <div className="row align-items-center mb-4">
                  <div className="col-md-6 col">
                    <h4>2245 Doctors found</h4>
                  </div>

                  <div className="col-md-6 col-auto" >
                    {!matches && <div className="view-icons ">
                      <Link href="" onClick={() => setDispalyType(() => 'grid')} className={`grid-view ${dispalyType == 'grid' ? 'active' : ''}`}><i className="fas fa-th-large"></i></Link>
                      <Link href="" onClick={() => setDispalyType(() => 'list')} className={
                        `list-view ${dispalyType !== 'grid' ? 'active' : ''}`
                      }><i className="fas fa-bars"></i></Link>
                    </div>}
                    <div className="sort-by d-sm-block">
                      <span className="sortby-fliter">
                        <FormControl fullWidth>
                          <InputLabel size='small' id="demo-simple-select-label">Sort</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={sortBy}
                            label="Sort"
                            onChange={handleChange}
                            fullWidth
                            size='small'
                          >
                            <MenuItem value="profile.userName">User Name</MenuItem>
                            <MenuItem value="createdAt">Join Date</MenuItem>
                          </Select>
                        </FormControl>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-12 col-md-12 col-lg-6  col-xl-6">
                    <div className="profile-widget">
                      <div className="doc-img">
                        <Link href="/doctors/search">
                          <img className="img-fluid" alt="User " src={Doc01} />
                        </Link>
                        <Link href="#0" className="fav-btn">
                          <i className="far fa-bookmark"></i>
                        </Link>
                      </div>
                      <div className="pro-content">
                        <h3 className="title">
                          <Link href="/doctors/search">Dr. Ruby Perrin</Link>
                          <i className="fas fa-check-circle verified"></i>
                        </h3>
                        <p className="speciality">MDS - Periodontology and Oral Implantology, BDS</p>
                        <div className="rating">
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <span className="d-inline-block average-rating">(17)</span>
                        </div>
                        <ul className="available-info">
                          <li>
                            <i className="fas fa-map-marker-alt"></i> Florida, USA
                          </li>
                          <li>
                            <i className="far fa-clock"></i> Available on Fri, 22 Mar
                          </li>
                          <li>
                            <i className="far fa-money-bill-alt"></i> $300 - $1000 <i className="fas fa-info-circle" data-bs-toggle="tooltip" title="Lorem Ipsum"></i>
                          </li>
                        </ul>
                        <div className="row row-sm">
                          <div className="col-6">
                            <Link href="/doctors/search" className="btn view-btn">View Profile</Link>
                          </div>
                          <div className="col-6">
                            <Link href="/doctors/search" className="btn book-btn">Book Now</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-12 col-lg-6  col-xl-6">
                    <div className="profile-widget">
                      <div className="doc-img">
                        <Link href="/doctors/search">
                          <img className="img-fluid" alt="User " src={Doc02} />
                        </Link>
                        <Link href="#0" className="fav-btn">
                          <i className="far fa-bookmark"></i>
                        </Link>
                      </div>
                      <div className="pro-content">
                        <h3 className="title">
                          <Link href="/doctors/search">Dr. Darren Elder</Link>
                          <i className="fas fa-check-circle verified"></i>
                        </h3>
                        <p className="speciality">BDS, MDS - Oral & Maxillofacial Surgery</p>
                        <div className="rating">
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star"></i>
                          <span className="d-inline-block average-rating">(35)</span>
                        </div>
                        <ul className="available-info">
                          <li>
                            <i className="fas fa-map-marker-alt"></i> Newyork, USA
                          </li>
                          <li>
                            <i className="far fa-clock"></i> Available on Fri, 22 Mar
                          </li>
                          <li>
                            <i className="far fa-money-bill-alt"></i> $50 - $300 <i className="fas fa-info-circle" data-bs-toggle="tooltip" title="Lorem Ipsum"></i>
                          </li>
                        </ul>
                        <div className="row row-sm">
                          <div className="col-6">
                            <Link href="/doctors/search" className="btn view-btn">View Profile</Link>
                          </div>
                          <div className="col-6">
                            <Link href="/doctors/search" className="btn book-btn">Book Now</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-12 col-lg-6  col-xl-6">
                    <div className="profile-widget">
                      <div className="doc-img">
                        <Link href="/doctors/search">
                          <img className="img-fluid" alt="User " src={Doc03} />
                        </Link>
                        <Link href="#0" className="fav-btn">
                          <i className="far fa-bookmark"></i>
                        </Link>
                      </div>
                      <div className="pro-content">
                        <h3 className="title">
                          <Link href="/doctors/search">Dr. Deborah Angel</Link>
                          <i className="fas fa-check-circle verified"></i>
                        </h3>
                        <p className="speciality">MBBS, MD - General Medicine, DNB - Cardiology</p>
                        <div className="rating">
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star"></i>
                          <span className="d-inline-block average-rating">(27)</span>
                        </div>
                        <ul className="available-info">
                          <li>
                            <i className="fas fa-map-marker-alt"></i> Georgia, USA
                          </li>
                          <li>
                            <i className="far fa-clock"></i> Available on Fri, 22 Mar
                          </li>
                          <li>
                            <i className="far fa-money-bill-alt"></i> $100 - $400 <i className="fas fa-info-circle" data-bs-toggle="tooltip" title="Lorem Ipsum"></i>
                          </li>
                        </ul>
                        <div className="row row-sm">
                          <div className="col-6">
                            <Link href="/doctors/search" className="btn view-btn">View Profile</Link>
                          </div>
                          <div className="col-6">
                            <Link href="/doctors/search" className="btn book-btn">Book Now</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-12 col-lg-6  col-xl-6">
                    <div className="profile-widget">
                      <div className="doc-img">
                        <Link href="/doctors/search">
                          <img className="img-fluid" alt="User " src={Doc04} />
                        </Link>
                        <Link href="#0" className="fav-btn">
                          <i className="far fa-bookmark"></i>
                        </Link>
                      </div>
                      <div className="pro-content">
                        <h3 className="title">
                          <Link href="/doctors/search">Dr. Sofia Brient</Link>
                          <i className="fas fa-check-circle verified"></i>
                        </h3>
                        <p className="speciality">MBBS, MS - General Surgery, MCh - Urology</p>
                        <div className="rating">
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star"></i>
                          <span className="d-inline-block average-rating">(4)</span>
                        </div>
                        <ul className="available-info">
                          <li>
                            <i className="fas fa-map-marker-alt"></i> Louisiana, USA
                          </li>
                          <li>
                            <i className="far fa-clock"></i> Available on Fri, 22 Mar
                          </li>
                          <li>
                            <i className="far fa-money-bill-alt"></i> $150 - $250 <i className="fas fa-info-circle" data-bs-toggle="tooltip" title="Lorem Ipsum"></i>
                          </li>
                        </ul>
                        <div className="row row-sm">
                          <div className="col-6">
                            <Link href="/doctors/search" className="btn view-btn">View Profile</Link>
                          </div>
                          <div className="col-6">
                            <Link href="/doctors/search" className="btn book-btn">Book Now</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-12 col-lg-6  col-xl-6">
                    <div className="profile-widget">
                      <div className="doc-img">
                        <Link href="/doctors/search">
                          <img className="img-fluid" alt="User " src={Doc05} />
                        </Link>
                        <Link href="#0" className="fav-btn">
                          <i className="far fa-bookmark"></i>
                        </Link>
                      </div>
                      <div className="pro-content">
                        <h3 className="title">
                          <Link href="/doctors/search">Dr. Marvin Campbell</Link>
                          <i className="fas fa-check-circle verified"></i>
                        </h3>
                        <p className="speciality">MBBS, MD - Ophthalmology, DNB - Ophthalmology</p>
                        <div className="rating">
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star"></i>
                          <span className="d-inline-block average-rating">(66)</span>
                        </div>
                        <ul className="available-info">
                          <li>
                            <i className="fas fa-map-marker-alt"></i> Michigan, USA
                          </li>
                          <li>
                            <i className="far fa-clock"></i> Available on Fri, 22 Mar
                          </li>
                          <li>
                            <i className="far fa-money-bill-alt"></i> $50 - $700
                            <i className="fas fa-info-circle" data-bs-toggle="tooltip" title="Lorem Ipsum"></i>
                          </li>
                        </ul>
                        <div className="row row-sm">
                          <div className="col-6">
                            <Link href="/doctors/search" className="btn view-btn">View Profile</Link>
                          </div>
                          <div className="col-6">
                            <Link href="/doctors/search" className="btn book-btn">Book Now</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-12 col-lg-6  col-xl-6">
                    <div className="profile-widget">
                      <div className="doc-img">
                        <Link href="/doctors/search">
                          <img className="img-fluid" alt="User " src={Doc06} />
                        </Link>
                        <Link href="#0" className="fav-btn">
                          <i className="far fa-bookmark"></i>
                        </Link>
                      </div>
                      <div className="pro-content">
                        <h3 className="title">
                          <Link href="/doctors/search">Dr. Katharine Berthold</Link>
                          <i className="fas fa-check-circle verified"></i>
                        </h3>
                        <p className="speciality">MS - Orthopaedics, MBBS, M.Ch - Orthopaedics</p>
                        <div className="rating">
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star"></i>
                          <span className="d-inline-block average-rating">(52)</span>
                        </div>
                        <ul className="available-info">
                          <li>
                            <i className="fas fa-map-marker-alt"></i> Texas, USA
                          </li>
                          <li>
                            <i className="far fa-clock"></i> Available on Fri, 22 Mar
                          </li>
                          <li>
                            <i className="far fa-money-bill-alt"></i> $100 - $500
                            <i className="fas fa-info-circle" data-bs-toggle="tooltip" title="Lorem Ipsum"></i>
                          </li>
                        </ul>
                        <div className="row row-sm">
                          <div className="col-6">
                            <Link href="/doctors/search" className="btn view-btn">View Profile</Link>
                          </div>
                          <div className="col-6">
                            <Link href="/doctors/search" className="btn book-btn">Book Now</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-12 col-lg-6  col-xl-6">
                    <div className="profile-widget">
                      <div className="doc-img">
                        <Link href="/doctors/search">
                          <img className="img-fluid" alt="User " src={Doc07} />
                        </Link>
                        <Link href="#0" className="fav-btn">
                          <i className="far fa-bookmark"></i>
                        </Link>
                      </div>
                      <div className="pro-content">
                        <h3 className="title">
                          <Link href="/doctors/search">Dr. Linda Tobin</Link>
                          <i className="fas fa-check-circle verified"></i>
                        </h3>
                        <p className="speciality">MBBS, MD - General Medicine, DM - Neurology</p>
                        <div className="rating">
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star"></i>
                          <span className="d-inline-block average-rating">(43)</span>
                        </div>
                        <ul className="available-info">
                          <li>
                            <i className="fas fa-map-marker-alt"></i> Kansas, USA
                          </li>
                          <li>
                            <i className="far fa-clock"></i> Available on Fri, 22 Mar
                          </li>
                          <li>
                            <i className="far fa-money-bill-alt"></i> $100 - $1000
                            <i className="fas fa-info-circle" data-bs-toggle="tooltip" title="Lorem Ipsum"></i>
                          </li>
                        </ul>
                        <div className="row row-sm">
                          <div className="col-6">
                            <Link href="/doctors/search" className="btn view-btn">View Profile</Link>
                          </div>
                          <div className="col-6">
                            <Link href="/doctors/search" className="btn book-btn">Book Now</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-12 col-lg-6  col-xl-6">
                    <div className="profile-widget">
                      <div className="doc-img">
                        <Link href="/doctors/search">
                          <img className="img-fluid" alt="User " src={Doc08} />
                        </Link>
                        <Link href="#0" className="fav-btn">
                          <i className="far fa-bookmark"></i>
                        </Link>
                      </div>
                      <div className="pro-content">
                        <h3 className="title">
                          <Link href="/doctors/search">Dr. Paul Richard</Link>
                          <i className="fas fa-check-circle verified"></i>
                        </h3>
                        <p className="speciality">MBBS, MD - Dermatology , Venereology & Lepros</p>
                        <div className="rating">
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star"></i>
                          <span className="d-inline-block average-rating">(49)</span>
                        </div>
                        <ul className="available-info">
                          <li>
                            <i className="fas fa-map-marker-alt"></i> California, USA
                          </li>
                          <li>
                            <i className="far fa-clock"></i> Available on Fri, 22 Mar
                          </li>
                          <li>
                            <i className="far fa-money-bill-alt"></i> $100 - $400
                            <i className="fas fa-info-circle" data-bs-toggle="tooltip" title="Lorem Ipsum"></i>
                          </li>
                        </ul>
                        <div className="row row-sm">
                          <div className="col-6">
                            <Link href="/doctors/search" className="btn view-btn">View Profile</Link>
                          </div>
                          <div className="col-6">
                            <Link href="/doctors/search" className="btn book-btn">Book Now</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-12 col-lg-6  col-xl-6">
                    <div className="profile-widget">
                      <div className="doc-img">
                        <Link href="/doctors/search">
                          <img className="img-fluid" alt="User " src={Doc09} />
                        </Link>
                        <Link href="#0" className="fav-btn">
                          <i className="far fa-bookmark"></i>
                        </Link>
                      </div>
                      <div className="pro-content">
                        <h3 className="title">
                          <Link href="/doctors/search">Dr. John Gibbs</Link>
                          <i className="fas fa-check-circle verified"></i>
                        </h3>
                        <p className="speciality">MDS - Periodontology and Oral Implantology, BDS</p>
                        <div className="rating">
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star"></i>
                          <span className="d-inline-block average-rating">(112)</span>
                        </div>
                        <ul className="available-info">
                          <li>
                            <i className="fas fa-map-marker-alt"></i> Oklahoma, USA
                          </li>
                          <li>
                            <i className="far fa-clock"></i> Available on Fri, 22 Mar
                          </li>
                          <li>
                            <i className="far fa-money-bill-alt"></i> $500 - $2500
                            <i className="fas fa-info-circle" data-bs-toggle="tooltip" title="Lorem Ipsum"></i>
                          </li>
                        </ul>
                        <div className="row row-sm">
                          <div className="col-6">
                            <Link href="/doctors/search" className="btn view-btn">View Profile</Link>
                          </div>
                          <div className="col-6">
                            <Link href="/doctors/search" className="btn book-btn">Book Now</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-12 col-lg-6  col-xl-6">
                    <div className="profile-widget">
                      <div className="doc-img">
                        <Link href="/doctors/search">
                          <img className="img-fluid" alt="User " src={Doc10} />
                        </Link>
                        <Link href="#0" className="fav-btn">
                          <i className="far fa-bookmark"></i>
                        </Link>
                      </div>
                      <div className="pro-content">
                        <h3 className="title">
                          <Link href="/doctors/search">Dr. Olga Barlow</Link>
                          <i className="fas fa-check-circle verified"></i>
                        </h3>
                        <p className="speciality">MDS - Periodontology and Oral Implantology, BDS</p>
                        <div className="rating">
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star"></i>
                          <span className="d-inline-block average-rating">(65)</span>
                        </div>
                        <ul className="available-info">
                          <li>
                            <i className="fas fa-map-marker-alt"></i> Montana, USA
                          </li>
                          <li>
                            <i className="far fa-clock"></i> Available on Fri, 22 Mar
                          </li>
                          <li>
                            <i className="far fa-money-bill-alt"></i> $75 - $250
                            <i className="fas fa-info-circle" data-bs-toggle="tooltip" title="Lorem Ipsum"></i>
                          </li>
                        </ul>
                        <div className="row row-sm">
                          <div className="col-6">
                            <Link href="/doctors/search" className="btn view-btn">View Profile</Link>
                          </div>
                          <div className="col-6">
                            <Link href="/doctors/search" className="btn book-btn">Book Now</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-12 col-lg-6  col-xl-6">
                    <div className="profile-widget">
                      <div className="doc-img">
                        <Link href="/doctors/search">
                          <img className="img-fluid" alt="User " src={Doc11} />
                        </Link>
                        <Link href="#0" className="fav-btn">
                          <i className="far fa-bookmark"></i>
                        </Link>
                      </div>
                      <div className="pro-content">
                        <h3 className="title">
                          <Link href="/doctors/search">Dr. Julia Washington</Link>
                          <i className="fas fa-check-circle verified"></i>
                        </h3>
                        <p className="speciality">MBBS, MD - General Medicine, DM - Endocrinology</p>
                        <div className="rating">
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star"></i>
                          <span className="d-inline-block average-rating">(5)</span>
                        </div>
                        <ul className="available-info">
                          <li>
                            <i className="fas fa-map-marker-alt"></i> Oklahoma, USA
                          </li>
                          <li>
                            <i className="far fa-clock"></i> Available on Fri, 22 Mar
                          </li>
                          <li>
                            <i className="far fa-money-bill-alt"></i> $275 - $450
                            <i className="fas fa-info-circle" data-bs-toggle="tooltip" title="Lorem Ipsum"></i>
                          </li>
                        </ul>
                        <div className="row row-sm">
                          <div className="col-6">
                            <Link href="/doctors/search" className="btn view-btn">View Profile</Link>
                          </div>
                          <div className="col-6">
                            <Link href="/doctors/search" className="btn book-btn">Book Now</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-12 col-lg-6  col-xl-6">
                    <div className="profile-widget">
                      <div className="doc-img">
                        <Link href="/doctors/search">
                          <img className="img-fluid" alt="User " src={Doc12} />
                        </Link>
                        <Link href="#0" className="fav-btn">
                          <i className="far fa-bookmark"></i>
                        </Link>
                      </div>
                      <div className="pro-content">
                        <h3 className="title">
                          <Link href="/doctors/search">Dr. Shaun Aponte</Link>
                          <i className="fas fa-check-circle verified"></i>
                        </h3>
                        <p className="speciality">MBBS, MS - ENT, Diploma in Otorhinolaryngology (DLO)</p>
                        <div className="rating">
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star filled"></i>
                          <i className="fas fa-star"></i>
                          <span className="d-inline-block average-rating">(5)</span>
                        </div>
                        <ul className="available-info">
                          <li>
                            <i className="fas fa-map-marker-alt"></i> Indiana, USA
                          </li>
                          <li>
                            <i className="far fa-clock"></i> Available on Fri, 22 Mar
                          </li>
                          <li>
                            <i className="far fa-money-bill-alt"></i> $150 - $350
                            <i className="fas fa-info-circle" data-bs-toggle="tooltip" title="Lorem Ipsum"></i>
                          </li>
                        </ul>
                        <div className="row row-sm">
                          <div className="col-6">
                            <Link href="/doctors/search" className="btn view-btn">View Profile</Link>
                          </div>
                          <div className="col-6">
                            <Link href="/doctors/search" className="btn book-btn">Book Now</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                </div>
                <div className="load-more text-center">
                  <button type="submit" className="btn btn-primary submit-btn">
                    Load More
                  </button>
                </div>
              </div>

              <div className="col-xl-6 col-lg-12 map-right grid-list-map" style={{ marginTop: matches ? -10 : 40, maxHeight: '80vh', minHeight: "80vh" }}>
                <div id="map" className="map-listing" >
                  <div style={{ height: '10vh', width: '100%', }}>
                    <MapContainer places={data} center={{ lat: -24.9923319, lng: 135.2252427 }} />
                  </div>
                </div>
              </div>

            </div>


          </div> :
          <div className="container-fluid" >
            <div className="row">
              <div className="col-xl-7 col-lg-12 order-md-last order-sm-last order-last map-left">
                <div className="row align-items-center mb-4">
                  <div className="col-md-6 col">
                    <h4>2 Doctors found</h4>
                  </div>
                  <div className="col-md-6 col-auto">
                    {!matches && <div className="view-icons">
                      <Link href="" onClick={() => setDispalyType(() => 'grid')} className={`grid-view ${dispalyType !== 'list' ? 'active' : ''}`}>
                        <i className="fas fa-th-large"></i></Link>
                      <Link href="" onClick={() => setDispalyType(() => 'list')} className={`list-view ${dispalyType == 'list' ? 'active' : ''}`}>
                        <i className="fas fa-bars"></i></Link>
                    </div>}
                    <div className="sort-by d-sm-block ">
                      <Grid item sx={{ display: 'flex', flexDirection: 'column', gap: { xl: 1, lg: 1, md: 1, sm: 2, xs: 2 }, mt: { xl: 0, lg: 0, md: 0, sm: 3, xs: 3 } }}>
                        <FormControl fullWidth>
                          <InputLabel size='small' id="demo-simple-select-label">Sort</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={sortBy}
                            label="Sort"
                            onChange={handleChange}
                            fullWidth
                            size='small'
                          >
                            <MenuItem value="profile.userName">User Name</MenuItem>
                            <MenuItem value="createdAt">Join Date</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <div className="doctor-widget">
                      <div className="doc-info-left">
                        <div className="doctor-img">
                          <Link href="/doctors/search">
                            <img src={Doc01} className="img-fluid" alt="User" />
                          </Link>
                        </div>
                        <div className="doc-info-cont">
                          <h4 className="doc-name">
                            <Link href="/doctors/search">
                              Dr. Ruby Perrin</Link>
                          </h4>
                          <p className="doc-speciality">MDS - Periodontology and Oral Implantology, BDS</p>
                          <h5 className="doc-department"><img src={Doc10} className="img-fluid" alt="Speciality" />Dentist</h5>
                          <div className="rating">
                            <i className="fas fa-star filled"></i>
                            <i className="fas fa-star filled"></i>
                            <i className="fas fa-star filled"></i>
                            <i className="fas fa-star filled"></i>
                            <i className="fas fa-star"></i>
                            <span className="d-inline-block average-rating">(17)</span>
                          </div>
                          <div className="clinic-details">
                            <p className="doc-location"><i className="fas fa-map-marker-alt"></i> Florida, USA</p>
                            <div>
                            </div>
                            <ul className="clinic-gallery">
                              {
                                Images.map((img, index) => {
                                  return (
                                    <li key={index}>
                                      <Link href="" aria-label='clinic-gallery' onClick={() => {
                                        setOpen(true);
                                        setIndex(index)
                                      }} >
                                        <img src={img.src} alt={img.alt} />
                                      </Link>
                                    </li>
                                  )
                                })
                              }
                            </ul>
                            <Lightbox
                              open={open}
                              close={() => setOpen(false)}
                              slides={Images}
                              index={index}
                            />
                          </div>
                          <div className="clinic-services">
                            <span>Dental Fillings</span>
                            <span> Whitneing</span>
                          </div>
                        </div>
                      </div>
                      <div className="doc-info-right">
                        <div className="clini-infos">
                          <ul>
                            <li><i className="far fa-thumbs-up"></i> 98%</li>
                            <li><i className="far fa-comment"></i> 17 Feedback</li>
                            <li><i className="fas fa-map-marker-alt"></i> Florida, USA</li>
                            <li><i className="far fa-money-bill-alt"></i> $300 - $1000 <i className="fas fa-info-circle" data-bs-toggle="tooltip" title="Lorem Ipsum"></i> </li>
                          </ul>
                        </div>
                        <div className="clinic-booking">
                          <Link className="view-pro-btn" href="/doctors/search">View Profile</Link>
                          <Link className="apt-btn" href="/doctors/search">
                            Book Appointment</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <div className="doctor-widget">
                      <div className="doc-info-left">
                        <div className="doctor-img">
                          <Link href="/doctors/search">
                            <img src={Doc02} className="img-fluid" alt="User" />
                          </Link>
                        </div>
                        <div className="doc-info-cont">
                          <h4 className="doc-name">
                            <Link href="/doctors/search">
                              Dr. Darren Elder</Link>
                          </h4>
                          <p className="doc-speciality">BDS, MDS - Oral & Maxillofacial Surgery</p>
                          <h5 className="doc-department"><img src={Doc10} className="img-fluid" alt="Speciality" />Dentist</h5>
                          <div className="rating">
                            <i className="fas fa-star filled"></i>
                            <i className="fas fa-star filled"></i>
                            <i className="fas fa-star filled"></i>
                            <i className="fas fa-star filled"></i>
                            <i className="fas fa-star"></i>
                            <span className="d-inline-block average-rating">(35)</span>
                          </div>
                          <div className="clinic-details">
                            <p className="doc-location"><i className="fas fa-map-marker-alt"></i> Newyork, USA</p>
                            <div>
                            </div>
                            <ul className="clinic-gallery">
                              {
                                Images.map((img, index) => {
                                  return (
                                    <li key={index}>
                                      <Link href="" aria-label='clinic-gallery' onClick={() => {
                                        setOpen(true);
                                        setIndex(index)
                                      }} >
                                        <img src={img.src} alt={img.alt} />
                                      </Link>
                                    </li>
                                  )
                                })
                              }
                            </ul>
                          </div>
                          <div className="clinic-services">
                            <span>Dental Fillings</span>
                            <span> Whitneing</span>
                          </div>
                        </div>
                      </div>
                      <div className="doc-info-right">
                        <div className="clini-infos">
                          <ul>
                            <li><i className="far fa-thumbs-up"></i> 100%</li>
                            <li><i className="far fa-comment"></i> 35 Feedback</li>
                            <li><i className="fas fa-map-marker-alt"></i> Newyork, USA</li>
                            <li><i className="far fa-money-bill-alt"></i> $50 - $300 <i className="fas fa-info-circle" data-bs-toggle="tooltip" title="Lorem Ipsum"></i></li>
                          </ul>
                        </div>
                        <div className="clinic-booking">
                          <Link className="view-pro-btn" href="/doctors/search">View Profile</Link>
                          <Link className="apt-btn" href="/doctors/search">
                            Book Appointment</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <div className="doctor-widget">
                      <div className="doc-info-left">
                        <div className="doctor-img">
                          <Link href="/doctors/search">
                            <img src={Doc03} className="img-fluid" alt="User" />
                          </Link>
                        </div>
                        <div className="doc-info-cont">
                          <h4 className="doc-name">
                            <Link href="/doctors/search">
                              Dr. Deborah Angel</Link>
                          </h4>
                          <p className="doc-speciality">MBBS, MD - General Medicine, DNB - Cardiology</p>
                          <p className="doc-department"><img src={Doc11} className="img-fluid" alt="Speciality" />Cardiology</p>
                          <div className="rating">
                            <i className="fas fa-star filled"></i>
                            <i className="fas fa-star filled"></i>
                            <i className="fas fa-star filled"></i>
                            <i className="fas fa-star filled"></i>
                            <i className="fas fa-star"></i>
                            <span className="d-inline-block average-rating">(27)</span>
                          </div>
                          <div className="clinic-details">
                            <p className="doc-location"><i className="fas fa-map-marker-alt"></i> Georgia, USA</p>
                            <div>
                            </div>
                            <ul className="clinic-gallery">
                              {
                                Images.map((img, index) => {
                                  return (
                                    <li key={index}>
                                      <Link href="" aria-label='clinic-gallery' onClick={() => {
                                        setOpen(true);
                                        setIndex(index)
                                      }} >
                                        <img src={img.src} alt={img.alt} />
                                      </Link>
                                    </li>
                                  )
                                })
                              }
                            </ul>
                          </div>
                          <div className="clinic-services">
                            <span>Dental Fillings</span>
                            <span> Whitneing</span>
                          </div>
                        </div>
                      </div>
                      <div className="doc-info-right">
                        <div className="clini-infos">
                          <ul>
                            <li><i className="far fa-thumbs-up"></i> 99%</li>
                            <li><i className="far fa-comment"></i> 35 Feedback</li>
                            <li><i className="fas fa-map-marker-alt"></i> Newyork, USA</li>
                            <li><i className="far fa-money-bill-alt"></i> $100 - $400 <i className="fas fa-info-circle" data-bs-toggle="tooltip" title="Lorem Ipsum"></i></li>
                          </ul>
                        </div>
                        <div className="clinic-booking">
                          <Link className="view-pro-btn" href="/doctors/search">View Profile</Link>
                          <Link className="apt-btn" href="/doctors/search">
                            Book Appointment</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <div className="doctor-widget">
                      <div className="doc-info-left">
                        <div className="doctor-img">
                          <Link href="/doctors/search">
                            <img src={Doc08} className="img-fluid" alt="User" />
                          </Link>
                        </div>
                        <div className="doc-info-cont">
                          <h4 className="doc-name">
                            <Link href="/doctors/search">
                              Dr. Sofia Brient</Link>
                          </h4>
                          <p className="doc-speciality">MBBS, MS - General Surgery, MCh - Urology</p>
                          <p className="doc-department"><img src={Doc12} className="img-fluid" alt="Speciality" />Urology</p>
                          <div className="rating">
                            <i className="fas fa-star filled"></i>
                            <i className="fas fa-star filled"></i>
                            <i className="fas fa-star filled"></i>
                            <i className="fas fa-star filled"></i>
                            <i className="fas fa-star"></i>
                            <span className="d-inline-block average-rating">(4)</span>
                          </div>
                          <div className="clinic-details">
                            <p className="doc-location"><i className="fas fa-map-marker-alt"></i> Louisiana, USA</p>
                            <div>
                            </div>
                            <ul className="clinic-gallery">
                              {
                                Images.map((img, index) => {
                                  return (
                                    <li key={index}>
                                      <Link href="" aria-label='clinic-gallery' onClick={() => {
                                        setOpen(true);
                                        setIndex(index)
                                      }} >
                                        <img src={img.src} alt={img.alt} />
                                      </Link>
                                    </li>
                                  )
                                })
                              }
                            </ul>
                          </div>
                          <div className="clinic-services">
                            <span>Dental Fillings</span>
                            <span> Whitneing</span>
                          </div>
                        </div>
                      </div>
                      <div className="doc-info-right">
                        <div className="clini-infos">
                          <ul>
                            <li><i className="far fa-thumbs-up"></i> 97%</li>
                            <li><i className="far fa-comment"></i> 4 Feedback</li>
                            <li><i className="fas fa-map-marker-alt"></i> Newyork, USA</li>
                            <li><i className="far fa-money-bill-alt"></i> $150 - $250 <i className="fas fa-info-circle" data-bs-toggle="tooltip" title="Lorem Ipsum"></i></li>
                          </ul>
                        </div>
                        <div className="clinic-booking">
                          <Link className="view-pro-btn" href="/doctors/search">View Profile</Link>
                          <Link className="apt-btn" href="/doctors/search">
                            Book Appointment</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <div className="doctor-widget">
                      <div className="doc-info-left">
                        <div className="doctor-img">
                          <Link href="/doctors/search">
                            <img src={Doc05} className="img-fluid" alt="User" />
                          </Link>
                        </div>
                        <div className="doc-info-cont">
                          <h4 className="doc-name">
                            <Link href="/doctors/search">
                              Dr. Katharine Berthold</Link>
                          </h4>
                          <p className="doc-speciality">MS - Orthopaedics, MBBS, M.Ch - Orthopaedics</p>
                          <p className="doc-department"><img src={Doc06} className="img-fluid" alt="Speciality" />Orthopaedics</p>
                          <div className="rating">
                            <i className="fas fa-star filled"></i>
                            <i className="fas fa-star filled"></i>
                            <i className="fas fa-star filled"></i>
                            <i className="fas fa-star filled"></i>
                            <i className="fas fa-star"></i>
                            <span className="d-inline-block average-rating">(52)</span>
                          </div>
                          <div className="clinic-details">
                            <p className="doc-location"><i className="fas fa-map-marker-alt"></i> Texas, USA</p>
                            <div>
                            </div>
                            <ul className="clinic-gallery">
                              {
                                Images.map((img, index) => {
                                  return (
                                    <li key={index}>
                                      <Link aria-label='clinic-gallery' href="" onClick={() => {
                                        setOpen(true);
                                        setIndex(index)
                                      }} >
                                        <img src={img.src} alt={img.alt} />
                                      </Link>
                                    </li>
                                  )
                                })
                              }
                            </ul>
                          </div>
                          <div className="clinic-services">
                            <span>Dental Fillings</span>
                            <span> Whitneing</span>
                          </div>
                        </div>
                      </div>
                      <div className="doc-info-right">
                        <div className="clini-infos">
                          <ul>
                            <li><i className="far fa-thumbs-up"></i> 100%</li>
                            <li><i className="far fa-comment"></i> 52 Feedback</li>
                            <li><i className="fas fa-map-marker-alt"></i> Texas, USA</li>
                            <li><i className="far fa-money-bill-alt"></i> $100 - $500 <i className="fas fa-info-circle" data-bs-toggle="tooltip" title="Lorem Ipsum"></i></li>
                          </ul>
                        </div>
                        <div className="clinic-booking">
                          <Link className="view-pro-btn" href="/doctors/search">View Profile</Link>
                          <Link className="apt-btn" href="/doctors/search">
                            Book Appointment</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="load-more text-center">
                  <button type="submit" className="btn btn-primary submit-btn">
                    Load More
                  </button>
                </div>
              </div>
              <div className="col-xl-5 col-lg-12 map-right grid-list-map" style={{ marginTop: 40, maxHeight: '80vh', minHeight: "80vh" }}>
                <div id="map" className="map-listing">
                  <div style={{ height: '10vh', width: '100%' }}>
                    <MapContainer
                      places={data}
                      center={{ lat: -24.9923319, lng: 135.2252427 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>}
      </div>
    </Fragment>
  )
});

export default DoctorsSections;