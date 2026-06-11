import { TOptions } from "@/src/interfaces";
import { CampaignService } from "@/src/features/campaigns/services/campaigns.services";
import { useQuery } from "@tanstack/react-query";
import { CAMPAIGN_KEYS } from "../query-key";

const ENUM_GC_TIME = 1000 * 60 * 60 * 24;

interface IUseCampaignRelationshipEnumProps {
  enabled?: boolean;
  filterAllowed?: boolean;
}

export const useCampaignRelationshipEnum = ({
  enabled = true,
  filterAllowed = true,
}: IUseCampaignRelationshipEnumProps = {}) => {
  const relationshipEnumQuery = useQuery({
    queryKey: CAMPAIGN_KEYS.relationshipEnum(),
    queryFn: () => CampaignService.getRelationshipEnum(),
    select: (data) =>
      data
        .filter((item) => (filterAllowed ? item.allowSelect : true))
        .map((item) => ({
          name: item.name,
          value: item.value,
        })),
    enabled,
    staleTime: Infinity,
    gcTime: ENUM_GC_TIME,
    refetchOnWindowFocus: false,
  });

  return {
    relationshipEnum: (relationshipEnumQuery.data ?? []) as TOptions[],
    isLoadingRelationshipEnum: relationshipEnumQuery.isPending,
    relationshipEnumQuery,
  };
};
