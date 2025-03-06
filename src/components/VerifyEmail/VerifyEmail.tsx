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
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { updateHomeAccessToken } from '@/redux/homeAccessToken';
import { setCookie } from 'cookies-next';
import { toast } from 'react-toastify';
import verifyHomeAccessToken from '../../../helpers/verifyHomeAccessToken';
import { updateHomeExp } from '@/redux/homeExp';
import { updateHomeIAT } from '@/redux/homeIAT';
import { updateHomeRoleName } from '@/redux/homeRoleName';
import { updateHomeServices } from '@/redux/homeServices';
import { updateHomeUserId } from '@/redux/homeUserId';
import { updateUserDoctorProfile } from '@/redux/userDoctorProfile';
import { updateUserPatientProfile } from '@/redux/userPatientProfile';

const VerifyEmail: FC = ((props) => {
  const router = useRouter();
  const theme = useTheme();
  const { muiVar, bounce } = useScssVar();
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const userData = useSelector((state: AppState) => state.userData.value)
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [applyPassword, setApplyPassword] = useState<boolean>(false)

  const { user }: { user: any } = props as any;

  const {
    register,
    handleSubmit,
    clearErrors,
    unregister,
    formState: { errors },
    watch,
    reset,
    setError,
    getValues,
    control
  } = useForm({
    defaultValues: {
      password: '',
    }
  })

  const veficationClicked = () => {
    let ipAddr = userData?.query;
    let userAgent = navigator.userAgent;

    if (getValues('password') == undefined) {
      dispatch(updateHomeFormSubmit(true))
      homeSocket.current.emit('verificationEmail',
        user,
        router?.query?.token,
        ipAddr,
        userAgent,
        getValues('password'))
      homeSocket.current.once('verificationEmailReturn', (msg: any) => {
        if (msg.status == 200) {
          toast.info(msg?.reason, {
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
              router.push(`/login`)
            }
          });

        } else {
          toast.error(msg?.reason || msg?.message, {
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
      })
    } else {
      if (getValues('password') == '') {
        setError('password', { type: 'required', message: "This field is required" })
      } else {
        if (getValues('password')?.match(paswordRegex)?.length == undefined) {
          setError('password', {
            type: 'pattern', message: `Password should be at least 8 characters long and should contain one number,one character and one special character`
          })
        } else {
          clearErrors('password')
          dispatch(updateHomeFormSubmit(true))
          homeSocket.current.emit('verificationEmail',
            user,
            router?.query?.token,
            ipAddr,
            userAgent,
            getValues('password'))
          homeSocket.current.once('verificationEmailReturn', (msg: any) => {
            if (msg?.status == 200) {
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
            } else {
              toast.info(msg?.reason, {
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
            }
          })
        }
      }
    }

  }


  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (value[name as keyof typeof value] == '') {
        setError(name as keyof typeof value, { type: 'required', message: "This field is required" })
      } else {
        if (value[name as keyof typeof value]?.match(paswordRegex)?.length == undefined) {
          setError(name as keyof typeof value, {
            type: 'pattern', message: `Password should be at least 8 characters long and should contain one number,one character and one special character`
          })
        } else {
          clearErrors(name)
        }
      }
    })
    return () => subscription.unsubscribe();

  }, [clearErrors, setError, watch])

  useEffect(() => {
    if (!applyPassword) {
      unregister("password");
    }
  }, [applyPassword, unregister]);

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
              minWidth: { xl: 300, lg: 275, md: '30%', sm: '50%', xs: '80%' },
              maxWidth: { xl: 375, lg: 300, md: '30%', sm: '50%', xs: '80%' },
            }} style={muiVar}>
              <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  {user?.profile?.firstName} {" "} {user?.profile?.lastName}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {user?.services?.email?.verificationTokens?.[0]?.address}
                </Typography>
                <Typography variant="body2">
                  <br />
                  {user?.emails?.[0]?.verified ? "This Email is verified already" : 'Click below button to verified your account'}
                </Typography>
                <br />
                {!user?.emails?.[0]?.verified && <FormControlLabel control={<Checkbox
                  onChange={(e) => { setApplyPassword((prevState) => !prevState) }}
                  checked={applyPassword} size="small" />} label="Add Password for direct login" />}
                {applyPassword && <TextField
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
                />}
              </CardContent>
              <CardActions>
                {!user?.emails?.[0]?.verified ?
                  <Button size="small" fullWidth className='btn btn-primary' onClick={veficationClicked}>Verification</Button>
                  :
                  <Button size="small" fullWidth className='btn btn-primary' onClick={() => { router.push('/login') }}>Go to Login page</Button>}
              </CardActions>
            </Card> :
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


export default VerifyEmail;