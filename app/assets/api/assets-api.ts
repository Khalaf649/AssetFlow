import { apiFetch, ApiError, PaginatedResponse } from "@/src/lib/api-client";
import {
  Asset,
  AssetFormInput,
  Allocation,
  AllocationInput,
  ConditionReport,
} from "../schemas/asset-schemas";
import { ConditionReportCreateInput } from "../schemas/condition-report-schemas";
import { AssetFilters } from "../schemas/asset-filter-schema";

// ── Asset detail (with embedded allocations / condition-reports) ────
export interface AssetDetail extends Asset {
  allocationHistory?: Allocation[];
  conditionReports?: ConditionReport[];
}

// ── Helper: build query string from filters ────────────────────────
function buildAssetParams(filters: AssetFilters): string {
  const params = new URLSearchParams();
  params.append("page", String(Math.max(0, filters.page - 1)));
  params.append("size", String(filters.size));
  if (filters.type) params.append("type", filters.type);
  if (filters.status) params.append("status", filters.status);
  if (filters.brand) params.append("brand", filters.brand);
  if (filters.assignedUserId)
    params.append("assignedUserId", filters.assignedUserId);
  if (filters.warrantyExpiresBefore)
    params.append("warrantyExpiresBefore", filters.warrantyExpiresBefore);
  if (filters.q) params.append("q", filters.q);
  return params.toString();
}

// ── GET /assets ────────────────────────────────────────────────────
export async function fetchAssets(
  token: string,
  filters: AssetFilters,
): Promise<PaginatedResponse<Asset>> {
  console.log("fetchAssets called with filters:", filters);
  return apiFetch<PaginatedResponse<Asset>>(
    `/assets?${buildAssetParams(filters)}`,
    { token },
  );
}

// ── POST /assets ───────────────────────────────────────────────────
export async function createAsset(
  token: string,
  input: AssetFormInput,
): Promise<Asset> {
  return apiFetch<Asset>("/assets", {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
}

// ── GET /assets/{id} ───────────────────────────────────────────────
export async function fetchAsset(
  token: string,
  id: string,
): Promise<AssetDetail> {
  return apiFetch<AssetDetail>(`/assets/${id}`, { token });
}

// ── PUT /assets/{id} ───────────────────────────────────────────────
export async function updateAsset(
  token: string,
  id: string,
  input: AssetFormInput,
): Promise<Asset> {
  return apiFetch<Asset>(`/assets/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(input),
  });
}

// ── DELETE /assets/{id} ────────────────────────────────────────────
export async function deleteAsset(token: string, id: string): Promise<void> {
  return apiFetch<void>(`/assets/${id}`, {
    method: "DELETE",
    token,
  });
}

// ── GET /assets/spare-laptops ──────────────────────────────────────
export async function fetchSpareLaptops(token: string): Promise<Asset[]> {
  return apiFetch<Asset[]>("/assets/spare-laptops", { token });
}

// ── GET /assets/search ─────────────────────────────────────────────
export async function searchAssets(
  token: string,
  filters: AssetFilters & { warrantyExpired?: boolean },
): Promise<PaginatedResponse<Asset>> {
  const params = new URLSearchParams();
  params.append("page", String(Math.max(0, filters.page - 1)));
  params.append("size", String(filters.size));
  if (filters.q) params.append("q", filters.q);
  if (filters.type) params.append("type", filters.type);
  if (filters.status) params.append("status", filters.status);
  if (filters.brand) params.append("brand", filters.brand);
  if (filters.assignedUserId)
    params.append("assignedUserId", filters.assignedUserId);
  if (filters.warrantyExpired !== undefined)
    params.append("warrantyExpired", String(filters.warrantyExpired));

  return apiFetch<PaginatedResponse<Asset>>(
    `/assets/search?${params.toString()}`,
    { token },
  );
}

// ── GET /assets/{id}/allocations ───────────────────────────────────
export async function fetchAssetAllocations(
  token: string,
  assetId: string,
): Promise<Allocation[]> {
  return apiFetch<Allocation[]>(`/assets/${assetId}/allocations`, { token });
}

// ── GET /assets/{assetId}/condition-reports ───────────────────────

// ── GET /condition-reports with asset filter ––––––––––––
export async function fetchAssetConditionReports(
  token: string,
  assetId: string,
): Promise<ConditionReport[]> {
  const params = new URLSearchParams();
  params.append("assetId", assetId);
  const response = await apiFetch<PaginatedResponse<ConditionReport>>(
    `/condition-reports?${params.toString()}`,
    { token },
  );
  return response.items;
}
// ── POST /assets/{id}/allocations ──────────────────────────────────
export async function assignAsset(
  token: string,
  assetId: string,
  input: AllocationInput,
): Promise<Allocation> {
  return apiFetch<Allocation>(`/assets/${assetId}/allocations`, {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
}

// ── DELETE /assets/{id}/allocations ────────────────────────────────
export async function returnAsset(
  token: string,
  assetId: string,
): Promise<void> {
  return apiFetch<void>(`/assets/${assetId}/allocations`, {
    method: "DELETE",
    token,
  });
}

// ── POST /assets/{id}/condition-reports ───────────────────────────
export async function createConditionReport(
  token: string,
  assetId: string,
  input: ConditionReportCreateInput,
): Promise<ConditionReport> {
  return apiFetch<ConditionReport>(`/assets/${assetId}/condition-reports`, {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
}

export { ApiError };
