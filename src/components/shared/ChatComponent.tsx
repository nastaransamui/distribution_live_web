
/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useEffect, useState } from 'react'
import Link from 'next/link';
import { doctors_profile, patient_profile } from '@/public/assets/imagepath';
import IconButton from '@mui/material/IconButton'
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
import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';
import PhoneCallbackIcon from '@mui/icons-material/PhoneCallback';
import { useTheme } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import DialogContent from '@mui/material/DialogContent'
import Stack from '@mui/material/Stack'
import { LoadingComponent, StyledBadge } from '../DoctorDashboardSections/ScheduleTiming';
import DoctorsAutoComplete from './DoctorsAutoComplete';
import { AttachmentType, ChatDataType, ITEM_HEIGHT, menuOptions, MessageType, useChat } from '@/hooks/useChat';
import { BootstrapDialog, BootstrapDialogTitle, Transition } from './Dialog';
import UploadFile from '@mui/icons-material/UploadFile';
import Snackbar from '@mui/material/Snackbar'
import { DeleteForever, Send } from '@mui/icons-material';
import { truncateString } from '../DoctorsSections/CheckOut/Invoice';
import { decrypt } from '@/helpers/encryptDecrypt';
import useScssVar from '@/hooks/useScssVar';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import EditIcon from '@mui/icons-material/Edit';
import _ from 'lodash';
import PhoneMissedIcon from '@mui/icons-material/PhoneMissed';
import { LiveAudioVisualizer } from 'react-audio-visualize';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import Lightbox from 'yet-another-react-lightbox';

export function escapeRegExp(value: string) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export interface ChatComponentType {
  userType: 'doctors' | 'patient';
}

dayjs.extend(relativeTime)
dayjs.extend(duration)
dayjs.extend(weekday)
dayjs.extend(updateLocale)
const ChatComponent: FC<ChatComponentType> = (({ userType }) => {
  const { muiVar } = useScssVar()

  const {
    footerHeight,
    voiceCallActive,
    voiceCallToggleFunction,
    videoCallActive,
    videoCallToggleFunction,
    currentRoom,
    deleteConfirmationShow,
    setDeleteConfirmationShow,
    deleteSubmited,
    setDeleteType,
    showSnackBar,
    setShowSnakBar,
    minWidth768
  } = useChat()


  return (
    <Fragment>

      <audio id="remoteAudio" autoPlay playsInline />
      <div className="col-md-12 col-lg-12 col-xl-12">
        <div className="new-chat-window row g-0">
          <div style={{ minHeight: minWidth768 ? `calc(100vh + ${footerHeight}px)` : '131px' }}
            className="new-chat-cont-left col-xl-4 col-md-4">
            {!minWidth768 &&
              <MobileShowSearchButton />
            }
            <ChatLeftHeader />

            <ChatLeftSearch userType={userType} />

            <ChatLeftUsers />
          </div>

          <div
            style={{ minHeight: `calc(100vh + ${footerHeight}px)` }}
            className={`new-chat-cont-right ${currentRoom == null ? 'new-chat-cont-right-empty' : ''} col-xl-8 col-md-8`}>
            <ChatRightHeader />

            <ChatRightBody />

            <ChatRightFooter />
          </div>
        </div>
      </div>
      {voiceCallActive &&
        <CallDialog callType='Voice' open={voiceCallActive} toggleFunction={voiceCallToggleFunction} />
      }
      {videoCallActive &&
        <CallDialog callType='Video' open={videoCallActive} toggleFunction={videoCallToggleFunction} />
      }

      {deleteConfirmationShow && <BootstrapDialog
        TransitionComponent={Transition}
        onClose={(event, reason) => {
          if (reason == 'backdropClick') return false;
          document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')

          setTimeout(() => {
            setDeleteConfirmationShow(false)
          }, 500);
        }}
        aria-labelledby="edit_invoice_details"
        open={deleteConfirmationShow}
      >
        <BootstrapDialogTitle
          id="edit_invoice_details" onClose={() => {
            document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')

            setTimeout(() => {
              setDeleteConfirmationShow(false)
              setDeleteType(null)
            }, 500);
          }}>
          <Stack>
            <span>Delete</span>

          </Stack>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <h4 className="modal-title" style={{ display: 'flex', justifyContent: 'center' }}>Delete</h4>
          <p className="mb-4" style={{ display: 'flex', justifyContent: 'center' }}>Are you sure to delete  this record?</p>
          <span style={{ ...muiVar, display: 'flex', justifyContent: 'center' }}><button type="button" className="btnLogin mx-1"
            onClick={() => {
              deleteSubmited()
            }}>Delete </button>
            <button type="button" className="btnLogout" style={muiVar}
              onClick={() => {
                document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')

                setTimeout(() => {
                  setDeleteConfirmationShow(false)
                  setDeleteType(null)
                }, 500);

              }}>Cancell</button>
          </span>
        </DialogContent>
      </BootstrapDialog>}
      {showSnackBar.show && <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={showSnackBar.show}
        onClose={() => setShowSnakBar({ show: false, text: "" })}
        autoHideDuration={1000}
        sx={{
          "& .MuiPaper-root": {
            bgcolor: 'primary.main',
            color: "background.paper"
          }
        }}
        message={showSnackBar.text}
      />}
    </Fragment>
  )
})

const MobileShowSearchButton: FC = (() => {

  const onClick = () => {

    const chatLeft = document.querySelector(".new-chat-cont-left");
    if (chatLeft) {
      chatLeft.classList.toggle("new-chat-cont-left-active");
    }
    const chatScrol = document.querySelector('.chat-scroll');
    if (chatScrol) {
      chatScrol.classList.toggle('chat-scroll-active')
    }
    const chatUserList = document.querySelector('.chat-users-list');
    if (chatUserList) {
      chatUserList.classList.toggle('chat-users-list-active')
    }

  }
  return (
    <IconButton
      disableFocusRipple
      disableRipple
      disableTouchRipple
      sx={{
        position: 'absolute',
        right: 4,
        top: 14
      }}
      onClick={onClick}>
      <ManageSearchIcon sx={{ color: "secondary.main" }} />
    </IconButton>
  )
})

export const ChatLeftHeader: FC = (() => {

  return (
    <div className="chat-header chat-header-with-small" >
      <span>Chats</span>
      <small>This chat is end to end encrypt and files are privates.</small>
    </div>
  )
})

export const ChatLeftSearch: FC<{ userType: "doctors" | "patient" }> = (({ userType }) => {
  const {
    searchInputWidth,
    inputGroupRef,
  } = useChat()
  return (
    <div className="chat-search">
      <div className="input-group" ref={inputGroupRef}>
        <DoctorsAutoComplete
          name='searchString'
          optionFieldName='searchString'
          userType={userType}
          width={searchInputWidth}
        />
      </div>
    </div>
  )
})

export const ChatLeftUsers: FC = (() => {
  const {
    userChatData,
    isLoading,
    currentUserId,
    sortLatestMessage,
  } = useChat()

  return (
    <Fragment>

      <div className="chat-users-list">
        <div className="chat-scroll" >
          {
            isLoading ? <LoadingComponent /> : userChatData.length == 0 &&
              <div className='start-chat-div'>Start chat</div>
          }
          <Fragment>
            {
              sortLatestMessage(userChatData)
                .filter((a) => a.messages.length > 0 || a.createrData.userId === currentUserId)
                .map((chatData, index) => {

                  let hasChat = chatData?.messages.some((a) => a?.senderId == currentUserId || a?.receiverId == currentUserId);

                  if (hasChat) {

                    return (

                      <ChatLeftHasChat key={index} chatData={chatData} index={index} />

                    )
                  } else {
                    return (
                      <ChatLeftNoChat key={index} chatData={chatData} index={index} />
                    )
                  }
                })
            }
          </Fragment>
        </div>
      </div>
    </Fragment>
  )
})

const ChatLeftHasChat: FC<{ chatData: ChatDataType, index: number }> = (({ chatData, index }) => {

  const { onLeftUserClicked, currentRoomId, weekdays, currentUserId, downloadClick, voiceCallToggleFunction, setCurrentRoomId } = useChat();
  let sortedMessages = [...chatData?.messages].sort((a, b) => b.timestamp - a.timestamp); // Sort in descending order
  let lastMessage = sortedMessages[0];
  let lastMessageTime = dayjs(lastMessage?.timestamp);
  let today = lastMessageTime.isSame(dayjs(), 'day'); // Checks if the last message is from today
  let thisWeek = lastMessageTime.isAfter(dayjs().subtract(7, 'days'), 'day'); // Checks if within the last 7 days
  let thisYear = lastMessageTime.isSame(dayjs(), 'year'); // Checks if it's from the current year

  let dayName = weekdays[lastMessageTime.weekday()];
  const todayValue = lastMessageTime.format('HH:mm');
  const thisWeekValue = <>{dayName}<br /> {lastMessageTime.format('HH:mm')}</>;
  const thisYearValue = <>{lastMessageTime.format('MMM D ')}<br /> {lastMessageTime.format('HH:mm')}</>;
  const defaultValue = <>{lastMessageTime.format('D MMM YY')}<br /> {lastMessageTime.format('HH:mm')}</>;
  let numberOfNotRead = chatData?.messages.filter((a) => !a.read).length;
  let unreadMessagesLength = (numberOfNotRead == 0 ? '' : numberOfNotRead);
  const profileToShow = chatData.createrData.userId == currentUserId ? chatData.receiverData : chatData.createrData

  return (
    <Fragment key={index}>
      <Link href="#"
        onClick={(e) => {
          e.preventDefault();
          onLeftUserClicked(chatData)
        }}
        className={`media d-flex  ${currentRoomId !== null && currentRoomId == chatData.roomId ? 'read-chat active' : ''}`} >
        <DeleteMessageButton deleteType={chatData.roomId} />
        <div className="media-img-wrap">
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            online={profileToShow.online}
            idle={profileToShow.idle}
          >
            <Avatar alt="" src={`${profileToShow?.profileImage}`} >
              <img src={doctors_profile} alt="" className="avatar" />
            </Avatar>
          </StyledBadge>
        </div>
        <div className="media-body flex-grow-1">
          <div>
            <div className="user-name">
              {profileToShow.roleName == "doctors" && "Dr. "}
              {profileToShow?.fullName}

            </div>
            <span style={{ display: 'flex', alignItems: 'center', }}>
              <div className="user-last-chat" >
                {lastMessage?.["message"] && decrypt(lastMessage["message"])}
              </div>
              {lastMessage.calls.length == 0 && <ReadStatusComponent lastMessage={lastMessage} />}
            </span>
            <span style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {
                lastMessage.attachment.length > 0 &&
                lastMessage.attachment.map((attach, i) => {
                  const isBlob = attach.src && attach.src.startsWith("blob:");
                  return (
                    <span key={`${i} ${index}`}>
                      <div className="chat-attachment chat-attachment-left-side" onClick={() => { downloadClick(attach) }} >
                        {isBlob &&
                          <img
                            src={attach.isImage ? attach.src : getFileIcon(attach.type)} // Use icon/placeholder until blob is ready
                            alt="Attachment"
                          />
                        }
                        <div className="user-last-chat" style={{ marginLeft: 3, paddingInline: 10 }}>{attach.name}</div>
                      </div>
                    </span>
                  )
                })
              }
            </span>
            {
              lastMessage.calls.length > 0 &&
              lastMessage.calls.map((call, i) => {
                let isSent = lastMessage.senderId == currentUserId;

                return (
                  <div key={`${i} ${index}`} style={{ display: 'flex', alignItems: 'center', }}>
                    {
                      isSent ?
                        <Avatar sx={{ backgroundColor: "background.default", height: 30, width: 30, marginRight: '8px' }} onClick={(e) => {
                          if (currentRoomId !== null) {
                            voiceCallToggleFunction();
                          }
                        }}>
                          {
                            call.isMissedCall ?
                              <PhoneMissedIcon sx={{ color: "secondary.main", fontSize: 16, }} /> :
                              <PhoneForwardedIcon sx={{ color: 'secondary.main', fontSize: 16, }} />
                          }

                        </Avatar> :
                        <Avatar sx={{ backgroundColor: "background.default", height: 30, width: 30, marginRight: '8px' }} onClick={(e) => {
                          if (currentRoomId !== null) {
                            voiceCallToggleFunction();
                          }
                        }}>
                          {
                            call.isMissedCall ?
                              <PhoneMissedIcon sx={{ color: "secondary.main", fontSize: 16, }} /> :
                              <PhoneCallbackIcon sx={{ color: 'secondary.main', fontSize: 16, }} />
                          }
                        </Avatar>
                    }
                    <ReadStatusComponent lastMessage={lastMessage} />
                  </div>
                )
              })
            }
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
    </Fragment>
  )
})

const DeleteMessageButton: FC<{ deleteType: string | number, mesage?: MessageType }> = (({ deleteType, mesage }) => {
  const { deleteButtonClicked, setDeleteType, setEditChatInputValue, setIsEdit, isEdit } = useChat();
  return (
    <span className='delete-whole-chat'>
      <IconButton
        disableFocusRipple
        disableRipple
        disableTouchRipple

        onClick={(e) => {
          deleteButtonClicked(e)
          setDeleteType(deleteType)
        }}>
        <DeleteForever sx={{ fontSize: 16, color: 'crimson' }} />
      </IconButton>

      {mesage?.calls.length == 0 &&
        <IconButton
          disableFocusRipple
          disableRipple
          disableTouchRipple
          onClick={(e) => {
            if (mesage) {
              if (!isEdit) {
                setIsEdit(true)
                setEditChatInputValue(() => {
                  return {
                    ...mesage,
                    message: mesage.message ? decrypt(mesage.message) : ""
                  }
                })
              } else {
                setIsEdit(false);
                setTimeout(() => {
                  setIsEdit(true)
                  setEditChatInputValue(() => {
                    return {
                      ...mesage,
                      message: mesage.message ? decrypt(mesage.message) : ""
                    }
                  })
                }, 50);
              }

            }
          }}>
          <EditIcon sx={{ fontSize: 16, color: "secondary.main" }} />
        </IconButton>
      }
    </span>
  )
})

const ChatLeftNoChat: FC<{ chatData: ChatDataType, index: number }> = (({ chatData, index }) => {

  const { onLeftUserClicked, currentRoomId, currentUserId } = useChat();
  let hasMessage = chatData?.messages?.length > 0;
  let numberOfNotRead = chatData?.messages.filter((a) => !a.read).length;
  let unreadMessagesLength = hasMessage ? (numberOfNotRead == 0 ? '' : numberOfNotRead) : '';

  let sortedMessages = [...chatData?.messages].sort((a, b) => b.timestamp - a.timestamp); // Sort in descending order
  let lastMessage = sortedMessages[0]; // Get the latest message
  let lastMessageTime = dayjs(lastMessage?.timestamp);



  const profileToShow = chatData.createrData.userId == currentUserId ? chatData.receiverData : chatData.createrData
  return (
    <Fragment key={index}>
      <Link href="#"
        onClick={(e) => {
          e.preventDefault();
          onLeftUserClicked(chatData)
        }}
        className={`media d-flex  ${currentRoomId !== null && currentRoomId == chatData.roomId ? 'read-chat active' : ''}`} >
        <DeleteMessageButton deleteType={chatData.roomId} />
        <div className="media-img-wrap">
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            online={profileToShow.online}
            idle={profileToShow.idle}
          >
            <Avatar alt="" src={`${profileToShow?.profileImage}`} >
              <img src={doctors_profile} alt="" className="avatar" />
            </Avatar>
          </StyledBadge>
        </div>
        <div className="media-body flex-grow-1">
          <div>
            <div className="user-name">
              {profileToShow.roleName == "doctors" && "Dr. "}
              {profileToShow?.fullName}
            </div>
            <div className="user-last-chat">{chatData?.messages?.[0]?.['message']}</div>
          </div>
          <div>
            <div className="last-chat-time block">
              {lastMessageTime.format('HH:mm')}
            </div>
            <div className="badge badge-success">{unreadMessagesLength}</div>
          </div>
        </div>
      </Link>
    </Fragment>
  )
})

export const ChatRightHeader: FC = (() => {

  const {
    voiceCallToggleFunction,
    videoCallToggleFunction,
    currentUserId,
    handleClick,
    handleClose,
    anchorEl,
    open,
    currentRoom,
  } = useChat();
  const theme = useTheme();
  return (
    <Fragment>
      <div className="chat-header">
        {
          currentRoom !== null ?
            <div className="media d-flex">
              <div className="media-img-wrap flex-shrink-0">
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  online={
                    currentRoom.createrData.userId == currentUserId ? currentRoom.receiverData?.online : currentRoom.createrData?.online
                  }
                  idle={
                    currentRoom.createrData.userId == currentUserId ? currentRoom.receiverData?.idle : currentRoom.createrData?.idle
                  }
                >
                  <Avatar alt="" src={`${currentRoom.createrData.userId == currentUserId ? currentRoom.receiverData?.profileImage : currentRoom.createrData?.profileImage}`} >
                    <img src={doctors_profile} alt="" className="avatar" />
                  </Avatar>
                </StyledBadge>
              </div>
              <div className="media-body flex-grow-1">
                <div className="user-name">
                  {`${currentRoom.createrData.userId == currentUserId ?
                    currentRoom.receiverData?.fullName :
                    currentRoom.createrData?.fullName
                    }`}</div>
                <div className="user-status">

                  {
                    currentRoom.createrData.userId == currentUserId ?
                      <>
                        {currentRoom.receiverData.idle ? 'Away' : currentRoom.receiverData.online ? 'online' : 'offline'}
                      </> :
                      <>
                        {currentRoom.createrData.idle ? 'Away' : currentRoom.createrData.online ? 'online' : 'offline'}
                      </>
                  }
                </div>
              </div>
            </div> :
            <div className="media d-flex" style={{ color: theme.palette.text.color }}>
              Select user to continue chat or search for new chat.
            </div>
        }
        <div className="chat-options" style={{ justifyContent: currentRoom !== null ? 'space-between' : 'flex-end' }}>
          {
            currentRoom !== null &&
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
    </Fragment>
  )
})

export const ChatRightBody: FC = (() => {
  const { currentRoom } = useChat();


  return (
    <div className="chat-body">
      <div
        className={
          `chat-scroll 
      ${currentRoom == null ? 'chat-scroll-empty' : ''}
      `}
      >
        <ul className={`list-unstyled ${currentRoom == null ? 'chat-scroll-empty' : ''}`}>
          {
            currentRoom == null ?
              <li >
                <CustomNoRowsOverlay text='No chat' />
              </li> :
              <Fragment>
                {
                  currentRoom.messages
                    .map((mesage, index) => {
                      return (
                        <Fragment key={index} >
                          <ChatRightBodyDateComponent mesage={mesage} index={index} />
                          {
                            mesage.calls.length !== 0 &&
                            <ChatRightMessageWithCall mesage={mesage} index={index} />
                          }
                          {
                            mesage.attachment.length == 0 ?
                              mesage.calls.length == 0 && <ChatRightMessageWithoutAttachment mesage={mesage} index={index} /> :
                              <ChatRightMessageWithAttachment mesage={mesage} index={index} />
                          }
                        </Fragment>
                      )

                    })
                }
              </Fragment>
          }
        </ul>
      </div>
    </div>
  )
})

export const ChatRightFooter: FC = (() => {

  const {
    chatInputValue,
    chatFooterRef,
    setChatInputValue,
    currentRoomId,
    onSendButtonClick,
    onEditButtonClick,
    inputFileRef,
    handleClickInputFile,
    handleChangeInputFile,
    isEdit,
    setEditChatInputValue,
    editChatInputValue,
    onCancelEdit
  } = useChat()
  const theme = useTheme()

  return (
    <Fragment>
      <div className="chat-footer" ref={chatFooterRef}>
        <div className="input-group">

          <ChatRightFooterShowAttachment />

          <FormControl sx={{ width: "100%" }}>

            <TextField
              id="chat-input"
              required
              placeholder={currentRoomId == null ? "Select user to chat" : "Type something"}
              disabled={currentRoomId == null}
              value={
                isEdit ?
                  editChatInputValue.message == null ? "" : editChatInputValue.message :
                  chatInputValue.message == null ? '' : chatInputValue.message
              }
              sx={{
                width: "100%",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "pre-wrap",
              }}
              multiline
              fullWidth
              onChange={(e) => {
                if (isEdit) {
                  setEditChatInputValue((prevState) => ({ ...prevState, message: e.target.value }))
                } else {
                  setChatInputValue((prevState) => ({ ...prevState, message: e.target.value }))
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (e.ctrlKey) {
                    if (isEdit) {
                      setEditChatInputValue((prevState) => ({ ...prevState, message: prevState.message + "\n" }))
                    } else {
                      setChatInputValue((prevState) => ({ ...prevState, message: prevState.message + "\n" }))
                    }
                  } else {
                    e.preventDefault();
                    if (isEdit) {
                      onEditButtonClick();
                    } else {
                      onSendButtonClick();
                    }
                  }
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      disableFocusRipple
                      disableRipple
                      disableTouchRipple
                      disabled={currentRoomId == null}
                      onClick={(e) => {
                        if (isEdit) {
                          onEditButtonClick();
                        } else {
                          onSendButtonClick();
                        }
                      }}>
                      {
                        isEdit ?
                          <EditIcon sx={{
                            color: currentRoomId == null ? theme.palette.text.disabled : theme.palette.primary.main
                          }} /> :
                          <Send sx={{
                            color: currentRoomId == null ? theme.palette.text.disabled : theme.palette.primary.main
                          }} />
                      }
                    </IconButton>
                  </InputAdornment>
                ),
                startAdornment: (
                  <InputAdornment position="start">
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {
                        isEdit ?

                          <DeleteForever sx={{ color: 'crimson', cursor: 'pointer' }} onClick={(e) => {
                            onCancelEdit()
                          }} />
                          :
                          <IconButton
                            disableFocusRipple
                            disableRipple
                            disableTouchRipple
                            sx={{ paddingLeft: 0 }}
                            disabled={currentRoomId == null || chatInputValue.attachment.length === 5}
                            onClick={() => currentRoomId !== null && handleClickInputFile()}
                          >
                            <UploadFile

                              sx={{
                                color: currentRoomId == null || chatInputValue.attachment.length === 5
                                  ? theme.palette.text.disabled
                                  : theme.palette.primary.main,
                                cursor: currentRoomId == null ? "unset" : "pointer",
                              }}

                            />
                          </IconButton>
                      }
                    </div>
                    <input
                      type="file"
                      id="profile"
                      accept="
                        image/png,
                        image/jpg,
                        image/jpeg,
                        application/msword,
                        application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                        application/pdf,
                        text/plain,
                        application/vnd.ms-excel,
                        application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                        application/vnd.ms-powerpoint,
                        application/vnd.openxmlformats-officedocument.presentationml.presentation,
                        application/vnd.oasis.opendocument.text,
                        application/vnd.oasis.opendocument.spreadsheet,
                        application/vnd.oasis.opendocument.presentation,
                        application/zip,
                        application/x-rar-compressed,
                        application/x-7z-compressed
                      "
                      ref={inputFileRef}
                      multiple
                      onChange={handleChangeInputFile}
                      style={{ display: "none" }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>

        </div>
      </div>
    </Fragment>
  )
})


export const ReadStatusComponent: FC<{ lastMessage: MessageType }> = (({ lastMessage }) => {

  const theme = useTheme();

  return (
    <Fragment>
      <i className="fa-solid fa-check" style={{
        fontSize: 8,
        color: lastMessage?.read ? theme.palette.primary.main : theme.palette.text.disabled,
        marginRight: 6,
        // marginLeft: 6
      }}>

      </i>
      {
        lastMessage?.read && <i className="fa-solid fa-check" style={{
          fontSize: 8,
          marginLeft: -10,
          marginRight: 3,
          color: theme.palette.primary.main
        }}></i>
      }

    </Fragment>
  )
})

export const ChatRightFooterShowAttachment: FC = (() => {
  const {
    chatInputValue,
    setChatInputValue,
    isEdit,
    editChatInputValue,
  } = useChat();
  const theme = useTheme()
  const [cloneEditMessage, setCloneEditMessage] = useState<string>("")
  useEffect(() => {
    if (isEdit) {
      if (cloneEditMessage === "") {
        setCloneEditMessage(editChatInputValue.message!)
      }
    } else {
      setCloneEditMessage('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editChatInputValue, isEdit])
  return (
    <Fragment>
      {
        isEdit ?
          <>
            {
              editChatInputValue.message !== "" && (
                <div className='chat-right-footer-show-attachment-div' style={{ minWidth: '100%' }}>
                  <div className='' style={{
                    width: "100%",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "pre-wrap",
                    border: `1px solid ${theme.palette.primary.main}`,
                    borderRadius: "5px",
                    padding: 10,
                    display: "block",
                    overflow: "hidden",
                  }}>
                    {cloneEditMessage}
                  </div>
                </div>
              )
            }
          </> :
          <>
            {
              chatInputValue.attachment?.length > 0 && (
                <div className='chat-right-footer-show-attachment-div'>
                  {chatInputValue.attachment.map((file, index) => (
                    <div key={index} className='chat-right-footer-show-attachment-inner-div'>
                      <img
                        src={file.isImage ? file.src : getFileIcon(file.type)}
                        alt={file.name}
                        className='chat-right-footer-show-attachment-img'
                        onClick={() => window.open(file.src, "_blank")}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: "absolute",
                          top: "-5px",
                          right: "-5px",
                          color: "white",
                          width: "18px",
                          height: "18px",
                          padding: "2px",
                        }}
                        onClick={() => {
                          setChatInputValue((prevState) => ({
                            ...prevState,
                            attachment: prevState.attachment.filter((_, i) => i !== index),
                          }));
                        }}
                      >
                        <DeleteForever fontSize="small" sx={{ color: 'crimson' }} />
                      </IconButton>
                    </div>
                  ))}
                </div>
              )
            }
          </>
      }
    </Fragment>
  )
})

export const ChatRightBodyDateComponent: FC<{ mesage: MessageType, index: number }> = (({ mesage, index }) => {

  const { currentRoom, weekdays } = useChat();

  let messageDate = dayjs(mesage?.timestamp);

  let today = messageDate.isSame(dayjs(), 'day'); // Checks if the message is from today
  let thisWeek = messageDate.isAfter(dayjs().subtract(7, 'days'), 'day'); // Checks if it's within the last 7 days
  let thisYear = messageDate.isSame(dayjs(), 'year'); // Checks if it's in the current year

  let dayName = weekdays[messageDate.weekday()];

  return (
    <Fragment>
      {currentRoom !== null &&
        (
          index === 0 ||
          !dayjs(currentRoom.messages[index - 1]?.timestamp).isSame(mesage?.timestamp, 'day')) &&
        <li className="chat-date" style={{ marginTop: index == 0 ? 10 : 0 }}>
          {
            today ? 'Today'
              : thisWeek ? <>{dayName}</>
                : thisYear ? <>{dayjs(mesage?.timestamp).format('MMM D ')}</>
                  : <>{dayjs(mesage?.timestamp).format('D MMM YY')}</>
          }
        </li>
      }
    </Fragment>
  )
})

export const ChatRightMessageWithoutAttachment: FC<{ mesage: MessageType, index: number }> = (({ mesage, index }) => {

  const { currentRoom, currentUserId, lastRef } = useChat();
  let isSent = mesage.senderId == currentUserId;

  const senderRole = currentRoom?.createrData.userId == currentUserId ?
    currentRoom?.receiverData?.roleName :
    currentRoom?.createrData?.roleName
  let senderImage =
    currentRoom?.createrData.userId == currentUserId ?
      currentRoom?.receiverData?.profileImage :
      currentRoom?.createrData?.profileImage;

  return (
    <Fragment>
      {
        currentRoom !== null &&
        <li className={`media ${isSent ? 'sent' : 'received'} d-flex`}  >
          <div className="avatar flex-shrink-0">
            {!isSent && <img
              src={senderImage}
              alt="User"
              className="avatar-img rounded-circle"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = senderRole == "doctors" ? doctors_profile : patient_profile;
              }}
            />}
          </div>
          <div className="media-body flex-grow-1">
            <div className="msg-box" >
              <div >
                {currentUserId === mesage.senderId &&
                  <DeleteMessageButton deleteType={mesage.timestamp} mesage={mesage} />
                }
                <p style={{ marginBottom: 'unset' }}>
                  {mesage.message && decrypt(mesage.message)}
                </p>
                <ul className="chat-msg-info">
                  <li>
                    <div className="chat-time" style={{ position: 'relative' }}>
                      <ReadStatusComponent lastMessage={mesage} />
                      <span ref={index == (currentRoom!.messages.length - 1) ? lastRef : null}>{dayjs(mesage.timestamp).format('HH:mm')}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </li>
      }
    </Fragment>
  )
})

export const ChatRightMessageWithAttachment: FC<{ mesage: MessageType, index: number }> = (({ mesage, index }) => {

  const [openImage, setOpenImage] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [Images, setImages] = useState<AttachmentType[]>([]);
  const { currentRoom, lastRef, currentUserId, downloadClick } = useChat();
  const senderRole = currentRoom?.createrData.userId == currentUserId ?
    currentRoom?.receiverData?.roleName :
    currentRoom?.createrData?.roleName;
  let isSent = mesage.senderId == currentUserId;
  let senderImage =
    currentRoom?.createrData.userId == currentUserId ?
      currentRoom?.receiverData?.profileImage :
      currentRoom?.createrData?.profileImage;

  return (
    <Fragment>
      {
        currentRoom !== null &&
        <li className={`media ${isSent ? 'sent' : 'received'} d-flex`}  >
          <div className="avatar flex-shrink-0">
            {!isSent && <img
              src={senderImage}
              alt="User"
              className="avatar-img rounded-circle"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = senderRole == "doctors" ? doctors_profile : patient_profile;
              }}
            />}
          </div>
          <div className="media-body flex-grow-1">
            <div className="msg-box">
              <div>
                {currentUserId === mesage.senderId && <DeleteMessageButton deleteType={mesage.timestamp} />}
                <div className="chat-msg-attachments">

                  {
                    mesage.attachment.map((attach, index) => {
                      const isBlob = attach.src && attach.src.startsWith("blob:");

                      return (
                        <div className="chat-attachment" key={index}>
                          {isBlob &&
                            <img
                              src={attach.isImage ? attach.src : getFileIcon(attach.type)} // Use icon/placeholder until blob is ready
                              alt="Attachment"
                            />
                          }
                          <div className="chat-attach-caption">{truncateString(attach.name, 5)}</div>

                          <button
                            className="chat-attach-download"
                            onClick={() => {
                              if (!attach.isImage) {
                                downloadClick(attach);
                              } else {
                                // Filter only images and find the correct index in the filtered list
                                const imageAttachments = mesage.attachment.filter((a) => a.isImage);
                                const newIndex = imageAttachments.findIndex((a) => a.src === attach.src);

                                setImages(imageAttachments);
                                setImageIndex(newIndex);
                                setOpenImage(true);
                              }
                            }}
                          >
                            {
                              attach.isImage ? <i className="fa-solid fa-magnifying-glass"></i> : <i className="fas fa-download"></i>
                            }
                          </button>
                        </div>
                      )
                    })
                  }
                </div>
                <div >
                  <p style={{ marginBottom: 'unset' }}>
                    {mesage.message && decrypt(mesage.message)}
                  </p>
                  <ul className="chat-msg-info">
                    <li>
                      <div className="chat-time" style={{ position: 'relative' }}>
                        <ReadStatusComponent lastMessage={mesage} />
                        <span ref={index == (currentRoom!.messages.length - 1) ? lastRef : null}>{dayjs(mesage.timestamp).format('HH:mm')}</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </li>
      }

      <Lightbox
        open={openImage}
        close={() => setOpenImage(false)}
        slides={Images.filter(img => img.isImage).map(img => ({
          src: img.src,
          type: "image", // Ensuring it meets the expected type
        }))}
        index={imageIndex}
      />
    </Fragment>
  )
})

export const ChatRightMessageWithCall: FC<{ mesage: MessageType, index: number }> = (({ mesage, index }) => {

  const { currentRoom, currentUserId, lastRef, voiceCallToggleFunction } = useChat();
  let isSent = mesage.senderId == currentUserId;
  const isVoiceCall = mesage.calls[0]?.isVoiceCall
  const isMissedCall = mesage.calls[0]?.isMissedCall
  const senderRole = currentRoom?.createrData.userId == currentUserId ?
    currentRoom?.receiverData?.roleName :
    currentRoom?.createrData?.roleName

  const senderImage =
    currentRoom?.createrData.userId == currentUserId ?
      currentRoom?.receiverData?.profileImage :
      currentRoom?.createrData?.profileImage;


  const startTime = mesage?.calls[0]?.startTimeStamp;
  const finishTime = mesage?.calls[0]?.finishTimeStamp ?? startTime;

  const callDuration = dayjs.duration(finishTime - startTime);
  const totalSeconds = callDuration.asSeconds();
  const totalMinutes = callDuration.asMinutes();
  const totalHours = callDuration.asHours();

  let formattedDuration = "";

  if (totalSeconds < 60) {
    formattedDuration = `${Math.floor(totalSeconds)} sec`;
  } else if (totalSeconds < 3600) {
    formattedDuration = `${Math.floor(totalMinutes)} min ${Math.floor(totalSeconds % 60)} sec`;
  } else {
    formattedDuration = `${Math.floor(totalHours)} hr ${Math.floor(totalMinutes % 60)} min`;
  }


  return (
    <Fragment>
      {
        currentRoom !== null &&
        <li className={`media ${isSent ? 'sent' : 'received'} d-flex`}  >
          <div className="avatar flex-shrink-0">
            {!isSent && <img
              src={senderImage}
              alt="User"
              className="avatar-img rounded-circle"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = senderRole == "doctors" ? doctors_profile : patient_profile;
              }}
            />}
          </div>
          <div className="media-body flex-grow-1">
            <div className="msg-box" >
              <div >
                {currentUserId === mesage.senderId &&
                  <DeleteMessageButton deleteType={mesage.timestamp} mesage={mesage} />
                }

                {
                  isSent ?
                    <>
                      {
                        isVoiceCall ? <Avatar sx={{ backgroundColor: "background.default", cursor: 'pointer' }} onClick={(e) => {
                          voiceCallToggleFunction()
                        }}>
                          {
                            isMissedCall ?
                              <PhoneMissedIcon sx={{ color: "secondary.main" }} /> :
                              <PhoneForwardedIcon sx={{ color: 'secondary.main' }} />
                          }
                        </Avatar> : <>video call</>
                      }
                    </> :
                    <>
                      {
                        isVoiceCall ?
                          <Avatar sx={{ backgroundColor: "background.default", cursor: 'pointer' }} onClick={(e) => {
                            voiceCallToggleFunction()
                          }}>
                            {
                              isMissedCall ?
                                <PhoneMissedIcon sx={{ color: "secondary.main" }} /> :
                                <PhoneCallbackIcon sx={{ color: 'secondary.main' }} />
                            }
                          </Avatar> :
                          <>video Call </>
                      }
                    </>
                }

                <span>
                  {formattedDuration}
                </span>
                <ul className="chat-msg-info">
                  <li>
                    <div className="chat-time" style={{ position: 'relative' }}>
                      <ReadStatusComponent lastMessage={mesage} />
                      <span ref={index == (currentRoom!.messages.length - 1) ? lastRef : null}>{dayjs(mesage.timestamp).format('HH:mm')}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </li>
      }
    </Fragment>
  )
})
const getFileIcon = (fileType: string) => {
  if (fileType.includes("pdf")) return "/assets/images/icons/pdf-icon.png";
  if (fileType.includes("word")) return "/assets/images/icons/word-icon.png";
  if (fileType.includes("excel")) return "/assets/images/icons/excel-icon.png";
  if (fileType.includes("powerpoint")) return "/assets/images/icons/ppt-icon.png";
  if (fileType.includes("text")) return "/assets/images/icons/txt-icon.png";
  if (fileType.includes('zip')) return "/assets/images/icons/zip-icon.png"
  return "/assets/images/icons/image-icon.png"; // Default icon
};




export interface CallDialogPropsType {
  open: boolean;
  toggleFunction: () => void;
  callType: "Video" | "Voice"
}

export const CallDialog: FC<CallDialogPropsType> = (({ open, toggleFunction, callType }) => {
  const { muiVar } = useScssVar();
  const {
    callReceiverUserData,
    currentUserId,
    incomingCall,
    acceptVoiceCall,
    chatInputValue,
    fakeMediaRecorder,
    setAudioBlob,
    audioBlob,
    recordingTime,
    startRecording,
    isRecording,
    stopRecording,
    togglePauseResume,
    isPaused,
    clearRecording,
    handleDownload
  } = useChat();
  const isRecive = incomingCall?.receiverId == currentUserId
  const theme = useTheme();
  const senderRole = callReceiverUserData?.roleName
  const isAnswer = chatInputValue?.calls?.[0]?.isAnswered

  return (
    <BootstrapDialog
      TransitionComponent={Transition}
      onClose={() => {

      }}
      aria-labelledby="edit_invoice_details"
      open={open}>
      <div className="modal-body" style={{ ...muiVar, }}>
        <div className="call-box incoming-box">

          <div className="recorder-container">
            <p>Recording Time: {recordingTime}s</p>

            <div className="buttons">
              <IconButton
                disableFocusRipple
                disableRipple
                disableTouchRipple
                disabled={isRecording}
                onClick={startRecording}>
                {/* 🎙 */}
                <RadioButtonCheckedIcon sx={{ fontSize: 36, color: 'crimson' }} />
              </IconButton>
              <IconButton
                disableFocusRipple
                disableRipple
                disableTouchRipple
                disabled={!isRecording}
                onClick={stopRecording}>
                <StopCircleIcon sx={{ fontSize: 36, color: 'primary.main' }} />
              </IconButton>
              <IconButton
                disableFocusRipple
                disableRipple
                disableTouchRipple
                disabled={!isRecording}
                onClick={togglePauseResume}>
                {isPaused ?
                  <PlayCircleIcon sx={{ fontSize: 36, color: "secondary.main" }} /> :
                  <PauseCircleFilledIcon sx={{ fontSize: 36, color: "secondary.main" }} />}
              </IconButton>
            </div>

            {fakeMediaRecorder && isRecording && (
              <span style={{ textAlign: 'center', display: 'flex', padding: '10px 0px', width: '100%', justifyContent: 'center' }}>
                <LiveAudioVisualizer
                  mediaRecorder={fakeMediaRecorder}
                  width={100}
                  height={5}
                  barColor={theme.palette.secondary.main}

                />
              </span>
            )}
            {audioBlob && (
              <div className="audio-player">
                <p>Recorded Audio:</p>
                <span style={{ display: 'flex', justifyContent: "space-evenly" }}>
                  <IconButton
                    disableFocusRipple
                    disableRipple
                    disableTouchRipple
                    disabled={!audioBlob}
                    onClick={handleDownload}>
                    <DownloadForOfflineIcon sx={{ fontSize: 36, color: 'primary.main' }} />
                  </IconButton>
                  <IconButton
                    disableFocusRipple
                    disableRipple
                    disableTouchRipple
                    disabled={!audioBlob}
                    onClick={clearRecording}
                    sx={{ color: "crimson", fontSize: 30 }}
                  >
                    🗑
                  </IconButton>
                </span>
              </div>
            )}
          </div>
          <div className="call-wrapper">
            <div className="call-inner">
              <div className="call-user">
                <img
                  alt="User Image"
                  src={callReceiverUserData?.profileImage}
                  className="call-avatar"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = senderRole == "doctors" ? doctors_profile : patient_profile;
                  }}
                />
                <h4>{callReceiverUserData?.roleName == "doctors" && "Dr. "} {callReceiverUserData?.fullName}</h4>
                <span>{callType} call {isAnswer ? "Connected" : "Connecting..."}</span>
              </div>
              {fakeMediaRecorder && (
                <LiveAudioVisualizer
                  mediaRecorder={fakeMediaRecorder}
                  width={100}
                  height={35}
                  barColor={theme.palette.primary.main}

                />
              )}
              <div className="call-items">
                <Link
                  href="#"
                  className=" call-item call-end"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
                    setTimeout(() => {
                      toggleFunction()

                    }, 500);
                  }}
                >
                  <i className="material-icons">call_end</i>
                </Link>
                <Link href="/voice-call" onClick={(e) => {
                  e.preventDefault()

                  if (isRecive) {
                    acceptVoiceCall();
                  }
                }} style={{ pointerEvents: isRecive ? 'auto' : "none" }} className=" call-item call-start">
                  <i className="material-icons">call</i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BootstrapDialog>
  )
})

export default ChatComponent;