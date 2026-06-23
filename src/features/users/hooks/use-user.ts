import { USER } from "@/src/features/users/hooks/query-key";
import { UserService } from "@/src/features/users/services/users.services";
import { useQuery } from "@tanstack/react-query";

export function useUser(id?: number, fromApp = false) {
  return useQuery({
    queryKey: [USER, id, fromApp],
    queryFn: async () => {
      if (id === undefined) throw new Error("ID is required");
      return fromApp ? UserService.getFromApp(id) : UserService.getById(id);
    },
    enabled: id !== undefined && !isNaN(id),
    staleTime: 1000 * 60 * 30,
  });
}
