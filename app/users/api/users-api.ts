import { apiFetch, ApiError, PaginatedResponse } from "@/src/lib/api-client";
import { User, UpdateRoleInput } from "../schemas/users-schemas";
import { UserFilters } from "../schemas/filter-schema";

export async function fetchUsers(
  token: string,
  filters: UserFilters,
): Promise<PaginatedResponse<User>> {
  const params = new URLSearchParams();
  params.append("page", String(Math.max(0, filters.page - 1))); // Convert 1-indexed to 0-indexed
  params.append("size", String(filters.size));
  if (filters.role) params.append("role", filters.role);
  if (filters.q) params.append("q", filters.q);

  return apiFetch<PaginatedResponse<User>>(`/users?${params.toString()}`, {
    token,
  });
}

export async function fetchUser(token: string, id: string): Promise<User> {
  return apiFetch<User>(`/users/${id}`, { token });
}

export async function updateUserRole(
  token: string,
  id: string,
  input: UpdateRoleInput,
): Promise<User> {
  return apiFetch<User>(`/users/${id}/role`, {
    method: "PATCH",
    token,
    body: JSON.stringify(input),
  });
}

export async function deleteUser(token: string, id: string): Promise<void> {
  return apiFetch<void>(`/users/${id}`, {
    method: "DELETE",
    token,
  });
}

export { ApiError };
export type UserListItem = User;
