
import { FC, Fragment, useState, useMemo, useEffect, ReactNode } from "react";

//Mui
import Typography from '@mui/material/Typography';
import { escapeRegExp } from '@/shared/ChatComponent';
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Close from '@mui/icons-material/Close'
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import { useTheme } from '@mui/material';
import TextField from '@mui/material/TextField';

//utiliti
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match'
import throttle from 'lodash/throttle';

//redux
import { useSelector, } from 'react-redux';
import { AppState } from '@/redux/store';

interface PartType {
  text: string;
  highlight: boolean;
}

export interface GeoLocationAutocompleteProps {
  errors: any;
  register: any,
  setFormValue: Function;
  getValues: Function;
  clearErrors: Function;
  name: string;
  optionFieldName: string;
  value: { city: null | string, state: null | string, country: null | string };
  setValue: Function;
  inputValue: { city: string, state: string, country: string };
  setInputValue: Function;
  setDisable: Function;
  disable: any;
  size?: string;
  required?: boolean
  textFieldSX?: any;
}

const GeoLocationAutocomplete: FC<GeoLocationAutocompleteProps> = ((props: GeoLocationAutocompleteProps) => {
  const { errors, register, setFormValue, getValues, clearErrors, name, optionFieldName,
    value, setValue, inputValue, setInputValue, size, required, textFieldSX,
    setDisable, disable } = props;
  const [options, setOptions] = useState<readonly any[]>([]);
  const [openOption, setOpenOption] = useState<boolean>(false);
  const [loadingOption, setLoadingOption] = useState<boolean>(openOption)
  const theme = useTheme();
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)


  const fetch = useMemo(
    () =>
      throttle(
        (input: string, state: string, country: string, homeSocket: any) => {
          let newOptions: readonly any[] = [];
          homeSocket.current.emit(`${name}Search`, {
            searchText: input,
            fieldValue: 'name',
            state: state,
            country: country
          })
          homeSocket.current.once(`${name}SearchReturn`, (msg: any) => {
            if (msg?.status !== 200) {
              newOptions = [...newOptions, { error: true, errorMessage: msg.message, _id: msg.status }];
              setLoadingOption(false)
              setOptions(newOptions);
            } else if (msg?.status == 200) {
              newOptions = [...newOptions, ...msg[name]];
              if (newOptions.length == 0) { setLoadingOption(false) }
              setLoadingOption(false)
              setOptions(newOptions);
            }
          })
        },
        200,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    let active = true;
    if (active && homeSocket?.current) {
      if (
        inputValue[name as keyof typeof inputValue] !== value[name as keyof typeof value] &&
        inputValue[name as keyof typeof inputValue] !== ''
      ) {
        setLoadingOption(true)
        fetch(inputValue[name as keyof typeof inputValue], value['state'], value['country'], homeSocket)
      }
    }

    return () => {
      active = false;
    };
  }, [value, inputValue, homeSocket, name, fetch]);

  return (
    <Fragment>
      <Autocomplete
        id={name}
        options={options}
        loading={loadingOption}
        // autoComplete="off"
        filterSelectedOptions
        loadingText={`Loading`}
        noOptionsText='No result return'
        getOptionLabel={(option) => {
          return option.error ? '' : typeof option === 'string' ? option : option[optionFieldName]
        }}
        onOpen={() => {
          setOpenOption(true);
        }}
        onClose={() => {
          setOpenOption(false);
        }}
        filterOptions={(x) => {
          const searchRegex = new RegExp(escapeRegExp(inputValue[name as keyof typeof inputValue]), 'i');
          let m = x.filter((a: any) => a.error ? true : a[optionFieldName].match(searchRegex))
          return m
        }}
        onFocus={() => {
          let stateInput = document.getElementById('city') as any
          if (name == 'city') {
            if (!value['state'] && !value['country']) {
              if (stateInput) {
                stateInput.placeholder = 'For faster search first select country and state first'
              }
            } else if (!value['state']) {
              if (stateInput) {
                stateInput.placeholder = 'For faster search first select state first'
              }
            }
          }
          if (name == 'state') {
            if (!value['country']) {
              let stateInput = document.getElementById('state') as any
              if (stateInput) {
                stateInput.placeholder = 'For faster search first select country.'
              }
            }
          }
        }}
        disableClearable={value[name as keyof typeof value] !== null}
        inputValue={inputValue[name as keyof typeof inputValue]}
        value={value[name as keyof typeof value]}
        disabled={disable[name as keyof typeof disable]}
        isOptionEqualToValue={(option: any, value: any) => {
          switch (typeof value) {
            case 'string':
              return true
            default:
              return option[optionFieldName] === value[optionFieldName]
          }
        }}
        onChange={(event: any, newValue: string | null, details?: string) => {
          switch (details) {
            case 'selectOption':
              if (name == 'city') {
                if (newValue !== null) {
                  setValue(() => {
                    return {
                      city: newValue[optionFieldName as keyof typeof newValue],
                      state: newValue['state_name' as keyof typeof newValue],
                      country: newValue['country_name' as keyof typeof newValue]
                    }
                  })
                  setInputValue(() => {
                    return {
                      city: newValue[optionFieldName as keyof typeof newValue],
                      state: newValue['state_name' as keyof typeof newValue],
                      country: newValue['country_name' as keyof typeof newValue]
                    }
                  })
                  setDisable(() => {
                    return {
                      city: false,
                      state: true,
                      country: true,
                    }
                  })
                  setFormValue('city', newValue[optionFieldName as keyof typeof newValue])
                  setFormValue('state', newValue['state_name' as keyof typeof newValue])
                  setFormValue('country', newValue['country_name' as keyof typeof newValue])
                  clearErrors('state')
                  clearErrors('country')
                }
              }
              if (name == 'state') {
                if (newValue !== null) {
                  setValue(() => {
                    return {
                      city: null,
                      state: newValue[optionFieldName as keyof typeof newValue],
                      country: newValue['country_name' as keyof typeof newValue]
                    }
                  })
                  setInputValue(() => {
                    return {
                      city: '',
                      state: newValue[optionFieldName as keyof typeof newValue],
                      country: newValue['country_name' as keyof typeof newValue]
                    }
                  })
                  setDisable(() => {
                    return {
                      city: false,
                      state: false,
                      country: true,
                    }
                  })
                  setFormValue('city', undefined)
                  setFormValue('state', newValue[optionFieldName as keyof typeof newValue])
                  setFormValue('country', newValue['country_name' as keyof typeof newValue])
                  let stateInput = document.getElementById('city') as any
                  if (stateInput) {
                    stateInput.placeholder = 'City'
                  }
                  clearErrors('state')
                  clearErrors('country')
                }
              }
              if (name == 'country') {
                if (newValue !== null) {
                  setValue(() => {
                    return {
                      city: null,
                      state: null,
                      country: newValue[optionFieldName as keyof typeof newValue]
                    }
                  })
                  setInputValue(() => {
                    return {
                      city: '',
                      state: '',
                      country: newValue[optionFieldName as keyof typeof newValue]
                    }
                  })
                  setDisable(() => {
                    return {
                      city: false,
                      state: false,
                      country: false,
                    }
                  })
                  setFormValue('city', undefined)
                  setFormValue('state', undefined)
                  setFormValue('country', newValue[optionFieldName as keyof typeof newValue])
                  clearErrors('country')
                  let stateInput = document.getElementById('state') as any
                  if (stateInput) {
                    stateInput.placeholder = 'State'
                  }
                }
              }
              setOptions([])
              break;

            default:
              console.log(`default onChanbe ${details}`)
              break;
          }

        }}
        onBlur={() => {
          let stateInput = document.getElementById(name) as any
          if (stateInput) {
            stateInput.placeholder = name.charAt(0).toUpperCase() + name.slice(1)
          }
          if (inputValue[name as keyof typeof inputValue] !== value[name as keyof typeof value]) {
            setInputValue((prevState: any) => {
              return {
                ...prevState,
                [name]: ''
              }
            })
          }
        }}
        onInputChange={(event: any, newInputValue, reason: string) => {
          switch (reason) {
            case 'input':
              setValue((prevState: any) => {
                return {
                  ...prevState,
                  [name]: null
                }
              })
              setInputValue((prevState: any) => {
                return {
                  ...prevState,
                  [name]: newInputValue
                }
              })
              break;
            case 'reset':
              setOptions([])
              break;
          }
        }}
        getOptionDisabled={(option) => option?.error}
        renderInput={(params) => {
          return (
            <Fragment >
              <TextField
                {...params}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'new-password',
                  required: required == undefined ? true : required,
                }}
                {...textFieldSX}
                label={name.charAt(0).toUpperCase() + name.slice(1)}
                type="text"
                size={size ? size : 'medium'}
                required={required == undefined ? true : required}
                error={errors[name as keyof typeof errors] == undefined ? false : true}
                helperText={errors[name as keyof typeof errors] && errors[name as keyof typeof errors]?.['message' as keyof typeof errors.message] as ReactNode}
                {
                ...register(name, {
                  required: "This field is required",
                })
                }
                InputProps={{
                  ...params.InputProps,
                  name: `${name}_noAutoComplete`,
                  endAdornment: (
                    <Fragment>
                      {loadingOption ? (
                        <CircularProgress color='primary' size={20} />
                      ) :
                        (inputValue[name as keyof typeof inputValue] !== '' && !disable[name]) &&

                        <IconButton
                          disableFocusRipple
                          disableRipple
                          disableTouchRipple
                          sx={{ padding: '1px' }}
                          onClick={() => {
                            setInputValue((prevState: any) => ({ ...prevState, [name]: "" }))
                            setValue((prevState: any) => ({ ...prevState, [name]: null }))
                            setFormValue(name, undefined)
                            setDisable(() => {
                              return {
                                city: false,
                                state: false,
                                country: false,
                              }
                            })
                          }}
                        >
                          <Close color='secondary' />
                        </IconButton>
                      }
                      {params.InputProps.endAdornment}
                    </Fragment>
                  ),
                }}
                autoComplete='off'
                placeholder={name.charAt(0).toUpperCase() + name.slice(1)} />
            </Fragment>
          )
        }}
        renderOption={(props, option) => {
          const matches = match(option[optionFieldName] || '', inputValue[name as keyof typeof inputValue], { insideWords: true, findAllOccurrences: true });
          const parts = parse(option[optionFieldName], matches);
          return (
            <li {...props} key={option._id}>
              {
                option?.error
                  ?
                  <>
                    {`⚠️ ${option?.errorMessage}`}
                  </>
                  : <Grid container alignItems="center">
                    <Grid item sx={{ fontSize: '20px' }}>
                      {option.emoji}
                      &nbsp;&nbsp;&nbsp;
                    </Grid>
                    <Grid item xs>
                      {parts.map((part: PartType, index: number) => {
                        return (
                          <span
                            key={option._id + index}
                            style={{
                              fontWeight: part.highlight ? 900 : 400,
                              color: part.highlight ? theme.palette.primary.main : '',
                            }}
                            dangerouslySetInnerHTML={{ __html: part.text }}
                          ></span>
                        )
                      })}
                      <Typography variant="body2" color="text.secondary">
                        {option.subtitle}
                      </Typography>
                    </Grid>
                  </Grid>
              }
            </li>
          )
        }}
      />
    </Fragment>
  )
})
export default GeoLocationAutocomplete