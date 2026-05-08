import { useQuery } from "@tanstack/react-query";
import { fetchSpareLaptops } from "../api/assets-api";
import { useAuth } from "@/app/auth/context/AuthContext";
import { queryKeys } from "@/src/lib/query-keys";

export function useSpareLaptops() {
  const { token } = useAuth();

  return useQuery({
    queryKey: queryKeys.assets.spareLaptops,
    queryFn: async () => {
      if (!token) throw new Error("No authentication token");
      return fetchSpareLaptops(token);
    },
    enabled: !!token,
  });
}
