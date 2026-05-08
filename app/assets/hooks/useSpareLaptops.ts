import { useQuery } from "@tanstack/react-query";
import { fetchSpareLaptops } from "../api/assets-api";
import { useAuth } from "@/app/auth/context/AuthContext";

export function useSpareLaptops() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["spare-laptops"],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token");
      return fetchSpareLaptops(token);
    },
    enabled: !!token,
  });
}
