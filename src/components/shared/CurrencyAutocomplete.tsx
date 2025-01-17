
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

export interface CurrenciesType {
  _id?: string;
  id: number;
  createdAt: Date;
  updatedAt: Date;
  _doc?: any;
  save?: any;
  name: string;
  isActive: boolean;
  iso3: string;
  iso2: string;
  numeric_code: string;
  currency: string;
  currency_name: string;
  currency_symbol: string;
  emoji: string;
  searchString?: string;
  subtitle?: string;
  patients_id: string[];
  doctors_id: string[];
}

interface PartType {
  text: string;
  highlight: boolean;
}

export interface CurrencyAutocompleteProps {
  errors: any;
  register: any,
  setFormValue: Function;
  getValues: Function;
  setError: Function;
  clearErrors: Function;
  name: string;
  optionFieldName: string;
  value: null | string;
  setValue: Function;
  inputValue: string;
  setInputValue: Function;
  setDisable: Function;
  disable: any;
  size?: string;
  required?: boolean
  textFieldSX?: any;
  inputId: string;
  formSymbolName: string;
}
const CurrencyAutocomplete: FC<CurrencyAutocompleteProps> = ({
  errors, register, setFormValue, getValues, setError, clearErrors, optionFieldName,
  value, setValue, inputValue, setInputValue, size, required, textFieldSX, name,
  setDisable, disable, inputId, formSymbolName }) => {

  const [options, setOptions] = useState<readonly any[]>([]);
  const [openOption, setOpenOption] = useState<boolean>(false);
  const [loadingOption, setLoadingOption] = useState<boolean>(openOption)
  const theme = useTheme();
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const fetch = useMemo(
    () =>
      throttle(
        (input: string, homeSocket: any) => {
          let newOptions: readonly any[] = [];
          homeSocket.current.emit(`currencySearch`, {
            searchText: input
          })
          homeSocket.current.once(`currencySearchReturn`, (msg: any) => {
            if (msg?.status !== 200) {
              newOptions = [...newOptions, { error: true, errorMessage: msg.message, _id: msg.status }];
              setLoadingOption(false)
              setOptions(newOptions);
            } else if (msg?.status == 200) {
              newOptions = [...newOptions, ...msg.currency];
              if (newOptions.length == 0) { setLoadingOption(false) }
              setLoadingOption(false)
              setOptions(newOptions);
            }
          })
        },
        20,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    let active = true;
    if (active && homeSocket?.current) {
      if (
        inputValue !== value &&
        inputValue !== ''
      ) {
        setLoadingOption(true)
        fetch(inputValue, homeSocket)
      }
    }

    return () => {
      active = false;
    };
  }, [value, inputValue, homeSocket, fetch]);


  return (
    <Fragment>
      <Autocomplete
        id={inputId}
        options={options}
        loading={loadingOption}

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
          const searchRegex = new RegExp(escapeRegExp(inputValue), 'i');
          let m = x.filter((a: any) => a.error ? true : a[optionFieldName].match(searchRegex))
          return m
        }}
        disableClearable={value !== null}
        inputValue={inputValue}
        value={value}
        disabled={disable}
        isOptionEqualToValue={(option: any, value: any) => {
          switch (typeof value) {
            case 'string':
              return true
            default:
              return option[optionFieldName] === value[optionFieldName]
          }
        }}
        onChange={(event: any, newValue: CurrenciesType | null, details?: string) => {
          switch (details) {
            case 'selectOption':
              if (newValue !== null) {
                setValue(() => `${newValue['currency_name' as keyof typeof newValue]} ${newValue['emoji' as keyof typeof newValue]}`)
                setInputValue(() => `${newValue['currency_name' as keyof typeof newValue]} ${newValue['emoji' as keyof typeof newValue]}`)
                setDisable(() => false)
                setFormValue(name, newValue['currency_name' as keyof typeof newValue])
                setFormValue(formSymbolName, (() => {
                  delete newValue.searchString;
                  delete newValue.subtitle;
                  return [newValue];
                })());
                clearErrors(name)
              }
              setOptions([])
              break;

            default:
              break;
          }

        }}
        onBlur={() => {
          if (inputValue !== value) {
            setInputValue(() => { return '' })
          }
        }}
        onInputChange={(event: any, newInputValue, reason: string) => {
          if (loadingOption) return;
          switch (reason) {
            case 'input':
              setValue(() => { return null })
              setInputValue(() => { return newInputValue })
              break;
            case 'reset':
              setOptions(() => { return [] })
              break;
          }
        }}
        renderInput={(params) => {
          return (
            <Fragment >
              <TextField
                {...params}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'off',
                  required: required == undefined ? true : required,
                  'aria-autocomplete': "none"
                }}
                {...textFieldSX}
                label={`Currency`}
                type="text"
                size={size ? size : 'medium'}
                required={required == undefined ? true : required}
                error={errors[name] == undefined ? false : true}
                helperText={errors[name] && errors[name]?.['message' as keyof typeof errors.message] as ReactNode}
                {
                ...register(name, {
                  required: required == undefined || required ? "This field is required" : '',
                })
                }
                InputProps={{
                  ...params.InputProps,
                  name: `_noAutoComplete`,
                  endAdornment: (
                    <Fragment>
                      {loadingOption ? (
                        <CircularProgress color='primary' size={20} />
                      ) :
                        (inputValue !== '' && !disable) &&

                        <IconButton
                          disableFocusRipple
                          disableRipple
                          disableTouchRipple
                          sx={{ padding: '1px' }}
                          onClick={() => {
                            setInputValue(() => "")
                            setValue(() => null)
                            setFormValue(name, '')
                            if (required) {
                              setError(name, {
                                type: 'required',
                                message: `This is required`,
                              });
                            }
                            setDisable(() => false)
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
                placeholder={`Currency`} />
            </Fragment>
          )
        }}
        renderOption={(props, option) => {
          const matches = match(option['currency_name'] || '', inputValue, { insideWords: true, findAllOccurrences: true });
          const parts = parse(option['currency_name'], matches);
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
}

export default CurrencyAutocomplete;