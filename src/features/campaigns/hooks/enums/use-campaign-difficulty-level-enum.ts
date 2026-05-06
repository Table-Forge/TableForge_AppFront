import { TOptions } from "@/src/interfaces";
import { CampaignService } from "@/src/features/campaigns/services/campaigns.services";
import { useQuery } from "@tanstack/react-query";
import { CAMPAIGN_KEYS } from "../query-key";

const ENUM_GC_TIME = 1000 * 60 * 60 * 24;

interface IUseCampaignDifficultyLevelEnumProps {
  enabled?: boolean;
}

export const useCampaignDifficultyLevelEnum = ({
  enabled = true,
}: IUseCampaignDifficultyLevelEnumProps = {}) => {
  const difficultyLevelEnumQuery = useQuery({
    queryKey: CAMPAIGN_KEYS.difficultyLevelEnum(),
    queryFn: () => CampaignService.getDifficultyLevelEnum(),
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
    difficultyLevelEnum: (difficultyLevelEnumQuery.data ?? []) as TOptions[],
    isLoadingDifficultyLevelEnum: difficultyLevelEnumQuery.isPending,
    difficultyLevelEnumQuery,
  };
};
