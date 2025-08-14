import { ChatDataType, ChatUserType } from "../../../@types/chatTypes";

type VideoCallToggleFunctionProps = {
  currentUserId: string | undefined,
  currentRoom: ChatDataType | null,
  setVideoCallActive: React.Dispatch<React.SetStateAction<boolean>>,
  setCallReceiverUserData: React.Dispatch<React.SetStateAction<ChatUserType | null>>,
}

const videoCallToggleFunction = (
  {
    currentUserId,
    currentRoom,
    setVideoCallActive,
    setCallReceiverUserData,
  }: VideoCallToggleFunctionProps
) => {
  setVideoCallActive((prev) => !prev);
  if (currentRoom !== null) {
    const callReceiver = currentRoom.createrData.userId == currentUserId ? currentRoom.receiverData : currentRoom.createrData;
    setCallReceiverUserData((prevState) => {
      if (prevState == null) {
        return callReceiver;
      } else {
        return null;
      }
    })
  }
};

export default videoCallToggleFunction;