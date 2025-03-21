/* eslint-disable @next/next/no-img-element */
import useScssVar from '@/hooks/useScssVar';
import { FC, Fragment, useState } from 'react'
import { BannerImg } from '../../../public/assets/imagepath';
//Next
import { useRouter } from 'next/router';
//Mui
import { useTheme } from "@mui/material";
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



const HomeSearch: FC = (() => {

  const { muiVar, inputAutoSelectPaper } = useScssVar()
  const theme = useTheme();
  const router = useRouter();
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
      <section className="doctor-search-section" style={muiVar}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="doctor-search">
                <div className="banner-header">
                  <h2>Search Doctor, <br /> Make an Appointment</h2>
                </div>
                <div className="doctor-form">
                  <Box component="form"
                    noValidate
                    autoComplete="off"
                  >
                    <Grid container spacing={{ lg: 1, xl: 1, md: 1, sm: 2, xs: 1 }}>
                      <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                        <TextField
                          required
                          id="KeyWord"
                          size='small'
                          placeholder={keyWord == '' ? "Key word" : ""}
                          label={keyWord !== '' ? "Key word" : ""}
                          value={keyWord}
                          fullWidth
                          sx={{ mt: { xl: 1, lg: 1, md: 1, sm: 2, xs: 0 }, mb: { xl: 1, lg: 1, md: 1, sm: 2, xs: -1 } }}
                          // size="small"
                          InputLabelProps={{
                            shrink: keyWord !== ''
                          }}
                          onChange={(e) => setKeyWord(e.target.value)}
                          InputProps={{
                            startAdornment:
                              <InputAdornment position="start" >
                                <IconButton aria-label='search' disableTouchRipple onClick={() => {
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
                              <IconButton aria-label='filter' disableTouchRipple onClick={() => setShowFilter(!showFilter)}>
                                <FeatherIcon icon="filter" style={{ width: "16px", color: theme.palette.secondary.main }} />
                              </IconButton>
                            </InputAdornment>,
                          }}
                        />
                      </Grid>
                      <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                        <FormControl fullWidth >
                          <InputLabel id="availablity" size='small' sx={{ mt: { xl: 1, lg: 1, md: 1, sm: 2, xs: 3 }, mb: { xl: 1, lg: 1, md: 1, sm: 2, xs: 3 } }}>
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
                            sx={{ ...inputAutoSelectPaper, mt: { xl: 1, lg: 1, md: 1, sm: 2, xs: 3 }, mb: { xl: 1, lg: 1, md: 1, sm: 2, xs: 3 } }}
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
                        [theme.breakpoints.only('xl')]: {
                          height: showFilter ? 100 : 0,
                        },
                        [theme.breakpoints.only('lg')]: {
                          height: showFilter ? 140 : 0,
                        },
                        [theme.breakpoints.only('md')]: {
                          height: showFilter ? 140 : 0,
                        },
                        [theme.breakpoints.only('sm')]: {
                          height: showFilter ? 180 : 0,
                        },
                        [theme.breakpoints.only('xs')]: {
                          height: showFilter ? 300 : 0,
                        },
                        visibility: showFilter ? 'visible' : 'hidden',
                        transition: 'height 0.75s ease-in'
                      }}
                    >
                      <Grid container spacing={{ lg: 1, xl: 1, md: 1, sm: 2, xs: 2 }} sx={{
                        mt: 1, visibility: showFilter ? 'visible' : 'hidden',
                        transition: `visibility ${showFilter ? `0.75s` : `0s`} ease-in`,
                        transitionDelay: showFilter ? `0.75s` : `0s`,
                      }} >
                        <Grid item xl={4} lg={6} md={6} sm={6} xs={12}>
                          {specialities.length !== 0 &&
                            <FormControl fullWidth >
                              <InputLabel id="specialities" size='small'>
                                Speciality
                                <input id="specialities" hidden />
                              </InputLabel>
                              <Select
                                labelId="specialities"
                                size='small'
                                id="specialities"
                                label="Speciality"
                                sx={inputAutoSelectPaper}
                                value={specialitiesValue}
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
                        <Grid item xl={2} lg={6} md={6} sm={6} xs={12}>
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
                              sx={inputAutoSelectPaper}
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
                        <Grid item xl={6} lg={12} md={12} sm={12} xs={12}>
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
                            required={false}
                            size='small'
                          />
                        </Grid>
                      </Grid>
                    </Box>
                    <div className="col-md-12">
                      <Button
                        className="btn banner-btn mt-3"
                        size='small'
                        style={{ padding: `10px `, borderRight: 'none', borderLeft: 'none' }}
                        onClick={(e) => {
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
                        MAKE APPOINTMENT
                      </Button>
                    </div>
                    {/* </div> */}
                  </Box>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <img src={BannerImg} className="img-fluid dr-img" alt='' />
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default HomeSearch;