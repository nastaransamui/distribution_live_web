/* eslint-disable @next/next/no-img-element */
import { StyledBadge } from "@/components/DoctorDashboardSections/ScheduleTiming";
import { useChat } from "@/hooks/useChat";
import Avatar from "@mui/material/Avatar";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, Fragment, useState } from "react";
import { doctors_profile, patient_profile } from '@/public/assets/imagepath';
import getFileIcon from "./getFileIcon";
import { decrypt } from "@/helpers/encryptDecrypt";
import PhoneMissedIcon from '@mui/icons-material/PhoneMissed';
import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';
import PhoneCallbackIcon from '@mui/icons-material/PhoneCallback';
import ReadStatusComponent from "./ReadStatusComponent";
import DeleteMessageButton from "./DeleteMessageButton";
import { AttachmentType, ChatDataType } from "../../../../@types/chatTypes";
import Lightbox from "yet-another-react-lightbox";

export const ChatLeftHasChat: FC<{ chatData: ChatDataType, index: number }> = (({ chatData, index }) => {
  const router = useRouter();
  const currentRoomId = router.query.roomId;
  const [openImage, setOpenImage] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [Images, setImages] = useState<AttachmentType[]>([]);
  const {
    onLeftUserClicked,
    weekdays,
    currentUserId,
    downloadClick,
    voiceCallToggleFunction,
  } = useChat();
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

  let unreadMessagesLength = chatData.totalUnreadMessage;
  const profileToShow = chatData.createrData.userId == currentUserId ? chatData.receiverData : chatData.createrData


  return (
    <Fragment key={index}>
      <Lightbox
        open={openImage}
        close={() => setOpenImage(false)}
        slides={Images.filter(img => img.isImage).map(img => ({
          src: img.src,
          type: "image", // Ensuring it meets the expected type
        }))}
        index={imageIndex}
      />
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
                      <div className="chat-attachment chat-attachment-left-side" onClick={() => {
                        if (!attach.isImage) {
                          downloadClick({ attach })
                        } else {
                          // Filter only images and find the correct index in the filtered list
                          const imageAttachments = lastMessage.attachment.filter((a) => a.isImage);
                          const newIndex = imageAttachments.findIndex((a) => a.src === attach.src);

                          setImages(imageAttachments);
                          setImageIndex(newIndex);
                          setOpenImage(true);
                        }
                      }} >
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
            {unreadMessagesLength !== 0 && <div className="badge badge-success">{unreadMessagesLength}</div>}
          </div>
        </div>
      </Link>
    </Fragment>
  )
})