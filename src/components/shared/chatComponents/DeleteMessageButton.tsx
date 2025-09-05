import { useChat } from "@/hooks/useChat";
import { FC } from "react";
import IconButton from '@mui/material/IconButton'
import DeleteForever from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit'
import { decrypt } from "@/helpers/encryptDecrypt";
import { MessageType } from "../../../../@types/chatTypes";

const DeleteMessageButton: FC<{ deleteType: string | number, mesage?: MessageType }> = (({ deleteType, mesage }) => {
  const { deleteButtonClicked, setDeleteType, setEditChatInputValue, setIsEdit, isEdit } = useChat();
  return (
    <span className='delete-whole-chat' >
      <IconButton
        disableFocusRipple
        disableRipple
        disableTouchRipple
        sx={{ width: '100%', height: '100%', borderRadius: '0px' }}
        onClick={(e) => {
          deleteButtonClicked(e)
          setDeleteType(deleteType)
        }}>
        <DeleteForever sx={{ fontSize: 16, color: 'crimson' }} />
      </IconButton>

      {mesage?.calls.length == 0 &&
        <IconButton
          disableFocusRipple
          disableRipple
          disableTouchRipple
          onClick={(e) => {
            if (mesage) {
              if (!isEdit) {
                setIsEdit(true)
                setEditChatInputValue(() => {
                  return {
                    ...mesage,
                    message: mesage.message ? decrypt(mesage.message) : ""
                  }
                })
              } else {
                setIsEdit(false);
                setTimeout(() => {
                  setIsEdit(true)
                  setEditChatInputValue(() => {
                    return {
                      ...mesage,
                      message: mesage.message ? decrypt(mesage.message) : ""
                    }
                  })
                }, 50);
              }

            }
          }}>
          <EditIcon sx={{ fontSize: 16, color: "secondary.main" }} />
        </IconButton>
      }
    </span>
  )
})

export default DeleteMessageButton;