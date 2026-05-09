"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/app/auth/context/AuthContext";
import { queryKeys } from "@/src/lib/query-keys";
import { fetchConditionReport, fetchConditionReports } from "../api/condition-reports-api";
import { FilterReportInput } from "../schemas/condition-report-schemas";

export function useConditionReports(filters: FilterReportInput) {
  const { token } = useAuth();

  return useQuery({
    queryKey: queryKeys.conditionReports.list(filters),
    queryFn: async () => {
      if (!token) throw new Error("No authentication token");
      return fetchConditionReports(token, filters);
    },
    enabled: !!token,
  });
}

export function useConditionReport(id: string) {
  const { token } = useAuth();

  return useQuery({
    queryKey: queryKeys.conditionReports.detail(id),
    queryFn: async () => {
      if (!token) throw new Error("No authentication token");
      return fetchConditionReport(token, id);
    },
    enabled: !!token && !!id,
  });
}
