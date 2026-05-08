import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAsset, updateAsset, ApiError } from "../api/assets-api";
import { AssetFormInput } from "../schemas/asset-schemas";
import { useAuth } from "@/app/auth/context/AuthContext";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

interface UseAssetMutationOptions {
  setError: UseFormSetError<AssetFormInput>;
  onSuccess?: () => void;
}

export function useCreateAsset({
  setError,
  onSuccess,
}: UseAssetMutationOptions) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AssetFormInput) => {
      if (!token) throw new Error("No authentication token");
      return createAsset(token, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      toast.success("Asset created successfully");
      onSuccess?.();
    },
    onError: (error: unknown) => {
      if (error instanceof ApiError) {
        if (error.code === "SERIAL_NUMBER_CONFLICT") {
          setError("serialNumber", {
            message: "Serial number already exists.",
          });
        } else if (error.details && error.details.length > 0) {
          error.details.forEach((detail) => {
            setError(detail.field as keyof AssetFormInput, {
              message: detail.message,
            });
          });
        } else {
          setError("root", { message: error.message });
        }
      } else {
        setError("root.serverError", {
          message: "An unexpected error occurred",
        });
      }
    },
  });
}

export function useUpdateAsset({
  setError,
  onSuccess,
}: UseAssetMutationOptions) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: AssetFormInput }) => {
      if (!token) throw new Error("No authentication token");
      return updateAsset(token, id, input);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["asset", variables.id] });
      toast.success("Asset updated successfully");
      onSuccess?.();
    },
    onError: (error: unknown) => {
      if (error instanceof ApiError) {
        if (error.code === "SERIAL_NUMBER_CONFLICT") {
          setError("serialNumber", {
            message: "Serial number already exists.",
          });
        } else if (error.details && error.details.length > 0) {
          error.details.forEach((detail) => {
            setError(detail.field as keyof AssetFormInput, {
              message: detail.message,
            });
          });
        } else {
          setError("root", { message: error.message });
        }
      } else {
        setError("root.serverError", {
          message: "An unexpected error occurred",
        });
      }
    },
  });
}
