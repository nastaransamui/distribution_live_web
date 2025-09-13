
/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import {
  ban_fift_icon1,
  ban_fift_icon2,
  ban_fift_icon3,
  ban_fift_icon4,
  ban_fift_icon5,
  ban_fift_icon6,
  ban_fift_icon7,
  banner_vd,
  doctor1,
  doctor2,
  doctor3,
  doctor4,
  doctor5,
  doctor6,
} from "../../../public/assets/imagepath";
import { Skeleton, Tooltip, useTheme } from '@mui/material';
import { CustomerServiceOneSvg, CustomerServiceTwoSvg, FifteenPlaySvg } from '../../../public/assets/images/icons/IconsSvgs';
import Typography from "@mui/material/Typography";
import Avatar from '@mui/material/Avatar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useForm } from 'react-hook-form';
import { AppState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import GeoLocationAutocomplete from '@/shared/GeoLocationAutocomplete';
import Head from 'next/head';
import { BestDoctorsType } from '@/redux/bestDoctorsData';
import { StyledBadge } from '../DoctorDashboardSections/ScheduleTiming';
import { Filter, X, Search } from 'feather-icons-react';


const HomeSearch: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  const bestDoctorsData = useSelector((state: AppState) => state.bestDoctorsData)
  const { bestDoctors, totalDoctors } = bestDoctorsData;

  const avatar3Sx = { background: theme.palette.background.paper, mt: 1, width: 40, height: 40, ml: -1, border: `1px solid ${theme.palette.text.color}` }
  const avatarTextSx = { fontSize: '14px', background: theme.palette.secondary.main, mt: 1, width: 40, height: 40, ml: -1, border: `1px solid ${theme.palette.text.color}` }
  const widthMax1200 = useMediaQuery('(max-width:1200px)');
  const router = useRouter();
  const [keyWord, setKeyWord] = useState<string>('')
  const [showFilter, setShowFilter] = useState<boolean>(false)
  const [showSearch, setShowSearch] = useState<boolean>(false)
  const specialities = useSelector((state: AppState) => state.specialities.value)
  const [specialitiesValue, setSpecialitiesValue] = useState<string>('')
  const [genderValue, setGenderValue] = useState<string>('')
  const [availablityValue, setAvailablityValue] = useState<string>('')

  const {
    register,
    clearErrors,
    formState: { errors },
    getValues,
    setValue: setFormValue,
  } = useForm({
    defaultValues: {
      city: '',
      country: '',
      state: '',
    }
  })
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

  return (
    <Fragment>
      <Head>
        <link rel="preload" href={`/assets/images/banner-fifteen_${theme.palette.primary.main.slice(1)}.webp`} as="image" />
      </Head>
      <section className="banner-section-fifteen" style={{ ...muiVar, backgroundImage: `url(/assets/images/banner-fifteen_${theme.palette.primary.main.slice(1)}.webp)` }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-7">
              <div
                className="banner-content banner-content-fifteen aos"
                data-aos="fade-up"
              >
                <Grid container spacing={{ lg: 1, xl: 1, md: 1, sm: 2, xs: 7 }}>
                  <Grid size={{ xl: 6, lg: 6, md: 6, sm: 6, xs: 12 }}>
                    <FormControl fullWidth id="KeyWord" className='animate__animated '
                      sx={{
                        position: 'absolute',
                        visibility: 'hidden',
                        maxWidth: { lg: '49.3%', md: '49.3%', sm: '49.3%' },
                        left: 0,
                        zIndex: 2
                      }}>
                      <TextField
                        required
                        placeholder={keyWord == '' ? "Key word" : ""}
                        label={keyWord !== '' ? "Key word" : ""}
                        value={keyWord}
                        fullWidth
                        sx={{
                          bgcolor: theme.palette.background.default,
                          transition: theme.transitions.create('all', {
                            duration: 200,
                          }),
                        }}
                        size="small"
                        slotProps={{
                          inputLabel: {
                            shrink: keyWord !== ''
                          },
                          input: {
                            startAdornment:
                              <InputAdornment position="start" >
                                <IconButton aria-label='search' disableTouchRipple onClick={() => {
                                  keyWord !== '' && setKeyWord('')
                                }}>
                                  {keyWord == '' ? <Search
                                    style={{ width: "16px", color: theme.palette.secondary.main }}
                                  /> :
                                    <X
                                      style={{ width: "16px", color: theme.palette.secondary.main }}
                                    />}
                                </IconButton>
                              </InputAdornment>,
                            endAdornment: <InputAdornment position='end'>
                              <IconButton aria-label='filter' disableTouchRipple onClick={() => setShowFilter(!showFilter)}>
                                <Filter style={{ width: "16px", color: theme.palette.secondary.main }} />
                              </IconButton>
                            </InputAdornment>,
                          }
                        }}
                        onChange={(e) => setKeyWord(e.target.value)}

                      />
                    </FormControl>
                  </Grid>
                  <Grid size={{ xl: 6, lg: 6, md: 6, sm: 6, xs: 12 }}>
                    <FormControl fullWidth className='animate__animated ' id="availablity" sx={{
                      position: 'absolute',
                      visibility: 'hidden',
                      maxWidth: { lg: '49.3%', md: '49.3%', sm: '49.3%' },
                      right: 0,
                      zIndex: 1
                    }}>
                      <InputLabel id="availablity" size='small' >
                        Availablitity
                        <input id="availablity" hidden />
                      </InputLabel>
                      <Select
                        size='small'
                        labelId="availablity"
                        id="availablity"
                        label="Availablitity"
                        value={availablityValue}
                        onChange={(e: SelectChangeEvent) => {
                          setAvailablityValue(e.target.value)
                        }}
                        sx={{ bgcolor: theme.palette.background.default }}>
                        <MenuItem value="" divider
                          onClick={() => {
                            setAvailablityValue('')
                          }}>
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="Available">Available</MenuItem>
                        <MenuItem value="AvailableToday">Available Today</MenuItem>
                        <MenuItem value="AvailableTomorrow">Available Tomorrow</MenuItem>
                        <MenuItem value="AvailableThisWeek">Available ThisWeek</MenuItem>
                        <MenuItem value="AvailableThisMonth">Available ThisMonth</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <h2 id="h2_ent" className='animate__animated '>Painless, Safe Service</h2>
                <h1 id="h1_ent" className='animate__animated '>Hear what you have been Missing</h1>
                <Box
                  id="box_cosmetic"
                  className='animate__animated '
                  component="form"
                  autoComplete='off'
                  sx={{
                    visibility: showFilter ? 'visible' : 'hidden',
                    mt: { sm: -7, lg: -15, xl: -16 },
                    height: showFilter ? 150 : 0,
                    "@media (max-width:600px)": {
                      mt: -10,
                      height: 290,

                    },
                    "@media (min-width:480px) and (max-width:600px)": {
                      mt: -5,
                    },

                    "@media (min-width:992px) and (max-width:1200px)": {
                      mt: -16,
                    },
                    "@media (min-width:600px) and (max-width:767px)": {
                      mt: -5,
                    },
                    transition: theme.transitions.create('all', {
                      duration: '0.75s',
                      easing: 'ease-in'
                    }),
                  }}
                >
                  <Grid container spacing={{ lg: 1, xl: 1, md: 1, sm: 1, xs: 2 }}
                    sx={{
                      visibility: showFilter ? 'visible' : 'hidden',
                    }}
                  >
                    <Grid size={{ xl: 6, lg: 6, md: 6, sm: 6, xs: 12 }}>
                      {specialities.length !== 0 &&
                        <FormControl fullWidth >
                          <InputLabel id="specialities" size='small'>
                            Speciality
                            <input id="specialities" hidden />
                          </InputLabel>
                          <Select
                            size='small'
                            labelId="specialities"
                            id="specialities"
                            label="Speciality"
                            value={specialitiesValue}
                            sx={{ bgcolor: theme.palette.background.default }}
                          >
                            <MenuItem value="" divider
                              onClick={() => {
                                setSpecialitiesValue('')
                              }}>
                              <em>None</em>
                            </MenuItem>
                            {
                              specialities.map((spec, index) => {
                                return (
                                  <MenuItem key={spec._id}
                                    value={spec.specialities}
                                    divider
                                    onClick={() => {
                                      setSpecialitiesValue(() => (spec?.specialities))
                                    }}>
                                    <img src={`${spec.image}`} alt='' width='25' height='25' style={{ marginRight: 4 }} />

                                    {spec.specialities}
                                  </MenuItem>
                                )
                              })
                            }
                          </Select>
                        </FormControl>
                      }
                    </Grid>
                    <Grid size={{ xl: 6, lg: 6, md: 6, sm: 6, xs: 12 }}>
                      <FormControl fullWidth >
                        <InputLabel id="gender" size='small'>
                          Gender
                          <input id="gender" hidden />
                        </InputLabel>
                        <Select
                          size='small'
                          labelId="gender"
                          id="gender"
                          label="Gender"
                          value={genderValue}
                          sx={{ bgcolor: theme.palette.background.default, }}
                          onChange={(e: SelectChangeEvent) => {
                            setGenderValue(e.target.value)
                          }}
                          renderValue={(value) => `${value == 'Mr' ? `👨` : `👩`} ${value}`}
                        >
                          <MenuItem value="" divider
                            onClick={() => {
                              setGenderValue('')
                            }}>
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value="Mr">👨 Mr</MenuItem>
                          <MenuItem value="Mrs">👩 Mrs</MenuItem>
                          <MenuItem value="Mss">👩 Mss</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xl: 6, lg: 6, md: 6, sm: 6, xs: 12 }} >
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
                        size='small'
                        required={false}
                        textFieldSX={{ sx: { bgcolor: theme.palette.background.default, } }}
                      />
                    </Grid>
                    <Grid size={{ xl: 6, lg: 6, md: 6, sm: 6, xs: 12 }}>
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
                        size='small'
                        required={false}
                        textFieldSX={{ sx: { bgcolor: theme.palette.background.default, } }}
                      />
                    </Grid>
                    <Grid size={12}>
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
                        size="small"
                        required={false}
                        textFieldSX={{ sx: { bgcolor: theme.palette.background.default, } }}
                      />
                    </Grid>
                  </Grid>

                </Box>
                <Grid
                  className="form-search-btn"
                  sx={{
                    position: 'absolute',
                    minWidth: '100%'
                  }}>
                  <FormControl fullWidth
                    id="buttons_cosmetic"
                    className='animate__animated '
                    sx={{
                      left: 0,
                      visibility: 'hidden',
                      mt: {
                        xl: 0,
                        lg: 0,
                        md: 0,
                        sm: 0,
                        xs: showFilter ? 0 : -37,
                      },
                      "@media (min-width:600px) and (max-width:767px)": {
                        // mt: showFilter ? 17 : 0,
                      },
                      transition: theme.transitions.create('all', {
                        duration: '0.75s',
                        easing: 'ease-in'
                      }),
                    }}
                  >
                    <Button
                      sx={{
                        mb: { lg: 1.5, md: 2, sm: 2, xs: 2 },
                        mt: { lg: 1.5, md: 2, sm: 2, xs: 2 },
                        float: 'right',
                        width: showFilter ? '49%' : '100%',
                        transition: `width 0.75s ease-in`,
                        visibility: showSearch ? 'visible' : 'hidden',
                        zIndex: 2,
                      }}
                      className='btnLogout' onClick={(e) => {
                        e.preventDefault();
                        let paramsObj = {
                          ...value,
                          available: availablityValue,
                          specialities: specialitiesValue,
                          gender: genderValue,
                          keyWord: keyWord
                        }
                        let param: any[] = []
                        Object.values(paramsObj).forEach((doc, index) => {
                          if (doc !== null && doc !== '') {
                            param.push(`${Object.keys(paramsObj)[index]}=${doc}`)
                          }
                        })
                        router.push(`/doctors/search${param.length !== 0 ? `?${param.join('&')}` : ``}`)
                      }}>
                      Search
                    </Button>
                    <Button
                      sx={{
                        mb: { lg: 1.5, md: 2, sm: 2, xs: 2 },
                        mt: { lg: 1.5, md: 2, sm: 2, xs: 2 },
                        right: 0,
                        width: showFilter ? '47.5%' : '90%',
                        visibility: showFilter ? 'visible' : 'hidden',
                        position: 'absolute',
                      }}
                      className='btnLogin' onClick={(e) => {
                        e.preventDefault();
                        setKeyWord('')
                        setGenderValue('')
                        setSpecialitiesValue('')
                        setInputValue(() => ({
                          city: '',
                          state: '',
                          country: ''
                        }))
                        setValue(() => ({
                          city: null,
                          state: null,
                          country: null
                        }))
                      }}>
                      reset
                    </Button>
                  </FormControl>
                </Grid>
                <Grid className="banner-btns-fifteen"
                  id="banner-btns-fifteen"
                  sx={{
                    marginTop: {
                      xl: !showFilter && !showSearch ? ' 150px !important' : showSearch && !showFilter ? ' 110px !important' : ' 110px !important',
                      lg: !showFilter && !showSearch ? ' 150px !important' : showSearch && !showFilter ? ' 110px !important' : ' 110px !important',
                      md: !showFilter && !showSearch ? ' 150px !important' : showSearch && !showFilter ? ' 110px !important' : ' 110px !important',
                      sm: !showFilter && !showSearch ? ' 150px !important' : showSearch && !showFilter ? ' 110px !important' : ' 110px !important',
                      xs: !showFilter && !showSearch ? ' -200px !important' : showSearch && !showFilter ? ' -230px !important' : ' 110px !important',
                    },
                    transition: theme.transitions.create('all', {
                      duration: '0.75s',
                      easing: 'ease-in'
                    }),
                  }}
                >
                  <Link href="" className={`btn btn-primary cosmetic-link ${widthMax1200 ? '' : 'me-2'}`}
                    onClick={(e: any) => {
                      e.preventDefault();
                      let h1 = document.getElementById('h1_ent')!
                      let h2 = document.getElementById('h2_ent')!
                      let keyword = document.getElementById('KeyWord')!
                      let availablity = document.getElementById('availablity')!
                      let buttons = document.getElementById('buttons_cosmetic')!
                      let box = document.getElementById('box_cosmetic')!
                      let banner = document.getElementById('banner-btns-fifteen')!
                      if (h1?.classList.contains('animate__backOutRight')) {
                        h1?.classList.remove('animate__backOutRight')
                        h1?.classList.add('animate__backInRight')
                        keyword?.classList.remove('animate__backInRight')
                        keyword?.classList.add('animate__backOutRight')
                        availablity?.classList.remove('animate__backInRight')
                        availablity?.classList.add('animate__backOutRight')
                        buttons?.classList.remove('animate__backInRight')
                        buttons?.classList.add('animate__backOutRight')
                        box?.classList.remove('animate__backInRight')
                        box?.classList.add('animate__backOutRight')
                        banner.classList.add('banner-ent-margin')
                        setShowSearch(false)
                        setShowFilter(false)
                      } else {
                        h1?.classList.toggle('animate__backOutRight')
                        keyword?.classList.add('animate__backInRight')
                        keyword.style.visibility = "visible"
                        availablity?.classList.add('animate__backInRight')
                        availablity.style.visibility = "visible"
                        buttons?.classList.add('animate__backInRight')
                        buttons.style.visibility = "visible"
                        box?.classList.add('animate__backInRight')
                        box.style.visibility = "visible"
                        banner.classList.remove('banner-ent-margin')
                        setShowSearch(true)

                        if (keyword?.classList.contains("animate__backOutRight")) {
                          keyword?.classList.remove('animate__backOutRight')
                        }
                        if (availablity?.classList.contains("animate__backOutRight")) {
                          availablity?.classList.remove('animate__backOutRight')
                        }
                        if (buttons?.classList.contains("animate__backOutRight")) {
                          buttons?.classList.remove('animate__backOutRight')
                        }
                        if (box?.classList.contains("animate__backOutRight")) {
                          box?.classList.remove('animate__backOutRight')
                        }
                      }
                      if (h2?.classList.contains('animate__backOutRight')) {
                        h2?.classList.remove('animate__backOutRight')
                        h2?.classList.add('animate__backInRight')
                      } else {
                        h2?.classList.toggle('animate__backOutRight')
                      }
                    }}>
                    Make an Appointment
                  </Link>
                  <Link
                    href=""
                    className="btn btn-primary btns-primarytwo cosmetic-link"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    Quick Consultation
                  </Link>
                </Grid>
                <div className="aboutus-companyimg">
                  <Link href="#" aria-label='link'>
                    <img
                      src={banner_vd}
                      alt="image"
                      className="img-fluid"
                    />
                  </Link>
                  <Link aria-label='link'
                    href=""
                    onClick={(e) => e.preventDefault()}
                  >
                    <div className="playicon">
                      <span>
                        <i className="fa-solid fa-play" style={{ color: theme.palette.background.paper }} />
                      </span>
                    </div>
                  </Link>
                </div>
                <div className="watch-video-fifteen">
                  <FifteenPlaySvg />
                  <h1>Watch Video About Us</h1>
                </div>
                <div className="support-consult-main">
                  <div className="support-consult">
                    <div className="support-consult-img">
                      <CustomerServiceTwoSvg />
                    </div>
                    <div className="support-consult-right">
                      <h2>24/7 Support</h2>
                      <div className="rating rating-fifteen">
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star" />
                      </div>
                    </div>
                  </div>
                  <div className="support-consult">
                    <div className="support-consult-img">
                      <CustomerServiceOneSvg />
                    </div>
                    <div className="support-consult-right">
                      <h3>Online Consultation</h3>
                      <span>Just 60 Secs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="banner-right-fifteen">
                <img
                  src={`/assets/images/banner-fifteen-ryt_${theme.palette.secondary.main.slice(1)}.webp`}
                  alt="image"
                  className="img-fluid"
                />
                <Grid id="banner-right-fifteenone" className="banner-right-fifteenone" sx={{
                  top: {
                    xl: showFilter ? '300px !important' : showSearch ? '150px !important' : '100px !important',
                    lg: showFilter ? '200px !important' : '100px !important'
                  },
                  transition: theme.transitions.create('all', {
                    duration: '0.75s',
                    easing: 'ease-in'
                  }),
                }}>
                  <img src={ban_fift_icon1} alt="" />
                </Grid>
                <div className="banner-right-fifteentwo">
                  <img src={ban_fift_icon2} alt="" />
                </div>
                <div className="banner-right-fifteenthree">
                  <img src={ban_fift_icon3} alt="" />
                </div>
                <div className="banner-right-fifteenfour">
                  <img src={ban_fift_icon4} alt="" />
                </div>
                <div className="banner-right-fifteenfive">
                  <img src={ban_fift_icon5} alt="" />
                </div>
                <div className="banner-right-fifteensix">
                  <img src={ban_fift_icon6} alt="" />
                </div>
                <div className="banner-right-fifteenseven">
                  <img src={ban_fift_icon7} alt="" />
                </div>
                <div className="banner-right-fifteeneight">
                  {/* <img src={ban_fift_icon8} alt="" /> */}
                  <div className="banner-img3-div" >
                    <Typography sx={{ ml: -10, mt: 2 }} display="block" gutterBottom>Meet our doctors</Typography>
                    {
                      bestDoctors == null ?
                        <span style={{ display: 'flex' }}>
                          {
                            Array.from(Array(6).keys()).map((i) => (
                              <Skeleton
                                key={i}
                                animation="wave"
                                variant="circular"
                                sx={{
                                  ...avatar3Sx,
                                  border: `1px solid ${theme.palette.secondary.main}`
                                }} />
                            ))
                          }
                          <Avatar sx={avatarTextSx} alt="" >.....</Avatar>
                        </span>
                        :
                        bestDoctors.length == 0 ?
                          <span style={{ display: 'flex' }}>
                            <Avatar sx={avatar3Sx} alt="" src={doctor1} />
                            <Avatar sx={avatar3Sx} alt="" src={doctor2} />
                            <Avatar sx={avatar3Sx} alt="" src={doctor3} />
                            <Avatar sx={avatar3Sx} alt="" src={doctor4} />
                            <Avatar sx={avatar3Sx} alt="" src={doctor5} />
                            <Avatar sx={avatar3Sx} alt="" src={doctor6} />
                            <Avatar sx={avatarTextSx} alt="" >120+</Avatar>

                          </span> :
                          <span style={{ display: 'flex' }}>
                            {
                              bestDoctors.slice(0, 6).map((bestDoctor: BestDoctorsType, index: number) => (
                                <Tooltip key={index} arrow placement="top" title={`Dr. ${bestDoctor.fullName}`}>
                                  <Link href={`/doctors/profile/${btoa(bestDoctor._id)}`} >
                                    <StyledBadge
                                      overlap="circular"
                                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                      variant="dot"
                                      online={bestDoctor?.online}
                                    >
                                      <Avatar sx={avatar3Sx} alt="" src={bestDoctor?.profileImage} />
                                    </StyledBadge>
                                  </Link>
                                </Tooltip>
                              ))
                            }
                            <Avatar sx={avatarTextSx} alt="" >{`${totalDoctors}+`}</Avatar>

                          </span>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
})

export default HomeSearch;