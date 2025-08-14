import { ChatDataType } from "../../../@types/chatTypes";
import { NextRouter } from "next/router";

type OnLeftUserClickedProps = {
  chatData: ChatDataType,
  router: NextRouter,
  minWidth768: boolean
}

const onLeftUserClicked = (
  {
    chatData,
    router,
    minWidth768,
  }: OnLeftUserClickedProps
) => {
  const roomId = chatData.roomId;

  router.push(
    {
      pathname: router.pathname,
      query: { ...router.query, roomId },
    },
    undefined,
    { shallow: true }
  );

  if (!minWidth768) {
    document
      .querySelector(".new-chat-cont-left")
      ?.classList.remove("new-chat-cont-left-active");
    document
      .querySelector(".chat-scroll")
      ?.classList.remove("chat-scroll-active");
    document
      .querySelector(".chat-users-list")
      ?.classList.remove("chat-users-list-active");
  }
};


export default onLeftUserClicked;
