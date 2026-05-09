import { useQuery } from "@tanstack/react-query";
import { fetchAssets } from "@/app/assets/api/assets-api";
import { useAuth } from "@/app/auth/context/AuthContext";
import { queryKeys } from "@/src/lib/query-keys";

export function useUserAssets(userId: string) {
  const { token } = useAuth();

  return useQuery({
    queryKey: queryKeys.users.assets(userId),
    queryFn: async () => {
      if (!token) throw new Error("No authentication token");
      const response = await fetchAssets(token, {
        assignedUserId: userId,
        page: 1,
        size: 100, // Fetch all user assets
      });
      return response.items;
    },
    enabled: !!token && !!userId,
  });
}
