import { ChatDataType } from "../../../@types/chatTypes"

type MakeAllMessageReedProps = {
  routerRoomId: string,
  homeSocket: any,
  currentRoom: ChatDataType | null,
  currentUserId: string | undefined
}

const makeAllMessageRead = (
  {
    routerRoomId,
    homeSocket,
    currentRoom,
    currentUserId,
  }: MakeAllMessageReedProps
) => {
  if (routerRoomId !== "" && homeSocket.current) {
    if (currentRoom !== null) {
      if (currentRoom.messages.length !== 0) {
        const lastMessageReciverId = currentRoom.messages[currentRoom.messages.length - 1].receiverId
        homeSocket.current.emit('makeAllMessageRead', { roomId: routerRoomId, userId: currentUserId })

      }
    }
  }
}

export default makeAllMessageRead