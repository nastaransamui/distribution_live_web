import { FC, Fragment, ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

//Mui
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import useScssVar from '@/hooks/useScssVar';

import { useDispatch, useSelector, } from 'react-redux';
import { AppState } from '@/redux/store';
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';
import TextField from '@mui/material/TextField'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useForm } from 'react-hook-form';
import { paswordRegex } from '../PatientDashboardSections/ChangePassword';
import { toast } from 'react-toastify';


const ResetPassword: FC = ((props) => {
  const router = useRouter();
  const theme = useTheme();
  const { muiVar, bounce } = useScssVar();
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState<boolean>(false)

  const { user }: { user: any } = props as any;
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
    watch,
    reset,
    setError,
    getValues,
  } = useForm({
    defaultValues: {
      password: '',
      repeatPassword: ''
    }
  })
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowRepeatPassword = () => setShowRepeatPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name == 'password') {
        if (value['password'] == '') {
          setError('password', { type: 'required', message: "This field is required" })
        } else {
          if (paswordRegex.test(value['password'] as string)) {
            clearErrors('password')
          } else {
            setError('password', { type: 'pattern', message: "Password should be at least 8 characters long and should contain one number,one character and one special character" })
          }
        }

        if (value['repeatPassword'] !== value['password']) {
          setError('repeatPassword', { type: "validate", message: "New password and confirm password should be same." })
        } else {
          clearErrors('repeatPassword')
        }
      }
      if (name == 'repeatPassword') {
        if (value['repeatPassword'] == '') {
          setError('repeatPassword', { type: 'required', message: "This field is required" })
        } else {
          if (paswordRegex.test(value['repeatPassword'] as string)) {
            clearErrors('repeatPassword')
          } else {
            setError('repeatPassword', { type: 'pattern', message: "Password should be at least 8 characters long and should contain one number,one character and one special character" })
          }
        }

        if (value['password'] !== value['repeatPassword']) {
          setError('password', { type: "validate", message: "New password and confirm password should be same." })
        } else {
          clearErrors('password')
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [clearErrors, setError, watch]);

  const resetPasswordClicked = (data: any) => {
    data.user_Id = user._id
    data.token = router?.query?.token
    delete data.repeatPassword
    // dispatch(updateHomeFormSubmit(true))
    homeSocket.current.emit('resetPasswordUpdate', data)
    homeSocket.current.once('resetPasswordUpdateReturn', (msg: any) => {
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
            router.push('/login')
          }
        });
      }
    })
  }
  return (
    <Fragment>
      <Box sx={{
        bgcolor: theme.palette.background.paper,
        minWidth: '100%',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: "center"
      }}>
        {
          user !== undefined && user?.reason == undefined ?
            <Card sx={{
              minWidth: { xl: 400, lg: 400, md: '30%', sm: '50%', xs: '80%' },
              maxWidth: { xl: 475, lg: 400, md: '30%', sm: '50%', xs: '80%' },
            }} style={muiVar}>
              <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  {user?.profile?.firstName} {" "} {user?.profile?.lastName}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {user?.services?.email?.verificationTokens?.[0]?.address}
                </Typography>

                <form id="myform" noValidate onSubmit={handleSubmit(resetPasswordClicked)}>
                  <div className="form-group">
                    <TextField
                      variant='outlined'
                      size='small'
                      fullWidth
                      required
                      error={errors.password == undefined ? false : true}
                      helperText={errors?.password && errors['password'][`message`] as ReactNode}
                      id="password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      {...register("password", {
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
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        }
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <TextField
                      variant='outlined'
                      fullWidth
                      required
                      error={errors.repeatPassword == undefined ? false : true}
                      helperText={errors?.repeatPassword && errors['repeatPassword'][`message`] as ReactNode}
                      id="repeatPassword"
                      label="Repeat Password"
                      type={showRepeatPassword ? 'text' : 'password'}
                      {...register("repeatPassword", {
                        required: "This field is required",
                        pattern: {
                          value: paswordRegex,
                          message: "Password should be at least 8 characters long and should contain one number,one character and one special character"
                        },
                        validate: {
                          passwordMissMatch: value => (value === getValues().password) || "New password and confirm password should be same.",
                        }
                      })}
                      size='small'
                      slotProps={{
                        input: {
                          endAdornment: <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowRepeatPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showRepeatPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        }
                      }}
                    />
                  </div>
                </form>
              </CardContent>
              <CardActions>
                <Button size="small" fullWidth form="myform" className='btn btn-primary' type='submit'>Reset Password</Button>
              </CardActions>
            </Card>
            :
            <Card sx={{ minWidth: 275 }} style={muiVar}>
              <CardContent>
                <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'center' }}>
                  <br />
                  {user?.reason !== undefined ? user?.reason : 'There is some issue about retrive your user'}
                </Typography>
                <CardActions>
                  <Button size="small" fullWidth className='btn btn-primary' onClick={() => { router.push('/') }}>Go Back Home</Button>
                </CardActions>
              </CardContent>
            </Card>
        }
      </Box>
    </Fragment>
  )
});


export default ResetPassword;