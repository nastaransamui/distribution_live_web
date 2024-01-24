/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link'
import {
  DoctFav1,
  DoctFav2,
  DoctFav3,
  DoctFav4,
  DoctFav5,
  DoctFav6,
  DoctFav7,
  DoctFav8,
} from '@/public/assets/imagepath';


const Favourits: FC = (() => {
  const { muiVar } = useScssVar();

  return (
    <Fragment>
      <div className="col-md-7 col-lg-8 col-xl-9" style={muiVar}>
        <div className="row row-grid">
          <div className="col-md-6 col-lg-4 col-xl-3">
            <div className="profile-widget">
              <div className="doc-img">
                <Link href="/doctors/profile">
                  <img className="img-fluid" alt="User" src={DoctFav1} />
                </Link>
                <Link href="#0" className="fav-btn">
                  <i className="far fa-bookmark"></i>
                </Link>
              </div>
              <div className="pro-content">
                <h3 className="title">
                  <Link href="/doctors/profile">Dr. Ruby Perrin</Link>
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
                    <Link href="/doctors/profile" className="btn view-btn">View Profile</Link>
                  </div>
                  <div className="col-6">
                    <Link href="/doctors/booking" className="btn book-btn">Book Now</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4 col-xl-3">
            <div className="profile-widget">
              <div className="doc-img">
                <Link href="/doctors/profile">
                  <img className="img-fluid" alt="User" src={DoctFav2} />
                </Link>
                <Link href="#0" className="fav-btn">
                  <i className="far fa-bookmark"></i>
                </Link>
              </div>
              <div className="pro-content">
                <h3 className="title">
                  <Link href="/doctors/profile">Dr. Darren Elder</Link>
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
                    <Link href="/doctors/profile" className="btn view-btn">View Profile</Link>
                  </div>
                  <div className="col-6">
                    <Link href="/doctors/booking" className="btn book-btn">Book Now</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4 col-xl-3">
            <div className="profile-widget">
              <div className="doc-img">
                <Link href="/doctors/profile">
                  <img className="img-fluid" alt="User" src={DoctFav3} />
                </Link>
                <Link href="#0" className="fav-btn">
                  <i className="far fa-bookmark"></i>
                </Link>
              </div>
              <div className="pro-content">
                <h3 className="title">
                  <Link href="/doctors/profile">Dr. Deborah Angel</Link>
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
                    <Link href="/doctors/profile" className="btn view-btn">View Profile</Link>
                  </div>
                  <div className="col-6">
                    <Link href="/doctors/booking" className="btn book-btn">Book Now</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4 col-xl-3">
            <div className="profile-widget">
              <div className="doc-img">
                <Link href="/doctors/profile">
                  <img className="img-fluid" alt="User" src={DoctFav4} />
                </Link>
                <Link href="#0" className="fav-btn">
                  <i className="far fa-bookmark"></i>
                </Link>
              </div>
              <div className="pro-content">
                <h3 className="title">
                  <Link href="/doctors/profile">Dr. Sofia Brient</Link>
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
                    <Link href="/doctors/profile" className="btn view-btn">View Profile</Link>
                  </div>
                  <div className="col-6">
                    <Link href="/doctors/booking" className="btn book-btn">Book Now</Link>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4 col-xl-3">
            <div className="profile-widget">
              <div className="doc-img">
                <Link href="/doctors/profile">
                  <img className="img-fluid" alt="User" src={DoctFav5} />
                </Link>
                <Link href="#0" className="fav-btn">
                  <i className="far fa-bookmark"></i>
                </Link>
              </div>
              <div className="pro-content">
                <h3 className="title">
                  <Link href="/doctors/profile">Dr. Marvin Campbell</Link>
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
                    <i className="far fa-money-bill-alt"></i> $50 - $700 <i className="fas fa-info-circle" data-bs-toggle="tooltip" title="Lorem Ipsum"></i>
                  </li>
                </ul>
                <div className="row row-sm">
                  <div className="col-6">
                    <Link href="/doctors/profile" className="btn view-btn">View Profile</Link>
                  </div>
                  <div className="col-6">
                    <Link href="/doctors/booking" className="btn book-btn">Book Now</Link>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4 col-xl-3">
            <div className="profile-widget">
              <div className="doc-img">
                <Link href="/doctors/profile">
                  <img className="img-fluid" alt="User" src={DoctFav6} />
                </Link>
                <Link href="#0" className="fav-btn">
                  <i className="far fa-bookmark"></i>
                </Link>
              </div>
              <div className="pro-content">
                <h3 className="title">
                  <Link href="/doctors/profile">Dr. Katharine Berthold</Link>
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
                    <i className="far fa-money-bill-alt"></i> $100 - $500 <i className="fas fa-info-circle" data-bs-toggle="tooltip" title="Lorem Ipsum"></i>
                  </li>
                </ul>
                <div className="row row-sm">
                  <div className="col-6">
                    <Link href="/doctors/profile" className="btn view-btn">View Profile</Link>
                  </div>
                  <div className="col-6">
                    <Link href="/doctors/booking" className="btn book-btn">Book Now</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4 col-xl-3">
            <div className="profile-widget">
              <div className="doc-img">
                <Link href="/doctors/profile">
                  <img className="img-fluid" alt="User" src={DoctFav7} />
                </Link>
                <Link href="#0" className="fav-btn">
                  <i className="far fa-bookmark"></i>
                </Link>
              </div>
              <div className="pro-content">
                <h3 className="title">
                  <Link href="/doctors/profile">Dr. Linda Tobin</Link>
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
                    <i className="far fa-money-bill-alt"></i> $100 - $1000 <i className="fas fa-info-circle" data-bs-toggle="tooltip" title="Lorem Ipsum"></i>
                  </li>
                </ul>
                <div className="row row-sm">
                  <div className="col-6">
                    <Link href="/doctors/profile" className="btn view-btn">View Profile</Link>
                  </div>
                  <div className="col-6">
                    <Link href="/doctors/booking" className="btn book-btn">Book Now</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4 col-xl-3">
            <div className="profile-widget">
              <div className="doc-img">
                <Link href="/doctors/profile">
                  <img className="img-fluid" alt="User" src={DoctFav8} />
                </Link>
                <Link href="#0" className="fav-btn">
                  <i className="far fa-bookmark"></i>
                </Link>
              </div>
              <div className="pro-content">
                <h3 className="title">
                  <Link href="/doctors/profile">Dr. Paul Richard</Link>
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
                    <i className="far fa-money-bill-alt"></i> $100 - $400 <i className="fas fa-info-circle" data-bs-toggle="tooltip" title="Lorem Ipsum"></i>
                  </li>
                </ul>
                <div className="row row-sm">
                  <div className="col-6">
                    <Link href="/doctors/profile" className="btn view-btn">View Profile</Link>
                  </div>
                  <div className="col-6">
                    <Link href="/doctors/booking" className="btn book-btn">Book Now</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4 col-xl-3">
            <div className="profile-widget">
              <div className="doc-img">
                <Link href="/doctors/profile">
                  <img className="img-fluid" alt="User" src={DoctFav1} />
                </Link>
                <Link href="#0" className="fav-btn">
                  <i className="far fa-bookmark"></i>
                </Link>
              </div>
              <div className="pro-content">
                <h3 className="title">
                  <Link href="/doctors/profile">Dr. John Gibbs</Link>
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
                    <i className="far fa-money-bill-alt"></i> $500 - $2500 <i className="fas fa-info-circle" data-bs-toggle="tooltip" title="Lorem Ipsum"></i>
                  </li>
                </ul>
                <div className="row row-sm">
                  <div className="col-6">
                    <Link href="/doctors/profile" className="btn view-btn">View Profile</Link>
                  </div>
                  <div className="col-6">
                    <Link href="/doctors/booking" className="btn book-btn">Book Now</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4 col-xl-3">
            <div className="profile-widget">
              <div className="doc-img">
                <Link href="/doctors/profile">
                  <img className="img-fluid" alt="User" src={DoctFav2} />
                </Link>
                <Link href="#0" className="fav-btn">
                  <i className="far fa-bookmark"></i>
                </Link>
              </div>
              <div className="pro-content">
                <h3 className="title">
                  <Link href="/doctors/profile">Dr. Olga Barlow</Link>
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
                    <i className="far fa-money-bill-alt"></i> $75 - $250 <i className="fas fa-info-circle" data-bs-toggle="tooltip" title="Lorem Ipsum"></i>
                  </li>
                </ul>
                <div className="row row-sm">
                  <div className="col-6">
                    <Link href="/doctors/profile" className="btn view-btn">View Profile</Link>
                  </div>
                  <div className="col-6">
                    <Link href="/doctors/booking" className="btn book-btn">Book Now</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4 col-xl-3">
            <div className="profile-widget">
              <div className="doc-img">
                <Link href="/doctors/profile">
                  <img className="img-fluid" alt="User" src={DoctFav3} />
                </Link>
                <Link href="#0" className="fav-btn">
                  <i className="far fa-bookmark"></i>
                </Link>
              </div>
              <div className="pro-content">
                <h3 className="title">
                  <Link href="/doctors/profile">Dr. Julia Washington</Link>
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
                    <i className="far fa-money-bill-alt"></i> $275 - $450 <i className="fas fa-info-circle" data-bs-toggle="tooltip" title="Lorem Ipsum"></i>
                  </li>
                </ul>
                <div className="row row-sm">
                  <div className="col-6">
                    <Link href="/doctors/profile" className="btn view-btn">View Profile</Link>
                  </div>
                  <div className="col-6">
                    <Link href="/doctors/booking" className="btn book-btn">Book Now</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4 col-xl-3">
            <div className="profile-widget">
              <div className="doc-img">
                <Link href="/doctors/profile">
                  <img className="img-fluid" alt="User" src={DoctFav4} />
                </Link>
                <Link href="#0" className="fav-btn">
                  <i className="far fa-bookmark"></i>
                </Link>
              </div>
              <div className="pro-content">
                <h3 className="title">
                  <Link href="/doctors/profile">Dr. Shaun Aponte</Link>
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
                    <i className="far fa-money-bill-alt"></i> $150 - $350 <i className="fas fa-info-circle" data-bs-toggle="tooltip" title="Lorem Ipsum"></i>
                  </li>
                </ul>
                <div className="row row-sm">
                  <div className="col-6">
                    <Link href="/doctors/profile" className="btn view-btn">View Profile</Link>
                  </div>
                  <div className="col-6">
                    <Link href="/doctors/booking" className="btn book-btn">Book Now</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </Fragment>
  )
});

export default Favourits;