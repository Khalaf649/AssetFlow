import { useQuery } from "@tanstack/react-query";
import { fetchAsset } from "../api/assets-api";
import { useAuth } from "@/app/auth/context/AuthContext";
import { queryKeys } from "@/src/lib/query-keys";

export function useAsset(id: string) {
  const { token } = useAuth();

  return useQuery({
    queryKey: queryKeys.assets.detail(id),
    queryFn: async () => {
      if (!token) throw new Error("No authentication token");
      return fetchAsset(token, id);
    },
    enabled: !!token && !!id,
  });
}
