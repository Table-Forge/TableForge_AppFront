import { useInfiniteQuery } from "@tanstack/react-query";

import { CAMPAIGN_ANNOUNCEMENT_KEYS } from "@/src/features/campaign-announcements/hooks/query-key";
import { CampaignAnnouncementService } from "@/src/features/campaign-announcements/services/campaign-announcements.services";

interface IUseCampaignAnnouncementsParams {
  campaignId?: number;
  enabled?: boolean;
  size?: number;
}

export const useCampaignAnnouncements = ({
  campaignId,
  enabled = true,
  size = 5,
}: IUseCampaignAnnouncementsParams) =>
  useInfiniteQuery({
    queryKey: [...CAMPAIGN_ANNOUNCEMENT_KEYS.byCampaign(campaignId ?? 0), size],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      CampaignAnnouncementService.getByCampaign(campaignId ?? 0, {
        page: Number(pageParam),
        size,
      }),
    enabled: enabled && !!campaignId,
    getNextPageParam: (lastPage) => {
      const page = Number(lastPage?.pagination?.page ?? 1);
      const pageSize = Number(lastPage?.pagination?.size ?? size);
      const filteredItems = Number(lastPage?.pagination?.filteredItems ?? 0);
      const hasNextPage = page * pageSize < filteredItems;

      return hasNextPage ? page + 1 : undefined;
    },
  });
