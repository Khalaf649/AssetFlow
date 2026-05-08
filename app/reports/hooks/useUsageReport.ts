import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/auth/context/AuthContext";
import { fetchUsageReport, UsageReportParams } from "../api/reports-api";

export function useUsageReport() {
  const { token } = useAuth();
  const searchParams = useSearchParams();

  const params: UsageReportParams = {
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
    type: searchParams.get("type") ?? undefined,
    userId: searchParams.get("userId") ?? undefined,
  };

  return useQuery({
    queryKey: ["reports", "usage", params],
    queryFn: () => {
      if (!token) throw new Error("No authentication token");
      return fetchUsageReport(token, params);
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}