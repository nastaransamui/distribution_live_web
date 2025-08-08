/* eslint-disable @next/next/no-img-element */
import { decrypt } from "@/helpers/encryptDecrypt";
import { useChat } from "@/hooks/useChat";
import { doctors_profile, patient_profile } from "@/public/assets/imagepath";
import dayjs from "dayjs";
import { FC, Fragment } from "react";
import DeleteMessageButton from "./DeleteMessageButton";
import ReadStatusComponent from "./ReadStatusComponent";
import { MessageType } from "../../../../@types/cattypes";

const ChatRightMessageWithoutAttachment: FC<{ mesage: MessageType, index: number }> = (({ mesage, index }) => {

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

export default ChatRightMessageWithoutAttachment;