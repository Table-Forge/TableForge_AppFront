import { TOptions } from "@/src/interfaces";
import { CampaignService } from "@/src/features/campaigns/services/campaigns.services";
import { useQuery } from "@tanstack/react-query";
import { CAMPAIGN_KEYS } from "../query-key";

const ENUM_GC_TIME = 1000 * 60 * 60 * 24;

interface IUseCampaignStatusEnumProps {
  enabled?: boolean;
}

export const useCampaignStatusEnum = ({
  enabled = true,
}: IUseCampaignStatusEnumProps = {}) => {
  const campaignStatusEnumQuery = useQuery({
    queryKey: CAMPAIGN_KEYS.statusEnum(),
    queryFn: () => CampaignService.getStatusEnum(),
    select: (data) =>
      data.map((item) => ({
        name: item.name,
        value: item.value,
      })),
    enabled,
    staleTime: Infinity,
    gcTime: ENUM_GC_TIME,
    refetchOnWindowFocus: false,
  });

  return {
    campaignStatusEnum: (campaignStatusEnumQuery.data ?? []) as TOptions[],
    isLoadingCampaignStatusEnum: campaignStatusEnumQuery.isPending,
    campaignStatusEnumQuery,
  };
};
