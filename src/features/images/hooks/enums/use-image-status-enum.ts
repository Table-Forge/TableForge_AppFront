import { ImageService } from "@/src/features/images/services/images.services";
import { TOptions } from "@/src/interfaces";
import { useQuery } from "@tanstack/react-query";
import { IMAGE_KEYS } from "../query-key";

const ENUM_GC_TIME = 1000 * 60 * 60 * 24;

interface IUseImageStatusEnumProps {
  enabled?: boolean;
}

export const useImageStatusEnum = ({
  enabled = true,
}: IUseImageStatusEnumProps = {}) => {
  const imageStatusEnumQuery = useQuery({
    queryKey: IMAGE_KEYS.statusEnum(),
    queryFn: () => ImageService.getStatusEnum(),
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
    imageStatusEnum: (imageStatusEnumQuery.data ?? []) as TOptions[],
    isLoadingImageStatusEnum: imageStatusEnumQuery.isPending,
    imageStatusEnumQuery,
  };
};
