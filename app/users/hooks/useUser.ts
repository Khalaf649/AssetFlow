import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../api/users-api";
import { useAuth } from "@/app/auth/context/AuthContext";

export function useUser(id: string) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token");
      return fetchUser(token, id);
    },
    enabled: !!token && !!id,
  });
}
