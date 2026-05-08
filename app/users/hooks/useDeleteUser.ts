import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser, ApiError } from "../api/users-api";
import { useAuth } from "@/app/auth/context/AuthContext";
import { toast } from "sonner";
import { queryKeys } from "@/src/lib/query-keys";

export function useDeleteUser() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error("No authentication token");
      return deleteUser(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success("User deleted successfully");
    },
    onError: (error: unknown) => {
      if (error instanceof ApiError) {
        if (error.code === "USER_HAS_ACTIVE_ALLOCATIONS") {
          toast.error("Return user's assigned assets first");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Failed to delete user");
      }
    },
  });
}
