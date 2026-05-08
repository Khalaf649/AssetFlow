import { z } from "zod";

// ── Enums ──────────────────────────────────────────────────────────
export const assetTypeEnum = z.enum(["LAPTOP", "MONITOR", "ACCESSORY"]);
export type AssetType = z.infer<typeof assetTypeEnum>;

export const assetStatusEnum = z.enum([
  "AVAILABLE",
  "ASSIGNED",
  "UNDER_REPAIR",
  "DECOMMISSIONED",
]);
export type AssetStatus = z.infer<typeof assetStatusEnum>;

// ── Asset (read shape from API) ────────────────────────────────────
export const assetSchema = z.object({
  id: z.string(),
  brand: z.string(),
  model: z.string(),
  serialNumber: z.string(),
  type: assetTypeEnum,
  status: assetStatusEnum,
  purchaseDate: z.string(),
  warrantyExpirationDate: z.string(),
  assignedTo: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable()
    .optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Asset = z.infer<typeof assetSchema>;

// ── Create / Update Form Schema ────────────────────────────────────
export const assetFormSchema = z
  .object({
    brand: z
      .string()
      .min(1, "Brand is required")
      .max(80, "Brand must be 80 characters or less"),
    model: z
      .string()
      .min(1, "Model is required")
      .max(120, "Model must be 120 characters or less"),
    serialNumber: z
      .string()
      .min(1, "Serial number is required")
      .max(100, "Serial number must be 100 characters or less"),
    type: assetTypeEnum,
    purchaseDate: z.string().min(1, "Purchase date is required"),
    warrantyExpirationDate: z
      .string()
      .min(1, "Warranty expiration date is required"),
  })
  .refine(
    (data) => {
      const purchase = new Date(data.purchaseDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return purchase <= today;
    },
    {
      message: "Purchase date cannot be in the future",
      path: ["purchaseDate"],
    },
  )
  .refine(
    (data) => {
      const purchase = new Date(data.purchaseDate);
      const warranty = new Date(data.warrantyExpirationDate);
      return warranty >= purchase;
    },
    {
      message: "Warranty expiration must be on or after the purchase date",
      path: ["warrantyExpirationDate"],
    },
  );

export type AssetFormInput = z.infer<typeof assetFormSchema>;

// ── Allocation ─────────────────────────────────────────────────────
export const allocationSchema = z.object({
  userId: z.string().min(1, "User is required"),
});

export type AllocationInput = z.infer<typeof allocationSchema>;

export interface Allocation {
  id: string;
  user: { id: string; name: string };
  assignedAt: string;
  returnedAt: string | null;
}

// ── Condition Report (read shape, nested in asset detail) ──────────
export interface ConditionReport {
  id: string;
  issue: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  reportedBy: { id: string; name: string };
  createdAt: string;
  resolution?: string;
}
