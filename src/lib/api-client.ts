// ── Shared API Client ──────────────────────────────────────────────
// Single source of truth for API_BASE_URL, ApiError, ApiResponse,
// PaginatedResponse, and the apiFetch wrapper.

export const API_BASE_URL = " http://167.172.102.40/api/v1";

// ── Response Envelope ──────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: Array<{ field: string; issue: string }>;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

// ── ApiError ───────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(
    public override message: string,
    public code: string,
    public status: number,
    public details?: Array<{ field: string; message: string }>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ── Core fetch wrapper ─────────────────────────────────────────────
// Handles auth headers, envelope unwrapping, and error parsing.
export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {},
): Promise<T> {
  const { token, headers: extraHeaders, ...fetchOptions } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...extraHeaders,
  };

  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...fetchOptions,
      headers,
    });
  } catch {
    throw new ApiError(
      "Network error. Please check your connection and try again.",
      "NETWORK_ERROR",
      0,
    );
  }

  // DELETE with 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  let data: ApiResponse<T>;
  try {
    data = await response.json();
  } catch {
    throw new ApiError(
      "Unexpected server response. Please try again later.",
      "PARSE_ERROR",
      response.status,
    );
  }

  if (!data.success) {
    // Map server's { field, issue } → client's { field, message }
    const mappedDetails = data.error?.details?.map((d) => ({
      field: d.field,
      message: d.issue,
    }));

    throw new ApiError(
      data.message,
      data.error?.code || "UNKNOWN_ERROR",
      data.status || response.status,
      mappedDetails,
    );
  }

  return data.data as T;
}
