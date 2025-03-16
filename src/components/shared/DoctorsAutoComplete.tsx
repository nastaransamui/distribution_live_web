/* eslint-disable @next/next/no-img-element */
import React, { FC, Fragment, useEffect, useMemo, useState } from "react";


//Utilties
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match'
import throttle from 'lodash/throttle';

//Mui
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Close from '@mui/icons-material/Close'
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import { useTheme } from '@mui/material';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { UserDoctorProfileType } from "@/redux/userDoctorProfile";
import { useSelector } from "react-redux";
import { AppState } from "@/redux/store";
import { StyledBadge } from "../DoctorDashboardSections/ScheduleTiming";
import { doctors_profile } from "@/public/assets/imagepath";
import { ChatDataType, MessageType } from "@/hooks/useChat";




interface PartType {
  text: string;
  highlight: boolean;
}
export interface DoctorsAutoCompleteType {
  name: string;
  optionFieldName: string;
  userType: 'doctors' | 'patient';
  userChatData: ChatDataType[];
  currentUserId: string;
  width: number;
  setActiveChat: React.Dispatch<React.SetStateAction<number | null>>;
  setAllCurrentUserMessage: React.Dispatch<React.SetStateAction<MessageType[]>>;
}

export interface AutocompleteUserProfileType extends UserDoctorProfileType {
  searchString: string;
  subtitle: string;
}
export function escapeRegExp(value: string) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}


const DoctorsAutoComplete: FC<DoctorsAutoCompleteType> = ((
  props: DoctorsAutoCompleteType
) => {
  const {
    name,
    optionFieldName,
    userType,
    userChatData,
    currentUserId,
    setActiveChat,
    setAllCurrentUserMessage,
    width } = props

  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const [inputValue, setInputValue] = useState("")
  const [value, setValue] = useState<any>(null)
  const [options, setOptions] = useState<readonly any[]>([]);
  const [openOption, setOpenOption] = useState<boolean>(false);
  const [loadingOption, setLoadingOption] = useState<boolean>(openOption)

  const theme = useTheme();

  const fetch = useMemo(
    () =>
      throttle(
        (input: string, homeSocket: any) => {
          let newOptions: readonly any[] = [];
          if (input !== '') {
            if (homeSocket?.current) {
              homeSocket.current.emit("userSearchAutocomplete", { searchText: input, userType: userType })
              homeSocket.current.once("userSearchAutocompleteReturn", (msg:
                {
                  status: number,
                  message?: string,
                  users: AutocompleteUserProfileType[]
                }) => {
                if (msg?.status !== 200) {
                  newOptions = [...newOptions, { error: true, errorMessage: msg.message, _id: msg.status }];
                  setLoadingOption(false)
                  setOptions(newOptions);
                }

                newOptions = [...newOptions, ...msg.users];
                if (newOptions.length == 0) { setLoadingOption(false) }
                setLoadingOption(false)
                setOptions(newOptions);
              })
            }
          }
        },
        500,
      ),
    [userType],
  );


  useEffect(() => {
    let active = true;
    if (active && inputValue !== '') {
      setLoadingOption(true)
      fetch(inputValue, homeSocket)
    }
    return () => {
      active = false;
    };
  }, [fetch, homeSocket, inputValue])


  return (
    <Fragment>
      <Autocomplete
        fullWidth
        id={name}
        options={options}
        loading={loadingOption}
        autoComplete={false}
        includeInputInList
        filterSelectedOptions
        loadingText='Loading'
        noOptionsText='No result return'
        getOptionLabel={(option) => {
          return option.error ? '' : typeof option === 'string' ? option : option[optionFieldName]
        }}
        open={openOption}
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
        isOptionEqualToValue={(option: any, value: any) => {
          switch (typeof value) {
            case 'string':
              return true
            default:
              if (!Array.isArray(option[optionFieldName])) {
                return option[optionFieldName] === value[optionFieldName]
              } else {
                return option['arrayField'] === value['arrayField']
              }
          }
        }}
        onChange={(event: any, newValue: any | null, details?: string) => {
          switch (details) {
            case 'selectOption':
              if (newValue !== null) {
                let selectedIndex = userChatData.findIndex((a) => a.userData.name == newValue.fullName)
                if (selectedIndex !== -1) {
                  let hasChat = userChatData[selectedIndex]?.messages.filter((a) => a?.senderId == currentUserId || a?.reciverId == currentUserId).length > 0

                  if (hasChat) {
                    setActiveChat(() => selectedIndex)
                    let c = userChatData[selectedIndex]?.messages.filter((a) => a?.senderId == currentUserId || a?.reciverId == currentUserId)
                    setAllCurrentUserMessage((prevState) => {
                      let newState = [...c]
                      return newState.sort((a: MessageType, b: MessageType) => new Date(a?.time).valueOf() - new Date(b?.time).valueOf())
                    })
                  } else {
                    setActiveChat(() => selectedIndex)
                    userChatData[selectedIndex]?.messages.push({
                      senderId: currentUserId,
                      reciverId: userChatData[selectedIndex]?.userData?.userId,
                      message: null,
                      time: new Date(),
                      read: true,
                      attachment: ''
                    })
                    setAllCurrentUserMessage((prevState) => {
                      return [{
                        senderId: currentUserId,
                        reciverId: userChatData[selectedIndex]?.userData?.userId,
                        message: null,
                        time: new Date(),
                        read: true,
                        attachment: ''
                      }]
                    })
                  }

                }
                // setInputValue(newInputValue);
                setLoadingOption(() => false)
                setValue(() => {
                  return newValue['fullName' as keyof typeof newValue]
                })
                setInputValue(() => {
                  return newValue['fullName' as keyof typeof newValue]
                })
              }
              setLoadingOption(false)
              setOptions([])
              break;
          }

        }}

        // onInputChange={(event: any, newInputValue, reason: string) => {
        //   event
        //   switch (reason) {
        //     case 'input':
        //       setValue(() => {
        //         return null
        //       })
        //       setInputValue(() => {
        //         return newInputValue
        //       })
        //       break;
        //     case 'reset':
        //       setOptions([])
        //       break;
        //   }
        // }}
        onInputChange={(event, newInputValue, reason) => {
          switch (reason) {
            case 'input':
              setInputValue(newInputValue);
              if (newInputValue !== '') {
                setLoadingOption(() => true)
              } else {
                setLoadingOption(() => false)
              }
              break;
            case 'reset':

              break;
            default:
              setInputValue(newInputValue);
              setLoadingOption(() => true)
              break;
          }
        }}
        renderInput={(params) => {
          return (
            <Fragment >
              <div className="input-group-prepend">
                <i className="fas fa-search"></i>
              </div>
              <TextField
                {...params}
                size='small'
                variant="standard"
                type="text"
                InputProps={{
                  disableUnderline: true,
                  ...params.InputProps,
                  endAdornment: (
                    <Fragment>
                      {loadingOption ? (
                        <CircularProgress color='primary' size={20} />
                      ) :
                        inputValue !== '' &&

                        <IconButton
                          disableFocusRipple
                          disableRipple
                          disableTouchRipple
                          sx={{ padding: '1px' }}
                          onClick={() => {
                            setInputValue('')
                            setValue(null)
                            setOptions([])
                          }}
                        >
                          <Close color='secondary' />
                        </IconButton>
                      }
                      {params.InputProps.endAdornment}
                    </Fragment>
                  ),
                }}
                className={openOption ? "form-control form-control-open" : "form-control "}
                placeholder="Search"
                autoComplete='off' />
            </Fragment>
          )
        }}
        renderOption={(props, option) => {
          const matches = match(Array.isArray(option[optionFieldName]) ? option['arrayField'] : option[optionFieldName] || '', inputValue, { insideWords: true, findAllOccurrences: true });
          const parts = parse(Array.isArray(option[optionFieldName]) ? option['arrayField'] : option[optionFieldName], matches);
          return (
            <li {...props} key={option._id + JSON.stringify(props)}
              style={{ borderBottom: `1px solid ${theme.palette.primary.main}`, borderTop: `1px solid ${theme.palette.primary.main}` }}>
              {
                option?.error
                  ?
                  <>
                    {`⚠️ ${option?.errorMessage}`}
                  </>
                  :
                  <>
                    <Grid container alignItems="center" >
                      <StyledBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                        online={option?.online}
                        idle={option?.idle}
                      >
                        <Avatar alt="" src={option.profileImage} >
                          <img src={doctors_profile} alt="" className="avatar" />
                        </Avatar>
                      </StyledBadge> &nbsp; &nbsp;
                      <Grid item xs>
                        {parts.map((part: PartType, index: number) => {
                          return (
                            <span
                              key={option._id + index}
                              style={{
                                fontWeight: part.highlight ? 900 : 400,
                                whiteSpace: 'pre-wrap',
                                color: part.highlight ? theme.palette.primary.main : '',
                              }}
                              dangerouslySetInnerHTML={{ __html: part.text }}
                            ></span>
                          )
                        })}
                        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                          {option.subtitle}
                        </Typography>
                      </Grid>
                    </Grid>
                  </>
              }
            </li>
          )
        }}
        sx={{
          "& .MuiInput-root.MuiInputBase-sizeSmall .MuiInput-input": {
            padding: `6px 4px 3px 0`,
          },

          zIndex: 1301,
        }}
        disablePortal
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "background.default",
              borderRadius: "0px 0px 8px 8px",
              marginTop: '-13px',
              marginLeft: '-37px',
              width: `${width}px`,
              paddingTop: '15px',
              border: `1px solid`,
              borderColor: 'secondary.main'
            },
          },
        }}
        getOptionDisabled={(option) => option?.error}
      />
    </Fragment>
  )
})

export default DoctorsAutoComplete;