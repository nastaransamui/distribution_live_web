import { FC, Fragment, useEffect, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import FeatherIcon from "feather-icons-react";
import TextField from "@mui/material/TextField";
import IconButton from '@mui/material/IconButton'
import { useTheme } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import GeoLocationAutocomplete from '../shared/GeoLocationAutocomplete';
import { useForm } from 'react-hook-form';
import { updateHomeFormSubmit } from '@/redux/homeFormSubmit';


function valuetext(value: number) {
  return `${value}°C`;
}
const SearchFilter: FC<{ setPage: Function }> = (({ setPage }) => {
  const { muiVar } = useScssVar();
  const theme = useTheme();
  const searchParams = useSearchParams()
  const router = useRouter()
  const specialitiesData = useSelector((state: AppState) => state.specialities.value)
  const specialities = searchParams.get('specialities')
  const dispatch = useDispatch();
  // const keyWord = searchParams.get('keyWord')
  const [keyWord, setKeyWord] = useState<string | null>(searchParams.get('keyWord'))
  const gender = searchParams.get('gender')
  const available = searchParams.get('available')
  const country = searchParams.get('country')
  const state = searchParams.get('state')
  const city = searchParams.get('city')
  const {
    register,
    clearErrors,
    formState: { errors },
    getValues,
    setValue: setFormValue,
  } = useForm({
    defaultValues: {
      country: country ? country : '',
      state: state ? state : '',
      city: city ? city : '',
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

  useEffect(() => {
    let paramsObj = {
      ...value,
      specialities,
      gender,
      keyWord,
      available
    }
    let param: any[] = []
    Object.values(paramsObj).forEach((doc, index) => {
      if (doc !== null && doc !== '') {
        if (Object.keys(paramsObj)[index] == 'specialities') {
          //If specialities name change clear filter
          if (!specialitiesData.map((a) => a.specialities).includes(doc as string)) {
            param = param.filter((a) => a.strartsWith('specialities'))
          } else {
            //other wise add specialities to filters
            param.push(`${Object.keys(paramsObj)[index]}=${doc}`)
          }
        } else {
          //Add other filters than specialites
          param.push(`${Object.keys(paramsObj)[index]}=${doc}`)
        }

      }
    })

    let url = `/doctors/search${param.length !== 0 ? `?${param.join('&').replace(/\s/g, "%20")}` : ``}`


    if (router.asPath !== url) {
      router.push(url, undefined, { shallow: true, scroll: false })
      setPage(1)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, country, gender, keyWord, router, specialities, state, value, specialitiesData, available])

  return (
    <Fragment>
      <div className="card search-filter" style={muiVar}>
        <div className="card-header">
          <h1 className="card-title mb-0">Search Filter</h1>
        </div>
        <div className="filter-details">
          <div className="filter-widget">
            <TextField
              id="KeyWord"
              placeholder={keyWord == null ? "Key word" : ""}
              label={keyWord !== null ? "Key word" : ""}
              value={keyWord || ''}
              size='small'
              onChange={(e) => setKeyWord(e.target.value == '' ? null : e.target.value)}
              InputProps={{
                autoComplete: 'off',
                endAdornment:
                  <InputAdornment position='end'>
                    {keyWord !== null &&
                      <IconButton disableTouchRipple onClick={() => setKeyWord(null)}>
                        <FeatherIcon icon="x" style={{ color: theme.palette.secondary.main }} />
                      </IconButton>}
                  </InputAdornment>
              }}
            />
          </div>
          <div className="filter-grid">
            <h2>
              <Link data-bs-toggle="collapse" href="/doctors/search#collapseone">
                Gender
              </Link>
            </h2>
            <div id="collapseone" className="collapse show">
              <div className="filter-collapse">
                <FormControl
                  fullWidth
                >
                  <RadioGroup
                    value={gender ? gender : ''}
                    sx={{ justifyContent: 'space-evenly' }}
                    onChange={(e) => {
                      let url;
                      if (e.target.value == '') {
                        delete router.query?.gender
                        url = {
                          pathname: router.pathname,
                          query: { ...router.query }
                        }
                      } else {
                        url = {
                          pathname: router.pathname,
                          query: { ...router.query, gender: e.target.value }
                        }
                      }
                      dispatch(updateHomeFormSubmit(true))
                      router.push(url, undefined, { shallow: true, scroll: false })
                      setPage(1)
                    }}
                  >
                    <FormControlLabel sx={{ color: theme.palette.text.color }} value="Mr" control={<Radio />} label="Mr" />
                    <FormControlLabel sx={{ color: theme.palette.text.color }} value="Mrs" control={<Radio />} label="Mrs" />
                    <FormControlLabel sx={{ color: theme.palette.text.color }} value="Mss" control={<Radio />} label="Mss" />
                    <FormControlLabel sx={{ color: theme.palette.text.color }} value='' control={<Radio />} label="clear" />
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
          </div>
          <div className="filter-grid">
            <h2>
              <Link data-bs-toggle="collapse" href="/doctors/search#collapsetwo">

                Availability
              </Link>
            </h2>
            <div id="collapsetwo" className="collapse show">
              <div className="filter-collapse">
                <FormControl
                  fullWidth
                >
                  <RadioGroup
                    value={available ? available : ''}
                    sx={{ justifyContent: 'space-evenly' }}
                    onChange={(e) => {
                      let url;
                      if (e.target.value == '') {
                        delete router.query?.available
                        url = {
                          pathname: router.pathname,
                          query: { ...router.query }
                        }
                      } else {
                        url = {
                          pathname: router.pathname,
                          query: { ...router.query, available: e.target.value }
                        }
                      }
                      dispatch(updateHomeFormSubmit(true))
                      router.push(url, undefined, { shallow: true, scroll: false })
                      setPage(1)
                    }}
                  >
                    <FormControlLabel sx={{ color: theme.palette.text.color }} value="Available" control={<Radio />} label="Available" />
                    <FormControlLabel sx={{ color: theme.palette.text.color }} value="AvailableToday" control={<Radio />} label="Available Today" />
                    <FormControlLabel sx={{ color: theme.palette.text.color }} value="AvailableTomorrow" control={<Radio />} label="Available Tomorrow" />
                    <FormControlLabel sx={{ color: theme.palette.text.color }} value="AvailableThisWeek" control={<Radio />} label="Available Next 7 days" />
                    <FormControlLabel sx={{ color: theme.palette.text.color }} value="AvailableThisMonth" control={<Radio />} label="Available Next 30 days" />
                    <FormControlLabel sx={{ color: theme.palette.text.color }} value='' control={<Radio />} label="clear" />
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
          </div>
          {/* <div className="filter-grid">
            <h4><Link data-bs-toggle="collapse" href="/doctors/search#collapsethree">Consultation Fee</Link>
            </h4>
            <div id="collapsethree" className="collapse show">
              <div className="filter-collapse">
                <div className="filter-content filter-content-slider">
                  <p> $100 <span>$1000</span></p>
                  <div className="slider-wrapper">
                    <div id="price-range"></div>
                  </div>
                  <div className="price-wrapper">
                    <Slider
                      value={value}
                      onChange={handleChange}
                      valueLabelDisplay="auto"
                      min={100}
                      max={1000}
                      getAriaValueText={valuetext}
                    />
                    <h6>Price: <span>$<span id="pricerangemin">10</span>- $<span id="pricerangemax">10000</span></span></h6>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          <div className="filter-grid">
            <h2><Link data-bs-toggle="collapse" href="/doctors/search#collapsefour">Speciality</Link></h2>
            <div id="collapsefour" className="collapse show">
              <div className="filter-collapse">
                <FormControl
                  fullWidth
                >
                  <RadioGroup
                    value={specialities ? specialities : ''}
                    sx={{ justifyContent: 'space-evenly' }}
                    onChange={(e) => {
                      let url;
                      if (e.target.value == '') {
                        delete router.query?.specialities
                        url = {
                          pathname: router.pathname,
                          query: { ...router.query }
                        }
                      } else {
                        url = {
                          pathname: router.pathname,
                          query: { ...router.query, specialities: e.target.value }
                        }
                      }
                      dispatch(updateHomeFormSubmit(true))
                      router.push(url, undefined, { shallow: true, scroll: false })
                      setPage(1)
                    }}
                  >
                    {
                      specialitiesData.length !== 0 &&
                      specialitiesData.map((spec, index) => {

                        return (
                          <FormControlLabel key={spec?._id + index} sx={{ color: theme.palette.text.color }} value={spec?.specialities} control={<Radio />} label={spec?.specialities} />
                        )
                      })
                    }
                    <FormControlLabel sx={{ color: theme.palette.text.color }} value='' control={<Radio />} label="clear" />
                  </RadioGroup>
                </FormControl>

              </div>
            </div>
          </div>
          <div className="filter-grid">
            <h2><Link data-bs-toggle="collapse" href="/doctors/search#collapsefive">Location</Link></h2>
            <div id="collapsefive" className=" collapse show">
              <form autoComplete='off' noValidate>
                <div className="filter-collapse" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 20 }}>
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
                </div>
              </form>
            </div>
          </div>
          {/* <div className="filter-grid">
            <h4><Link data-bs-toggle="collapse" href="/doctors/search#collapsefive">Experience</Link></h4>
            <div id="collapsefive" className=" collapse show">
              <div className="filter-collapse">
                <ul>
                  <li><label className="custom_check d-inline-flex"><input type="checkbox" name="experience" /><span
                    className="checkmark"></span>1-5 Years</label></li>
                  <li><label className="custom_check d-inline-flex"><input type="checkbox" name="experience" /><span
                    className="checkmark"></span>5+ Years</label></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="filter-grid">
            <h4><Link data-bs-toggle="collapse" href="/doctors/search#collapsesix">Online Consultation</Link>
            </h4>
            <div id="collapsesix" className="collapse show">
              <div className="filter-collapse">
                <ul>
                  <li><label className="custom_check d-inline-flex"><input type="checkbox" name="online" /><span
                    className="checkmark"></span><i className="feather-video online-icon"></i> Video Call</label></li>
                  <li><label className="custom_check d-inline-flex"><input type="checkbox" name="online" /><span
                    className="checkmark"></span><i className="feather-mic online-icon"></i> Audio Call</label></li>
                  <li><label className="custom_check d-inline-flex"><input type="checkbox" name="online" /><span
                    className="checkmark"></span><i className="feather-message-square online-icon"></i> Chat</label></li>
                  <li><label className="custom_check d-inline-flex"><input type="checkbox" name="online" /><span
                    className="checkmark"></span><i className="feather-users online-icon"></i> Instant Consulting</label></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="filter-grid">
            <h4><Link data-bs-toggle="collapse" href="/doctors/search#collapseseven">By Rating</Link></h4>
            <div id="collapseseven" className="collapse show">
              <div className="filter-collapse">
                <ul>
                  <li><label className="custom_check rating_custom_check d-inline-flex"><input type="checkbox" name="online" /><span
                    className="checkmark"></span>
                    <div className="rating"><i className="fas fa-star filled"></i><i className="fas fa-star filled"></i><i
                      className="fas fa-star filled"></i><i className="fas fa-star filled"></i><i
                        className="fas fa-star filled"></i><span className="rating-count">(40)</span></div>
                  </label></li>
                  <li><label className="custom_check rating_custom_check d-inline-flex"><input type="checkbox" name="online" /><span
                    className="checkmark"></span>
                    <div className="rating"><i className="fas fa-star filled"></i><i className="fas fa-star filled"></i><i
                      className="fas fa-star filled"></i><i className="fas fa-star filled"></i><i className="fas fa-star"></i><span
                        className="rating-count">(35)</span></div>
                  </label></li>
                  <li><label className="custom_check rating_custom_check d-inline-flex"><input type="checkbox" name="online" /><span
                    className="checkmark"></span>
                    <div className="rating"><i className="fas fa-star filled"></i><i className="fas fa-star filled"></i><i
                      className="fas fa-star filled"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><span
                        className="rating-count">(20)</span></div>
                  </label></li>
                  <li><label className="custom_check rating_custom_check d-inline-flex"><input type="checkbox" name="online" /><span
                    className="checkmark"></span>
                    <div className="rating"><i className="fas fa-star filled"></i><i className="fas fa-star filled"></i><i
                      className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><span
                        className="rating-count">(10)</span></div>
                  </label></li>
                  <li><label className="custom_check rating_custom_check d-inline-flex"><input type="checkbox" name="online" /><span
                    className="checkmark"></span>
                    <div className="rating"><i className="fas fa-star filled"></i><i className="fas fa-star"></i><i
                      className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><span
                        className="rating-count">(05)</span></div>
                  </label></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="filter-grid">
            <h4><Link data-bs-toggle="collapse" href="/doctors/search#collapseeight">Languages</Link></h4>
            <div id="collapseeight" className="collapse show">
              <div className="filter-collapse">
                <ul>
                  <li><label className="custom_check d-inline-flex"><input type="checkbox" name="language" /><span
                    className="checkmark"></span>English</label></li>
                  <li><label className="custom_check d-inline-flex"><input type="checkbox" name="language" /><span
                    className="checkmark"></span>French</label></li>
                  <li><label className="custom_check d-inline-flex"><input type="checkbox" name="language" /><span
                    className="checkmark"></span>Spanish</label></li>
                  <li><label className="custom_check d-inline-flex"><input type="checkbox" name="language" /><span
                    className="checkmark"></span>German</label></li>
                </ul>
              </div>
            </div>
          </div> */}
          <div className="filter-btn apply-btn">
            <div className="row">
              <div className="col-12">
                <Link className="btn btn-outline-primary"
                  href={router.pathname}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(router.pathname, undefined, { shallow: true, scroll: false })
                    setPage(1)
                    setValue(() => ({ city: null, state: null, country: null }))
                    setInputValue(() => ({ city: '', state: '', country: '' }))
                    setKeyWord(() => (null))
                  }}
                >
                  Reset</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
});


export default SearchFilter;