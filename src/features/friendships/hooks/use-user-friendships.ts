import { useQuery } from "@tanstack/react-query";

import { FRIENDSHIP_KEYS } from "@/src/features/friendships/hooks/query-key";
import { FriendshipService } from "@/src/features/friendships/services/friendships.services";
import { IGetPaginatedParams } from "@/src/interfaces";

type IUseUserFriendshipsParams = IGetPaginatedParams & {
  userId?: number;
  status?: string;
  enabled?: boolean;
};

export const useUserFriendships = ({
  userId,
  status,
  page,
  size,
  enabled = true,
}: IUseUserFriendshipsParams) =>
  useQuery({
    queryKey: FRIENDSHIP_KEYS.byUser(userId ?? 0, { status }),
    queryFn: () =>
      FriendshipService.getByUser(userId ?? 0, { page, size, status }),
    select: (data) => data.items,
    enabled: enabled && !!userId,
  });
