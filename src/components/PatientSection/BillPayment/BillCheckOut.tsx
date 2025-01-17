/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, ReactNode, useEffect, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link'
import StickyBox from 'react-sticky-box';
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { doctors_profile } from '@/public/assets/imagepath';
import dayjs from 'dayjs'
import isJsonString from '@/helpers/isJson';
import { useRouter, useSearchParams } from 'next/navigation';

import { DoctorProfileType } from '@/components/SearchDoctorSections/SearchDoctorSection';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { toast } from 'react-toastify';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { useTheme } from '@mui/material/styles';

import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';

import { useForm, Controller } from 'react-hook-form';
import { emailRegex } from '@/components/PatientDashboardSections/ChangePassword';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import FormHelperText from '@mui/material/FormHelperText';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';

import GooglePayButton from '@google-pay/button-react'
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';
import { formatNumberWithCommas } from '@/components/DoctorDashboardSections/ScheduleTiming';
import { BillingTypeWithDoctorProfile } from '@/components/DoctorDashboardSections/EditBilling';
import { base64regex } from '@/components/DoctorsSections/Profile/ProfilePage';
import { BillingDetailsArrayType, BillingType } from '@/components/DoctorDashboardSections/AddBilling';

export interface GoogleInfoType {
  totalPriceStatus: string;
  totalPriceLabel: string;
  totalPrice: string;
  currencyCode: string;
  countryCode: string;
}
const BillCheckOut: FC = (() => {

  const router = useRouter()
  const theme = useTheme();
  const [reload, setReload] = useState<boolean>(false)
  const [termsDialog, setTermsDialog] = useState<boolean>(false)
  const [paymentInfo, setPaymentInfo] = useState<any>({
    totalPriceStatus: '',
    totalPriceLabel: '',
    totalPrice: '',
    currencyCode: '',
    countryCode: '',
  })
  const [singleBill, setSingleBill] = useState<BillingTypeWithDoctorProfile>();
  const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const userData = useSelector((state: AppState) => state.userData.value)
  const { muiVar, bounce } = useScssVar();
  const searchParams = useSearchParams()
  const dispatch = useDispatch()
  const encryptId = searchParams.get('_id')

  useEffect(() => {
    let active = true;
    if (encryptId && active) {
      if (base64regex.test(encryptId)) {
        let _id = atob(encryptId as string)

        if (homeSocket?.current) {
          homeSocket.current.emit(`getSingleBillingForPatient`, { billing_id: _id, patientId: userProfile?._id })
          homeSocket.current.once(`getSingleBillingForPatientReturn`, (msg: { status: number, singleBill: BillingTypeWithDoctorProfile[], reason?: string }) => {
            const { status, singleBill, reason } = msg;
            if (status !== 200) {
              toast.error(reason || `Error ${status} find Bill`, {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                transition: bounce,
                onClose: () => {
                  router.back()
                }
              });
            } else {
              homeSocket.current.once(`updateGetSingleBillingForPatientReturn`, () => {
                setReload(!reload)
              })
              if (singleBill && singleBill.length > 0) {
                setSingleBill(singleBill[0])
                setValue('paymentToken', singleBill[0]?.paymentToken)
                setValue('paymentType', singleBill[0]?.paymentType)
                if (singleBill[0]?.paymentToken !== '' || singleBill[0]?.paymentType !== '') {
                  setValue('paymentConfirm', true);
                  setValue("terms", true)
                }
                setPaymentInfo({
                  totalPriceStatus: 'FINAL',
                  totalPriceLabel: 'Total',
                  totalPrice: Number(singleBill[0].total).toFixed(2),
                  currencyCode: singleBill[0]?.currencySymbol || 'THB',
                  countryCode: userProfile?.country || 'TH',
                })
              }

            }
          })
        }

      } else {
        router.back()
      }
    }

    return () => {
      active = false;
    }

  }, [encryptId, homeSocket, reload, router])

  const {
    register,
    clearErrors,
    formState: { errors },
    getValues,
    setValue,
    handleSubmit,
    control,
    watch,
    setError
  } = useForm({
    defaultValues: {
      firstName: userProfile?.firstName,
      lastName: userProfile?.lastName,
      email: userProfile?.userName,
      mobileNumber: userProfile?.mobileNumber,
      terms: false,
      paymentConfirm: false,
      paymentToken: '',
      paymentType: ''
    }
  })
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      switch (true) {
        case value[name as keyof typeof value] == '':
          setError(name as keyof typeof value, { type: 'required', message: "This field is required" })
        case name == 'email':
          if (value[name as keyof typeof value] == '') {
            setError(name as keyof typeof value, { type: 'required', message: "This field is required" })
          } else {
            if ((value[name as keyof typeof value] as string)?.match(emailRegex)?.length == undefined) {
              setError(name as keyof typeof value, { type: 'pattern', message: "Email should looks like an email." })
            } else {
              clearErrors(name)
            }
          }
          break;
        default:
          clearErrors(name)
      }

    })
    return () => subscription.unsubscribe();

  }, [clearErrors, setError, watch])

  const onFormSubmit = (data: any) => {
    const { paymentConfirm } = data
    if (!paymentConfirm) {
      setError('paymentConfirm', { type: 'required', message: "This field is required" })
    } else {
      dispatch(updateHomeFormSubmit(true))
      if (homeSocket?.current) {
        homeSocket.current.emit(`updateBillingPayment`, { ...singleBill, paymentToken: data.paymentToken, paymentType: data.paymentType, status: "Paid" })
        homeSocket.current.once(`updateBillingPaymentReturn`, (msg: { status: number, newBilling: BillingType, reason?: string, message?: string }) => {
          const { status, newBilling, reason, message } = msg;

          if (status !== 200) {
            toast.error(reason || message || `${status} : You don't have correct access for this`, {
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
            toast.info('Payment done Successfully.', {
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
                router.push(`/patient/payment-success/${btoa(newBilling?._id)}`)
              }
            });
          }
        })
      }
    }
  }

  return (
    <Fragment>
      <Dialog
        open={termsDialog}
        onClose={() => setTermsDialog(false)}
        scroll='paper'
        aria-labelledby="terms"
        aria-describedby="terms&condition"
      >
        <DialogTitle id="terms">Terms &amp; Conditions</DialogTitle>
        <DialogContent dividers>
          <DialogContentText
            id="terms&condition"
            tabIndex={-1}
          >
            {[...new Array(50)]
              .map(
                () => `Cras mattis consectetur purus sit amet fermentum.
                        Cras justo odio, dapibus ac facilisis in, egestas eget quam.
                        Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                        Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`,
              )
              .join('\n')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setValue('terms', false)
            setError('terms', { type: 'required', message: `Please accept terms and condition first.` })
            setTermsDialog(false)
          }}>Cancel</Button>
          <Button onClick={() => {
            setValue('terms', true)
            clearErrors('terms')
            setTermsDialog(false)
          }
          }>Accept</Button>
        </DialogActions>
      </Dialog>
      {
        !singleBill || userProfile == null ?
          <CircleToBlockLoading color={theme.palette.primary.main} size="small" style={{
            minWidth: '100%',
            display: 'flex',
            justifyContent: 'center',
          }} />
          :
          <Fragment>


            <div className="col-md-6 col-lg-7" style={muiVar}>
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title" style={{ textAlign: 'center' }}>Due Date: {dayjs(singleBill?.dueDate).format(`MMM D, YYYY`)}</h3>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Billing details</h3>
                </div>
                <div className="card-body">
                  <form noValidate onSubmit={handleSubmit(onFormSubmit)}>
                    <div className="info-widget">
                      <h4 className="card-title">Personal Information</h4>
                      <div className="row">
                        <div className="col-md-6 col-sm-12">
                          <div className="form-group card-label">
                            <TextField
                              required
                              id="firstName"
                              label="First Name"
                              size="small"
                              error={errors.firstName == undefined ? false : true}
                              helperText={errors.firstName && errors['firstName']['message'] as ReactNode}
                              {
                              ...register('firstName', {
                                required: "This field is required",
                              })
                              }
                              autoComplete='off'
                              fullWidth
                            />
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                          <div className="form-group card-label">
                            <TextField
                              required
                              id="lastName"
                              label="Last Name"
                              size="small"
                              error={errors.lastName == undefined ? false : true}
                              helperText={errors.lastName && errors['lastName']['message'] as ReactNode}
                              {
                              ...register('lastName', {
                                required: "This field is required",
                              })
                              }
                              autoComplete='off'
                              fullWidth
                            />
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                          <div className="form-group card-label">
                            <Controller
                              rules={{
                                pattern: {
                                  value: emailRegex,
                                  message: 'Email should looks like an email.'
                                }
                              }}
                              name='email'
                              control={control}
                              render={(props: any) => {
                                const { field, fieldState, formState } = props;
                                const { ref, onChange } = field;
                                return (
                                  <TextField
                                    required
                                    autoComplete='email'
                                    id='email'
                                    label="Email"
                                    size='small'
                                    value={field.value}
                                    error={errors.email == undefined ? false : true}
                                    helperText={errors.email && errors['email']['message'] as ReactNode}
                                    fullWidth
                                    ref={ref}
                                    onChange={(e: any) => {
                                      e.target.value = e.target.value.replace(/^\s+/, '').replace(/\s+$/, '')
                                      onChange(e)
                                    }}
                                  />
                                )
                              }} />
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                          <div className="form-group card-label">
                            <Controller
                              rules={{
                                validate: (val) => {
                                  if (val !== undefined) {
                                    return matchIsValidTel(val)
                                  }
                                }
                              }}
                              name='mobileNumber'
                              control={control}
                              render={(props: any) => {
                                const { field, fieldState, formState } = props;
                                const { ref, onChange } = field;
                                return (
                                  <MuiTelInput
                                    {...field}
                                    InputLabelProps={{ shrink: true }}
                                    defaultCountry={userData?.countryCode}
                                    helperText={fieldState.invalid ? "Mobile Number is invalid" : ""}
                                    error={fieldState.invalid}
                                    label="Mobile"
                                    size='small'
                                    required
                                    fullWidth
                                  />
                                )
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="payment-widget">


                      <div className="filter-grid">
                        <h4>
                          <Link data-bs-toggle="collapse" href="/doctors/check-out#collapseone">
                            {watch('paymentConfirm') ? `Paid already` : `Payment Method`}
                          </Link>
                        </h4>
                        {!watch('paymentConfirm') &&
                          <div id="collapseone" className={`collapse ${watch('paymentConfirm') ? 'hide' : 'show'}`}>
                            <div className="filter-collapse">
                              <GooglePayButton
                                environment="TEST"
                                paymentRequest={{
                                  apiVersion: 2,
                                  apiVersionMinor: 0,
                                  allowedPaymentMethods: [
                                    {
                                      type: 'CARD',
                                      parameters: {
                                        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                                        allowedCardNetworks: ['MASTERCARD', 'VISA'],
                                      },
                                      tokenizationSpecification: {
                                        type: 'PAYMENT_GATEWAY',
                                        parameters: {
                                          gateway: 'example',
                                          gatewayMerchantId: 'exampleGatewayMerchantId',
                                        },
                                      },
                                    },
                                  ],
                                  merchantInfo: {
                                    merchantId: '12345678901234567890',
                                    merchantName: 'Demo Merchant',
                                  },
                                  transactionInfo: paymentInfo,
                                }}
                                onCancel={reason => { console.log(reason) }}
                                onLoadPaymentData={paymentRequest => {
                                  const { paymentMethodData } = paymentRequest
                                  const { tokenizationData } = paymentMethodData
                                  const { token, type } = tokenizationData
                                  setValue('paymentToken', token);
                                  setValue('paymentType', type)
                                  setValue('paymentConfirm', true)
                                  clearErrors('paymentConfirm')
                                }}
                                buttonColor={theme.palette.mode == 'dark' ? 'black' : 'white'}
                                buttonType='checkout'
                              />
                            </div>
                          </div>
                        }
                      </div>

                      <div className="terms-accept">
                        <div className="custom-checkbox">
                          <FormControlLabel
                            checked={getValues('terms')}
                            {
                            ...register('terms', { required: 'Please accept terms and condition first.' })
                            }

                            required
                            control={
                              <Checkbox disabled={!userProfile} />} label="I have read and accept" />
                          <Link href=""
                            style={{ pointerEvents: !userProfile ? 'none' : 'auto' }}
                            aria-disabled={!userProfile}
                            tabIndex={!userProfile ? -1 : undefined}
                            onClick={(e) => {
                              e.preventDefault();
                              setTermsDialog(true)
                            }}>Terms &amp; Conditions</Link>
                          {errors.terms && errors.terms && (
                            <FormHelperText error={true}>Please accept terms and condition first.</FormHelperText>
                          )}
                        </div>
                      </div>
                      <div className="submit-section mt-4">
                        <button
                          disabled={getValues('paymentToken') == '' || !getValues('paymentConfirm') || getValues('paymentType') == ''}
                          type="submit"
                          className="btn btn-primary submit-btn">
                          {
                            getValues('paymentToken') == '' || !getValues('paymentConfirm') || getValues('paymentType') == '' ?
                              `Make payment first`
                              : `View details`}
                        </button>
                        {errors.paymentConfirm && errors.paymentConfirm && (
                          <FormHelperText sx={{ mt: 2 }} error={true}>Please make payment frist.</FormHelperText>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-5 col-lg-4 theiaStickySidebar" style={muiVar}>
              <StickyBox offsetTop={20} offsetBottom={20}>

                <div className="card booking-card">
                  <div className="card-header">
                    <h4 className="card-title">Bill Summary</h4>
                  </div>
                  <div className="card-body">
                    <div className="booking-doc-info">
                      <Link target="_blank" aria-label='booking-doc' rel="noopener noreferrer" href={`/doctors/profile/${btoa(singleBill?.doctorId)}`} className="booking-doc-img">
                        <Avatar sx={{
                          width: 'auto',
                          height: 'auto',
                          transition: 'all 2000ms cubic-bezier(0.19, 1, 0.22, 1) 0ms',
                          "&:hover": {
                            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                            transform: "scale(1.15)",
                          },

                        }} variant="square" alt="" src={singleBill?.doctorProfile?.profileImage}
                          key={singleBill?.doctorProfile?.profileImage}
                        >
                          <img className="img-fluid" src={doctors_profile} alt="" />
                        </Avatar>
                      </Link>
                      <div className="booking-info">
                        <h4>
                          <Link target="_blank" rel="noopener noreferrer" href={`/doctors/profile/${btoa(singleBill?.doctorId)}`}>
                            Dr. {singleBill?.doctorProfile?.firstName} {" "} {singleBill?.doctorProfile?.lastName}
                          </Link>
                        </h4>
                        <Rating name="read-only" value={4} readOnly size='small' />

                        <span className="d-inline-block average-rating">35</span>
                        <p className="text-muted mb-0">
                          <i className="fas fa-map-marker-alt"></i> &nbsp;
                          {singleBill?.doctorProfile?.city}  {singleBill?.doctorProfile?.country}
                        </p>
                      </div>
                    </div>
                    <div className="booking-summary">
                      <div className="booking-item-wrap">
                        <ul className="booking-fee booking-total">
                          <li>Invoice Id &nbsp; <span>{singleBill?.invoiceId}</span></li>
                          <li>Title &nbsp; <span>Price</span></li>
                          {
                            singleBill?.billDetailsArray.map((bill: BillingDetailsArrayType, index: number) => {
                              let singleBillObj: any = Object.entries(bill)

                              return (
                                <li key={index}>
                                  {
                                    singleBillObj.map(([key, value]: [string, any], index: number) => {
                                      if (key !== 'doctorProfile') {
                                        if (key === 'title' || key === 'total') {
                                          return (
                                            <div key={key}>
                                              {
                                                singleBillObj[index][0] == 'title'
                                                && singleBillObj[index][1]
                                              } &nbsp;
                                              <span>
                                                {
                                                  singleBillObj[index][0] == 'total'
                                                  && `${singleBill?.currencySymbol} ${formatNumberWithCommas(singleBillObj[index][1])}`
                                                }
                                              </span>
                                            </div>
                                          );
                                        }
                                      }
                                      return null;
                                    })
                                  }
                                </li>
                              )
                            })
                          }
                        </ul>
                        <div className="booking-total">
                          <ul className="booking-total-list">
                            <li>
                              <span>Total</span>
                              <span className="total-cost">
                                {singleBill?.currencySymbol || 'THB'}
                                {" "}
                                {formatNumberWithCommas(singleBill?.total)}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </StickyBox>
            </div>
          </Fragment >
      }
    </Fragment>
  )
});

export default BillCheckOut;