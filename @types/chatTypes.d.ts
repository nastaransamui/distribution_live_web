export interface AttachmentType {
  src: string;
  name: string;
  isImage: boolean;
  type: string;
  id: string;
}
export interface CallType {
  isVoiceCall: boolean;
  isVideoCall: boolean;
  startTimeStamp: number;
  finishTimeStamp: number | null;
  isMissedCall: boolean;
  isRejected: boolean;
  isAnswered: boolean;
}

export interface ChatUserType {
  userId: string;
  fullName: string;
  profileImage: string;
  online: boolean;
  idle: boolean;
  roleName: "doctors" | "patient";
  fcmTokens: string[];
  gender: string;
}

export interface MessageType {
  attachment: AttachmentType[];
  calls: CallType[];
  message: null | string;
  read: boolean;
  receiverFcmTokens: string[];
  receiverId: string;
  roomId: string;
  senderFcmTokens: string[];
  senderId: string;
  timestamp: number;
}

export interface ChatDataType {
  createrData: ChatUserType;
  messages: MessageType[];
  participants: string[];
  receiverData: ChatUserType;
  totalUnreadMessage?: number;
  roomId: string;
  _id?: string;
}
export interface IncomingCallType {
  callerData: ChatUserType;
  callerId: string;
  messageData: MessageType;
  offer: RTCSessionDescriptionInit;
  receiverData: ChatUserType;
  receiverId: string;
  roomId: string;
}
