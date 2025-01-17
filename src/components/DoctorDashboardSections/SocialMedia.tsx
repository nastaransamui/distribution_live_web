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

export let urlRegex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)

const SocialMedia: FC = (() => {
  const { muiVar, bounce } = useScssVar();
  const userProfile = useSelector((state: AppState) => state.userProfile.value)
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
      socialMedia: userProfile?.socialMedia,
    }
  })
  const { fields, append, remove } = useFieldArray<any>({
    control,
    name: "socialMedia"
  });
  const onSocialMediaSubmit = (data: any) => {
    data.userId = userProfile?._id
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
      append({ facebook: userProfile?.socialMedia?.[0] == undefined ? '' : userProfile?.socialMedia?.[0] })
      append({ twitter: userProfile?.socialMedia?.[1] == undefined ? '' : userProfile?.socialMedia?.[1] })
      append({ instagram: userProfile?.socialMedia?.[2] == undefined ? '' : userProfile?.socialMedia?.[2] })
      append({ pinterest: userProfile?.socialMedia?.[3] == undefined ? '' : userProfile?.socialMedia?.[3] })
      append({ linkedin: userProfile?.socialMedia?.[4] == undefined ? '' : userProfile?.socialMedia?.[4] })
      append({ youtube: userProfile?.socialMedia?.[5] == undefined ? '' : userProfile?.socialMedia?.[5] })

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [append, userProfile])

  return (
    <Fragment>
      <div className="col-md-7 col-lg-8 col-xl-9" style={muiVar}>
        <div className="card">
          <div className="card-body">
            <form noValidate onSubmit={handleSubmit(onSocialMediaSubmit)}>
              {
                fields.map((field: any, index: number) => {
                  let socialName = Object.keys(field)[0]
                  let socialError = errors?.socialMedia;
                  let socialErrorIndex: any;
                  if (socialError !== undefined) {
                    socialErrorIndex = socialError[index]
                  }
                  let registerName: any = `socialMedia.${index}.${socialName}`
                  return (
                    <div className="row" key={field.id}>
                      <div className="col-md-12 col-lg-8">
                        <div className="form-group">
                          <FormControl fullWidth>
                            <TextField
                              required
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
                            />
                          </FormControl>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
              {/* <div className="row">
                <div className="col-md-12 col-lg-8">
                  <div className="form-group">
                    <FormControl fullWidth>
                      <TextField
                        required
                        id="outlined-required"
                        label="Facebook URL"
                        autoComplete='off'
                        // InputLabelProps={{ shrink: true }}
                        // size='small'
                        fullWidth
                      />
                    </FormControl>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 col-lg-8">
                  <div className="form-group">
                    <FormControl fullWidth>
                      <TextField
                        required
                        id="outlined-required"
                        label="Twitter URL"
                        autoComplete='off'
                        // InputLabelProps={{ shrink: true }}
                        // size='small'
                        fullWidth
                      />
                    </FormControl>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 col-lg-8">
                  <div className="form-group">
                    <FormControl fullWidth>
                      <TextField
                        required
                        id="outlined-required"
                        label="Instagram URL"
                        autoComplete='off'
                        // InputLabelProps={{ shrink: true }}
                        // size='small'
                        fullWidth
                      />
                    </FormControl>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 col-lg-8">
                  <div className="form-group">
                    <FormControl fullWidth>
                      <TextField
                        required
                        id="outlined-required"
                        label="Pinterest URL"
                        autoComplete='off'
                        // InputLabelProps={{ shrink: true }}
                        // size='small'
                        fullWidth
                      />
                    </FormControl>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 col-lg-8">
                  <div className="form-group">
                    <FormControl fullWidth>
                      <TextField
                        required
                        id="outlined-required"
                        label="Linkedin URL"
                        autoComplete='off'
                        // InputLabelProps={{ shrink: true }}
                        // size='small'
                        fullWidth
                      />
                    </FormControl>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 col-lg-8">
                  <div className="form-group">
                    <FormControl fullWidth>
                      <TextField
                        required
                        id="outlined-required"
                        label="Youtube URL"
                        autoComplete='off'
                        // InputLabelProps={{ shrink: true }}
                        // size='small'
                        fullWidth
                      />
                    </FormControl>
                  </div>
                </div>
              </div> */}
              <div className="submit-section">
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