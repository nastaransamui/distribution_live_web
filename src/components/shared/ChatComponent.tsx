/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useState, MouseEvent, useMemo, useRef } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link';
import { doctor_17 } from '@/public/assets/imagepath';
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
import DoctorsAutoComplete from './DoctorsAutoComplete';
import { ChatDataType, ITEM_HEIGHT, menuOptions, MessageType, useChat } from '@/hooks/useChat';
import { BootstrapDialog, Transition } from './Dialog';

export function escapeRegExp(value: string) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const ChatComponent: FC = (() => {

  dayjs.extend(relativeTime)
  dayjs.extend(duration)
  dayjs.extend(weekday)
  dayjs.extend(updateLocale)
  const theme = useTheme();
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

  const {
    footerHeight,
    searchInputWidth,
    inputGroupRef,
    allCurrentUserMessage,
    setAllCurrentUserMessage,
    voiceCallActive,
    setActiveChat,
    currentUserId,
    userChatData,
    voiceCallToggleFunction,
    videoCallActive,
    videoCallToggleFunction,
  } = useChat()

  const { muiVar } = useScssVar();





  return (
    <Fragment>
      <div className="col-md-12 col-lg-12 col-xl-12">
        <div className="new-chat-window row g-0">

          <div style={{ minHeight: `calc(100vh + ${footerHeight}px)` }}
            className="new-chat-cont-left col-xl-4">
            <div className="chat-header">
              <span>Chats</span>
            </div>
            <div className="chat-search">
              <div className="input-group" ref={inputGroupRef}>
                <DoctorsAutoComplete
                  name='searchString'
                  optionFieldName='searchString'
                  userType='doctors'
                  width={searchInputWidth}
                  userChatData={userChatData}
                  currentUserId={currentUserId}
                  setActiveChat={setActiveChat}
                  setAllCurrentUserMessage={setAllCurrentUserMessage}
                />
              </div>
            </div>
            <div className="chat-users-list">
              <div className="chat-scroll" >
                {
                  userChatData.length == 0 ?
                    <div className='start-chat-div'>Start chat</div> : ""
                }
                <LeftSideChat />
              </div>
            </div>
          </div>
          <div
            style={{ minHeight: `calc(100vh + ${footerHeight}px)` }}
            className={`new-chat-cont-right ${allCurrentUserMessage.length == 0 ? 'new-chat-cont-right-empty' : ''} col-xl-8`}>
            <RightSideChatHeader />
            <div className="chat-body">
              <div
                className={
                  `chat-scroll 
                ${allCurrentUserMessage.length == 0 ? 'chat-scroll-empty' : ''}
                `}
                style={{
                  maxHeight: `calc(100vh - 10px)`,
                  minHeight: `calc(100vh - 10px)`,
                }}
              >
                <ul className={`list-unstyled ${allCurrentUserMessage.length == 0 ? 'chat-scroll-empty' : ''}`}>
                  {
                    allCurrentUserMessage.length == 0 ?
                      <li >
                        <CustomNoRowsOverlay text='No chat' />
                      </li> :
                      <MainChatBody />
                  }
                </ul>
              </div>
            </div>
            <ChatFooter />
          </div>
        </div>
      </div>
      {voiceCallActive &&
        <BootstrapDialog
          TransitionComponent={Transition}
          onClose={() => {

          }}
          aria-labelledby="edit_invoice_details"
          open={voiceCallActive}>

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
                    <span>Voice call Connecting...</span>
                  </div>
                  <div className="call-items">
                    <Link
                      href="#"
                      className=" call-item call-end"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
                        setTimeout(() => {
                          voiceCallToggleFunction()

                        }, 500);
                      }}
                    >
                      <i className="material-icons">call_end</i>
                    </Link>
                    <Link href="/voice-call" onClick={(e) => e.preventDefault()} style={{ pointerEvents: "none" }} className=" call-item call-start">
                      <i className="material-icons">call</i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* Outgoing Call */}
          </div>
        </BootstrapDialog>
      }
      {videoCallActive &&
        <BootstrapDialog
          TransitionComponent={Transition}
          onClose={() => {

          }}
          aria-labelledby="edit_invoice_details"
          open={videoCallActive}>

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
                    <span>Video call Connecting...</span>
                  </div>
                  <div className="call-items">
                    <Link
                      href="#"
                      className=" call-item call-end"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
                        setTimeout(() => {
                          videoCallToggleFunction()

                        }, 500);
                      }}
                    >
                      <i className="material-icons">call_end</i>
                    </Link>
                    <Link href="/voice-call" onClick={(e) => e.preventDefault()} style={{ pointerEvents: "none" }} className=" call-item call-start">
                      <i className="material-icons">call</i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* Outgoing Call */}
          </div>
        </BootstrapDialog>
      }

    </Fragment >
  )
});

export interface LeftSideChatType { }

export const LeftSideChat: FC<LeftSideChatType> = (() => {

  const {
    userChatData,
    setActiveChat,
    setAllCurrentUserMessage,
    activeChat,
    currentUserId,
    weekdays
  } = useChat();


  const onLeftUserClicked = (users: ChatDataType, index: number) => {
    setActiveChat(() => index)
    users?.messages.forEach(element => {
      if (element.reciverId == currentUserId) {
        element.read = true;
        return element
      }
      return element
    });
    let currentUserMessage = users?.messages.filter((b) => {
      if (b.reciverId == currentUserId || b.senderId == currentUserId) {
        return b;
      }
    })
    if (currentUserMessage.length > 0) {
      setAllCurrentUserMessage((prevState) => {
        let newState = [...currentUserMessage]
        return newState.sort((a: MessageType, b: MessageType) => new Date(a?.time).valueOf() - new Date(b?.time).valueOf())
      })
    } else {
      setAllCurrentUserMessage((prevState) => {
        return []
      })
    }
  }

  return (
    <Fragment>
      {
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
              const todayValue = dayjs(users?.messages?.[0]?.time).format('HH:mm');
              const thisWeekValue = <>{dayName}<br /> {dayjs(users?.messages?.[0]?.time).format('HH:mm')}</>;
              const thisYearValue = <>{dayjs(users?.messages?.[0]?.time).format('MMM D ')}<br /> {dayjs(users?.messages?.[0]?.time).format('HH:mm')}</>;
              const defaultValue = <>{dayjs(users?.messages?.[0]?.time).format('D MMM YY')}<br /> {dayjs(users?.messages?.[0]?.time).format('HH:mm')}</>
              return (

                <Link key={index} href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onLeftUserClicked(users, index)
                  }}
                  className={`media d-flex  ${activeChat !== null && activeChat == index ? 'read-chat active' : ''}`} >
                  <div className="media-img-wrap">
                    <div className={
                      `avatar ${!users.userData?.online ? 'avatar-offline' : users.userData.idle ? 'avatar-away' : 'avatar-online'}`
                    }>
                      <img src={users.userData?.image} alt="User" className="avatar-img rounded-circle" />
                    </div>
                  </div>
                  <div className="media-body flex-grow-1">
                    <div>
                      <div className="user-name">
                        {users.userType == "doctors" && "Dr. "}{users.userData?.name}
                        {userId}
                      </div>
                      <div className="user-last-chat">{users?.messages?.[0]?.['message']}</div>
                    </div>
                    <div>
                      <div className="last-chat-time block">
                        {
                          today ? todayValue
                            : thisWeek ? thisWeekValue
                              : thisYear ? thisYearValue
                                : defaultValue
                        }
                      </div>
                      <div className="badge badge-success">{unreadMessagesLength}</div>
                    </div>
                  </div>
                </Link>

              )
            }
          })
      }
    </Fragment>
  )
})

export const RightSideChatHeader: FC = (() => {
  const theme = useTheme();
  const {
    activeChat,
    userChatData,
    handleClick,
    handleClose,
    anchorEl,
    open,
    voiceCallToggleFunction,
    videoCallToggleFunction
  } = useChat();

  return (
    <div className="chat-header">
      {
        activeChat !== null ?
          <div className="media d-flex">
            <div className="media-img-wrap flex-shrink-0">
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                online={userChatData[activeChat]?.userData?.online}
                idle={userChatData[activeChat]?.userData?.idle}
              >
                <Avatar alt="" src={`${userChatData[activeChat]?.userData?.image}`} />
              </StyledBadge>
            </div>
            <div className="media-body flex-grow-1">
              <div className="user-name">{`${userChatData[activeChat]?.userData?.name}`}</div>
              <div className="user-status">
                {userChatData[activeChat]?.userData?.idle ? 'away' : userChatData[activeChat]?.userData?.online ? `online` : `offline`}
              </div>
            </div>
          </div> :
          <div className="media d-flex" style={{ color: theme.palette.text.color }}>
            Select user to continue chat or search for new chat.
          </div>
      }
      <div className="chat-options" style={{ justifyContent: activeChat == null ? 'flex-end' : 'space-between' }}>
        {
          activeChat !== null &&
          <>
            <Link href="#"
              onClick={(e) => {
                e.preventDefault();
                voiceCallToggleFunction()
              }}
            >
              <i className="material-icons">local_phone</i>
            </Link>
            <Link href="#" onClick={(e) => {
              e.preventDefault();
              videoCallToggleFunction()
            }}>
              <i className="material-icons">videocam</i>
            </Link>
          </>
        }
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
  )
})

export const MainChatBody: FC = (() => {
  const {
    allCurrentUserMessage,
    activeChat,
    userChatData,
    currentUserId,
    weekdays,
    ref,
    ref1
  } = useChat();

  return (
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
                {dayjs(allCurrentUserMessage[i - 1]?.time).get('date') !== dayjs(mesage?.time).get('date') &&
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
                    <div className="msg-box" style={{ maxWidth: "100%" }}>
                      <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                        <p style={{ marginBottom: 'unset' }}
                          ref={allCurrentUserMessage[allCurrentUserMessage.length - 1].message == mesage.message ? ref : ref1}>
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
                                  <Link href={a.src} download={a.name} target='_blank' className="chat-attach-download">
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
  )
})

export const ChatFooter: FC = (() => {

  const {
    chatFooterRef,
    activeChat,
    chatInputValue,
    setChatInputValue,
    userChatData,
    currentUserId,
    setAllCurrentUserMessage,
    ref,

  } = useChat();


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
    <div className="chat-footer" ref={chatFooterRef}>
      <div className="input-group">

        <FormControl sx={{ width: "100%" }}>
          <TextField
            id="chat-input"
            required
            placeholder={activeChat == null ? "Select user to chat" : "Type something"}
            disabled={activeChat == null}
            value={chatInputValue}
            sx={{
              width: "100%", // Takes full parent width
              wordWrap: "break-word",
              overflowWrap: "break-word",
              whiteSpace: "pre-wrap",
            }}
            multiline
            fullWidth
            onChange={(e) => setChatInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (e.ctrlKey) {
                  // Ctrl + Enter => Insert a new line
                  setChatInputValue((prev) => prev + "\n");
                } else {
                  // Enter => Send the message
                  e.preventDefault(); // Prevents new line on Enter
                  onButtonClick(e);
                }
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <button
                    disabled={activeChat == null}
                    aria-label="send"
                    type="button"
                    className="btn msg-send-btn "
                    onClick={(e) => onButtonClick(e)}
                  >
                    <i className="fab fa-telegram-plane"></i>
                  </button>
                </InputAdornment>
              ),
              startAdornment: (
                <InputAdornment position="start">
                  <div className="btn-file btn" style={{ pointerEvents: activeChat == null ? 'none' : 'auto', }}>
                    <i className="fa fa-paperclip"></i>
                    <label style={{ display: "none" }} htmlFor="file">
                      File
                    </label>
                    <input
                      aria-label="File"
                      disabled={activeChat == null}
                      style={{ cursor: 'pointer' }}
                      id="file"
                      type="file"
                    />
                  </div>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>

      </div>
    </div>
  )
})


export default ChatComponent;