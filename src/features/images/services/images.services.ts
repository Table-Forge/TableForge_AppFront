import {
  ICreateImageResponse,
  IImage,
} from "@/src/features/images/schemas/image.schema";
import { TOptions } from "@/src/interfaces";
import { api } from "../../api";

const ENDPOINT = "/images";

export const ImageService = {
  create: async (payload: IImage): Promise<ICreateImageResponse> => {
    const formData = new FormData();
    formData.append("File", payload.file as unknown as Blob);
    formData.append("Type", payload.type);
    formData.append("Name", payload.name);

    const { data } = await api.post(ENDPOINT, formData);

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
