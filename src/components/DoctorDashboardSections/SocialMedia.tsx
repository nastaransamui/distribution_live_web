import { FC, Fragment, ReactNode, useEffect } from 'react'
import useScssVar from '@/hooks/useScssVar'
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { useFieldArray, useForm } from 'react-hook-form';
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { updateHomeAccessToken } from '@/redux/homeAccessToken';
import { setCookie } from 'cookies-next';
import verifyHomeAccessToken from '@/helpers/verifyHomeAccessToken';
import { updateUserProfile } from '@/redux/userProfile';
import InputAdornment from '@mui/material/InputAdornment';

export let urlRegex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)

const SocialMedia: FC = (() => {
  const { muiVar, bounce } = useScssVar();

  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
    watch,
    reset,
    control,
    setError,
    getValues,
    setValue: setFormValue
  } = useForm({
    defaultValues: {
      socialMedia: userDoctorProfile?.socialMedia,
    }
  })
  const { fields, append, remove } = useFieldArray<any>({
    control,
    name: "socialMedia"
  });
  const onSocialMediaSubmit = (data: any) => {
    data.userId = userDoctorProfile?._id
    dispatch(updateHomeFormSubmit(true))
    homeSocket.current.emit('socialMediaUpdate', data)
    homeSocket.current.once('socialMediaUpdateReturn', (msg: any) => {
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
        dispatch(updateHomeAccessToken(msg?.accessToken))
        setCookie('homeAccessToken', msg?.accessToken);
        const user = verifyHomeAccessToken(msg?.accessToken)
        dispatch(updateUserProfile(user))
        toast.info('Profile update successfully.', {
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
            // router.reload()
          }
        });
      }
    })
  }
  useEffect(() => {
    if (fields.length == 0) {
      append({ facebook: userDoctorProfile?.socialMedia?.[0] == undefined ? '' : userDoctorProfile?.socialMedia?.[0] })
      append({ x: userDoctorProfile?.socialMedia?.[1] == undefined ? '' : userDoctorProfile?.socialMedia?.[1] })
      append({ instagram: userDoctorProfile?.socialMedia?.[2] == undefined ? '' : userDoctorProfile?.socialMedia?.[2] })
      append({ pinterest: userDoctorProfile?.socialMedia?.[3] == undefined ? '' : userDoctorProfile?.socialMedia?.[3] })
      append({ linkedin: userDoctorProfile?.socialMedia?.[4] == undefined ? '' : userDoctorProfile?.socialMedia?.[4] })
      append({ youtube: userDoctorProfile?.socialMedia?.[5] == undefined ? '' : userDoctorProfile?.socialMedia?.[5] })

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [append, userDoctorProfile])

  return (
    <Fragment>
      <div className="col-md-7 col-lg-8 col-xl-9" style={muiVar}>
        <div className="card">
          <div className="card-body">
            <form noValidate onSubmit={handleSubmit(onSocialMediaSubmit)} >
              {
                fields.map((field: any, index: number) => {
                  let socialName = Object.keys(field)[0]
                  let socialError = errors?.socialMedia;
                  let socialErrorIndex: any;
                  if (socialError !== undefined) {
                    socialErrorIndex = socialError[index]
                  }
                  let registerName: any = `socialMedia.${index}.${socialName}`
                  let Icon =
                    socialName == "facebook" ?
                      <i className="fa-brands fa-facebook"></i> :
                      socialName == 'x' ?
                        <i className="fab fa-twitter"></i> :
                        socialName == 'instagram' ?
                          <i className="fa-brands fa-instagram"></i> :
                          socialName == "pinterest" ?
                            <i className="fa-brands fa-pinterest"></i> :
                            socialName == 'linkedin' ?
                              <i className="fa-brands fa-linkedin"></i> :
                              <i className="fa-brands fa-youtube"></i>
                  return (
                    <div className="row" key={field.id}>
                      <div className="col-md-12 col-lg-12">
                        <div className="form-group">
                          <FormControl fullWidth>
                            <TextField
                              required
                              size='small'
                              id={`${socialName}`}
                              error={socialError?.[index] == undefined ? false : true}
                              helperText={socialError && socialErrorIndex?.[socialName]?.['message'] as ReactNode}
                              {
                              ...control.register(registerName,
                                {
                                  // required: `This field is required `,
                                  pattern: {
                                    value: urlRegex,
                                    message: 'Your url not look correct.'
                                  }
                                }
                              )
                              }
                              label={`${socialName.charAt(0).toUpperCase() + socialName.slice(1)} URL`}
                              autoComplete='off'
                              fullWidth
                              InputProps={{
                                endAdornment:
                                  <InputAdornment position="end" >
                                    {Icon}
                                  </InputAdornment>,
                              }}
                            />
                          </FormControl>
                        </div>
                      </div>
                    </div>
                  )
                })
              }

              <div className="submit-section" style={{ display: 'flex', justifyContent: "center" }}>
                <button type="submit" className="btn btn-primary submit-btn" >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  )
});

export default SocialMedia;