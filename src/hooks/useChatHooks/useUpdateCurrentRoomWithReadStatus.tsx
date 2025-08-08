import { useEffect } from "react";
import { ChatDataType } from "../../../@types/cattypes";
import _ from 'lodash';


type UseUpdateCurrentRoomWithReadStatusProps = {
  homeSocket: any;
  currentRoomId: string | null;
  userChatData: ChatDataType[];
  currentRoom: ChatDataType | null;
  currentUserId: string | undefined;
  setCurrentRoom: React.Dispatch<React.SetStateAction<ChatDataType | null>>;
}


const useUpdateCurrentRoomWithReadStatus = ({
  homeSocket,
  currentRoomId,
  userChatData,
  currentRoom,
  currentUserId,
  setCurrentRoom
}: UseUpdateCurrentRoomWithReadStatusProps
) => {

  useEffect(() => {
    if (!currentRoomId || userChatData.length === 0) return;

    const currentRoomData = userChatData.find((a) => a.roomId === currentRoomId);

    if (!currentRoomData) return;

    if (_.isEqual(currentRoom, currentRoomData)) return; // Prevent duplicate updates

    const lastMessage = currentRoomData.messages[currentRoomData.messages.length - 1];
    if (lastMessage) {
      if (!lastMessage.read) {
        if (lastMessage?.receiverId === currentUserId) {
          if (!lastMessage.read && homeSocket.current) {
            homeSocket.current.emit('makeOneMessageRead', lastMessage);
          }
        }

      }
    }
    setCurrentRoom((prev) => (_.isEqual(prev, currentRoomData) ? prev : currentRoomData));


  }, [currentRoomId, userChatData, currentUserId, homeSocket, currentRoom, setCurrentRoom]);


}

export default useUpdateCurrentRoomWithReadStatus