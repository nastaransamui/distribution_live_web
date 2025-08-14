
/* eslint-disable @next/next/no-img-element */
import { StyledBadge } from "@/components/DoctorDashboardSections/ScheduleTiming";
import { useChat } from "@/hooks/useChat";
import { doctors_profile, patient_profile } from "@/public/assets/imagepath";
import Avatar from "@mui/material/Avatar";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, Fragment } from "react";
import DeleteMessageButton from "./DeleteMessageButton";
import { ChatDataType } from "../../../../@types/chatTypes";

export const ChatLeftNoChat: FC<{ chatData: ChatDataType, index: number }> = (({ chatData, index }) => {
  const router = useRouter();
  const currentRoomId = router.query.roomId;
  const { onLeftUserClicked, currentUserId } = useChat();
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
              <img src={profileToShow.roleName == 'doctors' ? doctors_profile : patient_profile} alt="" className="avatar" />
            </Avatar>
          </StyledBadge>
        </div>
        <div className="media-body flex-grow-1">
          <div>
            <div className="user-name">
              {profileToShow.roleName == "doctors" ? "Dr. " : `${profileToShow.gender == '' ? '' : `${profileToShow.gender}. `}`}
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
export default ChatLeftNoChat;