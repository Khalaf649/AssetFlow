import { z } from "zod";

export const assetFilterSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(10),
  type: z.enum(["LAPTOP", "MONITOR", "ACCESSORY"]).optional(),
  status: z
    .enum(["AVAILABLE", "ASSIGNED", "UNDER_REPAIR", "DECOMMISSIONED"])
    .optional(),
  brand: z.string().optional(),
  assignedUserId: z.string().optional(),
  warrantyExpiresBefore: z.string().optional(),
  q: z.string().optional(),
});

export type AssetFilters = z.infer<typeof assetFilterSchema>;
