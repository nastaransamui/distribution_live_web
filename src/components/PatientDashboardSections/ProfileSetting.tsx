/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, ReactNode, useEffect, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { patient_profile } from '@/public/assets/imagepath'


//Mui
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar'
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
import useMediaQuery from '@mui/material/useMediaQuery';


//redux
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '@/redux/store';
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';
import { updateHomeAccessToken } from '@/redux/homeAccessToken';

//utilites
import dayjs, { Dayjs } from 'dayjs';
import { useForm, Controller } from 'react-hook-form';
import FormHelperText from '@mui/material/FormHelperText';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import verifyHomeAccessToken from '@/helpers/verifyHomeAccessToken';

//next
import { useRouter } from 'next/router';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';



import { useTheme } from '@mui/material';
import GeoLocationAutocomplete from '@/shared/GeoLocationAutocomplete';
import { toast } from 'react-toastify';
import isJsonString from '@/helpers/isJson';
import { updateUserPatientProfile, UserPatientProfileTypeValue } from '@/redux/userPatientProfile';
import { updateHomeExp } from '@/redux/homeExp';
import { updateHomeIAT } from '@/redux/homeIAT';
import { updateHomeRoleName } from '@/redux/homeRoleName';
import { updateHomeServices } from '@/redux/homeServices';
import { updateHomeUserId } from '@/redux/homeUserId';
import { updateUserDoctorProfile } from '@/redux/userDoctorProfile';



const ProfileSetting: FC = (() => {
  const { muiVar, bounce } = useScssVar();
  const matches = useMediaQuery('(max-width:370px)');
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme()
  const [uploadImage, setUploadImage] = useState(patient_profile)
  // const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  // const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  // const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  // const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

  const userData = useSelector((state: AppState) => state.userData.value)
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const userProfileForForm = userPatientProfile ?? {
    accessToken: '',
    address1: '',
    address2: '',
    billingsIds: [],
    bloodG: undefined,
    city: '',
    country: '',
    createdAt: new Date(),
    dependentsArray: [],
    dob: '',
    doctors_id: [],
    favs_id: [],
    firstName: '',
    gender: '',
    idle: false,
    invoice_ids: [],
    isActive: false,
    isVerified: false,
    lastLogin: undefined,
    lastName: '',
    lastUpdate: new Date(),
    medicalRecordsArray: [],
    mobileNumber: '',
    online: false,
    prescriptions_id: [],
    profileImage: '',
    rate_array: [],
    reservations_id: [],
    reviews_array: [],
    roleName: 'patient',
    services: 'password',
    state: '',
    userName: '',
    zipCode: '',
    _id: '',
  };
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
    reset,
    control,
    getValues,
    setValue: setFormValue
  } = useForm<UserPatientProfileTypeValue>({
    defaultValues: userProfileForForm,
  })
  const onProfileSubmit = (data: any) => {
    !data.city ? data.city = inputValue.city : data.city;
    !data.state ? data.state = inputValue.state : data.state;
    !data.country ? data.country = inputValue.country : data.country;
    var fileToRead: any = document.getElementById("profile");
    data.profileImageFiles = [];
    data.clinicImagesFiles = [];
    data.deletedImages = [];
    data.userId = userPatientProfile?._id
    var file;
    if (fileToRead.files.length !== 0) {
      file = fileToRead.files[0]
      data.profileImageFiles.push({
        profileImage: file,
        profileImageName: file.name,
        profileImageExtentionNoDot: file.name.slice(file.name.indexOf('.') + 1)
      });
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

  const [disable, setDisable] = useState({
    city: false,
    state: false,
    country: false,
  })

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])


  useEffect(() => {
    if (userPatientProfile !== null && isClient) {
      let profileObj: any = Object.entries(userPatientProfile)
      profileObj.map((a: any) => {
        setFormValue(a[0], a[1])
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPatientProfile, isClient])

  const deleteUser = () => {

    document.getElementById('delete_modal')?.classList.replace('animate__backOutDown', 'animate__backInDown')
    window.$('#delete_modal').modal('toggle')
  }

  const confirmDeleteClick = () => {
    let data = {
      userId: userPatientProfile?._id,
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
      <div className="col-md-7 col-lg-8 col-xl-9  animate__animated animate__backInUp" style={muiVar}>
        <div className="card">
          <div className="card-body">
            {
              !isClient ? <CircleToBlockLoading color={theme.palette.primary.main} size="small" style={{
                minWidth: '100%',
                display: 'flex',
                justifyContent: 'center',
              }} /> :

                <form noValidate onSubmit={handleSubmit(onProfileSubmit)}>
                  <div className="row form-row">
                    <div className="col-12 col-md-12">
                      <div className="form-group">
                        <div className="change-avatar">
                          <div className="profile-img">
                            <Avatar variant="square" sx={{
                              height: { md: `100px`, xs: '80px' },
                              width: { md: `100px`, xs: '80px' },
                              objectFit: 'cover',
                              borderRadius: '4px',
                            }} alt="" src={
                              userPatientProfile?.profileImage == "" ?
                                uploadImage : uploadImage.startsWith('blob') ?
                                  uploadImage :
                                  `${userPatientProfile?.profileImage}`}
                              key={userPatientProfile?.profileImage}
                            >
                              <img src={patient_profile} alt="" />
                            </Avatar>
                          </div>
                          <div className="upload-img" >
                            <div className="change-photo-btn" style={{ cursor: 'pointer' }}>
                              <label htmlFor='profile'><i className="fa fa-upload"></i> Upload Photo</label>
                              <input type="file" id='profile' className="upload" accept="image/png, image/jpg, image/jpeg" onChange={uploadFile} />
                            </div>
                            <small className="form-text text-muted">Allowed JPG, GIF or PNG. Max size of 2MB</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
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
                    <div className="col-12 col-md-6">
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
                    <div className="col-12 col-md-6">
                      <div className="form-group">
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
                                  onChange={(event: Dayjs | null) => {
                                    onChange(dayjs(event).format(`YYYY-MM-DD`));
                                  }}
                                  slotProps={{
                                    textField: {
                                      inputProps: { value: value == '' ? 'Date of Birth' : dayjs(value).format('DD MMM YYYY') },
                                      fullWidth: true,
                                      required: true,
                                      label: 'Date of Birth',
                                      error: errors.dob == undefined ? false : true,
                                      helperText: errors.dob && errors['dob']['message'] as ReactNode,
                                      size: 'small'
                                    },
                                  }}
                                />
                              </LocalizationProvider>
                            )
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-3">
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
                                <InputLabel size='small' id="gender-label" htmlFor="gender">
                                  Gender
                                </InputLabel>
                                <Select
                                  labelId="gender-label"
                                  inputProps={{
                                    id: 'gender',
                                    name: 'gender'
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
                                  <MenuItem value="Ms">👩 Mss</MenuItem>
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
                    <div className="col-12 col-md-3">
                      <div className="form-group">
                        <Controller
                          // rules={{ required: 'This field is required' }}
                          name='bloodG'
                          control={control}
                          render={(props: any) => {
                            const { field, fieldState, formState } = props;
                            const { ref, onChange, value } = field;
                            const { defaultValues } = formState;
                            return (
                              <FormControl fullWidth >
                                <InputLabel size='small' id="bloodGLable" htmlFor="blood">
                                  Blood Group
                                </InputLabel>
                                <Select
                                  labelId="bloodGLable"
                                  inputProps={{
                                    id: "blood",
                                    name: 'blood'
                                  }}
                                  label="Blood Group"
                                  error={errors.bloodG == undefined ? false : true}
                                  value={value}
                                  onChange={(e: SelectChangeEvent) => {
                                    onChange(e)
                                  }}
                                  renderValue={(value) => `🩸  - ${value}`}
                                  size='small'
                                >
                                  <MenuItem value="A+">🅰️ A+</MenuItem>
                                  <MenuItem value="A-">🅰️ A-</MenuItem>
                                  <MenuItem value="B+">🅱️ B+</MenuItem>
                                  <MenuItem value="B-">🅱️ B-</MenuItem>
                                  <MenuItem value="AB+">🆎 AB+</MenuItem>
                                  <MenuItem value="BA-">🆎 AB-</MenuItem>
                                  <MenuItem value="O+">🅾️ O+</MenuItem>
                                  <MenuItem value="O-">🅾️ O-</MenuItem>
                                </Select>
                                {
                                  errors.bloodG &&
                                  <FormHelperText error>{errors.bloodG && errors['bloodG']['message'] as ReactNode}</FormHelperText>
                                }
                              </FormControl>
                            )
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
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
                    <div className="col-12 col-md-6">
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
                    <div className="col-12 col-md-6">
                      <div className="form-group">
                        <TextField
                          // required
                          id="address1"
                          label="Address 1"
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
                    <div className="col-12 col-md-6">
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
                    <div className="col-12 col-md-6">
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
                    <div className="col-12 col-md-6">
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
                    <div className="col-12 col-md-6">
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
                    <div className="col-12 col-md-6">
                      <div className="form-group">
                        <TextField
                          // required
                          id="zipCode"
                          label="Zip Code"
                          onKeyDown={(e) => {
                            const allowKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace', 'Enter', 'Delete']
                            if (!allowKeys.includes(e.key)) {
                              e.preventDefault()
                            }
                          }}
                          error={errors.zipCode == undefined ? false : true}
                          helperText={errors.zipCode && errors['zipCode']['message'] as ReactNode}
                          {
                          ...register('zipCode', {
                            // required: "This field is required",
                          })
                          }
                          fullWidth
                          size='small'
                        />
                      </div>
                    </div>
                  </div>
                  <div className="submit-section submit-btn-bottom " style={{ display: 'flex', justifyContent: "space-between", flexDirection: matches ? 'column' : "row" }}>
                    <button type="submit" className="btn btn-primary submit-btn" >
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

            }
          </div>
        </div>
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
});

export default ProfileSetting;