import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "@/src/features/users/hooks/query-key";
import { UserService } from "@/src/features/users/services/users.services";

export function useUsers() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: UserService.getAll,
  });
}
