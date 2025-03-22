import React, { createContext, RefObject, useContext, useEffect, useMemo, useRef, useState } from "react";
import _ from 'lodash'
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import weekday from 'dayjs/plugin/weekday'
import updateLocale from 'dayjs/plugin/updateLocale'
import { useSelector } from "react-redux";
import { AppState } from "@/redux/store";
import { toast } from "react-toastify";
import useScssVar from "./useScssVar";
import { Image_placeholder } from "@/public/assets/imagepath";
export interface AttachmentType {
  src: string;
  name: string;
  isImage: boolean;
  type: string;
  id: string;
}

export interface ChatUserType {
  userId: string;
  fullName: string;
  profileImage: string;
  online: boolean;
  idle: boolean;
  roleName: 'doctors' | 'patient'
}


export interface MessageType {
  senderId: string;
  receiverId: string;
  timestamp: number;
  message: null | string;
  read: boolean;
  attachment: AttachmentType[];
  roomId: string;
}

export interface ChatDataType {
  _id?: string;
  roomId: string;
  participants: string[];
  createrData: ChatUserType,
  receiverData: ChatUserType;
  messages: MessageType[]
}


export const menuOptions = [
  'None',
  'Atria',
  'Callisto',
  'Dione',
  'Ganymede',
];
export const ITEM_HEIGHT = 48;
interface ChatContextType {
  searchInputWidth: number;
  footerHeight: number;
  inputGroupRef: RefObject<HTMLDivElement>;
  chatFooterRef: RefObject<HTMLDivElement>;
  lastRef: RefObject<HTMLDivElement>;
  lastRefMinusOne: RefObject<HTMLDivElement>;
  inputFileRef: RefObject<HTMLInputElement>;
  chatInputValue: MessageType;
  setChatInputValue: React.Dispatch<React.SetStateAction<MessageType>>;
  anchorEl: HTMLElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  isLoading: boolean;
  open: boolean;
  handleClick: (event: React.MouseEvent<HTMLElement>) => void;
  handleClose: () => void;
  makeAllMessageRead: (roomId: string) => void;
  userChatData: ChatDataType[];
  setUserChatData: React.Dispatch<React.SetStateAction<ChatDataType[]>>;
  currentUserId: string | undefined;
  currentRoomId: string | null;
  setCurrentRoomId: React.Dispatch<React.SetStateAction<string | null>>;
  currentRoom: ChatDataType | null;
  setCurrentRoom: React.Dispatch<React.SetStateAction<ChatDataType | null>>;
  weekdays: string[];
  voiceCallActive: boolean;
  voiceCallToggleFunction: () => void;
  videoCallActive: boolean;
  videoCallToggleFunction: () => void;
  sortLatestMessage: (userChatData: ChatDataType[]) => ChatDataType[];
  onLeftUserClicked: (chatData: ChatDataType) => void;
  onSendButtonClick: () => void;
  handleClickInputFile: () => void;
  handleChangeInputFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  callReceiverUserData: ChatUserType | null;
  downloadClick: (attach: AttachmentType) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  dayjs.extend(relativeTime)
  dayjs.extend(duration)
  dayjs.extend(weekday)
  dayjs.extend(updateLocale)
  const { bounce } = useScssVar();
  const inputGroupRef = useRef<HTMLInputElement>(null);
  const chatFooterRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef<HTMLDivElement>(null);
  const lastRefMinusOne = useRef<HTMLDivElement>(null);

  const inputFileRef = useRef<HTMLInputElement>(null)
  const [footerHeight, setFooterHeight] = useState<number>(0)
  const [searchInputWidth, setSearchInputWidth] = useState<number>(0);
  const [voiceCallActive, setVoiceCallActive] = useState<boolean>(false)
  const [videoCallActive, setVideoCallActive] = useState<boolean>(false)
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const [reload, setReload] = useState<boolean>(false)
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null)
  const [currentRoom, setCurrentRoom] = useState<ChatDataType | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [userChatData, setUserChatData] = useState<ChatDataType[]>([])
  const [callReceiverUserData, setCallReceiverUserData] = useState<ChatUserType | null>(null)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  let weekdays: string[] = dayjs.updateLocale('en', {}).weekdays as string[]
  const currentUserId = userProfile?._id


  const voiceCallToggleFunction = () => {
    setVoiceCallActive((prev) => !prev);
    if (currentRoom !== null) {
      const callReceiver = currentRoom.createrData.userId == currentUserId ? currentRoom.receiverData : currentRoom.createrData;
      setCallReceiverUserData((prevState) => {
        if (prevState == null) {
          return callReceiver;
        } else {
          return null;
        }
      })
    }
  };

  const videoCallToggleFunction = () => {
    setVideoCallActive((prev) => !prev);
    if (currentRoom !== null) {
      const callReceiver = currentRoom.createrData.userId == currentUserId ? currentRoom.receiverData : currentRoom.createrData;
      setCallReceiverUserData((prevState) => {
        if (prevState == null) {
          return callReceiver;
        } else {
          return null;
        }
      })
    }
  };


  useEffect(() => {
    let active = true;
    if (active && homeSocket.current) {
      homeSocket.current.emit('getUserRooms', { userId: userProfile?._id })
      homeSocket.current.once('getUserRoomsReturn', async (msg: { status: number, reason?: string, message?: string, userRooms: ChatDataType[] }) => {
        const { status, reason, message } = msg;
        if (status !== 200) {
          toast.error(reason || message || `Error ${status} find Doctor`, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: bounce,
            onClose: () => {
            }
          });
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
            const newState = [...prevState];

            updatedRooms.forEach((room) => {
              const existingRoomIndex = _.findIndex(newState, { _id: room._id });
              if (existingRoomIndex === -1) {
                // Room does not exist, add it
                newState.push(room);
              } else {
                // Room exists, compare receiverData and createrData
                const existingRoom = newState[existingRoomIndex];
                if (
                  !_.isEqual(existingRoom.receiverData, room.receiverData) ||
                  !_.isEqual(existingRoom.createrData, room.createrData) ||
                  !_.isEqual(existingRoom.messages, room.messages)
                ) {
                  // Update the receiverData and createrData if they are different
                  newState[existingRoomIndex] = {
                    ...existingRoom,
                    receiverData: room.receiverData,
                    createrData: room.createrData,
                    messages: room.messages
                  };
                }
              }
            });

            return newState;
          });
          setIsLoading(false)
          homeSocket.current.once(`updateGetUserRooms`, () => {
            setReload(!reload)
          })
        }
      })
    }
    return () => {
      active = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeSocket, reload, userProfile?._id])

  const getChatFile = async (fileId: string, userId: string): Promise<string> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_adminUrl}/api/chat/file/${fileId}?userId=${userId}`
    );
    if (!response.ok) return Image_placeholder;

    const blob = await response.blob();

    return URL.createObjectURL(blob);
  };
  //Resize chatfooter and search
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === inputGroupRef.current) {
          setSearchInputWidth(entry.contentRect.width);
        }
        if (entry.target === chatFooterRef.current) {
          setFooterHeight(entry.contentRect.height);
        }
      }
    });

    if (inputGroupRef.current) resizeObserver.observe(inputGroupRef.current);
    if (chatFooterRef.current) resizeObserver.observe(chatFooterRef.current);

    return () => resizeObserver.disconnect(); // Cleanup on unmount
  }, []);

  const [chatInputValue, setChatInputValue] = useState<MessageType>({
    senderId: currentUserId!,
    receiverId: '',
    timestamp: new Date().getTime(),
    message: null,
    read: false,
    attachment: [],
    roomId: ""
  })


  //Update messages when read from reciever
  useEffect(() => {
    if (!currentRoomId || userChatData.length === 0) return;

    const currentRoomData = userChatData.find((a) => a.roomId === currentRoomId);
    if (!currentRoomData) return;

    if (_.isEqual(currentRoom, currentRoomData)) return; // Prevent duplicate updates

    const lastMessage = currentRoomData.messages[currentRoomData.messages.length - 1];
    if (lastMessage?.receiverId === currentUserId && homeSocket.current) {
      homeSocket.current.emit('makeAllMessageRead', { roomId: currentRoomData.roomId });
    }

    setCurrentRoom((prev) => (_.isEqual(prev, currentRoomData) ? prev : currentRoomData));

  }, [currentRoomId, userChatData, currentUserId]);


  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (currentRoomId !== null) {
      setTimeout(() => {
        lastRef.current?.scrollIntoView({ behavior: 'smooth' });

      }, 100);
    }
  }, [currentRoomId, chatInputValue])

  const sortLatestMessage: (userChatData: ChatDataType[]) => ChatDataType[] = (userChatData) => {
    return [...userChatData].sort((a, b) => {
      let lastMessageA = a?.messages?.length
        ? a.messages.reduce((latest, msg) => (msg.timestamp > latest.timestamp ? msg : latest), a.messages[0])
        : null;

      let lastMessageB = b?.messages?.length
        ? b.messages.reduce((latest, msg) => (msg.timestamp > latest.timestamp ? msg : latest), b.messages[0])
        : null;

      return (lastMessageB?.timestamp || 0) - (lastMessageA?.timestamp || 0);
    });
  };

  const makeAllMessageRead = (roomId: string) => {
    if (roomId !== "" && homeSocket.current) {
      if (currentRoom !== null) {
        if (currentRoom.messages.length !== 0) {
          const lastMessageReciverId = currentRoom.messages[currentRoom.messages.length - 1].receiverId
          if (lastMessageReciverId == currentUserId) {
            homeSocket.current.emit('makeAllMessageRead', { roomId: roomId })
          }
        }
      }
    }
  }


  const onLeftUserClicked = (chatData: ChatDataType) => {
    setCurrentRoomId(() => chatData.roomId)
    makeAllMessageRead(chatData.roomId)
  }


  const onSendButtonClick = () => {
    if (
      (chatInputValue.message == null || chatInputValue.message.trim() === '') &&
      chatInputValue.attachment.length == 0
    ) return;
    const receiverId = currentRoom?.createrData.userId === currentUserId
      ? currentRoom?.receiverData?.userId
      : currentRoom?.createrData?.userId;
    const messageData: MessageType & { attachmentFiles: any[] } = {
      senderId: currentUserId!,
      receiverId: receiverId!,
      timestamp: new Date().getTime(),
      message: chatInputValue.message,
      read: false,
      attachment: chatInputValue.attachment,
      roomId: currentRoomId!,
      attachmentFiles: []
    };

    let uploadPromise = new Promise(async (uploadResolve) => {
      let uploadAttachResolve: any;
      let uploadAttachPromise = new Promise((r) => { uploadAttachResolve = r; });

      if (chatInputValue.attachment.length > 0) {
        let totalFiles = chatInputValue.attachment.length;
        let processedFiles = 0;

        chatInputValue.attachment.forEach((fileData) => {
          fetch(fileData.src) // Convert blob URL to file
            .then(res => res.blob())
            .then(blob => {
              let reader = new FileReader();
              reader.onload = function () {
                let buffer = new Uint8Array(reader.result as ArrayBuffer);

                messageData.attachmentFiles.push({
                  attachFile: buffer,
                  attachFileName: fileData.name,
                  attachFileExtentionNoDot: fileData.name.split('.').pop(),
                  attachFileType: fileData.type || "application/octet-stream",
                });

                processedFiles++;
                if (processedFiles === totalFiles) {
                  uploadAttachResolve(true);
                }
              };
              reader.readAsArrayBuffer(blob);
            });
        });
      } else {
        uploadAttachResolve(true);
      }

      Promise.all([uploadAttachPromise])
        .then(() => uploadResolve(true))
        .catch((_err) => { });
    });

    Promise.resolve(uploadPromise).then(async () => {


      if (homeSocket.current) {
        homeSocket.current.emit("sendMessage", messageData);
        setTimeout(() => {
          lastRefMinusOne.current?.scrollIntoView({ behavior: 'smooth' });

        }, 100);
      }
    });
    setChatInputValue({
      senderId: currentUserId!,
      receiverId: '',
      timestamp: new Date().getTime(),
      message: null,
      read: false,
      attachment: [],
      roomId: ''
    });
  }
  //Join all rooms at entrance
  useEffect(() => {
    if (homeSocket.current) {
      userChatData.map((data) => {
        homeSocket.current.emit("joinRoom", data.roomId);
      })
    }
  }, [userChatData]);

  useEffect(() => {
    let isActive = true;
    if (isActive && homeSocket.current) {
      homeSocket.current.on("receiveMessage", (messageData: MessageType) => {
        // setCurrentRoomId(messageData.roomId)
        setUserChatData((prevState) => {
          let newState = [...prevState];
          const chatIndex = newState.findIndex(chat => chat.roomId === messageData.roomId);
          if (chatIndex !== -1) {
            newState[chatIndex].messages.push(messageData);
          }
          return newState
        })
        if (currentRoomId == messageData.roomId) {
          setTimeout(() => {
            // lastRef.current?.scrollIntoView({ behavior: 'smooth' });
            lastRefMinusOne.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      })
    }
    return () => {
      isActive = false;
    }
  }, [homeSocket])



  const handleClickInputFile = () => {
    if (inputFileRef.current !== null) {
      inputFileRef.current.click()
    }

  }


  const handleChangeInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files: File[] = Array.from(e.target.files);
    const maxFiles = 5;

    setChatInputValue((prevState) => {
      const currentAttachments = prevState.attachment || [];

      // Ensure we don't exceed maxFiles
      if (files.length + currentAttachments.length > maxFiles) {
        toast.error(`You can upload up to ${maxFiles} files`, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return prevState; // Return previous state to prevent changes
      }

      // Filter out files >2MB
      const validFiles = files.filter((file) => file.size <= 2000000);

      if (validFiles.length !== files.length) {
        toast.error(`Some files exceed 2MB size limit`, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }

      return {
        ...prevState,
        attachment: [
          ...currentAttachments, // Preserve previous attachments
          ...validFiles.map((file) => ({
            name: file.name,
            src: URL.createObjectURL(file),
            isImage: file.type.startsWith("image/"),
            type: file.type,
            id: ''
          })),
        ],
      };
    });
  };

  const downloadClick = (attach: AttachmentType) => {
    const link = document.createElement("a");
    link.href = attach.src;
    link.download = attach.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  return (
    <ChatContext.Provider value={{
      searchInputWidth,
      inputGroupRef,
      footerHeight,
      chatFooterRef,
      lastRef,
      lastRefMinusOne,
      chatInputValue,
      setChatInputValue,
      anchorEl,
      setAnchorEl,
      open,
      handleClick,
      handleClose,
      makeAllMessageRead,
      userChatData,
      setUserChatData,
      currentUserId,
      weekdays,
      voiceCallActive,
      voiceCallToggleFunction,
      videoCallActive,
      videoCallToggleFunction,
      isLoading,
      sortLatestMessage,
      currentRoomId,
      setCurrentRoomId,
      currentRoom,
      setCurrentRoom,
      onLeftUserClicked,
      onSendButtonClick,
      inputFileRef,
      handleClickInputFile,
      handleChangeInputFile,
      callReceiverUserData,
      downloadClick
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}