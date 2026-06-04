import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import { ErrorMessage } from "@/src/components/error-message/error-message";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { IImageFile } from "@/src/features/images/schemas/image.schema";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { BORDERS, RADII, SURFACES } from "@/src/theme/tokens";
import {
  MAX_IMAGE_SIZE_BYTES,
  assetToImageFile,
  validateImagePickerAsset,
} from "@/src/utils/image";

export type ImageInputValue = {
  uri: string;
  file: IImageFile;
};

interface ImageInputProps {
  aspect?: [number, number];
  disabled?: boolean;
  error?: string;
  height?: number;
  isLoading?: boolean;
  maxSizeBytes?: number;
  onChange: (value: ImageInputValue) => void;
  placeholder?: string;
  quality?: number;
  value?: string;
}

export type { ImageInputProps };

export const InputImage = ({
  aspect = [16, 9],
  disabled = false,
  error,
  height = 170,
  isLoading = false,
  maxSizeBytes = MAX_IMAGE_SIZE_BYTES,
  onChange,
  placeholder = "Toque para selecionar uma imagem",
  quality = 0.85,
  value,
}: ImageInputProps) => {
  const handleSelectImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Toast.show({
        type: "error",
        text1: "Permissão necessária",
        text2: "Permita o acesso às imagens para selecionar uma imagem.",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect,
      quality,
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
      maxSize: maxSizeBytes,
    });

    if (validationError) {
      Toast.show({
        type: "error",
        text1: "Imagem inválida",
        text2: validationError,
      });
      return;
    }

    onChange({
      uri: asset.uri,
      file: assetToImageFile(asset),
    });
  };

  return (
    <View>
      <Pressable
        onPress={handleSelectImage}
        disabled={disabled || isLoading}
        style={({ pressed }) => [
          styles.wrapper,
          { height },
          error && styles.wrapperError,
          pressed && styles.wrapperPressed,
        ]}
      >
        {value ? (
          <Image source={{ uri: value }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons
              name="image-outline"
              size={28}
              color={DEFAULT_COLORS.textMutedLight}
            />
            <ThemedText style={styles.placeholderText}>{placeholder}</ThemedText>
          </View>
        )}

        <View style={styles.editBadge}>
          {isLoading ? (
            <ActivityIndicator size="small" color={DEFAULT_COLORS.white} />
          ) : (
            <Ionicons name="camera" size={18} color={DEFAULT_COLORS.white} />
          )}
        </View>
      </Pressable>

      {error && <ErrorMessage text={error} />}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
    backgroundColor: SURFACES.fill,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  wrapperError: {
    borderColor: DEFAULT_COLORS.danger,
  },
  wrapperPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 20,
  },
  placeholderText: {
    color: DEFAULT_COLORS.textMutedLight,
    textAlign: "center",
  },
  editBadge: {
    position: "absolute",
    right: 12,
    bottom: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: DEFAULT_COLORS.orange,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: SURFACES.card,
  },
});
