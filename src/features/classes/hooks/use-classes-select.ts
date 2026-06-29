import { TOptions } from "@/src/interfaces";
import { useMemo, useState } from "react";
import { useAllClasses } from "./use-all-classes";

interface IUseClassesSelectParams {
  enabled?: boolean;
}

export const useClassesSelect = ({
  enabled = true,
}: IUseClassesSelectParams = {}) => {
  const [search, setSearch] = useState("");

  const classesQuery = useAllClasses({
    page: 1,
    size: 100,
    search,
    enabled,
  });

  const classOptions = useMemo<TOptions[]>(
    () =>
      (classesQuery.data?.items ?? []).map((classItem) => ({
        value: classItem.id,
        name: classItem.name,
      })),
    [classesQuery.data?.items],
  );

  return {
    classOptions,
    isLoadingClassesSelect: classesQuery.isPending,
    classesQuery,
    setSearch,
  };
};
