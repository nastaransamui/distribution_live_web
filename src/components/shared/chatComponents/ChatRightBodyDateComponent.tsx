import { useChat } from "@/hooks/useChat";
import dayjs from "dayjs";
import { FC, Fragment } from "react";
import { MessageType } from "../../../../@types/chatTypes";

const ChatRightBodyDateComponent: FC<{ mesage: MessageType, index: number }> = (({ mesage, index }) => {

  const { currentRoom, weekdays } = useChat();

  let messageDate = dayjs(mesage?.timestamp);

  let today = messageDate.isSame(dayjs(), 'day'); // Checks if the message is from today
  let thisWeek = messageDate.isAfter(dayjs().subtract(7, 'days'), 'day'); // Checks if it's within the last 7 days
  let thisYear = messageDate.isSame(dayjs(), 'year'); // Checks if it's in the current year

  let dayName = weekdays[messageDate.weekday()];

  return (
    <Fragment>
      {currentRoom !== null &&
        (
          index === 0 ||
          !dayjs(currentRoom.messages[index - 1]?.timestamp).isSame(mesage?.timestamp, 'day')) &&
        <li className="chat-date" style={{ marginTop: index == 0 ? 10 : 0 }}>
          {
            today ? 'Today'
              : thisWeek ? <>{dayName}</>
                : thisYear ? <>{dayjs(mesage?.timestamp).format('MMM D ')}</>
                  : <>{dayjs(mesage?.timestamp).format('D MMM YY')}</>
          }
        </li>
      }
    </Fragment>
  )
})

export default ChatRightBodyDateComponent;