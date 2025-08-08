import { useEffect } from "react";

type UseJoinRoomProps = {
  homeSocket: any,
  routerRoomId: string | string[] | undefined;
}

const useJoinRoom = ({
  homeSocket,
  routerRoomId
}: UseJoinRoomProps) => {
  //Join all rooms at entrance
  useEffect(() => {
    if (homeSocket.current) {
      homeSocket.current.emit("joinRoom", routerRoomId);
    }
  }, [homeSocket, routerRoomId]);
}

export default useJoinRoom;