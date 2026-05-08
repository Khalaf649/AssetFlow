import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/auth/context/AuthContext";
import { fetchWarrantyExpiry } from "../api/reports-api";

export function useWarrantyExpiry() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const daysAhead = Number(searchParams.get("daysAhead") ?? 30);

  return useQuery({
    queryKey: ["reports", "warranty-expiry", daysAhead],
    queryFn: () => {
      if (!token) throw new Error("No authentication token");
      return fetchWarrantyExpiry(token, daysAhead);
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}