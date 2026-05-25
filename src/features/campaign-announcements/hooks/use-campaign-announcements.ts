import { useQuery } from "@tanstack/react-query";

import { CAMPAIGN_ANNOUNCEMENT_KEYS } from "@/src/features/campaign-announcements/hooks/query-key";
import { CampaignAnnouncementService } from "@/src/features/campaign-announcements/services/campaign-announcements.services";

interface IUseCampaignAnnouncementsParams {
  campaignId?: number;
  enabled?: boolean;
}

export const useCampaignAnnouncements = ({
  campaignId,
  enabled = true,
}: IUseCampaignAnnouncementsParams) =>
  useQuery({
    queryKey: CAMPAIGN_ANNOUNCEMENT_KEYS.byCampaign(campaignId ?? 0),
    queryFn: () => CampaignAnnouncementService.getByCampaign(campaignId ?? 0),
    enabled: enabled && !!campaignId,
  });
