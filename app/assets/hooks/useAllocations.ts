import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignAsset, returnAsset, ApiError } from "../api/assets-api";
import { AllocationInput } from "../schemas/asset-schemas";
import { useAuth } from "@/app/auth/context/AuthContext";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { queryKeys } from "@/src/lib/query-keys";

interface UseAllocationOptions {
  assetId: string;
  setError: UseFormSetError<AllocationInput>;
  onSuccess?: () => void;
}

export function useAssignAsset({
  assetId,
  setError,
  onSuccess,
}: UseAllocationOptions) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AllocationInput) => {
      if (!token) throw new Error("No authentication token");
      return assignAsset(token, assetId, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.assets.detail(assetId) });
      queryClient.invalidateQueries({
        queryKey: queryKeys.assets.allocations(assetId),
      });
      toast.success("Asset assigned successfully");
      onSuccess?.();
    },
    onError: (error: unknown) => {
      if (error instanceof ApiError) {
        if (error.code === "ASSET_ALREADY_ASSIGNED") {
          setError("root", {
            message: "Asset is already deployed to another user.",
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

interface UseReturnOptions {
  assetId: string;
  setError: UseFormSetError<AllocationInput>;
  onSuccess?: () => void;
}

export function useReturnAsset({
  assetId,
  setError,
  onSuccess,
}: UseReturnOptions) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("No authentication token");
      return returnAsset(token, assetId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.assets.detail(assetId) });
      queryClient.invalidateQueries({
        queryKey: queryKeys.assets.allocations(assetId),
      });
      toast.success("Asset returned successfully");
      onSuccess?.();
    },
    onError: (error: unknown) => {
      if (error instanceof ApiError) {
        if (error.code === "NO_ACTIVE_ALLOCATION") {
          setError("root", {
            message: "No active allocation to return.",
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
