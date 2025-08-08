import { IconButton } from "@mui/material";
import { FC } from "react";
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

const MobileShowSearchButton: FC = (() => {

  const onClick = () => {

    const chatLeft = document.querySelector(".new-chat-cont-left");
    if (chatLeft) {
      chatLeft.classList.toggle("new-chat-cont-left-active");
    }
    const chatScrol = document.querySelector('.chat-scroll');
    if (chatScrol) {
      chatScrol.classList.toggle('chat-scroll-active')
    }
    const chatUserList = document.querySelector('.chat-users-list');
    if (chatUserList) {
      chatUserList.classList.toggle('chat-users-list-active')
    }

  }
  return (
    <IconButton
      disableFocusRipple
      disableRipple
      disableTouchRipple
      sx={{
        position: 'absolute',
        right: 4,
        top: 14
      }}
      onClick={onClick}>
      <ManageSearchIcon sx={{ color: "secondary.main" }} />
    </IconButton>
  )
})

export default MobileShowSearchButton;