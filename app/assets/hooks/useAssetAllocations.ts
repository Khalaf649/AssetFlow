import { useQuery } from "@tanstack/react-query";
import { fetchAssetAllocations } from "../api/assets-api";
import { useAuth } from "@/app/auth/context/AuthContext";
import { queryKeys } from "@/src/lib/query-keys";

export function useAssetAllocations(assetId: string) {
  const { token } = useAuth();

  return useQuery({
    queryKey: queryKeys.assets.allocations(assetId),
    queryFn: async () => {
      if (!token) throw new Error("No authentication token");
      return fetchAssetAllocations(token, assetId);
    },
    enabled: !!token && !!assetId,
  });
}
