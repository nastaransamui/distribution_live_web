import { toast, ToastTransition } from "react-toastify";

type DeleteSubmitedProps = {
  homeSocket: any,
  deleteType: string | number | null,
  currentRoomId: string | null,
  currentUserId: string | undefined,
  setDeleteConfirmationShow: React.Dispatch<React.SetStateAction<boolean>>,
  setDeleteType: React.Dispatch<React.SetStateAction<string | number | null>>,
  bounce: ToastTransition,
  setShowSnakBar: React.Dispatch<React.SetStateAction<{ show: boolean, text: string }>>
}

const deleteSubmited = (
  {
    homeSocket,
    deleteType,
    currentRoomId,
    currentUserId,
    setDeleteConfirmationShow,
    setDeleteType,
    bounce,
    setShowSnakBar,
  }: DeleteSubmitedProps
) => {

  if (homeSocket.current && deleteType !== null) {
    const roomId = typeof deleteType == "string" ? deleteType : currentRoomId;
    const serverDeleteType = typeof deleteType == "string" ? "room" : "message"
    homeSocket.current.emit('deleteChat',
      {
        deleteType: serverDeleteType,
        currentUserId,
        roomId,
        valueToSearch: deleteType
      })
    homeSocket.current.once("deleteChatReturn", async (msg: { status: number, reason?: string, message?: string }) => {
      const { status, reason, message } = msg;
      if (status !== 200) {

        setDeleteConfirmationShow(false)
        setDeleteType(null)
        toast.error(reason || message || `Error ${status} find Doctor`, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          transition: bounce,
          onClose: () => {
          }
        });
      } else {
        // clear current room id on delete
        if (serverDeleteType == "room" && roomId === currentRoomId) {
          // setCurrentRoomId(null);
          // setCurrentRoom(null)
        }
        setDeleteConfirmationShow(false)
        setDeleteType(null)
        setShowSnakBar(() => {
          return {
            text: message || "Delete Succefully",
            show: true,
          }
        })
      }
    })
  }
}

export default deleteSubmited;