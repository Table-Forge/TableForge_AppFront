import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import {
  ICharacterCreate,
  ICharacter,
} from "@/src/features/characters/schemas/character.schema";
import { CharacterService } from "@/src/features/characters/services/characters.services";

import { CHARACTER_KEYS } from "./query-key";

export const useCharactersMutation = () => {
  const queryClient = useQueryClient();

  const createCharacterMutation = useMutation({
    mutationFn: (payload: ICharacterCreate) => CharacterService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHARACTER_KEYS.all });
      Toast.show({
        type: "success",
        text1: "Personagem criado!",
      });
    },
    onError: () => {
      Toast.show({
        type: "error",
        text1: "Erro ao criar personagem",
      });
    },
  });

  const updateCharacterMutation = useMutation({
    mutationFn: (payload: Partial<ICharacter> & { id: number }) =>
      CharacterService.update(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CHARACTER_KEYS.all }),
  });

  const deleteCharacterMutation = useMutation({
    mutationFn: (id: number) => CharacterService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CHARACTER_KEYS.all }),
  });

  return {
    createCharacterMutation,
    updateCharacterMutation,
    deleteCharacterMutation,
    isCreatingCharacter: createCharacterMutation.isPending,
    isUpdatingCharacter: updateCharacterMutation.isPending,
    isDeletingCharacter: deleteCharacterMutation.isPending,
  };
};
