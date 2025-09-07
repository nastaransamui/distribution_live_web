import { FC, Fragment, ReactNode } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';

import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import dayjs from 'dayjs';
import { useForm, useFieldArray } from 'react-hook-form';
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';
import { toast } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { PrescriptionsTypeWithDoctorProfile } from './SeePrescription';

export interface PrescriptionsArrayType {
  medicine: string;
  medicine_id: string;
  quantity: number | null;
  description: string;
}

export interface PrescriptionsType {
  _id: string;
  doctorId: string;
  patientId: string;
  prescriptionsArray: PrescriptionsArrayType[];
  createdAt: Date;
  updatedAt: Date;
  id: number;
}

const initialState: PrescriptionsArrayType = {
  medicine: '',
  medicine_id: '',
  quantity: null,
  description: '',
}

const EditPrescription: FC<{ singlePrescription: PrescriptionsTypeWithDoctorProfile }> = (({ singlePrescription }) => {
  const { bounce, threeOptionMain } = useScssVar();
  const router = useRouter();
  const dispatch = useDispatch();
  const { doctorProfile } = singlePrescription;
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;
  const {
    formState: { errors },
    control,
    handleSubmit,
    setValue,
    getValues,
    reset
  } = useForm({
    defaultValues: {
      _id: singlePrescription?._id,
      doctorId: singlePrescription.doctorId,
      patientId: singlePrescription?.patientId,
      prescriptionsArray: [...singlePrescription.prescriptionsArray],
      createdAt: singlePrescription.createdAt,
      id: singlePrescription.id,
    } as PrescriptionsType
  })

  const { fields: prescriptionsFields, append: appendPrescription, remove: removePrescription } = useFieldArray<any>({
    control,
    name: "prescriptionsArray"
  });


  const onPrescriptionSubmit = (data: PrescriptionsType) => {
    if (getValues('prescriptionsArray').length == 0) {
      toast.error('You can\'t save Prescription without medicine.', {
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
        }
      });
    } else {
      dispatch(updateHomeFormSubmit(true))

      homeSocket.current.emit('editPrescription', data)
      homeSocket.current.once('editPrescriptionReturn', (msg: { status: number, newPrescription: PrescriptionsType, message?: string }) => {
        if (msg?.status !== 200) {
          toast.error(msg?.message || 'null', {
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
            }
          });
        } else if (msg?.status == 200) {
          const { newPrescription } = msg;
          reset(newPrescription);
          setTimeout(() => {
            dispatch(updateHomeFormSubmit(false))
          }, 1000);
        }
      })
    }
  }

  const addInputField = () => {
    appendPrescription({ ...initialState })

  }
  const removeInputFields = (index: number) => {
    if (prescriptionsFields.length > 1) {
      removePrescription(index)
    } else {
      toast.error("Prescription should at least has 1 field", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        transition: bounce,
        onClose: () => { }
      });

    }
  }




  return (
    <Fragment>
      <div className="col-md-12 col-lg-12 col-xl-12 animate__animated animate__backInUp">
        <div className="card">
          <div className="card-header" style={{ display: 'flex' }}>
            <a href="" className="link" aria-label='back'
              onClick={(e) => {
                e.preventDefault();
                router.back()
              }}
              style={{ ...threeOptionMain, marginRight: 'auto' }}>
              <ArrowBackIcon />
            </a>
            <h4 className="card-title mb-0">Edit Prescription</h4>
          </div>
          <form noValidate onSubmit={handleSubmit(onPrescriptionSubmit)} className="card-body">
            <div className="row">
              <div className="col-sm-6">
                <div className="biller-info">
                  <h4 className="d-block">{`Dr. ${doctorProfile?.firstName} ${doctorProfile?.lastName}`}</h4>
                  <span className="d-block text-sm text-muted">{doctorProfile?.specialities?.[0]?.specialities}</span>
                  <span className="d-block text-sm text-muted">{`${doctorProfile?.country} ${doctorProfile?.state} ${doctorProfile?.city}`}</span>
                </div>
              </div>
              <div className="col-sm-6 text-sm-end">
                <div className="billing-info">
                  <h4 className="d-block"> {dayjs().format('DD MMMM YYYY')}</h4>
                </div>
              </div>
            </div>


            {prescriptionsFields.length < 5 && <div className="add-more text-end" onClick={addInputField} style={{ marginBottom: 8 }}>
              <Link href="" onClick={(e) => { e.preventDefault() }} className="add-education"><i className="fa fa-plus-circle"></i> Add More</Link>
            </div>}




            <div className="card card-table">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover table-center">
                    <thead>
                      <tr>
                        <th style={{ minWidth: '200p' }}>Medicine</th>
                        <th style={{ minWidth: '80px' }}>Quantity</th>
                        <th style={{ minWidth: '80px' }}>Description</th>
                        <th style={{ minWidth: '80px' }}>Delete</th>
                      </tr>
                    </thead>
                    {
                      prescriptionsFields.map((data, index) => {
                        return (
                          <tbody key={index}>
                            <tr>
                              <td>
                                <FormControl fullWidth>
                                  <TextField
                                    required
                                    id={`medicine${index}`}
                                    autoComplete='off'
                                    error={errors?.['prescriptionsArray']?.[index]?.['medicine'] == undefined ? false : true}
                                    helperText={errors?.['prescriptionsArray']?.[index]?.['medicine'] && errors?.['prescriptionsArray']?.[index]?.['medicine']?.['message'] as ReactNode}
                                    {
                                    ...control.register(`prescriptionsArray.${index}.medicine`, {
                                      required: `This field is required `,
                                    })
                                    }
                                    label="Medicine"
                                    size='small'
                                    fullWidth
                                    disabled={router.asPath.endsWith('see-prescription') || singlePrescription.doctorId !== userProfile?._id}
                                  />
                                </FormControl>
                              </td>
                              <td>
                                <FormControl fullWidth>
                                  <TextField
                                    required
                                    id={`quantity${index}`}
                                    onKeyDown={(e) => {
                                      const allowKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Tab', 'Backspace', 'Enter', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End', '-']
                                      if (!allowKeys.includes(e.key)) {
                                        e.preventDefault()
                                      }
                                    }}
                                    autoComplete='off'
                                    error={errors?.['prescriptionsArray']?.[index]?.['quantity'] == undefined ? false : true}
                                    helperText={errors?.['prescriptionsArray']?.[index]?.['quantity'] && errors?.['prescriptionsArray']?.[index]?.['quantity']?.['message'] as ReactNode}
                                    {
                                    ...control.register(`prescriptionsArray.${index}.quantity`, {
                                      valueAsNumber: true,
                                      required: `This field is required `,
                                    })
                                    }
                                    label="Quantity"
                                    size='small'
                                    fullWidth
                                    disabled={router.asPath.endsWith('see-prescription') || singlePrescription.doctorId !== userProfile?._id}
                                  />
                                </FormControl>
                              </td>
                              <td>
                                <FormControl fullWidth>
                                  <TextField
                                    required
                                    multiline
                                    id={`description-${index}`}
                                    autoComplete='off'
                                    error={errors?.['prescriptionsArray']?.[index]?.['description'] == undefined ? false : true}
                                    helperText={errors?.['prescriptionsArray']?.[index]?.['description'] && errors?.['prescriptionsArray']?.[index]?.['description']?.['message'] as ReactNode}
                                    {
                                    ...control.register(`prescriptionsArray.${index}.description`, {
                                      required: `This field is required `,
                                    })
                                    }
                                    label="Description"
                                    size='small'
                                    fullWidth
                                    disabled={router.asPath.endsWith('see-prescription') || singlePrescription.doctorId !== userProfile?._id}
                                  />
                                </FormControl>
                              </td>
                              <td>
                                <Link href="" style={{ pointerEvents: singlePrescription.doctorId !== userProfile?._id ? 'none' : 'auto' }} onClick={(e) => {
                                  e.preventDefault();
                                  removeInputFields(index)
                                }} className="btn bg-danger-light trash">
                                  <i className="far fa-trash-alt"></i></Link>
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
                    Click here to sign
                  </div>
                  <div className="sign-name">
                    <p className="mb-0">({`Dr. ${doctorProfile?.firstName} ${doctorProfile?.lastName}`})</p>
                    <span className="text-muted">Signature</span>
                  </div>
                </div>
              </div>
            </div>

            {singlePrescription.doctorId == userProfile?._id && <div className="row">
              <div className="col-md-12">
                <div className="submit-section">
                  <button type="submit" className="btn btn-primary submit-btn">Save</button>
                  {/* <button className="btn btn-primary submit-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      singlePrescription?.prescriptionsArray.forEach((a: PrescriptionsArrayType, index: number) => {
                        if (getValues('prescriptionsArray').length == 0) {
                          setValue(`prescriptionsArray`, [...singlePrescription.prescriptionsArray])
                        } else {
                          setValue(`prescriptionsArray.${index}`, { ...a })
                        }

                      })
                    }}>Original</button> */}
                </div>
              </div>
            </div>}


          </form>
        </div>
      </div>
    </Fragment>
  )
});

export default EditPrescription;
