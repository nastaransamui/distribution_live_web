import { FC, Fragment, ReactNode, useEffect, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';


import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormLabel from '@mui/material/FormLabel';
import { AppState } from '@/redux/store';
import { toast } from 'react-toastify';


export let emailRegex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)
export let paswordRegex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/);

const ChangePassword: FC = (() => {
  const { muiVar, bounce } = useScssVar();

  const dispatch = useDispatch()
  // const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowOldPassword = () => setShowOldPassword((show) => !show);
  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
  const handleMouseDownOldPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const {
    register: passwordRegister,
    handleSubmit: passwordSubmit,
    clearErrors: passwordClearError,
    getValues: passwordGetValue,
    formState: { errors: passwordErrors },
    watch: passwordWatch,
    reset: passwordReset,
    setError: passwordSetError,
    reset
  } = useForm({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });


  const onPasswordSubmit = (data: any) => {
    data.user_Id = userProfile?._id
    delete data.confirmPassword;
    dispatch(updateHomeFormSubmit(true))
    homeSocket.current.emit('passwordUpdate', data)
    homeSocket.current.once('passwordUpdateReturn', (msg: any) => {
      if (msg?.status !== 200) {
        toast.error(msg?.message, {
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
    const subscription = passwordWatch((value, { name }) => {
      if (name == 'oldPassword') {
        if (value['oldPassword'] == '') {
          passwordSetError('oldPassword', { type: 'required', message: "This field is required" })
        } else {
          if (paswordRegex.test(value['oldPassword'] as string)) {
            passwordClearError('oldPassword')
          } else {
            passwordSetError('oldPassword', { type: 'pattern', message: "Password should be at least 8 characters long and should contain one number,one character and one special character" })
          }
        }
      }
      if (name == 'newPassword') {
        if (value['newPassword'] == '') {
          passwordSetError('newPassword', { type: 'required', message: "This field is required" })
        } else {
          if (paswordRegex.test(value['newPassword'] as string)) {
            passwordClearError('newPassword')
          } else {
            passwordSetError('newPassword', { type: 'pattern', message: "Password should be at least 8 characters long and should contain one number,one character and one special character" })
          }
        }

        if (value['confirmPassword'] !== value['newPassword']) {
          passwordSetError('confirmPassword', { type: "validate", message: "New password and confirm password should be same." })
        } else {
          passwordClearError('confirmPassword')
        }
      }
      if (name == 'confirmPassword') {
        if (value['confirmPassword'] == '') {
          passwordSetError('confirmPassword', { type: 'required', message: "This field is required" })
        } else {
          if (paswordRegex.test(value['confirmPassword'] as string)) {
            passwordClearError('confirmPassword')
          } else {
            passwordSetError('confirmPassword', { type: 'pattern', message: "Password should be at least 8 characters long and should contain one number,one character and one special character" })
          }
        }

        if (value['newPassword'] !== value['confirmPassword']) {
          passwordSetError('newPassword', { type: "validate", message: "New password and confirm password should be same." })
        } else {
          passwordClearError('newPassword')
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [passwordClearError, passwordSetError, passwordWatch]);
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsClient(true), 20);
    return () => {
      setIsClient(false)
    }
  }, [])
  return (
    <Fragment>
      <div className={`col-md-12 col-lg-12 col-xl-12 ${isClient ? 'animate__animated animate__backInUp' : 'pre-anim-hidden'}`} style={muiVar}>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title" style={{ marginBottom: 20 }}>Change Password</h5>
            <div className="row">
              <div >
                <form className="col-md-12 col-lg-12" noValidate onSubmit={passwordSubmit(onPasswordSubmit)}>
                  <div className='row'>
                    <div className="col-md-4 col-lg-4">
                      <div className="form-group">
                        <FormLabel component="legend">Old Password</FormLabel>
                        <TextField
                          variant='outlined'
                          size='small'
                          fullWidth
                          required
                          error={passwordErrors.oldPassword == undefined ? false : true}
                          helperText={passwordErrors?.oldPassword && passwordErrors['oldPassword'][`message`] as ReactNode}
                          id="password"
                          label="Password"
                          type={showOldPassword ? 'text' : 'password'}
                          {...passwordRegister("oldPassword", {
                            required: "This field is required",
                            pattern: {
                              value: paswordRegex,
                              message: "Password should be at least 8 characters long and should contain one number,one character and one special character"
                            }
                          })}
                          slotProps={{
                            input: {
                              endAdornment: <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowOldPassword}
                                  onMouseDown={handleMouseDownOldPassword}
                                  edge="end"
                                >
                                  {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-4">
                      <div className="form-group">
                        <FormLabel component="legend">New Password</FormLabel>
                        <TextField
                          variant='outlined'
                          size='small'
                          fullWidth
                          required
                          error={passwordErrors.newPassword == undefined ? false : true}
                          helperText={passwordErrors?.newPassword && passwordErrors['newPassword'][`message`] as ReactNode}
                          id="newPassword"
                          label="New Password"
                          type={showNewPassword ? 'text' : 'password'}
                          {...passwordRegister("newPassword", {
                            required: "This field is required",
                            pattern: {
                              value: paswordRegex,
                              message: "Password should be at least 8 characters long and should contain one number,one character and one special character"
                            },
                            validate: {
                              passwordMissMatch: value => (value === passwordGetValue().confirmPassword) || "New password and confirm password should be same.",
                            }
                          })}
                          slotProps={{
                            input: {
                              endAdornment: <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowNewPassword}
                                  onMouseDown={handleMouseDownOldPassword}
                                  edge="end"
                                >
                                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-4">
                      <div className="form-group">
                        <FormLabel component="legend">Confirm Password</FormLabel>
                        <TextField
                          variant='outlined'
                          size='small'
                          fullWidth
                          required
                          error={passwordErrors.confirmPassword == undefined ? false : true}
                          helperText={passwordErrors?.confirmPassword && passwordErrors['confirmPassword'][`message`] as ReactNode}
                          id="confirmPassword"
                          label="Confirm Password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          {...passwordRegister("confirmPassword", {
                            required: "This field is required",
                            pattern: {
                              value: paswordRegex,
                              message: "Password should be at least 8 characters long and should contain one number,one character and one special character"
                            },
                            validate: {
                              passwordMissMatch: value => (value === passwordGetValue().newPassword) || "New password and confirm password should be same.",
                            }
                          })}
                          slotProps={{
                            input: {
                              endAdornment: <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowConfirmPassword}
                                  onMouseDown={handleMouseDownOldPassword}
                                  edge="end"
                                >
                                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="btnLogin w-100">
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
});

export default ChangePassword;