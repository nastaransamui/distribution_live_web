/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import { patient_profile, doctor_17, doctor_14 } from '@/public/assets/imagepath'

const PatientSidebarDoctorDashboard: FC = (() => {
  const { muiVar } = useScssVar();

  return (
    <Fragment>
      <div className="col-md-5 col-lg-4 col-xl-3 theiaStickySidebar" style={muiVar}>
        <div className="profile-sidebar">


          <div className="card widget-profile pat-widget-profile">
            <div className="card-body">
              <div className="pro-widget-content">
                <div className="profile-info-widget">
                  <Link href="#0" className="booking-doc-img">
                    <img src={patient_profile} alt="" />
                  </Link>
                  <div className="profile-det-info">
                    <h3>Richard Wilson</h3>

                    <div className="patient-details">
                      <h5>
                        <b>Patient ID :</b> PT0016
                      </h5>
                      <h5 className="mb-0">
                        <i className="fas fa-map-marker-alt"></i> Newyork,
                        United States
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
              <div className="patient-info">
                <ul>
                  <li>
                    Phone <span>+1 952 001 8563</span>
                  </li>
                  <li>
                    Age <span>38 Years, Male</span>
                  </li>
                  <li>
                    Blood Group <span>AB+</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Last Booking</h4>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <div className="media align-items-center d-flex">
                  <div className="me-3 flex-shrink-0">
                    <img
                      alt="Image placeholder"
                      src={doctor_17}
                      className="avatar  rounded-circle"
                    />
                  </div>
                  <div className="media-body flex-grow-1">
                    <h5 className="d-block mb-0">Dr. Darren Elder </h5>
                    <span className="d-block text-sm text-muted">
                      Dentist
                    </span>
                    <span className="d-block text-sm text-muted">
                      14 Nov 2019 5.00 PM
                    </span>
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="media align-items-center d-flex">
                  <div className="me-3 flex-shrink-0">
                    <img
                      alt="Image placeholder"
                      src={doctor_14}
                      className="avatar  rounded-circle"
                    />
                  </div>
                  <div className="media-body flex-grow-1">
                    <h5 className="d-block mb-0">Dr. Darren Elder </h5>
                    <span className="d-block text-sm text-muted">
                      Dentist
                    </span>
                    <span className="d-block text-sm text-muted">
                      12 Nov 2019 11.00 AM
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Fragment>
  )
});

export default PatientSidebarDoctorDashboard;