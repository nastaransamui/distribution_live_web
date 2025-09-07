import { LoadingComponent } from "@/components/DoctorDashboardSections/ScheduleTiming";
import { useChat } from "@/hooks/useChat";
import { FC, Fragment } from "react";
import { ChatLeftHasChat } from "./ChatLeftHasChat";
import ChatLeftNoChat from "./ChatLeftNoChat";


const ChatLeftUsers: FC = (() => {
  const {
    userChatData,
    isLoading,
    currentUserId,
    sortLatestMessage,
    showEmptyRoomInSearchList
  } = useChat()

  return (
    <Fragment>

      <div className="chat-users-list">
        <div className="chat-scroll" >
          {
            isLoading ? <LoadingComponent boxMinHeight="inherit" /> : userChatData.length == 0 &&
              <div className='start-chat-div'>Start chat</div>
          }
          <Fragment>
            {
              sortLatestMessage(userChatData)
                .filter((chat) => chat.messages.length > 0 || chat.createrData.userId === currentUserId || showEmptyRoomInSearchList.includes(chat.roomId))
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

export default ChatLeftUsers;