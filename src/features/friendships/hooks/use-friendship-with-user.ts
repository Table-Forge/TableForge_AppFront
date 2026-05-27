import { useMemo } from "react";

import { useUserFriendships } from "@/src/features/friendships/hooks/use-user-friendships";

interface IUseFriendshipWithUserParams {
  currentUserId?: number;
  otherUserId?: number;
}

export const useFriendshipWithUser = ({
  currentUserId,
  otherUserId,
}: IUseFriendshipWithUserParams) => {
  const enabled =
    !!currentUserId && !!otherUserId && currentUserId !== otherUserId;

  const query = useUserFriendships({
    userId: currentUserId,
    enabled,
  });

  const friendship = useMemo(() => {
    if (!query.data || !otherUserId) return undefined;

    return query.data.find(
      (item) =>
        (item.requesterId === currentUserId &&
          item.receiverId === otherUserId) ||
        (item.requesterId === otherUserId &&
          item.receiverId === currentUserId),
    );
  }, [currentUserId, otherUserId, query.data]);

  const isRequester = friendship?.requesterId === currentUserId;

  return {
    friendship,
    isRequester,
    isLoading: query.isPending && enabled,
    refetch: query.refetch,
  };
};
