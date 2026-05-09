"use client";

import { getAuthToken } from "@/app/auth/api/auth-api";
import {
  FilterReportInput,
  PaginatedReportsResponse,
  ConditionReportResponse,
  SubmitReportInput,
  ResolveReportInput,
} from "../schemas/condition-report-schemas";

const API_BASE = "http://localhost:8080/api/v1";

interface ApiEnvelope<T> {
  success: boolean;
  status: number;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: Array<{ field: string; message: string }>;
  };
}

function getAuthHeaders() {
  const token = getAuthToken();
  if (!token) throw new Error("Missing authentication token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function unwrapEnvelope<T>(response: Response): Promise<T> {
  const envelope = (await response.json()) as ApiEnvelope<T>;
  if (!envelope.success) {
    const error = new Error(envelope.message) as any;
    error.code = envelope.error?.code;
    error.details = envelope.error?.details;
    error.status = envelope.status;
    throw error;
  }
  return envelope.data as T;
}

export async function fetchConditionReports(
  filters: FilterReportInput,
): Promise<PaginatedReportsResponse> {
  const url = new URL(`${API_BASE}/condition-reports`);
  if (filters.page !== undefined)
    url.searchParams.append("page", filters.page.toString());
  if (filters.size !== undefined)
    url.searchParams.append("size", filters.size.toString());
  if (filters.status) url.searchParams.append("status", filters.status);
  if (filters.severity) url.searchParams.append("severity", filters.severity);
  if (filters.assetId) url.searchParams.append("assetId", filters.assetId);
  if (filters.userId) url.searchParams.append("userId", filters.userId);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return await unwrapEnvelope<PaginatedReportsResponse>(response);
}

export async function fetchConditionReport(
  id: string,
): Promise<ConditionReportResponse> {
  const response = await fetch(`${API_BASE}/condition-reports/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return await unwrapEnvelope<ConditionReportResponse>(response);
}

export async function submitConditionReport(
  assetId: string,
  input: SubmitReportInput,
): Promise<ConditionReportResponse> {
  const response = await fetch(
    `${API_BASE}/assets/${assetId}/condition-reports`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(input),
    },
  );
  return await unwrapEnvelope<ConditionReportResponse>(response);
}

export async function resolveConditionReport(
  reportId: string,
  input: ResolveReportInput,
): Promise<ConditionReportResponse> {
  const response = await fetch(`${API_BASE}/condition-reports/${reportId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(input),
  });
  return await unwrapEnvelope<ConditionReportResponse>(response);
}
