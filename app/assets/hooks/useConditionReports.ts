"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/app/auth/context/AuthContext";
import { fetchAssetConditionReports } from "../api/assets-api";
import type { ConditionReport } from "../schemas/asset-schemas";
import { queryKeys } from "@/src/lib/query-keys";

/**
 * Fetch full condition report history for a single asset.
 * Query key: ["conditionReports", "byAsset", assetId]
 */
export function useConditionReports(assetId: string) {
  const { token } = useAuth();

  return useQuery<ConditionReport[]>({
    queryKey: ["conditionReports", "byAsset", assetId],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token");
      return fetchAssetConditionReports(token, assetId);
    },
    enabled: !!token && !!assetId,
    staleTime: 30_000,
    retry: 1,
  });
}
