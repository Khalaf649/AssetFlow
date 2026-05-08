import {
  Asset,
  AssetFormInput,
  Allocation,
  AllocationInput,
  ConditionReport,
} from "../schemas/asset-schemas";
import { AssetFilters } from "../schemas/asset-filter-schema";

const API_BASE_URL = "http://localhost:8080/api/v1";

// ── Shared envelope types (mirrors users-api.ts) ───────────────────
interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: Array<{ field: string; message: string }>;
  };
}

interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export class ApiError extends Error {
  constructor(
    public message: string,
    public code: string,
    public details?: Array<{ field: string; message: string }>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function unwrapResponse<T>(response: Response): Promise<T> {
  const data: ApiResponse<T> = await response.json();
  if (!data.success) {
    throw new ApiError(
      data.message,
      data.error?.code || "UNKNOWN_ERROR",
      data.error?.details,
    );
  }
  return data.data as T;
}

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

// ── Asset detail (with embedded allocations / condition-reports) ────
export interface AssetDetail extends Asset {
  allocationHistory?: Allocation[];
  conditionReports?: ConditionReport[];
}

// ── GET /assets ────────────────────────────────────────────────────
export async function fetchAssets(
  token: string,
  filters: AssetFilters,
): Promise<PaginatedResponse<Asset>> {
  const params = new URLSearchParams();
  params.append("page", String(Math.max(0, filters.page - 1))); // 1-indexed → 0-indexed
  params.append("size", String(filters.size));
  if (filters.type) params.append("type", filters.type);
  if (filters.status) params.append("status", filters.status);
  if (filters.brand) params.append("brand", filters.brand);
  if (filters.assignedUserId)
    params.append("assignedUserId", filters.assignedUserId);
  if (filters.warrantyExpiresBefore)
    params.append("warrantyExpiresBefore", filters.warrantyExpiresBefore);
  if (filters.q) params.append("q", filters.q);

  const response = await fetch(`${API_BASE_URL}/assets?${params.toString()}`, {
    headers: authHeaders(token),
  });

  if (!response.ok) {
    const errorData: ApiResponse<never> = await response.json();
    throw new ApiError(
      errorData.message,
      errorData.error?.code || "FETCH_ASSETS_FAILED",
      errorData.error?.details,
    );
  }

  return unwrapResponse<PaginatedResponse<Asset>>(response);
}

// ── POST /assets ───────────────────────────────────────────────────
export async function createAsset(
  token: string,
  input: AssetFormInput,
): Promise<Asset> {
  const response = await fetch(`${API_BASE_URL}/assets`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorData: ApiResponse<never> = await response.json();
    throw new ApiError(
      errorData.message,
      errorData.error?.code || "CREATE_ASSET_FAILED",
      errorData.error?.details,
    );
  }

  return unwrapResponse<Asset>(response);
}

// ── GET /assets/{id} ───────────────────────────────────────────────
export async function fetchAsset(
  token: string,
  id: string,
): Promise<AssetDetail> {
  const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
    headers: authHeaders(token),
  });

  if (!response.ok) {
    const errorData: ApiResponse<never> = await response.json();
    throw new ApiError(
      errorData.message,
      errorData.error?.code || "FETCH_ASSET_FAILED",
      errorData.error?.details,
    );
  }

  return unwrapResponse<AssetDetail>(response);
}

// ── PUT /assets/{id} ───────────────────────────────────────────────
export async function updateAsset(
  token: string,
  id: string,
  input: AssetFormInput,
): Promise<Asset> {
  const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorData: ApiResponse<never> = await response.json();
    throw new ApiError(
      errorData.message,
      errorData.error?.code || "UPDATE_ASSET_FAILED",
      errorData.error?.details,
    );
  }

  return unwrapResponse<Asset>(response);
}

// ── DELETE /assets/{id} ────────────────────────────────────────────
export async function deleteAsset(token: string, id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });

  if (!response.ok) {
    const errorData: ApiResponse<never> = await response.json();
    throw new ApiError(
      errorData.message,
      errorData.error?.code || "DELETE_ASSET_FAILED",
      errorData.error?.details,
    );
  }
}

// ── GET /assets/spare-laptops ──────────────────────────────────────
export async function fetchSpareLaptops(token: string): Promise<Asset[]> {
  const response = await fetch(`${API_BASE_URL}/assets/spare-laptops`, {
    headers: authHeaders(token),
  });

  if (!response.ok) {
    const errorData: ApiResponse<never> = await response.json();
    throw new ApiError(
      errorData.message,
      errorData.error?.code || "FETCH_SPARE_LAPTOPS_FAILED",
      errorData.error?.details,
    );
  }

  return unwrapResponse<Asset[]>(response);
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

  const response = await fetch(
    `${API_BASE_URL}/assets/search?${params.toString()}`,
    {
      headers: authHeaders(token),
    },
  );

  if (!response.ok) {
    const errorData: ApiResponse<never> = await response.json();
    throw new ApiError(
      errorData.message,
      errorData.error?.code || "SEARCH_ASSETS_FAILED",
      errorData.error?.details,
    );
  }

  return unwrapResponse<PaginatedResponse<Asset>>(response);
}

// ── GET /assets/{id}/allocations ───────────────────────────────────
export async function fetchAssetAllocations(
  token: string,
  assetId: string,
): Promise<Allocation[]> {
  const response = await fetch(
    `${API_BASE_URL}/assets/${assetId}/allocations`,
    {
      headers: authHeaders(token),
    },
  );

  if (!response.ok) {
    const errorData: ApiResponse<never> = await response.json();
    throw new ApiError(
      errorData.message,
      errorData.error?.code || "FETCH_ALLOCATIONS_FAILED",
      errorData.error?.details,
    );
  }

  return unwrapResponse<Allocation[]>(response);
}

// ── POST /assets/{id}/allocations ──────────────────────────────────
export async function assignAsset(
  token: string,
  assetId: string,
  input: AllocationInput,
): Promise<Allocation> {
  const response = await fetch(
    `${API_BASE_URL}/assets/${assetId}/allocations`,
    {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(input),
    },
  );

  if (!response.ok) {
    const errorData: ApiResponse<never> = await response.json();
    throw new ApiError(
      errorData.message,
      errorData.error?.code || "ASSIGN_ASSET_FAILED",
      errorData.error?.details,
    );
  }

  return unwrapResponse<Allocation>(response);
}

// ── DELETE /assets/{id}/allocations ────────────────────────────────
export async function returnAsset(
  token: string,
  assetId: string,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/assets/${assetId}/allocations`,
    {
      method: "DELETE",
      headers: authHeaders(token),
    },
  );

  if (!response.ok) {
    const errorData: ApiResponse<never> = await response.json();
    throw new ApiError(
      errorData.message,
      errorData.error?.code || "RETURN_ASSET_FAILED",
      errorData.error?.details,
    );
  }
}
