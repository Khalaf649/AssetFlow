import { useQuery } from "@tanstack/react-query";
import { fetchAssetAllocations } from "../api/assets-api";
import type { Allocation } from "../schemas/asset-schemas";
import { useAuth } from "@/app/auth/context/AuthContext";
import { queryKeys } from "@/src/lib/query-keys";

function normalizeAllocations(response: unknown): Allocation[] {
  if (Array.isArray(response)) return response as Allocation[];

  if (response && typeof response === "object") {
    const candidate = response as {
      items?: Allocation[];
      allocations?: Allocation[];
      allocationHistory?: Allocation[];
      data?: Allocation[];
    };

    if (Array.isArray(candidate.items)) return candidate.items;
    if (Array.isArray(candidate.allocations)) return candidate.allocations;
    if (Array.isArray(candidate.allocationHistory))
      return candidate.allocationHistory;
    if (Array.isArray(candidate.data)) return candidate.data;
  }

  return [];
}

export function useAssetAllocations(assetId: string) {
  const { token } = useAuth();

  return useQuery({
    queryKey: queryKeys.assets.allocations(assetId),
    queryFn: async () => {
      if (!token) throw new Error("No authentication token");
      const allocations = await fetchAssetAllocations(token, assetId);
      return normalizeAllocations(allocations);
    },
    enabled: !!token && !!assetId,
  });
}
