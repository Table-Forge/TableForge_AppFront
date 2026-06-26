import { useQuery } from "@tanstack/react-query";

import { CAMPAIGN_SESSION_KEYS } from "@/src/features/campaign-sessions/hooks/query-key";
import { CampaignSessionService } from "@/src/features/campaign-sessions/services/campaign-sessions.services";

export const useCampaignSession = (id: number, enabled = true) =>
  useQuery({
    queryKey: CAMPAIGN_SESSION_KEYS.detail(id),
    queryFn: () => CampaignSessionService.getById(id),
    enabled: enabled && !isNaN(id) && id > 0,
  });
