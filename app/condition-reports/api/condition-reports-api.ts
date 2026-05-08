'use client';

import { getAuthToken } from '@/app/auth/api/auth-api';
import {
  ConditionReportResponse,
  FilterReportInput,
  PaginatedReportsResponse,
  ResolveReportInput,
  SubmitReportInput,
} from '../schemas/condition-report-schemas';

const API_BASE = 'http://localhost:8080/api/v1';

function getAuthHeaders() {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Missing authentication token');
  }

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Standard API response envelope
 */
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

/**
 * Unwrap API response envelope and throw on error
 */
function unwrapEnvelope<T>(response: ApiEnvelope<T>): T {
  if (!response.success) {
    const error = new Error(response.message) as any;
    error.code = response.error?.code;
    error.details = response.error?.details;
    error.status = response.status;
    throw error;
  }
  return response.data as T;
}

/**
 * GET /condition-reports
 * Fetch all condition reports with filtering (Admin/Manager only)
 */
export async function fetchConditionReports(
  filters: FilterReportInput
): Promise<PaginatedReportsResponse> {
  const token = getAuthToken();
  const url = new URL(`${API_BASE}/condition-reports`);

  // Add filter parameters
  if (filters.page !== undefined) url.searchParams.append('page', filters.page.toString());
  if (filters.size !== undefined) url.searchParams.append('size', filters.size.toString());
  if (filters.status) url.searchParams.append('status', filters.status);
  if (filters.severity) url.searchParams.append('severity', filters.severity);
  if (filters.assetId) url.searchParams.append('assetId', filters.assetId);
  if (filters.userId) url.searchParams.append('userId', filters.userId);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data: ApiEnvelope<PaginatedReportsResponse> = await response.json();
  return unwrapEnvelope(data);
}

/**
 * GET /condition-reports/{id}
 * Fetch a single condition report by ID
 */
export async function fetchConditionReport(id: string): Promise<ConditionReportResponse> {
  const response = await fetch(`${API_BASE}/condition-reports/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data: ApiEnvelope<ConditionReportResponse> = await response.json();
  return unwrapEnvelope(data);
}

/**
 * POST /assets/{assetId}/condition-reports
 * Submit a new condition report on an asset
 */
export async function submitConditionReport(
  assetId: string,
  input: SubmitReportInput
): Promise<ConditionReportResponse> {
  const response = await fetch(`${API_BASE}/assets/${assetId}/condition-reports`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      issue: input.issue,
      severity: input.severity,
    }),
  });

  const data: ApiEnvelope<ConditionReportResponse> = await response.json();
  return unwrapEnvelope(data);
}

/**
 * PATCH /condition-reports/{id}
 * Update the status and/or resolution of a condition report
 */
export async function resolveConditionReport(
  id: string,
  input: ResolveReportInput
): Promise<ConditionReportResponse> {
  const response = await fetch(`${API_BASE}/condition-reports/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      status: input.status,
      ...(input.resolution && { resolution: input.resolution }),
    }),
  });

  const data: ApiEnvelope<ConditionReportResponse> = await response.json();
  return unwrapEnvelope(data);
}