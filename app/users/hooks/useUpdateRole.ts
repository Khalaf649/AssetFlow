import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserRole, ApiError } from "../api/users-api";
import { UpdateRoleInput } from "../schemas/users-schemas";
import { useAuth } from "@/app/auth/context/AuthContext";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { queryKeys } from "@/src/lib/query-keys";

interface UseUpdateRoleOptions {
  setError: UseFormSetError<UpdateRoleInput>;
}

export function useUpdateRole({ setError }: UseUpdateRoleOptions) {
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.id) });
      toast.success("Role updated successfully");
    },
    onError: (error: unknown) => {
      if (error instanceof ApiError) {
        if (error.code === "LAST_ADMIN_PROTECTION") {
          setError("root", { message: "Cannot remove the last admin." });
        } else if (error.details && error.details.length > 0) {
          error.details.forEach((detail) => {
            setError(detail.field as keyof UpdateRoleInput, {
              message: detail.message,
            });
          });
        } else {
          setError("root", { message: error.message });
        }
      } else {
        setError("root", { message: "An unexpected error occurred" });
      }
    },
  });
}
