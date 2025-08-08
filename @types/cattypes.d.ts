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
  senderId: string;
  receiverId: string;
  senderFcmTokens: string[];
  receiverFcmTokens: string[];
  timestamp: number;
  message: null | string;
  read: boolean;
  attachment: AttachmentType[];
  calls: CallType[];
  roomId: string;
}

export interface ChatDataType {
  _id?: string;
  roomId: string;
  participants: string[];
  createrData: ChatUserType;
  receiverData: ChatUserType;
  messages: MessageType[];
}
