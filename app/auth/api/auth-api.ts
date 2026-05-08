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

class ApiError extends Error {
  constructor(
    message: string,
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

  if (!data.data) {
    throw new ApiError("No data in response", "NO_DATA");
  }

  return data.data;
}

export async function loginUser(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData: ApiResponse<never> = await response.json();
    throw new ApiError(
      errorData.message,
      errorData.error?.code || "LOGIN_FAILED",
      errorData.error?.details,
    );
  }

  return unwrapResponse<LoginResponse>(response);
}

function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('auth_token');
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const errorData: ApiResponse<never> = await response.json();
    throw new ApiError(
      errorData.message,
      errorData.error?.code || "REGISTER_FAILED",
      errorData.error?.details,
    );
  }

  return unwrapResponse<RegisterResponse>(response);
}

export { ApiError, getAuthToken };