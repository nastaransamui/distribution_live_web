/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

//Next
import Link from 'next/link'
import { useRouter } from 'next/router';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';


//Redux
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';
import { updateHomeAccessToken } from '@/redux/homeAccessToken';

//Utitlies
import useScssVar from '@/hooks/useScssVar'
import { doctors_profile } from '@/public/assets/imagepath';
import { WithContext as ReactTags, Tag } from 'react-tag-input'
import { useDropzone } from 'react-dropzone';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import randomstring from 'randomstring'
import AnimationWrapper from '@/shared/AnimationWrapper';
import BeatLoader from 'react-spinners/BeatLoader';

//Mui
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { useTheme } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import Avatar from '@mui/material/Avatar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import InputAdornment from '@mui/material/InputAdornment';

//Component
import GeoLocationAutocomplete from '@/shared/GeoLocationAutocomplete';
import Education from '@/shared/Education';
import Experience from '@/shared/Experience';
import Awards from '@/shared/Awards';
import Membership from '@/shared/Membership';
import Registrations from '@/shared/Registrations';

import isJsonString from '@/helpers/isJson';



import { toast } from 'react-toastify';
import verifyHomeAccessToken from '@/helpers/verifyHomeAccessToken';
import CurrencyAutocomplete from '@/shared/CurrencyAutocomplete';

import { updateHomeUserId } from '@/redux/homeUserId';
import { updateHomeServices } from '@/redux/homeServices';
import { updateHomeRoleName } from '@/redux/homeRoleName';
import { updateHomeIAT } from '@/redux/homeIAT';
import { updateHomeExp } from '@/redux/homeExp';
import { updateUserDoctorProfile } from '@/redux/userDoctorProfile';
import { updateUserPatientProfile } from '@/redux/userPatientProfile';

export interface SpecialitiesType {
  _id: string;
  specialities: string;
  description: string;
  image: string;
  imageId: string;
  createdAt: Date;
  updatedAt: Date;
  users_id: string[];
}

function StyledDropzone(props: any) {
  const theme = useTheme()
  const { bounce } = useScssVar();
  const baseStyle = useMemo(() => {
    return {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      cursor: 'pointer',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      borderWidth: 2,
      borderRadius: 2,
      borderColor: theme.palette.primary.main,
      borderStyle: 'dashed',
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.color,
      outline: 'none',
      transition: 'border .24s ease-in-out',
    }
  }, [theme])

  const focusedStyle = useMemo(() => {
    return {
      borderColor: theme.palette.secondary.main
    }
  }, [theme])

  const acceptStyle = useMemo(() => {
    return {
      borderColor: 'blue'
    }
  }, [])

  const rejectStyle = useMemo(() => {
    return {
      borderColor: theme.palette.error.main
    }
  }, [theme])


  const onDrop = useCallback((acceptedFiles: any) => {
    acceptedFiles.forEach((file: any) => {
      if (file?.size > 2000000) {
        toast.error(`Image size should be less than 2 Mb`, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          transition: bounce,
          onClose: () => { }
        });
      } else {
        const reader = new FileReader()
        const random = randomstring.generate(19)
        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = function () {
          var image = new Image();
          image.onload = function () {
            let ImageCreate: any[] = []
            ImageCreate.push({
              src: URL.createObjectURL(file),
              width: image.width,
              random: random,
              height: image.height,
              isSelected: false,
              tags: [
                { value: file['name'], title: file['name'] },
              ],
            })
            props.setImages((prevState: any) => {
              let newState = [...prevState, {
                clinicImage: file,
                clinicImageName: file.name,
                random: random,
              }]
              return newState
            })
            if (props.clinicImagesFields.length + acceptedFiles.length <= 4) {
              props.appendClinicImages({
                src: URL.createObjectURL(file),
                width: image.width,
                height: image.height,
                isSelected: false,
                name: file['name'],
                random: random,
                tags: [
                  { value: file['name'], title: file['name'] },
                ],
              })
            } else {
              toast.error('Maximum files are 4', {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                transition: bounce,
              });
            }

          };
          image.src = URL.createObjectURL(file)
        }
        reader.readAsDataURL(file);
      }
    })
  }, [bounce, props])

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    multiple: true,
    maxFiles: 4,
    onDropRejected: (e) => {
      let errorText = ""
      e.map((a) => {
        errorText = a.errors[0].message
      })
      toast.error(errorText, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        transition: bounce,
      });
      return false
    },
    accept: { 'image/*': [] }
  });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [baseStyle, isFocused, focusedStyle, isDragAccept, acceptStyle, isDragReject, rejectStyle]);


  return (
    <div className="container">
      {/* @ts-ignore */}
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p style={{ marginTop: 'auto', marginBottom: 'auto' }}>Drag n drop some files here, or click to select files (Maximum 4 images)</p>
      </div>
    </div>
  );
}

const ProfileSetting: FC = (() => {
  const { muiVar, bounce } = useScssVar();
  const matches = useMediaQuery('(max-width:370px)');
  const theme = useTheme()
  const [images, setImages] = useState<{ clinicImage: File, clinicImageName: string, random: string }[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const userData = useSelector((state: AppState) => state.userData.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const [uploadImage, setUploadImage] = useState(doctors_profile)
  const specialities = useSelector((state: AppState) => state.specialities.value)
  const dispatch = useDispatch();
  const router = useRouter();
  const [currencyValue, setcurrencyValue] = useState<string | null>(
    userDoctorProfile?.currency.length === 0 ? null : `${userDoctorProfile?.currency[0].currency_name} ${userDoctorProfile?.currency[0].emoji}`)
  const [currencyInputValue, setcurrencyInputValue] = useState<string>(
    userDoctorProfile?.currency.length === 0 ? '' : `${userDoctorProfile?.currency[0].currency_name} ${userDoctorProfile?.currency[0].emoji}`)
  const [currencyDisable, setcurrencyDisable] = useState<boolean>(userDoctorProfile?.reservations_id.length !== 0 ? true : false)

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
    control,
    getValues,
    setValue: setFormValue,
    setError,
    watch
  } = useForm({
    defaultValues: {
      ...userDoctorProfile,
    }
  })

  const { fields: educationsFields, append: appendEducations, remove: removeEducations } = useFieldArray<any>({
    control,
    name: "educations"
  });
  const { fields: experincesFields, append: appendExperinces, remove: removeExperinces } = useFieldArray<any>({
    control,
    name: "experinces"
  });
  const { fields: awardsFields, append: appendAwards, remove: removeAwards } = useFieldArray<any>({
    control,
    name: "awards"
  });
  const { fields: membershipsFields, append: appendMemberships, remove: removeMemberships } = useFieldArray<any>({
    control,
    name: "memberships"
  });
  const { fields: registrationsFields, append: appendRegistrations, remove: removeRegistrations } = useFieldArray<any>({
    control,
    name: "registrations"
  });

  const { fields: clinicImagesFields, append: appendClinicImages, remove: removeClinicImages } = useFieldArray<any>({
    control,
    name: "clinicImages"
  });



  const { fields: specialitiesFields, append: appendSpecialities, remove: removeSpecialities } = useFieldArray<any>({
    control,
    name: "specialities"
  });
  const { fields: currencyFields, append: appendCurrency, remove: removeCurrency } = useFieldArray<any>({
    control,
    name: "currency"
  });


  const onProfileSubmit = (data: any) => {
    var fileToRead: any = document.getElementById("profile");
    data.profileImageFiles = [];
    data.clinicImagesFiles = [];
    data.deletedImages = [];
    data.userId = userDoctorProfile?._id
    var file;
    if (fileToRead.files.length !== 0) {
      file = fileToRead.files[0]
      data.profileImageFiles.push({
        profileImage: file,
        profileImageName: file.name,
        profileImageExtentionNoDot: file.name.slice(file.name.indexOf('.') + 1)
      });
    }
    if (images.length !== 0) {
      data.clinicImagesFiles = [...images]
    }

    if (deletedImages.length !== 0) {
      data.deletedImages = [...deletedImages]
    }
    dispatch(updateHomeFormSubmit(true))
    data.fullName = `${data.firstName} ${data.lastName}`
    homeSocket.current.emit('profileUpdate', data)
    homeSocket.current.once('profileUpdateReturn', (msg: any) => {
      if (msg?.status !== 200) {
        toast.error(msg?.message || 'null', {
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
          }
        });

      }
    })
  }

  const [value, setValue] = useState<any>({
    city: getValues('city') == '' ? null : getValues('city'),
    state: getValues('state') == '' ? null : getValues('state'),
    country: getValues('country') == '' ? null : getValues('country'),
  });
  const [inputValue, setInputValue] = useState({
    city: getValues('city') || '',
    state: getValues('state') || '',
    country: getValues('country') || '',
  });

  const [disable, setDisable] = useState({
    city: false,
    state: false,
    country: false,
  })
  const services = watch('specialitiesServices') || [];
  const uploadFile = (e: any) => {
    var fileToRead: any = document.getElementById("profile");
    if (fileToRead !== null) {
      var file = fileToRead.files[0]
      if (file?.size > 2000000) {
        toast.error(`Image size should be less than 2 Mb`, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          transition: bounce,
          onClose: () => { }
        });
      } else {
        setUploadImage(URL.createObjectURL(file))
      }
    }

  }


  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])


  useEffect(() => {
    if (userDoctorProfile !== null && isClient) {
      let profileObj: any = Object.entries(userDoctorProfile)
      profileObj.map((a: any) => {
        if (a[0] == 'currency') {
          setFormValue(a[0], a[1])
          if (a[1].length != 0) {
            setcurrencyInputValue(`${a[1][0]?.currency_name} ${a[1][0]?.emoji}`)
            setcurrencyValue(`${a[1][0]?.currency_name} ${a[1][0]?.emoji}`)
          }
        } else {
          setFormValue(a[0], a[1])
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDoctorProfile, isClient])

  const deleteUser = () => {

    document.getElementById('delete_modal')?.classList.replace('animate__backOutDown', 'animate__backInDown')
    window.$('#delete_modal').modal('toggle')
  }

  const confirmDeleteClick = () => {
    let data = {
      userId: userDoctorProfile?._id,
      ipAddr: userData?.query,
      userAgent: navigator.userAgent,
    }
    dispatch(updateHomeFormSubmit(true))
    if (homeSocket?.current) {
      homeSocket.current.emit('deleteUser', data)
      homeSocket.current.once('deleteUserReturn', (msg: any) => {
        if (msg?.status !== 200) {
          toast.error(msg?.message || 'null', {
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
          if (isJsonString(getCookie('homeAccessToken') as string)) {
            const { length } = JSON.parse(getCookie('homeAccessToken') as string)
            for (var i = 0; i < parseInt(length); i++) {
              deleteCookie(`${i}`);
            }
          }
          deleteCookie('homeAccessToken')
          dispatch(updateHomeAccessToken(null))
          toast.info(msg?.message || 'null', {
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
              router.reload();
            }
          });
        }
      })
    }
  }

  return (
    <Fragment>
      <div className="col-md-12 col-lg-12 col-xl-12">

        <form noValidate onSubmit={handleSubmit(onProfileSubmit)}>
          <AnimationWrapper fallbackMs={1500}>
            {
              !isClient ?
                <BeatLoader color={theme.palette.primary.main} style={{
                  minWidth: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }} />
                :
                <div className={`card   ${isClient ? 'animate__animated animate__backInDown' : 'pre-anim-hidden'} `}>
                  <div className="card-body">
                    <h4 className="card-title">Basic Information</h4>
                    <div className="row form-row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <div className="change-avatar">
                            <div className="profile-img">
                              {/* <img src={userProfile?.profileImage == "" ? uploadImage : uploadImage.startsWith('blob') ? uploadImage : userProfile?.profileImage} alt="" /> */}
                              <Avatar variant="square" sx={{
                                height: { md: `100px`, xs: '80px' },
                                width: { md: `100px`, xs: '80px' },
                                objectFit: 'cover',
                                borderRadius: '4px',
                              }} alt="" src={
                                userDoctorProfile?.profileImage == "" ?
                                  uploadImage : uploadImage.startsWith('blob') ?
                                    uploadImage :
                                    `${userDoctorProfile?.profileImage}`}
                                key={userDoctorProfile?.profileImage}
                              >
                                <img src={doctors_profile} alt="" />
                              </Avatar>
                            </div>
                            <div className="upload-img">
                              <div className="change-photo-btn">
                                <label htmlFor='profile'><i className="fa fa-upload"></i> Upload Photo</label>
                                <input type="file" id='profile' className="upload" accept="image/png, image/jpg, image/jpeg" onChange={uploadFile} />
                              </div>
                              <small className="form-text text-muted">
                                Allowed JPG, GIF or PNG. Max size of 2MB
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <TextField
                            required
                            id="userName"
                            autoComplete='off'
                            disabled
                            label="Email ID"
                            error={errors.userName == undefined ? false : true}
                            helperText={errors.userName && errors['userName']['message'] as ReactNode}
                            {
                            ...register('userName', {
                              required: "This field is required",
                            })
                            }
                            fullWidth
                            size='small'
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <TextField
                            required
                            id="firstName"
                            label="First Name"
                            error={errors.firstName == undefined ? false : true}
                            helperText={errors.firstName && errors['firstName']['message'] as ReactNode}
                            {
                            ...register('firstName', {
                              required: "This field is required",
                            })
                            }
                            fullWidth
                            size='small'
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <TextField
                            required
                            id="lastName"
                            label="Last Name"
                            error={errors.lastName == undefined ? false : true}
                            helperText={errors.lastName && errors['lastName']['message'] as ReactNode}
                            {
                            ...register('lastName', {
                              required: "This field is required",
                            })
                            }
                            fullWidth
                            size='small'
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
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
                                  InputLabelProps={{ shrink: true }}
                                  defaultCountry={userData?.countryCode}
                                  helperText={fieldState.invalid ? "Mobile Number is invalid" : ""}
                                  error={fieldState.invalid}
                                  label="Mobile"
                                  required
                                  fullWidth
                                  size='small'
                                />
                              )
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <Controller
                            // rules={{ required: 'This field is required' }}
                            name='gender'
                            control={control}
                            render={(props: any) => {
                              const { field, fieldState, formState } = props;
                              const { ref, onChange, value } = field;
                              const { defaultValues } = formState;
                              return (
                                <FormControl fullWidth >
                                  <InputLabel id="gender-label" htmlFor="gender" size='small'>
                                    Gender
                                  </InputLabel>
                                  <Select
                                    labelId="gender"
                                    inputProps={{
                                      id: 'gender',
                                      name: 'gender',
                                      autoComplete: 'off'
                                    }}
                                    label="Gender"
                                    error={errors.gender == undefined ? false : true}
                                    value={value}
                                    onChange={(e: SelectChangeEvent) => {
                                      onChange(e)
                                    }}
                                    renderValue={(value) => `${value == 'Mr' ? `👨` : `👩`} ${value}`}
                                    size='small'
                                  >
                                    <MenuItem value="Mr">👨 Mr</MenuItem>
                                    <MenuItem value="Mrs">👩 Mrs</MenuItem>
                                    <MenuItem value="Mss">👩 Mss</MenuItem>
                                  </Select>
                                  {
                                    errors.gender &&
                                    <FormHelperText error>{errors.gender && errors['gender']['message'] as ReactNode}</FormHelperText>
                                  }
                                </FormControl>
                              )
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-0">
                          <Controller
                            // rules={{ required: 'This field is required' }}
                            name='dob'
                            control={control}
                            render={(props: any) => {
                              const { field, fieldState, formState } = props;
                              const { ref, onChange, value } = field;
                              const { defaultValues } = formState;
                              return (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <MobileDatePicker
                                    closeOnSelect
                                    disableFuture
                                    format="DD MMM YYYY"
                                    onChange={(event: any) => {
                                      onChange(dayjs(event).format(`YYYY-MM-DDTHH:mm:ss`));
                                    }}
                                    slotProps={{
                                      textField: {
                                        fullWidth: true,
                                        required: false,
                                        label: 'Date of Birth',
                                        error: errors.dob == undefined ? false : true,
                                        helperText: errors.dob && errors['dob']['message'] as ReactNode,
                                        size: 'small'
                                      },
                                    }}

                                    value={value ? dayjs(value) : null}
                                  />
                                </LocalizationProvider>
                              )
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            }
          </AnimationWrapper>

          <AnimationWrapper fallbackMs={1500}>
            {
              !isClient ?
                <></>
                :
                <div className={`card   ${isClient ? 'animate__animated  animate__backInUp' : 'pre-anim-hidden'}`}>
                  <div className="card-body">
                    <h4 className="card-title">About Me</h4>
                    <div className="form-group mb-0">
                      <TextField
                        required
                        id="aboutMe"
                        inputProps={{
                          autoComplete: 'off',
                          "aria-label": "About Me",
                          id: "aboutMe",
                          name: "aboutMe",
                        }}
                        label="About Me"
                        defaultValue={userDoctorProfile?.aboutMe}
                        multiline
                        minRows={6}
                        fullWidth
                        error={errors.aboutMe == undefined ? false : true}
                        helperText={errors.aboutMe && errors['aboutMe']['message'] as ReactNode}
                        {
                        ...register('aboutMe', {
                          required: "This field is required",
                        })
                        }
                        size='small'
                      />
                    </div>
                  </div>
                </div>
            }
          </AnimationWrapper>

          <div className={`card   ${isClient ? 'animate__animated  animate__backInUp' : 'pre-anim-hidden'}`}>
            <div className="card-body">
              <h4 className="card-title">Clinic Info</h4>
              <div className="row form-row">
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      // required
                      id="clinicName"
                      label="Clinic Name"
                      defaultValue={userDoctorProfile?.clinicName}
                      autoComplete='off'
                      fullWidth
                      error={errors.clinicName == undefined ? false : true}
                      helperText={errors.clinicName && errors['clinicName']['message'] as ReactNode}
                      {
                      ...register('clinicName', {
                        // required: "This field is required",
                      })
                      }
                      size='small'
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      // required
                      id="clinicAddress"
                      label="Clinic Address"
                      defaultValue={userDoctorProfile?.clinicAddress}
                      autoComplete='off'
                      fullWidth
                      error={errors.clinicAddress == undefined ? false : true}
                      helperText={errors.clinicAddress && errors['clinicAddress']['message'] as ReactNode}
                      {
                      ...register('clinicAddress', {
                        // required: "This field is required",
                      })
                      }
                      size='small'
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <StyledDropzone
                      errors={errors}
                      control={control}
                      setImages={setImages}
                      clinicImagesFields={clinicImagesFields}
                      appendClinicImages={appendClinicImages}
                      removeClinicImages={removeClinicImages}
                      Controller={Controller}
                    />
                  </div>
                  <div className="upload-wrap">
                    {
                      clinicImagesFields.map((img: any, index) => {
                        return (
                          <div className="upload-images" key={index + img.id + img.src}>
                            <img src={img.src.startsWith('blob') ? img.src : `${img?.src}`} alt="" height={80} width='auto' />
                            <Link
                              href="#"
                              aria-label='delete'
                              onClick={(e) => {
                                e.preventDefault();
                                setImages((prevState) => {
                                  let newState = prevState.filter((_: any, i) => _.random !== img.random)
                                  return newState
                                })
                                if (img?.random) {
                                  setDeletedImages((prevState) => ([...prevState, img.random]))
                                }
                                removeClinicImages(index)
                              }}
                              className="btn btn-icon btn-danger btn-sm"
                            >
                              <i className="far fa-trash-alt"></i>
                            </Link>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`card   ${isClient ? 'animate__animated  animate__backInUp' : 'pre-anim-hidden'}`}>
            <div className="card-body">
              <h4 className="card-title">Contact Details</h4>
              <div className="row form-row">
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      // required
                      id="address1"
                      label="Address Line 1"
                      error={errors.address1 == undefined ? false : true}
                      helperText={errors.address1 && errors['address1']['message'] as ReactNode}
                      {
                      ...register('address1', {
                        // required: "This field is required",
                      })
                      }
                      fullWidth
                      size='small'
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      id="address2"
                      label="Address 2"
                      {
                      ...register('address2')
                      }
                      fullWidth
                      size='small'
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <GeoLocationAutocomplete
                      required={false}
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
                      disable={disable}
                      setDisable={setDisable}
                      size='small'
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <GeoLocationAutocomplete
                      required={false}
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
                      disable={disable}
                      setDisable={setDisable}
                      size='small'
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <GeoLocationAutocomplete
                      required={false}
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
                      disable={disable}
                      setDisable={setDisable}
                      size='small'
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <Controller
                      // rules={{ required: 'This field is required' }}
                      name='zipCode'
                      control={control}
                      render={(props: any) => {
                        const { field } = props;
                        const { ref, onChange, value } = field;
                        return (
                          <TextField
                            ref={ref}
                            required
                            id="zipCode"
                            label="Zip Code"
                            value={value}
                            onKeyDown={(e) => {
                              const allowKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace', 'Enter', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End', '-']
                              if (!allowKeys.includes(e.key)) {
                                e.preventDefault()
                              }
                            }}
                            error={errors.zipCode == undefined ? false : true}
                            helperText={errors.zipCode && errors['zipCode']['message'] as ReactNode}
                            onChange={(e: any) => {
                              const newValue = e.target.value;
                              const re = /[0-9 /-]+$/
                              if (!newValue.match(re) && newValue !== '') {
                                e.preventDefault()
                              } else {
                                onChange(e)
                              }
                            }}
                            fullWidth
                            size='small'
                          />
                        )
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className={`card   ${isClient ? 'animate__animated  animate__backInUp' : 'pre-anim-hidden'}`}>
            <div className="card-body">
              <h4 className="card-title">Financial</h4>
              <div className="row form-row">
                <div className="col-md-6">
                  <div className="form-group">
                    <CurrencyAutocomplete
                      inputId={`currency`}
                      errors={errors}
                      register={register}
                      name='currency'
                      setFormValue={setFormValue}
                      optionFieldName='searchString'
                      getValues={getValues}
                      setError={setError}
                      clearErrors={clearErrors}
                      value={currencyValue}
                      setValue={setcurrencyValue}
                      formSymbolName='currency'
                      inputValue={currencyInputValue}
                      setInputValue={setcurrencyInputValue}
                      disable={currencyDisable}
                      setDisable={setcurrencyDisable}
                      size='small'
                      required={true}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      InputProps={{
                        startAdornment: <InputAdornment position="start">
                          %
                        </InputAdornment>
                      }}
                      id="bookingsFee"
                      label="Bookings Fee"
                      {
                      ...register('bookingsFee')
                      }
                      fullWidth
                      size='small'
                      required
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`card  services-card ${isClient ? 'animate__animated  animate__backInUp' : 'pre-anim-hidden'}`}  >
            <div className="card-body">
              <h4 className="card-title">Services and Specialization</h4>
              <div className='row form-row'>
                <div className="col-md-6">
                  <div className="form-group">
                    <h4>Services</h4>
                    {/* <TagsInput
                      // @ts-ignore
                      value={getValues('specialitiesServices')}
                      onChange={(tag) => {
                        // @ts-ignore
                        setFormValue('specialitiesServices', tag)
                        if (tag.length == 0) {
                          setError('specialitiesServices', { type: 'required', message: 'This field is required' })
                        } else {
                          clearErrors('specialitiesServices')
                        }
                      }}
                      name="specialitiesServices"
                      placeHolder="Press enter to add new tag"
                      onBlur={(e: any) => {
                        const value = e.target.value;
                        if (getValues('specialitiesServices')?.length !== 0) {
                          if (!getValues('specialitiesServices')?.includes(value) && value !== '') {
                            //@ts-ignore
                            let newValue = [...getValues('specialitiesServices'), value]
                            setFormValue('specialitiesServices', newValue)
                          }
                          e.target.value = "";
                        } else {
                          if (value !== '') {
                            setFormValue('specialitiesServices', [value])
                            e.target.value = "";
                          }
                        }
                      }}
                    /> */}
                    <ReactTags
                      id="specialitiesServices"
                      maxTags={10}
                      inputProps={{ autoComplete: "off" }}
                      classNames={{
                        clearAll: 'ReactTags__clearAll btn btn-danger'
                      }}
                      tags={services.map((a) => {
                        return {
                          id: a,
                          text: a,
                          className: ''
                        }
                      })}
                      handleAddition={(tag: Tag) => {
                        setFormValue('specialitiesServices', [...services, tag.text])

                      }}
                      handleDelete={(index) => {
                        setFormValue('specialitiesServices', services.filter((_, i) => i !== index));
                      }}
                      onClearAll={() => setFormValue('specialitiesServices', [])}
                      inputFieldPosition="top"
                      editable
                      clearAll
                      autoFocus={false}
                      handleInputBlur={(value, _) => {
                        if (services?.length !== 0) {
                          if (!services?.includes(value) && value !== '') {
                            let newValue = [...services, value]
                            setFormValue('specialitiesServices', newValue)
                          }
                        } else {
                          if (value !== '') {
                            setFormValue('specialitiesServices', [value])

                          }
                        }
                      }}
                    />
                    <small className="form-text text-muted">
                      Note : Type & Press enter to add new specialization
                    </small>
                    {
                      errors.specialitiesServices &&
                      <FormHelperText error>
                        {errors.specialitiesServices && errors?.specialitiesServices?.message as ReactNode}
                      </FormHelperText>
                    }
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mb-0">
                    <h4>Speciality </h4>
                    {specialities.length !== 0 && <Controller
                      rules={{ required: 'This field is required' }}
                      name='specialities'
                      control={control}
                      render={(props: any) => {
                        const { field, fieldState, formState } = props;
                        const { ref, onChange, value } = field;
                        const { defaultValues } = formState;
                        return (
                          <FormControl fullWidth >
                            <InputLabel id="specialities-label" htmlFor="specialities" size='small'>
                              Speciality
                            </InputLabel>
                            <Select
                              size='small'
                              labelId="specialities"
                              inputProps={{
                                id: "specialities",
                                name: "specialities",
                                autoComplete: 'off'
                              }}
                              label="Speciality"
                              error={errors.specialities == undefined ? false : true}
                              value={value.length == 0 ? '' : value[0]?._id}
                            >
                              {
                                specialities.map((spec, index) => {
                                  return (
                                    <MenuItem
                                      key={spec._id}
                                      value={spec._id}
                                      divider
                                      onClick={() => {
                                        removeSpecialities(0)
                                        appendSpecialities(spec)
                                      }}>
                                      <img src={`${spec.image}`} alt='' width='25' height='25' style={{ marginRight: 4 }} />

                                      {spec.specialities}
                                    </MenuItem>
                                  )
                                })
                              }
                            </Select>
                            {
                              errors.specialities &&
                              <FormHelperText error>{errors.specialities && errors?.specialities?.root?.message || errors['specialities']['message'] as ReactNode}</FormHelperText>
                            }
                          </FormControl>
                        )
                      }}
                    />}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Education
            errors={errors}
            control={control}
            educationsFields={educationsFields}
            appendEducations={appendEducations}
            removeEducations={removeEducations}
            Controller={Controller}
          />
          <Experience
            errors={errors}
            control={control}
            experincesFields={experincesFields}
            appendExperinces={appendExperinces}
            removeExperinces={removeExperinces}
            Controller={Controller} />
          <Awards
            errors={errors}
            control={control}
            awardsFields={awardsFields}
            appendAwards={appendAwards}
            removeAwards={removeAwards}
            Controller={Controller} />
          <Membership
            errors={errors}
            control={control}
            membershipsFields={membershipsFields}
            appendMemberships={appendMemberships}
            removeMemberships={removeMemberships}
            Controller={Controller} />
          <Registrations
            errors={errors}
            control={control}
            registrationsFields={registrationsFields}
            appendRegistrations={appendRegistrations}
            removeRegistrations={removeRegistrations}
            Controller={Controller} />

          <div className="submit-section submit-btn-bottom " style={{ display: 'flex', justifyContent: "space-between", flexDirection: matches ? 'column' : "row" }}>
            <button type="submit" className="btn btn-primary submit-btn" onClick={() => {
              if (getValues('specialitiesServices')?.length == 0) {
                setError('specialitiesServices', { type: 'required', message: 'This field is required' })
              }
            }}>
              Save Changes
            </button>
            <button className="btn-delete " onClick={(e) => {
              e.preventDefault();
              deleteUser();
            }}>
              Delete User
            </button>

          </div>
        </form>

      </div>
      <div className="modal fade  animate__animated animate__backInDown" id="delete_modal" aria-hidden="true" role="dialog" style={muiVar}>
        <div className="modal-dialog modal-dialog-centered" role="document" >
          <div className="modal-content" >
            <div className="modal-body">
              <div className="form-content p-2">
                <h4 className="modal-title" style={{ display: 'flex', justifyContent: 'center' }}>Deactive</h4>
                <p className="mb-4" style={{ display: 'flex', justifyContent: 'center' }}>
                  By continue this you confirm to delete all your private information
                  from our panel
                  imidiately and deactivate your account and logout.
                  we keep internal data for 6 month and then delete.
                </p>
                <span style={{ display: 'flex', justifyContent: 'center' }}><button type="button" className="btnLogin mx-1"
                  onClick={() => {
                    document.getElementById('delete_modal')?.classList.replace('animate__backInDown', 'animate__backOutDown')

                    setTimeout(() => {
                      window.$('#delete_modal').modal("hide")
                      confirmDeleteClick()
                    }, 500);

                  }}>Delete </button>
                  <button type="button" className="btnLogout" style={muiVar}
                    onClick={() => {
                      document.getElementById('delete_modal')?.classList.replace('animate__backInDown', 'animate__backOutDown')
                      setTimeout(() => {
                        window.$('#delete_modal').modal("hide")
                      }, 500);

                    }}>Cancell</button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
})

export default ProfileSetting;