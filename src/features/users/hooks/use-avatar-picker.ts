import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

import {
  MAX_AVATAR_SIZE_BYTES,
  assetToImageFile,
  validateImagePickerAsset,
} from "@/src/utils/image";
import { useUsersMutation } from "./use-users-mutations";

type IUseAvatarPickerParams = {
  userId?: number;
  onPreview?: (uri: string) => void;
};

export const useAvatarPicker = ({
  userId,
  onPreview,
}: IUseAvatarPickerParams) => {
  const { updateAvatarMutation, isUpdatingAvatar } = useUsersMutation();

  const selectAvatar = async () => {
    if (!userId) {
      Toast.show({
        type: "error",
        text1: "Usuário não identificado",
      });
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Toast.show({
        type: "error",
        text1: "Permissão necessária",
        text2: "Permita o acesso às imagens para alterar sua foto.",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    if (!asset?.uri) {
      Toast.show({
        type: "error",
        text1: "Imagem inválida",
        text2: "Não foi possível ler a imagem selecionada.",
      });
      return;
    }

    const validationError = validateImagePickerAsset(asset, {
      maxSize: MAX_AVATAR_SIZE_BYTES,
    });

    if (validationError) {
      Toast.show({
        type: "error",
        text1: "Imagem inválida",
        text2: validationError,
      });
      return;
    }

    onPreview?.(asset.uri);
    updateAvatarMutation.mutate({ id: userId, file: assetToImageFile(asset) });
  };

  return {
    selectAvatar,
    isUpdatingAvatar,
  };
};
