import { useQuery } from "@tanstack/react-query";

import { CHAT_MESSAGE_KEYS } from "@/src/features/chat-messages/hooks/query-key";
import { ChatMessageService } from "@/src/features/chat-messages/services/chat-messages.services";

interface IUseChatMessagesParams {
  campaignId?: number;
  enabled?: boolean;
}

export const useChatMessages = ({
  campaignId,
  enabled = true,
}: IUseChatMessagesParams) =>
  useQuery({
    queryKey: CHAT_MESSAGE_KEYS.byCampaign(campaignId ?? 0),
    queryFn: () => ChatMessageService.getByCampaign(campaignId ?? 0),
    enabled: enabled && !!campaignId,
  });
