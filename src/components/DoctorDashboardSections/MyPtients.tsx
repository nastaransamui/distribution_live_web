/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useMemo } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import { PatientImg1, PatientImg2, PatientImg3, PatientImg4, PatientImg5, PatientImg6, PatientImg7 } from '@/public/assets/imagepath';

export interface TypeValue {
  patientImg: string;
  patientName: string;
  patientId: string;
  address: string;
  age: string;
  phone: string;
  bloodGroup: string;
}

const MyPtients: FC = (() => {
  const { muiVar } = useScssVar();

  const patiensData: TypeValue[] = useMemo(() => {
    return [
      {
        patientImg: PatientImg1,
        patientName: "Richard Wilson",
        patientId: 'P0016',
        address: ' Alabama, USA',
        age: '38 Years, Female',
        phone: ' +1 923 782 4575',
        bloodGroup: "AB+",
      },
      {
        patientImg: PatientImg2,
        patientName: "Charlene Reed",
        patientId: 'P0006',
        address: ' Alabama, USA',
        age: '38 Years, Female',
        phone: ' +1 923 782 4575',
        bloodGroup: "O+",
      },
      {
        patientImg: PatientImg3,
        patientName: "Travis Trimble",
        patientId: 'P0016',
        address: ' Alabama, USA',
        age: '38 Years, Male',
        phone: ' +1 923 782 4575',
        bloodGroup: "AB+",
      },
      {
        patientImg: PatientImg4,
        patientName: "Carl Kelly",
        patientId: 'P0016',
        address: ' Alabama, USA',
        age: '38 Years, Female',
        phone: ' +1 923 782 4575',
        bloodGroup: "AB+",
      },
      {
        patientImg: PatientImg5,
        patientName: "Michelle Fairfax",
        patientId: 'P0016',
        address: ' Alabama, USA',
        age: '38 Years, Female',
        phone: ' +1 923 782 4575',
        bloodGroup: "AB+",
      },
      {
        patientImg: PatientImg6,
        patientName: "Gina Moore",
        patientId: 'P0016',
        address: ' Alabama, USA',
        age: '38 Years, Female',
        phone: ' +1 923 782 4575',
        bloodGroup: "AB+",
      },
      {
        patientImg: PatientImg7,
        patientName: "Elsie Gilley",
        patientId: 'P0016',
        address: ' Alabama, USA',
        age: '38 Years, Male',
        phone: ' +1 923 782 4575',
        bloodGroup: "AB+",
      },
      {
        patientImg: PatientImg1,
        patientName: "Joan Gardner",
        patientId: 'P0016',
        address: ' Alabama, USA',
        age: '38 Years, Female',
        phone: ' +1 923 782 4575',
        bloodGroup: "AB+",
      },
      {
        patientImg: PatientImg3,
        patientName: "Daniel Griffing",
        patientId: 'P0016',
        address: ' Alabama, USA',
        age: '38 Years, Male',
        phone: ' +1 923 782 4575',
        bloodGroup: "AB+",
      },
    ]
  }, [])

  return (
    <Fragment>
      <div className="col-md-7 col-lg-8 col-xl-9" style={muiVar}>
        <div className="row row-grid">
          {
            patiensData.map((value: TypeValue, index: number) => {

              return (
                <div className="col-md-6 col-lg-4 col-xl-3" key={index}>
                  <div className="card widget-profile pat-widget-profile">
                    <div className="card-body">
                      <div className="pro-widget-content">
                        <div className="profile-info-widget">
                          <Link
                            href="/doctors/dashboard/patient-profile"
                            className="booking-doc-img"
                          >
                            <img src={value.patientImg} alt="User" />
                          </Link>
                          <div className="profile-det-info">
                            <h3>
                              <Link href="/doctors/dashboard/patient-profile">
                                {value.patientName}
                              </Link>
                            </h3>

                            <div className="patient-details">
                              <h5>
                                <b>Patient ID :</b> {value.patientId}
                              </h5>
                              <h5 className="mb-0">
                                <i className="fas fa-map-marker-alt"></i>{" "}
                                {value.address}
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="patient-info">
                        <ul>
                          <li>
                            Phone <span>{value.phone}</span>
                          </li>
                          <li>
                            Age <span>{value.age}</span>
                          </li>
                          <li>
                            Blood Group <span>{value.bloodGroup}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </Fragment>
  )
});

export default MyPtients;