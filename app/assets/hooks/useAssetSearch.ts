import { useQuery } from "@tanstack/react-query";
import { searchAssets } from "../api/assets-api";
import { AssetFilters } from "../schemas/asset-filter-schema";
import { useAuth } from "@/app/auth/context/AuthContext";

export function useAssetSearch(
  filters: AssetFilters & { warrantyExpired?: boolean },
) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["asset-search", filters],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token");
      return searchAssets(token, filters);
    },
    enabled: !!token && !!filters.q,
  });
}
