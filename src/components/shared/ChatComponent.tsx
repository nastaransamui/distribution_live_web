/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useState, MouseEvent, useMemo, useRef } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import { IMG02, IMG03, IMG04, PatientImg1, PatientImg2, PatientImg4, PatientImg5, IMG09, IMG010, IMG011, doctor_17, PatientImg3, patient_profile } from '@/public/assets/imagepath';
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Close from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import Tooltip from '@mui/material/Tooltip'
import weekday from 'dayjs/plugin/weekday'
import updateLocale from 'dayjs/plugin/updateLocale'
import CustomNoRowsOverlay from './CustomNoRowsOverlay';
import Autocomplete from '@mui/material/Autocomplete';

import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match'
import throttle from 'lodash/throttle';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Avatar, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { StyledBadge } from '../DoctorDashboardSections/ScheduleTiming';

export function escapeRegExp(value: string) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export interface AttachmentType {
  src: string;
  name: string;
}


export interface MessageType {
  senderId: string;
  reciverId: string;
  time: Date;
  message: null | string;
  read: boolean;
  attachment: string | AttachmentType[];
}

export interface ChatDataType {
  userType: 'D' | 'P';
  userData: {
    userId: string;
    name: string;
    image: string;
    online: boolean;
    idle: boolean;
  };
  messages: MessageType[]
}



interface PartType {
  text: string;
  highlight: boolean;
}

const menuOptions = [
  'None',
  'Atria',
  'Callisto',
  'Dione',
  'Ganymede',
];
const ITEM_HEIGHT = 48;
const ChatComponent: FC = (() => {
  const ref = useRef<any>(null);
  const ref1 = useRef<any>(null);
  dayjs.extend(relativeTime)
  dayjs.extend(duration)
  dayjs.extend(weekday)
  dayjs.extend(updateLocale)
  const theme = useTheme();
  // const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

  let weekdays: string[] = dayjs.updateLocale('en', {}).weekdays as string[]
  const { muiVar } = useScssVar();
  useEffect(() => {
    document.body.classList.add("chat-page");

    return () => document.body.classList.remove("chat-page");
  }, []);

  const [activeChat, setActiveChat] = useState<number | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const currentUserId = '1'
  const userChatData: ChatDataType[] = useMemo(() => {
    return []
    // return [
    //   // {
    //   //   userType: 'D',
    //   //   userData: {
    //   //     userId: '1',
    //   //     name: 'George Anderson',
    //   //     image: doctor_17,
    //   //     online: true,
    //   //     idle: false,
    //   //   },
    //   //   messages: [
    //   //     {
    //   //       senderId: '1',
    //   //       reciverId: '2',
    //   //       message: 'Hey, How are you?',
    //   //       time: new Date('2023-08-23T13:20:13.577+07:00'),
    //   //       read: false,
    //   //     },
    //   //   ]
    //   // },
    //   {
    //     userType: 'D',
    //     userData: {
    //       userId: '2',
    //       name: 'Megan Bird',
    //       image: IMG02,
    //       online: true,
    //       idle: true,
    //     },
    //     messages: [
    //       {
    //         senderId: '2',
    //         reciverId: '1',
    //         message: 'I\'ll call you later',
    //         time: new Date('2023-08-22 09:20:13.577+07:00'),
    //         read: true,
    //         attachment: ''
    //       },
    //     ]
    //   },
    //   {
    //     userType: 'D',
    //     userData: {
    //       userId: '3',
    //       name: 'Alvin Boykin',
    //       image: IMG03,
    //       online: false,
    //       idle: false,
    //     },
    //     messages: [
    //       {
    //         senderId: '1',
    //         reciverId: '3',
    //         message: 'Hello. What can I do for you?',
    //         time: new Date('2023-08-19T17:30:13.577+07:00'),
    //         read: false,
    //         attachment: ''
    //       },
    //       {
    //         senderId: '3',
    //         reciverId: '1',
    //         message: 'I\'m just looking around. Will you tell me something about yourself?',
    //         time: new Date('2023-08-18T10:20:13.577+07:00'),
    //         read: false,
    //         attachment: [
    //           {
    //             src: IMG010,
    //             name: 'placeholder.webp'
    //           },
    //           {
    //             src: IMG09,
    //             name: 'placeholder.webp'
    //           },
    //         ]
    //       },
    //       {
    //         senderId: '3',
    //         reciverId: '1',
    //         message: 'Are you there? That time!',
    //         time: new Date('Mon Aug 17 2023 08:39:16'),
    //         read: false,
    //         attachment: ''
    //       },
    //       {
    //         senderId: '1',
    //         reciverId: '3',
    //         message: 'Where?',
    //         time: new Date('2023-08-19T17:25:13.577+07:00'),
    //         read: false,
    //         attachment: ''
    //       },
    //       {
    //         senderId: '1',
    //         reciverId: '3',
    //         message: 'OK, my name is Limingqiang. I like singing, playing basketballand so on.',
    //         time: new Date('2023-08-19T19:20:13.577+07:00'),
    //         read: false,
    //         attachment: [
    //           {
    //             src: IMG010,
    //             name: 'placeholder.webp'
    //           },
    //         ]
    //       },
    //       {
    //         senderId: '3',
    //         reciverId: '1',
    //         message: `You wait for notice.
    //         Consectetuorem ipsum dolor sit?
    //         Ok?`,
    //         time: new Date('2023-08-19T17:20:13.577+07:00'),
    //         read: false,
    //         attachment: ''
    //       },
    //       {
    //         senderId: '3',
    //         reciverId: '1',
    //         message: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,`,
    //         time: new Date('2023-08-19T17:20:13.577+07:00'),
    //         read: false,
    //         attachment: ''
    //       },
    //       {
    //         senderId: '1',
    //         reciverId: '3',
    //         message: `Lorem ipsum dollar sit`,
    //         time: new Date('2023-08-19T17:20:13.577+07:00'),
    //         read: false,
    //         attachment: ''
    //       },
    //     ]
    //   },
    //   {
    //     userType: 'P',
    //     userData: {
    //       userId: '4',
    //       name: 'Nicholas Hicks',
    //       image: IMG04,
    //       online: true,
    //       idle: true,
    //     },
    //     messages: [
    //       {
    //         senderId: '',
    //         reciverId: '3',
    //         message: 'Thats very good UI design',
    //         time: new Date('Mon Aug 21 2023 17:39:16'),
    //         read: true,
    //         attachment: ''
    //       },
    //     ]
    //   },
    //   {
    //     userType: 'P',
    //     userData: {
    //       userId: '5',
    //       name: 'Sherri McCarthy',
    //       image: IMG04,
    //       online: false,
    //       idle: false,
    //     },
    //     messages: [
    //       {
    //         senderId: '5',
    //         reciverId: '3',
    //         message: 'Yesterday i completed the task',
    //         time: new Date('Tue Aug 23 2023 12:31:16'),
    //         read: true,
    //         attachment: ''
    //       },
    //     ]
    //   },
    //   {
    //     userType: 'P',
    //     userData: {
    //       userId: '6',
    //       name: 'Roger Loyd',
    //       image: PatientImg1,
    //       online: false,
    //       idle: false,
    //     },
    //     messages: [
    //       {
    //         senderId: '',
    //         reciverId: '3',
    //         message: 'What is the major functionality?',
    //         time: new Date('Tue Aug 17 2023 02:39:16'),
    //         read: true,
    //         attachment: ''
    //       },
    //     ]
    //   },
    //   {
    //     userType: 'P',
    //     userData: {
    //       userId: '7',
    //       name: 'Francis Giordano',
    //       image: PatientImg2,
    //       online: false,
    //       idle: false,
    //     },
    //     messages: [
    //       {
    //         senderId: '',
    //         reciverId: '3',
    //         message: 'This has allowed me to showcase not only my technical skills',
    //         time: new Date('Tue Aug 22 2023 11:39:16'),
    //         read: true,
    //         attachment: ''
    //       },
    //     ]
    //   },
    //   {
    //     userType: 'P',
    //     userData: {
    //       userId: '8',
    //       name: 'Kate Mason',
    //       image: PatientImg4,
    //       online: true,
    //       idle: true,
    //     },
    //     messages: [
    //       {
    //         senderId: '',
    //         reciverId: '3',
    //         message: 'Let\'s talk briefly in the evening.',
    //         time: new Date('Tue Jul 10 2023 10:59:16'),
    //         read: true,
    //         attachment: ''
    //       },
    //     ]
    //   },
    //   {
    //     userType: 'P',
    //     userData: {
    //       userId: '9',
    //       name: 'Glenn Johnson',
    //       image: PatientImg5,
    //       online: true,
    //       idle: false,
    //     },
    //     messages: [
    //       {
    //         senderId: '',
    //         reciverId: '3',
    //         message: 'Do you have any collections? If so, what of?',
    //         time: new Date('Tue Aug 18 2023 13:29:16'),
    //         read: true,
    //         attachment: ''
    //       },
    //     ]
    //   },
    //   {
    //     userType: 'D',
    //     userData: {
    //       userId: '10',
    //       name: 'Megan Smith',
    //       image: PatientImg3,
    //       online: true,
    //       idle: false,
    //     },
    //     messages: [
    //       {
    //         senderId: '',
    //         reciverId: '3',
    //         message: 'Connect the two modules with in 1 day.',
    //         time: new Date('Tue Aug 12 2023 08:39:16'),
    //         read: true,
    //         attachment: ''
    //       },
    //     ]
    //   },
    //   {
    //     userType: 'D',
    //     userData: {
    //       userId: '11',
    //       name: 'Monty Smith',
    //       image: PatientImg2,
    //       online: true,
    //       idle: false,
    //     },
    //     messages: [
    //       {
    //         senderId: '',
    //         reciverId: '3',
    //         message: 'Connect the two modules with in 1 day.',
    //         time: new Date('Tue Jul 12 2022 23:39:16'),
    //         read: true,
    //         attachment: ''
    //       },
    //     ]
    //   },
    // ]
  }, [])

  const [allCurrentUserMessage, setAllCurrentUserMessage] = useState<MessageType[]>([])
  const [chatInputValue, setChatInputValue] = useState<string>("")


  useEffect(() => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth' });

    }, 100);
  }, [activeChat, userChatData])

  const [options, setOptions] = useState<readonly ChatDataType[]>([]);
  const [value, setValue] = useState<ChatDataType | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [openOption, setOpenOption] = useState<boolean>(false);
  const [loadingOption, setLoadingOption] = useState<boolean>(openOption)
  const fetch = useMemo(
    () =>
      throttle(
        (
          request: { input: string },
        ) => {
          const searchRegex = new RegExp(escapeRegExp(request.input), 'i');
          let newOptions: readonly ChatDataType[] = [];
          let m = userChatData.filter((a: ChatDataType) => a.userData?.name.match(searchRegex))
          setTimeout(() => {
            setLoadingOption(() => false)
            if (value) {
              newOptions = [value];
            }
            if (m.length > 0) {
              newOptions = [...newOptions, ...m];
            } else {

            }
            setOptions(newOptions);
          }, 300);



        },
        200,
      ),
    [userChatData, value],
  );

  useEffect(() => {
    let active = true;
    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results?: readonly ChatDataType[]) => { }, active);

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  const onButtonClick = (e: any) => {
    if (e._reactName == 'onClick') {
      if (chatInputValue !== '') {
        userChatData[activeChat as number]?.messages.push({
          senderId: currentUserId,
          reciverId: userChatData[activeChat as number]?.userData?.userId,
          message: chatInputValue,
          time: new Date(),
          read: false,
          attachment: ''
        })
        setChatInputValue('')
        setAllCurrentUserMessage((prevState) => {
          let newState = [...userChatData[activeChat as number]?.messages]
          return newState.sort((a: MessageType, b: MessageType) => new Date(a?.time).valueOf() - new Date(b?.time).valueOf())
        })
        setTimeout(() => {
          ref.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else if (e._reactName == 'onKeyDown') {
      if (e.key == 'Enter' && chatInputValue !== '') {
        userChatData[activeChat as number]?.messages.push({
          senderId: currentUserId,
          reciverId: userChatData[activeChat as number]?.userData?.userId,
          message: chatInputValue,
          time: new Date(),
          read: false,
          attachment: ''
        })
        setChatInputValue('')
        setAllCurrentUserMessage((prevState) => {
          let newState = [...userChatData[activeChat as number]?.messages]
          return newState.sort((a: MessageType, b: MessageType) => new Date(a?.time).valueOf() - new Date(b?.time).valueOf())
        })
        setTimeout(() => {
          ref.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }


  return (
    <Fragment>
      <div className="content top-space" style={muiVar}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12">
              <div className="chat-window">


                <div className="chat-cont-left" >
                  <div className="chat-header">
                    <span>Chats</span>
                    <Link href="#" className="chat-compose">
                      <i className="material-icons" >control_point</i>
                    </Link>
                  </div>
                  <div className="chat-search">
                    <div className="input-group">
                      <Autocomplete
                        fullWidth
                        options={options}
                        loading={loadingOption}
                        autoComplete
                        includeInputInList
                        filterSelectedOptions
                        loadingText='loadingField'
                        noOptionsText='No result return'
                        getOptionLabel={(option) => {
                          return typeof option === 'string' ? option : option.userData?.name
                        }}
                        onOpen={() => {
                          setOpenOption(true);
                        }}
                        onClose={() => {
                          setOpenOption(false);
                        }}
                        filterOptions={(x) => {
                          const searchRegex = new RegExp(escapeRegExp(inputValue), 'i');
                          let m = x.filter((a: ChatDataType) => a.userData?.name.match(searchRegex))
                          return m
                        }}
                        disableClearable={value !== null}
                        inputValue={inputValue}
                        value={value}
                        onChange={(event: any, newValue: ChatDataType | null, reason: string) => {
                          if (newValue?.userData !== undefined) {
                            setInputValue(newValue?.userData?.name);
                          }
                          setLoadingOption(() => false)
                        }}
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
                              let selectedIndex = userChatData.findIndex((a) => a.userData.name == newInputValue)
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
                              setInputValue(newInputValue);
                              setLoadingOption(() => false)
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
                                className="form-control rounded-pill"
                                placeholder="Search"
                                autoComplete='off' />
                            </Fragment>
                          )
                        }}
                        renderOption={(props, option) => {
                          const matches = match(option?.userData?.name || '', inputValue, { insideWords: true, findAllOccurrences: true });
                          const parts = parse(option?.userData?.name, matches);
                          return (
                            <li {...props} key={option.userData?.userId}>
                              <Grid container alignItems="center">
                                <Grid item>
                                  <img
                                    key={option.userData?.userId + option?.userData?.image}
                                    height={30}
                                    loading="lazy"
                                    width={30}
                                    style={{ borderRadius: '50%' }}
                                    src={option?.userData?.image}
                                    alt=''
                                  /> &nbsp;&nbsp;&nbsp;
                                </Grid>
                                <Grid item xs>
                                  {parts.map((part: PartType, index: number) => {
                                    return (
                                      <span
                                        key={option.userData?.userId + index}
                                        style={{
                                          fontWeight: part.highlight ? 900 : 400,
                                          color: part.highlight ? theme.palette.primary.main : '',
                                        }}
                                        dangerouslySetInnerHTML={{ __html: part.text }}
                                      ></span>
                                    )
                                  })}
                                  <Typography variant="body2" color="text.secondary">
                                    {option.userType == "D" ? 'Dr' : 'Patient'}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </li>
                          )
                        }}
                      />
                    </div>
                  </div>
                  <div className="chat-users-list">
                    <div className="chat-scroll">
                      {
                        userChatData.length == 0 ? <div style={{ color: theme.palette.text.color, width: '100%', height: "calc(100vh - 324px)", display: "flex", justifyContent: "center", alignItems: "center" }}>Start chat</div> : "chat persons comehiere"
                      }
                      {/* {
                        userChatData
                          .sort((a, b) => new Date(b?.messages[0]?.time).valueOf() - new Date(a?.messages[0]?.time).valueOf())
                          .map((users, index) => {
                            let hasMessage = users?.messages?.length > 0
                            let numberOfNotRead = users?.messages.filter((a) => a.reciverId == currentUserId && !a.read).length
                            let unreadMessagesLength = hasMessage ? numberOfNotRead == 0 ? '' : numberOfNotRead : ''
                            let diff: any = dayjs.duration(dayjs().diff(dayjs(users?.messages?.[0]?.time)))
                            const { years, days, hours } = diff['$d' as keyof typeof diff]
                            let dayName = weekdays[dayjs(users?.messages?.[0]?.time).weekday()]
                            let today = days == 0 && hours < 24
                            let thisWeek = days !== 0 && days <= 7
                            let thisYear = !thisWeek && years == 0
                            let userId = users.userData?.userId
                            let hasChat = users?.messages.filter((a) => a?.senderId == currentUserId || a?.reciverId == currentUserId).length > 0
                            if (hasChat) {
                              return (
                                <Tooltip arrow title={dayjs(users?.messages?.[0]?.time).fromNow()} key={index}>
                                  <Link href="#" onClick={(e) => {
                                    e.preventDefault();
                                    setActiveChat(() => index)
                                    userChatData[index]?.messages.forEach(element => {
                                      if (element.reciverId == currentUserId) {
                                        element.read = true;
                                        return element
                                      }
                                      return element
                                    });
                                    let c = users?.messages.filter((b) => {
                                      if (b.reciverId == currentUserId || b.senderId == currentUserId) {
                                        return b;
                                      }
                                    })
                                    if (c.length > 0) {
                                      setAllCurrentUserMessage((prevState) => {
                                        let newState = [...c]
                                        return newState.sort((a: MessageType, b: MessageType) => new Date(a?.time).valueOf() - new Date(b?.time).valueOf())
                                      })
                                    } else {
                                      setAllCurrentUserMessage((prevState) => {
                                        return []
                                      })
                                    }
                                  }} className={`media d-flex ${activeChat !== null && activeChat == index ? 'read-chat active' : ''}`} >

                                    <div className="media-img-wrap">
                                      <div className={
                                        `avatar ${!users.userData?.online ? 'avatar-offline' : users.userData.idle ? 'avatar-away' : 'avatar-online'}`
                                      }>
                                        <img src={users.userData?.image} alt="User" className="avatar-img rounded-circle" />
                                      </div>
                                    </div>
                                    <div className="media-body flex-grow-1">
                                      <div>
                                        <div className="user-name">{users.userType == "D" && "Dr. "}{users.userData?.name}
                                          {userId}</div>
                                        <div className="user-last-chat">{users?.messages?.[0]?.['message']}</div>
                                      </div>
                                      <div>
                                        <div className="last-chat-time block">
                                          {
                                            today ? dayjs(users?.messages?.[0]?.time).format('HH:mm')
                                              : thisWeek ? <>{dayName}<br /> {dayjs(users?.messages?.[0]?.time).format('HH:mm')}</>
                                                : thisYear ? <>{dayjs(users?.messages?.[0]?.time).format('MMM D ')}<br /> {dayjs(users?.messages?.[0]?.time).format('HH:mm')}</>
                                                  : <>{dayjs(users?.messages?.[0]?.time).format('D MMM YY')}<br /> {dayjs(users?.messages?.[0]?.time).format('HH:mm')}</>
                                          }
                                        </div>
                                        <div className="badge badge-success rounded-pill ">{unreadMessagesLength}</div>
                                      </div>
                                    </div>
                                  </Link>
                                </Tooltip>
                              )
                            }
                          })
                      } */}
                    </div>
                  </div>
                </div>

                <div className="chat-cont-right" >
                  <div className="chat-header">
                    <Link id="back_user_list" href="#" className="back-user-list">
                      <i className="material-icons">chevron_left</i>
                    </Link>
                    <div className="media d-flex">
                      <div className="media-img-wrap flex-shrink-0">
                        <StyledBadge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          variant="dot"
                          online={userProfile!.online}
                        >
                          <Avatar alt="" src={`${userProfile?.profileImage}`} />
                        </StyledBadge>
                      </div>
                      <div className="media-body flex-grow-1">
                        <div className="user-name">{`${userProfile?.firstName} ${userProfile?.lastName}`}</div>
                        <div className="user-status">online</div>
                      </div>
                    </div>
                    <div className="chat-options">
                      <Link href="#" data-bs-toggle="modal" id="modal" data-bs-target="#voice_call">
                        <i className="material-icons">local_phone</i>
                      </Link>
                      <Link href="#" data-bs-toggle="modal" id="modal" data-bs-target="#video_call">
                        <i className="material-icons">videocam</i>
                      </Link>
                      <Link href="#" id="more_vert" onClick={(e) => {
                        e.preventDefault();
                        handleClick(e)
                      }}>
                        <i className="material-icons" >more_vert</i>
                      </Link>
                      <Menu
                        id="long-menu"
                        MenuListProps={{
                          'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        slotProps={{
                          paper: {
                            style: {
                              maxHeight: ITEM_HEIGHT * 4.5,
                              width: '20ch',
                            }
                          }
                        }}
                      >
                        {menuOptions.map((option) => (
                          <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleClose}>
                            {option}
                          </MenuItem>
                        ))}
                      </Menu>
                    </div>
                  </div>
                  <div className="chat-body">
                    <div className={`chat-scroll ${allCurrentUserMessage.length == 0 ? 'chat-scroll-empty' : ''}`}>
                      <ul className={`list-unstyled ${allCurrentUserMessage.length == 0 ? 'chat-scroll-empty' : ''}`}>
                        {
                          allCurrentUserMessage.length == 0 ?
                            <li ><CustomNoRowsOverlay text='No chat' /></li> :
                            <>
                              {
                                allCurrentUserMessage.map((mesage, i) => {
                                  let isSent = mesage.senderId == currentUserId;
                                  let senderImage: string = "";
                                  if (activeChat !== null) {
                                    senderImage = userChatData[activeChat]?.userData?.image
                                  }
                                  if (mesage.reciverId == currentUserId || mesage.senderId == currentUserId) {
                                    let diff: any = dayjs.duration(dayjs().diff(dayjs(mesage?.time)))
                                    const { years, days, hours } = diff['$d' as keyof typeof diff]
                                    let dayName = weekdays[dayjs(mesage?.time).weekday()]
                                    let today = days == 0 && hours < 24
                                    let thisWeek = days !== 0 && days <= 7
                                    let thisYear = !thisWeek && years == 0
                                    return (
                                      <Fragment key={i} >
                                        {i !== 0 &&
                                          i !== 0 && dayjs(allCurrentUserMessage[i - 1]?.time).get('date') !== dayjs(mesage?.time).get('date') &&
                                          <li className="chat-date">
                                            {
                                              today ? 'Today'
                                                : thisWeek ? <>{dayName}</>
                                                  : thisYear ? <>{dayjs(mesage?.time).format('MMM D ')}</>
                                                    : <>{dayjs(mesage?.time).format('D MMM YY')}</>
                                            }
                                          </li>
                                        }
                                        {mesage.message !== null && <li className={`media ${isSent ? 'sent' : 'received'} d-flex`}  >
                                          <div className="avatar flex-shrink-0">
                                            {!isSent && <img src={senderImage} alt="User" className="avatar-img rounded-circle" />}
                                          </div>
                                          <div className="media-body flex-grow-1">
                                            <div className="msg-box">
                                              <div style={{ whiteSpace: 'pre-line' }}>
                                                <p ref={allCurrentUserMessage[allCurrentUserMessage.length - 1].message == mesage.message ? ref : ref1}>
                                                  {mesage.message}
                                                </p>
                                                <ul className="chat-msg-info">
                                                  <li>
                                                    <div className="chat-time">
                                                      <span>{dayjs(mesage.time).format('HH:mm')}</span>
                                                    </div>
                                                  </li>
                                                </ul>
                                              </div>
                                            </div>
                                            {Array.isArray(mesage.attachment) && <div className="msg-box">
                                              <div>
                                                <div className="chat-msg-attachments">
                                                  {
                                                    mesage.attachment.map((a, index) => {
                                                      return (
                                                        <div className="chat-attachment" key={index}>
                                                          <img src={a.src} alt="Attachment" />
                                                          <div className="chat-attach-caption">{a.name}</div>
                                                          <Link href="#" className="chat-attach-download">
                                                            <i className="fas fa-download"></i>
                                                          </Link>
                                                        </div>
                                                      )
                                                    })
                                                  }
                                                </div>
                                                <ul className="chat-msg-info">
                                                  <li>
                                                    <div className="chat-time">
                                                      <span >{dayjs(mesage.time).format('HH:mm')}</span>
                                                    </div>
                                                  </li>
                                                </ul>
                                              </div>
                                            </div>}
                                          </div>
                                        </li>}
                                      </Fragment>
                                    )
                                  }
                                })
                              }
                            </>
                        }
                      </ul>
                    </div>
                  </div>
                  <div className="chat-footer">
                    <div className="input-group">

                      <FormControl sx={{ width: '100%' }} >
                        <TextField
                          id="chat-input"
                          required
                          placeholder={activeChat == null ? 'Select user to chat ' : "Type something"}
                          disabled={activeChat == null}
                          value={chatInputValue}
                          sx={{
                            maxHeight: 1
                          }}
                          fullWidth
                          onChange={(e) => {
                            setChatInputValue(e.target.value)
                          }}
                          onKeyDown={(e) => {
                            onButtonClick(e)
                          }}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">
                              <button disabled={activeChat == null} aria-label='send' type="button" className="btn msg-send-btn rounded-pill ms-2" onClick={(e) => {
                                onButtonClick(e)
                              }}><i className="fab fa-telegram-plane"></i></button>
                            </InputAdornment>,
                            startAdornment: <InputAdornment position='start'>
                              <div className="btn-file btn">
                                <i className="fa fa-paperclip" ></i>
                                <label style={{ display: 'none' }} htmlFor='file'>File</label>
                                <input aria-label="File" disabled={activeChat == null} id='file' type="file" />
                              </div>
                            </InputAdornment>,
                          }}
                        />
                      </FormControl>

                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>

        </div>

      </div>
      <div className="modal fade call-modal" id="voice_call" style={muiVar}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <div className="call-box incoming-box">
                <div className="call-wrapper">
                  <div className="call-inner">
                    <div className="call-user">
                      <img
                        alt="User Image"
                        src={doctor_17}
                        className="call-avatar"
                      />
                      <h4>Dr. Darren Elder</h4>
                      <span>Connecting...</span>
                    </div>
                    <div className="call-items">
                      <Link
                        href="#"
                        className=" call-item call-end"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      >
                        <i className="material-icons">call_end</i>
                      </Link>
                      <Link href="/voice-call" className=" call-item call-start">
                        <i className="material-icons">call</i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              {/* Outgoing Call */}
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade call-modal" id="video_call" style={muiVar}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body">
              {/* Incoming Call */}
              <div className="call-box incoming-box">
                <div className="call-wrapper">
                  <div className="call-inner">
                    <div className="call-user">
                      <img
                        className="call-avatar"
                        src={doctor_17}
                        alt="User Image"
                      />
                      <h4>Dr. Darren Elder</h4>
                      <span>Calling ...</span>
                    </div>
                    <div className="call-items">
                      <Link
                        href="#"
                        className=" call-item call-end"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      >
                        <i className="material-icons">call_end</i>
                      </Link>
                      <Link href="/video-call" className=" call-item call-start">
                        <i className="material-icons">videocam</i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Incoming Call */}
            </div>
          </div>
        </div>
      </div>
    </Fragment >
  )
});


export default ChatComponent;