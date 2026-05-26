import { TOptions } from "@/src/interfaces";
import { CampaignMemberService } from "@/src/features/campaign-members/services/campaign-members.services";
import { useQuery } from "@tanstack/react-query";
import { CAMPAIGN_MEMBER_KEYS } from "../query-key";

const ENUM_GC_TIME = 1000 * 60 * 60 * 24;

interface IUseCampaignMemberRoleEnumProps {
  enabled?: boolean;
}

export const useCampaignMemberRoleEnum = ({
  enabled = true,
}: IUseCampaignMemberRoleEnumProps = {}) => {
  const campaignMemberRoleEnumQuery = useQuery({
    queryKey: CAMPAIGN_MEMBER_KEYS.roleEnum(),
    queryFn: () => CampaignMemberService.getRoleEnum(),
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
    campaignMemberRoleEnum: (campaignMemberRoleEnumQuery.data ??
      []) as TOptions[],
    isLoadingCampaignMemberRoleEnum: campaignMemberRoleEnumQuery.isPending,
    campaignMemberRoleEnumQuery,
  };
};
