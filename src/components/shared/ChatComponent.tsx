
/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import Link from 'next/link';
import { doctor_17, doctors_profile } from '@/public/assets/imagepath';
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
import { Avatar, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { LoadingComponent, StyledBadge } from '../DoctorDashboardSections/ScheduleTiming';
import DoctorsAutoComplete from './DoctorsAutoComplete';
import { AttachmentType, ChatDataType, ChatUserType, ITEM_HEIGHT, menuOptions, MessageType, useChat } from '@/hooks/useChat';
import { BootstrapDialog, Transition } from './Dialog';
import UploadFile from '@mui/icons-material/UploadFile';
import { toast } from 'react-toastify';
import { DeleteForever, Send } from '@mui/icons-material';
import { truncateString } from '../DoctorsSections/CheckOut/Invoice';
import { decrypt } from '@/helpers/encryptDecrypt';

export function escapeRegExp(value: string) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export interface ChatComponentType {
  userType: 'doctors' | 'patient';
}

const ChatComponent: FC<ChatComponentType> = (({ userType }) => {


  dayjs.extend(relativeTime)
  dayjs.extend(duration)
  dayjs.extend(weekday)
  dayjs.extend(updateLocale)

  const {
    footerHeight,
    voiceCallActive,
    voiceCallToggleFunction,
    videoCallActive,
    videoCallToggleFunction,
    currentRoom,
    callReceiverUserData
  } = useChat()


  return (
    <Fragment>
      <div className="col-md-12 col-lg-12 col-xl-12">
        <div className="new-chat-window row g-0">
          <div style={{ minHeight: `calc(100vh + ${footerHeight}px)` }}
            className="new-chat-cont-left col-xl-4">

            <ChatLeftHeader />

            <ChatLeftSearch userType={userType} />

            <ChatLeftUsers />
          </div>

          <div
            style={{ minHeight: `calc(100vh + ${footerHeight}px)` }}
            className={`new-chat-cont-right ${currentRoom == null ? 'new-chat-cont-right-empty' : ''} col-xl-8`}>
            <ChatRightHeader />

            <ChatRightBody />

            <ChatRightFooter />
          </div>
        </div>
      </div>
      {voiceCallActive &&
        <CallDialog callType='Voice' open={voiceCallActive} toggleFunction={voiceCallToggleFunction} callReceiverUserData={callReceiverUserData} />
      }
      {videoCallActive &&
        <CallDialog callType='Video' open={videoCallActive} toggleFunction={videoCallToggleFunction} callReceiverUserData={callReceiverUserData} />
      }
    </Fragment>
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

  const { onLeftUserClicked, currentRoomId, weekdays, currentUserId, downloadClick } = useChat();
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
                {decrypt(lastMessage?.['message']!)}
              </div>
              <ReadStatusComponent lastMessage={lastMessage} />
            </span>
            <span style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {
                lastMessage.attachment.length > 0 &&
                lastMessage.attachment.map((attach, i) => {
                  const isBlob = attach.src && attach.src.startsWith("blob:");
                  return (
                    <div className="chat-attachment chat-attachment-left-side" key={`${i} ${index}`} onClick={() => { downloadClick(attach) }} >
                      {/* <img src={attach.isImage ? attach.src : getFileIcon(attach.type)} alt="Attachment" /> */}
                      <img
                        src={isBlob ? attach.src : getFileIcon(attach.type)} // Use icon/placeholder until blob is ready
                        alt="Attachment"
                      />
                      <div className="user-last-chat" style={{ marginLeft: 3, paddingInline: 10 }}>{attach.name}</div>
                    </div>
                  )
                })
              }
            </span>
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
  const { currentRoom } = useChat()

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
                            mesage.message !== null && mesage.attachment.length == 0 ?
                              <ChatRightMessageWithoutAttachment mesage={mesage} />

                              :
                              <ChatRightMessageWithAttachment mesage={mesage} />
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
    inputFileRef,
    handleClickInputFile,
    handleChangeInputFile,
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
              value={chatInputValue.message == null ? '' : chatInputValue.message}
              sx={{
                width: "100%",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "pre-wrap",
              }}
              multiline
              fullWidth
              onChange={(e) => setChatInputValue((prevState) => ({ ...prevState, message: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (e.ctrlKey) {
                    setChatInputValue((prevState) => ({ ...prevState, message: prevState.message + "\n" }))
                  } else {
                    e.preventDefault();
                    onSendButtonClick();
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
                      onClick={(e) => onSendButtonClick()}>
                      <Send sx={{
                        color: currentRoomId == null ? theme.palette.text.disabled : theme.palette.primary.main
                      }} />
                    </IconButton>
                  </InputAdornment>
                ),
                startAdornment: (
                  <InputAdornment position="start">
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <UploadFile
                        sx={{
                          color: currentRoomId == null
                            ? theme.palette.text.disabled
                            : theme.palette.primary.main,
                          cursor: currentRoomId == null ? "unset" : "pointer",
                        }}
                        onClick={() => currentRoomId !== null && handleClickInputFile()}
                      />
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
        marginLeft: 6
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
    setChatInputValue
  } = useChat();

  return (
    <Fragment>
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
        )}
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

export const ChatRightMessageWithoutAttachment: FC<{ mesage: MessageType }> = (({ mesage }) => {

  const { currentRoom, currentUserId, lastRef, lastRefMinusOne } = useChat();
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
            {!isSent && <img src={senderImage} alt="User" className="avatar-img rounded-circle" />}
          </div>
          <div className="media-body flex-grow-1">
            <div className="msg-box" >
              <div >
                <p style={{ marginBottom: 'unset' }}
                  ref={currentRoom.messages[currentRoom.messages.length - 1].message == mesage.message ? lastRef : lastRefMinusOne}>
                  {decrypt(mesage.message!)}
                </p>
                <ul className="chat-msg-info">
                  <li>
                    <div className="chat-time" style={{ position: 'relative' }}>
                      <ReadStatusComponent lastMessage={mesage} />
                      <span>{dayjs(mesage.timestamp).format('HH:mm')}</span>
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

export const ChatRightMessageWithAttachment: FC<{ mesage: MessageType }> = (({ mesage }) => {

  const { currentRoom, lastRef, lastRefMinusOne, currentUserId, downloadClick } = useChat();
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
            {!isSent && <img src={senderImage} alt="User" className="avatar-img rounded-circle" />}
          </div>
          <div className="media-body flex-grow-1">
            <div className="msg-box">
              <div>
                <div className="chat-msg-attachments">
                  {
                    mesage.attachment.map((attach, index) => {
                      const isBlob = attach.src && attach.src.startsWith("blob:");

                      return (
                        <div className="chat-attachment" key={index}>
                          {/* <img src={attach.isImage ? attach.src : getFileIcon(attach.type)} alt="Attachment" /> */}
                          <img
                            src={isBlob ? attach.src : getFileIcon(attach.type)} // Use icon/placeholder until blob is ready
                            alt="Attachment"
                          />
                          <div className="chat-attach-caption">{truncateString(attach.name, 5)}</div>

                          <button
                            className="chat-attach-download"
                            onClick={() => downloadClick(attach)}
                          >
                            <i className="fas fa-download"></i>
                          </button>
                        </div>
                      )
                    })
                  }
                </div>
                <div >
                  <p style={{ marginBottom: 'unset' }}
                    ref={currentRoom.messages[currentRoom.messages.length - 1].message == mesage.message ? lastRef : lastRefMinusOne}>
                    {decrypt(mesage.message!)}
                  </p>
                  <ul className="chat-msg-info">
                    <li>
                      <div className="chat-time" style={{ position: 'relative' }}>
                        <ReadStatusComponent lastMessage={mesage} />
                        <span >{dayjs(mesage.timestamp).format('HH:mm')}</span>
                      </div>
                    </li>
                  </ul>
                </div>
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
  callReceiverUserData: ChatUserType | null;
  callType: "Video" | "Voice"
}

export const CallDialog: FC<CallDialogPropsType> = (({ open, toggleFunction, callReceiverUserData, callType }) => {

  return (
    <BootstrapDialog
      TransitionComponent={Transition}
      onClose={() => {

      }}
      aria-labelledby="edit_invoice_details"
      open={open}>

      <div className="modal-body">
        <div className="call-box incoming-box">
          <div className="call-wrapper">
            <div className="call-inner">
              <div className="call-user">
                <img
                  alt="User Image"
                  src={callReceiverUserData?.profileImage}
                  className="call-avatar"
                />
                <h4>{callReceiverUserData?.roleName == "doctors" && "Dr. "} {callReceiverUserData?.fullName}</h4>
                <span>{callType} call Connecting...</span>
              </div>
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
                <Link href="/voice-call" onClick={(e) => e.preventDefault()} style={{ pointerEvents: "none" }} className=" call-item call-start">
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