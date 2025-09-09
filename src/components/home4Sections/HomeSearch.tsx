/* eslint-disable @next/next/no-img-element */
import useScssVar from '@/hooks/useScssVar';
import { FC, Fragment, useState } from 'react'
import { BannerImg } from '../../../public/assets/imagepath';
//Next
import { useRouter } from 'next/router';
//Mui
import { useTheme } from "@mui/material";
import { Filter, X, Search } from 'feather-icons-react';
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

  const { muiVar, } = useScssVar()
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
      <section className="section-search-3" style={muiVar}>
        <div className="container">
          <div className="banner-info">
            <div className="row align-items-center">
              <div className="col-lg-5">
                <div className="header-banner aos" data-aos="fade-up">
                  <h2>Search Doctor, <br /> <span className="header-highlight">Make an Appointment</span></h2>
                  <p >Discover the best doctors, clinic &amp; hospital the city nearest to you.</p>
                </div>
              </div>
              <div className="col-lg-7">
                <div className="doctor-search aos" data-aos="fade-up">
                  <div className="doctor-form">
                    <Box component="form"
                      noValidate
                      autoComplete="off"
                    >
                      {/* <div className="row"> */}
                      <Grid container spacing={{ lg: 1, xl: 1, md: 1, sm: 2, xs: 1 }}>
                        <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                          <TextField
                            required
                            id="KeyWord"
                            placeholder={keyWord == '' ? "Key word" : ""}
                            label={keyWord !== '' ? "Key word" : ""}
                            value={keyWord}
                            fullWidth
                            sx={{
                              mt: { xl: 1, lg: 1, md: 1, sm: 2, xs: 0 },
                              mb: { xl: 1, lg: 1, md: 1, sm: 2, xs: 0 },
                              '.MuiOutlinedInput-notchedOutline': {
                                borderColor: '#000000'
                              },
                              '.MuiOutlinedInput-root': {
                                color: '#000000',
                              },
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: '#000000',
                              },
                              ".MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: '#000000',
                              },
                              '.MuiInputLabel-root': {
                                color: '#000000'
                              },
                              '.MuiTextField-root ': {
                                color: 'red !important',
                              },
                              "&.MuiInputLabel-shrink": {
                                color: "#000000",
                              },
                              '& .MuiOutlinedInput-input::placeholder': {
                                color: '#000000',
                                opacity: 1,
                              },
                            }}
                            size="small"
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
                            }}
                          />
                        </Grid>
                        <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                          <FormControl fullWidth >
                            <InputLabel id="availablity" size='small'
                              sx={{
                                mt: { xl: 1, lg: 1, md: 1, sm: 2, xs: 0 },
                                mb: { xl: 1, lg: 1, md: 1, sm: 2, xs: 0 },
                                color: '#000000',
                                zIndex: 3333,
                                "&.MuiInputLabel-shrink": {
                                  color: "#000000",
                                },
                              }}
                            >
                              Availablitity
                              <input id="availablity_hidden" hidden />
                            </InputLabel>
                            <Select
                              inputProps={{
                                id: "availablity",
                                name: "availablity"
                              }}
                              size='small'
                              labelId="availablity"
                              label="Availablitity"
                              fullWidth
                              value={availablityValue}
                              onChange={(e: SelectChangeEvent) => {
                                setAvailablityValue(e.target.value)
                              }}
                              sx={{
                                mt: { xl: 1, lg: 1, md: 1, sm: 2, xs: 0 },
                                mb: { xl: 1, lg: 1, md: 1, sm: 2, xs: 1 },
                                color: '#000000',
                                zIndex: 33,
                                '.MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#000000'
                                },
                                '.MuiSvgIcon-root': {
                                  color: '#000000',
                                  zIndex: 333
                                },
                                '.MuiFormLabel-root .Mui-focused': {
                                  color: '#000000 !important',
                                },
                                // "&:hover .MuiOutlinedInput-notchedOutline": {
                                //   bgcolor: theme.palette.primary.light,
                                // },
                                ".MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  borderColor: '#000000',
                                },
                                '&:hover .MuiInputLabel-root': {
                                  color: '#000000'
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#000000",
                                },
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
                          [theme.breakpoints.only('xl')]: {
                            height: showFilter ? 95 : 0,
                          },
                          [theme.breakpoints.only('lg')]: {
                            height: showFilter ? 150 : 0,
                          },
                          [theme.breakpoints.only('md')]: {
                            height: showFilter ? 150 : 0,
                          },
                          [theme.breakpoints.only('sm')]: {
                            height: showFilter ? 165 : 0,
                          },
                          [theme.breakpoints.only('xs')]: {
                            height: showFilter ? 280 : 0,
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
                              <FormControl fullWidth size="small">
                                <InputLabel sx={{
                                  color: '#000000',
                                  zIndex: 3333,
                                  "&.MuiInputLabel-shrink": {
                                    color: "#000000",
                                  },
                                }} id="specialities">
                                  Speciality
                                  <input id="specialities_hidden" hidden />
                                </InputLabel>
                                <Select
                                  inputProps={{
                                    id: "specialities",
                                    name: "specialities"
                                  }}
                                  labelId="specialities"
                                  label="Speciality"
                                  value={specialitiesValue}
                                  size="small"
                                  sx={{
                                    '.MuiOutlinedInput-notchedOutline': {
                                      borderColor: '#000000'
                                    },
                                    color: '#000000',
                                    zIndex: 33,
                                    '.MuiSvgIcon-root': {
                                      color: '#000000',
                                      zIndex: 333
                                    },
                                    '.MuiFormLabel-root .Mui-focused': {
                                      color: '#000000 !important',
                                    },
                                    // "&:hover .MuiOutlinedInput-notchedOutline": {
                                    //   bgcolor: theme.palette.primary.light,
                                    // },
                                    ".MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                      borderColor: '#000000',
                                    },
                                    '&:hover .MuiInputLabel-root': {
                                      color: '#000000'
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                      borderColor: "#000000",
                                    },
                                  }}
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
                                          <img src={`${spec.image}`} alt='' width='25' height='25'
                                            style={{ marginRight: 4, }} />

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
                            <FormControl fullWidth size="small">
                              <InputLabel sx={{
                                color: '#000000',
                                zIndex: 3333,
                                "&.MuiInputLabel-shrink": {
                                  color: "#000000",
                                },
                              }} id="gender" >
                                Gender
                                <input id="gender_hidden" hidden />
                              </InputLabel>
                              <Select
                                size="small"
                                inputProps={{
                                  id: "gender",
                                  name: "gender"
                                }}
                                labelId="gender"
                                label="Gender"
                                value={genderValue}
                                onChange={(e: SelectChangeEvent) => {
                                  setGenderValue(e.target.value)
                                }}
                                sx={{
                                  '.MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#000000'
                                  },
                                  color: '#000000',
                                  zIndex: 33,
                                  '.MuiSvgIcon-root': {
                                    color: '#000000',
                                    zIndex: 333
                                  },
                                  '.MuiFormLabel-root .Mui-focused': {
                                    color: '#000000 !important',
                                  },
                                  // "&:hover .MuiOutlinedInput-notchedOutline": {
                                  //   bgcolor: theme.palette.primary.light,
                                  // },
                                  ".MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: '#000000',
                                  },
                                  '&:hover .MuiInputLabel-root': {
                                    color: '#000000'
                                  },
                                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#000000",
                                  },
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

                              textFieldSX={{
                                sx: {
                                  ".MuiInputLabel-shrink": {
                                    color: "#000000",
                                  },
                                  "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#000000",
                                  },
                                  "& .MuiInputBase-input.MuiOutlinedInput-input.Mui-disabled": {
                                    'WebkitTextFillColor': '#000000'
                                  },
                                  '.MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#000000'
                                  },
                                  '.MuiFormLabel-root': {
                                    color: '#000000 !important',
                                  },
                                  color: '#000000',
                                  zIndex: 33,
                                  '.MuiSvgIcon-root': {
                                    color: '#000000',
                                    zIndex: 333
                                  },
                                  '.MuiFormLabel-root .Mui-focused': {
                                    color: '#000000 !important',
                                  },
                                  // "&:hover .MuiOutlinedInput-notchedOutline": {
                                  //   bgcolor: theme.palette.primary.light,
                                  // },
                                  ".MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: '#000000',
                                  },
                                  '&:hover .MuiInputLabel-root': {
                                    color: '#000000'
                                  },
                                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#000000",
                                  },
                                  '.MuiOutlinedInput-input': {
                                    color: '#000000'
                                  }
                                }
                              }}
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
                              size="small"
                              required={false}
                            />
                          </Grid>
                          <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                            <GeoLocationAutocomplete

                              textFieldSX={{
                                sx: {
                                  ".MuiInputLabel-shrink": {
                                    color: "#000000",
                                  },
                                  "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#000000",
                                  },
                                  "& .MuiInputBase-input.MuiOutlinedInput-input.Mui-disabled": {
                                    'WebkitTextFillColor': '#000000'
                                  },
                                  '.MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#000000'
                                  },
                                  '.MuiFormLabel-root': {
                                    color: '#000000 !important',
                                  },
                                  color: '#000000',
                                  zIndex: 33,
                                  '.MuiSvgIcon-root': {
                                    color: '#000000',
                                    zIndex: 333
                                  },
                                  '.MuiFormLabel-root .Mui-focused': {
                                    color: '#000000 !important',
                                  },
                                  // "&:hover .MuiOutlinedInput-notchedOutline": {
                                  //   bgcolor: theme.palette.primary.light,
                                  // },
                                  ".MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: '#000000',
                                  },
                                  '&:hover .MuiInputLabel-root': {
                                    color: '#000000'
                                  },
                                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#000000",
                                  },
                                  '.MuiOutlinedInput-input': {
                                    color: '#000000'
                                  }
                                }
                              }}
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
                              size="small"
                              required={false}
                            />
                          </Grid>
                          <Grid item xl={6} lg={12} md={12} sm={12} xs={12}>
                            <GeoLocationAutocomplete

                              textFieldSX={{
                                sx: {
                                  ".MuiInputLabel-shrink": {
                                    color: "#000000",
                                  },
                                  '.MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#000000'
                                  },
                                  '.MuiFormLabel-root': {
                                    color: '#000000 !important',
                                  },
                                  color: '#000000',
                                  zIndex: 33,
                                  '.MuiSvgIcon-root': {
                                    color: '#000000',
                                    zIndex: 333
                                  },
                                  '.MuiFormLabel-root .Mui-focused': {
                                    color: '#000000 !important',
                                  },
                                  // "&:hover .MuiOutlinedInput-notchedOutline": {
                                  //   bgcolor: theme.palette.primary.light,
                                  // },
                                  ".MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: '#000000',
                                  },
                                  '&:hover .MuiInputLabel-root': {
                                    color: '#000000'
                                  },
                                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#000000",
                                  },
                                  '.MuiOutlinedInput-input': {
                                    color: '#000000'
                                  }
                                }
                              }}
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
                              size="small"
                            />
                          </Grid>
                        </Grid>
                      </Box>
                      <div className="col-md-12 mt-3">
                        <Button href="/doctors/search"
                          className="btn banner-btn "
                          style={{
                            padding: `20px 20px`,
                            background: theme.palette.secondary.main,
                            color: '#000000',
                            borderRight: 'none',
                            borderLeft: 'none'
                          }}
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
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
})

export default HomeSearch;