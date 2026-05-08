import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserRole, ApiError } from "../api/users-api";
import { UpdateRoleInput } from "../schemas/users-schemas";
import { useAuth } from "@/app/auth/context/AuthContext";
import { UseFormSetError } from "react-hook-form";

interface UseUpdateRoleOptions {
  setError: UseFormSetError<any>;
  onSuccessCallback?: () => void;
}

export function useUpdateRole({
  setError,
  onSuccessCallback,
}: UseUpdateRoleOptions) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateRoleInput;
    }) => {
      if (!token) throw new Error("No authentication token");
      return updateUserRole(token, id, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onSuccessCallback?.();
    },
    onError: (error: unknown) => {
      if (error instanceof ApiError) {
        if (error.code === "LAST_ADMIN_PROTECTION") {
          setError("root", {
            message: "Cannot remove the last admin.",
          });
        } else if (error.details && error.details.length > 0) {
          error.details.forEach((detail) => {
            setError(detail.field, { message: detail.message });
          });
        } else {
          setError("root.serverError", { message: error.message });
        }
      } else {
        setError("root.serverError", {
          message: "An unexpected error occurred",
        });
      }
    },
  });
}
