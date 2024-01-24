/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useMemo, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { Transition, BootstrapDialog, BootstrapDialogTitle } from "@/components/shared/Dialog";
import DialogContent from '@mui/material/DialogContent';
import Link from 'next/link';

import { PatientImg1, PatientImg2, PatientImg3, PatientImg4, PatientImg5, PatientImg6, PatientImg7 } from '@/public/assets/imagepath';

export interface TypeValue {
  patientImg: string;
  patientName: string;
  appointmentDate: string;
  address: string;
  email: string;
  phone: string;
  status: string;
  confirmDate: string;
  paidAmount: string;
}

const initialState: TypeValue = {
  patientImg: '',
  patientName: "",
  appointmentDate: '',
  address: '',
  email: '',
  phone: '',
  status: '',
  confirmDate: "",
  paidAmount: "",
}
const Appointment: FC = (() => {
  const { muiVar } = useScssVar();
  const [show, setShow] = useState(false);
  const [editValues, setEditValues] = useState(initialState);

  const appointmentData: TypeValue[] = useMemo(() => {
    return [
      {
        patientImg: PatientImg1,
        patientName: "Richard Wilson",
        appointmentDate: '14 Nov 2019, 10.00 AM',
        address: 'Newyork, United States',
        email: 'richard@example.com',
        phone: ' +1 923 782 4575',
        status: 'Completed',
        confirmDate: "29 Jun 2019",
        paidAmount: "$450",
      },
      {
        patientImg: PatientImg2,
        patientName: "Charlene Reed",
        appointmentDate: '12 Nov 2019, 5.00 PM',
        address: 'North Carolina, United States',
        email: 'charlenereed@example.com',
        phone: ' +1 828 632 9170',
        status: 'Completed',
        confirmDate: "29 Jun 2019",
        paidAmount: "$450",
      },
      {
        patientImg: PatientImg3,
        patientName: "Travis Trimble",
        appointmentDate: '11 Nov 2019, 8.00 PM',
        address: 'Maine, United States',
        email: 'travistrimble@example.com',
        phone: ' +1 207 729 9974',
        status: 'Completed',
        confirmDate: "29 Jun 2019",
        paidAmount: "$450",
      },
      {
        patientImg: PatientImg4,
        patientName: "Carl Kelly",
        appointmentDate: '9 Nov 2019, 9.00 AM',
        address: 'Newyork, United States',
        email: 'carlkelly@example.com',
        phone: ' +1 260 724 7769',
        status: 'Completed',
        confirmDate: "29 Jun 2019",
        paidAmount: "$450",
      },
      {
        patientImg: PatientImg5,
        patientName: "Michelle Fairfax",
        appointmentDate: '9 Nov 2019, 1.00 PM',
        address: 'Newyork, United States',
        email: 'michellefairfax@example.com',
        phone: ' +1 504 368 6874',
        status: 'Completed',
        confirmDate: "29 Jun 2019",
        paidAmount: "$450",
      },
      {
        patientImg: PatientImg6,
        patientName: "Gina Moore",
        appointmentDate: '8 Nov 2019, 3.00 PM',
        address: 'Newyork, United States',
        email: 'ginamoore@example.com',
        phone: ' +1 954 820 7887',
        status: 'Completed',
        confirmDate: "29 Jun 2019",
        paidAmount: "$450",
      },
      {
        patientImg: PatientImg7,
        patientName: "Elsie Gilley",
        appointmentDate: '6 Nov 2019, 9.00 AM',
        address: 'Newyork, United States',
        email: 'elsiegilley@example.com',
        phone: ' +1 315 384 4562',
        status: 'Completed',
        confirmDate: "29 Jun 2019",
        paidAmount: "$450",
      },
      {
        patientImg: PatientImg1,
        patientName: "Joan Gardner",
        appointmentDate: '5 Nov 2019, 12.00 PM',
        address: 'Newyork, United States',
        email: 'joangardner@example.com',
        phone: ' +1 707 2202 603',
        status: 'Completed',
        confirmDate: "29 Jun 2019",
        paidAmount: "$450",
      },
      {
        patientImg: PatientImg2,
        patientName: "Daniel Griffing",
        appointmentDate: '5 Nov 2019, 7.00 PM',
        address: 'Newyork, United States',
        email: 'danielgriffing@example.com',
        phone: ' +1 973 773 9497',
        status: 'Completed',
        confirmDate: "29 Jun 2019",
        paidAmount: "$450",
      },
      {
        patientImg: PatientImg3,
        patientName: "Walter Roberson",
        appointmentDate: '4 Nov 2019, 10.00 AM',
        address: 'Newyork, United States',
        email: 'walterroberson@example.com',
        phone: ' +1 850 358 4445',
        status: 'Completed',
        confirmDate: "29 Jun 2019",
        paidAmount: "$450",
      },
      {
        patientImg: PatientImg4,
        patientName: "Robert Rhodes",
        appointmentDate: '4 Nov 2019, 11.00 AM',
        address: 'Newyork, United States',
        email: 'robertrhodes@example.com',
        phone: ' +1 858 259 5285',
        status: 'Completed',
        confirmDate: "29 Jun 2019",
        paidAmount: "$450",
      },
      {
        patientImg: PatientImg5,
        patientName: "Harry Williams",
        appointmentDate: '3 Nov 2019, 6.00 PM',
        address: 'Newyork, United States',
        email: 'harrywilliams@example.com',
        phone: ' +1 303 607 7075',
        status: 'Completed',
        confirmDate: "29 Jun 2019",
        paidAmount: "$450",
      }
    ]
  }, [])

  const handleShow = (data: TypeValue) => {
    setShow(true);
    setEditValues(data)
  }
  return (
    <Fragment>
      <div className="col-md-7 col-lg-8 col-xl-9" style={muiVar}>
        <div className="appointments">
          {
            appointmentData.map((value: TypeValue, index: number) => {

              return (
                <div className="appointment-list" key={index}>
                  <div className="profile-info-widget" >
                    <Link
                      href="/doctors/dashboard/patient-profile"
                      className="booking-doc-img"
                    >
                      <img src={value.patientImg} alt="User" />
                    </Link>
                    <div className="profile-det-info">
                      <h3>
                        <Link href="/doctors/dashboard/patient-profile">{value.patientName}</Link>
                      </h3>
                      <div className="patient-details">
                        <h5>
                          <i className="far fa-clock"></i> {value.appointmentDate}
                        </h5>
                        <h5>
                          <i className="fas fa-map-marker-alt"></i> {value.address}
                        </h5>
                        <h5>
                          <i className="fas fa-envelope"></i>{" "}
                          {value.email}
                        </h5>
                        <h5 className="mb-0">
                          <i className="fas fa-phone"></i> {value.phone}
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div className="appointment-action">
                    <Link
                      href="#0"
                      className="btnLogin"
                      style={{ lineHeight: '38px', }}
                      onClick={() => handleShow(value)}
                    >
                      <i className="far fa-eye"></i> View
                    </Link>
                    <Link href="#0" className="btnLogout"
                      style={{ lineHeight: '38px', }}>
                      <i className="fas fa-check" style={{ color: 'green' }}></i> Accept
                    </Link>
                    <Link href="#0" className="btnLogin"
                      style={{ lineHeight: '38px', }}>
                      <i className="fas fa-times" style={{ color: 'crimson' }}></i> Cancel
                    </Link>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>

      {
        show && <BootstrapDialog
          TransitionComponent={Transition}
          onClose={() => {
            document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
            setTimeout(() => {
              setShow(false)
            }, 500);
          }}
          aria-labelledby="edit_invoice_details"
          open={show}
        >
          <BootstrapDialogTitle
            id="edit_invoice_details" onClose={() => {
              document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
              setTimeout(() => {
                setShow(false)
              }, 500);
            }}>
            {editValues.patientName}
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <ul className="info-details" style={muiVar}>
              <li>
                <div className="details-header">
                  <div className="row">
                    <div className="col-md-6">
                      <span className="title">#APT0001</span>
                      <span className="text">{editValues.appointmentDate}</span>
                    </div>
                    <div className="col-md-6">
                      <div className="text-end">
                        <button
                          type="button"
                          className="btnLogin"
                          id="topup_status"
                        >
                          {editValues.status}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <span className="title">Status:</span>
                <span className="text">{editValues.status}</span>
              </li>
              <li>
                <span className="title">Confirm Date:</span>
                <span className="text">{editValues.confirmDate}</span>
              </li>
              <li>
                <span className="title">Paid Amount</span>
                <span className="text">{editValues.confirmDate}</span>
              </li>
            </ul>
          </DialogContent>
        </BootstrapDialog>
      }
    </Fragment >
  )
});

export default Appointment;