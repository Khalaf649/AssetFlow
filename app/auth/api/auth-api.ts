import { apiFetch, ApiError } from "@/src/lib/api-client";

interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: string;
    name: string;
    role: "ADMIN" | "MANAGER" | "DEVELOPER";
  };
}

interface RegisterResponse {
  id: string;
  name: string;
  email: string;
}

export async function loginUser(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export { ApiError };
