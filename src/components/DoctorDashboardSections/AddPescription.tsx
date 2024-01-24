import { FC, Fragment, useState, useEffect } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';

import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useRouter } from 'next/router';

export interface PriscriptionType {
  name?: string;
  quantity?: string;
  days?: string;
  Morning?: boolean;
  Afternoon?: boolean;
  Evening?: boolean;
  Night?: boolean;
}

const initialState: PriscriptionType = {
  name: '',
  quantity: '',
  days: '',
  Morning: false,
  Afternoon: false,
  Evening: false,
  Night: false,
}

const AddPescription: FC = (() => {
  const { muiVar } = useScssVar();
  const router = useRouter();

  const [inputFields, setInputFields] = useState<PriscriptionType[]>([initialState]);

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
    if (router.asPath.endsWith('editprescription')) {
      setInputFields([
        {
          name: 'Amoxapine',
          quantity: '2',
          days: '2 Days',
          Morning: true,
          Afternoon: false,
          Evening: true,
          Night: false,
        }, {
          name: 'Benazepril',
          quantity: '2',
          days: '1 Days',
          Morning: false,
          Afternoon: true,
          Evening: true,
          Night: false,
        }
      ])
    }
    if (router.asPath.endsWith('see-prescription')) {
      setInputFields([
        {
          name: 'Amoxapine',
          quantity: '2',
          days: '2 Days',
          Morning: true,
          Afternoon: false,
          Evening: true,
          Night: false,
        }, {
          name: 'Benazepril',
          quantity: '2',
          days: '1 Days',
          Morning: false,
          Afternoon: true,
          Evening: true,
          Night: false,
        }
      ])
    }
  }, [router])

  const timeSlotClick = (e: any, index: number, slot: string) => {

    setInputFields((prevState: PriscriptionType[]) => {
      let newPrev = [...prevState]
      let newVal = newPrev[index]
      newVal[slot as keyof typeof newVal] = e.target.checked
      return newPrev
    })
  }

  const inputChange = (e: any, index: number, name: string) => {
    setInputFields((prevState: PriscriptionType[]) => {
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
            <h4 className="card-title mb-0">Add Prescription</h4>
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
            {!router.asPath.endsWith('see-prescription') && <div className="add-more text-end" onClick={addInputField} style={{ marginBottom: 8 }}>
              <Link href="#" onClick={(e) => { e.preventDefault() }} className="add-education"><i className="fa fa-plus-circle"></i> Add More</Link>
            </div>}



            <div className="card card-table">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover table-center">
                    <thead>
                      <tr>
                        <th style={{ minWidth: '200p' }}>Name</th>
                        <th style={{ minWidth: '80px' }}>Quantity</th>
                        <th style={{ minWidth: '80px' }}>Days</th>
                        <th style={{ minWidth: '100px' }}>Time</th>
                        <th style={{ minWidth: '80px' }}></th>
                      </tr>
                    </thead>
                    {
                      inputFields.map((data, index) => {
                        return (
                          <tbody key={index}>
                            <tr>
                              <td>
                                <FormControl fullWidth>
                                  <TextField
                                    required
                                    id="outlined-required"
                                    autoComplete='off'
                                    value={data?.name || ''}
                                    onChange={(e) => { inputChange(e, index, 'name') }}
                                    size='small'
                                    fullWidth
                                    disabled={router.asPath.endsWith('see-prescription')}
                                  />
                                </FormControl>
                              </td>
                              <td>
                                <FormControl fullWidth>
                                  <TextField
                                    required
                                    id="outlined-required"
                                    autoComplete='off'
                                    value={data?.quantity || ''}
                                    onChange={(e) => { inputChange(e, index, 'quantity') }}
                                    size='small'
                                    fullWidth
                                    disabled={router.asPath.endsWith('see-prescription')}
                                  />
                                </FormControl>
                              </td>
                              <td>
                                <FormControl fullWidth>
                                  <TextField
                                    required
                                    id="outlined-required"
                                    autoComplete='off'
                                    size='small'
                                    value={data?.days || ''}
                                    onChange={(e) => { inputChange(e, index, 'days') }}
                                    fullWidth
                                    disabled={router.asPath.endsWith('see-prescription')}
                                  />
                                </FormControl>
                              </td>
                              <td>
                                <FormGroup row className="form-check form-check-inline">
                                  <FormControlLabel control={<Checkbox
                                    disabled={router.asPath.endsWith('see-prescription')}
                                    onChange={(e) => { timeSlotClick(e, index, 'Morning') }}
                                    checked={data?.Morning || false} size="small" style={{ width: "20px", padding: 0 }} />} label="Morning" />
                                  <FormControlLabel control={<Checkbox
                                    disabled={router.asPath.endsWith('see-prescription')}
                                    onChange={(e) => { timeSlotClick(e, index, 'Afternoon') }}
                                    checked={data?.Afternoon || false} size="small" style={{ width: "20px", padding: 0 }} />} label="Afternoon" />
                                  <FormControlLabel control={<Checkbox
                                    disabled={router.asPath.endsWith('see-prescription')}
                                    onChange={(e) => { timeSlotClick(e, index, 'Evening') }}
                                    checked={data?.Evening || false} size="small" style={{ width: "20px", padding: 0 }} />} label="Evening" />
                                  <FormControlLabel control={<Checkbox
                                    disabled={router.asPath.endsWith('see-prescription')}
                                    onChange={(e) => { timeSlotClick(e, index, 'Night') }}
                                    checked={data?.Night || false} size="small" style={{ width: "20px", padding: 0 }} />} label="Night" />
                                </FormGroup>
                              </td>
                              <td>
                                {!router.asPath.endsWith('see-prescription') && <Link href="" onClick={(e) => {
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

            {!router.asPath.endsWith('see-prescription') && <div className="row">
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

            {!router.asPath.endsWith('see-prescription') && <div className="row">
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
    </Fragment>
  )
});

export default AddPescription;