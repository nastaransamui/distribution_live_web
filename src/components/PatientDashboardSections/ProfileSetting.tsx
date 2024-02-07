/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, ReactNode, useEffect, useMemo, useState } from 'react'
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

//redux
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '@/redux/store';
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';
import { updateHomeAccessToken } from '@/redux/homeAccessToken';
import { updateUserProfile } from '@/redux/userProfile';

//utilites
import dayjs from 'dayjs';
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
import chunkString from '@/helpers/chunkString';



const ProfileSetting: FC = (() => {
  const { muiVar, bounce } = useScssVar();
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme()
  const [uploadImage, setUploadImage] = useState(patient_profile)
  const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const userData = useSelector((state: AppState) => state.userData.value)
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
    reset,
    control,
    getValues,
    setValue: setFormValue
  } = useForm({
    defaultValues: {
      ...userProfile
    }
  })
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
                console.log({ accessToken, user_id, services, roleName, iat, exp, userProfile })
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
                    setUploadImage(patient_profile)
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
                  setUploadImage(patient_profile)
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
    if (userProfile !== null && isClient) {
      let profileObj: any = Object.entries(userProfile)
      profileObj.map((a: any) => {
        setFormValue(a[0], a[1])
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile, isClient])


  return (
    <Fragment>
      <div className="col-md-7 col-lg-8 col-xl-9" style={muiVar}>
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
                            {/* <img src={userProfile?.profileImage == '' ? uploadImage : uploadImage.startsWith('blob') ? uploadImage : userProfile?.profileImage} alt="" /> */}
                            <Avatar variant="square" sx={{
                              height: { md: `100px`, xs: '80px' },
                              width: { md: `100px`, xs: '80px' },
                              objectFit: 'cover',
                              borderRadius: '4px',
                            }} alt="" src={
                              userProfile?.profileImage == "" ?
                                uploadImage : uploadImage.startsWith('blob') ?
                                  uploadImage :
                                  `${userProfile?.profileImage}?random=${new Date().getTime()}`}
                              key={userProfile?.profileImage}
                            >
                              <img src={patient_profile} alt="" />
                            </Avatar>
                          </div>
                          <div className="upload-img" >
                            <div className="change-photo-btn" style={{ cursor: 'pointer' }}>
                              <span><i className="fa fa-upload"></i> Upload Photo</span>
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
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="form-group">
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
                                  onChange={(event) => {
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
                    <div className="col-12 col-md-3">
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
                          rules={{ required: 'This field is required' }}
                          name='bloodG'
                          control={control}
                          render={(props: any) => {
                            const { field, fieldState, formState } = props;
                            const { ref, onChange, value } = field;
                            const { defaultValues } = formState;
                            return (
                              <FormControl fullWidth >
                                <InputLabel id="bloodGLable">
                                  Blood Group
                                  <input id="bloodGLable" hidden />
                                </InputLabel>
                                <Select
                                  labelId="bloodGLable"
                                  id="bloodG"
                                  label="Blood Group"
                                  error={errors.bloodG == undefined ? false : true}
                                  value={value}
                                  onChange={(e: SelectChangeEvent) => {
                                    onChange(e)
                                  }}
                                  renderValue={(value) => `🩸  - ${value}`}
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
                              />
                            )
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="form-group">
                        <TextField
                          required
                          id="address1"
                          label="Address 1"
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
                    <div className="col-12 col-md-6">
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
                    <div className="col-12 col-md-6">
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
                    <div className="col-12 col-md-6">
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
                    <div className="col-12 col-md-6">
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
                    <div className="col-12 col-md-6">
                      <div className="form-group">
                        <TextField
                          required
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
                            required: "This field is required",
                          })
                          }
                          fullWidth
                        />
                      </div>
                    </div>
                  </div>
                  <div className="submit-section">
                    <button type="submit" className="btn btn-primary submit-btn" >Save Changes</button>
                  </div>
                </form>

            }
          </div>
        </div>
      </div>
    </Fragment>
  )
});

export default ProfileSetting;