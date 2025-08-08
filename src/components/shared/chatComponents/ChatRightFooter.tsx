import { useChat } from "@/hooks/useChat";
import { useTheme } from '@mui/material'
import DeleteForever from '@mui/icons-material/DeleteForever'
import Send from '@mui/icons-material/Send'
import UploadFile from '@mui/icons-material/UploadFile';
import EditIcon from '@mui/icons-material/Edit'
import { FormControl, TextField, InputAdornment, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import { FC, Fragment } from "react";
import ChatRightFooterShowAttachment from "./ChatRightFooterShowAttachment";

const ChatRightFooter: FC = (() => {
  const router = useRouter();
  const currentRoomId = router.query.roomId;
  const {
    chatInputValue,
    chatFooterRef,
    setChatInputValue,
    onSendButtonClick,
    onEditButtonClick,
    inputFileRef,
    handleClickInputFile,
    handleChangeInputFile,
    isEdit,
    setEditChatInputValue,
    editChatInputValue,
    onCancelEdit
  } = useChat()
  const theme = useTheme()

  return (
    <Fragment>
      <div className="chat-footer" ref={chatFooterRef}>
        <div className="input-group">

          <ChatRightFooterShowAttachment />

          <FormControl sx={{ width: "100%" }}>

            <TextField
              id="chat-input"
              required
              placeholder={currentRoomId == null ? "Select user to chat" : "Type something"}
              disabled={currentRoomId == null}
              value={
                isEdit ?
                  editChatInputValue.message == null ? "" : editChatInputValue.message :
                  chatInputValue.message == null ? '' : chatInputValue.message
              }
              sx={{
                width: "100%",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "pre-wrap",
              }}
              multiline
              fullWidth
              onChange={(e) => {
                if (isEdit) {
                  setEditChatInputValue((prevState) => ({ ...prevState, message: e.target.value }))
                } else {
                  setChatInputValue((prevState) => ({ ...prevState, message: e.target.value }))
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (e.ctrlKey) {
                    if (isEdit) {
                      setEditChatInputValue((prevState) => ({ ...prevState, message: prevState.message + "\n" }))
                    } else {
                      setChatInputValue((prevState) => ({ ...prevState, message: prevState.message + "\n" }))
                    }
                  } else {
                    e.preventDefault();
                    if (isEdit) {
                      onEditButtonClick();
                    } else {
                      onSendButtonClick();
                    }
                  }
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      disableFocusRipple
                      disableRipple
                      disableTouchRipple
                      disabled={currentRoomId == null}
                      onClick={(e) => {
                        if (isEdit) {
                          onEditButtonClick();
                        } else {
                          onSendButtonClick();
                        }
                      }}>
                      {
                        isEdit ?
                          <EditIcon sx={{
                            color: currentRoomId == null ? theme.palette.text.disabled : theme.palette.primary.main
                          }} /> :
                          <Send sx={{
                            color: currentRoomId == null ? theme.palette.text.disabled : theme.palette.primary.main
                          }} />
                      }
                    </IconButton>
                  </InputAdornment>
                ),
                startAdornment: (
                  <InputAdornment position="start">
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {
                        isEdit ?

                          <DeleteForever sx={{ color: 'crimson', cursor: 'pointer' }} onClick={(e) => {
                            onCancelEdit()
                          }} />
                          :
                          <IconButton
                            disableFocusRipple
                            disableRipple
                            disableTouchRipple
                            sx={{ paddingLeft: 0 }}
                            disabled={currentRoomId == null || chatInputValue.attachment.length === 5}
                            onClick={() => currentRoomId !== null && handleClickInputFile()}
                          >
                            <UploadFile

                              sx={{
                                color: currentRoomId == null || chatInputValue.attachment.length === 5
                                  ? theme.palette.text.disabled
                                  : theme.palette.primary.main,
                                cursor: currentRoomId == null ? "unset" : "pointer",
                              }}

                            />
                          </IconButton>
                      }
                    </div>
                    <input
                      type="file"
                      id="profile"
                      accept="
                        image/png,
                        image/jpg,
                        image/jpeg,
                        application/msword,
                        application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                        application/pdf,
                        text/plain,
                        application/vnd.ms-excel,
                        application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                        application/vnd.ms-powerpoint,
                        application/vnd.openxmlformats-officedocument.presentationml.presentation,
                        application/vnd.oasis.opendocument.text,
                        application/vnd.oasis.opendocument.spreadsheet,
                        application/vnd.oasis.opendocument.presentation,
                        application/zip,
                        application/x-rar-compressed,
                        application/x-7z-compressed
                      "
                      ref={inputFileRef}
                      multiple
                      onChange={handleChangeInputFile}
                      style={{ display: "none" }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>

        </div>
      </div>
    </Fragment>
  )
})

export default ChatRightFooter;