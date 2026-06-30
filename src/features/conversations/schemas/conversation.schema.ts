export enum ConversationType {
  Direct = 1,
  Group = 2,
}

export enum ConversationMessageType {
  Text = 1,
  DiceRoll = 2,
  System = 3,
  Attachment = 4,
}

export enum ConversationParticipantRole {
  Member = 1,
  Admin = 2,
}

export interface IConversationParticipant {
  userId: number;
  username: string;
  nickname: string;
  avatarUrl: string | null;
  role: ConversationParticipantRole;
  joinedAt: string;
}

export interface IConversation {
  id: number;
  name: string;
  type: ConversationType;
  createdAt: string;
  unreadMessagesCount: number;
  lastMessageContent: string | null;
  lastMessageAt: string | null;
  participants: IConversationParticipant[];
}

export interface IConversationMessageStatus {
  userId: number;
  username: string;
  nickname: string;
  isReceived: boolean;
  isRead: boolean;
  receivedAt: string | null;
  readAt: string | null;
}

export interface IConversationMessage {
  id: number;
  conversationId: number;
  senderId: number;
  senderUsername: string;
  senderNickname: string;
  senderAvatarUrl: string | null;
  type: ConversationMessageType;
  content: string;
  metadata: string | null;
  createdAt: string;
  statuses: IConversationMessageStatus[];
  isOptimistic?: boolean;
}

export interface IConversationMessageCreate {
  type: ConversationMessageType;
  content: string;
  metadata?: string | null;
}

export interface IConversationMessageStatusUpdateDto {
  conversationId: number;
  userId: number;
  isReceived: boolean;
  isRead: boolean;
}

export interface ICreateDirectConversationDto {
  type: ConversationType;
  otherUserId: number;
}
