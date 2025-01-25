import { FC, Fragment, ReactNode, useEffect, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link'
import StickyBox from 'react-sticky-box';
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { useRouter } from 'next/router';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { LoginBox } from '@/components/AuthSections/LoginSection';
import { Transition } from '@/components/shared/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { Controller, useForm } from 'react-hook-form';
import { emailRegex } from '@/components/PatientDashboardSections/ChangePassword';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import GeoLocationAutocomplete from '@/shared/GeoLocationAutocomplete';
import FormHelperText from '@mui/material/FormHelperText';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';


import GooglePayButton from '@google-pay/button-react'
import { Terms } from '../TermsSections/TermsDetails';
const Checkout: FC = (() => {
  const { muiVar, theme } = useScssVar();
  const router = useRouter()
  const dispatch = useDispatch()
  const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const userData = useSelector((state: AppState) => state.userData.value)
  const [loginDialog, setLoginDialog] = useState<boolean>(false)
  const [differentAddress, setDifferentAddress] = useState<boolean>(false)
  const [termsDialog, setTermsDialog] = useState<boolean>(false)
  const [paymentInfo, setPaymentInfo] = useState<any>({
    totalPriceStatus: 'FINAL',
    totalPriceLabel: 'Total',
    totalPrice: '160.00',
    currencyCode: 'USD',
    countryCode: 'US',
  })
  const {
    register,
    clearErrors,
    formState: { errors },
    getValues,
    setValue: setFormValue,
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
      address1: userProfile?.address1,
      address2: userProfile?.address2,
      country: userProfile?.country || '',
      state: '',
      city: '',
      orderNotes: '',
      differentAddress: differentAddress,
      terms: false,
      paymentConfirm: false,
      paymentToken: '',
      paymentType: ''
    }
  })
  const [value, setValue] = useState<any>({
    city: null,
    state: null,
    country: null,
  });
  const [inputValue, setInputValue] = useState({
    city: '',
    state: '',
    country: '',
  });
  const [disable, setDisable] = useState({
    city: false,
    state: false,
    country: false,
  })
  const onFormSubmit = (data: any) => {
    router.push('/pharmacy/payment-success')
    setTimeout(() => {
      router.reload();
    }, 500);
    // const { paymentConfirm } = data
    // if (!paymentConfirm) {
    //   setError('paymentConfirm', { type: 'required', message: "This field is required" })
    // } else {
    //   // dispatch(updateHomeFormSubmit(true))
    //   // dispatch(updateHomeFormSubmit(false))
    //   router.push('/pharmacy/payment-success')
    //   router.reload();

    // }
  }
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
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])


  useEffect(() => {
    if (userProfile !== null && isClient) {
      setInputValue({
        city: userProfile?.city || '',
        state: userProfile?.state || '',
        country: userProfile?.country || ''
      })
      !!userProfile?.city && clearErrors('city')
      !!userProfile?.state && clearErrors('state')
      !!userProfile?.country && clearErrors('country')
      !!userProfile?.city && setFormValue('city', userProfile?.city)
      !!userProfile?.state && setFormValue('state', userProfile?.state)
      !!userProfile?.country && setFormValue('country', userProfile.country)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile, isClient])

  const shipDifferentFunction = () => {
    if (differentAddress) {
      setDifferentAddress(false);
      setFormValue("address1", userProfile?.address1);
      setFormValue("address2", userProfile?.address2);
      setFormValue("country", userProfile?.country || '');
      setFormValue("state", userProfile?.state || '');
      setFormValue("city", userProfile?.city || '');
      setValue({
        city: getValues('city') == '' ? null : getValues('city'),
        state: getValues('state') == '' ? null : getValues('state'),
        country: getValues('country') == '' ? null : getValues('country'),
      })
      setInputValue({
        city: getValues('city') || '',
        state: getValues('state') || '',
        country: getValues('country') || '',
      })
    } else {
      setDifferentAddress(true);
      setFormValue("address1", '');
      setFormValue("address2", '');
      setFormValue("country", '');
      setFormValue("state", '');
      setFormValue("city", '');
      setValue({
        city: null,
        state: null,
        country: null,
      })
      setInputValue({
        city: '',
        state: '',
        country: '',
      })
    }
  }
  return (
    <Fragment>
      <div className="col-md-6 col-lg-7" style={muiVar}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Billing details</h3>
          </div>
          <div className="card-body">
            {/* Checkout Form */}
            <form noValidate onSubmit={handleSubmit(onFormSubmit)}>
              {/* Personal Information */}
              <div className="info-widget">
                <h4 className="card-title">Personal Information</h4>
                <div className="row">
                  <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label">
                      <TextField
                        disabled={!userProfile}
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
                        autoComplete='name'
                        fullWidth
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label">
                      <TextField
                        disabled={!userProfile}
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
                        autoComplete='name'
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
                              disabled={!userProfile}
                              required
                              autoComplete='email'
                              id='email-checkout'
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
                              disabled={!userProfile}
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
                {!userProfile && <div className="exist-customer">Existing Customer?&nbsp;
                  <Link href="#" onClick={(e) => {
                    e.preventDefault();
                    setLoginDialog(true)
                  }}>Click here to login</Link></div>}
              </div>
              {/* /Personal Information */}
              {/* Shipping Details */}
              <div className="info-widget">
                <h4 className="card-title">Shipping Details</h4>
                <div className="row">
                  <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label">
                      <TextField
                        disabled={!userProfile}
                        required
                        id="address1"
                        label="Address 1"
                        size="small"
                        error={errors.address1 == undefined ? false : true}
                        helperText={errors.address1 && errors['address1']['message'] as ReactNode}
                        {
                        ...register('address1', {
                          required: "This field is required",
                        })
                        }
                        autoComplete='address'
                        fullWidth
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label">
                      <TextField
                        disabled={!userProfile}
                        id="address2"
                        label="Address 2"
                        size="small"
                        {
                        ...register('address2',)
                        }
                        autoComplete='address'
                        fullWidth
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <GeoLocationAutocomplete
                        required={true}
                        errors={errors}
                        register={register}
                        name='country'
                        setFormValue={setFormValue}
                        optionFieldName="name"
                        getValues={getValues}
                        clearErrors={clearErrors}
                        value={value}
                        setValue={setValue}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        disable={!userProfile ? { country: true } : disable}
                        setDisable={setDisable}
                        size='small'
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <GeoLocationAutocomplete
                        required={true}
                        errors={errors}
                        register={register}
                        name='state'
                        setFormValue={setFormValue}
                        optionFieldName="name"
                        getValues={getValues}
                        clearErrors={clearErrors}
                        value={value}
                        setValue={setValue}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        disable={!userProfile ? { state: true } : disable}
                        setDisable={setDisable}
                        size='small'
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-12">
                    <div className="form-group">
                      <GeoLocationAutocomplete
                        required={true}
                        errors={errors}
                        register={register}
                        name='city'
                        setFormValue={setFormValue}
                        optionFieldName="name"
                        getValues={getValues}
                        clearErrors={clearErrors}
                        value={value}
                        setValue={setValue}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        disable={!userProfile ? { city: true } : disable}
                        setDisable={setDisable}
                        size='small'
                      />
                    </div>
                  </div>
                </div>
                <div className="terms-accept">
                  <div className="custom-checkbox">
                    <FormControlLabel control={
                      <Checkbox
                        disabled={!userProfile}
                        checked={differentAddress}
                        onChange={shipDifferentFunction} />}
                      label="Ship to a different address?"
                      name='different address' />
                  </div>
                </div>
                <div className="form-group card-label">
                  <TextField
                    multiline
                    minRows={4}
                    label="Order notes (Optional)"
                    sx={{ mt: 2 }}
                    id="orderNotes"
                    size="small"
                    {
                    ...register('orderNotes')
                    }
                    autoComplete='off'
                    fullWidth
                  />
                </div>
              </div>
              <div className="payment-widget">


                <div className="filter-grid">
                  <h4>
                    <Link data-bs-toggle="collapse" href={!userProfile ? '#' : '/doctors/check-out#collapseone'}>
                      Payment Method
                    </Link>
                  </h4>
                  <div id="collapseone" className={`collapse ${!userProfile ? 'hide' : 'show'}`}>
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
                          setFormValue('paymentToken', token);
                          setFormValue('paymentType', type)
                          setFormValue('paymentConfirm', true)
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
                  <Tooltip arrow title={!userProfile ? 'Login in to continue.' : ""}>
                    <span>
                      <button
                        disabled={getValues('paymentToken') == '' || !getValues('paymentConfirm') || getValues('paymentType') == ''}
                        type="submit"
                        className="btn btn-primary submit-btn">
                        {getValues('paymentToken') == '' || !getValues('paymentConfirm') || getValues('paymentType') == '' ?
                          `Make payment first`
                          : `Confirm shoping`}
                      </button>
                    </span>
                  </Tooltip>
                  {/* <button type="submit" className="btn btn-primary submit-btn">Confirm and Pay</button> */}
                  {errors.paymentConfirm && errors.paymentConfirm && (
                    <FormHelperText sx={{ mt: 2 }} error={true}>Please make payment first.</FormHelperText>
                  )}
                </div>
              </div>
            </form>
            {/* /Checkout Form */}
          </div>
        </div>
      </div>
      <div className="col-md-6 col-lg-5 theiaStickySidebar" style={muiVar}>
        <StickyBox offsetTop={20} offsetBottom={20}>
          {/* Booking Summary */}
          <div className="card booking-card">
            <div className="card-header">
              <h3 className="card-title">Your Order</h3>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-center mb-0">
                  <tbody><tr>
                    <th>Product</th>
                    <th className="text-end">Total</th>
                  </tr>
                  </tbody><tbody>
                    <tr>
                      <td>Safi Natural Blood Purifier Syrup 200 ml Manufactured By Hamdard (Wakf) Laboratories</td>
                      <td className="text-end">$200</td>
                    </tr>
                    <tr>
                      <td>Safi Natural Blood Purifier Syrup 200 ml</td>
                      <td className="text-end">$200</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="booking-summary pt-5">
                <div className="booking-item-wrap">
                  <ul className="booking-date">
                    <li>Subtotal: &nbsp;<span>$5,877.00</span></li>
                    <li>Shipping: &nbsp;<span>$25.00</span></li>
                  </ul>
                  <ul className="booking-fee">
                    <li>Tax <span>$0.00</span></li>
                  </ul>
                  <div className="booking-total">
                    <ul className="booking-total-list">
                      <li>
                        <span>Total</span>
                        <span className="total-cost">$160</span>
                      </li>
                      <li>
                      </li></ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Booking Summary */}
        </StickyBox>
      </div>
      <Dialog
        TransitionComponent={Transition}
        open={loginDialog}
        onClose={() => {
          document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
          setTimeout(() => {
            setLoginDialog(false)
          }, 500);
        }}
        scroll='body'
        aria-labelledby="login"
        aria-describedby="login"
        maxWidth="xs"
      >
        <DialogTitle id="login" >
          Login
          <IconButton
            color="inherit"
            onClick={() => {
              document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
              setTimeout(() => {
                setLoginDialog(false)
              }, 500);
            }}
            aria-label="close"
            sx={{ float: 'right', "&:hover": { color: 'primary.main' } }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <div style={muiVar}>
            <div className="col-md-12">
              <div className="account-content">
                <div className="col-md-12 col-lg-12 login-right">
                  <LoginBox closeDialog={setLoginDialog} />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>

        </DialogActions>
      </Dialog>
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
            setFormValue('terms', false)
            setError('terms', { type: 'required', message: `Please accept terms and condition first.` })
            setTermsDialog(false)
          }}>Cancel</Button>
          <Button onClick={() => {
            setFormValue('terms', true)
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