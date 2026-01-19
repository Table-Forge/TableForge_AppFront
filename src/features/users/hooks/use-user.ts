import { QUERY_KEY } from "@/src/features/users/hooks/query-key";
import { UserService } from "@/src/features/users/services/users.services";
import { useQuery } from "@tanstack/react-query";

export function useUser(id: string) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => UserService.getById(id),
    enabled: !!id,
  });
}
