
import { FC, Fragment } from "react";
import { useTheme } from '@mui/material'
import { MessageType } from "../../../../@types/cattypes";

const ReadStatusComponent: FC<{ lastMessage: MessageType }> = (({ lastMessage }) => {

  const theme = useTheme();

  return (
    <Fragment>
      <i className="fa-solid fa-check" style={{
        fontSize: 8,
        color: lastMessage?.read ? theme.palette.primary.main : theme.palette.text.disabled,
        marginRight: 6,
        // marginLeft: 6
      }}>

      </i>
      {
        lastMessage?.read && <i className="fa-solid fa-check" style={{
          fontSize: 8,
          marginLeft: -10,
          marginRight: 3,
          color: theme.palette.primary.main
        }}></i>
      }

    </Fragment>
  )
})

export default ReadStatusComponent;