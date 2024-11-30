/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useState, useEffect } from "react";
import useScssVar from "@/hooks/useScssVar";
import Link from "next/link";

import { health_care_1, heart_2, heart_bg, home5banner_img } from '../../../public/assets/imagepath';
import { useTheme } from "@mui/material";
import TextField from '@mui/material/TextField'
import InputAdornment from "@mui/material/InputAdornment";
import FeatherIcon from "feather-icons-react";
import AOS from 'aos'
import { useRouter } from "next/router";

import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'

import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { useForm } from 'react-hook-form';
import GeoLocationAutocomplete from '@/shared/GeoLocationAutocomplete';



const HomeBanner: FC = (() => {
  const { muiVar, inputAutoSelectPaper } = useScssVar();
  const theme = useTheme();
  const router = useRouter();
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);

  const [keyWord, setKeyWord] = useState<string>('')
  const [showFilter, setShowFilter] = useState<boolean>(false)
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
      <section className="banner-section" style={{ ...muiVar, background: `url(/assets/images/bg/home-10-banner_${theme.palette.primary.main.slice(1)}.webp)` }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="banner-content aos" data-aos="fade-up">
                <h6>
                  <img src={heart_2} className="me-2" alt="#" />Every Beat, Every Moment
                </h6>
                <h1>Preventive Care Is Essential For <br /><span>Healthy Heart</span></h1>
                <p>We can guide you through issues like Cardiac arrest, Heart Failure, Peripheral Artery
                  Disease, Arrhythmia, Atrial Fibrillation, Cholesterol and High BP.</p>
                <Link href="/cardiohome" scroll={false} className="btn" onClick={(e) => {
                  e.preventDefault();
                  setShowFilter(!showFilter)
                }}>Start a Consult</Link>
                <Link href="/cardiohome" scroll={false} className="btn" style={{ marginLeft: 25 }}>Click Our Plan</Link>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="banner-img aos" data-aos="fade-up">
                <img src={home5banner_img} className="img-fluid" alt="#" />
                <img src={heart_bg} className="img-fluid" alt="#" />
              </div>
            </div>
            <div className="col-md-12">
              <div className="search-box-one search-ten aos" data-aos="fade-up">
                <div className="search-title">
                  <h1 style={{ fontSize: '1rem', color: theme.palette.primary.main }}>Book An Apppointment</h1>
                  <img src={health_care_1} alt="#" />
                </div>
                <Box component="form"
                  noValidate
                  autoComplete="off"
                >
                  <Grid container spacing={{ lg: 1, xl: 1, md: 1, sm: 2, xs: 1 }}>
                    <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>

                      <TextField
                        required
                        id="KeyWord"
                        placeholder={keyWord == '' ? "Key word" : ""}
                        label={keyWord !== '' ? "Key word" : ""}
                        value={keyWord}
                        fullWidth
                        sx={{ mt: { xl: 1, lg: 1, md: 1, sm: 2, xs: 0 }, mb: { xl: 1, lg: 1, md: 1, sm: 2, xs: 0 } }}
                        size="small"
                        InputLabelProps={{
                          shrink: keyWord !== ''
                        }}
                        onChange={(e) => setKeyWord(e.target.value)}
                        InputProps={{
                          startAdornment: //keyWord !== '' &&
                            <InputAdornment position="start" >
                              <IconButton aria-label="search" disableTouchRipple onClick={() => {
                                keyWord !== '' && setKeyWord('')
                              }}>
                                {keyWord == '' ? <FeatherIcon
                                  icon="search"
                                  style={{ width: "16px", color: theme.palette.secondary.main }}
                                /> :
                                  <FeatherIcon
                                    icon="x"
                                    style={{ width: "16px", color: theme.palette.secondary.main }}
                                  />}
                              </IconButton>
                            </InputAdornment>,
                          endAdornment: <InputAdornment position='end'>
                            <IconButton aria-label="filter" disableTouchRipple onClick={() => setShowFilter(!showFilter)}>
                              <FeatherIcon icon="filter" style={{ width: "16px", color: theme.palette.secondary.main }} />
                            </IconButton>
                          </InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                      <FormControl fullWidth >
                        <InputLabel id="availability-label" htmlFor="availability" size='small' sx={{ mt: { xl: 1, lg: 1, md: 1, sm: 2, xs: 2 }, mb: { xl: 1, lg: 1, md: 1, sm: 2, xs: 2 } }}>
                          Availablitity
                          <input id="availablity" hidden />
                        </InputLabel>
                        <Select
                          size='small'
                          labelId="availability-label"
                          inputProps={{
                            id: "availability",
                            name: "availability"
                          }}
                          aria-label="availability"
                          label="Availablitity"
                          value={availablityValue}
                          onChange={(e: SelectChangeEvent) => {
                            setAvailablityValue(e.target.value)
                          }}
                          sx={{ ...inputAutoSelectPaper, mt: { xl: 1, lg: 1, md: 1, sm: 2, xs: 2 }, mb: { xl: 1, lg: 1, md: 1, sm: 2, xs: 2 } }}
                        >
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
                  <Box
                    sx={{
                      height: showFilter ? 100 : 0,
                      [theme.breakpoints.only('sm')]: {
                        height: showFilter ? 150 : 0,
                      },
                      [theme.breakpoints.only('xs')]: {
                        height: showFilter ? 270 : 0,
                      },
                      visibility: showFilter ? 'visible' : 'hidden',
                      transition: 'height 0.75s ease-in'
                    }}
                  >
                    <Grid container spacing={{ lg: 1, xl: 1, md: 1, sm: 2, xs: 2 }} sx={{
                      mt: 1, visibility: showFilter ? 'visible' : 'hidden',
                      transition: `visibility ${showFilter ? `0.75s` : `0s`} ease-in`,
                      transitionDelay: showFilter ? `0.75s` : `0s`
                    }} >
                      <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                        {specialities.length !== 0 &&
                          <FormControl fullWidth >
                            <InputLabel id="specialities-label" htmlFor="specialities" size='small'>
                              Speciality
                              {/* <input id="specialities" hidden /> */}
                            </InputLabel>
                            <Select
                              size='small'
                              labelId="specialities-lable"
                              inputProps={{
                                id: 'specialities',
                                name: "specialities",
                                "aria-label": "specialities"
                              }}
                              aria-label="specialities"
                              label="Speciality"
                              value={specialitiesValue}
                              sx={inputAutoSelectPaper}
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
                                      <img src={`${spec.image}?random=${new Date().getTime()}`} alt='' width='25' height='25' style={{ marginRight: 4 }} />

                                      {spec.specialities}
                                    </MenuItem>
                                  )
                                })
                              }
                            </Select>
                          </FormControl>
                        }
                      </Grid>
                      <Grid item xl={2} lg={2} md={2} sm={6} xs={12}>
                        <FormControl fullWidth >
                          <InputLabel id="gender-label" htmlFor="gender" size='small'>
                            Gender
                            {/* <input id="gender" hidden /> */}
                          </InputLabel>
                          <Select
                            size='small'
                            labelId="gender-label"
                            inputProps={{
                              id: "gender",
                              name: 'gender',
                              "aria-label": "gender"
                            }}
                            aria-label="gender"
                            label="Gender"
                            value={genderValue}
                            onChange={(e: SelectChangeEvent) => {
                              setGenderValue(e.target.value)
                            }}
                            sx={inputAutoSelectPaper}
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
                      <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
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
                        />
                      </Grid>
                      <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
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
                        />
                      </Grid>
                      <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
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
                        />
                      </Grid>
                    </Grid>

                  </Box>
                  <div className="form-search-btn">
                    <Button sx={{
                      mb: { lg: 1.5, md: 2, sm: 2, xs: 2 },
                      mt: { lg: 1.5, md: 2, sm: 4, xs: 2 },
                      float: 'right',
                      width: {
                        xl: showFilter ? '49.5%' : '100%',
                        lg: showFilter ? '49.5%' : '100%',
                        md: showFilter ? '49.5%' : '100%',
                        sm: showFilter ? '49.5%' : '100%',
                        xs: showFilter ? '45%' : '100%'
                      },
                      transition: `width 0.75s ease-in`,
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
                    <Button sx={{
                      mb: { lg: 1.5, md: 2, sm: 2, xs: 2 },
                      mt: { lg: 1.5, md: 2, sm: 4, xs: 2 },
                      width: {
                        xl: showFilter ? '47.5%' : '90%',
                        lg: showFilter ? '47%' : '90%',
                        md: showFilter ? '46.5%' : '90%',
                        sm: showFilter ? '45%' : '90%',
                        xs: showFilter ? '42%' : '90%'
                      },
                      visibility: showFilter ? 'visible' : 'hidden',
                      position: 'absolute',
                      transition: `width 0.75s ease-in`,
                      zIndex: 1,
                      color: 'white',
                      transitionDelay: showFilter ? `0s` : `0.75s`
                    }}
                      className='btnLogin' onClick={(e) => {
                        e.preventDefault();
                        setKeyWord('')
                        setGenderValue('')
                        setSpecialitiesValue('')
                        console.log(value)
                        console.log(inputValue)
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
                  </div>
                </Box>
              </div>
            </div>
          </div>
        </div>
      </section >
    </Fragment >
  )
});

export default HomeBanner;