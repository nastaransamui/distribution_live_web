/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useRef, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import {
  atom_bond,
  baby_star,
  cloud_1,
  cloud_2,
  gold_star,
  home_13_banner,
  pink_star,
  pulse_1,
  pulse_2,
  pulse_3,
  pulse_4,
  pulse_6,
  pulse_7,
  pulse_white,
  star_1
}
  from '../../../public/assets/imagepath'
import Link from 'next/link'
import { banner_six_2, } from "../../../public/assets/imagepath";
import { BanSixIconFiveSvg, BanSixIconFourSvg, BanSixIconOneSvg, BanSixIconSixSvg, BanSixIconThreeSvg, BanSixIconTwoSvg } from '../../../public/assets/images/icons/IconsSvgs';
import TextField from '@mui/material/TextField'
import InputAdornment from "@mui/material/InputAdornment";
import FeatherIcon from "feather-icons-react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { useTheme } from "@mui/material";
import { useRouter } from 'next/router';
import useMediaQuery from '@mui/material/useMediaQuery';
/* eslint-disable @next/next/no-img-element */


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
  const boxRef = useRef<any>(null)
  const widthMax480 = useMediaQuery('(max-width:480px)');
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
      <section className="banner-section-thirteen common-padding aos" data-aos="fade-down"
        style={{
          ...muiVar,
          backgroundImage: `url('/assets/images/bg/home-13-banner_${theme.palette.primary.main.slice(1)}.png')`
        }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="banner-content aos" data-aos="fade-up">
                <h4>We specialize in Paediatric Care</h4>
                <h1>A Safe Care for your children’s health</h1>
                <p>Supporting you to keep your child healthy with easy access to high-quality paediatric
                  care.</p>
                <div className="banner-btns-fourteen ">
                  <Link href="/doctors" className="btn btn-primary " onClick={(e) => {
                    e.preventDefault();
                    setShowFilter(!showFilter)
                    boxRef!.current!.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                      inline: "start"
                    })
                  }}>Know More</Link>
                </div>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="banner-center-img d-flex justify-content-center">
                <img src={home_13_banner} alt="#" />
              </div>
            </div>
            <div className="col-lg-12"
              ref={boxRef}>
              <div className="search-box-one search-box-thirteen aos" data-aos="fade-up">
                <div className="search-title">
                  <h5>Fix Appointment</h5>
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
                        sx={{ mt: { xl: 1, lg: 1, md: 1, sm: 2, xs: 0 }, mb: { xl: 1, lg: 1, md: 1, sm: 2, xs: 1 } }}
                        size="small"
                        InputLabelProps={{
                          shrink: keyWord !== ''
                        }}
                        onChange={(e) => setKeyWord(e.target.value)}
                        InputProps={{
                          startAdornment: //keyWord !== '' &&
                            <InputAdornment position="start" >
                              <IconButton disableTouchRipple onClick={() => {
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
                            <IconButton disableTouchRipple onClick={() => setShowFilter(!showFilter)}>
                              <FeatherIcon icon="filter" style={{ width: "16px", color: theme.palette.secondary.main }} />
                            </IconButton>
                          </InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                      <FormControl fullWidth >
                        <InputLabel id="availablity" size='small' sx={{
                          mt: { xl: 1, lg: 1, md: 1, sm: 2, xs: 1 },
                          mb: { xl: 1, lg: 1, md: 1, sm: 2, xs: 1 }
                        }}>
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
                          sx={{
                            ...inputAutoSelectPaper,
                            mt: { xl: 1, lg: 1, md: 1, sm: 2, xs: 1 },
                            mb: { xl: 1, lg: 1, md: 1, sm: 2, xs: 2 }
                          }}
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
                        height: showFilter ? 275 : 0,
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
                            onChange={(e: SelectChangeEvent) => {
                              setGenderValue(e.target.value)
                            }}
                            renderValue={(value) => `${value == 'Mr' ? `👨` : `👩`} ${value}`}
                            sx={inputAutoSelectPaper}
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
        <div className="banner-section-thirteen-bg">
          <div className="banner-section-thirteen-bg-one">
            <img src={pulse_1} alt="#" className='img' />
          </div>
          <div className="banner-section-thirteen-bg-two">
            <img src={pulse_2} alt="#" className='img' />
          </div>
          <div className="banner-section-thirteen-bg-three">
            <img src={pulse_4} alt="#" className='img' />
          </div>
          <div className="banner-section-thirteen-bg-four">
            <img src={pulse_3} alt="#" className='imgColorSecondary' />
          </div>
          <div className="banner-section-thirteen-bg-five">
            <img src={pulse_3} alt="#" className='img' />
          </div>
          <div className="banner-section-thirteen-bg-six">
            <img src={pulse_6} alt="#" className='img' />
          </div>
          <div className="banner-section-thirteen-bg-seven">
            <img src={gold_star} alt="#" className='img' />
          </div>
          <div className="banner-section-thirteen-bg-eight">
            <img src={pink_star} alt="#" className='imgColorPrimary' />
          </div>
          <div className="banner-section-thirteen-bg-nine">
            <img src={atom_bond} alt="#" className='img' />
          </div>
          <div className="banner-section-thirteen-bg-ten">
            <img src={pulse_7} alt="#" className='img' />
          </div>
          <div className="banner-section-thirteen-bg-eleven">
            <img src={atom_bond} alt="#" className='imgColorSecondary' />
          </div>
          <div className="banner-section-thirteen-bg-thirteen">
            <img src={pulse_white} alt="#" className='img' />
          </div>
          <div className="banner-section-thirteen-bg-fourteen">
            <img src={star_1} alt="#" className="img-fluid " />
          </div>
          <div className="banner-section-thirteen-bg-fifteen aos" data-aos="fade-left">
            <img src={cloud_1} alt="#" className='imgColorSecondary' />
          </div>
          <div className="banner-section-thirteen-bg-sixteen aos" data-aos="fade-right">
            <img src={cloud_2} alt="#" className='imgColorSecondary' />
          </div>
          <div className="banner-section-thirteen-bg-seventeen">
            <Link href="" onClick={(e) => {
              e.preventDefault();
              setShowFilter(true)
              boxRef!.current!.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "start"
              })
            }}>Trained paediatric doctors</Link>
          </div>
          <div className="banner-section-thirteen-bg-eighteen">
            <Link href="" onClick={(e) => {
              e.preventDefault();
              setShowFilter(true)
              boxRef!.current!.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "start"
              })
            }}>New Born Care</Link>
          </div>
          <div className="banner-section-thirteen-bg-ninteen">
            <Link href="" onClick={(e) => {
              e.preventDefault();
              setShowFilter(true)
              boxRef!.current!.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "start"
              })
            }}>Child care treatments</Link>
          </div>
          <div className="banner-section-thirteen-bg-twenty">
            <img src={baby_star} alt="#" />
          </div>
          <div className="banner-section-thirteen-bgs">
            <img src={`/assets/images/bg/heart-1_${theme.palette.mode}.png`} alt="#" />
          </div>
        </div>
      </section>
    </Fragment>
  )
})

export default HomeBanner;