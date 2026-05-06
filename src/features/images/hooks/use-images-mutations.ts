import { IImage } from "@/src/features/images/schemas/image.schema";
import { ImageService } from "@/src/features/images/services/images.services";
import { useMutation } from "@tanstack/react-query";

export const useImagesMutation = () => {
  const createImageMutation = useMutation({
    mutationFn: (payload: IImage) => ImageService.create(payload),
  });

  return {
    createImageMutation,
    isCreatingImage: createImageMutation.isPending,
  };
};
