import { getAuthToken } from '@/app/auth/api/auth-api';

const API_BASE = 'http://localhost:8080/api/v1';

function getAuthHeaders() {
  const token = getAuthToken();
  if (!token) throw new Error('Missing authentication token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

interface ApiEnvelope<T> {
  success: boolean;
  status: number;
  message: string;
  data?: T;
  error?: { code: string; details?: Array<{ field: string; message: string }> };
}

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

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalAssets: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  warrantyExpiringIn30Days: number;
  openConditionReports: number;
}

export interface UsageReport {
  totalAllocations: number;
  averageAllocationDays: number;
  topUsers: { userId: string; name: string; allocations: number }[];
  conditionReportsByMonth: { month: string; count: number }[];
}

export interface WarrantyAsset {
  id: string;
  type: string;
  brand: string;
  model: string;
  serialNumber: string;
  warrantyExpirationDate: string;
  daysUntilExpiry: number;
  suggestedAction: 'REASSIGN_AS_SPARE' | 'DECOMMISSION' | 'RENEW_WARRANTY';
}

export interface UsageReportParams {
  from?: string;
  to?: string;
  type?: string;
  userId?: string;
}

// ─── API Functions ────────────────────────────────────────────────────────────

/** GET /reports/dashboard */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await fetch(`${API_BASE}/reports/dashboard`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const data: ApiEnvelope<DashboardStats> = await response.json();
  return unwrapEnvelope(data);
}

/** GET /reports/usage */
export async function fetchUsageReport(params: UsageReportParams): Promise<UsageReport> {
  const url = new URL(`${API_BASE}/reports/usage`);
  if (params.from) url.searchParams.append('from', params.from);
  if (params.to) url.searchParams.append('to', params.to);
  if (params.type) url.searchParams.append('type', params.type);
  if (params.userId) url.searchParams.append('userId', params.userId);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const data: ApiEnvelope<UsageReport> = await response.json();
  return unwrapEnvelope(data);
}

/** GET /reports/warranty-expiry */
export async function fetchWarrantyExpiry(daysAhead: number = 30): Promise<WarrantyAsset[]> {
  const url = new URL(`${API_BASE}/reports/warranty-expiry`);
  url.searchParams.append('daysAhead', daysAhead.toString());

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const data: ApiEnvelope<WarrantyAsset[]> = await response.json();
  return unwrapEnvelope(data);
}