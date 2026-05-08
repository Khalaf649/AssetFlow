import { User, UpdateRoleInput } from "../schemas/users-schemas";
import { UserFilters } from "../schemas/filter-schema";

const API_BASE_URL = "http://localhost:8080/api/v1";

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

export async function fetchUsers(
  token: string,
  filters: UserFilters,
): Promise<PaginatedResponse<User>> {
  const params = new URLSearchParams();
  params.append("page", String(Math.max(0, filters.page - 1))); // Convert 1-indexed to 0-indexed
  params.append("size", String(filters.size));
  if (filters.role) params.append("role", filters.role);
  if (filters.q) params.append("q", filters.q);

  const response = await fetch(`${API_BASE_URL}/users?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData: ApiResponse<never> = await response.json();
    throw new ApiError(
      errorData.message,
      errorData.error?.code || "FETCH_USERS_FAILED",
      errorData.error?.details,
    );
  }

  return unwrapResponse<PaginatedResponse<User>>(response);
}

export async function fetchUser(token: string, id: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData: ApiResponse<never> = await response.json();
    throw new ApiError(
      errorData.message,
      errorData.error?.code || "FETCH_USER_FAILED",
      errorData.error?.details,
    );
  }

  return unwrapResponse<User>(response);
}

export async function updateUserRole(
  token: string,
  id: string,
  input: UpdateRoleInput,
): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${id}/role`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorData: ApiResponse<never> = await response.json();
    throw new ApiError(
      errorData.message,
      errorData.error?.code || "UPDATE_ROLE_FAILED",
      errorData.error?.details,
    );
  }

  return unwrapResponse<User>(response);
}

export async function deleteUser(token: string, id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData: ApiResponse<never> = await response.json();
    throw new ApiError(
      errorData.message,
      errorData.error?.code || "DELETE_USER_FAILED",
      errorData.error?.details,
    );
  }
}

export type UserListItem = User;
