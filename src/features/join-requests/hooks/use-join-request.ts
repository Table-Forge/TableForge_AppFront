import { useQuery } from "@tanstack/react-query";

import { JOIN_REQUEST_KEYS } from "@/src/features/join-requests/hooks/query-key";
import { JoinRequestService } from "@/src/features/join-requests/services/join-requests.services";

export function useJoinRequest(id?: number) {
  return useQuery({
    queryKey: JOIN_REQUEST_KEYS.detail(id ?? 0),
    queryFn: async () => {
      if (id === undefined) throw new Error("ID is required");
      return JoinRequestService.getById(id);
    },
    enabled: id !== undefined && !isNaN(id),
  });
}
