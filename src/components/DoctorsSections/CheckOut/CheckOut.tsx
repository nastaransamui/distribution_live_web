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
import { useRouter, useSearchParams } from 'next/navigation';
import { base64regex } from '../Profile/PublicProfilePage';

import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { toast } from 'react-toastify';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import DialogTitle from '@mui/material/DialogTitle';

import { useForm, Controller } from 'react-hook-form';
import { emailRegex } from '@/components/PatientDashboardSections/ChangePassword';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import FormHelperText from '@mui/material/FormHelperText';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';

import GooglePayButton from '@google-pay/button-react'
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';
import { formatNumberWithCommas, LoadingComponent, TimeType } from '@/components/DoctorDashboardSections/ScheduleTiming';
import { Terms } from '@/components/TermsSections/TermsDetails';
import { FiThumbsUp } from 'react-icons/fi';
import Box from '@mui/material/Box';
import dataGridStyle from '@/components/shared/dataGridStyle';
import { BookingDoctorProfile } from '../Booking/BookingPage';
import CountdownTimer from '@/components/shared/CountdownTimer';

export interface GoogleInfoType {
  totalPriceStatus: string;
  totalPriceLabel: string;
  totalPrice: string;
  currencyCode: string;
  countryCode: string;
}

export interface CheckoutDataType {
  createdAt: Date,
  dayPeriod: string;
  doctorId: string;
  doctorProfile: BookingDoctorProfile;
  finishDate: Date;
  patientId: string;
  selectedDate: Date;
  expireAt: Date;
  slotId: string;
  startDate: Date;
  timeSlot: TimeType;
  updateAt: Date;
  _id: string;
}
const Checkout: FC = (() => {

  const router = useRouter()
  const { classes, theme } = dataGridStyle({})
  const [reload, setReload] = useState<boolean>(false)
  const [termsDialog, setTermsDialog] = useState<boolean>(false)
  const [checkoutData, setCheckoutData] = useState<CheckoutDataType>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showInfoWidget, setShowInfoWidget] = useState<boolean>(true);
  const [showPaymentWidget, setShowPaymentWidget] = useState<boolean>(false);
  const [updateMyInfo, setUpdateMyInfo] = useState<boolean>(false);
  const [paymentInfo, setPaymentInfo] = useState<any>({
    totalPriceStatus: '',
    totalPriceLabel: '',
    totalPrice: '',
    currencyCode: '',
    countryCode: '',
  })

  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const userData = useSelector((state: AppState) => state.userData.value)
  const { muiVar, bounce } = useScssVar();
  const searchParams = useSearchParams()
  const dispatch = useDispatch()
  const encryptID = searchParams.get('reservation')

  useEffect(() => {
    let active = true;
    if (encryptID && active) {
      if (base64regex.test(encryptID)) {
        let _id = atob(encryptID as string)
        if (homeSocket?.current) {
          homeSocket.current.emit(`findOccupyTimeForCheckout`, { occupyId: _id, patientId: userProfile?._id })
          homeSocket.current.once(`findOccupyTimeForCheckoutReturn`, (msg: {
            status: number,
            checkoutData: CheckoutDataType[],
            reason?: string,
            message?: string
          }) => {
            const { status, reason, message } = msg;
            if (status !== 200) {
              dispatch(updateHomeFormSubmit(true))
              toast.error(reason || message || `Error cant find occupation`, {
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
                  setIsLoading(false)
                  router.back()
                }
              });
            } else {
              const { checkoutData } = msg;
              if (checkoutData.length > 0) {
                setCheckoutData(checkoutData[0])
                setPaymentInfo({
                  totalPriceStatus: 'FINAL',
                  totalPriceLabel: 'Total',
                  totalPrice: checkoutData[0]?.timeSlot.total.toFixed(2),
                  currencyCode: checkoutData[0]?.timeSlot?.currencySymbol || 'THB',
                  countryCode: checkoutData[0]?.doctorProfile?.currency[0]?.iso2 || 'TH',
                })
              }

            }
            setIsLoading(false)
          })
        }

      } else {
        router.back()
      }
    }

    return () => {
      active = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encryptID, homeSocket, reload, router])
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


  const paymentConfirmed = () => {
    if (checkoutData) {
      const serverParams = {
        timeSlot: { ...checkoutData.timeSlot, isReserved: true },
        selectedDate: checkoutData.selectedDate,
        dayPeriod: checkoutData.dayPeriod,
        doctorId: checkoutData.doctorId,
        startDate: checkoutData.startDate,
        finishDate: checkoutData.finishDate,
        slotId: checkoutData.slotId,
        patientId: checkoutData.patientId,
        paymentToken: getValues('paymentToken'),
        paymentType: getValues('paymentType'),
      }
      const newProfileInfo = {
        email: getValues('email'),
        firstName: getValues('firstName'),
        lastName: getValues('lastName'),
        mobileNumber: getValues('mobileNumber')
      }
      if (homeSocket?.current) {
        homeSocket.current.emit(`reserveAppointment`,
          { serverParams, updateMyInfo, newProfileInfo, ocuppyId: checkoutData._id });
        homeSocket.current.once(`reserveAppointmentReturn`, (
          msg: {
            status: number,
            newReservationId: string,
            reason?: string,
            message?: string
          }) => {
          const { status, reason, message } = msg;
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
              toastId: 'submit-reservation',
              onClose: () => {
                toast.dismiss('submit-reservation')
              }
            });
          } else {
            const { newReservationId } = msg;
            toast.info('Booking reserved Successfully.', {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              transition: bounce,
              toastId: 'submit-done',
              onClose: () => {
                toast.dismiss('submit-done')
                router.push(`/doctors/payment-success/${btoa(newReservationId)}`)
              }
            });
          }
        })
      }
    } else {
      toast.error(`Error cant find occupation`, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        transition: bounce,
        toastId: "payment-confirm",
        onClose: () => {
          toast.dismiss('payment-confirm')
          router.back()
        }
      });
    }

  }

  const onFormSubmit = (data: any) => {
    setShowInfoWidget(false)
    setShowPaymentWidget(true)
  }

  //Listen to countdown and on finish trigger reload
  useEffect(() => {
    const checkExpire = setInterval(() => {
      if (checkoutData?.expireAt) {
        const now = dayjs();
        const expireTime = dayjs(checkoutData.expireAt);

        if (now.isAfter(expireTime)) {
          toast.error(`This reservation is expired you need to start again`, {
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
              setIsLoading(false)
              router.back()
            }
          });
          clearInterval(checkExpire);
        }
      }
    }, 1000);

    return () => clearInterval(checkExpire);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutData?.expireAt, router]);
  return (
    <Fragment>
      <div className="col-md-6 col-lg-7   animate__animated animate__backInUp" style={{ ...muiVar, position: 'relative' }}>
        <span style={{ width: '100%', display: 'flex', justifyContent: 'center', fontSize: 30, position: 'absolute', top: -60, }}>
          {checkoutData && <CountdownTimer expireAt={checkoutData?.expireAt} />}
        </span>
        <div className="card">
          {
            isLoading ?
              <>
                <div className="card-body">
                  <div className="table-responsive">
                    <Box sx={{ minHeight: '500px' }} className={classes.dataGridOuterBox}>
                      <LoadingComponent boxMinHeight='500px' />
                    </Box>
                  </div>
                </div>
              </> :
              <>

                <div className="card-header">
                  <h3 className="card-title">Billing details</h3>
                </div>
                <div className="card-body" >
                  <form noValidate onSubmit={handleSubmit(onFormSubmit)}>
                    <div className={`info-widget ${showInfoWidget ? 'info-widget-active' : 'info-widget-hide'}`}>
                      <span style={{ display: 'flex', alignItems: "center", justifyContent: "space-between" }}>
                        <h4 className="card-title">Personal Information</h4>
                        <FormControlLabel
                          sx={{ marginBottom: '25px', color: 'secondary.main' }}
                          control={<Checkbox
                            // sx={{ marginBottom: '25px' }}

                            checked={updateMyInfo}
                            onChange={() => { setUpdateMyInfo(!updateMyInfo) }}
                          />}
                          label="Update my profile with new information"
                        />
                      </span>
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
                                const { field, } = props;
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
                                const { field, fieldState } = props;
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

                      <div className="terms-accept">
                        <div className="custom-checkbox">
                          <FormControlLabel
                            checked={getValues('terms')}
                            {
                            ...register('terms', { required: 'Please accept terms and condition first.' })
                            }

                            required
                            control={
                              <Checkbox
                                disabled={!userProfile || checkoutData?.doctorId === userProfile?._id}
                              />} label="I have read and accept" />
                          <Link href=""
                            style={{ pointerEvents: !userProfile || checkoutData?.doctorId === userProfile?._id ? 'none' : 'auto' }}
                            aria-disabled={!userProfile || checkoutData?.doctorId === userProfile?._id}
                            tabIndex={!userProfile || checkoutData?.doctorId === userProfile?._id ? -1 : undefined}
                            onClick={(e) => {
                              e.preventDefault();
                              setTermsDialog(true)
                            }}>Terms &amp; Conditions</Link>
                          {errors.terms && errors.terms && (
                            <FormHelperText error={true}>Please accept terms and condition first.</FormHelperText>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={`payment-widget ${showPaymentWidget ? 'payment-widget-active' : 'payment-widget-hide'}`}>


                      <div className="filter-grid">
                        <h4>
                          Payment Method
                        </h4>
                        <div>
                          <div className="filter-collapse" style={{ paddingLeft: 5 }}>
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
                                paymentConfirmed()
                              }}
                              buttonColor={theme.palette.mode == 'dark' ? 'black' : 'white'}
                              buttonType='checkout'
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                    <div className="submit-section mt-4">
                      {showInfoWidget && <button
                        type="submit"
                        className="btn btn-primary submit-btn">
                        {checkoutData?.doctorId === userProfile?._id ?
                          `You can't reserve your own appointment.` :
                          // getValues('paymentToken') == '' || !getValues('paymentConfirm') || getValues('paymentType') == '' ?
                          //   watch('terms') ? `Make payment first` : `Accept Terms`
                          //   : 
                          `Reserve`}
                      </button>}
                      {errors.paymentConfirm && errors.paymentConfirm && (
                        <FormHelperText sx={{ mt: 2 }} error={true}>Please make payment frist.</FormHelperText>
                      )}
                    </div>
                  </form>
                </div>
              </>
          }
        </div>
      </div>
      <div className="col-md-5 col-lg-4 theiaStickySidebar  animate__animated animate__backInUp" >
        {
          isLoading ?
            <div className='card'>
              <div className="card-body">
                <div className="table-responsive">
                  <Box sx={{ minHeight: '500px' }} className={classes.dataGridOuterBox}>
                    <LoadingComponent boxMinHeight='500px' />
                  </Box>
                </div>
              </div>
            </div> :
            <>
              <StickyBox offsetTop={20} offsetBottom={20}>

                <div className="card booking-card">
                  <div className="card-header">
                    <h4 className="card-title">Booking Summary</h4>
                  </div>
                  <div className="card-body">
                    <div className="booking-doc-info">
                      <Link target="_blank" aria-label='booking-doc' rel="noopener noreferrer" href={`/doctors/profile/${btoa(checkoutData?.doctorId as string)}`} className="booking-doc-img">
                        <Avatar sx={{
                          width: 'auto',
                          height: 'auto',
                          transition: 'all 2000ms cubic-bezier(0.19, 1, 0.22, 1) 0ms',
                          "&:hover": {
                            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                            transform: "scale(1.15)",
                          },

                        }} variant="square" alt="" src={checkoutData?.doctorProfile?.profileImage}
                          key={checkoutData?.doctorProfile?.profileImage}
                        >
                          <img className="img-fluid" src={doctors_profile} alt="" />
                        </Avatar>
                      </Link>
                      <div className="booking-info">
                        <h4>
                          <Link target="_blank" rel="noopener noreferrer" href={`/doctors/profile/${btoa(checkoutData?.doctorId as string)}`}>
                            Dr. {checkoutData?.doctorProfile?.fullName}
                          </Link>
                        </h4>
                        <li style={{ marginBottom: 10, display: 'flex', alignItems: "center", color: theme.palette.text.color }}>
                          <FiThumbsUp style={{ marginBottom: '3px' }} />&nbsp;
                          {
                            `${checkoutData?.doctorProfile?.recommendArray && checkoutData?.doctorProfile?.recommendArray.length !== 0 ?
                              ((checkoutData?.doctorProfile?.recommendArray.filter(vote => vote === 1).length
                                / checkoutData?.doctorProfile?.recommendArray?.length) * 100).toFixed(0) : `0`}%`
                          }
                          <span className="votes">
                            (
                            {checkoutData?.doctorProfile?.recommendArray ? checkoutData?.doctorProfile?.recommendArray?.length : 0}
                            Votes)
                          </span>
                        </li>
                        {checkoutData && <Rating
                          name="read-only"
                          precision={0.5}
                          value={checkoutData?.doctorProfile?.rate_array.length == 0 ?
                            0 :
                            (checkoutData?.doctorProfile?.rate_array.reduce((acc, num) => acc + num, 0) / checkoutData?.doctorProfile?.rate_array.length)}
                          readOnly
                          size='small' />}

                        <p className="text-muted mb-0">
                          <i className="fas fa-map-marker-alt"></i> &nbsp;
                          {checkoutData?.doctorProfile?.city}  {checkoutData?.doctorProfile?.country}
                        </p>
                      </div>
                    </div>
                    <div className="booking-summary">
                      <div className="booking-item-wrap">
                        <ul className="booking-fee booking-total">
                          <li>
                            Date &nbsp;<span>{dayjs(`${checkoutData?.selectedDate}`).format(`MMM D, YYYY`)}&nbsp;</span>
                          </li>
                          <li>
                            Time <span>&nbsp;{checkoutData?.timeSlot?.period}</span>
                          </li>
                        </ul>
                        <ul className="booking-fee booking-total">
                          <li>
                            Consulting Fee <span>{checkoutData?.timeSlot?.currencySymbol || 'THB'} {" "} {formatNumberWithCommas(checkoutData?.timeSlot?.price.toString()!)}</span>
                          </li>
                          <li>
                            Booking Fee <span>{checkoutData?.timeSlot?.currencySymbol || 'THB'} {" "}{formatNumberWithCommas(
                              checkoutData?.timeSlot?.bookingsFeePrice.toString()!
                            )}</span>
                          </li>
                        </ul>
                        <div className="booking-total">
                          <ul className="booking-total-list">
                            <li>
                              <span>Total</span>
                              <span className="total-cost">
                                {checkoutData?.timeSlot?.currencySymbol || 'THB'}
                                {" "}
                                {formatNumberWithCommas(checkoutData?.timeSlot?.total.toString()!)}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </StickyBox>
            </>
        }
      </div>
      <Dialog
        open={termsDialog}
        onClose={() => setTermsDialog(false)}
        scroll='paper'
        aria-labelledby="terms"
        aria-describedby="terms&condition"
      >
        <DialogTitle id="terms">Terms &amp; Conditions</DialogTitle>
        <DialogContent dividers>
          <section className="terms-section" style={muiVar}>
            <div className="terms-content" style={{ marginLeft: '-2rem' }}>
              <Terms />
            </div>
          </section>
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
    </Fragment>
  )
});

export default Checkout;