
/* eslint-disable @next/next/no-img-element */
import { ITEM_HEIGHT, menuOptions, useChat } from "@/hooks/useChat";
import { useRouter } from "next/router";
import { FC, Fragment } from "react";
import { useTheme } from '@mui/material'
import { StyledBadge } from "@/components/DoctorDashboardSections/ScheduleTiming";
import Avatar from '@mui/material/Avatar'
import { doctors_profile } from "@/public/assets/imagepath";
import Link from "next/link";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const ChatRightHeader: FC = (() => {

  const router = useRouter();
  const currentRoomId = router.query.roomId;
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
          currentRoomId && currentRoomId !== null ?
            <>
              {
                currentRoom !== null &&
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
                </div>
              }
            </> :
            <div className="media d-flex" style={{ color: theme.palette.text.color }}>
              Select user to continue chat or search for new chat.
            </div>
        }

        <div className="chat-options" style={{ justifyContent: currentRoomId && currentRoomId !== null ? 'space-between' : 'flex-end' }}>
          {currentRoomId && currentRoomId !== null &&
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
export default ChatRightHeader;