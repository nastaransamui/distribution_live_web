import React, { createContext, RefObject, useContext, useEffect, MouseEvent, useRef, useState, useMemo } from "react";
import _ from 'lodash'
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import weekday from 'dayjs/plugin/weekday'
import updateLocale from 'dayjs/plugin/updateLocale'
import { useSelector } from "react-redux";
import { AppState } from "@/redux/store";
import useScssVar from "./useScssVar";
import { Image_placeholder } from "@/public/assets/imagepath";
import useMediaQuery from '@mui/material/useMediaQuery';
// import { useAudioRecorder } from "react-audio-voice-recorder";
import { AttachmentType, ChatDataType, ChatUserType, IncomingCallType, MessageType } from "../../@types/chatTypes";

import sortLatestMessage from "./useChatHelpers/sortLatestMessage";
import rawOnLeftUserClicked from "./useChatHelpers/onLeftUserClicked";
import rawOnSendButtonClick from './useChatHelpers/onSendButtonClick'
import rawOnCancelEdit from './useChatHelpers/onCancelEdit'
import rawOnEditButtonClick from './useChatHelpers/onEditButtonClick'
import rawHandleClickInputFile from './useChatHelpers/handleClickInputFile'
import rawHandleChangeInputFile from './useChatHelpers/handleChangeInputFile'
import rawDeleteButtonClicked from './useChatHelpers/deleteButtonClicked'
import rawDeleteSubmited from './useChatHelpers/deleteSubmited';
import rawVoiceCallToggleFunction from './useChatHelpers/voiceCallToggleFunction'
import rawAcceptVoiceCall from './useChatHelpers/acceptVoiceCall'
import rawVideoCallToggleFunction from './useChatHelpers/videoCallToggleFunction'
import rawClearRecording from './useChatHelpers/clearRecording'
import rawHandleDownload from './useChatHelpers/handleDownload'
import downloadClick from './useChatHelpers/downloadClick'
import useResizeObserver from "./useChatHooks/useResizeObserver";
import useChatAssets from "./useChatHooks/useChatAssets";
import useFetchUserRooms, { getChatFile } from "./useChatHooks/useFetchUserRooms";
import useSyncCurrentRoomAndMarkAsRead from "./useChatHooks/useSyncCurrentRoomAndMarkAsRead";
import useJoinRoom from "./useChatHooks/useJoinRoom";
import useUpdateCurrentRoomWithReadStatus from "./useChatHooks/useUpdateCurrentRoomWithReadStatus";
import useReceiveVoiceCall from "./useChatHooks/useReceiveVoiceCall";
import useReceiveMessage from "./useChatHooks/useReceiveMessage";
import useIceCandidate from "./useChatHooks/useIceCandidate";
import useEndVoiceCallHandler from "./useChatHooks/useEndVoiceCallHandler";
import useConfirmCallHandler from "./useChatHooks/useConfirmCallHandler";
import useAudioBlobUpdate from "./useChatHooks/useAudioBlobUpdate";
import { useRouter } from "next/router";
import DeleteForever from "@mui/icons-material/DeleteForever";
import { toast } from "react-toastify";
import makeAllMessageRead from "./useChatHelpers/makeAllMessageRead";



export const menuOptions = [
  {
    text: 'Delete Room',
    icon: DeleteForever,
    iconColor: 'crimson',
    callBack: 'deleteRoom',
  }
];
export const ITEM_HEIGHT = 48;
interface ChatContextType {
  searchInputWidth: number;
  footerHeight: number;
  inputGroupRef: RefObject<HTMLDivElement>;
  chatFooterRef: RefObject<HTMLDivElement>;
  lastRef: RefObject<HTMLDivElement>;
  inputFileRef: RefObject<HTMLInputElement>;
  chatInputValue: MessageType;
  setChatInputValue: React.Dispatch<React.SetStateAction<MessageType>>;
  editChatInputValue: MessageType;
  setEditChatInputValue: React.Dispatch<React.SetStateAction<MessageType>>;
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  anchorEl: HTMLElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  isLoading: boolean;
  open: boolean;
  handleClick: (event: React.MouseEvent<HTMLElement>) => void;
  handleClose: ({ callBack }: { callBack: string }) => void;
  userChatData: ChatDataType[];
  setUserChatData: React.Dispatch<React.SetStateAction<ChatDataType[]>>;
  currentUserId: string | undefined;
  currentRoomId: string | null;
  setCurrentRoomId: React.Dispatch<React.SetStateAction<string | null>>;
  currentRoom: ChatDataType | null;
  setCurrentRoom: React.Dispatch<React.SetStateAction<ChatDataType | null>>;
  weekdays: string[];
  voiceCallActive: boolean;
  setVoiceCallActive: React.Dispatch<React.SetStateAction<boolean>>;
  voiceCallToggleFunction: () => void;
  videoCallActive: boolean;
  videoCallToggleFunction: () => void;
  sortLatestMessage: (userChatData: ChatDataType[]) => ChatDataType[];
  onLeftUserClicked: (chatData: ChatDataType) => void;
  onSendButtonClick: () => void;
  onEditButtonClick: () => void;
  onCancelEdit: () => void;
  handleClickInputFile: () => void;
  handleChangeInputFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  callReceiverUserData: ChatUserType | null;
  setCallReceiverUserData: React.Dispatch<React.SetStateAction<ChatUserType | null>>
  downloadClick: ({ attach }: { attach: AttachmentType }) => void;
  deleteButtonClicked: (e: MouseEvent<HTMLButtonElement>) => void;
  deleteConfirmationShow: boolean;
  setDeleteConfirmationShow: React.Dispatch<React.SetStateAction<boolean>>;
  deleteSubmited: () => void;
  setDeleteType: React.Dispatch<React.SetStateAction<string | number | null>>;
  showSnackBar: { show: boolean, text: string };
  setShowSnakBar: React.Dispatch<React.SetStateAction<{ show: boolean, text: string }>>;
  acceptVoiceCall: () => void;
  incomingCall: IncomingCallType | null;
  setIncomingCall: React.Dispatch<React.SetStateAction<IncomingCallType | null
  >>;
  minWidth768: boolean;
  fakeMediaRecorder: MediaRecorder | null;

  setAudioBlob: React.Dispatch<React.SetStateAction<Blob | null>>;
  audioBlob: Blob | null;
  // startRecording: () => void;
  // stopRecording: () => void;
  // togglePauseResume: () => void;
  // recordingBlob?: Blob;
  // isRecording: boolean;
  // isPaused: boolean;
  // recordingTime: number;
  mediaRecorder?: MediaRecorder;
  clearRecording: () => void;
  handleDownload: () => void;
  isAnswerable: boolean;
  setIsAnswerable: React.Dispatch<React.SetStateAction<boolean>>;
  endCall: boolean;
  setEndCall: React.Dispatch<React.SetStateAction<boolean>>;
  showEmptyRoomInSearchList: string[];
  setShowEmptyRoomInSearchList: React.Dispatch<React.SetStateAction<string[]>>;
  makeCallAudioRef: React.MutableRefObject<HTMLAudioElement | null>
  missedCallTimeout: React.MutableRefObject<NodeJS.Timeout | null>
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
  const minWidth768 = useMediaQuery('(min-width:768px)');
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [footerHeight, setFooterHeight] = useState<number>(0)
  const [searchInputWidth, setSearchInputWidth] = useState<number>(0);
  const [voiceCallActive, setVoiceCallActive] = useState<boolean>(false);
  const [videoCallActive, setVideoCallActive] = useState<boolean>(false);
  const [deleteConfirmationShow, setDeleteConfirmationShow] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false)
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null)
  const [currentRoom, setCurrentRoom] = useState<ChatDataType | null>(null)
  const [showEmptyRoomInSearchList, setShowEmptyRoomInSearchList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [userChatData, setUserChatData] = useState<ChatDataType[]>([])
  const [callReceiverUserData, setCallReceiverUserData] = useState<ChatUserType | null>(null)
  const [deleteType, setDeleteType] = useState<string | number | null>(null);
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;
  const currentUserId = userProfile?._id
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const [showSnackBar, setShowSnakBar] = useState<{ show: boolean, text: string }>({ show: false, text: '' })
  const [incomingCall, setIncomingCall] = useState<IncomingCallType | null>(null);
  const [fakeMediaRecorder, setFakeMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [chatInputValue, setChatInputValue] = useState<MessageType>({
    senderId: currentUserId!,
    receiverId: '',
    senderFcmTokens: userProfile?.fcmTokens!,
    receiverFcmTokens: [],
    timestamp: new Date().getTime(),
    message: null,
    read: false,
    attachment: [],
    calls: [],
    roomId: ""
  })
  const [editChatInputValue, setEditChatInputValue] = useState<MessageType>({
    senderId: currentUserId!,
    receiverId: '',
    senderFcmTokens: userProfile?.fcmTokens!,
    receiverFcmTokens: [],
    timestamp: new Date().getTime(),
    message: null,
    read: false,
    attachment: [],
    calls: [],
    roomId: ""
  })
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  let weekdays: string[] = dayjs.updateLocale('en', {}).weekdays as string[]
  const sendMessageAudioRef: React.MutableRefObject<HTMLAudioElement | null> = useRef(null);
  const makeCallAudioRef: React.MutableRefObject<HTMLAudioElement | null> = useRef(null);
  const reciveMessageAudioRef: React.MutableRefObject<HTMLAudioElement | null> = useRef(null);
  const missedCallTimeout: React.MutableRefObject<NodeJS.Timeout | null> = useRef(null);
  const userChatDataRef: React.MutableRefObject<ChatDataType[]> = useRef(userChatData);
  const audioBlobRef: React.MutableRefObject<Blob | null> = useRef(null);

  const router = useRouter();
  const routerRoomId: string | string[] | undefined = router.query.roomId
  const [endCall, setEndCall] = useState<boolean>(false);
  const [isAnswerable, setIsAnswerable] = useState<boolean>(false);
  // let {
  //   startRecording,
  //   stopRecording,
  //   togglePauseResume,
  //   recordingBlob,
  //   isRecording,
  //   isPaused,
  //   recordingTime,
  //   mediaRecorder
  // } = useAudioRecorder();

  // Declare peerConnection and remoteStream with types
  const peerConnection: React.MutableRefObject<RTCPeerConnection | null> = useRef(null); // Type it correctly as RTCPeerConnection or null
  const localStream: React.MutableRefObject<MediaStream | null> = useRef(null); // MediaStream or null for the local stream
  const remoteStream: React.MutableRefObject<MediaStream | null> = useRef(null); // MediaStream or null for the remote stream



  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = ({ callBack }: { callBack: string }) => {
    setAnchorEl(null);
    switch (callBack) {
      case 'deleteRoom':
        setDeleteConfirmationShow(true)
        if (currentRoom !== null) {
          setDeleteType(currentRoom?.roomId as string)
        }
        break;

      default:
        break;
    }
  };


  const onLeftUserClicked = (chatData: ChatDataType) =>
    rawOnLeftUserClicked({ chatData, router, minWidth768 });


  const onSendButtonClick = () =>
    rawOnSendButtonClick({
      chatInputValue,
      currentRoom,
      currentUserId,
      currentRoomId,
      homeSocket,
      lastRef,
      setChatInputValue
    });

  useSyncCurrentRoomAndMarkAsRead({
    routerRoomId,
    homeSocket,
    currentRoom,
    currentUserId,
    setCurrentRoomId
  })
  const onCancelEdit = () =>
    rawOnCancelEdit({ setIsEdit, currentRoom, currentUserId, setEditChatInputValue });


  const onEditButtonClick = () =>
    rawOnEditButtonClick({
      editChatInputValue,
      currentRoom,
      currentUserId,
      currentRoomId,
      homeSocket,
      setIsEdit,
      setEditChatInputValue
    });

  const handleClickInputFile = () =>
    rawHandleClickInputFile({ inputFileRef })

  const handleChangeInputFile = (event: React.ChangeEvent<HTMLInputElement>) =>
    rawHandleChangeInputFile({ event, setChatInputValue });


  const deleteButtonClicked = (event: MouseEvent<HTMLButtonElement>) =>
    rawDeleteButtonClicked({ event, setDeleteConfirmationShow })

  const deleteSubmited = () =>
    rawDeleteSubmited({
      homeSocket,
      deleteType,
      currentRoomId: router.query.roomId as string,
      currentUserId,
      setDeleteConfirmationShow,
      setDeleteType,
      bounce,
      setShowSnakBar,
    });


  const voiceCallToggleFunction = () =>
    rawVoiceCallToggleFunction({
      voiceCallActive,
      peerConnection,
      localStream,
      remoteStream,
      homeSocket,
      currentUserId,
      currentRoom,
      currentRoomId,
      setChatInputValue,
      setCallReceiverUserData,
      setVoiceCallActive,
      makeCallAudioRef,
      chatInputValue,
      setFakeMediaRecorder,
      setEndCall,
      endCall,
      setIsAnswerable,
      // isRecording,
      // stopRecording,
      setShowSnakBar,
      setAudioBlob,
      audioBlobRef,
      incomingCall,
      setIncomingCall
    })
  const acceptVoiceCall = () =>
    rawAcceptVoiceCall({
      setIsAnswerable,
      incomingCall,
      homeSocket,
      missedCallTimeout,
      localStream,
      remoteStream,
      peerConnection,
      currentUserId,
      currentRoom,
      currentRoomId,
      chatInputValue,
      setChatInputValue,
      setFakeMediaRecorder,
      fakeMediaRecorder,
      setIncomingCall,
      makeCallAudioRef,
      setEndCall,
    })

  const videoCallToggleFunction = () =>
    rawVideoCallToggleFunction({
      currentUserId,
      currentRoom,
      setVideoCallActive,
      setCallReceiverUserData,
    });

  const clearRecording = () =>
    rawClearRecording({ setAudioBlob, audioBlobRef });

  const handleDownload = () =>
    rawHandleDownload({ audioBlobRef, setAudioBlob });

  // Hooks

  useResizeObserver({
    inputGroupRef,
    chatFooterRef,
    setSearchInputWidth,
    setFooterHeight,
  })

  useChatAssets({
    reciveMessageAudioRef,
    makeCallAudioRef,
    sendMessageAudioRef,
  })

  // useSyncCurrentRoomAndMarkAsRead({
  //   routerRoomId,
  //   homeSocket,
  //   currentRoom,
  //   currentUserId,
  //   setCurrentRoomId
  // })


  useEffect(() => {
    userChatDataRef.current = userChatData; // Keep ref updated
  }, [userChatData]);

  //Fetch left side data
  useFetchUserRooms({
    homeSocket,
    userProfile,
    setUserChatData,
    setIsLoading,
    routerRoomId,
    setCurrentRoom,
    setReload,
    reload,
    setShowEmptyRoomInSearchList
  })


  useJoinRoom({ homeSocket, routerRoomId })



  useUpdateCurrentRoomWithReadStatus({
    homeSocket,
    currentRoomId,
    userChatData,
    currentRoom,
    currentUserId,
    setCurrentRoom
  })

  useReceiveVoiceCall({
    homeSocket,
    setIncomingCall,
    setVoiceCallActive,
    setIsAnswerable,
    setChatInputValue,
    currentUserId,
    userChatData,
    setCallReceiverUserData,
    makeCallAudioRef,
    missedCallTimeout,
    setEndCall
  })

  useReceiveMessage({
    homeSocket,
    currentUserId,
    userChatDataRef,
    reciveMessageAudioRef,
    sendMessageAudioRef,
    setCurrentRoom,
    lastRef
  })

  useIceCandidate({ homeSocket, peerConnection })
  useEndVoiceCallHandler({
    homeSocket,
    chatInputValue,
    setChatInputValue,
    setFakeMediaRecorder,
    setEndCall,
    endCall,
    makeCallAudioRef,
    peerConnection,
    localStream,
    remoteStream,
    setVoiceCallActive,
    setCallReceiverUserData,
    setIsAnswerable,
    // isRecording,
    // stopRecording,
    setShowSnakBar,
    setAudioBlob,
    audioBlobRef,
    incomingCall
  })

  useConfirmCallHandler({
    homeSocket,
    peerConnection,
    setIsAnswerable,
    setChatInputValue,
    makeCallAudioRef,
    setFakeMediaRecorder,
    setEndCall
  })
  // Ensure audioBlob updates when recordingBlob is available
  useAudioBlobUpdate({
    // isRecording,
    setAudioBlob,
    // recordingBlob,
    audioBlobRef,
  })



  useEffect(() => {
    if (typeof routerRoomId !== 'string' || !homeSocket?.current) return;
    const getSingleRoomByIdWithUpdate = async (data: { status: number, reason?: string, message?: string, userRoom: ChatDataType }) => {

      const { status, userRoom } = data;
      if (status !== 200) {
        toast.error(data.reason || data.message || `Error ${status} getSingleRoomByIdWithUpdate`);
      }

      // If room doesn't exist anymore (deleted), clear state and bail
      if (!userRoom) {
        setCurrentRoom(null);
        return;
      }
      // Process attachments for all messages in this single room
      const updatedMessages = await Promise.all(
        userRoom.messages.map(async (msg) => ({
          ...msg,
          attachment: await Promise.all(
            msg.attachment.map(async (a) => ({
              ...a,
              src:
                a.id && a.id !== ""
                  ? await getChatFile(a.id, userProfile?._id!)
                  : a.src,
            }))
          ),
        }))
      );
      const updatedRoom: ChatDataType = {
        ...userRoom,
        messages: updatedMessages,
      };
      // ✅ Only update if the room actually changed
      setCurrentRoom((prev) => {
        if (!prev || !_.isEqual(prev, updatedRoom)) {
          return updatedRoom;
        }
        return prev; // No change → skip re-render
      });

      // if (typeof routerRoomId === "string") {
      //   makeAllMessageRead({ routerRoomId, homeSocket, currentRoom, currentUserId });
      // }
    }
    const socket = homeSocket.current;
    socket.emit("getSingleRoomById", { userId: currentUserId, roomId: routerRoomId });

    socket.once("getSingleRoomByIdReturn", getSingleRoomByIdWithUpdate);

    return () => {
      socket.off("getSingleRoomByIdReturn");
      socket.off("updateGetSingleRoomById");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId, homeSocket, routerRoomId, reload]);

  useEffect(() => {
    if (!homeSocket?.current) return;
    const socket = homeSocket.current;
    socket.once('updateGetSingleRoomById', () => {
      setReload(() => !reload);
    });


    return () => {
      socket.off("updateGetSingleRoomById");
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // just for call if room is not active and click on call button in left chat
  useEffect(() => {
    if (typeof window != 'undefined') {
      if (currentRoom !== null) {
        if (currentRoom?.roomId == localStorage.getItem('queuedCallRoomId')) {
          voiceCallToggleFunction();
          localStorage.removeItem('queuedCallRoomId')
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoom, currentRoom?.roomId])

  return (
    <ChatContext.Provider value={{
      searchInputWidth,
      inputGroupRef,
      footerHeight,
      chatFooterRef,
      lastRef,
      chatInputValue,
      setChatInputValue,
      anchorEl,
      setAnchorEl,
      open,
      handleClick,
      handleClose,
      userChatData,
      setUserChatData,
      currentUserId,
      weekdays,
      voiceCallActive,
      voiceCallToggleFunction,
      videoCallActive,
      setVoiceCallActive,
      videoCallToggleFunction,
      isLoading,
      sortLatestMessage,
      currentRoomId,
      showEmptyRoomInSearchList,
      setShowEmptyRoomInSearchList,
      setCurrentRoomId,
      currentRoom,
      setCurrentRoom,
      onLeftUserClicked,
      onSendButtonClick,
      onEditButtonClick,
      onCancelEdit,
      inputFileRef,
      handleClickInputFile,
      handleChangeInputFile,
      callReceiverUserData,
      setCallReceiverUserData,
      downloadClick,
      deleteButtonClicked,
      deleteConfirmationShow,
      setDeleteConfirmationShow,
      deleteSubmited,
      setDeleteType,
      showSnackBar,
      setShowSnakBar,
      editChatInputValue,
      setEditChatInputValue,
      isEdit,
      setIsEdit,
      acceptVoiceCall,
      incomingCall,
      setIncomingCall,
      minWidth768,
      fakeMediaRecorder,
      isAnswerable,
      setIsAnswerable,
      endCall,
      setEndCall,
      setAudioBlob,
      audioBlob,
      // recordingTime,
      // startRecording,
      // isRecording,
      // stopRecording,
      // togglePauseResume,
      // isPaused,
      clearRecording,
      handleDownload,
      makeCallAudioRef,
      missedCallTimeout
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
