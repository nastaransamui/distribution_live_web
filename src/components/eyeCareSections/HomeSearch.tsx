/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useState } from "react";
import useScssVar from "@/hooks/useScssVar";
import Link from "next/link";
import {
  ban_bg_01,
  ban_bg_02,
  banner_11,
  doctor_13,
  doctor_14,
  doctor_15,
  doctor_16,
  doctor_17,
  doctor_18,
  eye,
} from '../../../public/assets/imagepath';
import { useTheme } from "@mui/material";
import { StarSvg } from "../../../public/assets/images/icons/IconsSvgs";
import { useForm } from 'react-hook-form';
import { AppState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
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
import GeoLocationAutocomplete from '@/shared/GeoLocationAutocomplete';
import Head from "next/head";

const HomeSearch: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
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
        <link rel="preload" href={`/assets/images/bg/banner-11-bg_${theme.palette.primary.main.slice(1)}.webp`} as="image" />
      </Head>
      <section className="doctor-search-section doctor-search-eleven"
        style={{
          ...muiVar,
          backgroundColor: theme.palette.background.paper,
          backgroundImage: `url(/assets/images/bg/banner-11-bg_${theme.palette.primary.main.slice(1)}.webp)`
        }}>
        <div className="container">
          <div className="row align-items-center"
            //@ts-ignore
            style={{ [`--bs-gutter-x`]: 0 }}
          >
            <div className="col-lg-6 aos" data-aos="fade-up">
              <div className="banner-header">

                <Grid container spacing={{ lg: 1, xl: 1, md: 1, sm: 2, xs: 7 }}>
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                    <FormControl fullWidth id="KeyWord" className='animate__animated '
                      sx={{
                        position: 'absolute',
                        visibility: 'hidden',
                        maxWidth: { lg: '49.3%', md: '49.3%', sm: '49.3%' },
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
                <p id="h2_ent" className='animate__animated '>Take Eye Care Solution from Experts</p>
                <h1 id="h1_ent" className='animate__animated '>Eye Care &amp; Holistics The exeperts</h1>
                <Box
                  id="box_cosmetic"
                  className='animate__animated '
                  sx={{
                    visibility: showFilter ? 'visible' : 'hidden',
                    mt: { sm: -7, lg: -17, xl: -17 },
                    height: showFilter ? 150 : 0,
                    "@media (max-width: 419px)": {
                      mt: -10,
                      height: 290,
                    },
                    "@media (min-width:420px) and (max-width:479px)": {
                      mt: -6,
                      height: 290,
                    },
                    "@media (min-width:480px) and (max-width:600px)": {
                      mt: -5,
                      height: 290,
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
                <Grid
                  className="form-search-btn"
                  sx={{
                    position: 'absolute'
                  }}>
                  <FormControl fullWidth
                    id="buttons_cosmetic"
                    className='animate__animated '
                    sx={{
                      left: 0,
                      visibility: 'hidden',
                      // mt: { xs: showFilter ? 16 : 2 },
                      "@media (max-width: 419px)": {
                        mt: showFilter ? `0px !important` : `-290px !important`,
                      },
                      "@media (min-width:480px) and (max-width:599px)": {
                        mt: showFilter ? 0 : `-290px`,
                      },
                      "@media (min-width:419px) and (max-width:479px)": {
                        mt: showFilter ? 0 : -36,
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
                        mt: { lg: 1.5, md: 2, sm: 2, xs: 2.5 },
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
                        mt: { lg: 1.5, md: 2, sm: 2, xs: 2.5 },
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
                      xl: 0,
                      lg: showFilter ? ' 93px !important' : showSearch ? '90px !important' : ' 140px !important',
                      md: showFilter ? ' 100px !important' : showSearch ? '90px !important' : ' 140px !important',
                      sm: showFilter ? ' 100px !important' : ' 90px !important',
                      // xs: showFilter ? ' -100px !important' : !showSearch ? ' 220px !important' : ' 70px !important',
                      xs: !showFilter && !showSearch ? ' -200px !important' : showSearch && !showFilter ? ' -200px !important' : ' 110px !important'
                    },
                    transition: theme.transitions.create('all', {
                      duration: '0.75s',
                      easing: 'ease-in'
                    }),
                  }}
                >
                  <Link href="" scroll={false} className="btn btn-light-blue"
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
                </Grid>
              </div>
              <div className="banner-users">
                <h1>
                  <StarSvg />
                  4.8 Well Experienced
                </h1>
                <ul>
                  <li>
                    <img src={doctor_13} alt="img" />
                  </li>
                  <li>
                    <img src={doctor_14} alt="img" />
                  </li>
                  <li>
                    <img src={doctor_15} alt="img" />
                  </li>
                  <li>
                    <img src={doctor_16} alt="img" />
                  </li>
                  <li>
                    <img src={doctor_17} alt="img" />
                  </li>
                  <li>
                    <img src={doctor_18} alt="img" />
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6 aos" data-aos="fade-up">
              <img
                src={banner_11}
                className="img-fluid dr-img"
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="ban-bg">
          <img src={ban_bg_01} className="img-fluid bg-01 img" alt="" />
          <img src={ban_bg_02} className="img-fluid bg-02 img" alt="" />
          <img src={eye} className="img-fluid bg-03 " alt="" />
        </div>
      </section>
    </Fragment>
  )
});

export default HomeSearch;