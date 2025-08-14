import { useEffect } from "react";
import { ChatDataType } from "../../../@types/chatTypes";
import makeAllMessageRead from "../useChatHelpers/makeAllMessageRead";

type UseSyncCurrentRoomAndMarkAsReadProps = {
  routerRoomId: string | string[] | undefined;
  homeSocket: any,
  currentRoom: ChatDataType | null,
  currentUserId: string | undefined,
  setCurrentRoomId: React.Dispatch<React.SetStateAction<string | null>>;
}


const useSyncCurrentRoomAndMarkAsRead = ({
  routerRoomId,
  homeSocket,
  currentRoom,
  currentUserId,
  setCurrentRoomId
}: UseSyncCurrentRoomAndMarkAsReadProps) => {
  useEffect(() => {
    if (typeof routerRoomId === 'string') {
      // setCurrentRoomId(routerRoomId);
      makeAllMessageRead({ routerRoomId, homeSocket, currentRoom, currentUserId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoom?.roomId, currentUserId, homeSocket.current, routerRoomId,])
}

export default useSyncCurrentRoomAndMarkAsRead;