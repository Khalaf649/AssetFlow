import { useQuery } from "@tanstack/react-query";
import { fetchAssets } from "../api/assets-api";
import { AssetFilters } from "../schemas/asset-filter-schema";
import { useAuth } from "@/app/auth/context/AuthContext";
import { queryKeys } from "@/src/lib/query-keys";

export function useAssets(filters: AssetFilters) {
  const { token } = useAuth();

  return useQuery({
    queryKey: queryKeys.assets.list(filters),
    queryFn: async () => {
      if (!token) throw new Error("No authentication token");
      return fetchAssets(token, filters);
    },
    enabled: !!token,
  });
}
