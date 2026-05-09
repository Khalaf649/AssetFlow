import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/app/auth/context/AuthContext";
import { queryKeys } from "@/src/lib/query-keys";
import {
    resolveConditionReport,
    submitConditionReport,
} from "../api/condition-reports-api";
import {
    ResolveReportInput,
    SubmitReportInput,
} from "../schemas/condition-report-schemas";

export function useSubmitConditionReport(assetId: string) {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: SubmitReportInput) => {
            if (!token) throw new Error("No authentication token");
            return submitConditionReport(token, assetId, input);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.conditionReports.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.assets.detail(assetId) });
        },
    });
}

export function useResolveConditionReport(reportId: string) {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: ResolveReportInput) => {
            if (!token) throw new Error("No authentication token");
            return resolveConditionReport(token, reportId, input);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.conditionReports.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.conditionReports.detail(reportId) });
        },
    });
}
