import { FC, Fragment, ReactNode, useEffect, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { useFieldArray, useForm } from 'react-hook-form';
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';
import { useTheme } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { updateHomeAccessToken } from '@/redux/homeAccessToken';
import { setCookie } from 'cookies-next';
import verifyHomeAccessToken from '@/helpers/verifyHomeAccessToken';
import { updateUserProfile } from '@/redux/userProfile';
import InputAdornment from '@mui/material/InputAdornment';
import AnimationWrapper from '@/shared/AnimationWrapper';
import BeatLoader from 'react-spinners/BeatLoader';

export let urlRegex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)
const socialPlatforms = ["facebook", "x", "instagram", "pinterest", "linkedin", "youtube"];
const getSocialIcon = (platform: string) => {
  switch (platform) {
    case "facebook":
      return <i className="fa-brands fa-facebook"></i>;
    case "x":
      return <i className="fab fa-twitter"></i>;
    case "instagram":
      return <i className="fa-brands fa-instagram"></i>;
    case "pinterest":
      return <i className="fa-brands fa-pinterest"></i>;
    case "linkedin":
      return <i className="fa-brands fa-linkedin"></i>;
    default:
      return <i className="fa-brands fa-youtube"></i>;
  }
};
const SocialMedia: FC = (() => {
  const { bounce } = useScssVar();
  const theme = useTheme();
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const dispatch = useDispatch();

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    defaultValues: {
      socialMedia: userDoctorProfile?.socialMedia,
    }
  })
  const { fields, } = useFieldArray<any>({
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
    if (!userDoctorProfile?.socialMedia) return;

    const updatedFields: { platform: string; link: string }[] | any = socialPlatforms.map((platform, index) => ({
      platform,
      link: userDoctorProfile?.socialMedia?.[index] == undefined ? '' :
        userDoctorProfile?.socialMedia?.[index]?.['link']
    }));

    reset({ socialMedia: updatedFields });
  }, [userDoctorProfile?.socialMedia, reset]);
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsClient(true), 20);
    return () => {
      setIsClient(false)
    }
  }, [])
  return (
    <Fragment>
      <AnimationWrapper fallbackMs={1500}>
        {
          !isClient ?
            <BeatLoader color={theme.palette.primary.main} style={{
              minWidth: '100%',
              display: 'flex',
              justifyContent: 'center',
            }} /> :
            <div className={`col-md-12 col-lg-12 col-xl-12 ${isClient ? 'animate__animated animate__backInUp' : 'pre-anim-hidden'}`}>

              <div className="card">
                <div className="card-body">
                  <form noValidate onSubmit={handleSubmit(onSocialMediaSubmit)} >
                    {
                      fields.map((field: any, index: number) => {
                        let socialName = field.platform
                        let socialError = errors?.socialMedia;
                        let socialErrorIndex: any;
                        if (socialError !== undefined) {
                          socialErrorIndex = socialError[index]
                        }
                        let registerName: any = `socialMedia.${index}.link`

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
                                          {getSocialIcon(field.platform)}
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
        }
      </AnimationWrapper>
    </Fragment>
  )
});

export default SocialMedia;