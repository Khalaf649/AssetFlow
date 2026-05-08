"use client";

import { apiFetch, ApiError } from "@/src/lib/api-client";
import {
  ConditionReportResponse,
  FilterReportInput,
  PaginatedReportsResponse,
  ResolveReportInput,
  SubmitReportInput,
} from "../schemas/condition-report-schemas";

/**
 * GET /condition-reports
 * Fetch all condition reports with filtering (Admin/Manager only)
 */
export async function fetchConditionReports(
  token: string,
  filters: FilterReportInput,
): Promise<PaginatedReportsResponse> {
  const url = new URLSearchParams();
  if (filters.page !== undefined)
    url.append("page", filters.page.toString());
  if (filters.size !== undefined)
    url.append("size", filters.size.toString());
  if (filters.status) url.append("status", filters.status);
  if (filters.severity) url.append("severity", filters.severity);
  if (filters.assetId) url.append("assetId", filters.assetId);
  if (filters.userId) url.append("userId", filters.userId);

  return apiFetch<PaginatedReportsResponse>(
    `/condition-reports?${url.toString()}`,
    { token },
  );
}

/**
 * GET /condition-reports/{id}
 * Fetch a single condition report by ID
 */
export async function fetchConditionReport(
  token: string,
  id: string,
): Promise<ConditionReportResponse> {
  return apiFetch<ConditionReportResponse>(`/condition-reports/${id}`, {
    token,
  });
}

/**
 * POST /assets/{assetId}/condition-reports
 * Submit a new condition report on an asset
 */
export async function submitConditionReport(
  token: string,
  assetId: string,
  input: SubmitReportInput,
): Promise<ConditionReportResponse> {
  return apiFetch<ConditionReportResponse>(
    `/assets/${assetId}/condition-reports`,
    {
      method: "POST",
      token,
      body: JSON.stringify({
        issue: input.issue,
        severity: input.severity,
      }),
    },
  );
}

/**
 * PATCH /condition-reports/{id}
 * Update the status and/or resolution of a condition report
 */
export async function resolveConditionReport(
  token: string,
  id: string,
  input: ResolveReportInput,
): Promise<ConditionReportResponse> {
  return apiFetch<ConditionReportResponse>(`/condition-reports/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify({
      status: input.status,
      ...(input.resolution && { resolution: input.resolution }),
    }),
  });
}

export { ApiError };