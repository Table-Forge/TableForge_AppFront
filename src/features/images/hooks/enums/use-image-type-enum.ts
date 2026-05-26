import { ImageService } from "@/src/features/images/services/images.services";
import { TOptions } from "@/src/interfaces";
import { useQuery } from "@tanstack/react-query";
import { IMAGE_KEYS } from "../query-key";

const ENUM_GC_TIME = 1000 * 60 * 60 * 24;

interface IUseImageTypeEnumProps {
  enabled?: boolean;
}

export const useImageTypeEnum = ({
  enabled = true,
}: IUseImageTypeEnumProps = {}) => {
  const imageTypeEnumQuery = useQuery({
    queryKey: IMAGE_KEYS.typeEnum(),
    queryFn: () => ImageService.getTypeEnum(),
    select: (data) =>
      data.map((item) => ({
        name: item.name,
        value: item.value,
      })),
    enabled,
    staleTime: Infinity,
    gcTime: ENUM_GC_TIME,
    refetchOnWindowFocus: false,
  });

  return {
    imageTypeEnum: (imageTypeEnumQuery.data ?? []) as TOptions[],
    isLoadingImageTypeEnum: imageTypeEnumQuery.isPending,
    imageTypeEnumQuery,
  };
};
