/* eslint-disable @next/next/no-img-element */
import { useChat } from "@/hooks/useChat";
import DeleteForever from "@mui/icons-material/DeleteForever";
import { IconButton } from "@mui/material";
import { FC, useState, useEffect, Fragment } from "react";
import getFileIcon from "./getFileIcon";
import { useTheme } from '@mui/material'

const ChatRightFooterShowAttachment: FC = (() => {
  const {
    chatInputValue,
    setChatInputValue,
    isEdit,
    editChatInputValue,
  } = useChat();
  const theme = useTheme()
  const [cloneEditMessage, setCloneEditMessage] = useState<string>("")
  useEffect(() => {
    if (isEdit) {
      if (cloneEditMessage === "") {
        setCloneEditMessage(editChatInputValue.message!)
      }
    } else {
      setCloneEditMessage('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editChatInputValue, isEdit])
  return (
    <Fragment>
      {
        isEdit ?
          <>
            {
              editChatInputValue.message !== "" && (
                <div className='chat-right-footer-show-attachment-div' style={{ minWidth: '100%' }}>
                  <div className='' style={{
                    width: "100%",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "pre-wrap",
                    border: `1px solid ${theme.palette.primary.main}`,
                    borderRadius: "5px",
                    padding: 10,
                    display: "block",
                    overflow: "hidden",
                  }}>
                    {cloneEditMessage}
                  </div>
                </div>
              )
            }
          </> :
          <>
            {
              chatInputValue.attachment?.length > 0 && (
                <div className='chat-right-footer-show-attachment-div'>
                  {chatInputValue.attachment.map((file, index) => (
                    <div key={index} className='chat-right-footer-show-attachment-inner-div'>
                      <img
                        src={file.isImage ? file.src : getFileIcon(file.type)}
                        alt={file.name}
                        className='chat-right-footer-show-attachment-img'
                        onClick={() => window.open(file.src, "_blank")}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: "absolute",
                          top: "-5px",
                          right: "-5px",
                          color: "white",
                          width: "18px",
                          height: "18px",
                          padding: "2px",
                        }}
                        onClick={() => {
                          setChatInputValue((prevState) => ({
                            ...prevState,
                            attachment: prevState.attachment.filter((_, i) => i !== index),
                          }));
                        }}
                      >
                        <DeleteForever fontSize="small" sx={{ color: 'crimson' }} />
                      </IconButton>
                    </div>
                  ))}
                </div>
              )
            }
          </>
      }
    </Fragment>
  )
})

export default ChatRightFooterShowAttachment;