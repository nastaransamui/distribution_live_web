/* eslint-disable @next/next/no-img-element */

import { FC, Fragment, ReactNode, useEffect } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import { useTheme } from '@mui/material';
import TextField from '@mui/material/TextField'

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/redux/store';

//utilities
import { emailRegex } from '../PatientDashboardSections/ChangePassword';
import { Controller, useForm } from 'react-hook-form';
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';
import { toast } from 'react-toastify';

const ForgotSection: FC = (() => {
  const { muiVar, bounce } = useScssVar();
  const dispatch = useDispatch()
  const theme = useTheme();
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)

  const {
    control,
    handleSubmit,
    clearErrors,
    formState: { errors },
    watch,
    reset,
    setError,
  } = useForm({
    defaultValues: {
      email: ''
    }
  })

  const onResetPasswordSubmit = (data: any) => {
    dispatch(updateHomeFormSubmit(true))
    homeSocket.current.emit('forgetPassword', data)
    homeSocket.current.once('forgetPasswordReturn', (msg: any) => {
      if (msg?.status !== 200) {
        toast.error(msg?.reason, {
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
        toast.info(msg?.message, {
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
      if (name == 'email') {
        if (value[name] == '') {
          setError(name, { type: 'required', message: "This field is required" })
        } else {
          if (value[name as keyof typeof value]?.match(emailRegex)?.length == undefined) {
            setError(name, { type: 'pattern', message: "Email should be look like email." })
          } else {
            clearErrors(name);
          }
        }
      }
    })
    return () => subscription.unsubscribe();
  }, [clearErrors, setError, watch]);
  return (
    <Fragment>
      <div className="content top-space" style={muiVar}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8 offset-md-2">
              {/* Account Content */}
              <div className="account-content">
                <div className="row align-items-center justify-content-center">
                  <div className="col-md-7 col-lg-6 login-left">
                    <img
                      src={`/assets/images/login-banner_${theme.palette.mode}.png`}
                      className="img-fluid"
                      alt="Login Banner"
                    />
                  </div>
                  <div className="col-md-12 col-lg-6 login-right">
                    <div className="login-header">
                      <h3>Forgot Password?</h3>
                      <p className="small text-muted">
                        Enter your email to get a password reset link
                      </p>
                    </div>
                    <form noValidate onSubmit={handleSubmit(onResetPasswordSubmit)}>
                      <div className="form-group form-focus">
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
                      <div className="text-end">
                        <Link className="forgot-link" href="/login">
                          Remember your password?
                        </Link>
                      </div>
                      <button
                        className="btn btn-primary w-100 btn-lg login-btn"
                        type="submit"
                      >
                        Reset Password
                      </button>
                    </form>
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

export default ForgotSection;