import { UserDoctorProfileTypeValue } from "@/redux/userDoctorProfile";
import { UserPatientProfileTypeValue } from "@/redux/userPatientProfile";

import { useEffect } from "react";
import { toast } from "react-toastify";
import { ChatDataType } from "../../../@types/chatTypes";
import { Image_placeholder } from "@/public/assets/imagepath";
import _ from 'lodash'
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";


type UseFetchUserRoomsProps = {
  homeSocket: any,
  userProfile: UserPatientProfileTypeValue | UserDoctorProfileTypeValue | null,
  setUserChatData: React.Dispatch<React.SetStateAction<ChatDataType[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  routerRoomId: string | string[] | undefined;
  setCurrentRoom: React.Dispatch<React.SetStateAction<ChatDataType | null>>;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  reload: boolean;
  setShowEmptyRoomInSearchList: React.Dispatch<React.SetStateAction<string[]>>;
}

const useFetchUserRooms = ({
  homeSocket,
  userProfile,
  setUserChatData,
  setIsLoading,
  routerRoomId,
  setCurrentRoom,
  setReload,
  reload,
  setShowEmptyRoomInSearchList
}: UseFetchUserRoomsProps) => {
  const router = useRouter();
  useEffect(() => {
    if (
      !homeSocket?.current ||
      userProfile?._id == null ||
      userProfile?._id == undefined ||
      !getCookie('user_id') ||
      !router.asPath.includes('chat')
    ) return;
    const socket = homeSocket.current;

    socket.emit('getUserRooms', { userId: userProfile?._id })
    socket.once('getUserRoomsReturn', async (msg: { status: number, reason?: string, message?: string, userRooms: ChatDataType[] }) => {
      const { status, reason, message } = msg;
      if (status !== 200) {
        toast.error(reason || message || `Error ${status} get User Rooms`);
      } else {
        const { userRooms } = msg;
        // Process attachments before updating the state to get private images
        const updatedRooms = await Promise.all(userRooms.map(async (room) => {
          const updatedMessages = await Promise.all(room.messages.map(async (msg) => ({
            ...msg,
            attachment: await Promise.all(
              msg.attachment.map(async (a) => ({
                ...a,
                src: a.id !== "" ? await getChatFile(a.id, userProfile?._id!) : a.src,
              }))
            ),
          })));

          return { ...room, messages: updatedMessages };
        }));
        setUserChatData((prevState) => {
          const newState = updatedRooms.map((room) => {
            const existingRoom = prevState.find((r) => r._id === room._id);

            if (!existingRoom) {
              return room; // New room
            }

            // Update room if data has changed
            if (
              !_.isEqual(existingRoom.receiverData, room.receiverData) ||
              !_.isEqual(existingRoom.createrData, room.createrData) ||
              !_.isEqual(existingRoom.messages, room.messages) ||
              !_.isEqual(existingRoom.totalUnreadMessage, room.totalUnreadMessage)
            ) {
              // setTimeout(() => {
              //   lastRef.current?.scrollIntoView({ behavior: 'smooth' });

              // }, 100);
              return {
                ...existingRoom,
                receiverData: room.receiverData,
                createrData: room.createrData,
                messages: room.messages,
                totalUnreadMessage: room.totalUnreadMessage
              };
            }

            return existingRoom; // No changes, return the existing room
          });
          const finalResult = newState.filter((room) => updatedRooms.some((r) => r._id === room._id))

          // Ensure removed rooms are also removed from the state
          return finalResult;
        });
        setIsLoading(false)
        socket.once(`updateGetUserRooms`, (data: string | object) => {
          if (typeof data !== 'string') {
            if (routerRoomId == data['delete' as keyof typeof data]) {

              const { roomId, ...restQuery } = router.query

              router.replace(
                {
                  pathname: router.pathname,
                  query: restQuery,
                },
                undefined,
                { shallow: true }
              )
              setCurrentRoom(() => null);
            }
          }
          setReload(!reload)
        })
      }
    })

    return () => {
      socket.off("getUserRooms");
      socket.off("getUserRoomsReturn");
      socket.off("updateGetUserRooms");
      setShowEmptyRoomInSearchList([])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeSocket, reload, router.pathname, routerRoomId, userProfile?._id])
}

export default useFetchUserRooms;

export const getChatFile = async (fileId: string, userId: string): Promise<string> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_adminUrl}/api/chat/file/${fileId}?userId=${userId}`
  );
  if (!response.ok) return Image_placeholder;

  const blob = await response.blob();

  return URL.createObjectURL(blob);
};