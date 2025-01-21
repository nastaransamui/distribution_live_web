import { FC, Fragment, useEffect, ReactNode } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import { AppState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
import { formatNumberWithCommas } from './ScheduleTiming';
import InputAdornment from '@mui/material/InputAdornment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';
import { toast } from 'react-toastify';
import { DoctorProfileType } from '../SearchDoctorSections/SearchDoctorSection';
import { BillingDetailsArrayType, BillingType } from './AddBilling';
import _ from 'lodash';
import Chip from '@mui/material/Chip';

const initialState: BillingDetailsArrayType = {
  title: '',
  price: "",
  bookingsFee: "",
  bookingsFeePrice: '',
  total: '',
}

export interface BillingTypeWithDoctorProfile extends BillingType {
  doctorProfile: DoctorProfileType
}

const EditBilling: FC<{ singleBill: BillingTypeWithDoctorProfile }> = (({ singleBill }) => {
  const { muiVar, bounce } = useScssVar();
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const {
    formState: { errors },
    control,
    handleSubmit,
    reset,
    setValue: setFormValue,
    getValues: getFormValue,
    watch,
  } = useForm({
    defaultValues: {} as BillingType
  })

  useEffect(() => {
    if (singleBill) {
      let singleBillObj: any = Object.entries(singleBill)
      singleBillObj.map((a: any) => {
        if (a[0] !== 'doctorProfile') {
          setFormValue(a[0], a[1])
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleBill])

  const { fields: billsFields, append: appendBill, remove: removeBill } = useFieldArray<any>({
    control,
    name: "billDetailsArray"
  });
  const addInputField = () => {
    appendBill([{
      ...initialState,
      bookingsFee: userProfile?.bookingsFee,
    }])

  }
  const removeInputFields = (index: number) => {
    removeBill(index)
  }


  useEffect(() => {
    // Listen to changes in the billDetailsArray to update total price
    const subscription = watch((value) => {
      if (value?.billDetailsArray) {
        const billDetailsArray = value.billDetailsArray;

        // Calculate total price
        const totalPrice = billDetailsArray.reduce((sum, bill) => {
          return sum + (Number(bill?.price) || 0);
        }, 0);

        // Update total price and total (batch updates)
        const bookingsFee = Number(getFormValue('bookingsFee')) || 0;
        const bookingsFeePrice = (totalPrice * (bookingsFee / 100)).toFixed(2);
        const total = (totalPrice * (1 + bookingsFee / 100)).toFixed(2);
        // Use setFormValue to update only when values have actually changed
        if (getFormValue('price') !== totalPrice.toFixed(2)) setFormValue('price', totalPrice.toFixed(2));
        if (getFormValue('bookingsFeePrice') !== bookingsFeePrice) setFormValue('bookingsFeePrice', bookingsFeePrice);
        if (getFormValue('total') !== total) setFormValue('total', total);
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch, getFormValue, setFormValue]);
  const onBillSubmit = (data: BillingType) => {
    dispatch(updateHomeFormSubmit(true))

    homeSocket.current.emit('updateBilling', data)
    homeSocket.current.once('updateBillingReturn', (msg: { status: number, newBilling: BillingType, message?: string }) => {
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
        router.reload();
      }

    })
  }
  return (
    <Fragment>
      <div className="col-md-7 col-lg-8 col-xl-9" style={muiVar}>
        <div className="card">
          <div className="card-header">
            <h4 className="card-title mb-0">Edit Billing</h4>
          </div>
          {_.isEmpty(getFormValue()) ? <CircleToBlockLoading color={theme.palette.primary.main} size="small"
            style={{
              minWidth: '100%',
              display: 'flex',
              justifyContent: 'center',
            }} /> : <form noValidate onSubmit={handleSubmit(onBillSubmit)} className="card-body">
            <div className="row">
              <div className="col-sm-6">
                <div className="biller-info">
                  <h4 className="d-block">Dr. {`${userProfile?.firstName} ${userProfile?.lastName}`}</h4>
                  <span className="d-block text-sm text-muted">{userProfile?.specialities && userProfile?.specialities.length > 0 && userProfile?.specialities[0]?.specialities}</span>
                  <span className="d-block text-sm text-muted">
                    Country: {userProfile?.country || '-------'}<br />
                    State: {userProfile?.state || '-------'}<br />
                    City: {userProfile?.city || '-------'}
                  </span>
                </div>
              </div>
              <div className="col-sm-6 text-sm-end">
                <div className="billing-info">
                  <h4 className="d-block">{dayjs(getFormValue('createdAt')).format('DD MMMM YYYY')}</h4>
                  <span className="d-block text-muted">{getFormValue('invoiceId')!}</span>
                </div>
              </div>
            </div>


            <div style={{ display: 'flex', alignItems: "center", justifyContent: 'space-between', minHeight: '90px' }}>
              <div className="col-md-6">
                <div className="form-group mb-0">
                  <Controller
                    rules={{ required: 'This field is required' }}
                    name="dueDate"
                    control={control}
                    render={(props: any) => {
                      const { field, fieldState, formState } = props;
                      const { ref, onChange, value } = field;
                      const { defaultValues } = formState;
                      return (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <MobileDatePicker
                            closeOnSelect
                            disablePast
                            format="DD MMM YYYY"
                            onChange={(event: any) => {
                              onChange(dayjs(event).format(`YYYY-MM-DDTHH:mm:ss`));
                            }}
                            slotProps={{
                              textField: {
                                inputProps: { value: value == null ? 'Due Date' : dayjs(value).format('DD MMM YYYY') },
                                fullWidth: true,
                                required: false,
                                label: 'Due Date',
                                error: errors.dueDate == undefined ? false : true,
                                helperText: errors.dueDate && errors['dueDate']['message'] as ReactNode,
                                size: 'small'
                              },
                            }}
                            disabled={watch('status') == 'Paid'}
                            value={dayjs(defaultValues.dueDate)}
                          />
                        </LocalizationProvider>
                      )
                    }}
                  />
                </div>
              </div>
              {billsFields.length < 5 &&
                <div className="add-more text-end" onClick={addInputField} style={{ marginBottom: 8 }}>
                  <Link href="" onClick={(e) => { e.preventDefault() }} className="add-education"><i className="fa fa-plus-circle"></i> Add More</Link>
                </div>}
            </div>
            <div className="col-md-12">
              <div className="form-group mb-0" style={{ paddingLeft: '10px' }}>
                <Chip
                  color={
                    singleBill?.status == 'Paid' ? 'success' :
                      (dayjs(singleBill?.dueDate).isBefore(dayjs(), 'day') || dayjs(singleBill?.dueDate).isSame(dayjs(), 'day')) ? 'error' :
                        'primary'}
                  label={`${singleBill?.status !== 'Paid' && (dayjs(singleBill?.dueDate).isBefore(dayjs(), 'day') || dayjs(singleBill?.dueDate).isSame(dayjs(), 'day')) ? `Over Due` : singleBill?.status}`}

                  sx={{ color: '#000', fontSize: '18px', minWidth: '100%', height: '40px', mb: 3 }} />
              </div>
            </div>


            <div className="card card-table">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover table-center">
                    <thead>
                      <tr>

                        <th style={{ minWidth: 200, textAlign: 'center' }}>Title</th>
                        <th style={{ minWidth: 150, textAlign: 'center' }}>Price</th>
                        <th style={{ maxWidth: 50, textAlign: 'center' }}>Bookings Fee</th>
                        <th style={{ minWidth: 100, textAlign: 'center' }}>Fee Price</th>
                        <th style={{ minWidth: 100, textAlign: 'center' }}>Total</th>
                        <th style={{ width: 50 }} />
                      </tr>
                    </thead>
                    {
                      billsFields.map((data, index) => {
                        return (
                          <tbody key={index}>
                            <tr>
                              <td>
                                <FormControl fullWidth>
                                  <TextField
                                    required
                                    id={`title${index}`}
                                    autoComplete='off'
                                    error={errors?.['billDetailsArray']?.[index]?.['title'] == undefined ? false : true}
                                    helperText={errors?.['billDetailsArray']?.[index]?.['title'] && errors?.['billDetailsArray']?.[index]?.['title']?.['message'] as ReactNode}
                                    {
                                    ...control.register(`billDetailsArray.${index}.title`, {
                                      required: `This field is required `,
                                    })
                                    }
                                    label="Title"
                                    size='small'
                                    fullWidth
                                    disabled={router.asPath.endsWith('see-prescription') || watch('status') == 'Paid'}
                                  />
                                </FormControl>
                              </td>
                              <td>
                                <Controller
                                  rules={{
                                    required: "This field is required",
                                  }}
                                  name={`billDetailsArray.${index}.price`}
                                  control={control}
                                  render={(props: any) => {
                                    const { field, fieldState, formState } = props;
                                    const { ref, onChange } = field;
                                    return (
                                      <TextField
                                        required
                                        id={`price${index}`}
                                        onKeyDown={(e) => {
                                          const allowKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Tab', 'Backspace', 'Enter', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Tab']
                                          if (!allowKeys.includes(e.key)) {
                                            e.preventDefault()
                                          }
                                        }}
                                        autoComplete='off'
                                        label="Price"
                                        size='small'
                                        error={errors?.['billDetailsArray']?.[index]?.['price'] == undefined ? false : true}
                                        helperText={errors?.['billDetailsArray']?.[index]?.['price'] && errors?.['billDetailsArray']?.[index]?.['price']?.['message'] as ReactNode}
                                        fullWidth
                                        ref={ref}
                                        inputProps={{ style: { textTransform: 'lowercase' }, autoComplete: 'email' }}
                                        onChange={(e: any) => {
                                          setFormValue(`billDetailsArray.${index}.bookingsFeePrice`, ((Number(e.target.value) * (Number(getFormValue('bookingsFee')) / 100)).toFixed(2)).toString())
                                          setFormValue(`billDetailsArray.${index}.total`, Number((Number(e.target.value) * (1 + Number(getFormValue('bookingsFee')) / 100)).toFixed(2)).toString())
                                          onChange(e)
                                        }}
                                        disabled={router.asPath.endsWith('see-prescription') || watch('status') == 'Paid'}
                                        InputProps={{
                                          endAdornment:
                                            <InputAdornment position="end" >
                                              <span style={{
                                                fontSize: '12px',
                                                color: router.asPath.endsWith('see-prescription') || watch('status') == 'Paid'
                                                  ? theme.palette.text.disabled :
                                                  theme.palette.text.color
                                              }}>{userProfile?.currency[0]?.currency_symbol}</span>
                                            </InputAdornment>,
                                        }}
                                        value={watch(`billDetailsArray.${index}.price`)}
                                      />
                                    )
                                  }} />
                              </td>
                              <td>
                                <FormControl fullWidth>
                                  <TextField
                                    required
                                    id={`bookingsFee${index}`}
                                    autoComplete='off'
                                    {
                                    ...control.register(`billDetailsArray.${index}.bookingsFee`, {
                                      required: `This field is required `,
                                    })
                                    }
                                    label="Fee"
                                    size='small'
                                    fullWidth
                                    disabled
                                    value={watch(`billDetailsArray.${index}.bookingsFee`)}
                                    InputProps={{
                                      startAdornment:
                                        <InputAdornment position="start" >
                                          <span style={{ fontSize: '12px', color: theme.palette.text.disabled }}>%</span>
                                        </InputAdornment>,
                                    }}
                                  />
                                </FormControl>
                              </td>
                              <td>
                                <FormControl fullWidth>
                                  <TextField
                                    required
                                    id={`bookingsFeePrice${index}`}
                                    autoComplete='off'
                                    {
                                    ...control.register(`billDetailsArray.${index}.bookingsFeePrice`, {
                                      required: `This field is required `,
                                    })
                                    }
                                    InputLabelProps={{
                                      shrink: !!watch(`billDetailsArray.${index}.bookingsFeePrice`),
                                    }}
                                    label="Fee Price"
                                    size='small'
                                    fullWidth
                                    disabled
                                    InputProps={{
                                      endAdornment:
                                        <InputAdornment position="end" >
                                          <span style={{ fontSize: '12px', color: theme.palette.text.disabled }}>{userProfile?.currency[0]?.currency_symbol}</span>
                                        </InputAdornment>,
                                    }}
                                  />
                                </FormControl>
                              </td>
                              <td>
                                <FormControl fullWidth>
                                  <TextField
                                    required
                                    id={`total${index}`}
                                    autoComplete='off'
                                    {
                                    ...control.register(`billDetailsArray.${index}.total`, {
                                      required: `This field is required `,
                                    })
                                    }
                                    InputLabelProps={{
                                      shrink: !!watch(`billDetailsArray.${index}.total`),
                                    }}
                                    label="Total"
                                    size='small'
                                    fullWidth
                                    disabled
                                    InputProps={{
                                      endAdornment:
                                        <InputAdornment position="end" >
                                          <span style={{ fontSize: '12px', color: theme.palette.text.disabled }}>{userProfile?.currency[0]?.currency_symbol}</span>
                                        </InputAdornment>,
                                    }}
                                  />
                                </FormControl>
                              </td>
                              <td>
                                {!router.asPath.endsWith('see-billing') &&
                                  <Link href="" aria-label='delete' onClick={(e) => {
                                    e.preventDefault();
                                    removeInputFields(index)
                                    //
                                  }} className={`btn ${router.asPath.endsWith('see-prescription') || watch('status') == 'Paid' ? 'disabled' : ""}`}>
                                    <i className="far fa-trash-alt" style={{ color: '#000', }}></i></Link>}
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

            <div className="col-md-6 col-xl-4 ms-auto">
              <div className="table-responsive">
                <table className="invoice-table-two table">
                  <tbody>
                    <tr>
                      <th>Total Price:</th>
                      <td style={{ padding: '10px 0px' }}>
                        <span>{userProfile?.currency?.[0]?.currency || 'THB'}&nbsp; {formatNumberWithCommas(
                          watch('price')
                        )}</span>
                      </td>
                    </tr>
                    <tr>
                      <th>Total Fee Price:</th>
                      <td style={{ padding: '10px 0px' }}>
                        <span>{userProfile?.currency?.[0]?.currency || 'THB'}&nbsp; {formatNumberWithCommas(
                          watch('bookingsFeePrice')
                        )}</span>
                      </td>
                    </tr>
                    <tr>
                      <th>Total:</th>
                      <td style={{ padding: '10px 0px' }}>
                        <span>{userProfile?.currency?.[0]?.currency || 'THB'}&nbsp; {formatNumberWithCommas(
                          watch('total')
                        )}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>


            {!router.asPath.endsWith('see-billing') && <div className="row">
              <div className="col-md-12">
                <div className="submit-section">
                  <button type="submit" disabled={router.asPath.endsWith('see-prescription') || watch('status') == 'Paid'} className="btn btn-primary submit-btn">Save</button>
                  <button type="reset" disabled={router.asPath.endsWith('see-prescription') || watch('status') == 'Paid'} className="btn btn-primary submit-btn"
                    onClick={() => {
                      reset();
                      setFormValue('billDetailsArray.0.bookingsFee', userProfile?.bookingsFee!)
                      setFormValue('billDetailsArray.0.price', "")
                    }}>Clear</button>
                </div>
              </div>
            </div>}


          </form>}
        </div>
      </div>
    </Fragment >
  )
});

export default EditBilling;