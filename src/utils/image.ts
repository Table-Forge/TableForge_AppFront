import type { ImagePickerAsset } from "expo-image-picker";

import { IImageFile } from "@/src/features/images/schemas/image.schema";

export const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;
export const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024;

const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const assetToImageFile = (asset: ImagePickerAsset): IImageFile => {
  const type = asset.mimeType ?? "image/jpeg";
  const extension = MIME_EXTENSIONS[type] ?? "jpg";
  const name = asset.fileName ?? `upload.${extension}`;

  return {
    uri: asset.uri,
    name,
    type,
  };
};

export const validateImagePickerAsset = (
  asset: ImagePickerAsset,
  {
    maxSize,
    acceptedTypes = ACCEPTED_IMAGE_MIME_TYPES,
  }: { maxSize: number; acceptedTypes?: string[] },
): string | null => {
  if (asset.mimeType && !acceptedTypes.includes(asset.mimeType)) {
    return "Formato inválido. Use JPEG, PNG, WEBP ou GIF.";
  }

  if (asset.fileSize && asset.fileSize > maxSize) {
    const maxMb = Math.round(maxSize / (1024 * 1024));
    return `Imagem muito grande. O tamanho máximo é de ${maxMb} MB.`;
  }

  return null;
};
