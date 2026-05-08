// ── Shared API Client ──────────────────────────────────────────────
// Single source of truth for API_BASE_URL, ApiError, ApiResponse,
// PaginatedResponse, and the apiFetch wrapper.

export const API_BASE_URL = "http://localhost:8080/api/v1";

// ── Response Envelope ──────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: Array<{ field: string; message: string }>;
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

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
  });

  // DELETE with 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

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
