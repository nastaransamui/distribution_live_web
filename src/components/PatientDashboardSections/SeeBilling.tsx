import { FC, Fragment, useEffect, ReactNode } from 'react'
import useScssVar from '@/hooks/useScssVar'
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

import InputAdornment from '@mui/material/InputAdornment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import _ from 'lodash';
import { BillingType } from '../DoctorDashboardSections/AddBilling';
import { formatNumberWithCommas, LoadingComponent } from '../DoctorDashboardSections/ScheduleTiming';
import { BillingTypeWithDoctorProfile } from '../DoctorDashboardSections/EditBilling';
import Chip from '@mui/material/Chip';
import { useRouter } from 'next/router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'


const SeeBilling: FC<{ singleBill: BillingTypeWithDoctorProfile }> = (({ singleBill }) => {
  const { muiVar, threeOptionMain } = useScssVar();
  const router = useRouter();
  const theme = useTheme();
  const {
    formState: { errors },
    control,
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



  return (
    <Fragment>
      <div className="col-md-12 col-lg-12 col-xl-12 animate__animated animate__backInUp" style={muiVar}>

        {_.isEmpty(getFormValue()) ?
          <div className="card">
            <LoadingComponent boxMinHeight="500px" />
          </div>
          :
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
              <h4 className="card-title mb-0">View The Bill</h4>
            </div>
            <form noValidate className="card-body">
              <div className="row">
                <div className="col-sm-6">
                  <div className="biller-info">
                    <h4 className="d-block">Dr. {`${singleBill?.doctorProfile?.fullName?.charAt(0).toUpperCase() + singleBill?.doctorProfile?.fullName!.slice(1)}`}</h4>
                    <span className="d-block text-sm text-muted">{singleBill?.doctorProfile?.specialities && singleBill?.doctorProfile?.specialities.length > 0 && singleBill?.doctorProfile?.specialities[0]?.specialities}</span>
                    <span className="d-block text-sm text-muted">
                      Country: {singleBill?.doctorProfile?.country || '-------'}<br />
                      State: {singleBill?.doctorProfile?.state || '-------'}<br />
                      City: {singleBill?.doctorProfile?.city || '-------'}
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
                              disabled
                              value={dayjs(defaultValues.dueDate)}
                            />
                          </LocalizationProvider>
                        )
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mb-0" style={{ paddingLeft: '10px' }}>
                    <Chip
                      color={
                        singleBill?.status == 'Paid' ? 'success' :
                          (dayjs(singleBill?.dueDate).isBefore(dayjs(), 'day') || dayjs(singleBill?.dueDate).isSame(dayjs(), 'day')) ? 'error' :
                            'primary'}
                      label={`${singleBill?.status !== 'Paid' && (dayjs(singleBill?.dueDate).isBefore(dayjs(), 'day') || dayjs(singleBill?.dueDate).isSame(dayjs(), 'day')) ? `Over Due` : singleBill?.status}`}

                      sx={{ color: '#000', fontSize: '18px', minWidth: '100%', height: '40px' }} />
                  </div>
                </div>
              </div>



              <div className="card card-table">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover table-center">
                      <thead>
                        <tr>

                          <th style={{ minWidth: 200, textAlign: 'center' }}>Title</th>
                          <th style={{ minWidth: 100, textAlign: 'center' }}>Total</th>
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
                                      disabled
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
                                      value={formatNumberWithCommas(getFormValue(`billDetailsArray.${index}.total`).toString())}
                                      fullWidth
                                      disabled
                                      InputProps={{
                                        startAdornment:
                                          <InputAdornment position="start" >
                                            <span style={{ color: theme.palette.text.disabled }}>{singleBill?.currencySymbol}</span>
                                          </InputAdornment>,
                                      }}
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

              <div className="col-md-6 col-xl-4 ms-auto">
                <div className="table-responsive">
                  <table className="invoice-table-two table">
                    <tbody>
                      <tr>

                      </tr>
                      <tr>
                        <th>Total:</th>
                        <td style={{ padding: '10px 0px' }}>
                          <span>{singleBill?.doctorProfile?.currency?.[0]?.currency || 'THB'}&nbsp; {formatNumberWithCommas(
                            watch('total').toString()
                          )}</span>
                        </td>
                      </tr>
                      <tr>

                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>



            </form>
          </div>}
      </div>
    </Fragment >
  )
});

export default SeeBilling;