import { FC, Fragment, useState, useEffect } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';

import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/router';
import FormLabel from '@mui/material/FormLabel';

export interface BillingType {
  title?: string;
  amount?: string;
}

const initialState: BillingType = {
  title: '',
  amount: '',
}

const AddBilling: FC = (() => {
  const { muiVar } = useScssVar();
  const router = useRouter();

  const [inputFields, setInputFields] = useState<BillingType[]>([initialState]);

  const addInputField = () => {
    setInputFields([...inputFields, {
    }])

  }
  const removeInputFields = (index: number) => {
    const rows = [...inputFields];
    rows.splice(index, 1);
    setInputFields(rows);
  }

  useEffect(() => {
    if (router.asPath.endsWith('editbilling')) {
      setInputFields([
        {
          title: 'Consulting Fee',
          amount: '$330',
        },
        {
          title: 'Video Calling Appointment',
          amount: '$100',
        }
      ])
    }
    if (router.asPath.endsWith('see-billing')) {
      setInputFields([
        {
          title: 'Consulting Fee',
          amount: '$330',
        },
        {
          title: 'Video Calling Appointment',
          amount: '$100',
        }
      ])
    }
  }, [router])



  const inputChange = (e: any, index: number, name: string) => {
    setInputFields((prevState: BillingType[]) => {
      let newPrev = [...prevState]
      let newVal = newPrev[index]
      newVal[name as keyof typeof newVal] = e.target.value
      return newPrev
    })
  }


  return (
    <Fragment>
      <div className="col-md-7 col-lg-8 col-xl-9" style={muiVar}>
        <div className="card">
          <div className="card-header">
            <h4 className="card-title mb-0">Add Billing</h4>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-6">
                <div className="biller-info">
                  <h4 className="d-block">Dr. Darren Elder</h4>
                  <span className="d-block text-sm text-muted">Dentist</span>
                  <span className="d-block text-sm text-muted">Newyork, United States</span>
                </div>
              </div>
              <div className="col-sm-6 text-sm-end">
                <div className="billing-info">
                  <h4 className="d-block">1 November 2019</h4>
                  <span className="d-block text-muted">#INV0001</span>
                </div>
              </div>
            </div>


            {/* <div className="add-more-item text-end">
              <Link href="" onClick={(e) => {
                e.preventDefault();
              }} ><i className="fas fa-plus-circle"></i> Add Item</Link>
            </div> */}
            {!router.asPath.endsWith('see-billing') && <div className="add-more text-end" onClick={addInputField} style={{ marginBottom: 8 }}>
              <Link href="#" onClick={(e) => { e.preventDefault() }} className="add-education"><i className="fa fa-plus-circle"></i> Add More</Link>
            </div>}



            <div className="card card-table">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover table-center">
                    <thead>
                      <tr>
                        <th style={{ minWidth: 200 }}>Title</th>
                        <th style={{ minWidth: 200 }}>Amount</th>
                        <th style={{ width: 80 }} />
                      </tr>
                    </thead>
                    {
                      inputFields.map((data, index) => {
                        return (
                          <tbody key={index}>
                            <tr>
                              <td>
                                <FormControl fullWidth>
                                  {/* Use FormLabel to associate it correctly */}
                                  <FormLabel htmlFor={`consult-title-${index}`} sx={{ display: 'none' }}>
                                    Title
                                  </FormLabel>
                                  <TextField
                                    required
                                    id={`consult-title-${index}`} // Directly set the id here
                                    name={`consult-title-${index}`}
                                    aria-label="Title"
                                    autoComplete="off"
                                    label="Title"
                                    value={data?.title || ''}
                                    onChange={(e) => inputChange(e, index, 'title')}
                                    size="small"
                                    fullWidth
                                    disabled={router.asPath.endsWith('see-billing')}
                                  />
                                </FormControl>
                              </td>
                              <td>
                                <FormControl fullWidth>
                                  <label htmlFor={`consult-amount-${index}`} style={{ display: "none" }}>Amount</label>
                                  <TextField
                                    required
                                    id={`consult-amount-${index}`}
                                    name={`consult-amount-${index}`}
                                    aria-label="Amount"
                                    autoComplete='off'
                                    label="Amount"
                                    value={data?.amount || ''}
                                    onChange={(e) => { inputChange(e, index, 'amount') }}
                                    size='small'
                                    fullWidth
                                    disabled={router.asPath.endsWith('see-billing')}
                                  />
                                </FormControl>
                              </td>
                              <td>
                                {!router.asPath.endsWith('see-billing') && <Link href="" onClick={(e) => {
                                  e.preventDefault();
                                  removeInputFields(index)
                                }} className="btn bg-danger-light trash">
                                  <i className="far fa-trash-alt"></i></Link>}
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

            {!router.asPath.endsWith('see-billing') && <div className="row">
              <div className="col-md-12 text-end">
                <div className="signature-wrap">
                  <div className="signature">
                    Click here to sign
                  </div>
                  <div className="sign-name">
                    <p className="mb-0">( Dr. Darren Elder )</p>
                    <span className="text-muted">Signature</span>
                  </div>
                </div>
              </div>
            </div>}

            {!router.asPath.endsWith('see-billing') && <div className="row">
              <div className="col-md-12">
                <div className="submit-section">
                  <button type="submit" className="btn btn-primary submit-btn">Save</button>
                  <button type="reset" className="btn btn-primary submit-btn" onClick={() => { setInputFields(() => { return [{ ...initialState }] }) }}>Clear</button>
                </div>
              </div>
            </div>}


          </div>
        </div>
      </div>
    </Fragment >
  )
});

export default AddBilling;