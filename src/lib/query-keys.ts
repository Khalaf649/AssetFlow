// ── Centralised Query Key Factory ──────────────────────────────────
// Eliminates hardcoded strings scattered across 15+ hook files.

import type { UserFilters } from "@/app/users/schemas/filter-schema";
import type { AssetFilters } from "@/app/assets/schemas/asset-filter-schema";

export const queryKeys = {
  // ── Users ─────────────────────────────────────────────────────
  users: {
    all: ["users"] as const,
    list: (filters: UserFilters) => ["users", filters] as const,
    detail: (id: string) => ["user", id] as const,
  },

  // ── Assets ────────────────────────────────────────────────────
  assets: {
    all: ["assets"] as const,
    list: (filters: AssetFilters) => ["assets", filters] as const,
    detail: (id: string) => ["asset", id] as const,
    search: (filters: AssetFilters & { warrantyExpired?: boolean }) =>
      ["asset-search", filters] as const,
    spareLaptops: ["spare-laptops"] as const,
    allocations: (assetId: string) =>
      ["asset-allocations", assetId] as const,
  },

  // ── Dashboard ─────────────────────────────────────────────────
  dashboard: {
    reports: ["dashboardReports"] as const,
  },

  // ── Notifications ─────────────────────────────────────────────
  notifications: {
    all: ["notifications"] as const,
  },
} as const;
