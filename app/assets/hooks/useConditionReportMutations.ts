import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/app/auth/context/AuthContext";
import { queryKeys } from "@/src/lib/query-keys";
import { ApiError, createConditionReport } from "../api/assets-api";
import { ConditionReportCreateInput } from "../schemas/condition-report-schemas";

interface UseCreateConditionReportOptions {
  assetId: string;
  setError: UseFormSetError<ConditionReportCreateInput>;
  onSuccess?: () => void;
}

export function useCreateConditionReport({
  assetId,
  setError,
  onSuccess,
}: UseCreateConditionReportOptions) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ConditionReportCreateInput) => {
      if (!token) throw new Error("No authentication token");
      return createConditionReport(token, assetId, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.conditionReports.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.assets.detail(assetId),
      });
      toast.success("Condition report submitted successfully");
      onSuccess?.();
    },
    onError: (error: unknown) => {
      if (error instanceof ApiError) {
        if (error.code === "VALIDATION_ERROR" && error.details?.length) {
          error.details.forEach((detail) => {
            setError(detail.field as keyof ConditionReportCreateInput, {
              message: detail.message,
            });
          });
          return;
        }

        if (error.code === "FORBIDDEN") {
          setError("root", {
            message:
              "You can only submit condition reports for assets assigned to you.",
          });
          return;
        }

        setError("root", { message: error.message });
        return;
      }

      setError("root.serverError", {
        message: "An unexpected error occurred",
      });
    },
  });
}
