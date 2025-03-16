import React, { createContext, RefObject, useContext, useEffect, useMemo, useRef, useState } from "react";
import { IMG02, IMG03, IMG04, PatientImg1, PatientImg2, PatientImg4, PatientImg5, IMG09, IMG010, PatientImg3, patient_profile } from '@/public/assets/imagepath';
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import weekday from 'dayjs/plugin/weekday'
import updateLocale from 'dayjs/plugin/updateLocale'
export interface AttachmentType {
  src: string;
  name: string;
}


export interface MessageType {
  senderId: string;
  reciverId: string;
  time: Date;
  message: null | string;
  read: boolean;
  attachment: string | AttachmentType[];
}

export interface ChatDataType {
  userType: 'doctors' | 'patient';
  userData: {
    userId: string;
    name: string;
    image: string;
    online: boolean;
    idle: boolean;
  };
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
  ref: RefObject<HTMLDivElement>;
  ref1: RefObject<HTMLDivElement>;
  allCurrentUserMessage: MessageType[];
  setAllCurrentUserMessage: React.Dispatch<React.SetStateAction<MessageType[]>>;
  chatInputValue: string;
  setChatInputValue: React.Dispatch<React.SetStateAction<string>>;
  activeChat: number | null;
  setActiveChat: React.Dispatch<React.SetStateAction<number | null>>;
  anchorEl: HTMLElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  open: boolean;
  handleClick: (event: React.MouseEvent<HTMLElement>) => void;
  handleClose: () => void;
  userChatData: ChatDataType[];
  currentUserId: string;
  weekdays: string[];
  voiceCallActive: boolean;
  voiceCallToggleFunction: () => void;
  videoCallActive: boolean;
  videoCallToggleFunction: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  dayjs.extend(relativeTime)
  dayjs.extend(duration)
  dayjs.extend(weekday)
  dayjs.extend(updateLocale)
  const inputGroupRef = useRef<HTMLDivElement>(null);
  const chatFooterRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const ref1 = useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = useState<number>(0)
  const [searchInputWidth, setSearchInputWidth] = useState<number>(0);
  const [voiceCallActive, setVoiceCallActive] = useState<boolean>(false)
  const [videoCallActive, setVideoCallActive] = useState<boolean>(false)

  const voiceCallToggleFunction = () => {
    setVoiceCallActive((prev) => !prev);
  };

  const videoCallToggleFunction = () => {
    setVideoCallActive((prev) => !prev);
  };


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

  const [allCurrentUserMessage, setAllCurrentUserMessage] = useState<MessageType[]>([])
  const [chatInputValue, setChatInputValue] = useState<string>("")


  const [activeChat, setActiveChat] = useState<number | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const userChatData: ChatDataType[] = useMemo(() => {
    // return []
    return [
      {
        userType: 'doctors',
        userData: {
          userId: '2',
          name: 'Megan Bird',
          image: IMG02,
          online: true,
          idle: true,
        },
        messages: [
          {
            senderId: '2',
            reciverId: '1',
            message: 'I\'ll call you later',
            time: new Date('2023-08-22 09:20:13.577+07:00'),
            read: true,
            attachment: ''
          },
        ]
      },
      {
        userType: 'doctors',
        userData: {
          userId: '3',
          name: 'Alvin Boykin',
          image: IMG03,
          online: false,
          idle: false,
        },
        messages: [
          {
            senderId: '1',
            reciverId: '3',
            message: 'Hello. What can I do for you?',
            time: new Date('2023-08-19T17:30:13.577+07:00'),
            read: false,
            attachment: ''
          },
          {
            senderId: '3',
            reciverId: '1',
            message: 'I\'m just looking around. Will you tell me something about yourself?',
            time: new Date('2023-08-18T10:20:13.577+07:00'),
            read: false,
            attachment: [
              {
                src: IMG010,
                name: 'placeholder.webp'
              },
              {
                src: IMG09,
                name: 'placeholder.webp'
              },
            ]
          },
          {
            senderId: '3',
            reciverId: '1',
            message: 'Are you there? That time!',
            time: new Date('Mon Aug 17 2023 08:39:16'),
            read: false,
            attachment: ''
          },
          {
            senderId: '1',
            reciverId: '3',
            message: 'Where?',
            time: new Date('2023-08-19T17:25:13.577+07:00'),
            read: false,
            attachment: ''
          },
          {
            senderId: '1',
            reciverId: '3',
            message: 'OK, my name is Limingqiang. I like singing, playing basketballand so on.',
            time: new Date('2023-08-19T19:20:13.577+07:00'),
            read: false,
            attachment: [
              {
                src: IMG010,
                name: 'placeholder.webp'
              },
            ]
          },
          {
            senderId: '3',
            reciverId: '1',
            message: `You wait for notice.
            Consectetuorem ipsum dolor sit?
            Ok?`,
            time: new Date('2023-08-19T17:20:13.577+07:00'),
            read: false,
            attachment: ''
          },
          {
            senderId: '3',
            reciverId: '1',
            message: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
            time: new Date('2023-08-19T17:20:13.577+07:00'),
            read: false,
            attachment: ''
          },
          {
            senderId: '1',
            reciverId: '3',
            message: `Lorem ipsum dollar sit`,
            time: new Date('2023-08-19T17:20:13.577+07:00'),
            read: false,
            attachment: ''
          },
        ]
      },
      {
        userType: 'patient',
        userData: {
          userId: '4',
          name: 'Kelsi Schultz',
          image: IMG04,
          online: true,
          idle: true,
        },
        messages: [
          {
            senderId: '4',
            reciverId: '3',
            message: 'Thats very good UI design',
            time: new Date('Mon Aug 21 2023 17:39:16'),
            read: true,
            attachment: ''
          },
        ]
      },
      {
        userType: 'patient',
        userData: {
          userId: '5',
          name: 'Sherri McCarthy',
          image: IMG04,
          online: false,
          idle: false,
        },
        messages: [
          {
            senderId: '5',
            reciverId: '3',
            message: 'Yesterday i completed the task',
            time: new Date('Tue Aug 23 2023 12:31:16'),
            read: true,
            attachment: ''
          },
        ]
      },
      {
        userType: 'patient',
        userData: {
          userId: '6',
          name: 'Roger Loyd',
          image: PatientImg1,
          online: false,
          idle: false,
        },
        messages: [
          {
            senderId: '',
            reciverId: '3',
            message: 'What is the major functionality?',
            time: new Date('Tue Aug 17 2023 02:39:16'),
            read: true,
            attachment: ''
          },
        ]
      },
      {
        userType: 'patient',
        userData: {
          userId: '7',
          name: 'Francis Giordano',
          image: PatientImg2,
          online: false,
          idle: false,
        },
        messages: [
          {
            senderId: '',
            reciverId: '3',
            message: 'This has allowed me to showcase not only my technical skills',
            time: new Date('Tue Aug 22 2023 11:39:16'),
            read: true,
            attachment: ''
          },
        ]
      },
      {
        userType: 'patient',
        userData: {
          userId: '8',
          name: 'Kate Mason',
          image: PatientImg4,
          online: true,
          idle: true,
        },
        messages: [
          {
            senderId: '',
            reciverId: '3',
            message: 'Let\'s talk briefly in the evening.',
            time: new Date('Tue Jul 10 2023 10:59:16'),
            read: true,
            attachment: ''
          },
        ]
      },
      {
        userType: 'patient',
        userData: {
          userId: '9',
          name: 'Glenn Johnson',
          image: PatientImg5,
          online: true,
          idle: false,
        },
        messages: [
          {
            senderId: '',
            reciverId: '3',
            message: 'Do you have any collections? If so, what of?',
            time: new Date('Tue Aug 18 2023 13:29:16'),
            read: true,
            attachment: ''
          },
        ]
      },
      {
        userType: 'doctors',
        userData: {
          userId: '10',
          name: 'Megan Smith',
          image: PatientImg3,
          online: true,
          idle: false,
        },
        messages: [
          {
            senderId: '',
            reciverId: '3',
            message: 'Connect the two modules with in 1 day.',
            time: new Date('Tue Aug 12 2023 08:39:16'),
            read: true,
            attachment: ''
          },
        ]
      },
      {
        userType: 'doctors',
        userData: {
          userId: '11',
          name: 'Monty Smith',
          image: PatientImg2,
          online: true,
          idle: false,
        },
        messages: [
          {
            senderId: '',
            reciverId: '3',
            message: 'Connect the two modules with in 1 day.',
            time: new Date('Tue Jul 12 2022 23:39:16'),
            read: true,
            attachment: ''
          },
        ]
      },

    ]
  }, [])


  useEffect(() => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth' });

    }, 100);
  }, [activeChat, userChatData])

  let weekdays: string[] = dayjs.updateLocale('en', {}).weekdays as string[]
  const currentUserId = '1'
  return (
    <ChatContext.Provider value={{
      searchInputWidth,
      inputGroupRef,
      footerHeight,
      chatFooterRef,
      ref,
      ref1,
      allCurrentUserMessage,
      setAllCurrentUserMessage,
      chatInputValue,
      setChatInputValue,
      activeChat,
      setActiveChat,
      anchorEl,
      setAnchorEl,
      open,
      handleClick,
      handleClose,
      userChatData,
      currentUserId,
      weekdays,
      voiceCallActive,
      voiceCallToggleFunction,
      videoCallActive,
      videoCallToggleFunction,
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