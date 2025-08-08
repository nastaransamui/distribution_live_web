import { useChat } from "@/hooks/useChat"
import { FC } from "react"
import DoctorsAutoComplete from "../DoctorsAutoComplete"

const ChatLeftSearch: FC<{ userType: "doctors" | "patient" }> = (({ userType }) => {
  const {
    searchInputWidth,
    inputGroupRef,
  } = useChat()
  return (
    <div className="chat-search">
      <div className="input-group" ref={inputGroupRef}>
        <DoctorsAutoComplete
          name='searchString'
          optionFieldName='searchString'
          userType={userType}
          width={searchInputWidth}
        />
      </div>
    </div>
  )
})

export default ChatLeftSearch