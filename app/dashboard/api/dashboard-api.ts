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

interface DashboardReport {
  totalAssets: number;
  byType: {
    LAPTOP: number;
    MONITOR: number;
    ACCESSORY: number;
  };
  byStatus: {
    AVAILABLE: number;
    ASSIGNED: number;
    UNDER_REPAIR: number;
    DECOMMISSIONED: number;
  };
  warrantyExpiringIn30Days: number;
  openConditionReports: number;
}

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface NotificationsResponse {
  items: Notification[];
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
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

export async function fetchDashboardReports(
  token: string,
): Promise<DashboardReport> {
  const response = await fetch(`${API_BASE_URL}/reports/dashboard`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData: ApiResponse<never> = await response.json();
    throw new ApiError(
      errorData.message,
      errorData.error?.code || "FETCH_FAILED",
      errorData.error?.details,
    );
  }

  return unwrapResponse<DashboardReport>(response);
}

export async function fetchNotifications(
  token: string,
): Promise<NotificationsResponse> {
  const response = await fetch(`${API_BASE_URL}/notifications`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData: ApiResponse<never> = await response.json();
    throw new ApiError(
      errorData.message,
      errorData.error?.code || "FETCH_FAILED",
      errorData.error?.details,
    );
  }

  return unwrapResponse<NotificationsResponse>(response);
}

export async function markNotificationRead(
  token: string,
  notificationId: string,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/notifications/${notificationId}/read`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const errorData: ApiResponse<never> = await response.json();
    throw new ApiError(
      errorData.message,
      errorData.error?.code || "UPDATE_FAILED",
      errorData.error?.details,
    );
  }
}

export { ApiError };
