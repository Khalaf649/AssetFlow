import { useQuery } from "@tanstack/react-query";
import { fetchAsset } from "../api/assets-api";
import { useAuth } from "@/app/auth/context/AuthContext";

export function useAsset(id: string) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["asset", id],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token");
      return fetchAsset(token, id);
    },
    enabled: !!token && !!id,
  });
}
