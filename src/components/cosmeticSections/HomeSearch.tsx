/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useState } from 'react'
import Link from 'next/link'
import useScssVar from '@/hooks/useScssVar'
import {
  banrightimg1,
  banrightimg2,
  bansixteenimg1,
  bansixteenimg2
} from "../../../public/assets/imagepath";
import { useTheme } from '@mui/material';
import FeatherIcon from "feather-icons-react";
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

import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { useForm } from 'react-hook-form';
import GeoLocationAutocomplete from '@/shared/GeoLocationAutocomplete';
import { useRouter } from 'next/router';

const HomeSearch: FC = (() => {
  const { muiVar } = useScssVar();
  const router = useRouter();
  const [keyWord, setKeyWord] = useState<string>('')
  const [showFilter, setShowFilter] = useState<boolean>(false)
  const theme = useTheme()
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
      <section className="banner-section-sixteen" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div
                className="banner-content banner-content-sixteen aos"
                data-aos="fade-up"
              >
                <Grid container spacing={{ lg: 1, xl: 1, md: 1, sm: 2, xs: 2 }}>
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                    <FormControl fullWidth
                      id="KeyWord"
                      className='animate__animated '

                      sx={{
                        position: { xl: 'absolute', lg: 'absolute', md: 'absolute', sm: 'relative' },
                        visibility: 'hidden',
                        // maxWidth: { lg: '49.3%', md: '100%', sm: '100%' },
                        "@media (min-width:992px)": {
                          maxWidth: '49.3%'
                        },
                        "@media (min-width:600px) and (max-width:991px)": {
                          position: 'relative',
                        },
                      }}>
                      <TextField
                        required
                        placeholder={keyWord == '' ? "Key word" : ""}
                        label={keyWord !== '' ? "Key word" : ""}
                        value={keyWord}
                        fullWidth
                        sx={{
                          top: { xl: 1, lg: 1, md: 1, sm: 2, xs: 3 },
                          bottom: { xl: 1, lg: 1, md: 1, sm: 2, xs: 3 },
                          bgcolor: theme.palette.background.default,
                          transition: theme.transitions.create('all', {
                            duration: 200,
                          }),
                        }}
                        size="small"
                        InputLabelProps={{
                          shrink: keyWord !== ''
                        }}
                        onChange={(e) => setKeyWord(e.target.value)}
                        InputProps={{
                          autoComplete: 'off',
                          startAdornment:
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
                            <IconButton disableTouchRipple
                              onClick={() => setShowFilter(!showFilter)}>
                              <FeatherIcon icon="filter" style={{ width: "16px", color: theme.palette.secondary.main }} />
                            </IconButton>
                          </InputAdornment>,
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
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
                <span id="span_cosmetic" className='text-box animate__animated '>Safe and certified treatments</span>
                <h1 id="h1_cosmetic" className='animate__animated '>Perfect Face Surgery For Everyone</h1>
                <p id="p_cosmetic" className='animate__animated '>
                  Lorem Ipsum is simply dummy text of the printing and typesetting
                  industry. Lorem Ipsum has been the industrys standard dummy
                  text ever since the 1500s, when an unknown printer took a galley
                  of type and scrambled it to make a type specimen book.
                </p>
                <Box
                  id="box_cosmetic"
                  className='animate__animated '
                  component="form"
                  autoComplete='off'
                  style={{
                    position: 'absolute',
                  }}
                  sx={{
                    width: '100%',
                    top: { xl: 152, lg: 152, md: 152, sm: 110, xs: 160 },
                    "@media (min-width:600px) and (max-width:991px)": {
                      top: 102
                    },
                    height: showFilter ? 100 : 0,
                    [theme.breakpoints.only('sm')]: {
                      height: showFilter ? 150 : 0,
                    },
                    [theme.breakpoints.only('xs')]: {
                      height: showFilter ? 270 : 0,
                    },
                    visibility: showFilter ? 'visible' : 'hidden',
                    transition: theme.transitions.create('all', {
                      duration: '0.75s',
                      easing: 'ease-in'
                    }),
                  }}
                >
                  <Grid container spacing={{ lg: 1, xl: 1, md: 1, sm: 1, xs: 2 }} sx={{
                    mt: 1, visibility: showFilter ? 'visible' : 'hidden',
                    transition: `visibility ${showFilter ? `0.75s` : `0s`} ease-in`,
                    transitionDelay: showFilter ? `0.75s` : `0s`
                  }} >
                    <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
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
                    <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
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
                    <Grid item xl={6} lg={6} md={6} sm={6} xs={12} >
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
                        textFieldSX={{ sx: { bgcolor: theme.palette.background.default, } }}
                      />
                    </Grid>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
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
                <div className="form-search-btn">
                  <FormControl fullWidth
                    id="buttons_cosmetic"
                    className='animate__animated '
                    sx={{
                      mt: {
                        xl: showFilter ? -12 : -31,
                        lg: showFilter ? -15 : -33,
                        md: showFilter ? -18 : -37,
                        sm: showFilter ? -7 : -29,
                        xs: showFilter ? 4 : 7
                      },

                      "@media (min-width:600px) and (max-width:991px)": {
                        mt: showFilter ? -5 : -24,
                      },
                      "@media (min-width:240px) and (max-width:599px)": {
                        position: 'absolute',
                        left: 0,
                        top: showFilter ? 390 : 90
                      },
                      transition: theme.transitions.create('all', {
                        duration: '0.75s',
                        easing: 'ease-in'
                      }),
                    }}
                    style={{
                      visibility: 'hidden',
                    }}>
                    <Button sx={{
                      mb: { lg: 1.5, md: 2, sm: 2, xs: 2 },
                      mt: { lg: 1.5, md: 2, sm: 2, xs: 2 },
                      float: 'right',
                      width: showFilter ? '49%' : '100%',
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
                      mt: { lg: 1.5, md: 2, sm: 2, xs: 2 },
                      right: 0,
                      width: showFilter ? '47.5%' : '90%',
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
                  </FormControl>
                </div>
                <Grid className="banner-btns-sixteen" sx={{
                  marginTop: {
                    xl: 0,
                    lg: 0,
                    md: 0,
                    sm: 0,
                    xs: showFilter ? 25 : 0
                  },
                  transition: theme.transitions.create('all', {
                    duration: '0.75s',
                    easing: 'ease-in'
                  }),
                }}>
                  <Link href="" className="btn btn-primary me-2" onClick={(e) => {
                    e.preventDefault();
                    let span = document.getElementById('span_cosmetic')!
                    let h1 = document.getElementById('h1_cosmetic')!
                    let p = document.getElementById('p_cosmetic')!
                    let keyword = document.getElementById('KeyWord')!
                    let availablity = document.getElementById('availablity')!
                    let buttons = document.getElementById('buttons_cosmetic')!
                    let box = document.getElementById('box_cosmetic')!
                    if (span?.classList.contains('animate__backOutRight')) {
                      span?.classList.remove('animate__backOutRight')
                      span?.classList.add('animate__backInRight')
                      keyword?.classList.remove('animate__backInRight')
                      keyword?.classList.add('animate__backOutRight')
                      availablity?.classList.remove('animate__backInRight')
                      availablity?.classList.add('animate__backOutRight')
                      buttons?.classList.remove('animate__backInRight')
                      buttons?.classList.add('animate__backOutRight')
                      box?.classList.remove('animate__backInRight')
                      box?.classList.add('animate__backOutRight')
                    } else {
                      span?.classList.toggle('animate__backOutRight')
                      keyword?.classList.add('animate__backInRight')
                      keyword.style.visibility = "visible"
                      availablity?.classList.add('animate__backInRight')
                      availablity.style.visibility = "visible"
                      buttons?.classList.add('animate__backInRight')
                      buttons.style.visibility = "visible"
                      box?.classList.add('animate__backInRight')
                      box.style.visibility = "visible"

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
                    if (h1?.classList.contains('animate__backOutRight')) {
                      h1?.classList.remove('animate__backOutRight')
                      h1?.classList.add('animate__backInRight')
                    } else {
                      h1?.classList.toggle('animate__backOutRight')
                    }
                    if (p?.classList.contains('animate__backOutRight')) {
                      p?.classList.remove('animate__backOutRight')
                      p?.classList.add('animate__backInRight')
                    } else {
                      p?.classList.toggle('animate__backOutRight')
                    }
                    // span.style.display = span.style.display === 'inline-block' ? 'none' : "inline-block"
                    // h1.style.display = h1.style.display === 'inline-block' ? 'none' : "inline-block"
                    // p.style.display = p.style.display === 'inline-block' ? 'none' : "inline-block"

                  }}>
                    Make an Appointment
                  </Link>
                </Grid>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="banner-image-sixteen"
                style={{
                  backgroundImage: `url(/assets/images/banner-sixteen-bg_${theme.palette.primary.main.slice(1)}.webp)`
                }}>
                <div className="banner-inner-img-sixteen">
                  <img src={banrightimg1} alt="" className="img-fluid" />
                  <img src={banrightimg2} alt="" className="img-fluid" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ban-sixteen-imgone">
          <img src={bansixteenimg1} alt="" className='img' />
        </div>
        <div className="ban-sixteen-imgtwo">
          <img src={bansixteenimg2} alt="" className='img' />
        </div>
      </section>
    </Fragment>
  )
})

export default HomeSearch;