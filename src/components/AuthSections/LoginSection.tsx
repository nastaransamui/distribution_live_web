/* eslint-disable @next/next/no-img-element */

import { FC, Fragment, ReactNode, useEffect, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import { useTheme } from '@mui/material';
import TextField from '@mui/material/TextField'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button'
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '@/redux/store';
import { updateHomeAccessToken } from '@/redux/homeAccessToken';
import { emailRegex, paswordRegex } from '../PatientDashboardSections/ChangePassword';
import { toast } from 'react-toastify';
import { Controller, useForm } from 'react-hook-form';
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';
import verifyHomeAccessToken from '@/helpers/verifyHomeAccessToken';
import { hasCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useGoogleLogin } from '@react-oauth/google';

//Mui
import { Transition, BootstrapDialog, BootstrapDialogTitle } from "@/components/shared/Dialog";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText'
import DialogContent from '@mui/material/DialogContent'
import Typography from '@mui/material/Typography';
import { updateHomeUserId } from '@/redux/homeUserId';
import { updateHomeServices } from '@/redux/homeServices';
import { updateHomeRoleName } from '@/redux/homeRoleName';
import { updateHomeIAT } from '@/redux/homeIAT';
import { updateHomeExp } from '@/redux/homeExp';
import { updateUserDoctorProfile } from '@/redux/userDoctorProfile';
import { updateUserPatientProfile } from '@/redux/userPatientProfile';




export interface FormType {
  email: string;
  password: string;
  ipAddr?: string;
  userAgent?: string;
}

const LoginSection: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();

  return (
    <Fragment>

      <div className="content top-space" style={muiVar}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8 offset-md-2">
              <div className="account-content">
                <div className="row align-items-center justify-content-center">
                  <div className="col-md-7 col-lg-6 login-left" >
                    <img
                      src={`/assets/images/login-banner_${theme.palette.mode}.webp`}
                      className="img-fluid"
                      alt="Login"
                    />
                  </div>
                  <div className="col-md-12 col-lg-6 login-right">
                    <LoginBox />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
});

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
export interface LoginBoxType {
  closeDialog?: SetState<boolean>;
}

export const LoginBox: FC<LoginBoxType> = (({ closeDialog }) => {
  const { muiVar, bounce } = useScssVar();
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [openUserType, setOpenUserType] = useState<boolean>(false)
  const [showRadioError, setShowRadioError] = useState<boolean>(false)
  const [userType, setUserType] = useState<'patient' | 'doctors' | 'pharmacist' | ''>('')
  const theme = useTheme();
  const router = useRouter();
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const userData = useSelector((state: AppState) => state.userData.value)
  const dispatch = useDispatch();
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  }

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
    watch,
    reset,
    setError,
    control
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    }
  })

  const onLoginSubmit = (data: FormType) => {
    if (hasCookie('cc_cookie')) {

      data.ipAddr = userData?.query;
      data.userAgent = navigator.userAgent;
      data.email = data.email.toLowerCase();
      // dispatch(updateHomeFormSubmit(true))
      if (homeSocket?.current) {
        homeSocket.current.emit('loginFormSubmit', data)
        homeSocket.current.once('loginFormReturn', (msg: any) => {
          if (closeDialog) {
            closeDialog(false);
          }
          if (msg?.status !== 200) {
            //Handle logout other users
            if (msg?.status == 410) {
              toast.error(() => (
                <div style={muiVar}>
                  <Typography align='center' >{msg.reason}</Typography>
                  <br />
                  <div style={{ display: 'flex', gap: 5 }}>
                    <Button
                      className="btnDelete btn-primary submit-btn"
                      onClick={() => {
                        homeSocket.current.emit('logOutAllUsersSubmit', { email: data.email, services: 'password', password: data.password })
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
                      className="btn btn-primary submit-btn"
                      onClick={() => { toast.dismiss() }}
                      variant='contained'
                      sx={{
                        bgcolor: "secondary.main",
                        "&:hover": {
                          bgcolor: 'secondary.dark'
                        }
                      }}>close</Button>
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
            setCookie('homeAccessToken', accessToken);
            setCookie('user_id', user_id);
            setCookie('services', services);
            setCookie('roleName', roleName);
            setCookie('iat', iat);
            setCookie('exp', exp);
            dispatch(updateHomeAccessToken(accessToken))
            dispatch(updateHomeUserId(user_id));
            dispatch(updateHomeServices(services));
            dispatch(updateHomeRoleName(roleName));
            dispatch(updateHomeIAT(iat));
            dispatch(updateHomeExp(exp))
            roleName == 'patient' ? dispatch(updateUserDoctorProfile(userProfile)) : dispatch(updateUserPatientProfile(userProfile))
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
            // switch (true) {
            //   //AccessToken length is equal or less that 4095
            //   case msg?.accessToken.length <= 4095:
            //     dispatch(updateHomeAccessToken(msg?.accessToken))
            //     setCookie('homeAccessToken', msg?.accessToken);
            //     dispatch(updateUserProfile(userProfile))
            //     toast.info('Login successfully', {
            //       position: "bottom-center",
            //       autoClose: 5000,
            //       hideProgressBar: false,
            //       closeOnClick: true,
            //       pauseOnHover: true,
            //       draggable: true,
            //       progress: undefined,
            //       transition: bounce,
            //       onClose: () => {
            //         dispatch(updateHomeFormSubmit(false))
            //         reset()
            //         router.reload();
            //       }
            //     });
            //     break;
            //   default:
            //     const result = chunkString(msg?.accessToken, 4095)
            //     if (result !== null) {
            //       setCookie('homeAccessToken', { isSplit: true, length: result.length });
            //       for (let index = 0; index < result.length; index++) {
            //         const element = result[index];
            //         setCookie(`${index}`, element)
            //       }
            //       dispatch(updateHomeAccessToken(msg?.accessToken))
            //       dispatch(updateUserProfile(userProfile))
            //       toast.info('Login successfully', {
            //         position: "bottom-center",
            //         autoClose: 5000,
            //         hideProgressBar: false,
            //         closeOnClick: true,
            //         pauseOnHover: true,
            //         draggable: true,
            //         progress: undefined,
            //         transition: bounce,
            //         onClose: () => {
            //           dispatch(updateHomeFormSubmit(false))
            //           // reset()
            //           router.reload();
            //         }
            //       });
            //     }
            //     break;
            // }
          }
        })
      }
    } else {
      alert('Please accept necessary cookies first')
    }
  }

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      switch (true) {
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

        case name == 'password':
          if (value[name as keyof typeof value] == '') {
            setError(name as keyof typeof value, { type: 'required', message: "This field is required" })
          } else {
            if (value[name as keyof typeof value]?.match(paswordRegex)?.length == undefined) {
              setError(name as keyof typeof value, { type: 'pattern', message: "Password should be at least 8 characters long and should contain one number,one character and one special character" })
            } else {
              clearErrors(name)
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
          if (closeDialog) {
            closeDialog(false);
          }
          if (msg?.status !== 200) {
            //Handle logout other users
            if (msg?.status == 410) {
              toast.error(() => (
                <div style={muiVar}>
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
                      size="small"
                      sx={{ bgcolor: "primary.main" }}>
                      Logout others
                    </Button>
                    <Button
                      fullWidth
                      onClick={() => { toast.dismiss() }}
                      variant='contained'
                      className="btn btn-primary submit-btn"
                      sx={{
                        bgcolor: "secondary.main",
                        "&:hover": {
                          bgcolor: 'secondary.dark'
                        }
                      }}>close</Button>
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
            setCookie('homeAccessToken', accessToken);
            setCookie('user_id', user_id);
            setCookie('services', services);
            setCookie('roleName', roleName);
            setCookie('iat', iat);
            setCookie('exp', exp);
            dispatch(updateHomeAccessToken(accessToken))
            dispatch(updateHomeUserId(user_id));
            dispatch(updateHomeServices(services));
            dispatch(updateHomeRoleName(roleName));
            dispatch(updateHomeIAT(iat));
            dispatch(updateHomeExp(exp))
            roleName == 'patient' ? dispatch(updateUserDoctorProfile(userProfile)) : dispatch(updateUserPatientProfile(userProfile))
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
            // const { accessToken, user_id, services, roleName, iat, exp, userProfile } = verifyHomeAccessToken(msg?.accessToken)
            // switch (true) {
            //   //AccessToken length is equal or less that 4095
            //   case msg?.accessToken.length <= 4095:
            //     dispatch(updateHomeAccessToken(msg?.accessToken))
            //     setCookie('homeAccessToken', msg?.accessToken);
            //     dispatch(updateUserProfile(userProfile))
            //     toast.info('Login successfully', {
            //       position: "bottom-center",
            //       autoClose: 5000,
            //       hideProgressBar: false,
            //       closeOnClick: true,
            //       pauseOnHover: true,
            //       draggable: true,
            //       progress: undefined,
            //       transition: bounce,
            //       onClose: () => {
            //         dispatch(updateHomeFormSubmit(false))
            //         reset()
            //         router.reload();
            //       }
            //     });
            //     break;
            //   default:
            //     const result = chunkString(msg?.accessToken, 4095)
            //     if (result !== null) {
            //       setCookie('homeAccessToken', { isSplit: true, length: result.length });
            //       for (let index = 0; index < result.length; index++) {
            //         const element = result[index];
            //         setCookie(`${index}`, element)
            //       }
            //       dispatch(updateHomeAccessToken(msg?.accessToken))
            //       dispatch(updateUserProfile(userProfile))
            //       toast.info('Login successfully', {
            //         position: "bottom-center",
            //         autoClose: 5000,
            //         hideProgressBar: false,
            //         closeOnClick: true,
            //         pauseOnHover: true,
            //         draggable: true,
            //         progress: undefined,
            //         transition: bounce,
            //         onClose: () => {
            //           dispatch(updateHomeFormSubmit(false))
            //           // reset()
            //           router.reload();
            //         }
            //       });
            //     }
            //     break;
            // }
          }
        })
      } catch (error: any) {
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
      <div className="login-header">
        <h3>
          Login <span></span>
        </h3>
      </div>
      <form noValidate onSubmit={handleSubmit(onLoginSubmit)}>
        <div className="form-group ">
          <Controller
            rules={{
              required: "This field is required",
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
                  inputProps={{ style: { textTransform: 'lowercase' }, autoComplete: 'email' }}
                  onChange={(e: any) => {
                    e.target.value = e.target.value.replace(/^\s+/, '').replace(/\s+$/, '')
                    onChange(e)
                  }}
                />
              )
            }} />
        </div>
        <div className="form-group ">
          <TextField
            required
            size='small'
            id="passowrd"
            label="Password"
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
                  aria-label='password toggle'
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }}
            fullWidth
          />
        </div>
        <div className="text-end">
          <Link
            className="forgot-link"
            href="/forgot-password"
          >
            Forgot Password ?
          </Link>
        </div>
        <button
          className="btn btn-primary w-100 btn-lg login-btn"
          type="submit"

        >
          Login
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
              color: '#fff',
              "&:hover": {
                backgroundColor: '#dd4b39' + " !important"
              }
            }} className=" btn-google w-100" onClick={() => {
              if (hasCookie('cc_cookie')) {
                setOpenUserType(() => true)
              } else {
                alert('Please accept necessary cookies first')
              }
            }}>
              <i className="fab fa-google me-1" /> Login
            </Button>
          </div>
        </div>
        <div className="text-center dont-have">
          Don’t have an account?{" "}
          <Link href="/register">Register</Link>
        </div>
      </form>
    </Fragment>
  )
})

export default LoginSection;