import { useChat } from "@/hooks/useChat";
import { useRouter } from "next/router";
import { FC, Fragment } from "react";

import CustomNoRowsOverlay from "../CustomNoRowsOverlay";
import ChatRightBodyDateComponent from "./ChatRightBodyDateComponent";
import ChatRightMessageWithCall from "./ChatRightMessageWithCall";
import ChatRightMessageWithoutAttachment from "./ChatRightMessageWithoutAttachment";
import ChatRightMessageWithAttachment from "./ChatRightMessageWithAttachment";

const ChatRightBody: FC = (() => {
  const { currentRoom } = useChat();
  const router = useRouter();
  const currentRoomId = router.query.roomId;

  return (
    <div className="chat-body">
      <div
        className={
          `chat-scroll 
      ${currentRoomId == null ? 'chat-scroll-empty' : ''}
      `}
      >
        <ul className={`list-unstyled ${currentRoomId == null ? 'chat-scroll-empty' : ''}`}>
          {
            currentRoomId == null ?
              <li >
                <CustomNoRowsOverlay text='No chat' />
              </li> :
              <Fragment>
                {currentRoomId != null &&
                  currentRoom !== null &&
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
export default ChatRightBody