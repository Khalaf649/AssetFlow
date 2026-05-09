"use client";

import { apiFetch, ApiError, PaginatedResponse } from "@/src/lib/api-client";
import {
  ConditionReportResponse,
  FilterReportInput,
  ResolveReportInput,
  SubmitReportInput,
} from "../schemas/condition-report-schemas";

export async function fetchConditionReports(
  token: string,
  filters: FilterReportInput,
): Promise<PaginatedResponse<ConditionReportResponse>> {
  const params = new URLSearchParams();
  params.append("page", String(Math.max(0, filters.page - 1)));
  params.append("size", String(filters.size));
  if (filters.status) params.append("status", filters.status);
  if (filters.severity) params.append("severity", filters.severity);
  if (filters.assetId) params.append("assetId", filters.assetId);
  if (filters.userId) params.append("userId", filters.userId);

  return apiFetch<PaginatedResponse<ConditionReportResponse>>(
    `/condition-reports?${params.toString()}`,
    { token },
  );
}

export async function fetchConditionReport(
  token: string,
  id: string,
): Promise<ConditionReportResponse> {
  return apiFetch<ConditionReportResponse>(`/condition-reports/${id}`, {
    token,
  });
}

export async function submitConditionReport(
  token: string,
  assetId: string,
  input: SubmitReportInput,
): Promise<ConditionReportResponse> {
  return apiFetch<ConditionReportResponse>(`/assets/${assetId}/condition-reports`, {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
}

export async function resolveConditionReport(
  token: string,
  reportId: string,
  input: ResolveReportInput,
): Promise<ConditionReportResponse> {
  return apiFetch<ConditionReportResponse>(`/condition-reports/${reportId}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(input),
  });
}

export { ApiError };
