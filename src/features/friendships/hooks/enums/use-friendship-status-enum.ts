import { FriendshipService } from "@/src/features/friendships/services/friendships.services";
import { TOptions } from "@/src/interfaces";
import { useQuery } from "@tanstack/react-query";
import { FRIENDSHIP_KEYS } from "../query-key";

const ENUM_GC_TIME = 1000 * 60 * 60 * 24;

interface IUseFriendshipStatusEnumProps {
  enabled?: boolean;
}

export const useFriendshipStatusEnum = ({
  enabled = true,
}: IUseFriendshipStatusEnumProps = {}) => {
  const friendshipStatusEnumQuery = useQuery({
    queryKey: FRIENDSHIP_KEYS.statusEnum(),
    queryFn: () => FriendshipService.getStatusEnum(),
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
    friendshipStatusEnum: (friendshipStatusEnumQuery.data ?? []) as TOptions[],
    isLoadingFriendshipStatusEnum: friendshipStatusEnumQuery.isPending,
    friendshipStatusEnumQuery,
  };
};
