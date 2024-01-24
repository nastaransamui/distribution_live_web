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
import { TagsInput } from "react-tag-input-component";
import { useDropzone } from 'react-dropzone';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import randomstring from 'randomstring'
import { Image as ImageGalleryType } from 'react-grid-gallery'


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
import Avatar from '@mui/material/Avatar'
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';

import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';

//Component
import GeoLocationAutocomplete from '@/shared/GeoLocationAutocomplete';
import Education from '@/shared/Education';
import Experience from '@/shared/Experience';
import Awards from '@/shared/Awards';
import Membership from '@/shared/Membership';
import Registrations from '@/shared/Registrations';

import chunkString from '@/helpers/chunkString';
import isJsonString from '@/helpers/isJson';



import { toast } from 'react-toastify';
import verifyHomeAccessToken from '@/helpers/verifyHomeAccessToken';
import { updateUserProfile } from '@/redux/userProfile';






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
  const theme = useTheme()
  const [images, setImages] = useState<{ clinicImage: File, clinicImageName: string, random: string }[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const userData = useSelector((state: AppState) => state.userData.value)
  const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const [uploadImage, setUploadImage] = useState(doctors_profile)
  // const [specialities, setSpecialities] = useState<SpecialitiesType[]>([])
  const specialities = useSelector((state: AppState) => state.specialities.value)
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
    reset,
    control,
    getValues,
    setValue: setFormValue,
    setError
  } = useForm({
    defaultValues: {
      ...userProfile,
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


  const onProfileSubmit = (data: any) => {
    var fileToRead: any = document.getElementById("profile");
    data.profileImageFiles = [];
    data.clinicImagesFiles = [];
    data.deletedImages = [];
    data.userId = userProfile?._id
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
        switch (true) {
          //AccessToken length is equal or less that 4095
          case msg?.accessToken.length <= 4095:
            switch (true) {
              case isJsonString(getCookie('homeAccessToken') as string):
                const { length } = JSON.parse(getCookie('homeAccessToken') as string)
                for (var i = 0; i < parseInt(length); i++) {
                  deleteCookie(`${i}`);
                }
                dispatch(updateHomeAccessToken(msg?.accessToken))
                setCookie('homeAccessToken', msg?.accessToken);
                var { accessToken, user_id, services, roleName, iat, exp, userProfile } = verifyHomeAccessToken(msg?.accessToken)
                dispatch(updateUserProfile(userProfile))
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
                break;

              default:
                dispatch(updateHomeAccessToken(msg?.accessToken))
                setCookie('homeAccessToken', msg?.accessToken);
                var { accessToken, user_id, services, roleName, iat, exp, userProfile } = verifyHomeAccessToken(msg?.accessToken)
                dispatch(updateUserProfile(userProfile))
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
                    setImages([])
                    setDeletedImages([])
                    setUploadImage(doctors_profile)
                  }
                });
                break;
            }
            break;

          default:
            const result = chunkString(msg?.accessToken, 4095)
            if (result !== null) {
              setCookie('homeAccessToken', { isSplit: true, length: result.length });
              for (let index = 0; index < result.length; index++) {
                const element = result[index];
                setCookie(`${index}`, element)
              }
              var { accessToken, user_id, services, roleName, iat, exp, userProfile } = verifyHomeAccessToken(msg?.accessToken)
              dispatch(updateHomeAccessToken(msg?.accessToken))
              dispatch(updateUserProfile(userProfile))
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
                  setImages([])
                  setDeletedImages([])
                  setUploadImage(doctors_profile)
                }
              });
            }
            break;
        }
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
    if (userProfile !== null && isClient) {
      let profileObj: any = Object.entries(userProfile)
      profileObj.map((a: any) => {
        setFormValue(a[0], a[1])
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile, isClient])

  // console.log(userProfile?.profileImage)
  return (
    <Fragment>
      <div className="col-md-7 col-lg-8 col-xl-9" style={muiVar}>
        {
          !isClient ? <CircleToBlockLoading color={theme.palette.primary.main} size="small" style={{
            minWidth: '100%',
            display: 'flex',
            justifyContent: 'center',
          }} /> :
            <form noValidate onSubmit={handleSubmit(onProfileSubmit)}>
              <div className="card">
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
                              userProfile?.profileImage == "" ?
                                uploadImage : uploadImage.startsWith('blob') ?
                                  uploadImage :
                                  `${userProfile?.profileImage}`}
                              key={userProfile?.profileImage}
                            // ${isClient ? `?random=${new Date().getTime()}` : ``}
                            >
                              <img src={doctors_profile} alt="" />
                            </Avatar>
                          </div>
                          <div className="upload-img">
                            <div className="change-photo-btn">
                              <span>
                                <i className="fa fa-upload"></i> Upload Photo
                              </span>
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
                              />
                            )
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <Controller
                          rules={{ required: 'This field is required' }}
                          name='gender'
                          control={control}
                          render={(props: any) => {
                            const { field, fieldState, formState } = props;
                            const { ref, onChange, value } = field;
                            const { defaultValues } = formState;
                            return (
                              <FormControl fullWidth >
                                <InputLabel id="gender">
                                  Gender
                                  <input id="gender" hidden />
                                </InputLabel>
                                <Select
                                  labelId="gender"
                                  id="gender"
                                  label="Gender"
                                  error={errors.gender == undefined ? false : true}
                                  value={value}
                                  onChange={(e: SelectChangeEvent) => {
                                    onChange(e)
                                  }}
                                  renderValue={(value) => `${value == 'Mr' ? `👨` : `👩`} ${value}`}
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
                          rules={{ required: 'This field is required' }}
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
                                      inputProps: { value: value == '' ? 'Date of Birth' : dayjs(value).format('DD MMM YYYY') },
                                      fullWidth: true,
                                      required: true,
                                      label: 'Date of Birth',
                                      error: errors.dob == undefined ? false : true,
                                      helperText: errors.dob && errors['dob']['message'] as ReactNode,
                                    },
                                  }}

                                  value={dayjs(defaultValues.dob)}
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


              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">About Me</h4>
                  <div className="form-group mb-0">
                    <TextField
                      required
                      id="aboutMe"
                      label="About Me"
                      defaultValue={userProfile?.aboutMe}
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
                    />
                  </div>
                </div>
              </div>


              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Clinic Info</h4>
                  <div className="row form-row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <TextField
                          required
                          id="clinicName"
                          label="Clinic Name"
                          defaultValue={userProfile?.clinicName}
                          autoComplete='off'
                          fullWidth
                          error={errors.clinicName == undefined ? false : true}
                          helperText={errors.clinicName && errors['clinicName']['message'] as ReactNode}
                          {
                          ...register('clinicName', {
                            required: "This field is required",
                          })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <TextField
                          required
                          id="clinicAddress"
                          label="Clinic Address"
                          defaultValue={userProfile?.clinicAddress}
                          autoComplete='off'
                          fullWidth
                          error={errors.clinicAddress == undefined ? false : true}
                          helperText={errors.clinicAddress && errors['clinicAddress']['message'] as ReactNode}
                          {
                          ...register('clinicAddress', {
                            required: "This field is required",
                          })
                          }
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
                                <img src={img.src.startsWith('blob') ? img.src : `${img?.src}`} alt="" />
                                <Link
                                  href="#"
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

              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Contact Details</h4>
                  <div className="row form-row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <TextField
                          required
                          id="address1"
                          label="Address Line 1"
                          error={errors.address1 == undefined ? false : true}
                          helperText={errors.address1 && errors['address1']['message'] as ReactNode}
                          {
                          ...register('address1', {
                            required: "This field is required",
                          })
                          }
                          fullWidth
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
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <GeoLocationAutocomplete
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
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <GeoLocationAutocomplete
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
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <GeoLocationAutocomplete
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
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <Controller
                          rules={{ required: 'This field is required' }}
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
                              />
                            )
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Pricing</h4>

                  <div className="form-group mb-0">
                    <div id="pricing_select">
                      <div className="payment-list">
                        <label className="payment-radio paypal-option" htmlFor="price_free">
                          <input type="radio" name="rating_option" id="price_free" defaultValue="price_free"
                            defaultChecked />
                          <span className="checkmark" />
                          Free
                        </label>
                      </div>

                      <div className="payment-list">
                        <label className="payment-radio paypal-option" htmlFor="price_custom">
                          <input type="radio" name="rating_option" id="price_custom" defaultValue="price_custom" />
                          <span className="checkmark" />
                          Custom Price (per hour)
                        </label>
                      </div>
                    </div>
                  </div>

                  <div
                    className="row custom_price_cont"
                    id="custom_price_cont"
                    style={{ display: "none" }}
                  >
                    <div className="col-md-4">
                      <input
                        type="text"
                        className="form-control"
                        id="custom_rating_input"
                        name="custom_rating_count"
                        defaultValue=""
                        placeholder="20"
                      />
                      <small className="form-text text-muted">
                        Custom price you can add
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card services-card">
                <div className="card-body">
                  <h4 className="card-title">Services and Specialization</h4>
                  <div className='row form-row'>
                    <div className="col-md-6">
                      <div className="form-group">
                        <h4>Services</h4>
                        <TagsInput
                          value={getValues('specialitiesServices')}
                          onChange={(tag) => {
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
                                <InputLabel id="specialities" size='small'>
                                  Speciality
                                  <input id="gender" hidden />
                                </InputLabel>
                                <Select
                                  size='small'
                                  labelId="specialities"
                                  id="specialities"
                                  label="Speciality"
                                  error={errors.specialities == undefined ? false : true}
                                  value={value.length == 0 ? '' : value[0]?.specialities}
                                >
                                  {
                                    specialities.map((spec, index) => {
                                      return (
                                        <MenuItem key={spec._id}
                                          value={spec.specialities}
                                          divider
                                          onClick={() => {
                                            removeSpecialities(0)
                                            appendSpecialities(spec)
                                          }}>
                                          <img src={`${spec.image}?random=${new Date().getTime()}`} alt='' width='25' height='25' style={{ marginRight: 4 }} />

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

              <div className="submit-section submit-btn-bottom">
                <button type="submit" className="btn btn-primary submit-btn" onClick={() => {
                  if (getValues('specialitiesServices')?.length == 0) {
                    setError('specialitiesServices', { type: 'required', message: 'This field is required' })
                  }
                }}>
                  Save Changes
                </button>
              </div>
            </form>
        }
      </div>
    </Fragment>
  )
})

export default ProfileSetting;