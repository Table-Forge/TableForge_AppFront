import {
  ICreateImageResponse,
  IImage,
} from "@/src/features/images/schemas/image.schema";
import { TOptions } from "@/src/interfaces";
import { api } from "../../api";

const ENDPOINT = "/images";

export const ImageService = {
  create: async (payload: IImage): Promise<ICreateImageResponse> => {
    const { data } = await api.post(ENDPOINT, payload);

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
