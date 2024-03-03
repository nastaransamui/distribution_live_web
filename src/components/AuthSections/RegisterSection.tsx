/* eslint-disable @next/next/no-img-element */

import { FC, Fragment, ReactNode, useEffect, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import { useTheme } from '@mui/material';
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useForm, Controller } from 'react-hook-form';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import { useDispatch, useSelector, } from 'react-redux';
import { AppState } from '@/redux/store';
import { emailRegex, paswordRegex } from '../PatientDashboardSections/ChangePassword';
import { useGoogleLogin } from '@react-oauth/google';

import { toast } from 'react-toastify';
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';
//Mui
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText'
import { Transition, BootstrapDialog, BootstrapDialogTitle } from "@/components/shared/Dialog";
import DialogContent from '@mui/material/DialogContent'
import verifyHomeAccessToken from '@/helpers/verifyHomeAccessToken';
import { updateHomeAccessToken } from '@/redux/homeAccessToken';
import { updateUserProfile } from '@/redux/userProfile';
import { setCookie } from 'cookies-next';
import router from 'next/router';
import Typography from '@mui/material/Typography';
import chunkString from '@/helpers/chunkString';

export interface FormType {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  password: string;
  repeatPassword?: string;
  userType?: string;
}

const RegisterSection: FC = (() => {
  const { muiVar, bounce } = useScssVar();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showRepeatPassword, setRepeatShowPassword] = useState<boolean>(false)
  const userData = useSelector((state: AppState) => state.userData.value)
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const dispatch = useDispatch()
  const [openUserType, setOpenUserType] = useState<boolean>(false)
  const [showRadioError, setShowRadioError] = useState<boolean>(false)
  const [userType, setUserType] = useState<'patient' | 'doctors' | 'pharmacist' | ''>('')
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleClickShowRepeatPassword = () => setRepeatShowPassword((show) => !show);

  const handleMouseDownRepeatPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
    watch,
    reset,
    setError,
    control,
    getValues,
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      mobileNumber: '',
      email: '',
      password: '',
      repeatPassword: '',
      userType: ""
    }
  })

  const onRegisterSubmit = (data: FormType) => {
    delete data.repeatPassword;
    dispatch(updateHomeFormSubmit(true))
    homeSocket.current.emit('registerFormSubmit', data)
    homeSocket.current.once('registerFormReturn', (msg: any) => {
      if (msg?.status !== 200) {
        toast.error(msg.message, {
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
        toast.info(msg.message, {
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
            reset()
          }
        });
      }
    })

  }


  useEffect(() => {
    const subscription = watch((value, { name }) => {
      switch (true) {
        case name == 'firstName' || name == 'lastName':
          if (value[name as keyof typeof value] == '') {
            setError(name as keyof typeof value, { type: 'required', message: "This field is required" })
          }
          if (value[name as keyof typeof value] !== '') {
            clearErrors(name)
          }
          break;
        case name == 'mobileNumber':
          if (matchIsValidTel(value[name as keyof typeof value] as string)) {
            clearErrors(name)
          } else {
            setError(name as keyof typeof value, { type: 'required', message: "This field is required" })
          }
          break;

        case name == 'email':
          if (value[name as keyof typeof value] == '') {
            setError(name as keyof typeof value, { type: 'required', message: "This field is required" })
          } else {
            if (value[name as keyof typeof value]?.match(emailRegex)?.length == undefined) {
              setError(name as keyof typeof value, { type: 'pattern', message: "Email should looks like an email." })
            } else {
              clearErrors(name)
            }
          }
          break;

        case name == 'password' || name == 'repeatPassword':
          if (value[name as keyof typeof value] == '') {
            setError(name as keyof typeof value, { type: 'required', message: "This field is required" })
          } else {
            if (value[name as keyof typeof value]?.match(paswordRegex)?.length == undefined) {
              setError(name as keyof typeof value, { type: 'pattern', message: "Password should be at least 8 characters long and should contain one number,one character and one special character" })
            } else {
              clearErrors(name)
            }
          }
          if (name == 'password') {
            if (value['repeatPassword'] !== value['password']) {
              setError('repeatPassword', { type: 'pattern', message: 'Password and repeat password should match' })
            } else {
              clearErrors('repeatPassword')
            }
          }
          if (name == 'repeatPassword') {
            if (value['repeatPassword'] !== value['password']) {
              setError('password', { type: 'pattern', message: 'Password and repeat password should match' })
            } else {
              clearErrors('password')
            }
          }

          break;
      }

    })
    return () => subscription.unsubscribe();

  }, [clearErrors, setError, watch])

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse: any) => {
      try {
        dispatch(updateHomeFormSubmit(true))
        let data: any = {}
        let result = await fetch("https://www.googleapis.com/oauth2/v3/userinfo",
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              Authorization: `Bearer ${tokenResponse.access_token}`
            }
          });
        const info = await result.json()
        data.ipAddr = userData?.query;
        data.userAgent = navigator.userAgent;
        data.email = info?.email;
        data.firstName = info?.given_name;
        data.lastName = info?.family_name;
        data.profileImage = info?.picture;
        data.userType = userType;
        data.access_token = tokenResponse.access_token;
        data.token_type = tokenResponse.token_type;
        data.authuser = tokenResponse.authuser;
        data.expires_in = tokenResponse.expires_in;
        data.prompt = tokenResponse.prompt;
        data.scope = tokenResponse.scope;
        homeSocket.current.emit('googleLoginSubmit', data)
        homeSocket.current.once('googleLoginReturn', (msg: any) => {
          setUserType('')
          if (msg?.status !== 200) {
            //Handle logout other users
            if (msg?.status == 410) {
              toast.error(() => (
                <div>
                  <Typography align='center' >{msg.reason}</Typography>
                  <br />
                  <div style={{ display: 'flex', gap: 5 }}>
                    <Button
                      className="btnDelete btn-primary submit-btn"
                      onClick={() => {
                        homeSocket.current.emit('logOutAllUsersSubmit', { email: data.email, services: 'google', })
                        homeSocket.current.once('logOutAllUsersReturn', (msg: any) => {
                          if (msg.status !== 200) {
                            alert(msg.reason)
                          } else {
                            dispatch(updateHomeFormSubmit(false))
                            toast.dismiss()
                          }

                        })
                      }}
                      variant='contained'
                      fullWidth
                      size='small'
                      sx={{ bgcolor: "primary.main" }}>
                      Logout others
                    </Button>
                    <Button
                      fullWidth
                      onClick={() => { toast.dismiss() }}
                      variant='contained'
                      sx={{
                        bgcolor: "secondary.main",
                        "&:hover": {
                          bgcolor: 'secondary.dark'
                        }
                      }}>
                      close
                    </Button>
                  </div>
                </div>
              ), {
                position: "bottom-center",
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                transition: bounce,
                closeButton: false,
                icon: false,
                onClose: () => {
                  dispatch(updateHomeFormSubmit(false))
                }
              });
            } else {
              toast.error(msg.reason, {
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
            }
          } else if (msg?.status == 200) {
            const { accessToken, user_id, services, roleName, iat, exp, userProfile } = verifyHomeAccessToken(msg?.accessToken)
            switch (true) {
              //AccessToken length is equal or less that 4095
              case msg?.accessToken.length <= 4095:
                dispatch(updateHomeAccessToken(msg?.accessToken))
                setCookie('homeAccessToken', msg?.accessToken);
                dispatch(updateUserProfile(userProfile))
                toast.info('Login successfully', {
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
                    reset()
                    router.reload();
                  }
                });
                break;
              default:
                const result = chunkString(msg?.accessToken, 4095)
                if (result !== null) {
                  setCookie('homeAccessToken', { isSplit: true, length: result.length });
                  for (let index = 0; index < result.length; index++) {
                    const element = result[index];
                    setCookie(`${index}`, element)
                  }
                  dispatch(updateHomeAccessToken(msg?.accessToken))
                  dispatch(updateUserProfile(userProfile))
                  toast.info('Login successfully', {
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
                      // reset()
                      router.reload();
                    }
                  });
                }
                break;
            }
          }
        })
      } catch (error: any) {
        console.log(error)
        toast.error(error.toString(), {
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
      }
    },
    onError: () => {
      toast.error('login Falied', {
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
    }
  });


  return (
    <Fragment>
      {openUserType && <BootstrapDialog
        TransitionComponent={Transition}
        onClose={() => {
          document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
          setTimeout(() => {
            setOpenUserType(false)
            setUserType(() => "")
          }, 500);
        }}
        aria-labelledby="edit_invoice_details"
        open={openUserType}
      >
        <BootstrapDialogTitle
          id="edit_invoice_details" onClose={() => {
            document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
            setTimeout(() => {
              setOpenUserType(false)
              setUserType(() => "")
            }, 500);
          }}>
          Account Details
        </BootstrapDialogTitle>
        <DialogContent dividers sx={{ width: { lg: 450 } }}>
          <FormControl
            error={showRadioError}
            fullWidth
            required
          >
            <FormLabel id="userType">User Type</FormLabel>
            <RadioGroup
              value={userType}
              row
              sx={{ justifyContent: 'space-between' }}
              onChange={(e) => {
                setShowRadioError(false)
                setUserType(() => e.target.value as 'patient' | 'doctors' | 'pharmacist')
              }}
            >
              <FormControlLabel sx={{ color: theme.palette.text.color }} value="patient" control={<Radio />} label="Patient" />
              <FormControlLabel sx={{ color: theme.palette.text.color }} value="doctors" control={<Radio />} label="Doctors" />
              <FormControlLabel sx={{ color: theme.palette.text.color }} value="pharmacist" control={<Radio />} label="Pharmacist" />
            </RadioGroup>
            {showRadioError &&
              <FormHelperText>{"You need to select user Type"}</FormHelperText>
            }
          </FormControl>
          <button className="btn btn-primary w-100 btn-lg login-btn" style={muiVar}
            onClick={() => {
              if (userType == '') {
                setShowRadioError(true);
              } else {
                setShowRadioError(false)
                document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
                setTimeout(() => {
                  setOpenUserType(false)
                  googleLogin();
                }, 500);
              }
            }}>
            Login with google
          </button>
        </DialogContent>
      </BootstrapDialog>
      }
      <div className="content top-space" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="account-content">
              <div className="row align-items-center justify-content-center">
                <div className="col-md-7 col-lg-6 login-left">
                  <img
                    src={`/assets/images/login-banner_${theme.palette.mode}.png`}
                    className="img-fluid"
                    alt="Doccure Register"
                  />
                </div>
                <div className="col-md-12 col-lg-6 login-right">
                  <div className="login-header" style={{ display: 'flex', flexDirection: 'row' }}>
                    <Controller
                      rules={{ required: "This field is required" }}
                      name='userType'
                      control={control}
                      render={(props: any) => {
                        const { field, fieldState, formState } = props;
                        const { ref, onChange } = field;
                        return (
                          <FormControl
                            {...field}
                            error={errors.userType == undefined ? false : true}
                            helpertext={errors.userType && errors['userType']['message'] as ReactNode}
                            fullWidth
                            required
                          >
                            <FormLabel id="userType">User Type</FormLabel>
                            <RadioGroup
                              aria-labelledby="userType"
                              row
                              value={getValues('userType')}
                              sx={{ justifyContent: 'space-between' }}
                              onChange={(e) => {
                                onChange(e)
                              }}
                            >
                              <FormControlLabel sx={{ color: theme.palette.text.color }} value="patient" control={<Radio />} label="Patient" />
                              <FormControlLabel sx={{ color: theme.palette.text.color }} value="doctors" control={<Radio />} label="Doctors" />
                              <FormControlLabel sx={{ color: theme.palette.text.color }} value="pharmacist" control={<Radio />} label="Pharmacist" />
                            </RadioGroup>
                            {errors?.userType && <FormHelperText>{errors['userType']['message']}</FormHelperText>}
                          </FormControl>
                        )
                      }}
                    />
                  </div>
                  <form noValidate onSubmit={handleSubmit(onRegisterSubmit)}>
                    <div className="row" >
                      <div className="form-group col-xs-6 col-sm-6 col-md-6 col-lg-6" >
                        <TextField
                          required
                          id="firstName"
                          size='small'
                          error={errors.firstName == undefined ? false : true}
                          helperText={errors.firstName && errors['firstName']['message'] as ReactNode}
                          {
                          ...register('firstName', {
                            required: "This field is required"
                          })
                          }
                          label="First Name"
                          fullWidth
                        />
                      </div>
                      <div className="form-group col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <TextField
                          required
                          id="lastName"
                          label="Last Name"
                          size='small'
                          error={errors.lastName == undefined ? false : true}
                          helperText={errors.lastName && errors['lastName']['message'] as ReactNode}
                          {
                          ...register('lastName', {
                            required: "This field is required"
                          })
                          }
                          fullWidth
                        />
                      </div>
                      <div className="form-group col-xs-6 col-sm-6 col-md-6 col-lg-6" >
                        <Controller
                          rules={{ validate: (val) => matchIsValidTel(val) }}
                          name='mobileNumber'
                          control={control}
                          render={(props: any) => {
                            const { field, fieldState, formState } = props;
                            const { ref, onChange } = field;
                            return (
                              <MuiTelInput
                                {...field}
                                size='small'
                                InputLabelProps={{ shrink: true }}
                                defaultCountry={userData?.countryCode}
                                helperText={fieldState.invalid ? "Tel is invalid" : ""}
                                error={fieldState.invalid}
                                label="Mobile"
                                required
                              />
                            )
                          }}
                        />
                      </div>
                      <div className="form-group col-xs-6 col-sm-6 col-md-6 col-lg-6">
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
                      <div className="form-group col-xs-6 col-sm-6 col-md-6 col-lg-6" >
                        <TextField
                          required
                          id="passowrd"
                          label="Password"
                          size='small'
                          error={errors.password == undefined ? false : true}
                          helperText={errors.password && errors['password']['message'] as ReactNode}
                          {...register("password", {
                            required: "This field is required",
                            pattern: {
                              value: paswordRegex,
                              message: "Password should be at least 8 characters long and should contain one number,one character and one special character"
                            }
                          })}
                          type={showPassword ? 'text' : 'password'}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">
                              <IconButton
                                disableFocusRipple
                                disableRipple
                                disableTouchRipple
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          }}
                          fullWidth
                        />
                      </div>
                      <div className="form-group col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <TextField
                          required
                          id="repeatPassword"
                          label="Repeat Password"
                          size='small'
                          error={errors.repeatPassword == undefined ? false : true}
                          helperText={errors.repeatPassword && errors['repeatPassword']['message'] as ReactNode}
                          {...register("repeatPassword", {
                            required: "This field is required",
                            pattern: {
                              value: paswordRegex,
                              message: "Password should be at least 8 characters long and should contain one number,one character and one special character"
                            }
                          })}
                          type={showRepeatPassword ? 'text' : 'password'}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">
                              <IconButton
                                disableFocusRipple
                                disableRipple
                                disableTouchRipple
                                onClick={handleClickShowRepeatPassword}
                                onMouseDown={handleMouseDownRepeatPassword}
                                edge="end"
                              >
                                {showRepeatPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          }}
                          fullWidth
                        />
                      </div>
                    </div>
                    <div className="text-end">
                      <Link className="forgot-link" href="/login">
                        Already have an account?
                      </Link>
                    </div>
                    <button
                      className="btn btn-primary w-100 btn-lg login-btn"
                      type="submit"
                    >
                      Signup
                    </button>
                    <div className="login-or">
                      <span className="or-line" />
                      <span className="span-or">or</span>
                    </div>
                    <div className="row form-row social-login">
                      {/* <div className="col-6">
                          <Button className="btn-facebook w-100">
                            <i className="fab fa-facebook-f me-1" /> Login
                          </Button>
                        </div> */}
                      <div className="col-12">
                        <Button sx={{
                          backgroundColor: '#dd4b39',
                          color: '#fff', "&:hover": {
                            backgroundColor: '#dd4b39' + " !important"
                          }
                        }} className=" btn-google w-100" onClick={() => {
                          setOpenUserType(() => true)
                          // googleLogin()
                        }}>
                          <i className="fab fa-google me-1" /> Login
                        </Button>
                      </div>
                    </div>
                  </form>
                  {/* /Register Form */}
                </div>
              </div>
            </div>
            {/* /Register Content */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </Fragment>
  )
});

export default RegisterSection;