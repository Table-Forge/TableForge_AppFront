import { USER } from "@/src/features/users/hooks/query-key";
import { UserService } from "@/src/features/users/services/users.services";
import { useQuery } from "@tanstack/react-query";

export function useUser(id?: number) {
  return useQuery({
    queryKey: [USER, id],
    queryFn: async () => {
      if (id === undefined) throw new Error("ID is required");
      return UserService.getById(id);
    },
    enabled: id !== undefined && !isNaN(id),
    staleTime: 1000 * 60 * 30,
  });
}
