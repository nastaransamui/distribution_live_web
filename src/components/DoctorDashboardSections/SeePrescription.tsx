import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'

import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import { DoctorProfileType } from '../SearchDoctorSections/SearchDoctorSection';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


export interface PrescriptionsArrayType {
  medicine: string;
  medicine_id: string;
  quantity: number;
  description: string;
}

export interface PrescriptionsType {
  _id: string;
  doctorId: string;
  patientId: string;
  prescriptionsArray: PrescriptionsArrayType[];
  createdAt: Date;
  updateAt: Date;
}

export interface PrescriptionsTypeWithDoctorProfile extends PrescriptionsType {
  doctorProfile: DoctorProfileType
}

const SeePrescription: FC<{ singlePrescription: PrescriptionsTypeWithDoctorProfile }> = (({ singlePrescription }) => {
  const { muiVar, threeOptionMain } = useScssVar();
  const { doctorProfile } = singlePrescription;
  const router = useRouter();




  return (
    <Fragment>
      <div className="col-md-7 col-lg-8 col-xl-9" style={muiVar}>
        <div className="card">
          <div className="card-header" style={{ display: 'flex' }}>
            <h4 className="card-title mb-0">Prescription</h4>
            <a href="" className="link"
              onClick={(e) => {
                e.preventDefault();
                router.back()
              }}
              style={{ ...threeOptionMain, marginLeft: 'auto' }}>
              <ArrowBackIcon />
            </a>
          </div>
          <form noValidate className="card-body">
            <div className="row">
              <div className="col-sm-6">
                <div className="biller-info">
                  <h4 className="d-block">{`Dr. ${doctorProfile?.firstName} ${doctorProfile?.lastName}`}</h4>
                  <span className="d-block text-sm text-muted">{doctorProfile !== null && doctorProfile?.specialities?.[0]?.specialities}</span>
                  <span className="d-block text-sm text-muted">{doctorProfile !== null && `${doctorProfile?.country} ${doctorProfile?.state} ${doctorProfile?.city}`}</span>
                </div>
              </div>
              <div className="col-sm-6 text-sm-end">
                <div className="billing-info">
                  <h4 className="d-block"> {dayjs(singlePrescription?.createdAt).format('DD MMMM YYYY HH:mm')}</h4>
                  <span className="d-block text-muted">#{singlePrescription?._id}</span>
                </div>
              </div>
            </div>



            <div className="card card-table">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover table-center">
                    <thead>
                      <tr>
                        <th style={{ minWidth: '200p' }}>Medicine</th>
                        <th style={{ minWidth: '80px' }}>Quantity</th>
                        <th style={{ minWidth: '80px' }}>Description</th>
                      </tr>
                    </thead>
                    {
                      singlePrescription.prescriptionsArray.map((data, index) => {
                        return (
                          <tbody key={index}>
                            <tr>
                              <td>
                                <FormControl fullWidth>
                                  <TextField
                                    required
                                    id={'medicine'}
                                    autoComplete='off'
                                    value={data?.medicine}
                                    label="Medicine"
                                    size='small'
                                    fullWidth
                                    disabled
                                  />
                                </FormControl>
                              </td>
                              <td>
                                <FormControl fullWidth>
                                  <TextField
                                    required
                                    id="quantity"
                                    autoComplete='off'
                                    value={data.quantity}
                                    label="Quantity"
                                    size='small'
                                    fullWidth
                                    disabled
                                  />
                                </FormControl>
                              </td>
                              <td>
                                <FormControl fullWidth>
                                  <TextField
                                    required
                                    multiline
                                    id="description"
                                    autoComplete='off'
                                    value={data.description}
                                    label="Description"
                                    size='small'
                                    fullWidth
                                    disabled
                                  />
                                </FormControl>
                              </td>
                            </tr>
                          </tbody>
                        )
                      })
                    }
                  </table>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 text-end">
                <div className="signature-wrap">
                  <div className="signature">
                    Signature
                  </div>
                  <div className="sign-name">
                    <p className="mb-0">({doctorProfile !== null && `Dr. ${doctorProfile?.firstName} ${doctorProfile?.lastName}`})</p>
                    <span className="text-muted">Signature</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  )
});

export default SeePrescription;