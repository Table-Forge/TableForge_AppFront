import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import { FRIENDSHIP_KEYS } from "@/src/features/friendships/hooks/query-key";
import {
  IFriendshipCreate,
  IFriendshipUpdate,
} from "@/src/features/friendships/schemas/friendship.schema";
import { FriendshipService } from "@/src/features/friendships/services/friendships.services";

export const useFriendshipsMutation = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: FRIENDSHIP_KEYS.all });
  };

  const createFriendshipMutation = useMutation({
    mutationFn: (payload: IFriendshipCreate) =>
      FriendshipService.create(payload),
    onSuccess: () => {
      invalidate();
      Toast.show({
        type: "success",
        text1: "Solicitação de amizade enviada.",
      });
    },
    onError: () => {
      Toast.show({
        type: "error",
        text1: "Erro ao enviar solicitação.",
      });
    },
  });

  const updateFriendshipMutation = useMutation({
    mutationFn: (payload: IFriendshipUpdate) =>
      FriendshipService.update(payload),
    onSuccess: (_data, variables) => {
      invalidate();
      Toast.show({
        type: "success",
        text1:
          variables.status === "Accepted"
            ? "Amizade aceita."
            : "Solicitação recusada.",
      });
    },
    onError: () => {
      Toast.show({
        type: "error",
        text1: "Erro ao atualizar amizade.",
      });
    },
  });

  const deleteFriendshipMutation = useMutation({
    mutationFn: (id: number) => FriendshipService.delete(id),
    onSuccess: () => {
      invalidate();
      Toast.show({
        type: "success",
        text1: "Amizade removida.",
      });
    },
    onError: () => {
      Toast.show({
        type: "error",
        text1: "Erro ao remover amizade.",
      });
    },
  });

  return {
    createFriendshipMutation,
    updateFriendshipMutation,
    deleteFriendshipMutation,
    isCreatingFriendship: createFriendshipMutation.isPending,
    isUpdatingFriendship: updateFriendshipMutation.isPending,
    isDeletingFriendship: deleteFriendshipMutation.isPending,
  };
};
