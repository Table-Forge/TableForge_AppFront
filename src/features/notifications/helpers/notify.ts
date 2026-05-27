import { NotificationService } from "@/src/features/notifications/services/notifications.services";

type NotificationType =
  | "CampaignInvite"
  | "JoinRequestApproved"
  | "JoinRequestRejected"
  | "NewChatMessage"
  | "NewAnnouncement"
  | "FriendshipRequest"
  | "FriendshipAccepted"
  | "System";

type SendArgs = {
  userId: number;
  type: NotificationType;
  message: string;
  relatedLink?: string;
};

const send = async ({ userId, type, message, relatedLink }: SendArgs) => {
  try {
    await NotificationService.create({ userId, type, message, relatedLink });
  } catch {
    // best-effort: não interrompe o fluxo principal
  }
};

const sendMany = async (userIds: number[], args: Omit<SendArgs, "userId">) => {
  const unique = Array.from(new Set(userIds.filter(Boolean)));
  await Promise.all(unique.map((userId) => send({ ...args, userId })));
};

export const notify = {
  joinRequestReceived: ({
    masterIds,
    requesterName,
    campaignTitle,
    joinRequestId,
  }: {
    masterIds: number[];
    requesterName: string;
    campaignTitle: string;
    joinRequestId: number;
  }) =>
    sendMany(masterIds, {
      type: "System",
      message: `${requesterName} solicitou entrada na campanha "${campaignTitle}".`,
      relatedLink: `/join-request/${joinRequestId}`,
    }),

  joinRequestApproved: ({
    requesterId,
    campaignId,
    campaignTitle,
  }: {
    requesterId: number;
    campaignId: number;
    campaignTitle: string;
  }) =>
    send({
      userId: requesterId,
      type: "JoinRequestApproved",
      message: `Sua solicitação para a campanha "${campaignTitle}" foi aprovada.`,
      relatedLink: `/campaign/${campaignId}`,
    }),

  joinRequestRejected: ({
    requesterId,
    campaignId,
    campaignTitle,
  }: {
    requesterId: number;
    campaignId: number;
    campaignTitle: string;
  }) =>
    send({
      userId: requesterId,
      type: "JoinRequestRejected",
      message: `Sua solicitação para a campanha "${campaignTitle}" foi rejeitada.`,
      relatedLink: `/campaign/${campaignId}`,
    }),

  newAnnouncement: ({
    memberIds,
    campaignId,
    campaignTitle,
    announcementTitle,
  }: {
    memberIds: number[];
    campaignId: number;
    campaignTitle: string;
    announcementTitle: string;
  }) =>
    sendMany(memberIds, {
      type: "NewAnnouncement",
      message: `Novo anúncio em "${campaignTitle}": ${announcementTitle}`,
      relatedLink: `/campaign/${campaignId}`,
    }),

  newSession: ({
    memberIds,
    campaignId,
    campaignTitle,
    sessionTitle,
    sessionDate,
  }: {
    memberIds: number[];
    campaignId: number;
    campaignTitle: string;
    sessionTitle: string;
    sessionDate: string;
  }) =>
    sendMany(memberIds, {
      type: "NewAnnouncement",
      message: `Nova sessão em "${campaignTitle}": ${sessionTitle} (${sessionDate}).`,
      relatedLink: `/campaign/${campaignId}`,
    }),

  newChatMessage: ({
    memberIds,
    campaignId,
    campaignTitle,
    senderName,
  }: {
    memberIds: number[];
    campaignId: number;
    campaignTitle: string;
    senderName: string;
  }) =>
    sendMany(memberIds, {
      type: "NewChatMessage",
      message: `${senderName} enviou uma mensagem em "${campaignTitle}".`,
      relatedLink: `/campaign-chat/${campaignId}`,
    }),

  friendshipRequest: ({
    receiverId,
    requesterName,
    requesterId,
  }: {
    receiverId: number;
    requesterName: string;
    requesterId: number;
  }) =>
    send({
      userId: receiverId,
      type: "FriendshipRequest",
      message: `${requesterName} enviou uma solicitação de amizade.`,
      relatedLink: `/user/${requesterId}`,
    }),

  friendshipAccepted: ({
    requesterId,
    accepterName,
    accepterId,
  }: {
    requesterId: number;
    accepterName: string;
    accepterId: number;
  }) =>
    send({
      userId: requesterId,
      type: "FriendshipAccepted",
      message: `${accepterName} aceitou sua solicitação de amizade.`,
      relatedLink: `/user/${accepterId}`,
    }),
};
