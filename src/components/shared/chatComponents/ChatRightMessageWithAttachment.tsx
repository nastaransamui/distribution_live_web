/* eslint-disable @next/next/no-img-element */
import { truncateString } from "@/components/DoctorsSections/CheckOut/Invoice";
import { decrypt } from "@/helpers/encryptDecrypt";
import { useChat } from "@/hooks/useChat";
import { doctors_profile, patient_profile } from "@/public/assets/imagepath";
import dayjs from "dayjs";
import { FC, useState, Fragment } from "react";
import DeleteMessageButton from "./DeleteMessageButton";
import getFileIcon from "./getFileIcon";
import ReadStatusComponent from "./ReadStatusComponent";
import Lightbox from "yet-another-react-lightbox";
import { MessageType, AttachmentType } from "../../../../@types/cattypes";

const ChatRightMessageWithAttachment: FC<{ mesage: MessageType, index: number }> = (({ mesage, index }) => {

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
                                downloadClick({ attach });
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

export default ChatRightMessageWithAttachment