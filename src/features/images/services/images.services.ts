import {
  ICreateImageResponse,
  IImage,
  TImageType,
} from "@/src/features/images/schemas/image.schema";
import { TOptions } from "@/src/interfaces";
import { api } from "../../api";

const ENDPOINT = "/images";

const ImageTypeMap: Record<TImageType, number> = {
  CampaignBanner: 1,
  UserProfile: 2,
  GameSystem: 3,
  ChatAttachment: 4,
  CharacterAvatar: 5,
};

export const ImageService = {
  create: async (payload: IImage): Promise<ICreateImageResponse> => {
    const formData = new FormData();
    formData.append("File", payload.file as unknown as Blob);
    formData.append("Type", String(ImageTypeMap[payload.type]));
    formData.append("Name", payload.name);

    const { data } = await api.post(ENDPOINT, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
  },
  getTypeEnum: async (): Promise<TOptions[]> => {
    const { data } = await api.get(`${ENDPOINT}/enums/image-type`);

    return data;
  },
  getStatusEnum: async (): Promise<TOptions[]> => {
    const { data } = await api.get(`${ENDPOINT}/enums/image-status`);

    return data;
  },
};
