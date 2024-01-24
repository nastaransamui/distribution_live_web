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
import { base64regex } from '../Profile/ProfilePage';
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
import { OccupyTimeType } from '../Booking/Calendar';
import GooglePayButton from '@google-pay/button-react'
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';

export interface GoogleInfoType {
  totalPriceStatus: string;
  totalPriceLabel: string;
  totalPrice: string;
  currencyCode: string;
  countryCode: string;
}
const Checkout: FC = (() => {

  const router = useRouter()
  const theme = useTheme();
  const [reload, setReload] = useState<boolean>(false)
  const [termsDialog, setTermsDialog] = useState<boolean>(false)
  const [paypalDeferLoading, setPaypalDeferLoading] = useState<boolean>(true)
  const [profile, setProfile] = useState<DoctorProfileType | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<any>({
    totalPriceStatus: 'FINAL',
    totalPriceLabel: 'Total',
    totalPrice: '160.00',
    currencyCode: 'USD',
    countryCode: 'US',
  })
  const [occupyTime, setOccupyTime] = useState<OccupyTimeType>()
  const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const userData = useSelector((state: AppState) => state.userData.value)
  const { muiVar, bounce } = useScssVar();
  const searchParams = useSearchParams()
  const dispatch = useDispatch()
  const encryptReservation = searchParams.get('reservation')

  useEffect(() => {
    let active = true;
    if (encryptReservation && active) {
      if (base64regex.test(encryptReservation)) {
        let reservation = atob(encryptReservation as string)
        if (isJsonString(reservation)) {
          let resData = JSON.parse(reservation)
          const { dayPeriod, doctorId, finishDate, selectedDate, slot_id, startDate, timeSlot } = resData;
          if (homeSocket?.current) {
            homeSocket.current.emit(`findUserById`, { _id: doctorId })
            homeSocket.current.once(`findUserByIdReturn`, (msg: { status: number, user: DoctorProfileType, reason?: string }) => {
              const { status, user, reason } = msg;
              if (status !== 200) {
                toast.error(reason || `Error ${status} find Doctor`, {
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
                homeSocket.current.once(`updateFindUserById`, () => {
                  setReload(!reload)
                })
                setProfile(user)
              }
            })
          }
          setOccupyTime({ ...resData, patientId: userProfile?._id })
        }
      } else {
        router.back()
      }
    }

    return () => {
      active = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encryptReservation, homeSocket, reload, router])

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
      if (occupyTime && userProfile) {
        occupyTime.timeSlot.isReserved = true;
      }
      dispatch(updateHomeFormSubmit(true))
      if (homeSocket?.current) {
        homeSocket.current.emit(`reserveAppointment`, { ...occupyTime, paymentToken: data.paymentToken, paymentType: data.paymentType })
        homeSocket.current.once(`reserveAppointmentReturn`, (msg: { status: number, newReservationId: string, reason?: string, message?: string }) => {
          const { status, newReservationId, reason, message } = msg;
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
            toast.info('Booking reserved Successfully.', {
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
                router.push(`/doctors/payment-success/${btoa(newReservationId)}`)
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
        profile == null || userProfile == null ?
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
                      {/* <div className="exist-customer">Existing Customer? <Link href="#">Click here to login</Link></div> */}
                    </div>
                    <div className="payment-widget">


                      <div className="filter-grid">
                        <h4>
                          <Link data-bs-toggle="collapse" href="/doctors/check-out#collapseone">
                            Payment Method
                          </Link>
                        </h4>
                        <div id="collapseone" className="collapse show">
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
                              <Checkbox disabled={!userProfile || profile?._id === userProfile?._id} />} label="I have read and accept" />
                          <Link href=""
                            style={{ pointerEvents: !userProfile || profile?._id === userProfile?._id ? 'none' : 'auto' }}
                            aria-disabled={!userProfile || profile?._id === userProfile?._id}
                            tabIndex={!userProfile || profile?._id === userProfile?._id ? -1 : undefined}
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
                          disabled={profile?._id === userProfile?._id || getValues('paymentToken') == '' || !getValues('paymentConfirm') || getValues('paymentType') == ''}
                          type="submit"
                          className="btn btn-primary submit-btn">
                          {profile?._id === userProfile?._id ?
                            `You can't reserve to your own account.` :
                            getValues('paymentToken') == '' || !getValues('paymentConfirm') || getValues('paymentType') == '' ?
                              `Make payment first`
                              : `Reserve`}
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
                    <h4 className="card-title">Booking Summary</h4>
                  </div>
                  <div className="card-body">
                    <div className="booking-doc-info">
                      <Link target="_blank" rel="noopener noreferrer" href={`/doctors/profile/${btoa(profile?._id)}`} className="booking-doc-img">
                        <Avatar sx={{
                          width: 'auto',
                          height: 'auto',
                          transition: 'all 2000ms cubic-bezier(0.19, 1, 0.22, 1) 0ms',
                          "&:hover": {
                            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                            transform: "scale(1.15)",
                          },

                        }} variant="square" alt="" src={profile?.profileImage}
                          key={profile?.profileImage}
                        >
                          <img className="img-fluid" src={doctors_profile} alt="" />
                        </Avatar>
                      </Link>
                      <div className="booking-info">
                        <h4>
                          <Link target="_blank" rel="noopener noreferrer" href={`/doctors/profile/${btoa(profile?._id)}`}>
                            Dr. {profile?.firstName} {" "} {profile?.lastName}
                          </Link>
                        </h4>
                        <Rating name="read-only" value={4} readOnly size='small' />

                        <span className="d-inline-block average-rating">35</span>
                        <p className="text-muted mb-0">
                          <i className="fas fa-map-marker-alt"></i> &nbsp;
                          {profile?.city}  {profile?.country}
                        </p>
                      </div>
                    </div>
                    <div className="booking-summary">
                      <div className="booking-item-wrap">
                        <ul className="booking-fee booking-total">
                          <li>
                            Date &nbsp;<span>{dayjs(`${occupyTime?.selectedDate}`).format(`MMM D, YYYY`)}&nbsp;</span>
                          </li>
                          <li>
                            Time <span>&nbsp;{occupyTime?.timeSlot?.period}</span>
                          </li>
                        </ul>
                        <ul className="booking-fee booking-total">
                          <li>
                            Consulting Fee <span>$100</span>
                          </li>
                          <li>
                            Booking Fee <span>$10</span>
                          </li>
                          <li>
                            Video Call <span>$50</span>
                          </li>
                        </ul>
                        <div className="booking-total">
                          <ul className="booking-total-list">
                            <li>
                              <span>Total</span>
                              <span className="total-cost">$160</span>
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

export default Checkout;