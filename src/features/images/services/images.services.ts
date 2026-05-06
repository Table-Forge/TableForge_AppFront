import {
  ICreateImageResponse,
  IImage,
} from "@/src/features/images/schemas/image.schema";
import { api } from "../../api";

const ENDPOINT = "/images";

export const ImageService = {
  create: async (payload: IImage): Promise<ICreateImageResponse> => {
    const { data } = await api.post(ENDPOINT, payload);

    return data;
  },
};
