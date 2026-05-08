import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../api/users-api";
import { UserFilters } from "../schemas/filter-schema";
import { useAuth } from "@/app/auth/context/AuthContext";

export function useUsers(filters: UserFilters) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["users", filters],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token");
      return fetchUsers(token, filters);
    },
    enabled: !!token,
  });
}
