import { useInfiniteQuery } from "@tanstack/react-query";
import { CAMPAIGN_KEYS } from "./query-key";
import { CampaignService } from "../services/campaigns.services";

const DEFAULT_LIMIT = 20;

interface IUseInfinitePlayerCampaignsParams {
  size?: number;
  search?: string;
  filter?: string[];
  userId?: number;
  enabled?: boolean;
}

export function useInfinitePlayerCampaigns({
  size = DEFAULT_LIMIT,
  search = "",
  filter = [],
  userId,
  enabled = true,
}: IUseInfinitePlayerCampaignsParams = {}) {
  const normalizedSearch = search.trim();

  return useInfiniteQuery({
    queryKey: [...CAMPAIGN_KEYS.player(), size, normalizedSearch, filter, userId],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      CampaignService.searchPlayerCampaigns({
        page: Number(pageParam),
        size,
        search: normalizedSearch || undefined,
        filter: filter.length ? filter : undefined,
        userId,
      }),
    enabled,
    getNextPageParam: (lastPage) => {
      const page = Number(lastPage?.pagination?.page ?? 1);
      const pageSize = Number(lastPage?.pagination?.size ?? size);
      const filteredItems = Number(lastPage?.pagination?.filteredItems ?? 0);
      const hasNextPage = page * pageSize < filteredItems;

      return hasNextPage ? page + 1 : undefined;
    },
  });
}

export { DEFAULT_LIMIT as PLAYER_CAMPAIGNS_PAGE_SIZE };
