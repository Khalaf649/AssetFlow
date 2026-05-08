import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser, ApiError } from "../api/users-api";
import { useAuth } from "@/app/auth/context/AuthContext";

interface UseDeleteUserOptions {
  onSuccessCallback?: () => void;
  onErrorCallback?: (message: string) => void;
}

export function useDeleteUser({
  onSuccessCallback,
  onErrorCallback,
}: UseDeleteUserOptions) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error("No authentication token");
      return deleteUser(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onSuccessCallback?.();
    },
    onError: (error: unknown) => {
      let message = "Failed to delete user";
      if (error instanceof ApiError) {
        if (error.code === "USER_HAS_ACTIVE_ALLOCATIONS") {
          message = "Return user's assigned assets first";
        } else {
          message = error.message;
        }
      }
      onErrorCallback?.(message);
    },
  });
}
