import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import { CHARACTERS } from "@/src/features/characters/hooks/query-key";
import {
  ICharacter,
  ICharacterCreate,
} from "@/src/features/characters/schemas/character.schema";
import { CharacterService } from "@/src/features/characters/services/characters.services";

export const useCharactersMutation = () => {
  const queryClient = useQueryClient();

  const createCharacterMutation = useMutation({
    mutationFn: (payload: ICharacterCreate) => CharacterService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CHARACTERS] });
      Toast.show({
        type: "success",
        text1: "Personagem criado com sucesso!",
      });
    },
    onError: () => {
      Toast.show({
        type: "error",
        text1: "Ops! Algo deu errado",
        text2: "Erro ao criar personagem.",
      });
    },
  });

  const updateCharacterMutation = useMutation({
    mutationFn: (payload: ICharacter) => CharacterService.update(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [CHARACTERS] }),
  });

  const deleteCharacterMutation = useMutation({
    mutationFn: (id: number) => CharacterService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [CHARACTERS] }),
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
