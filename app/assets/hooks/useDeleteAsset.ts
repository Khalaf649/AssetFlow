import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAsset, ApiError } from "../api/assets-api";
import { useAuth } from "@/app/auth/context/AuthContext";
import { toast } from "sonner";

export function useDeleteAsset() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error("No authentication token");
      return deleteAsset(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      toast.success("Asset decommissioned successfully");
    },
    onError: (error: unknown) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete asset");
      }
    },
  });
}
