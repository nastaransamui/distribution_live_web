/* eslint-disable @next/next/no-img-element */
import { useChat } from "@/hooks/useChat";
import dayjs from "dayjs";
import { FC, Fragment } from "react";
import DeleteMessageButton from "./DeleteMessageButton";
import Avatar from "@mui/material/Avatar";
import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';
import PhoneCallbackIcon from '@mui/icons-material/PhoneCallback';
import { doctors_profile, patient_profile } from '@/public/assets/imagepath';
import ReadStatusComponent from "./ReadStatusComponent";
import PhoneMissedIcon from '@mui/icons-material/PhoneMissed';
import { MessageType } from "../../../../@types/chatTypes";


const ChatRightMessageWithCall: FC<{ mesage: MessageType, index: number }> = (({ mesage, index }) => {

  const { currentRoom, currentUserId, lastRef, voiceCallToggleFunction } = useChat();
  let isSent = mesage.senderId == currentUserId;
  const isVoiceCall = mesage.calls[0]?.isVoiceCall
  const isMissedCall = mesage.calls[0]?.isMissedCall
  const isAnswered = mesage.calls[0]?.isAnswered
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
  if (isMissedCall) {
    formattedDuration = 'Missed Call';
  }
  else if (!isAnswered) {
    formattedDuration = 'No Answer';
  } else if (totalSeconds < 60) {
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

export default ChatRightMessageWithCall;