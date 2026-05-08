import { apiFetch } from "@/src/lib/api-client";

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
  suggestedAction: "REASSIGN_AS_SPARE" | "DECOMMISSION" | "RENEW_WARRANTY";
}

export interface UsageReportParams {
  from?: string;
  to?: string;
  type?: string;
  userId?: string;
}

// ─── API Functions ────────────────────────────────────────────────────────────

/** GET /reports/dashboard */
export async function fetchDashboardStats(
  token: string,
): Promise<DashboardStats> {
  return apiFetch<DashboardStats>("/reports/dashboard", { token });
}

/** GET /reports/usage */
export async function fetchUsageReport(
  token: string,
  params: UsageReportParams,
): Promise<UsageReport> {
  const url = new URLSearchParams();
  if (params.from) url.append("from", params.from);
  if (params.to) url.append("to", params.to);
  if (params.type) url.append("type", params.type);
  if (params.userId) url.append("userId", params.userId);

  return apiFetch<UsageReport>(`/reports/usage?${url.toString()}`, { token });
}

/** GET /reports/warranty-expiry */
export async function fetchWarrantyExpiry(
  token: string,
  daysAhead: number = 30,
): Promise<WarrantyAsset[]> {
  return apiFetch<WarrantyAsset[]>(
    `/reports/warranty-expiry?daysAhead=${daysAhead}`,
    { token },
  );
}