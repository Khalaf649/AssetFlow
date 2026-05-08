import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/app/auth/context/AuthContext";
import { fetchDashboardStats } from "../api/reports-api";

export function useDashboardStats() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["reports", "dashboard"],
    queryFn: () => {
      if (!token) throw new Error("No authentication token");
      return fetchDashboardStats(token);
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}